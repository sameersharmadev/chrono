import { Bell, Sun, Moon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getCurrentUser, logoutUser } from '../api/auth';
import { useNavigate } from 'react-router';

export default function Header({ title = 'Dashboard' }) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }

    getCurrentUser().then((data) => {
      setUser(data?.user || null);
    });

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reminders/recent`, {
      credentials: 'include', 
    })      .then((res) => res.json())
      .then((data) => {
        setReminders(data.reminders || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = reminders.filter((r) => !r.is_read).length;

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reminders/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_read: true } : r)));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleReminderClick = async (id) => {
    await markAsRead(id);
    navigate(`/task/${id}`);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 w-full flex items-center justify-between px-4 py-3 border-gray-300 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#1a1a1a] backdrop-blur supports-[backdrop-filter]:bg-[#f9fafb]/60 dark:supports-[backdrop-filter]:bg-[#1a1a1a]/60">
      <h2 className="text-xl font-semibold tracking-wide text-gray-800 dark:text-white pl-12 md:pl-0">
        {title}
      </h2>

      <div className="flex items-center gap-4 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded-md relative hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#f9fafb] dark:bg-[#2a2a2a] rounded-lg shadow-xl p-4 text-sm z-50 border border-gray-200 dark:border-[#3a3a3a]">
              <p className="font-semibold text-gray-800 dark:text-white mb-2">Reminders</p>
              {reminders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No reminders</p>
              ) : (
                <ul className="space-y-2">
                  {reminders.map((r) => (
                    <li
                      key={r.id}
                      onClick={() => handleReminderClick(r.id)}
                      className={`cursor-pointer px-3 py-2 rounded-md flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${!r.is_read
                          ? 'font-semibold text-black dark:text-white'
                          : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                      <Bell size={16} className="shrink-0 mt-0.5" />
                      <span
                        className="truncate max-w-[220px]"
                        title={
                          r.title +
                          (r.due_date
                            ? ` (Due ${new Date(r.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })})`
                            : '')
                        }
                      >
                        {r.title.length > 40 ? r.title.slice(0, 40) + '...' : r.title}
                        {r.due_date && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {'  (Due '}
                            {new Date(r.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}{')'}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white hover:opacity-80 select-none"
          >
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#f9fafb] dark:bg-[#2a2a2a] rounded-lg shadow-lg p-3 text-sm z-50">
              <p className="text-gray-800 dark:text-white mb-2 break-words">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:opacity-80"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
