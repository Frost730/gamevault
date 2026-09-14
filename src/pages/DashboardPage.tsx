import React from 'react';
import { useGames } from '../context/GameContext';
import { calculateDashboardStats } from '../utils/calculations';
import { StatCard } from '../components/common/StatCard';
import { GameCard } from '../components/games/GameCard';
import { GameCover } from '../components/common/GameCoverPlaceholder';
import { StatusBadge, PlatformBadge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { formatPlaytime } from '../utils/formatters';
import {
  Gamepad2,
  PlayCircle,
  CheckCircle2,
  Clock,
  Bookmark,
  Star,
  Flame,
  Plus,
  ArrowRight,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    games,
    setSelectedGame,
    toggleFavorite,
    incrementPlaytime,
    openAddModal,
  } = useGames();

  const navigate = useNavigate();
  const stats = calculateDashboardStats(games);

  // Sections
  const currentlyPlaying = games.filter((g) => g.status === 'Playing');
  
  // Hero featured continue playing game
  const continueHero = currentlyPlaying[0] || null;

  const recentlyPlayed = [...games]
    .filter((g) => g.lastPlayed)
    .sort((a, b) => new Date(b.lastPlayed!).getTime() - new Date(a.lastPlayed!).getTime())
    .slice(0, 4);

  const recentlyAdded = [...games]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 4);

  const favorites = games.filter((g) => g.favorite).slice(0, 4);

  const backlogQuickPicks = games.filter((g) => g.status === 'Backlog').slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner: Vibrant in light mode, sleek obsidian in dark mode */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-brand-500/10 dark:from-slate-900 dark:via-dark-900 dark:to-indigo-950 dark:border dark:border-slate-700/60 transition-all duration-300">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 dark:bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-400/20 dark:bg-accent-cyan/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 dark:bg-brand-500/20 border border-white/30 dark:border-brand-500/30 text-white dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-300 dark:text-amber-400" />
              Command Center
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, Commander
            </h2>
            <p className="text-xs sm:text-sm text-white/90 dark:text-slate-300 mt-2 leading-relaxed">
              Track your journey, clear your backlog, and celebrate every gaming milestone across your personal library.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-100 text-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 dark:text-white font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-95 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Game</span>
            </button>
            <button
              onClick={() => navigate('/library')}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm transition-colors border border-white/25"
            >
              <span>Explore Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid: 2 cols on mobile, 4 on tablet, 8 on wide desktops */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-4">
        <StatCard
          label="Total Games"
          value={stats.totalGames}
          subtext="In your personal vault"
          icon={Gamepad2}
          color="brand"
          onClick={() => navigate('/library')}
        />
        <StatCard
          label="Currently Playing"
          value={stats.playingCount}
          subtext="Active in rotation"
          icon={PlayCircle}
          color="emerald"
          onClick={() => navigate('/playing')}
        />
        <StatCard
          label="Completed"
          value={stats.completedCount}
          subtext="Finished campaigns"
          icon={CheckCircle2}
          color="indigo"
          onClick={() => navigate('/completed')}
        />
        <StatCard
          label="Backlog"
          value={stats.backlogCount}
          subtext="Waiting to be started"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/backlog')}
        />
        <StatCard
          label="Wishlist"
          value={stats.wishlistCount}
          subtext="Future acquisitions"
          icon={Bookmark}
          color="rose"
          onClick={() => navigate('/wishlist')}
        />
        <StatCard
          label="Total Playtime"
          value={formatPlaytime(stats.totalPlaytime)}
          subtext="Logged gaming hours"
          icon={Clock}
          color="cyan"
          onClick={() => navigate('/statistics')}
        />
        <StatCard
          label="Average Rating"
          value={stats.averageRating > 0 ? `${stats.averageRating} / 10` : '—'}
          subtext="Across rated titles"
          icon={Star}
          color="amber"
          onClick={() => navigate('/statistics')}
        />
        <StatCard
          label="Overall Progress"
          value={`${stats.completionPercentage}%`}
          subtext="Vault completion rate"
          icon={TrendingUp}
          color="brand"
          onClick={() => navigate('/statistics')}
        />
      </div>

      {/* Empty Library State when games.length === 0 */}
      {games.length === 0 && (
        <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            Your Game Library is Empty
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md">
            Start logging games you are currently playing, backlog titles, or wishlisted favorites to populate your personal dashboard and statistics.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/25 active:scale-95 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Game</span>
          </button>
        </div>
      )}

      {/* Continue Playing Hero Section */}
      {continueHero && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                Continue Playing
              </h3>
            </div>
            {currentlyPlaying.length > 1 && (
              <button
                onClick={() => navigate('/playing')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                View all ({currentlyPlaying.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Cover */}
              <div
                onClick={() => setSelectedGame(continueHero)}
                className="relative w-full lg:w-80 aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shrink-0 border border-slate-200 dark:border-slate-700/80 shadow-md"
              >
                <GameCover
                  coverUrl={continueHero.coverUrl}
                  title={continueHero.title}
                  genre={continueHero.genre}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <PlatformBadge platform={continueHero.platform} />
                </div>
              </div>

              {/* Information & Quick Session Bar */}
              <div className="flex-1 w-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status="Playing" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• {continueHero.genre}</span>
                  </div>
                  <h4
                    onClick={() => setSelectedGame(continueHero)}
                    className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                  >
                    {continueHero.title}
                  </h4>
                  {continueHero.notes && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      "{continueHero.notes}"
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Story / Campaign Progress</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{continueHero.completion}%</span>
                  </div>
                  <ProgressBar value={continueHero.completion} color="emerald" size="md" />
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                      <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>{formatPlaytime(continueHero.playtime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => incrementPlaytime(continueHero.id, 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log +1 Hour</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGame(continueHero)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors shadow-md shadow-brand-600/20 active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recently Played Section */}
      {recentlyPlayed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-accent-cyan" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                Recently Played
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyPlayed.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={(g) => setSelectedGame(g)}
                onToggleFavorite={(id, e) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                }}
                onQuickLogPlaytime={(id, hours, e) => {
                  e.stopPropagation();
                  incrementPlaytime(id, hours);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Favorites Spotlight */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                Favorite Highlights
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={(g) => setSelectedGame(g)}
                onToggleFavorite={(id, e) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                }}
                onQuickLogPlaytime={(id, hours, e) => {
                  e.stopPropagation();
                  incrementPlaytime(id, hours);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                Recently Added
              </h3>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Go to Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyAdded.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={(g) => setSelectedGame(g)}
                onToggleFavorite={(id, e) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                }}
                onQuickLogPlaytime={(id, hours, e) => {
                  e.stopPropagation();
                  incrementPlaytime(id, hours);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Backlog Quick Picks */}
      {backlogQuickPicks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                Next Up in Backlog
              </h3>
            </div>
            <button
              onClick={() => navigate('/backlog')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Manage Backlog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {backlogQuickPicks.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={(g) => setSelectedGame(g)}
                onToggleFavorite={(id, e) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
