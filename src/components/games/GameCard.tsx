import React from 'react';
import { Star, Clock, Heart, Plus } from 'lucide-react';
import { Game } from '../../types';
import { GameCover } from '../common/GameCoverPlaceholder';
import { StatusBadge, PlatformBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { formatPlaytime } from '../../utils/formatters';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onQuickLogPlaytime?: (id: string, hours: number, e: React.MouseEvent) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelect,
  onToggleFavorite,
  onQuickLogPlaytime,
}) => {
  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative flex flex-col bg-white dark:bg-dark-900/90 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 shadow-sm hover:shadow-lg dark:hover:shadow-glow-brand overflow-hidden cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] sm:aspect-[3/2] w-full overflow-hidden bg-slate-100 dark:bg-dark-950">
        <GameCover
          coverUrl={game.coverUrl}
          title={game.title}
          genre={game.genre}
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <PlatformBadge platform={game.platform} size="sm" />
          <button
            type="button"
            onClick={(e) => onToggleFavorite(game.id, e)}
            className="p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-600 dark:text-white/70 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-black/80 transition-all pointer-events-auto shadow-sm"
            aria-label={game.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 ${
                game.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Status Badge overlay bottom-left */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
          <StatusBadge status={game.status} size="sm" />
        </div>

        {/* Rating overlay bottom-right */}
        {game.rating > 0 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-semibold shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{game.rating}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {game.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{game.genre}</p>
        </div>

        {/* Metrics Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{formatPlaytime(game.playtime)}</span>
            </div>

            {/* Quick +1h button */}
            {onQuickLogPlaytime && game.status === 'Playing' && (
              <button
                type="button"
                onClick={(e) => onQuickLogPlaytime(game.id, 1, e)}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-[11px] font-semibold border border-brand-500/20 transition-colors"
                title="Quick log +1 hr"
              >
                <Plus className="w-3 h-3" />
                <span>1h</span>
              </button>
            )}
          </div>

          {/* Completion Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ProgressBar value={game.completion} size="sm" />
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 w-8 text-right">
              {game.completion}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
