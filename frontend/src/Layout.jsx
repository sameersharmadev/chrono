import { Routes, Route, useLocation } from 'react-router';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskPopup from './components/TaskPopup';
import TaskModalWrapper from './components/TaskModalWrapper';

import Dashboard from './pages/Dashboard';
import AuthSuccess from './pages/AuthSuccess';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Reminders from './pages/Reminders';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function usePageTitle() {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'dashboard';
  return path.charAt(0).toUpperCase() + path.slice(1);
}

export default function Layout() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const title = usePageTitle();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-[#1a1a1a] h-screen overflow-auto">
        <Header title={title} />
        <main className="p-6 relative">
          <Routes location={backgroundLocation || location}>
            {/* Main authenticated pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/" element={<Dashboard />} />

            {/* Modal routes */}
            <Route path="/task/:id" element={<TaskPopup />} />
            <Route path="/task/new" element={<TaskModalWrapper mode="new" />} />
            <Route path="/task/edit/:id" element={<TaskModalWrapper mode="edit" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
