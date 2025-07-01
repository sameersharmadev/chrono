import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Plus,
    CheckCircle,
    AlertTriangle,
    Bell,
    CalendarDays,
    TrendingUp,
    Flame,
    Tag
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

export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topTags, setTopTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
  const load = async () => {
    const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, { credentials: 'include' });
    if (!userRes.ok) return setLoading(false); 

    const [summary, tasks, tags] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats/weekly-summary`, { credentials: 'include' }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, { credentials: 'include' }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tags`, { credentials: 'include' }).then(res => res.json())
    ]);

    setSummary(summary);
    setTasks(tasks);
    setTopTags(tags.slice(0, 5));
    setLoading(false);
  };

  load();
}, []);

    const cardBg = 'bg-[#f2f2f5] dark:bg-[#2a2a2a]';

    const completedCount = tasks.filter(t => t.status === 'done').length;
    const dueCount = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length;
    const reminderCount = tasks.filter(t => t.reminder).length;

    const priorityColor = {
        high: 'bg-red-500/20 text-red-500',
        medium: 'bg-yellow-500/20 text-yellow-600',
        low: 'bg-green-500/20 text-green-600'
    };

    return (
        <div className="min-h-[70vh] px-4 py-6 bg-[#f9fafb] dark:bg-[#1a1a1a] text-black dark:text-white relative">
            {/* ⏳ Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex justify-center items-center">
                    <span className="w-6 h-6 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                </div>
            )}

            {!loading && (
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
                        {[
                            { icon: <CalendarDays className="text-blue-500 w-5 h-5" />, label: 'Total Tasks', value: tasks.length },
                            { icon: <CheckCircle className="text-green-500 w-5 h-5" />, label: 'Completed', value: completedCount },
                            { icon: <AlertTriangle className="text-red-500 w-5 h-5" />, label: 'Due', value: dueCount },
                            { icon: <Bell className="text-yellow-500 w-5 h-5" />, label: 'Reminders', value: reminderCount }
                        ].map((item, i) => (
                            <div key={i} className={`${cardBg} p-4 rounded-xl shadow-sm flex items-center gap-3`}>
                                {item.icon}
                                <div>
                                    <div className="text-sm font-medium">{item.label}</div>
                                    <div className="text-lg font-semibold">{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Compact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recent Tasks */}
                        <div className={`${cardBg} p-4 rounded-xl shadow-md w-full`}>
                            <h2 className="text-base font-semibold mb-3">Recent Tasks</h2>
                            {tasks.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks found.</p>
                            ) : (
                                <ul className="text-sm divide-y divide-gray-300 dark:divide-[#3a3a3a]">
                                    {tasks.slice(0, 5).map((task) => (
                                        <li
                                            key={task.id}
                                            onClick={() => navigate(`/task/${task.id}`)}
                                            className="cursor-pointer py-2 hover:opacity-80"
                                        >
                                            <div className="font-medium flex justify-between">
                                                <span>{task.title}</span>
                                                {task.priority && (
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColor[task.priority] || ''}`}>{task.priority}</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 flex gap-2">
                                                {task.due_date && <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Top Tags */}
                            {topTags.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1"><Tag className="w-4 h-4" />Top Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {topTags.map((tag) => (
                                            <span key={tag.id} className="px-2 py-0.5 text-xs rounded-full bg-[#e5e5e5] dark:bg-[#3a3a3a]">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Weekly Summary Chart */}
                        <div className={`${cardBg} p-4 rounded-xl shadow-md w-full`}>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                                <h2 className="text-base font-semibold">Weekly Summary</h2>
                            </div>
                            <div className="h-56 w-full">
                                <Bar
                                    data={{
                                        labels: summary.map(item => new Date(item.date).toLocaleDateString()),
                                        datasets: [
                                            {
                                                data: summary.map(item => item.percentage),
                                                backgroundColor: '#a600fd',
                                                borderRadius: 6,
                                                barThickness: 26
                                            }
                                        ]
                                    }}
                                    options={{
                                        layout: { padding: { top: 20 } },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { color: '#aaa' },
                                                grid: { display: false, drawBorder: false }
                                            },
                                            x: {
                                                ticks: { color: '#aaa' },
                                                grid: { display: false }
                                            }
                                        },
                                        plugins: { legend: { display: false } },
                                        responsive: true,
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[{
                            label: 'View All Tasks',
                            href: '/tasks',
                            icon: <CalendarDays className="w-5 h-5 text-blue-500" />
                        }, {
                            label: 'Upcoming Reminders',
                            href: '/reminders',
                            icon: <Bell className="w-5 h-5 text-yellow-500" />
                        }, {
                            label: 'Calendar View',
                            href: '/calendar',
                            icon: <Flame className="w-5 h-5 text-orange-500" />
                        }].map((link, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(link.href)}
                                className={`cursor-pointer ${cardBg} p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3`}
                            >
                                {link.icon}
                                <div className="font-medium text-sm">{link.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate('/task/new')}
                className="fixed bottom-8 right-8 z-40 bg-violet-600 hover:bg-violet-700 text-white px-4 py-4 rounded-full shadow-lg transition"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>
    );
}
