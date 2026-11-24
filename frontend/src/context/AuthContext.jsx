import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const AuthContext = createContext(null);

const DEMO_CREDENTIALS = {
  USER: {
    email: 'demo@sakhishakti.in',
    password: 'Demo@123',
    name: 'Pooja Sharma',
    role: 'USER',
    state: 'Rajasthan',
    language: 'hi'
  },
  DOCTOR: {
    email: 'doctor@sakhishakti.in',
    password: 'Demo@123',
    name: 'Dr. Sunita Rao',
    role: 'DOCTOR',
    state: 'Madhya Pradesh',
    language: 'hi'
  },
  VOLUNTEER: {
    email: 'volunteer@sakhishakti.in',
    password: 'Demo@123',
    name: 'Anjali Verma',
    role: 'VOLUNTEER',
    state: 'Uttar Pradesh',
    language: 'hi'
  },
  ADMIN: {
    email: 'admin@sakhishakti.in',
    password: 'Demo@123',
    name: 'Sakhi Admin',
    role: 'ADMIN',
    state: 'Delhi',
    language: 'en'
  }
};

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
  // ─── Initialize User from localStorage ─────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem('sakhi_token');
      const storedUser = localStorage.getItem('sakhi_user');
      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        return { ...parsed, token: storedToken };
      }
    } catch (err) {
      console.warn('Error reading stored auth state', err);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const userData = {
        ...data.user,
        token: data.token
      };

      setUser(userData);
      try {
        localStorage.setItem('sakhi_token', data.token);
        localStorage.setItem('sakhi_user', JSON.stringify(data.user));
      } catch (e) {
        console.warn('Could not persist auth to localStorage', e);
      }

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Quick Demo Login Function ─────────────────────────────────
  const demoLogin = useCallback(async (roleInput = 'USER') => {
    const roleKey = (roleInput || 'USER').toUpperCase();
    const demoProfile = DEMO_CREDENTIALS[roleKey] || DEMO_CREDENTIALS.USER;

    try {
      // First try live backend login
      return await login(demoProfile.email, demoProfile.password);
    } catch (err) {
      console.warn('[AuthContext] Backend login unavailable for demo, falling back to local demo profile:', err.message);

      // Graceful offline / demo fallback
      const mockToken = `demo_token_${roleKey.toLowerCase()}_${Date.now()}`;
      const mockUser = {
        _id: `demo_${roleKey.toLowerCase()}`,
        name: demoProfile.name,
        email: demoProfile.email,
        role: demoProfile.role,
        state: demoProfile.state,
        language: demoProfile.language,
        token: mockToken
      };

      setUser(mockUser);
      try {
        localStorage.setItem('sakhi_token', mockToken);
        localStorage.setItem('sakhi_user', JSON.stringify(mockUser));
      } catch (storageErr) {
        console.warn('Error saving mock user to storage', storageErr);
      }

      return mockUser;
    }
  }, [login]);

  // ─── Logout Function ───────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    try {
      localStorage.removeItem('sakhi_token');
      localStorage.removeItem('sakhi_user');
    } catch (err) {
      console.warn('Error clearing localStorage auth items', err);
    }
  }, []);

  // ─── Register Function (Helper) ────────────────────────────────
  const register = useCallback(async ({ name, email, password, role = 'USER', state = '', language = 'hi' }) => {
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
        body: JSON.stringify({ name, email: email.trim(), password, role, state, language })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const userData = {
        ...data.user,
        token: data.token
      };

      setUser(userData);
      try {
        localStorage.setItem('sakhi_token', data.token);
        localStorage.setItem('sakhi_user', JSON.stringify(data.user));
      } catch (e) {
        console.warn('Could not persist auth to localStorage', e);
      }

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Derived State ─────────────────────────────────────────────
  const isAuthenticated = Boolean(user && user.token);

  const value = useMemo(() => ({
    user,
    token: user?.token || null,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    demoLogin,
    register
  }), [user, isAuthenticated, loading, error, login, logout, demoLogin, register]);

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
