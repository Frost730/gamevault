import React from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

interface GenreDistributionChartProps {
  data: Record<string, number>;
}

export const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sortedEntries = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedEntries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No genre data available.
      </div>
    );
  }

  const chartData = {
    labels: sortedEntries.map(([genre]) => genre),
    datasets: [
      {
        label: 'Games',
        data: sortedEntries.map(([_, count]) => count),
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.75)' : 'rgba(124, 58, 237, 0.85)',
        hoverBackgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        padding: 10,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { stepSize: 1, color: isDark ? '#94a3b8' : '#64748b' },
      },
    },
  };

  return (
    <div className="h-64 relative">
      <Bar data={chartData} options={options} />
    </div>
  );
};
