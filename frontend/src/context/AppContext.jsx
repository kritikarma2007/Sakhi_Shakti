import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

const dictionaries = {
  en,
  hi
};

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // ─── Language State ('en' | 'hi') ──────────────────────────────
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhi_language');
      return saved === 'hi' || saved === 'en' ? saved : 'hi';
    } catch {
      return 'hi';
    }
  });

  const setLanguage = useCallback((lang) => {
    const validLang = lang === 'hi' ? 'hi' : 'en';
    setLanguageState(validLang);
    try {
      localStorage.setItem('sakhi_language', validLang);
    } catch (err) {
      console.warn('Unable to persist language preference', err);
    }
  }, []);

  // ─── Translation Function t(key) ───────────────────────────────
  const t = useCallback((key, fallback) => {
    if (!key) return '';
    const dict = dictionaries[language] || dictionaries.en || {};

    // Helper to resolve dot-notated paths e.g. "sos.call112"
    const resolve = (obj, path) => {
      if (!obj || typeof obj !== 'object') return undefined;
      const parts = path.split('.');
      let current = obj;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
      return current;
    };

    let translation = resolve(dict, key);

    // Fallback to English dictionary if missing in current language
    if (translation === undefined && language !== 'en') {
      translation = resolve(dictionaries.en, key);
    }

    // Direct key lookup
    if (translation === undefined) {
      translation = dict[key] ?? dictionaries.en?.[key];
    }

    if (typeof translation === 'string') {
      return translation;
    }

    return fallback !== undefined ? fallback : key;
  }, [language]);

  // ─── Online / Offline State ────────────────────────────────────
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ─── Active Tab State ('safety' | 'health' | 'schemes' | 'support') ───
  const [tab, setTab] = useState('safety');

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isOnline,
    tab,
    setTab
  }), [language, setLanguage, t, isOnline, tab]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
