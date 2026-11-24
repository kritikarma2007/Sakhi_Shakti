import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Heart, LockKeyhole, Mail, MapPin, Moon, Sun, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
  const { language, setLanguage } = useApp();
  const { toggleTheme, isDark } = useTheme();
  const { login, register, loading } = useAuth();
  const isHindi = language === 'hi';
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (isSignup && password !== confirmPassword) {
      setError(isHindi ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }

    try {
      if (isSignup) {
        await register({ name, email, password, state, language });
      } else {
        await login(email, password);
      }
    } catch (submitError) {
      setError(submitError.message || (isHindi ? 'साइन इन नहीं हो सका।' : 'Unable to sign in.'));
    }
  };

  const copy = isHindi
    ? {
        welcome: 'आपकी सुरक्षा और स्वास्थ्य, एक ही जगह',
        subtitle: 'अपने SakhiShakti खाते में साइन इन करें',
        signupSubtitle: 'अपना सुरक्षित SakhiShakti खाता बनाएं',
        login: 'साइन इन',
        signup: 'खाता बनाएं',
        name: 'पूरा नाम',
        email: 'ईमेल पता',
        state: 'राज्य (वैकल्पिक)',
        password: 'पासवर्ड',
        confirm: 'पासवर्ड की पुष्टि करें',
        submitLogin: 'साइन इन करें',
        submitSignup: 'खाता बनाएं',
        switchLogin: 'पहले से खाता है? साइन इन करें',
        switchSignup: 'नए हैं? खाता बनाएं',
        minPassword: 'कम से कम 8 अक्षर',
        secure: 'आपकी जानकारी सुरक्षित रखी जाती है। आपातकालीन SOS बिना साइन इन के उपलब्ध है।',
        working: 'कृपया प्रतीक्षा करें…'
      }
    : {
        welcome: 'Safety, health, and support in one place',
        subtitle: 'Sign in to your SakhiShakti account',
        signupSubtitle: 'Create your secure SakhiShakti account',
        login: 'Log in',
        signup: 'Sign up',
        name: 'Full name',
        email: 'Email address',
        state: 'State (optional)',
        password: 'Password',
        confirm: 'Confirm password',
        submitLogin: 'Sign in',
        submitSignup: 'Create account',
        switchLogin: 'Already have an account? Log in',
        switchSignup: 'New to SakhiShakti? Sign up',
        minPassword: 'At least 8 characters',
        secure: 'Your account is protected. Emergency SOS remains available without signing in.',
        working: 'Please wait…'
      };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-pink-500 dark:focus:ring-pink-950';

  return (
    <main className="relative min-h-[calc(100vh-3rem)] overflow-hidden px-4 py-8 sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl dark:bg-pink-900/20" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-purple-200/50 blur-3xl dark:bg-purple-900/20" />
      </div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between">
        <a href="/" className="flex items-center gap-3" aria-label="SakhiShakti home">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-2xl shadow-lg shadow-pink-500/20">🌸</span>
          <span>
            <span className="block text-lg font-black tracking-tight text-slate-900 dark:text-white">SakhiShakti</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">सखीशक्ति</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
            aria-label={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            {isHindi ? 'EN' : 'हिंदी'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-8 grid max-w-6xl items-center gap-10 lg:mt-14 lg:grid-cols-[1fr_0.85fr]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-sm font-semibold text-pink-700 dark:border-pink-900 dark:bg-slate-900/60 dark:text-pink-300">
            <Heart className="h-4 w-4 fill-current" />
            {isHindi ? 'आपकी साथी, हर कदम पर' : 'Your companion, every step'}
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            {copy.welcome}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
            {isHindi
              ? 'स्वास्थ्य जानकारी, सरकारी योजनाएं और समुदाय का सहयोग आसानी से पाएं।'
              : 'Access helpful health information, government schemes, and community support.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['🛡️ 24/7 SOS', '❤️ Health Hub', '📋 Govt Schemes'].map((feature) => (
              <span key={feature} className="rounded-full border border-white bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">{feature}</span>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-pink-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              {isSignup ? copy.signup : copy.login}
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {isSignup ? copy.signupSubtitle : copy.subtitle}
            </h2>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label={isHindi ? 'प्रमाणीकरण' : 'Authentication'}>
            <button type="button" role="tab" aria-selected={!isSignup} onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${!isSignup ? 'bg-white text-pink-700 shadow-sm dark:bg-slate-700 dark:text-pink-300' : 'text-slate-500 dark:text-slate-400'}`}>
              {copy.login}
            </button>
            <button type="button" role="tab" aria-selected={isSignup} onClick={() => { setMode('signup'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${isSignup ? 'bg-white text-pink-700 shadow-sm dark:bg-slate-700 dark:text-pink-300' : 'text-slate-500 dark:text-slate-400'}`}>
              {copy.signup}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.name}</span>
                <span className="relative block">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className={`${inputClass} pl-10`} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.email}</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className={`${inputClass} pl-10`} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
              </span>
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.state}</span>
                <span className="relative block">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className={`${inputClass} pl-10`} type="text" autoComplete="address-level1" value={state} onChange={(event) => setState(event.target.value)} maxLength={100} />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.password}</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className={`${inputClass} pl-10 pr-12`} type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isSignup ? 8 : undefined} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
              {isSignup && <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{copy.minPassword}</span>}
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.confirm}</span>
                <input className={inputClass} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} />
              </label>
            )}

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/20 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? copy.working : (isSignup ? copy.submitSignup : copy.submitLogin)}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <button type="button" onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError(''); }} className="mt-5 w-full text-center text-sm font-semibold text-pink-700 hover:text-pink-800 dark:text-pink-300 dark:hover:text-pink-200">
            {isSignup ? copy.switchLogin : copy.switchSignup}
          </button>
          <p className="mt-5 border-t border-slate-100 pt-4 text-center text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {copy.secure}
          </p>
        </section>
      </div>
    </main>
  );
}
