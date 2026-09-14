import { Game, GamePlatform, GameGenre, GameStatus } from '../types';

export interface DashboardStats {
  totalGames: number;
  playingCount: number;
  completedCount: number;
  backlogCount: number;
  wishlistCount: number;
  pausedCount: number;
  droppedCount: number;
  favoriteCount: number;
  totalPlaytime: number;
  averageRating: number;
  completionPercentage: number;
}

export function calculateDashboardStats(games: Game[]): DashboardStats {
  const totalGames = games.length;
  if (totalGames === 0) {
    return {
      totalGames: 0,
      playingCount: 0,
      completedCount: 0,
      backlogCount: 0,
      wishlistCount: 0,
      pausedCount: 0,
      droppedCount: 0,
      favoriteCount: 0,
      totalPlaytime: 0,
      averageRating: 0,
      completionPercentage: 0,
    };
  }

  let playingCount = 0;
  let completedCount = 0;
  let backlogCount = 0;
  let wishlistCount = 0;
  let pausedCount = 0;
  let droppedCount = 0;
  let favoriteCount = 0;
  let totalPlaytime = 0;
  let totalCompletion = 0;
  let ratedCount = 0;
  let totalRating = 0;

  for (const game of games) {
    switch (game.status) {
      case 'Playing':
        playingCount++;
        break;
      case 'Completed':
        completedCount++;
        break;
      case 'Backlog':
        backlogCount++;
        break;
      case 'Wishlist':
        wishlistCount++;
        break;
      case 'Paused':
        pausedCount++;
        break;
      case 'Dropped':
        droppedCount++;
        break;
    }

    if (game.favorite) favoriteCount++;
    totalPlaytime += game.playtime || 0;
    totalCompletion += game.completion || 0;

    if (game.rating > 0) {
      totalRating += game.rating;
      ratedCount++;
    }
  }

  const averageRating = ratedCount > 0 ? Number((totalRating / ratedCount).toFixed(1)) : 0;
  const completionPercentage = Math.round(totalCompletion / totalGames);

  return {
    totalGames,
    playingCount,
    completedCount,
    backlogCount,
    wishlistCount,
    pausedCount,
    droppedCount,
    favoriteCount,
    totalPlaytime: Number(totalPlaytime.toFixed(1)),
    averageRating,
    completionPercentage,
  };
}

export function getGamesByPlatform(games: Game[]): Record<GamePlatform, number> {
  const platforms: Record<GamePlatform, number> = {
    PC: 0,
    PlayStation: 0,
    Xbox: 0,
    'Nintendo Switch': 0,
    Mobile: 0,
    Other: 0,
  };

  for (const g of games) {
    if (platforms[g.platform] !== undefined) {
      platforms[g.platform]++;
    } else {
      platforms.Other++;
    }
  }

  return platforms;
}

export function getGamesByGenre(games: Game[]): Record<string, number> {
  const genres: Record<string, number> = {};

  for (const g of games) {
    genres[g.genre] = (genres[g.genre] || 0) + 1;
  }

  return genres;
}

export function getGamesByStatus(games: Game[]): Record<GameStatus, number> {
  const statuses: Record<GameStatus, number> = {
    Playing: 0,
    Completed: 0,
    Backlog: 0,
    Wishlist: 0,
    Paused: 0,
    Dropped: 0,
  };

  for (const g of games) {
    if (statuses[g.status] !== undefined) {
      statuses[g.status]++;
    }
  }

  return statuses;
}

export function getPlaytimeByGenre(games: Game[]): Record<string, number> {
  const playtime: Record<string, number> = {};

  for (const g of games) {
    playtime[g.genre] = Number(((playtime[g.genre] || 0) + (g.playtime || 0)).toFixed(1));
  }

  return playtime;
}

export function getRatingDistribution(games: Game[]): Record<string, number> {
  const distribution: Record<string, number> = {
    '1-2': 0,
    '3-4': 0,
    '5-6': 0,
    '7-8': 0,
    '9-10': 0,
  };

  for (const g of games) {
    if (g.rating >= 9) distribution['9-10']++;
    else if (g.rating >= 7) distribution['7-8']++;
    else if (g.rating >= 5) distribution['5-6']++;
    else if (g.rating >= 3) distribution['3-4']++;
    else if (g.rating > 0) distribution['1-2']++;
  }

  return distribution;
}

export function getGamesAddedTimeline(games: Game[]): { label: string; count: number }[] {
  const monthsMap: Record<string, number> = {};

  for (const g of games) {
    try {
      const date = new Date(g.dateAdded);
      if (!isNaN(date.getTime())) {
        const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthsMap[key] = (monthsMap[key] || 0) + 1;
      }
    } catch {
      // ignore
    }
  }

  return Object.entries(monthsMap).map(([label, count]) => ({ label, count }));
}
