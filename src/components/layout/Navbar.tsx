import React from 'react';
import { Menu, Sun, Moon, Plus, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGames } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { openAddModal } = useGames();
  const navigate = useNavigate();

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white/90 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30 flex items-center justify-between transition-colors duration-200">
      {/* Left Mobile Menu Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            GAME<span className="text-brand-500 dark:text-brand-400">VAULT</span>
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Game Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-brand-500/10 dark:bg-brand-600/20 hover:bg-brand-500/20 dark:hover:bg-brand-600/30 text-brand-600 dark:text-brand-300 border border-brand-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">New Game</span>
        </button>

        {/* Dark / Light Mode Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/50"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>
    </header>
  );
};
