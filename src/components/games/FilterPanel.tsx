import React from 'react';
import { FilterState, SortOption, LibraryViewMode, GameStatus, GamePlatform, GameGenre } from '../../types';
import { LayoutGrid, List, Heart, RotateCcw, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: LibraryViewMode;
  onViewModeChange: (mode: LibraryViewMode) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

const STATUS_OPTIONS: (GameStatus | 'All')[] = [
  'All',
  'Playing',
  'Completed',
  'Backlog',
  'Wishlist',
  'Paused',
  'Dropped',
];

const PLATFORM_OPTIONS: (GamePlatform | 'All')[] = [
  'All',
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Mobile',
  'Other',
];

const GENRE_OPTIONS: (GameGenre | 'All')[] = [
  'All',
  'Action',
  'Adventure',
  'RPG',
  'Shooter',
  'Horror',
  'Strategy',
  'Simulation',
  'Racing',
  'Sports',
  'Survival',
  'Sandbox',
  'Other',
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalFiltered,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.status !== 'All' ||
    filters.platform !== 'All' ||
    filters.genre !== 'All' ||
    filters.minRating > 0 ||
    filters.favoriteOnly;

  return (
    <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4">
      {/* Top row: Count, View Mode, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Filters & Sorting
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            {totalFiltered} {totalFiltered === 1 ? 'game' : 'games'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-dark-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-xs">
        {/* Status */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ ...filters, status: e.target.value as GameStatus | 'All' })
            }
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Platform</label>
          <select
            value={filters.platform}
            onChange={(e) =>
              onFilterChange({ ...filters, platform: e.target.value as GamePlatform | 'All' })
            }
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) =>
              onFilterChange({ ...filters, genre: e.target.value as GameGenre | 'All' })
            }
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Min Rating</label>
          <select
            value={filters.minRating}
            onChange={(e) =>
              onFilterChange({ ...filters, minRating: Number(e.target.value) })
            }
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value={0}>Any Rating</option>
            <option value={6}>6+ / 10</option>
            <option value={7}>7+ / 10</option>
            <option value={8}>8+ / 10</option>
            <option value={9}>9+ / 10</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="recently_added">Recently Added</option>
            <option value="recently_played">Recently Played</option>
            <option value="rating_desc">Highest Rating</option>
            <option value="playtime_desc">Most Playtime</option>
            <option value="completion_desc">Highest Completion</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>

        {/* Favorites only */}
        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={() =>
              onFilterChange({ ...filters, favoriteOnly: !filters.favoriteOnly })
            }
            className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-all ${
              filters.favoriteOnly
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'bg-slate-50 dark:bg-dark-950 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                filters.favoriteOnly ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span>Favorites</span>
          </button>
        </div>
      </div>
    </div>
  );
};
