import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Heart,
  BookOpen,
  Users,
  Globe,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Menu,
  X,
  ChevronDown,
  User,
  Stethoscope,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Check,
  LogOut,
  PhoneCall,
  Bell
} from 'lucide-react';

const TABS = [
  {
    id: 'safety',
    labelKey: 'tabs.safety',
    defaultLabel: 'Safety & SOS',
    hindiLabel: 'सुरक्षा एवं एसओएस',
    icon: Shield,
    badge: '24x7'
  },
  {
    id: 'health',
    labelKey: 'tabs.health',
    defaultLabel: 'Health Hub',
    hindiLabel: 'स्वास्थ्य केंद्र',
    icon: Heart,
    badge: 'AI'
  },
  {
    id: 'schemes',
    labelKey: 'tabs.schemes',
    defaultLabel: 'Govt Schemes',
    hindiLabel: 'सरकारी योजनाएं',
    icon: BookOpen,
    badge: '15+'
  },
  {
    id: 'support',
    labelKey: 'tabs.support',
    defaultLabel: 'Community',
    hindiLabel: 'सामुदायिक सहयोग',
    icon: Users,
    badge: null
  }
];

const ROLES = [
  {
    id: 'USER',
    label: 'User / Citizen',
    hindiLabel: 'नागरिक / महिला',
    description: 'Access SOS, health tools & government schemes',
    icon: User,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-950/40'
  },
  {
    id: 'DOCTOR',
    label: 'Doctor / Specialist',
    hindiLabel: 'डॉक्टर / विशेषज्ञ',
    description: 'Offer telehealth consultations & reviews',
    icon: Stethoscope,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40'
  },
  {
    id: 'VOLUNTEER',
    label: 'Volunteer / NGO',
    hindiLabel: 'स्वयंसेवक / साथी',
    description: 'Assist in community pickups & local aid',
    icon: HeartHandshake,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40'
  },
  {
    id: 'ADMIN',
    label: 'Admin / Coordinator',
    hindiLabel: 'व्यवस्थापक / एडमिन',
    description: 'Manage schemes, verifications & alerts',
    icon: ShieldAlert,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40'
  }
];

export default function Navbar() {
  const { language, setLanguage, t, isOnline, tab, setTab } = useApp();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, demoLogin, logout, isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close role dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route/tab change
  const handleTabSelect = (tabId) => {
    setTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleRoleSelect = async (roleId) => {
    try {
      await demoLogin(roleId);
      setRoleDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  const currentRole = (user?.role || 'USER').toUpperCase();
  const currentRoleObj = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Main Glassmorphic Navigation Bar */}
      <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/40 dark:border-slate-800/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2.5 flex items-center justify-between gap-3">

          {/* ─── LEFT: Logo & Brand ───────────────────────────────── */}
          <div
            onClick={() => handleTabSelect('safety')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleTabSelect('safety')}
            title="SakhiShakti Home"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 p-[2px] shadow-lg shadow-pink-500/25 group-hover:scale-105 group-hover:shadow-pink-500/40 transition-all duration-300">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                🌸
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-rose-300 dark:to-purple-400 bg-clip-text text-transparent">
                  SakhiShakti
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-md">
                  Rural Care
                </span>
              </div>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 -mt-0.5 tracking-tight">
                {language === 'hi' ? 'सखी शक्ति · सुरक्षा एवं स्वास्थ्य' : "Women's Safety & Health"}
              </span>
            </div>
          </div>

          {/* ─── CENTER: Tab Navigation Pills (Desktop) ───────────── */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-gray-100/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full border border-gray-200/80 dark:border-slate-700/80 shadow-inner">
            {TABS.map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = tab === tabItem.id;
              const label = language === 'hi' ? tabItem.hindiLabel : t(tabItem.labelKey, tabItem.defaultLabel);

              return (
                <button
                  key={tabItem.id}
                  onClick={() => handleTabSelect(tabItem.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-white/80 dark:hover:bg-slate-700/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-pink-500'
                    }`}
                  />
                  <span>{label}</span>
                  {tabItem.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-pink-100 dark:bg-slate-700 text-pink-600 dark:text-pink-300'
                      }`}
                    >
                      {tabItem.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ─── RIGHT: Controls & Utilities ──────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Offline / Online Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                !isOnline
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
              }`}
              title={!isOnline ? t('common.offline', 'Offline') : t('common.online', 'Online')}
            >
              {!isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span className="hidden md:inline font-mono text-[11px]">
                    {language === 'hi' ? 'ऑफलाइन' : 'Offline'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline font-mono text-[11px]">
                    {language === 'hi' ? 'ऑनलाइन' : 'Live'}
                  </span>
                </>
              )}
            </div>

            {/* Language Selector Button (EN / HI) */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-pink-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 shadow-sm transition-all active:scale-95"
              aria-label="Toggle language"
              title={language === 'hi' ? 'Switch to English' : 'हिंदी भाषा चुनें'}
            >
              <Globe className="w-3.5 h-3.5 text-pink-500" />
              <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 shadow-sm transition-all active:scale-95"
              aria-label="Toggle Theme"
              title={isDark ? t('common.light_mode', 'Light Mode') : t('common.dark_mode', 'Dark Mode')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-pink-200 dark:border-slate-700 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/90 text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm hover:shadow transition-all active:scale-95"
                aria-expanded={roleDropdownOpen}
                aria-haspopup="true"
              >
                <span className={`p-1 rounded-full ${currentRoleObj.bg}`}>
                  <CurrentRoleIcon className={`w-3.5 h-3.5 ${currentRoleObj.color}`} />
                </span>
                <span className="hidden sm:inline font-semibold">
                  {currentRoleObj.id}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                    roleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {language === 'hi' ? 'भूमिका चयन (स्विच करें)' : 'Switch User Role'}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5 truncate">
                      {user?.name ? `${user.name} (${currentRole})` : `Current: ${currentRole}`}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = currentRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${role.bg} mt-0.5`}>
                            <Icon className={`w-4 h-4 ${role.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                                {language === 'hi' ? role.hindiLabel : role.label}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                              {role.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {isAuthenticated && (
                    <div className="pt-2 mt-1 border-t border-gray-100 dark:border-slate-800 px-2">
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('auth.logout', 'Sign Out')}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-pink-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Slide-Down Drawer ─────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
              {language === 'hi' ? 'नेविगेशन मेनू' : 'Navigation Tabs'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {TABS.map((tabItem) => {
                const Icon = tabItem.icon;
                const isActive = tab === tabItem.id;
                const label = language === 'hi' ? tabItem.hindiLabel : t(tabItem.labelKey, tabItem.defaultLabel);

                return (
                  <button
                    key={tabItem.id}
                    onClick={() => handleTabSelect(tabItem.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/25'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-500'}`} />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Helpline Hotline in Mobile Menu */}
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
                <span className="text-xs font-bold text-red-700 dark:text-red-300">
                  {language === 'hi' ? 'आपातकालीन सहायता: 112' : 'Direct Helpline: 112'}
                </span>
              </div>
              <a
                href="tel:112"
                className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg shadow active:scale-95"
              >
                {language === 'hi' ? 'कॉल करें' : 'Call'}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
