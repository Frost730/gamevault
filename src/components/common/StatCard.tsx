import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: 'brand' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'brand',
  onClick,
}) => {
  const colorMap = {
    brand: {
      bg: 'bg-brand-500/10 dark:bg-brand-500/15',
      icon: 'text-brand-600 dark:text-brand-400',
      border: 'border-brand-500/20',
      hover: 'hover:border-brand-500/40',
    },
    cyan: {
      bg: 'bg-accent-cyan/10 dark:bg-accent-cyan/15',
      icon: 'text-cyan-600 dark:text-accent-cyan',
      border: 'border-accent-cyan/20',
      hover: 'hover:border-accent-cyan/40',
    },
    emerald: {
      bg: 'bg-accent-emerald/10 dark:bg-accent-emerald/15',
      icon: 'text-emerald-600 dark:text-accent-emerald',
      border: 'border-accent-emerald/20',
      hover: 'hover:border-accent-emerald/40',
    },
    amber: {
      bg: 'bg-accent-amber/10 dark:bg-accent-amber/15',
      icon: 'text-amber-600 dark:text-accent-amber',
      border: 'border-accent-amber/20',
      hover: 'hover:border-accent-amber/40',
    },
    rose: {
      bg: 'bg-accent-rose/10 dark:bg-accent-rose/15',
      icon: 'text-rose-600 dark:text-accent-rose',
      border: 'border-accent-rose/20',
      hover: 'hover:border-accent-rose/40',
    },
    indigo: {
      bg: 'bg-accent-indigo/10 dark:bg-accent-indigo/15',
      icon: 'text-indigo-600 dark:text-accent-indigo',
      border: 'border-accent-indigo/20',
      hover: 'hover:border-accent-indigo/40',
    },
  }[color];

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        colorMap.hover
      } ${onClick ? 'cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mb-1 truncate">
            {label}
          </p>
          <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            {value}
          </p>
          {subtext && (
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border shrink-0 ${colorMap.bg} ${colorMap.border}`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorMap.icon}`} />
        </div>
      </div>
    </div>
  );
};
