import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompanion } from '../context/CompanionContext';
import { COMPANIONS } from './AnimalCompanion/animalData';
import { CrisisModal } from './CrisisModal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Logo } from './Logo';
import {
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Smile,
  User as UserIcon,
  LogOut,
  LifeBuoy,
  Wind,
  ChevronDown,
  Settings2,
  Mic,
  Music,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { companionType, openBreathingExercise, openSelector } = useCompanion();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;

  const handleLogout = () => {
    setShowUserDropdown(false);
    logout();
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, id: 'nav-link-dashboard' },
    { path: '/voice', label: 'Live Voice', icon: Mic, id: 'nav-link-voice' },
    { path: '/music', label: 'Calm Music', icon: Music, id: 'nav-link-music' },
    { path: '/chat', label: 'Chat', icon: MessageSquare, id: 'nav-link-chat' },
    { path: '/mood', label: 'Mood', icon: Smile, id: 'nav-link-mood' },
    { path: '/profile', label: 'Profile', icon: UserIcon, id: 'nav-link-profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/chat') {
      return location.pathname.startsWith('/chat');
    }
    return location.pathname === path;
  };

  const displayName = user?.full_name ? user.full_name.split(' ')[0] : 'Aakash';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Top Navigation Header */}
      <header
        id="app-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            id="brand-logo-link"
            to={user ? '/dashboard' : '/'}
            className="flex items-center group shrink-0"
          >
            <Logo size={36} showSubtitle={true} />
          </Link>

          {/* Desktop Navigation Links Pill */}
          <nav
            id="desktop-nav"
            className="hidden md:flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-2xl border border-slate-200/70 shadow-2xs"
          >
            {navLinks.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  id={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-white text-teal-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Switcher: Warm vs Cool Mood Palette */}
            <ThemeSwitcher compact={true} />

            {/* Help Center Pill (matches screenshot) */}
            <button
              id="header-crisis-btn"
              onClick={() => setShowCrisisModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 bg-rose-50/80 border border-rose-200 hover:bg-rose-100/80 transition-colors cursor-pointer"
              title="Crisis Support & 24/7 Lifeline"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="hidden sm:inline">Help Center</span>
              <span className="sm:hidden">Help</span>
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Trigger Button */}
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                    {initial}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 hidden sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        openBreathingExercise();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <Wind className="w-4 h-4 text-teal-600" />
                      <span>Breathe with {companion.name}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        openSelector();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <Settings2 className="w-4 h-4 text-slate-400" />
                      <span>Choose Companion ({companion.name})</span>
                    </button>

                    <div className="px-3.5 py-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Mood Palette
                      </span>
                      <ThemeSwitcher compact={true} className="w-full justify-between" />
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="header-signin-btn"
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  id="header-start-btn"
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      {user && (
        <nav
          id="mobile-bottom-nav"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around"
        >
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                id={`mobile-${item.id}`}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[64px] min-h-[48px] text-xs font-medium transition-colors ${
                  active ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Crisis Modal Component */}
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </>
  );
};
