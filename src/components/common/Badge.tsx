import React from 'react';
import { GameStatus, GamePlatform } from '../../types';
import { getStatusColor, getPlatformColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status: GameStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const colors = getStatusColor(status);
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
      {status}
    </span>
  );
};

interface PlatformBadgeProps {
  platform: GamePlatform;
  size?: 'sm' | 'md';
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, size = 'md' }) => {
  const colors = getPlatformColor(platform);
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5 font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-md border border-black/5 dark:border-white/5 font-medium shadow-sm ${colors.bg} ${colors.text} ${sizeClasses}`}
    >
      {platform}
    </span>
  );
};

interface GenreBadgeProps {
  genre: string;
  size?: 'sm' | 'md';
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({ genre, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center rounded-md bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 font-medium ${sizeClasses}`}
    >
      {genre}
    </span>
  );
};
