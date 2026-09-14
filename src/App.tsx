import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import { GoalProvider } from './context/GoalContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { FilteredGamesPage } from './pages/FilteredGamesPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <GoalProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route
                  path="playing"
                  element={
                    <FilteredGamesPage
                      status="Playing"
                      title="Currently Playing"
                      subtitle="Games currently in your active gaming rotation"
                      iconColor="text-emerald-400"
                    />
                  }
                />
                <Route
                  path="completed"
                  element={
                    <FilteredGamesPage
                      status="Completed"
                      title="Hall of Fame (Completed)"
                      subtitle="Games you have conquered from start to finish"
                      iconColor="text-indigo-400"
                    />
                  }
                />
                <Route
                  path="backlog"
                  element={
                    <FilteredGamesPage
                      status="Backlog"
                      title="Backlog Queue"
                      subtitle="Games waiting in line for your next grand adventure"
                      iconColor="text-amber-400"
                    />
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <FilteredGamesPage
                      status="Wishlist"
                      title="Wishlist & Upcoming"
                      subtitle="Games you plan to acquire or anticipate playing"
                      iconColor="text-pink-400"
                    />
                  }
                />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </HashRouter>
        </GoalProvider>
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
