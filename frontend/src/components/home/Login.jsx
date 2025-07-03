import { useState } from 'react';
import { loginUser, registerUser } from '../../api/auth';
import { useNavigate } from 'react-router';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function Login({ isDark }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div className="w-full px-4 md:px-6 py-28 bg-[#f9fafb] text-black dark:bg-[#1a1a1a] dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">
        {/* Left Text */}
        <div className="w-full md:w-2/5 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-3 leading-tight">
            {mode === 'login' ? 'Welcome back to' : 'Create your account on'}{' '}
            <span className="text-[#cb00fb]">Chrono</span>
          </h2>
          <p className="text-base opacity-80">
            {mode === 'login'
              ? 'Log in to access your dashboard and tasks.'
              : 'Sign up to start managing your time with priorities and reminders.'}
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-3/5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg border outline-none text-sm
                  bg-white border-[#ccc] text-black
                  dark:bg-[#2a2a2a] dark:border-[#444] dark:text-white"
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg border outline-none text-sm
                  bg-white border-[#ccc] text-black
                  dark:bg-[#2a2a2a] dark:border-[#444] dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-5 py-2 rounded-lg font-medium inline-flex items-center justify-center gap-2
                ${loading ? 'bg-[#cb00fb88] cursor-not-allowed' : 'bg-[#cb00fb] hover:bg-[#b700e4]'}
                text-white transition`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn size={16} />
                  Login
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Sign Up
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="flex-grow border-t dark:border-[#333]" />
            <span className="text-sm opacity-50">OR</span>
            <hr className="flex-grow border-t dark:border-[#333]" />
          </div>

          {/* Google Login */}
          <div
            onClick={handleGoogleLogin}
            className="w-full md:w-fit flex items-center gap-2 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg
              hover:bg-gray-100 dark:hover:bg-[#2c2c2c] transition-colors cursor-pointer justify-center"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-sm text-gray-700 dark:text-gray-200">Continue with Google</span>
          </div>

          {/* Mode Switch + Error */}
          <div className="mt-2">
            <p className="text-sm opacity-70">
              {mode === 'login' ? 'Don’t have an account?' : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-[#cb00fb] hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
