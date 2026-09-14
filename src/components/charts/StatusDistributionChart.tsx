import React from 'react';
import './chartSetup';
import { Doughnut } from 'react-chartjs-2';
import { GameStatus } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface StatusDistributionChartProps {
  data: Record<GameStatus, number>;
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const activeEntries = Object.entries(data).filter(([_, count]) => count > 0);

  if (activeEntries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No status data available.
      </div>
    );
  }

  const statusColorMap: Record<string, string> = {
    Playing: '#10b981', // Emerald
    Completed: '#6366f1', // Indigo
    Backlog: '#f59e0b', // Amber
    Wishlist: '#ec4899', // Pink
    Paused: '#3b82f6', // Blue
    Dropped: '#f43f5e', // Rose
  };

  const chartData = {
    labels: activeEntries.map(([status]) => status),
    datasets: [
      {
        data: activeEntries.map(([_, count]) => count),
        backgroundColor: activeEntries.map(([status]) => statusColorMap[status] || '#64748b'),
        borderWidth: 2,
        borderColor: isDark ? '#101726' : '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: isDark ? '#cbd5e1' : '#475569',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        padding: 10,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-64 relative">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
