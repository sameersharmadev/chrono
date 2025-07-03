import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './Layout';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import useAuth from './hooks/useAuth';

export default function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen relative bg-white dark:bg-[#1a1a1a]">
        <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex justify-center items-center">
          <span className="w-6 h-6 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<Layout />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Home />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
