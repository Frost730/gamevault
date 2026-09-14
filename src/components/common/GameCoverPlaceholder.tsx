import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameCoverPlaceholderProps {
  title: string;
  genre?: string;
  className?: string;
}

const GRADIENTS = [
  'from-indigo-900 via-purple-900 to-slate-950',
  'from-violet-900 via-fuchsia-950 to-dark-950',
  'from-cyan-950 via-blue-900 to-slate-950',
  'from-emerald-950 via-teal-900 to-slate-950',
  'from-rose-950 via-pink-900 to-slate-950',
  'from-amber-950 via-orange-900 to-slate-950',
];

function getGradientIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % GRADIENTS.length;
}

function getInitials(title: string): string {
  const parts = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const GameCoverPlaceholder: React.FC<GameCoverPlaceholderProps> = ({
  title,
  genre,
  className = '',
}) => {
  const gradient = GRADIENTS[getGradientIndex(title || 'Game')];
  const initials = getInitials(title || 'G');

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 select-none overflow-hidden ${className}`}
    >
      {/* Background geometric accents */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-black/40 blur-xl pointer-events-none" />

      {/* Decorative gamepad watermark */}
      <Gamepad2 className="w-16 h-16 text-white/10 mb-2" />

      {/* Initials badge */}
      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner mb-2">
        <span className="font-display text-xl font-bold text-white tracking-widest">
          {initials}
        </span>
      </div>

      {/* Title snippet */}
      <div className="text-center px-2 z-10">
        <span className="font-display text-sm font-semibold text-slate-200 line-clamp-2">
          {title}
        </span>
        {genre && (
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
            {genre}
          </span>
        )}
      </div>
    </div>
  );
};

interface GameCoverProps {
  coverUrl?: string;
  title: string;
  genre?: string;
  className?: string;
  alt?: string;
}

export const GameCover: React.FC<GameCoverProps> = ({
  coverUrl,
  title,
  genre,
  className = '',
  alt = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!coverUrl || hasError) {
    return <GameCoverPlaceholder title={title} genre={genre} className={className} />;
  }

  return (
    <img
      src={coverUrl}
      alt={alt || title}
      className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};
