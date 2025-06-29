const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return res.json();
}

export async function registerUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }

  return res.json();
}

export async function getCurrentUser(options = {}) {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: 'include',
    ...options,
  });

  if (!res.ok) return null;
  return res.json();
}

export async function logoutUser() {
  await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
