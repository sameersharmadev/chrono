import { useEffect, useState, useRef } from 'react';
import Calendar from 'react-calendar';
import { format, isToday } from 'date-fns';
import {
  Bell,
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function CalendarPage() {
  const [taskMap, setTaskMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, due: 0, reminder: 0 });
  const [loading, setLoading] = useState(true);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const start = new Date();
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    setLoading(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/calendar?start=${start.toISOString()}&end=${end.toISOString()}`,
      { credentials: 'include' }
    )
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        const counts = {
          total: data.length,
          completed: 0,
          due: 0,
          reminder: 0
        };

        for (const task of data) {
          const due = task.due_date?.split('T')[0];
          const reminder = task.reminder?.split('T')[0];
          const created = task.created_at?.split('T')[0];
          const fallback = due || reminder || created;
          if (!fallback) continue;

          if (task.status === 'completed') counts.completed++;

          if (due) {
            map[due] = map[due] || { due: [], reminder: [], in_progress: [] };
            map[due].due.push(task);
          }

          if (reminder) {
            map[reminder] = map[reminder] || { due: [], reminder: [], in_progress: [] };
            map[reminder].reminder.push(task);
          }

          if (task.status === 'in_progress') {
            map[fallback] = map[fallback] || { due: [], reminder: [], in_progress: [] };
            map[fallback].in_progress.push(task);
          }
        }

        counts.due = Object.values(map).reduce((acc, val) => acc + val.due.length, 0);
        counts.reminder = Object.values(map).reduce((acc, val) => acc + val.reminder.length, 0);

        setTaskMap(map);
        setStats(counts);
      })
      .catch((err) => console.error('Failed to fetch calendar data:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  const tileContent = ({ date }) => {
    const key = format(date, 'yyyy-MM-dd');
    const tasks = taskMap[key];
    if (!tasks) return null;

    return (
      <div className="!flex !flex-col !gap-1 !text-[10px] sm:!text-xs !pt-1 !px-1 !overflow-visible !w-full">
        {tasks.due.length > 0 && (
          <div className="!flex !items-center !gap-1 !px-1.5 !py-0.5 !rounded-full !bg-red-500/10 !text-red-600 dark:!text-red-400 !border !border-red-300 dark:!border-red-600 !text-[11px] !font-medium !w-fit">
            <AlertTriangle className="!w-3 !h-3" />
            <span className="!hidden sm:!inline">Due:</span>
            <span className="!hidden sm:!inline">{tasks.due.length}</span>
          </div>
        )}
        {tasks.reminder.length > 0 && (
          <div className="!flex !items-center !gap-1 !px-1.5 !py-0.5 !rounded-full !bg-yellow-300/10 !text-yellow-600 dark:!text-yellow-400 !border !border-yellow-400 dark:!border-yellow-500 !text-[11px] !font-medium !w-fit">
            <Bell className="!w-3 !h-3" />
            <span className="!hidden sm:!inline">Reminder:</span>
            <span className="!hidden sm:!inline">{tasks.reminder.length}</span>
          </div>
        )}
      </div>
    );
  };

  const tileClassName = ({ date }) => {
    const base =
      '!min-h-[80px] sm:!min-h-[90px] !flex !flex-col !items-start !justify-start !px-1.5 !pt-1.5 !pb-2 !rounded-md !text-xs sm:!text-sm !transition';

    if (isToday(date)) {
      return `${base} !bg-gradient-to-br !from-blue-200/30 !to-blue-100 dark:!from-blue-900/20 dark:!to-blue-700/10 !border !border-blue-400 dark:!border-blue-600 !text-black dark:!text-white`;
    }

    return base;
  };

  const handleDateClick = (value) => {
    const key = format(value, 'yyyy-MM-dd');
    if (taskMap[key]) {
      setSelectedDate({ date: key, ...taskMap[key] });
      setShowPopup(true);
    }
  };

  const upcomingTask = Object.values(taskMap)
    .flatMap((day) => day.due)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];

  return (
    <div className="!min-h-[60vh] !bg-[#f9fafb] dark:!bg-[#1a1a1a] !text-black dark:!text-white !px-2 !-mt-4 relative">
      <div className="!max-w-4xl !w-full !mx-auto relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex justify-center items-center">
            <div className="flex flex-col items-center">
              <span className="w-6 h-6 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { icon: <CalendarDays className="w-4 h-4 text-blue-500" />, label: 'Total', value: stats.total },
            { icon: <CheckCircle className="w-4 h-4 text-green-500" />, label: 'Completed', value: stats.completed },
            { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, label: 'Due', value: stats.due },
            { icon: <Bell className="w-4 h-4 text-yellow-500" />, label: 'Reminders', value: stats.reminder }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white dark:bg-[#2a2a2a] p-2 rounded-xl shadow-sm text-xs sm:text-sm">
              {item.icon}
              <div className="font-medium">{item.label}: {item.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-3 bg-white dark:bg-[#2a2a2a] p-3 rounded-xl shadow-sm text-sm">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <div className="font-semibold">Next Due Task</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {upcomingTask?.title || 'No upcoming task'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-[#2a2a2a] p-3 rounded-xl shadow-sm text-sm">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-semibold">Streak</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">2 days in a row</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-lg p-2 sm:p-4">
          <Calendar
            onClickDay={handleDateClick}
            tileContent={tileContent}
            calendarType="gregory"
            showNavigation={false}
            className="!w-full !rounded-xl !border-none !text-sm !bg-white dark:!bg-[#2a2a2a] !text-black dark:!text-white
            [&_.react-calendar__tile]:!text-decoration-none
            [&_abbr]:!no-underline
            [&_.react-calendar__tile--active]:!bg-violet-100 dark:[&_.react-calendar__tile--active]:!bg-violet-500/20
            [&_.react-calendar__tile--active]:!text-black dark:[&_.react-calendar__tile--active]:!text-white
            [&_.react-calendar__tile--active]:!border !border-violet-400 dark:!border-violet-500"
            tileClassName={tileClassName}
          />
        </div>

        {showPopup && selectedDate && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <div
              ref={popupRef}
              className="bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded-xl max-w-md w-11/12 p-4 shadow-lg relative"
            >
              <h2 className="text-lg font-semibold mb-2">
                Tasks on {format(new Date(selectedDate.date), 'MMM dd, yyyy')}
              </h2>

              {selectedDate.due.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Due Tasks</span>
                  </div>
                  <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                    {selectedDate.due.map((task) => (
                      <li
                        key={task.id}
                        onClick={() => navigate(`/task/${task.id}`)}
                        className="cursor-pointer hover:opacity-80"
                      >
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedDate.reminder.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
                    <Bell className="w-4 h-4" />
                    <span className="font-medium">Reminders</span>
                  </div>
                  <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                    {selectedDate.reminder.map((task) => (
                      <li
                        key={task.id}
                        onClick={() => navigate(`/task/${task.id}`)}
                        className="cursor-pointer hover:opacity-80"
                      >
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedDate.due.length === 0 && selectedDate.reminder.length === 0 && (
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  No tasks or reminders for this day.
                </div>
              )}

              <button
                className="absolute top-2 right-3 text-zinc-500 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-white transition"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
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
    </div>
  );
}
