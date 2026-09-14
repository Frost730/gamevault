import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Goal } from '../types';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goalData: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementGoalProgress: (id: string, amount?: number) => void;
  refreshGoals: () => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  editingGoal: Goal | null;
  openAddGoalModal: () => void;
  openEditGoalModal: (goal: Goal) => void;
  closeGoalModal: () => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const loadGoals = useCallback(() => {
    const data = storageService.getGoals();
    setGoals(data);
    // Automatically check for due deadlines and notify if permission is granted
    notificationService.checkDueGoalsAndNotify(data);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      ...goalData,
      id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    const updated = [newGoal, ...goals];
    storageService.saveGoals(updated);
    setGoals(updated);

    // If permission is already granted, send confirmation notification
    if (notificationService.getPermission() === 'granted') {
      notificationService.sendNotification(`🎯 Goal Created: ${newGoal.title}`, {
        body: `Target set: ${newGoal.target} ${newGoal.type === 'playtime_hours' ? 'hours' : 'games'}. Deadline: ${newGoal.deadline || 'No deadline'}`,
      });
    }

    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const merged = { ...g, ...updates };
        // Check if goal was newly achieved!
        if (merged.current >= merged.target && g.current < g.target) {
          notificationService.sendNotification(`🏆 Milestone Achieved!`, {
            body: `Congratulations! You conquered your goal: "${merged.title}"!`,
          });
        }
        return merged;
      }
      return g;
    });
    storageService.saveGoals(updated);
    setGoals(updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    storageService.saveGoals(updated);
    setGoals(updated);
  };

  const incrementGoalProgress = (id: string, amount: number = 1) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      const nextProgress = Math.min(goal.target, goal.current + amount);
      updateGoal(id, { current: nextProgress });
    }
  };

  const openAddGoalModal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const openEditGoalModal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const closeGoalModal = () => {
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        incrementGoalProgress,
        refreshGoals: loadGoals,
        isGoalModalOpen,
        setIsGoalModalOpen,
        editingGoal,
        openAddGoalModal,
        openEditGoalModal,
        closeGoalModal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
