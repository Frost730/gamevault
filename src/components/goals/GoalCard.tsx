import React, { useState } from 'react';
import { Goal } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { formatDate } from '../../utils/formatters';
import { notificationService } from '../../services/notificationService';
import {
  Trophy,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Bell,
  CalendarPlus,
  Mail,
  Check,
} from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onIncrement: (id: string, amount?: number) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onIncrement,
  onEdit,
  onDelete,
}) => {
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const isCompleted = goal.current >= goal.target;

  const getUnit = () => {
    switch (goal.type) {
      case 'playtime_hours':
        return 'hrs';
      case 'games_completed':
      case 'backlog_clear':
        return 'games';
      default:
        return 'units';
    }
  };

  const getDaysRemaining = () => {
    if (!goal.deadline) return null;
    const deadlineDate = new Date(goal.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysRemaining();

  const handleSendBrowserAlert = async () => {
    const success = await notificationService.sendNotification(`🎯 Goal Reminder: ${goal.title}`, {
      body: `Current progress: ${goal.current}/${goal.target} ${getUnit()}. Deadline: ${goal.deadline || 'Ongoing'}`,
    });
    if (success) {
      setReminderSent(true);
      setTimeout(() => setReminderSent(false), 3000);
    }
    setShowReminderMenu(false);
  };

  const handleGoogleCalendar = () => {
    notificationService.openGoogleCalendar(goal);
    setShowReminderMenu(false);
  };

  const handleDownloadIcs = () => {
    notificationService.downloadIcsReminder(goal);
    setShowReminderMenu(false);
  };

  return (
    <div
      className={`relative glass-panel rounded-2xl p-5 border transition-all duration-300 ${
        isCompleted
          ? 'border-accent-emerald/40 bg-accent-emerald/5 hover:border-accent-emerald/60'
          : 'border-slate-200 dark:border-slate-800 hover:border-brand-500/40'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              isCompleted
                ? 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30'
                : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20'
            }`}
          >
            {isCompleted ? <Trophy className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate">
              {goal.title}
              {isCompleted && (
                <span className="text-[11px] font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2 py-0.5 rounded-full shrink-0">
                  Completed!
                </span>
              )}
            </h4>
            {goal.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{goal.description}</p>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1 shrink-0 relative">
          {/* Reminder / Notification Menu Toggle */}
          <button
            type="button"
            onClick={() => setShowReminderMenu(!showReminderMenu)}
            className={`p-1.5 rounded-lg transition-colors ${
              reminderSent
                ? 'text-emerald-500 bg-emerald-500/10'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
            title="Set Reminder / Notification"
          >
            {reminderSent ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>

          {/* Reminder Dropdown */}
          {showReminderMenu && (
            <div className="absolute right-0 top-8 z-30 w-56 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={handleSendBrowserAlert}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-brand-500" />
                <span>Send Web Notification Now</span>
              </button>
              {goal.deadline && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleCalendar}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-rose-500" />
                    <span>Google Calendar & Email Alert</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Download .ics Calendar Event</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowReminderMenu(false);
                  onDelete(goal.id);
                }}
                className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-100 dark:border-slate-800 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Goal</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title="Edit Goal"
            aria-label="Edit Goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors"
            title="Delete Goal"
            aria-label="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Metric Numbers */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">{goal.current}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            / {goal.target} {getUnit()}
          </span>
        </div>
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        value={goal.current}
        max={goal.target}
        color={isCompleted ? 'emerald' : 'brand'}
        size="md"
      />

      {/* Footer Info & Quick Log */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>
            {daysLeft !== null ? (
              daysLeft > 0 ? (
                <span className={daysLeft <= 7 ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
                  {daysLeft} days remaining
                </span>
              ) : daysLeft === 0 ? (
                <span className="text-rose-500 font-medium">Due today</span>
              ) : (
                <span className="text-rose-500 font-medium">Overdue</span>
              )
            ) : (
              formatDate(goal.deadline)
            )}
          </span>
        </div>

        {/* Quick Increment Progress Button */}
        {!isCompleted && (
          <button
            type="button"
            onClick={() => onIncrement(goal.id, 1)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-600 dark:text-brand-300 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1 {getUnit() === 'hrs' ? 'hr' : 'progress'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
