import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // ─── Theme State ('light' | 'dark') ────────────────────────────
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('sakhi_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  // ─── Sync with document.documentElement & localStorage ────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('sakhi_theme', theme);
    } catch (err) {
      console.warn('Unable to persist theme in localStorage', err);
    }
  }, [theme]);

  // ─── Toggle Theme Function ────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    const valid = newTheme === 'dark' ? 'dark' : 'light';
    setThemeState(valid);
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark'
  }), [theme, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
