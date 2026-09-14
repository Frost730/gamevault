import React from 'react';
import { Game } from '../../types';
import { GameCard } from './GameCard';
import { Gamepad2, Plus } from 'lucide-react';

interface GameGridProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onQuickLogPlaytime?: (id: string, hours: number, e: React.MouseEvent) => void;
  onAddGame?: () => void;
  emptyMessage?: string;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  onSelectGame,
  onToggleFavorite,
  onQuickLogPlaytime,
  onAddGame,
  emptyMessage = 'No games found matching your criteria.',
}) => {
  if (games.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700/80 my-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400 mb-4">
          <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-200">{emptyMessage}</h4>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Try clearing filters or adding your favorite games to begin building your ultimate library.
        </p>
        {onAddGame && (
          <button
            onClick={onAddGame}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onSelect={onSelectGame}
          onToggleFavorite={onToggleFavorite}
          onQuickLogPlaytime={onQuickLogPlaytime}
        />
      ))}
    </div>
  );
};
