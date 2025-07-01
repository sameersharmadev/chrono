import { Home, Calendar, ListTodo, AlarmClock, BarChart3, Settings, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ListTodo size={18} />, label: 'Tasks', path: '/tasks' },
    { icon: <Calendar size={18} />, label: 'Calendar', path: '/calendar' },
    { icon: <AlarmClock size={18} />, label: 'Reminders', path: '/reminders' },
    { icon: <BarChart3 size={18} />, label: 'Stats', path: '/reports' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="sm:hidden p-3 text-black bg-transparent dark:bg-[#1a1a1a] dark:text-white fixed top-2 left-4 z-50 bg-gray-200 rounded-md"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed sm:static top-0 left-0 z-50 h-screen w-64
          bg-[#ececec] text-black dark:bg-[#2a2a2a] dark:text-white
          flex flex-col justify-between
          p-4 border-r border-gray-300 dark:border-gray-700
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:transform-none
        `}
      >
        {/* Branding + Nav */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-8">
            <img src="/chrono.svg" alt="Chrono Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-wide">Chrono</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ icon, label, path }) => (
              <NavItem
                key={path}
                icon={icon}
                label={label}
                path={path}
                isActive={currentPath === path}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* Sticky Footer (Settings) */}
        <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            path="/settings"
            isActive={currentPath === '/settings'}
            onClick={() => setOpen(false)}
          />
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, path, onClick, isActive }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center w-full gap-3 p-2 rounded-md transition
        ${isActive
          ? 'bg-gray-300 dark:bg-[#3a3a3a] font-semibold'
          : 'hover:bg-gray-200 dark:hover:bg-[#2a2a2a]'}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
