import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  Flame,
  ListTodo,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState(null);
  const [streakStats, setStreakStats] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats`, { credentials: 'include' }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats/streak`, { credentials: 'include' }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats/weekly-summary`, { credentials: 'include' }).then(res => res.json())
    ]).then(([stats, streaks, summary]) => {
      setTaskStats(stats);
      setStreakStats(streaks);
      setWeeklySummary(summary);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch stats:', err);
      setLoading(false);
    });
  }, []);

  const cardBg = 'bg-white dark:bg-[#2a2a2a]';

  const statCards = taskStats ? [
    { icon: <ListTodo className="text-blue-500 w-5 h-5" />, label: 'Total Tasks', value: taskStats.total },
    { icon: <CheckCircle className="text-green-500 w-5 h-5" />, label: 'Completed Today', value: taskStats.completed_today },
    { icon: <Clock className="text-orange-500 w-5 h-5" />, label: 'Completed This Week', value: taskStats.completed_this_week },
    { icon: <TrendingUp className="text-purple-500 w-5 h-5" />, label: 'In Progress', value: taskStats.in_progress },
    { icon: <CheckCircle className="text-green-600 w-5 h-5" />, label: 'Done', value: taskStats.done },
    { icon: <Flame className="text-red-500 w-5 h-5" />, label: 'Todo', value: taskStats.todo },
    { icon: <Flame className="text-yellow-500 w-5 h-5" />, label: 'Current Streak', value: streakStats?.currentStreak || 0 },
    { icon: <Flame className="text-pink-500 w-5 h-5" />, label: 'Longest Streak', value: streakStats?.longestStreak || 0 }
  ] : [];

  return (
    <div className="h-[70vh] px-4 py-6 bg-[#f9fafb] dark:bg-[#1a1a1a] text-black dark:text-white -mt-8 relative">
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex justify-center items-center">
          <span className="w-6 h-6 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Grid Stats */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {!loading && statCards.map((stat, i) => (
            <div key={i} className={`${cardBg} p-4 rounded-xl shadow flex items-center gap-3`}>
              {stat.icon}
              <div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-xl font-semibold">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className={`${cardBg} p-4 rounded-xl shadow`}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold">Weekly Completion Summary</h2>
          </div>
          <div className="h-64 w-full">
            {!loading && weeklySummary.length > 0 ? (
              <Bar
                data={{
                  labels: weeklySummary.map(item => new Date(item.date).toLocaleDateString()),
                  datasets: [{
                    label: 'Completion %',
                    data: weeklySummary.map(item => item.percentage),
                    backgroundColor: '#a600fd',
                    borderRadius: 6,
                    barThickness: 26
                  }]
                }}
                options={{
                  layout: { padding: { top: 20 } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { color: '#aaa', callback: v => `${v}%` },
                      grid: { display: false, drawBorder: false }
                    },
                    x: {
                      ticks: { color: '#aaa' },
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.parsed.y}% complete`
                      }
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            ) : (
              <div className="h-full w-full rounded bg-gray-300 dark:bg-[#3a3a3a] animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
