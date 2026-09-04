import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompanion } from '../context/CompanionContext';
import { COMPANIONS } from './AnimalCompanion/animalData';
import { UserAvatar } from './Avatar/UserAvatar';
import { CrisisModal } from './CrisisModal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  MessageSquare,
  Smile,
  User as UserIcon,
  LogOut,
  LifeBuoy,
  Wind,
  Settings2,
  Mic,
  Music,
  Menu,
  X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, userAvatar, logout } = useAuth();
  const { companionType, openBreathingExercise, openSelector } = useCompanion();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Strictly only show when logged in
  if (!user) {
    return null;
  }

  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;

  const handleLogout = () => {
    setMobileDrawerOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, id: 'sidebar-link-dashboard' },
    { path: '/voice', label: 'Live Voice', icon: Mic, id: 'sidebar-link-voice', isLive: true },
    { path: '/music', label: 'Calm Music', icon: Music, id: 'sidebar-link-music' },
    { path: '/chat', label: 'Chat', icon: MessageSquare, id: 'sidebar-link-chat' },
    { path: '/mood', label: 'Mood', icon: Smile, id: 'sidebar-link-mood' },
    { path: '/profile', label: 'Profile', icon: UserIcon, id: 'sidebar-link-profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/chat') {
      return location.pathname.startsWith('/chat');
    }
    return location.pathname === path;
  };

  const displayName = user.full_name ? user.full_name.split(' ')[0] : 'Aakash';
  const initial = displayName.charAt(0).toUpperCase();

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Header & Brand */}
      <div>
        <div className="px-5 py-5 border-b border-slate-200/80 flex items-center justify-between">
          <Link
            id="sidebar-logo-link"
            to="/dashboard"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center group shrink-0"
          >
            <Logo size={36} showSubtitle={true} />
          </Link>
          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close sidebar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1.5" id="sidebar-navigation">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu
          </div>
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                id={item.id}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#e6f4f1] text-teal-900 font-semibold shadow-2xs border border-teal-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.isLive && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Companion Card Widget */}
        <div className="mx-3 mt-3 p-3 rounded-2xl bg-gradient-to-br from-teal-50/70 to-slate-50 border border-teal-100/80">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl" role="img" aria-label={companion.name}>
              {companion.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{companion.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{companion.label}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(false);
                openBreathingExercise();
              }}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-white border border-teal-200/70 text-[11px] font-semibold text-teal-800 hover:bg-teal-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Wind className="w-3 h-3 text-teal-600" />
              <span>Breathe</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(false);
                openSelector();
              }}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Settings2 className="w-3 h-3 text-slate-400" />
              <span>Change</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="p-3 border-t border-slate-200/80 space-y-2.5">
        {/* Theme Switcher: Warm vs Cool */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500">Theme</span>
          <ThemeSwitcher compact={true} />
        </div>

        {/* Help Center Pill (matches uploaded screenshot) */}
        <button
          id="sidebar-crisis-btn"
          type="button"
          onClick={() => {
            setMobileDrawerOpen(false);
            setShowCrisisModal(true);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100/80 transition-colors cursor-pointer"
          title="Crisis Support & 24/7 Lifeline"
        >
          <LifeBuoy className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Help Center (Crisis 24/7)</span>
        </button>

        {/* User Card with Sign Out */}
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
          <Link
            to="/profile"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
          >
            <UserAvatar avatarId={userAvatar} size="sm" altName={displayName} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Left Sidebar: Fixed/Sticky on the Left */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0 bg-white border-r border-slate-200/80 z-30 overflow-y-auto"
      >
        {SidebarContent}
      </aside>

      {/* Mobile Top Bar (ONLY on small screens, replaces top header) */}
      <div
        id="mobile-top-bar"
        className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 h-14 flex items-center justify-between"
      >
        <Link to="/dashboard" className="flex items-center">
          <Logo size={28} showSubtitle={false} />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCrisisModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-rose-500" />
            <span>Help</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Slides out from the left) */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          {/* Drawer Sheet */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for quick thumb access */}
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
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[52px] min-h-[44px] text-[11px] font-medium transition-colors ${
                active ? 'text-teal-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-teal-700' : 'text-slate-400'}`} />
              <span className="truncate max-w-[56px] text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 24/7 Crisis Resource Modal */}
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </>
  );
};
export default Sidebar;
