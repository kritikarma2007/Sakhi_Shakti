import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import FloatingSOS from './components/FloatingSOS';
import AuthPage from './pages/AuthPage';
import SafetyTab from './pages/SafetyTab';
import HealthHubTab from './pages/HealthHubTab';
import SchemesTab from './pages/SchemesTab';
import SupportTab from './pages/SupportTab';
import {
  Shield,
  Heart,
  FileText,
  Users,
  WifiOff,
  Sparkles,
  PhoneCall
} from 'lucide-react';

/**
 * Animated Splash / Loading Screen
 * Shown for 1.5 seconds on initial application load
 */
function SplashScreen({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-600 via-rose-600 to-purple-800 text-white transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Loading SakhiShakti"
    >
      <div className="relative flex flex-col items-center text-center p-6 max-w-md w-full animate-in zoom-in-95 duration-500">
        {/* Glowing Pulsing Outer Ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-white/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md p-1 shadow-2xl flex items-center justify-center border-2 border-white/40">
            <span className="text-5xl select-none animate-bounce">🌸</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-lg mb-2">
          SakhiShakti
        </h1>

        {/* Hindi Brand Name */}
        <p className="text-xl font-bold text-pink-100 tracking-wide mb-3">
          सखीशक्ति
        </p>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-pink-100/90 font-medium max-w-xs leading-relaxed mb-8">
          Rural Women's Safety, Health & Empowerment Platform
          <span className="block text-[11px] text-pink-200 mt-1">
            ग्रामीण महिलाओं की सुरक्षा, स्वास्थ्य एवं सशक्तिकरण
          </span>
        </p>

        {/* Animated Progress Bar */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-white rounded-full animate-pulse w-3/4 shadow-glow" />
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-pink-200 font-semibold tracking-wide">
          <span className="px-2 py-0.5 rounded-full bg-white/10">🛡️ 24x7 SOS</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10">❤️ Health AI</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10">📜 Govt Schemes</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Layout & Content Area
 * Handles offline banner, tab switching, bottom navigation bar, and dark mode class
 */
function AppContent() {
  const { isDark } = useTheme();
  const { isOnline, tab, setTab, t, language } = useApp();
  const { authReady, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // 1.5s Animated Splash / Loading Screen on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 4 Bottom Navigation Bar Tabs
  const bottomTabs = [
    {
      id: 'safety',
      labelKey: 'tabs.safety',
      defaultLabel: 'Safety',
      hindiLabel: 'सुरक्षा',
      icon: Shield,
      activeGradient: 'from-red-600 to-rose-600',
      activeShadow: 'shadow-red-500/30',
      activeColor: 'text-red-600 dark:text-red-400',
      activeBg: 'bg-red-50 dark:bg-red-950/50'
    },
    {
      id: 'health',
      labelKey: 'tabs.health',
      defaultLabel: 'Health',
      hindiLabel: 'स्वास्थ्य',
      icon: Heart,
      activeGradient: 'from-pink-600 to-rose-500',
      activeShadow: 'shadow-pink-500/30',
      activeColor: 'text-pink-600 dark:text-pink-400',
      activeBg: 'bg-pink-50 dark:bg-pink-950/50'
    },
    {
      id: 'schemes',
      labelKey: 'tabs.schemes',
      defaultLabel: 'Schemes',
      hindiLabel: 'योजनाएं',
      icon: FileText,
      activeGradient: 'from-blue-600 to-indigo-600',
      activeShadow: 'shadow-blue-500/30',
      activeColor: 'text-blue-600 dark:text-blue-400',
      activeBg: 'bg-blue-50 dark:bg-blue-950/50'
    },
    {
      id: 'support',
      labelKey: 'tabs.support',
      defaultLabel: 'Support',
      hindiLabel: 'सहयोग',
      icon: Users,
      activeGradient: 'from-emerald-600 to-teal-600',
      activeShadow: 'shadow-emerald-500/30',
      activeColor: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-emerald-50 dark:bg-emerald-950/50'
    }
  ];

  const offlineBanner = !isOnline && (
    <div
      role="alert"
      aria-live="polite"
      className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center shadow-md flex items-center justify-center gap-2 sticky top-0 z-50"
    >
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span>
        {language === 'hi'
          ? 'आप ऑफ़लाइन हैं। आपातकालीन हेल्पलाइन नंबर अभी भी उपलब्ध हैं।'
          : 'You are offline. Emergency helplines still available.'}
      </span>
      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
        112 & 181
      </span>
    </div>
  );

  if (!authReady) {
    return (
      <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-slate-950`}>
        <SplashScreen isVisible />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 font-sans`}>
        {offlineBanner}
        <AuthPage />
        <FloatingSOS />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'dark' : ''
      } bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200 font-sans`}
    >
      {/* ─── Animated Splash / Loading Screen (1.5s) ─────────────── */}
      <SplashScreen isVisible={showSplash} />

      {/* ─── Offline Banner at Top ──────────────────────────────── */}
      {offlineBanner}

      {/* ─── Top Navbar ─────────────────────────────────────────── */}
      <Navbar />

      {/* ─── Main Content Area (renders current tab with fade-in) ─── */}
      <main className="flex-1 pb-24 lg:pb-12 transition-all duration-300">
        <div key={tab} className="animate-in fade-in duration-300">
          {tab === 'safety' && <SafetyTab />}
          {tab === 'health' && <HealthHubTab />}
          {tab === 'schemes' && <SchemesTab />}
          {tab === 'support' && <SupportTab />}
        </div>
      </main>

      {/* ─── Floating SOS Emergency Button (Always Visible) ─────── */}
      <FloatingSOS />

      {/* ─── Mobile-First Bottom Navigation Bar (4 Tabs) ─────────── */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 shadow-2xl px-2 py-1.5 flex items-center justify-around safe-area-bottom"
      >
        {bottomTabs.map((tabItem) => {
          const Icon = tabItem.icon;
          const isActive = tab === tabItem.id;
          const label =
            language === 'hi'
              ? tabItem.hindiLabel
              : t(tabItem.labelKey, tabItem.defaultLabel);

          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 py-1 px-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-300 select-none ${
                isActive
                  ? 'scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 active:scale-95'
              }`}
            >
              {/* Active Tab Gradient Pill */}
              <div
                className={`flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${tabItem.activeGradient} text-white shadow-md ${tabItem.activeShadow}`
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
              </div>

              {/* Bilingual Label */}
              <span
                className={`text-[11px] tracking-tight truncate max-w-[70px] ${
                  isActive
                    ? 'font-bold text-gray-900 dark:text-white'
                    : 'font-medium'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Root App Component
 * Wraps everything in ThemeProvider, AppProvider, AuthProvider, and SocketProvider
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
