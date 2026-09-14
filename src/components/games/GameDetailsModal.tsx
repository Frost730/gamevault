import React, { useState } from 'react';
import { Game, GameStatus } from '../../types';
import { Modal } from '../common/Modal';
import { GameCover } from '../common/GameCoverPlaceholder';
import { StatusBadge, PlatformBadge } from '../common/Badge';
import { formatPlaytime, formatDate, formatRelativeTime } from '../../utils/formatters';
import {
  Star,
  Clock,
  Heart,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface GameDetailsModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateStatus: (id: string, status: GameStatus) => void;
  onIncrementPlaytime: (id: string, hours: number) => void;
  onUpdateCompletion: (id: string, completion: number) => void;
}

const STATUS_LIST: GameStatus[] = [
  'Playing',
  'Completed',
  'Backlog',
  'Wishlist',
  'Paused',
  'Dropped',
];

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateStatus,
  onIncrementPlaytime,
  onUpdateCompletion,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!game) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={game.title} maxWidth="2xl">
        <div className="space-y-6">
          {/* Hero Banner with Cover */}
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[2/1] bg-slate-900 border border-slate-200 dark:border-slate-800">
            <GameCover
              coverUrl={game.coverUrl}
              title={game.title}
              genre={game.genre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Floating Top Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(game.id)}
                className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:text-rose-400 transition-colors border border-white/10"
                title={game.favorite ? 'Favorited' : 'Mark Favorite'}
              >
                <Heart
                  className={`w-5 h-5 ${
                    game.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                  }`}
                />
              </button>
            </div>

            {/* Bottom Hero Info */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <PlatformBadge platform={game.platform} />
                  <StatusBadge status={game.status} />
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-slate-200 border border-white/10 font-medium">
                    {game.genre}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow">
                  {game.title}
                </h2>
              </div>

              {game.rating > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{game.rating} / 10</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick interactive stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="glass-panel p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Playtime</span>
              </div>
              <p className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 truncate">
                {formatPlaytime(game.playtime)}
              </p>
            </div>

            <div className="glass-panel p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                <span>Progress</span>
              </div>
              <p className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                {game.completion}%
              </p>
            </div>

            <div className="glass-panel p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Released</span>
              </div>
              <p className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                {game.releaseYear > 0 ? game.releaseYear : 'TBA'}
              </p>
            </div>

            <div className="glass-panel p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Last Played</span>
              </div>
              <p className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                {formatRelativeTime(game.lastPlayed)}
              </p>
            </div>
          </div>

          {/* Progress Slider & Quick Update */}
          <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Completion Percentage</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">{game.completion}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={game.completion}
              onChange={(e) => onUpdateCompletion(game.id, Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => onUpdateCompletion(game.id, 0)}
                className="hover:text-slate-800 dark:hover:text-slate-300"
              >
                0% Not Started
              </button>
              <button
                type="button"
                onClick={() => onUpdateCompletion(game.id, 50)}
                className="hover:text-slate-800 dark:hover:text-slate-300"
              >
                50% Halfway
              </button>
              <button
                type="button"
                onClick={() => onUpdateCompletion(game.id, 100)}
                className="hover:text-slate-800 dark:hover:text-slate-300"
              >
                100% Completed
              </button>
            </div>
          </div>

          {/* Quick Status and Playtime Log Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status change dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                Change Status
              </label>
              <select
                value={game.status}
                onChange={(e) => onUpdateStatus(game.id, e.target.value as GameStatus)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {STATUS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick playtime log */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                Log Playtime
              </label>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onIncrementPlaytime(game.id, 0.5)}
                  className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  +30m
                </button>
                <button
                  type="button"
                  onClick={() => onIncrementPlaytime(game.id, 1)}
                  className="flex-1 py-2 px-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 text-brand-700 dark:text-brand-300 border border-brand-500/30 text-xs font-semibold transition-colors"
                >
                  +1h
                </button>
                <button
                  type="button"
                  onClick={() => onIncrementPlaytime(game.id, 2)}
                  className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  +2h
                </button>
                <button
                  type="button"
                  onClick={() => onIncrementPlaytime(game.id, 5)}
                  className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  +5h
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Personal Notes
            </label>
            <div className="bg-slate-50 dark:bg-dark-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-300 leading-relaxed min-h-[60px] whitespace-pre-wrap">
              {game.notes ? game.notes : <span className="text-slate-400 italic">No notes added yet.</span>}
            </div>
          </div>

          {/* Footer Metadata & Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Added {formatDate(game.dateAdded)}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(game);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors shadow-md shadow-brand-600/20 active:scale-95"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Game</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(game.id);
          onClose();
        }}
        title="Delete Game"
        message={`Are you sure you want to remove "${game.title}" from your library? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </>
  );
};
