export function formatPlaytime(hours: number): string {
  if (!hours || hours <= 0) return '0 hrs';
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins}m`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (minutes === 0) {
    return `${wholeHours} hrs`;
  }
  return `${wholeHours}h ${minutes}m`;
}

export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Never';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return 'Never';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Never';
  }
}

export function formatRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Never';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return 'Never';
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${Math.floor(diffMonths / 12)}y ago`;
  } catch {
    return 'Never';
  }
}

export function getStatusColor(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case 'Playing':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500 dark:bg-emerald-400',
      };
    case 'Completed':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-500 dark:bg-indigo-400',
      };
    case 'Backlog':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        text: 'text-amber-800 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500 dark:bg-amber-400',
      };
    case 'Wishlist':
      return {
        bg: 'bg-pink-500/10 dark:bg-pink-500/15',
        text: 'text-pink-700 dark:text-pink-400',
        border: 'border-pink-500/30',
        dot: 'bg-pink-500 dark:bg-pink-400',
      };
    case 'Paused':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/15',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-500 dark:bg-blue-400',
      };
    case 'Dropped':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/15',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500 dark:bg-rose-400',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-500 dark:bg-slate-400',
      };
  }
}

export function getPlatformColor(platform: string): { bg: string; text: string } {
  switch (platform) {
    case 'PC':
      return { bg: 'bg-blue-500/15 dark:bg-blue-600/20', text: 'text-blue-700 dark:text-blue-400' };
    case 'PlayStation':
      return { bg: 'bg-indigo-500/15 dark:bg-indigo-600/20', text: 'text-indigo-700 dark:text-indigo-400' };
    case 'Xbox':
      return { bg: 'bg-emerald-500/15 dark:bg-emerald-600/20', text: 'text-emerald-700 dark:text-emerald-400' };
    case 'Nintendo Switch':
      return { bg: 'bg-red-500/15 dark:bg-red-600/20', text: 'text-red-700 dark:text-red-400' };
    case 'Mobile':
      return { bg: 'bg-purple-500/15 dark:bg-purple-600/20', text: 'text-purple-700 dark:text-purple-400' };
    default:
      return { bg: 'bg-slate-500/15 dark:bg-slate-600/20', text: 'text-slate-700 dark:text-slate-400' };
  }
}
