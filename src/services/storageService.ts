import { Game, Goal, GoalType, UserSettings, ExportDataPayload } from '../types';

const STORAGE_KEYS = {
  GAMES: 'gamingDashboard_games',
  GOALS: 'gamingDashboard_goals',
  SETTINGS: 'gamingDashboard_settings',
} as const;

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  viewMode: 'grid',
  defaultSort: 'recently_added',
  accentColor: '#8b5cf6',
};

class StorageService {
  // --- Sanitization & Integrity checks ---
  private sanitizeGame(g: any): Game {
    return {
      id: typeof g.id === 'string' && g.id ? g.id : `game_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: typeof g.title === 'string' ? g.title : 'Untitled Game',
      genre: typeof g.genre === 'string' ? g.genre : 'Other',
      platform: typeof g.platform === 'string' ? g.platform : 'PC',
      status: ['Playing', 'Completed', 'Backlog', 'Wishlist', 'Paused', 'Dropped'].includes(g.status)
        ? g.status
        : 'Backlog',
      rating: typeof g.rating === 'number' && !isNaN(g.rating) ? Math.min(10, Math.max(0, g.rating)) : 0,
      playtime: typeof g.playtime === 'number' && !isNaN(g.playtime) ? Math.max(0, g.playtime) : 0,
      completion: typeof g.completion === 'number' && !isNaN(g.completion) ? Math.min(100, Math.max(0, g.completion)) : 0,
      releaseYear: typeof g.releaseYear === 'number' && !isNaN(g.releaseYear) ? g.releaseYear : new Date().getFullYear(),
      coverUrl: typeof g.coverUrl === 'string' ? g.coverUrl : '',
      dateAdded: typeof g.dateAdded === 'string' ? g.dateAdded : new Date().toISOString(),
      lastPlayed: typeof g.lastPlayed === 'string' ? g.lastPlayed : null,
      favorite: Boolean(g.favorite),
      notes: typeof g.notes === 'string' ? g.notes : '',
      tags: Array.isArray(g.tags) ? g.tags.filter((t: any) => typeof t === 'string') : [],
    };
  }

  private sanitizeGoal(g: any): Goal {
    const validTypes: GoalType[] = ['games_completed', 'playtime_hours', 'backlog_clear', 'custom'];
    return {
      id: typeof g.id === 'string' && g.id ? g.id : `goal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: typeof g.title === 'string' ? g.title : 'Untitled Goal',
      description: typeof g.description === 'string' ? g.description : '',
      target: typeof g.target === 'number' && !isNaN(g.target) ? Math.max(1, g.target) : 1,
      current: typeof g.current === 'number' && !isNaN(g.current) ? Math.max(0, g.current) : 0,
      deadline: typeof g.deadline === 'string' ? g.deadline : '',
      type: validTypes.includes(g.type) ? g.type : 'custom',
      createdAt: typeof g.createdAt === 'string' ? g.createdAt : new Date().toISOString(),
    };
  }

  // --- Games ---
  getGames(): Game[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((g) => this.sanitizeGame(g));
      }
      return [];
    } catch (error) {
      console.error('Error reading games from localStorage:', error);
      return [];
    }
  }

  saveGames(games: Game[]): boolean {
    try {
      const sanitized = games.map((g) => this.sanitizeGame(g));
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(sanitized));
      return true;
    } catch (error: any) {
      console.error('Error saving games to localStorage:', error);
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        alert('Browser local storage limit reached. Try using external image URLs instead of large image uploads.');
      }
      return false;
    }
  }

  // --- Goals ---
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((g) => this.sanitizeGoal(g));
      }
      return [];
    } catch (error) {
      console.error('Error reading goals from localStorage:', error);
      return [];
    }
  }

  saveGoals(goals: Goal[]): boolean {
    try {
      const sanitized = goals.map((g) => this.sanitizeGoal(g));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(sanitized));
      return true;
    } catch (error) {
      console.error('Error saving goals to localStorage:', error);
      return false;
    }
  }

  // --- Settings ---
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  // --- Backup & Restore ---
  exportAll(): ExportDataPayload {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      games: this.getGames(),
      goals: this.getGoals(),
      settings: this.getSettings(),
    };
  }

  importAll(payload: ExportDataPayload): { success: boolean; message: string } {
    try {
      if (!payload || typeof payload !== 'object') {
        return { success: false, message: 'Invalid backup file format.' };
      }

      if (!Array.isArray(payload.games)) {
        return { success: false, message: 'Backup file missing valid games array.' };
      }

      this.saveGames(payload.games);

      if (Array.isArray(payload.goals)) {
        this.saveGoals(payload.goals);
      }

      if (payload.settings && typeof payload.settings === 'object') {
        this.saveSettings({ ...DEFAULT_SETTINGS, ...payload.settings });
      }

      return {
        success: true,
        message: `Successfully imported ${payload.games.length} games and ${(payload.goals || []).length} goals.`,
      };
    } catch (error) {
      console.error('Failed to import backup:', error);
      return { success: false, message: 'Failed to parse and import backup file.' };
    }
  }

  resetToDefaults(): void {
    this.saveGames([]);
    this.saveGoals([]);
    this.saveSettings(DEFAULT_SETTINGS);
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.GAMES);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}

export const storageService = new StorageService();
