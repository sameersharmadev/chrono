import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Bell,
    Clock,
    Pencil,
    AlertCircle,
    CalendarDays,
    CalendarCheck,
    AlarmClockCheck,
    AlarmClock
} from 'lucide-react';
import { format, isToday, isThisMonth } from 'date-fns';

export default function RemindersPage() {
    const [tasks, setTasks] = useState([]);
    const [editingReminder, setEditingReminder] = useState(null);
    const [newReminder, setNewReminder] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                const withReminders = data.filter(t => t.reminder);
                setTasks(withReminders);
                setLoading(false);
            });
    }, []);

    const updateReminder = (taskId) => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ reminder_time: newReminder })
        })
            .then(res => res.json())
            .then(() => {
                setEditingReminder(null);
                location.reload();
            });
    };

    const remindersToday = tasks.filter(t => isToday(new Date(t.reminder))).length;
    const remindersThisMonth = tasks.filter(t => isThisMonth(new Date(t.reminder))).length;
    const cardBg = 'bg-[#f2f2f5] dark:bg-[#2a2a2a]';

    return (
        <div className="min-h-[80vh] px-4 py-6 bg-[#f9fafb] dark:bg-[#1a1a1a] text-black dark:text-white relative">
            {loading && (
                <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex justify-center items-center">
                    <div className="flex flex-col items-center">
                        <span className="w-6 h-6 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl p-4 shadow-sm bg-white dark:bg-[#2a2a2a] flex items-center gap-3">
                        <AlarmClock className="text-yellow-500 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reminders Today</p>
                            <p className="text-lg font-semibold">{remindersToday}</p>
                        </div>
                    </div>
                    <div className="rounded-xl p-4 shadow-sm bg-white dark:bg-[#2a2a2a] flex items-center gap-3">
                        <AlarmClockCheck className="text-blue-500 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reminders This Month</p>
                            <p className="text-lg font-semibold">{remindersThisMonth}</p>
                        </div>
                    </div>
                    <div className="rounded-xl p-4 shadow-sm bg-white dark:bg-[#2a2a2a] flex items-center gap-3">
                        <CalendarCheck className="text-green-500 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Reminders</p>
                            <p className="text-lg font-semibold">{tasks.length}</p>
                        </div>
                    </div>
                </div>

                {!loading && tasks.length === 0 ? (
                    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        No tasks with reminders set.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task.id} className={`${cardBg} p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-2`}>
                                <div className="w-full md:w-auto">
                                    <div className="font-medium text-sm flex gap-2 items-center cursor-pointer hover:opacity-80" onClick={() => navigate(`/task/${task.id}`)}>
                                        {task.title}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 flex gap-2 mt-1">
                                        <CalendarDays className="w-4 h-4" /> Due: {task.due_date ? new Date(task.due_date).toLocaleString() : 'None'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {editingReminder === task.id ? (
                                        <>
                                            <input
                                                type="datetime-local"
                                                value={newReminder}
                                                onChange={(e) => setNewReminder(e.target.value)}
                                                className="text-sm rounded px-2 py-1 border dark:bg-[#1a1a1a] dark:border-[#444]"
                                            />
                                            <button
                                                onClick={() => updateReminder(task.id)}
                                                className="text-xs bg-[#a600fd] text-white px-3 py-1 rounded hover:bg-[#9200df] transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingReminder(null)}
                                                className="text-xs px-2 py-1 rounded hover:opacity-70"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-xs text-gray-800 dark:text-gray-300 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(task.reminder).toLocaleString()}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEditingReminder(task.id);
                                                    setNewReminder(task.reminder.slice(0, 16));
                                                }}
                                                className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
