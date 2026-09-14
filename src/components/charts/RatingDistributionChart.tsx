import React from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

interface RatingDistributionChartProps {
  data: Record<string, number>;
}

export const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels: ['1-2', '3-4', '5-6', '7-8', '9-10'],
    datasets: [
      {
        label: 'Games',
        data: [data['1-2'] || 0, data['3-4'] || 0, data['5-6'] || 0, data['7-8'] || 0, data['9-10'] || 0],
        backgroundColor: [
          '#f43f5e', // 1-2 Rose
          '#f97316', // 3-4 Orange
          '#eab308', // 5-6 Yellow
          '#06b6d4', // 7-8 Cyan
          '#10b981', // 9-10 Emerald
        ],
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
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
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
