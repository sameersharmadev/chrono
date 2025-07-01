import { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, UserPlus, Loader2, Sun, Moon } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginUser, registerUser } from '../api/auth';
import { useNavigate } from 'react-router';
import dashboard from '../assets/images/dashboard.png';
import dashboardLight from '../assets/images/dashboardlight.png';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen flex dark:bg-black transition-colors duration-300">
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 py-10 bg-white dark:bg-[#121212] relative">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:scale-105 transition-transform"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>



        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
            <div className="flex items-center bg-gray-100 dark:bg-[#2a2a2a] rounded-lg px-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                type="email"
                className="w-full bg-transparent p-2 outline-none text-gray-900 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Password</label>
            <div className="flex items-center bg-gray-100 dark:bg-[#2a2a2a] rounded-lg px-3">
              <Lock className="w-4 h-4 text-gray-400" />
              <input
                type="password"
                className="w-full bg-transparent p-2 outline-none text-gray-900 dark:text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 ${loading ? 'bg-[#0e866a] cursor-not-allowed' : 'bg-[#10a37f] hover:bg-[#0e866a]'
              } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {loading
              ? mode === 'login'
                ? 'Logging in...'
                : 'Signing up...'
              : mode === 'login'
                ? 'Login'
                : 'Sign Up'}
          </button>
        </form>

        {/* Google Button */}
        <div className="w-full max-w-sm my-6">
          <div
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c2c2c] transition-colors cursor-pointer justify-center"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-sm text-gray-700 dark:text-gray-200">Continue with Google</span>
          </div>
        </div>

        {/* Switch Link */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button className="text-[#10a37f] hover:underline" onClick={() => setMode('signup')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="text-[#10a37f] hover:underline" onClick={() => setMode('login')}>
                Log in
              </button>
            </>
          )}
        </p>

        {/* Error Message */}
        <div className="w-full max-w-sm h-[44px] my-4 text-center">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-300 dark:border-red-500 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Banner */}
      <div
        className={`hidden md:flex w-1/2 flex-col items-center justify-center px-10 relative transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2a1a3b] to-[#1a1a1a] text-[#ad8cff]'
            : 'bg-gradient-to-br from-[#f9f5ff] via-[#e6e0ff] to-[#f9fafb] text-[#5e3ab7]'
          }`}
      >
        <img
          src={darkMode ? dashboard : dashboardLight}
          alt="Dashboard Preview"
          className="w-[90%] mb-8 drop-shadow-xl rounded-lg"
        />
        <div className="text-2xl md:text-3xl font-semibold text-center leading-snug max-w-xs">
          Your all-in-one task management app.
        </div>
      </div>


    </div>
  );
}
