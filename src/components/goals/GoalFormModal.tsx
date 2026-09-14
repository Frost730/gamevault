import React, { useState, useEffect } from 'react';
import { Goal, GoalType } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AlertCircle, Trash2 } from 'lucide-react';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: Omit<Goal, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  initialGoal?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState<number>(10);
  const [current, setCurrent] = useState<number>(0);
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState<GoalType>('games_completed');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title || '');
      setDescription(initialGoal.description || '');
      setTarget(initialGoal.target || 10);
      setCurrent(initialGoal.current || 0);
      setDeadline(initialGoal.deadline || '');
      setType(initialGoal.type || 'games_completed');
    } else {
      setTitle('');
      setDescription('');
      setTarget(10);
      setCurrent(0);
      const endOfYear = `${new Date().getFullYear()}-12-31`;
      setDeadline(endOfYear);
      setType('games_completed');
    }
    setErrors({});
  }, [initialGoal, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (target <= 0) {
      newErrors.target = 'Target must be greater than 0.';
    }

    if (current < 0) {
      newErrors.current = 'Progress cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      target: Number(target),
      current: Number(current),
      deadline,
      type,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Goal' : 'Create Gaming Goal'}
      subtitle="Set milestones for your gaming journey"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Goal Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Finish 10 games this year"
            className={`w-full bg-slate-50 dark:bg-dark-950 border ${
              errors.title ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
            } rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500`}
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Goal Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Goal Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GoalType)}
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="games_completed">Games Completed</option>
            <option value="playtime_hours">Playtime (Hours)</option>
            <option value="backlog_clear">Clear Backlog Titles</option>
            <option value="custom">Custom Milestone</option>
          </select>
        </div>

        {/* Target and Current Progress */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Target Value <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value, 10) || 0)}
              className={`w-full bg-slate-50 dark:bg-dark-950 border ${
                errors.target ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
              } rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500`}
            />
            {errors.target && <p className="text-xs text-rose-500 mt-1">{errors.target}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Current Progress
            </label>
            <input
              type="number"
              min="0"
              value={current}
              onChange={(e) => setCurrent(parseInt(e.target.value, 10) || 0)}
              className={`w-full bg-slate-50 dark:bg-dark-950 border ${
                errors.current ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
              } rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500`}
            />
            {errors.current && <p className="text-xs text-rose-500 mt-1">{errors.current}</p>}
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Description / Motivation
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this goal important or which specific titles are you focusing on?"
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          {isEditing && onDelete && initialGoal ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Goal</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors shadow-lg shadow-brand-600/20 active:scale-95 text-center"
            >
              {isEditing ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Goal Confirmation */}
      {initialGoal && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            if (onDelete) {
              onDelete(initialGoal.id);
            }
            onClose();
          }}
          title="Delete Goal"
          message={`Are you sure you want to delete "${initialGoal.title}"? All tracked progress will be removed.`}
          confirmLabel="Delete"
          isDestructive={true}
        />
      )}
    </Modal>
  );
};
