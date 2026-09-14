import React, { useState, useMemo } from 'react';
import { useGames } from '../context/GameContext';
import { FilterState, SortOption, LibraryViewMode } from '../types';
import { SearchBar } from '../components/games/SearchBar';
import { FilterPanel } from '../components/games/FilterPanel';
import { GameGrid } from '../components/games/GameGrid';
import { GameList } from '../components/games/GameList';
import { storageService } from '../services/storageService';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Plus } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const {
    games,
    setSelectedGame,
    toggleFavorite,
    incrementPlaytime,
    openAddModal,
    openEditModal,
    deleteGame,
  } = useGames();

  // Settings persistence for viewMode and defaultSort
  const [viewMode, setViewMode] = useState<LibraryViewMode>(() => {
    return storageService.getSettings().viewMode || 'grid';
  });

  const [sortBy, setSortBy] = useState<SortOption>(() => {
    return storageService.getSettings().defaultSort || 'recently_added';
  });

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    status: 'All',
    platform: 'All',
    genre: 'All',
    minRating: 0,
    favoriteOnly: false,
  });

  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  const handleViewModeChange = (mode: LibraryViewMode) => {
    setViewMode(mode);
    const curSettings = storageService.getSettings();
    storageService.saveSettings({ ...curSettings, viewMode: mode });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    const curSettings = storageService.getSettings();
    storageService.saveSettings({ ...curSettings, defaultSort: sort });
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'All',
      platform: 'All',
      genre: 'All',
      minRating: 0,
      favoriteOnly: false,
    });
  };

  // Filtered and sorted games computation
  const processedGames = useMemo(() => {
    let result = [...games];

    // 1. Search filter: Title, Genre, Tags
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter((game) => {
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchGenre = game.genre.toLowerCase().includes(q);
        const matchTags = game.tags?.some((tag) => tag.toLowerCase().includes(q));
        return matchTitle || matchGenre || matchTags;
      });
    }

    // 2. Status filter
    if (filters.status !== 'All') {
      result = result.filter((g) => g.status === filters.status);
    }

    // 3. Platform filter
    if (filters.platform !== 'All') {
      result = result.filter((g) => g.platform === filters.platform);
    }

    // 4. Genre filter
    if (filters.genre !== 'All') {
      result = result.filter((g) => g.genre === filters.genre);
    }

    // 5. Min Rating filter
    if (filters.minRating > 0) {
      result = result.filter((g) => g.rating >= filters.minRating);
    }

    // 6. Favorite only filter
    if (filters.favoriteOnly) {
      result = result.filter((g) => g.favorite);
    }

    // 7. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'rating_desc':
          return b.rating - a.rating;
        case 'playtime_desc':
          return b.playtime - a.playtime;
        case 'completion_desc':
          return b.completion - a.completion;
        case 'recently_played': {
          const dateA = a.lastPlayed ? new Date(a.lastPlayed).getTime() : 0;
          const dateB = b.lastPlayed ? new Date(b.lastPlayed).getTime() : 0;
          return dateB - dateA;
        }
        case 'recently_added':
        default: {
          const dateA = new Date(a.dateAdded).getTime();
          const dateB = new Date(b.dateAdded).getTime();
          return dateB - dateA;
        }
      }
    });

    return result;
  }, [games, filters, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with Search and Add Game button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Game Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse, search, and manage your complete personal collection
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <SearchBar
            value={filters.searchQuery}
            onChange={(q) => setFilters({ ...filters, searchQuery: q })}
            className="w-full sm:w-72 md:w-80"
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

      {/* Filter and Sort Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onResetFilters={handleResetFilters}
        totalFiltered={processedGames.length}
      />

      {/* View Display (Grid or List) */}
      {viewMode === 'grid' ? (
        <GameGrid
          games={processedGames}
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
        />
      ) : (
        <GameList
          games={processedGames}
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

      {/* Delete Confirmation for list view */}
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
