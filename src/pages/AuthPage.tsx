import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompanion } from '../context/CompanionContext';
import { AnimalCompanion } from '../components/AnimalCompanion/AnimalCompanion';
import { COMPANIONS } from '../components/AnimalCompanion/animalData';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

interface AuthPageProps {
  initialTab?: 'register' | 'login';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialTab = 'register' }) => {
  const { login, register, loginDemo, isLoading: authLoading } = useAuth();
  const { companionType } = useCompanion();
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on prop or current path
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(() => {
    if (location.pathname === '/login') return 'login';
    if (location.pathname === '/register') return 'register';
    return initialTab;
  });

  // Sync with path changes if navigated via browser
  useEffect(() => {
    if (location.pathname === '/login') {
      setActiveTab('login');
    } else if (location.pathname === '/register') {
      setActiveTab('register');
    }
  }, [location.pathname]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch tabs cleanly
  const handleTabSwitch = (tab: 'register' | 'login') => {
    setActiveTab(tab);
    setError(null);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirm_password: regConfirmPassword,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Demo Login
  const handleDemoLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to sign in as Demo User.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillDemoCreds = () => {
    setActiveTab('login');
    setLoginEmail('demo@mindmate.local');
    setLoginPassword('Demo@12345');
    setError(null);
  };

  return (
    <div
      id="auth-first-page-container"
      className="min-h-[88vh] flex flex-col justify-center px-4 py-8 sm:py-12 max-w-5xl mx-auto w-full"
    >
      {/* Top Banner / Welcome Identity */}
      <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
        <div className="mb-4">
          <Logo size={52} showSubtitle={true} />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Your calm, judgment-free space to reflect, talk, and build everyday wellness habits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-4xl mx-auto w-full">
        {/* Left Side: Gentle Companion Welcome Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-teal-50/70 to-emerald-50/40 rounded-3xl border border-teal-200/80 p-6 flex flex-col items-center text-center shadow-xs">
          <div className="w-28 h-28 my-2">
            <AnimalCompanion
              type={companionType}
              state="welcome"
              size="lg"
              showSpeechBubble={false}
              interactive={true}
            />
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-1">
            Hi, I'm {companion.name} {companion.emoji}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed px-2">
            I'm here whenever you need a moment to breathe, write down your feelings, or talk things through.
          </p>

          {/* Quick Demo Login Pill inside Companion Card */}
          <div className="mt-5 w-full pt-4 border-t border-teal-200/60 flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
              Want to explore right away?
            </span>
            <button
              id="auth-card-demo-btn"
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting || authLoading}
              className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Instant Demo Account (1-Click)</span>
            </button>
            <p className="text-[10px] text-slate-500">No email or password needed</p>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-5 w-full space-y-2 text-left bg-white/70 rounded-2xl p-3.5 border border-teal-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-2 text-teal-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>100% Private to you</span>
            </div>
            <div className="flex items-center gap-2 text-teal-800 font-medium">
              <HeartHandshake className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Compassionate & Non-judgmental</span>
            </div>
            <div className="flex items-center gap-2 text-teal-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Delete data anytime</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Register & Login Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {/* Segmented Tabs Header: Register vs Login */}
          <div
            id="auth-tabs-toggle"
            className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 mb-6"
          >
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center ${
                activeTab === 'register'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center ${
                activeTab === 'login'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              id="auth-error-alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-rose-800 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM: REGISTER */}
          {activeTab === 'register' && (
            <form id="register-form" onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="auth-reg-name"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-reg-name"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    autoComplete="name"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-reg-email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-reg-password"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Password <span className="font-normal text-slate-400">(min. 6 characters)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-reg-confirm-password"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="auth-register-submit-btn"
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full mt-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Begin'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className="font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Sign In instead
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* FORM: LOGIN */}
          {activeTab === 'login' && (
            <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="auth-login-email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="auth-login-password"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={autofillDemoCreds}
                    className="text-[11px] text-teal-700 hover:underline font-semibold cursor-pointer"
                  >
                    Autofill Demo
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="auth-login-submit-btn"
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full mt-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('register')}
                    className="font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Create one now
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
