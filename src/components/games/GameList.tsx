import React from 'react';
import { Game } from '../../types';
import { GameCover } from '../common/GameCoverPlaceholder';
import { StatusBadge, PlatformBadge } from '../common/Badge';
import { Star, Clock, Heart, Edit2, Trash2 } from 'lucide-react';
import { formatPlaytime } from '../../utils/formatters';

interface GameListProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEditGame: (game: Game, e: React.MouseEvent) => void;
  onDeleteGame: (id: string, e: React.MouseEvent) => void;
}

export const GameList: React.FC<GameListProps> = ({
  games,
  onSelectGame,
  onToggleFavorite,
  onEditGame,
  onDeleteGame,
}) => {
  return (
    <div>
      {/* Mobile-Friendly List View (Phones) */}
      <div className="sm:hidden space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelectGame(game)}
            className="glass-panel p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
          >
            {/* Cover */}
            <div className="w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
              <GameCover coverUrl={game.coverUrl} title={game.title} genre={game.genre} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {game.title}
                </h4>
                {game.rating > 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-semibold text-amber-500 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{game.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <PlatformBadge platform={game.platform} size="sm" />
                <StatusBadge status={game.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatPlaytime(game.playtime)}
                </span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => onToggleFavorite(game.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500"
                  >
                    <Heart className={`w-3.5 h-3.5 ${game.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => onEditGame(game, e)}
                    className="p-1 rounded text-slate-400 hover:text-brand-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => onDeleteGame(game.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Tablets & Desktops) */}
      <div className="hidden sm:block w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="min-w-[700px] bg-white dark:bg-dark-900/80 divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Header */}
          <div className="grid grid-cols-12 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-dark-950/60">
            <div className="col-span-5">Game</div>
            <div className="col-span-2">Platform</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-center">Rating</div>
            <div className="col-span-1 text-right">Time</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="grid grid-cols-12 px-5 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
            >
              {/* Title & Cover & Genre */}
              <div className="col-span-5 flex items-center gap-3.5 pr-3">
                <div className="w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <GameCover coverUrl={game.coverUrl} title={game.title} genre={game.genre} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {game.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{game.genre}</span>
                    {game.releaseYear > 0 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">• {game.releaseYear}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Platform */}
              <div className="col-span-2">
                <PlatformBadge platform={game.platform} size="sm" />
              </div>

              {/* Status & Progress */}
              <div className="col-span-2">
                <StatusBadge status={game.status} size="sm" />
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {game.completion}% completed
                </div>
              </div>

              {/* Rating */}
              <div className="col-span-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-300">
                {game.rating > 0 ? (
                  <>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{game.rating}</span>
                  </>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </div>

              {/* Playtime */}
              <div className="col-span-1 text-right text-xs text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatPlaytime(game.playtime)}</span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={(e) => onToggleFavorite(game.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  title={game.favorite ? 'Remove Favorite' : 'Mark Favorite'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      game.favorite ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => onEditGame(game, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  title="Edit Game"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => onDeleteGame(game.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  title="Delete Game"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
