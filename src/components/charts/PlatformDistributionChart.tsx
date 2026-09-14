import React from 'react';
import './chartSetup';
import { Doughnut } from 'react-chartjs-2';
import { GamePlatform } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PlatformDistributionChartProps {
  data: Record<GamePlatform, number>;
}

export const PlatformDistributionChart: React.FC<PlatformDistributionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const activeEntries = Object.entries(data).filter(([_, count]) => count > 0);

  if (activeEntries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No platform data available.
      </div>
    );
  }

  const chartData = {
    labels: activeEntries.map(([platform]) => platform),
    datasets: [
      {
        data: activeEntries.map(([_, count]) => count),
        backgroundColor: [
          '#3b82f6', // PC - Blue
          '#6366f1', // PlayStation - Indigo
          '#10b981', // Xbox - Emerald
          '#ef4444', // Nintendo Switch - Red
          '#a855f7', // Mobile - Purple
          '#64748b', // Other - Slate
        ],
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
