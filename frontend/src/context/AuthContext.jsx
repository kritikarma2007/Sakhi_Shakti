import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const AuthContext = createContext(null);

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // In dev mode connecting to localhost backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  return '';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearStoredSession = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('sakhi_token');
      localStorage.removeItem('sakhi_user');
    } catch (err) {
      console.warn('Error clearing stored authentication', err);
    }
  }, []);

  const saveSession = useCallback((data) => {
    if (!data?.token || !data?.user) {
      throw new Error('The server returned an invalid sign-in response.');
    }
    const userData = { ...data.user, token: data.token };
    setUser(userData);
    try {
      localStorage.setItem('sakhi_token', data.token);
      localStorage.setItem('sakhi_user', JSON.stringify(data.user));
    } catch (err) {
      console.warn('Could not persist authentication to localStorage', err);
    }
    return userData;
  }, []);

  useEffect(() => {
    let active = true;
    const verifyStoredSession = async () => {
      let token = null;
      try {
        token = localStorage.getItem('sakhi_token');
      } catch (err) {
        console.warn('Unable to read stored authentication', err);
      }

      if (!token) {
        if (active) setAuthReady(true);
        return;
      }

      try {
        const response = await fetch(`${getApiBase()}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          clearStoredSession();
        } else {
          const data = await response.json();
          if (active) setUser({ ...data.user, token });
        }
      } catch (err) {
        console.warn('Unable to verify saved session', err);
        clearStoredSession();
      } finally {
        if (active) setAuthReady(true);
      }
    };

    verifyStoredSession();
    return () => { active = false; };
  }, [clearStoredSession]);

  // ─── Login Function (POST /api/auth/login) ─────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    const apiBase = getApiBase();
    const endpoint = `${apiBase}/api/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      return saveSession(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  // ─── Logout Function ───────────────────────────────────────────
  const logout = useCallback(() => {
    clearStoredSession();
    setError(null);
  }, [clearStoredSession]);

  // ─── Register Function (Helper) ────────────────────────────────
  const register = useCallback(async ({ name, email, password, state = '', language = 'hi' }) => {
    setLoading(true);
    setError(null);

    const apiBase = getApiBase();
    const endpoint = `${apiBase}/api/auth/register`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, state, language })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return saveSession(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  // ─── Derived State ─────────────────────────────────────────────
  const isAuthenticated = Boolean(user && user.token);

  const value = useMemo(() => ({
    user,
    token: user?.token || null,
    isAuthenticated,
    authReady,
    loading,
    error,
    login,
    logout,
    register
  }), [user, isAuthenticated, authReady, loading, error, login, logout, register]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
