import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import { GoalCard } from '../components/goals/GoalCard';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Target, Plus, Trophy, Sparkles } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const {
    goals,
    incrementGoalProgress,
    openAddGoalModal,
    openEditGoalModal,
    deleteGoal,
  } = useGoals();

  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const completedGoalsCount = goals.filter((g) => g.current >= g.target).length;
  const inProgressGoalsCount = goals.length - completedGoalsCount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Gaming Goals & Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set ambitious targets, conquer backlogs, and track your achievements
          </p>
        </div>

        <button
          onClick={openAddGoalModal}
          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shrink-0 transition-all shadow-lg shadow-brand-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Active Goals</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {inProgressGoalsCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Accomplished</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-accent-emerald mt-1">
              {completedGoalsCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-accent-emerald border border-emerald-500/20">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Success Rate</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-accent-cyan border border-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-200">No active gaming goals</h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Create your first challenge—such as completing 5 RPGs or logging 50 hours of gameplay.
          </p>
          <button
            onClick={openAddGoalModal}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onIncrement={(id, amount) => incrementGoalProgress(id, amount)}
              onEdit={(g) => openEditGoalModal(g)}
              onDelete={(id) => setGoalToDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Goal Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteGoal(goalToDelete);
            setGoalToDelete(null);
          }
        }}
        title="Delete Goal"
        message="Are you sure you want to delete this gaming goal? All tracked progress will be removed."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
