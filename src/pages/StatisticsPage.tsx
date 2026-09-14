import React from 'react';
import { useGames } from '../context/GameContext';
import {
  calculateDashboardStats,
  getGamesByPlatform,
  getGamesByGenre,
  getGamesByStatus,
  getPlaytimeByGenre,
  getRatingDistribution,
} from '../utils/calculations';
import { PlatformDistributionChart } from '../components/charts/PlatformDistributionChart';
import { GenreDistributionChart } from '../components/charts/GenreDistributionChart';
import { StatusDistributionChart } from '../components/charts/StatusDistributionChart';
import { RatingDistributionChart } from '../components/charts/RatingDistributionChart';
import { PlaytimeByGenreChart } from '../components/charts/PlaytimeByGenreChart';
import { StatCard } from '../components/common/StatCard';
import { formatPlaytime } from '../utils/formatters';
import {
  Gamepad2,
  Clock,
  Star,
  CheckCircle2,
  PieChart,
  BarChart,
  Award,
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { games } = useGames();

  const stats = calculateDashboardStats(games);
  const platformData = getGamesByPlatform(games);
  const genreData = getGamesByGenre(games);
  const statusData = getGamesByStatus(games);
  const playtimeGenreData = getPlaytimeByGenre(games);
  const ratingDist = getRatingDistribution(games);

  // Unfinished vs Completed calculation
  const completedCount = stats.completedCount;
  const unfinishedCount = Math.max(0, stats.totalGames - completedCount);
  const completionRate = stats.totalGames > 0 ? Math.round((completedCount / stats.totalGames) * 100) : 0;

  // Most played game
  const mostPlayedGame = [...games].sort((a, b) => b.playtime - a.playtime)[0];
  // Highest rated game
  const highestRatedGame = [...games].filter(g => g.rating > 0).sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Gaming Statistics & Insights
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time analytics and distributions calculated from your active library
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Playtime"
          value={formatPlaytime(stats.totalPlaytime)}
          subtext="Across all platforms"
          icon={Clock}
          color="cyan"
        />
        <StatCard
          label="Average Rating"
          value={stats.averageRating > 0 ? `${stats.averageRating} / 10` : '—'}
          subtext="Vault satisfaction score"
          icon={Star}
          color="amber"
        />
        <StatCard
          label="Completion Ratio"
          value={`${completionRate}%`}
          subtext={`${completedCount} of ${stats.totalGames} completed`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Library Size"
          value={`${stats.totalGames} Titles`}
          subtext={`${stats.playingCount} in active rotation`}
          icon={Gamepad2}
          color="brand"
        />
      </div>

      {/* Top Highlights Spotlight Card */}
      {(mostPlayedGame || highestRatedGame) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mostPlayedGame && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-accent-cyan border border-cyan-500/20 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                  Most Played Title
                </p>
                <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {mostPlayedGame.title}
                </h4>
                <p className="text-xs text-cyan-600 dark:text-accent-cyan font-semibold mt-0.5">
                  {formatPlaytime(mostPlayedGame.playtime)} • {mostPlayedGame.platform}
                </p>
              </div>
            </div>
          )}

          {highestRatedGame && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                  Top Rated Title
                </p>
                <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {highestRatedGame.title}
                </h4>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                  ★ {highestRatedGame.rating} / 10 • {highestRatedGame.genre}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-500" />
              Games by Status
            </h3>
          </div>
          <StatusDistributionChart data={statusData} />
        </div>

        {/* Platform Distribution */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-500" />
              Games by Platform
            </h3>
          </div>
          <PlatformDistributionChart data={platformData} />
        </div>

        {/* Playtime by Genre */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-cyan-600 dark:text-accent-cyan" />
              Playtime by Genre (Hours)
            </h3>
          </div>
          <PlaytimeByGenreChart data={playtimeGenreData} />
        </div>

        {/* Genre Count Distribution */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-brand-500" />
              Games by Genre
            </h3>
          </div>
          <GenreDistributionChart data={genreData} />
        </div>

        {/* Rating Distribution */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Rating Distribution
            </h3>
          </div>
          <RatingDistributionChart data={ratingDist} />
        </div>

        {/* Completed vs Unfinished Visual Card */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              Completed vs Unfinished
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Track how effectively you conquer your game catalog without letting the backlog pile up.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Completed Campaigns</span>
                  <span>{completedCount} titles</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalGames > 0 ? (completedCount / stats.totalGames) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-amber-600 dark:text-amber-400">Unfinished / In Backlog</span>
                  <span>{unfinishedCount} titles</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalGames > 0 ? (unfinishedCount / stats.totalGames) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall completion rate:</span>
            <span className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
              {completionRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
