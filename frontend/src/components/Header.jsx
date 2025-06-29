import { Bell, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '../api/auth';

export default function Header({ title = 'Dashboard' }) {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }

        getCurrentUser().then((data) => {
            if (data?.user) {
                setUser(data.user); 
            } else {
                setUser(null);
            }
        });
    }, []);

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        setDarkMode(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        await logoutUser();
        window.location.reload();
    };

    return (
        <header className="w-full flex items-center justify-between px-4 py-3 border-gray-300 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#1a1a1a]">
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

                {/* Notification */}
                <button
                    className="p-2 rounded-md relative hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                        3
                    </span>
                </button>

                {/* Profile */}
                <div className="relative">
                    <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="w-8 select-none h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white hover:opacity-80"
                    >
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-3 text-sm z-50">
                            <p className="text-gray-800 dark:text-white mb-2 break-words">{user?.email}</p>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-red-500 hover:underline"
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
