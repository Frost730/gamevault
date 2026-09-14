export type GameStatus = 'Playing' | 'Completed' | 'Backlog' | 'Wishlist' | 'Paused' | 'Dropped';

export type GamePlatform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'Mobile' | 'Other';

export type GameGenre =
  | 'Action'
  | 'Adventure'
  | 'RPG'
  | 'Shooter'
  | 'Horror'
  | 'Strategy'
  | 'Simulation'
  | 'Racing'
  | 'Sports'
  | 'Survival'
  | 'Sandbox'
  | 'Other';

export interface Game {
  id: string;
  title: string;
  genre: GameGenre;
  platform: GamePlatform;
  status: GameStatus;
  rating: number; // 0 to 10
  playtime: number; // hours
  completion: number; // 0 to 100 percentage
  releaseYear: number;
  dateAdded: string; // ISO string
  lastPlayed: string | null; // ISO string or null
  coverUrl: string;
  favorite: boolean;
  notes: string;
  tags: string[];
}

export type GoalType = 'games_completed' | 'playtime_hours' | 'backlog_clear' | 'custom';

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: string; // YYYY-MM-DD
  type: GoalType;
  createdAt: string;
}

export type LibraryViewMode = 'grid' | 'list';

export type SortOption =
  | 'title_asc'
  | 'title_desc'
  | 'rating_desc'
  | 'playtime_desc'
  | 'recently_added'
  | 'recently_played'
  | 'completion_desc';

export interface FilterState {
  searchQuery: string;
  status: GameStatus | 'All';
  platform: GamePlatform | 'All';
  genre: GameGenre | 'All';
  minRating: number;
  favoriteOnly: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  viewMode: LibraryViewMode;
  defaultSort: SortOption;
  accentColor: string;
}

export interface ExportDataPayload {
  version: number;
  exportedAt: string;
  games: Game[];
  goals: Goal[];
  settings: UserSettings;
}
