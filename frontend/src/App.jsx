import { BrowserRouter as Router } from 'react-router';
import Layout from './Layout'; 
import AuthPage from './pages/AuthPage';
import useAuth from './hooks/useAuth';

export default function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated ? <Layout /> : <AuthPage />}
    </Router>
  );
}
