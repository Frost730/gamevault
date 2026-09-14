import React, { useState, useMemo } from 'react';
import { useGames } from '../context/GameContext';
import { GameStatus, LibraryViewMode, SortOption } from '../types';
import { GameGrid } from '../components/games/GameGrid';
import { GameList } from '../components/games/GameList';
import { SearchBar } from '../components/games/SearchBar';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { storageService } from '../services/storageService';

interface FilteredGamesPageProps {
  status: GameStatus;
  title: string;
  subtitle: string;
  iconColor: string;
}

export const FilteredGamesPage: React.FC<FilteredGamesPageProps> = ({
  status,
  title,
  subtitle,
}) => {
  const {
    games,
    setSelectedGame,
    toggleFavorite,
    incrementPlaytime,
    openAddModal,
    openEditModal,
    deleteGame,
  } = useGames();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<LibraryViewMode>(() => {
    return storageService.getSettings().viewMode || 'grid';
  });
  const [sortBy, setSortBy] = useState<SortOption>('recently_played');
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  const filteredGames = useMemo(() => {
    let list = games.filter((g) => g.status === status);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((g) => {
        return (
          g.title.toLowerCase().includes(q) ||
          g.genre.toLowerCase().includes(q) ||
          g.tags?.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating_desc':
          return b.rating - a.rating;
        case 'playtime_desc':
          return b.playtime - a.playtime;
        case 'completion_desc':
          return b.completion - a.completion;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'recently_played':
        default: {
          const dateA = a.lastPlayed ? new Date(a.lastPlayed).getTime() : 0;
          const dateB = b.lastPlayed ? new Date(b.lastPlayed).getTime() : 0;
          return dateB - dateA;
        }
      }
    });

    return list;
  }, [games, status, searchQuery, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300 font-bold border border-brand-500/30">
              {filteredGames.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search in ${title.toLowerCase()}...`}
            className="w-full sm:w-72"
          />
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shrink-0 transition-all shadow-md shadow-brand-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-panel px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="recently_played">Recently Played</option>
            <option value="rating_desc">Highest Rating</option>
            <option value="playtime_desc">Most Playtime</option>
            <option value="completion_desc">Progress %</option>
            <option value="title_asc">Title (A-Z)</option>
          </select>
        </div>

        {/* View mode */}
        <div className="flex items-center bg-slate-100 dark:bg-dark-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Games List/Grid */}
      {viewMode === 'grid' ? (
        <GameGrid
          games={filteredGames}
          onSelectGame={(g) => setSelectedGame(g)}
          onToggleFavorite={(id, e) => {
            e.stopPropagation();
            toggleFavorite(id);
          }}
          onQuickLogPlaytime={(id, hours, e) => {
            e.stopPropagation();
            incrementPlaytime(id, hours);
          }}
          onAddGame={openAddModal}
          emptyMessage={`No games currently in ${title.toLowerCase()}.`}
        />
      ) : (
        <GameList
          games={filteredGames}
          onSelectGame={(g) => setSelectedGame(g)}
          onToggleFavorite={(id, e) => {
            e.stopPropagation();
            toggleFavorite(id);
          }}
          onEditGame={(g, e) => {
            e.stopPropagation();
            openEditModal(g);
          }}
          onDeleteGame={(id, e) => {
            e.stopPropagation();
            setGameToDelete(id);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(gameToDelete)}
        onClose={() => setGameToDelete(null)}
        onConfirm={() => {
          if (gameToDelete) {
            deleteGame(gameToDelete);
            setGameToDelete(null);
          }
        }}
        title="Delete Game"
        message="Are you sure you want to remove this title from your library? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
