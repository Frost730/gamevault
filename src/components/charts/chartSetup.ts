import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  RadialLinearScale
);

// Global Chart.js dark theme styling defaults
ChartJS.defaults.color = '#94a3b8'; // slate-400
ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';
