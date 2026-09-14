import React, { useState, useEffect, useRef } from 'react';
import { Game, GameGenre, GamePlatform, GameStatus } from '../../types';
import { Modal } from '../common/Modal';
import { GameCover } from '../common/GameCoverPlaceholder';
import { X, Plus, AlertCircle, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { compressAndConvertImage } from '../../utils/imageUtils';

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gameData: Omit<Game, 'id' | 'dateAdded'>) => void;
  initialGame?: Game | null;
}

const PLATFORMS: GamePlatform[] = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Mobile',
  'Other',
];

const GENRES: GameGenre[] = [
  'Action',
  'Adventure',
  'RPG',
  'Shooter',
  'Horror',
  'Strategy',
  'Simulation',
  'Racing',
  'Sports',
  'Survival',
  'Sandbox',
  'Other',
];

const STATUSES: GameStatus[] = [
  'Playing',
  'Completed',
  'Backlog',
  'Wishlist',
  'Paused',
  'Dropped',
];

export const GameFormModal: React.FC<GameFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialGame,
}) => {
  const isEditing = Boolean(initialGame);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<GameGenre>('Action');
  const [platform, setPlatform] = useState<GamePlatform>('PC');
  const [status, setStatus] = useState<GameStatus>('Backlog');
  const [rating, setRating] = useState<number>(0);
  const [playtime, setPlaytime] = useState<number>(0);
  const [completion, setCompletion] = useState<number>(0);
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [coverUrl, setCoverUrl] = useState('');
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialGame) {
      setTitle(initialGame.title || '');
      setGenre(initialGame.genre || 'Action');
      setPlatform(initialGame.platform || 'PC');
      setStatus(initialGame.status || 'Backlog');
      setRating(initialGame.rating || 0);
      setPlaytime(initialGame.playtime || 0);
      setCompletion(initialGame.completion || 0);
      setReleaseYear(initialGame.releaseYear || new Date().getFullYear());
      setCoverUrl(initialGame.coverUrl || '');
      setFavorite(initialGame.favorite || false);
      setNotes(initialGame.notes || '');
      setTags(initialGame.tags || []);
      // If cover is data URL, set mode to upload, else url
      if (initialGame.coverUrl?.startsWith('data:')) {
        setImageUploadMode('upload');
      } else if (initialGame.coverUrl) {
        setImageUploadMode('url');
      }
    } else {
      setTitle('');
      setGenre('Action');
      setPlatform('PC');
      setStatus('Backlog');
      setRating(0);
      setPlaytime(0);
      setCompletion(0);
      setReleaseYear(new Date().getFullYear());
      setCoverUrl('');
      setImageUploadMode('upload');
      setFavorite(false);
      setNotes('');
      setTags([]);
    }
    setErrors({});
    setTagInput('');
    setIsProcessingImage(false);
  }, [initialGame, isOpen]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cover: 'Selected image is too large (> 15MB). Please select a smaller photo.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsProcessingImage(true);
      // Compress to lightweight web format to conserve localStorage space
      const compressedDataUrl = await compressAndConvertImage(file, 600, 800, 0.82);
      setCoverUrl(compressedDataUrl);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.cover;
        return copy;
      });
    } catch (err) {
      console.error('Image compression error:', err);
      setErrors((prev) => ({ ...prev, cover: 'Failed to process selected image file.' }));
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (rating < 0 || rating > 10) {
      newErrors.rating = 'Rating must be between 0 and 10.';
    }

    if (completion < 0 || completion > 100) {
      newErrors.completion = 'Completion must be between 0% and 100%.';
    }

    if (playtime < 0) {
      newErrors.playtime = 'Playtime cannot be negative.';
    }

    if (releaseYear && (releaseYear < 1970 || releaseYear > 2100)) {
      newErrors.releaseYear = 'Please provide a valid release year (1970 - 2100).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      genre,
      platform,
      status,
      rating: Number(rating),
      playtime: Number(playtime),
      completion: Number(completion),
      releaseYear: Number(releaseYear) || new Date().getFullYear(),
      coverUrl: coverUrl.trim(),
      favorite,
      notes: notes.trim(),
      tags,
      lastPlayed: initialGame?.lastPlayed || (status === 'Playing' ? new Date().toISOString() : null),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Game' : 'Add New Game'}
      subtitle={isEditing ? 'Update game details and tracking progress' : 'Add a title to your personal collection'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Game Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cyberpunk 2077, Hades II..."
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

        {/* Platform, Genre, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as GamePlatform)}
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as GameGenre)}
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GameStatus)}
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rating, Playtime, Completion, Release Year */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Rating (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
              className={`w-full bg-slate-50 dark:bg-dark-950 border ${
                errors.rating ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
              } rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500`}
            />
            {errors.rating && <p className="text-xs text-rose-500 mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Playtime (Hrs)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={playtime}
              onChange={(e) => setPlaytime(parseFloat(e.target.value) || 0)}
              className={`w-full bg-slate-50 dark:bg-dark-950 border ${
                errors.playtime ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
              } rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500`}
            />
            {errors.playtime && <p className="text-xs text-rose-500 mt-1">{errors.playtime}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Progress (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={completion}
              onChange={(e) => setCompletion(parseInt(e.target.value, 10) || 0)}
              className={`w-full bg-slate-50 dark:bg-dark-950 border ${
                errors.completion ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
              } rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500`}
            />
            {errors.completion && <p className="text-xs text-rose-500 mt-1">{errors.completion}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Release Year
            </label>
            <input
              type="number"
              min="1970"
              max="2100"
              value={releaseYear}
              onChange={(e) => setReleaseYear(parseInt(e.target.value, 10) || 0)}
              className={`w-full bg-slate-50 dark:bg-dark-950 border ${
                errors.releaseYear ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700/80'
              } rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500`}
            />
          </div>
        </div>

        {/* Cover Image: Upload File or URL Option */}
        <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Game Cover Artwork
            </label>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-dark-850 p-1 rounded-xl text-[11px]">
              <button
                type="button"
                onClick={() => setImageUploadMode('upload')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  imageUploadMode === 'upload'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMode('url')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  imageUploadMode === 'url'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Image URL</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Live Cover Preview */}
            <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-dark-900 shadow-sm relative group">
              <GameCover coverUrl={coverUrl} title={title || 'Game'} genre={genre} />
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Input by Mode */}
            <div className="flex-1 w-full space-y-1.5">
              {imageUploadMode === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isProcessingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold transition-all shadow-sm active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-brand-500" />
                      <span>{isProcessingImage ? 'Optimizing Image...' : 'Choose Image File...'}</span>
                    </button>
                    {coverUrl && (
                      <button
                        type="button"
                        onClick={() => setCoverUrl('')}
                        className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Images are automatically optimized and compressed to save browser storage.
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.example.com/cover.jpg"
                    className="w-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Paste any public image URL. If left empty, a stylized placeholder is automatically generated.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDownTag}
              placeholder="Type a tag and press Enter..."
              className="flex-1 bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Personal Notes & Reviews
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Favorite builds, completion milestones, memory highlights..."
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Favorite Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="favorite-toggle"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-dark-950 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="favorite-toggle" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
            Mark as Favorite title
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessingImage}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors shadow-lg shadow-brand-600/20 active:scale-95 text-center"
          >
            {isEditing ? 'Save Changes' : 'Add Game'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
