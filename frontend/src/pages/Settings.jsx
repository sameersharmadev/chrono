import { useState } from 'react';
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [emailReminders, setEmailReminders] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-[70vh] text-black dark:text-white p-4 md:pr-12 sm:p-6 relative">
      <div className="flex flex-col gap-8 mx-auto">

        {/* Appearance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <LayoutDashboard size={16} className="text-violet-500" />
            Appearance
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-medium">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className="min-w-[130px] flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Bell size={16} className="text-yellow-500" />
            Notifications
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-medium">Email Reminders</span>
            <button
              onClick={() => setEmailReminders(!emailReminders)}
              className={`min-w-[130px] flex items-center justify-center gap-2 px-3 py-1.5 rounded ${
                emailReminders
                  ? 'bg-violet-500 text-white hover:bg-violet-600'
                  : 'bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a]'
              }`}
            >
              {emailReminders ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Integrations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="text-blue-500" />
            Integrations
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-medium">Google Calendar</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon...</span>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ShieldCheck size={16} className="text-green-500" />
            Preferences
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-medium">Enable Advanced Mode</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon...</span>
          </div>
        </div>

        {/* Account */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User size={16} />
            Account
          </div>
          <div className="text-sm mb-2">
          </div>
          <button
            onClick={() => {
              fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`, {
                method: 'POST',
                credentials: 'include',
              }).then(() => {
                window.location.href = '/';
              });
            }}
            className="min-w-[130px] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2 text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
