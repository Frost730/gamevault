import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Game, GameStatus } from '../types';
import { storageService } from '../services/storageService';

interface GameContextType {
  games: Game[];
  addGame: (gameData: Omit<Game, 'id' | 'dateAdded'>) => Game;
  updateGame: (id: string, updates: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateStatus: (id: string, status: GameStatus) => void;
  incrementPlaytime: (id: string, hoursToAdd: number) => void;
  updatePlaytime: (id: string, playtime: number) => void;
  updateCompletion: (id: string, completion: number) => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  editingGame: Game | null;
  setEditingGame: (game: Game | null) => void;
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  openAddModal: () => void;
  openEditModal: (game: Game) => void;
  closeFormModal: () => void;
  refreshGames: () => void;
  resetDefaultGames: () => void;
  clearAllGames: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Load games initially
  const loadGames = useCallback(() => {
    const data = storageService.getGames();
    setGames(data);
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Sync selectedGame when games array changes
  useEffect(() => {
    if (selectedGame) {
      const updated = games.find((g) => g.id === selectedGame.id);
      if (updated) {
        setSelectedGame(updated);
      } else {
        setSelectedGame(null);
      }
    }
  }, [games]);

  const addGame = (gameData: Omit<Game, 'id' | 'dateAdded'>): Game => {
    const newGame: Game = {
      ...gameData,
      id: 'game-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      dateAdded: new Date().toISOString(),
    };
    const updated = [newGame, ...games];
    storageService.saveGames(updated);
    setGames(updated);
    return newGame;
  };

  const updateGame = (id: string, updates: Partial<Game>) => {
    const updated = games.map((g) => (g.id === id ? { ...g, ...updates } : g));
    storageService.saveGames(updated);
    setGames(updated);
  };

  const deleteGame = (id: string) => {
    const updated = games.filter((g) => g.id !== id);
    storageService.saveGames(updated);
    setGames(updated);
    if (selectedGame?.id === id) {
      setSelectedGame(null);
    }
  };

  const toggleFavorite = (id: string) => {
    const game = games.find((g) => g.id === id);
    if (game) {
      updateGame(id, { favorite: !game.favorite });
    }
  };

  const updateStatus = (id: string, status: GameStatus) => {
    const updates: Partial<Game> = { status };
    if (status === 'Playing') {
      updates.lastPlayed = new Date().toISOString();
    }
    if (status === 'Completed') {
      updates.completion = 100;
    }
    updateGame(id, updates);
  };

  const incrementPlaytime = (id: string, hoursToAdd: number) => {
    const game = games.find((g) => g.id === id);
    if (game) {
      const newPlaytime = Number(Math.max(0, game.playtime + hoursToAdd).toFixed(1));
      updateGame(id, {
        playtime: newPlaytime,
        lastPlayed: new Date().toISOString(),
      });
    }
  };

  const updatePlaytime = (id: string, playtime: number) => {
    updateGame(id, {
      playtime: Math.max(0, playtime),
      lastPlayed: new Date().toISOString(),
    });
  };

  const updateCompletion = (id: string, completion: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(completion)));
    const updates: Partial<Game> = { completion: clamped };
    if (clamped === 100) {
      updates.status = 'Completed';
    }
    updateGame(id, updates);
  };

  const openAddModal = () => {
    setEditingGame(null);
    setIsFormOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingGame(null);
  };

  const resetDefaultGames = () => {
    storageService.resetToDefaults();
    loadGames();
  };

  const clearAllGames = () => {
    storageService.saveGames([]);
    setGames([]);
    setSelectedGame(null);
  };

  return (
    <GameContext.Provider
      value={{
        games,
        addGame,
        updateGame,
        deleteGame,
        toggleFavorite,
        updateStatus,
        incrementPlaytime,
        updatePlaytime,
        updateCompletion,
        selectedGame,
        setSelectedGame,
        editingGame,
        setEditingGame,
        isFormOpen,
        setIsFormOpen,
        openAddModal,
        openEditModal,
        closeFormModal,
        refreshGames: loadGames,
        resetDefaultGames,
        clearAllGames,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGames = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
};
