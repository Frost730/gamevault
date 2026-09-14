import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useGames } from '../../context/GameContext';
import { useGoals } from '../../context/GoalContext';
import { GameFormModal } from '../games/GameFormModal';
import { GameDetailsModal } from '../games/GameDetailsModal';
import { GoalFormModal } from '../goals/GoalFormModal';
import { MobileBottomNav } from './MobileBottomNav';
import { X } from 'lucide-react';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/library': 'My Library',
      '/playing': 'Currently Playing',
      '/completed': 'Completed',
      '/backlog': 'Backlog',
      '/wishlist': 'Wishlist',
      '/statistics': 'Statistics',
      '/goals': 'Goals',
      '/settings': 'Settings',
    };
    const current = titles[location.pathname] || 'Dashboard';
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true);

    if (isStandalone) {
      document.title = current === 'Dashboard' ? 'GameVault' : current;
    } else {
      document.title = current === 'Dashboard' ? 'GameVault' : `${current} — GameVault`;
    }
  }, [location.pathname]);

  const {
    selectedGame,
    setSelectedGame,
    editingGame,
    isFormOpen,
    closeFormModal,
    addGame,
    updateGame,
    deleteGame,
    toggleFavorite,
    updateStatus,
    incrementPlaytime,
    updateCompletion,
    openEditModal,
  } = useGames();

  const {
    isGoalModalOpen,
    closeGoalModal,
    editingGoal,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useGoals();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Add/Edit Game Modal */}
      <GameFormModal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        onSubmit={(gameData) => {
          if (editingGame) {
            updateGame(editingGame.id, gameData);
          } else {
            addGame(gameData);
          }
        }}
        initialGame={editingGame}
      />

      {/* Global Game Details Modal */}
      <GameDetailsModal
        game={selectedGame}
        isOpen={Boolean(selectedGame)}
        onClose={() => setSelectedGame(null)}
        onEdit={(game) => openEditModal(game)}
        onDelete={(id) => deleteGame(id)}
        onToggleFavorite={(id) => toggleFavorite(id)}
        onUpdateStatus={(id, status) => updateStatus(id, status)}
        onIncrementPlaytime={(id, hours) => incrementPlaytime(id, hours)}
        onUpdateCompletion={(id, comp) => updateCompletion(id, comp)}
      />

      {/* Global Goal Form Modal */}
      <GoalFormModal
        isOpen={isGoalModalOpen}
        onClose={closeGoalModal}
        onSubmit={(goalData) => {
          if (editingGoal) {
            updateGoal(editingGoal.id, goalData);
          } else {
            addGoal(goalData);
          }
        }}
        onDelete={(id) => deleteGoal(id)}
        initialGoal={editingGoal}
      />
    </div>
  );
};
