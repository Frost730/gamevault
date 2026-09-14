import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  PlayCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Target,
  Settings,
  Plus,
  Bookmark,
} from 'lucide-react';
import { useGames } from '../../context/GameContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { games, openAddModal } = useGames();

  const playingCount = games.filter((g) => g.status === 'Playing').length;
  const completedCount = games.filter((g) => g.status === 'Completed').length;
  const backlogCount = games.filter((g) => g.status === 'Backlog').length;
  const wishlistCount = games.filter((g) => g.status === 'Wishlist').length;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'My Library', path: '/library', icon: Gamepad2, badge: games.length },
    { label: 'Currently Playing', path: '/playing', icon: PlayCircle, badge: playingCount, badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    { label: 'Completed', path: '/completed', icon: CheckCircle2, badge: completedCount, badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
    { label: 'Backlog', path: '/backlog', icon: Clock, badge: backlogCount, badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    { label: 'Wishlist', path: '/wishlist', icon: Bookmark, badge: wishlistCount, badgeColor: 'bg-pink-500/15 text-pink-600 dark:text-pink-400' },
    { label: 'Statistics', path: '/statistics', icon: BarChart3 },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-white dark:bg-dark-900/95 border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between shrink-0 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div>
        <div className="p-6 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center shadow-lg shadow-brand-500/25 shrink-0">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-wider text-slate-900 dark:text-white">
              GAME<span className="text-brand-500 dark:text-brand-400">VAULT</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              PLAYER HUB & DASHBOARD
            </p>
          </div>
        </div>

        {/* Quick Add Game Action */}
        <div className="px-5 mb-4">
          <button
            type="button"
            onClick={() => {
              openAddModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/10 dark:bg-brand-600/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-dark-950/40">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Local Browser Storage</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">v1.1</span>
        </div>
      </div>
    </aside>
  );
};
