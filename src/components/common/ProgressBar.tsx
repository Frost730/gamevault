import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'cyan' | 'emerald' | 'amber';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showText = false,
  size = 'md',
  color = 'brand',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const colorClasses = {
    brand: 'bg-gradient-to-r from-brand-600 to-brand-400',
    cyan: 'bg-gradient-to-r from-accent-cyan to-blue-400',
    emerald: 'bg-gradient-to-r from-accent-emerald to-teal-400',
    amber: 'bg-gradient-to-r from-accent-amber to-orange-400',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
          <span>Completion</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-dark-700/80 rounded-full overflow-hidden ${heightClasses}`}>
        <div
          className={`${colorClasses} ${heightClasses} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
