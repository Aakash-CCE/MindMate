import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompanion } from '../context/CompanionContext';
import { AnimalCompanion } from '../components/AnimalCompanion/AnimalCompanion';
import { COMPANIONS } from '../components/AnimalCompanion/animalData';
import { UserAvatar } from '../components/Avatar/UserAvatar';
import { USER_AVATARS } from '../components/Avatar/avatarData';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { api } from '../services/api';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Lock,
  Sparkles,
  Wind,
  Settings2,
  Palette,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, userAvatar, logout, deleteAccount } = useAuth();
  const { companionType, openBreathingExercise, openSelector } = useCompanion();
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;
  const navigate = useNavigate();

  const [clearingChats, setClearingChats] = useState(false);
  const [deletingAcc, setDeletingAcc] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Confirmation modal states
  const [showClearChatsConfirm, setShowClearChatsConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);

  const handleClearHistory = async () => {
    setClearingChats(true);
    try {
      await api.deleteConversations();
      setShowClearChatsConfirm(false);
      setSuccessMsg('All conversation history has been permanently deleted.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to clear conversations:', err);
      alert('Failed to clear conversation history.');
    } finally {
      setClearingChats(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAcc(true);
    try {
      await deleteAccount();
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account.');
      setDeletingAcc(false);
    }
  };

  const accountCreatedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div id="profile-page-container" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
        <p className="text-sm text-slate-600 mt-1">Manage your account credentials and personal privacy settings.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-2.5 text-sm text-teal-800">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-700" />
          Account Details
        </h2>

        <div className="space-y-4">
          {/* User Profile Avatar Banner */}
          {(() => {
            const currentAv = USER_AVATARS.find((a) => a.id === userAvatar) || USER_AVATARS[0];
            const isCustom = userAvatar && userAvatar.startsWith('data:image/');

            return (
              <div className="p-4 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-teal-50/50 border border-indigo-100 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <UserAvatar avatarId={userAvatar} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                        Profile Avatar
                      </span>
                      {currentAv.isBoyFavorite && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          Boys' Fav
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {isCustom ? 'Custom Uploaded Photo' : `${currentAv.name} (${currentAv.label})`}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {isCustom
                        ? 'Your custom photo is active across all mindful spaces.'
                        : currentAv.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="profile-change-avatar-btn"
                  onClick={() => openSelector('avatar')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-2xs transition-colors cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Change Avatar</span>
                </button>
              </div>
            );
          })()}

          {/* Full Name */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 block">Full Name</span>
              <span className="text-sm font-semibold text-slate-900">{user?.full_name}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md">
              User
            </span>
          </div>

          {/* Email */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-500 block">Email Address</span>
                <span className="text-sm font-semibold text-slate-900">{user?.email}</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              Verified
            </span>
          </div>

          {/* Created Date */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-xs font-medium text-slate-500 block">Account Created</span>
              <span className="text-sm font-semibold text-slate-800">{accountCreatedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmosphere & Mood Palette Theme Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-teal-700" />
            Atmosphere & Mood Palette
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose between a warm, grounding palette or a cool, crisp palette to suit your current emotional state.
          </p>
        </div>

        <ThemeSwitcher compact={false} />
      </div>

      {/* Animal Companion Customization Card (V1 Section 9) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              Animal Wellness Companion
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your gentle companion accompanies your reflections, chats, and breathing exercises.
            </p>
          </div>

          <button
            type="button"
            id="profile-change-companion-btn"
            onClick={openSelector}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Choose Companion</span>
          </button>
        </div>

        <div className="p-4 bg-gradient-to-r from-teal-50/60 to-slate-50 rounded-2xl border border-teal-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 shrink-0">
            <AnimalCompanion
              type={companionType}
              state="idle"
              size="md"
              showSpeechBubble={false}
              interactive={true}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-lg">{companion.emoji}</span>
              <h3 className="font-bold text-sm text-slate-900">
                {companion.name} ({companion.label})
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {companion.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                id="profile-breathe-with-companion-btn"
                onClick={openBreathingExercise}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Start Breathing with {companion.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Data Ownership Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-700" />
            Privacy & Data Ownership
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            MindMate values your emotional privacy. Your conversation and mood records are strictly private to you.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Clear History Button */}
          <div className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Clear Conversation History</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete all past chat sessions with MindMate while keeping your account and mood journal.
              </p>
            </div>
            <button
              id="clear-chat-history-btn"
              onClick={() => setShowClearChatsConfirm(true)}
              className="px-4 py-2 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Delete History
            </button>
          </div>

          {/* Delete Account Button */}
          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-rose-900">Delete Account</h3>
              <p className="text-xs text-rose-700/80 mt-0.5">
                Permanently erase your user profile, all mood check-ins, and all chat records. This action cannot be undone.
              </p>
            </div>
            <button
              id="delete-account-btn"
              onClick={() => setShowDeleteAccountConfirm(true)}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-2 flex justify-end">
        <button
          id="profile-logout-btn"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Confirmation Modal: Clear Chat History */}
      {showClearChatsConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Erase All Conversations?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete all of your chat messages and conversation sessions with MindMate. Your mood check-ins will remain safe.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearChatsConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-clear-history-btn"
                type="button"
                disabled={clearingChats}
                onClick={handleClearHistory}
                className="px-4 py-2 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded-lg cursor-pointer"
              >
                {clearingChats ? 'Erasing...' : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Account */}
      {showDeleteAccountConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-rose-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-rose-900">Permanently Delete Account?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete your MindMate account? All your personal records, including mood check-ins, journal reflections, and chat history, will be immediately and irreversibly wiped.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAccountConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-account-btn"
                type="button"
                disabled={deletingAcc}
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded-lg cursor-pointer"
              >
                {deletingAcc ? 'Deleting...' : 'Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
