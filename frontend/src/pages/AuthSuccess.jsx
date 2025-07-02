import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;

      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Logging you in...</p>;
}
