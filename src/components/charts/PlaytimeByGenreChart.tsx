import React from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

interface PlaytimeByGenreChartProps {
  data: Record<string, number>;
}

export const PlaytimeByGenreChart: React.FC<PlaytimeByGenreChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sorted = Object.entries(data)
    .filter(([_, hours]) => hours > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (sorted.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No playtime recorded yet.
      </div>
    );
  }

  const chartData = {
    labels: sorted.map(([genre]) => genre),
    datasets: [
      {
        label: 'Hours Played',
        data: sorted.map(([_, hours]) => hours),
        backgroundColor: isDark ? 'rgba(6, 182, 212, 0.75)' : 'rgba(14, 165, 233, 0.85)',
        hoverBackgroundColor: '#06b6d4',
        borderColor: '#0284c7',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
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
        callbacks: {
          label: (context: any) => `${context.raw} hours`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
      },
      y: {
        grid: { display: false },
        ticks: { color: isDark ? '#cbd5e1' : '#334155', font: { size: 12 } },
      },
    },
  };

  return (
    <div className="h-64 relative">
      <Bar data={chartData} options={options} />
    </div>
  );
};
