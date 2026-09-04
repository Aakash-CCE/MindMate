import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanionType, COMPANIONS } from './animalData';
import { AnimalIllustration } from './AnimalIllustration';
import { useAuth } from '../../context/AuthContext';
import { USER_AVATARS, AvatarProfile } from '../Avatar/avatarData';
import { UserAvatar } from '../Avatar/UserAvatar';
import {
  X,
  Check,
  Sparkles,
  Flame,
  Heart,
  Compass,
  User,
  Upload,
  Camera,
  Smile,
  ShieldCheck,
} from 'lucide-react';

interface CompanionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanion: CompanionType;
  onSelect: (type: CompanionType) => void;
  initialTab?: 'companion' | 'avatar';
}

const ALL_COMPANIONS: CompanionType[] = [
  'lion',
  'dino',
  'wolf',
  'tiger',
  'eagle',
  'bear',
  'fox',
  'elephant',
  'penguin',
  'parrot',
  'bunny',
  'puppy',
  'capybara',
  'panda',
  'cat',
];

export const CompanionSelectorModal: React.FC<CompanionSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCompanion,
  onSelect,
  initialTab = 'companion',
}) => {
  const { user, userAvatar, setUserAvatar, uploadCustomAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState<'companion' | 'avatar'>(initialTab);
  const [activeCategory, setActiveCategory] = useState<'all' | 'boys' | 'gentle'>('all');
  const [avatarCategory, setAvatarCategory] = useState<'all' | 'boys' | 'mindful' | 'girls'>('all');
  const [avatarNotice, setAvatarNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const filteredCompanions = ALL_COMPANIONS.filter((id) => {
    const comp = COMPANIONS[id];
    if (activeCategory === 'boys') return comp?.isBoyFavorite;
    if (activeCategory === 'gentle') return !comp?.isBoyFavorite;
    return true;
  });

  const filteredAvatars = USER_AVATARS.filter((av) => {
    if (avatarCategory === 'boys') return av.category === 'boys' || av.isBoyFavorite;
    if (avatarCategory === 'mindful') return av.category === 'mindful';
    if (avatarCategory === 'girls') return av.category === 'girls';
    return true;
  });

  const currentAvatarMeta = USER_AVATARS.find((a) => a.id === userAvatar) || USER_AVATARS[0];
  const isCustomPhoto = userAvatar && userAvatar.startsWith('data:image/');
  const userName = user?.full_name || 'Friend';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    // Limit to ~3MB
    if (file.size > 3 * 1024 * 1024) {
      alert('Please select an image smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        uploadCustomAvatar(dataUrl);
        setAvatarNotice('Custom photo avatar saved!');
        setTimeout(() => setAvatarNotice(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectAvatar = (av: AvatarProfile) => {
    setUserAvatar(av.id);
    setAvatarNotice(`Avatar updated to ${av.name}!`);
    setTimeout(() => setAvatarNotice(null), 2500);
  };

  return (
    <AnimatePresence>
      <div
        id="companion-selector-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="companion-selector-title"
      >
        <motion.div
          id="companion-selector-card"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Top Main Mode Switcher: Companion vs User Avatar */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/70 shrink-0">
              <button
                type="button"
                id="tab-btn-companion"
                onClick={() => setActiveTab('companion')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'companion'
                    ? 'bg-white text-teal-800 shadow-xs ring-1 ring-black/5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Animal Companion ({ALL_COMPANIONS.length})</span>
              </button>

              <button
                type="button"
                id="tab-btn-user-avatar"
                onClick={() => setActiveTab('avatar')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'avatar'
                    ? 'bg-white text-indigo-800 shadow-xs ring-1 ring-black/5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>My User Avatar ({USER_AVATARS.length})</span>
              </button>
            </div>

            {/* Current Active User Avatar preview pill */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('avatar')}
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                title="Your current profile avatar"
              >
                <UserAvatar avatarId={userAvatar} size="xs" />
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">
                  {userName}
                </span>
              </button>

              <button
                type="button"
                id="companion-selector-close-btn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              id="companion-selector-close-btn-mobile"
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB 1: ANIMAL COMPANION */}
          {activeTab === 'companion' && (
            <>
              {/* Header Title */}
              <div className="pt-3 pb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Personalize Companion
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-950 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                    Powerful Beasts Available
                  </span>
                </div>
                <h2 id="companion-selector-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Choose Your Mindful Companion
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Pick a loyal companion to sit beside you for daily check-ins, calming pauses, and breathing sessions.
                </p>
              </div>

              {/* Companion Category Filter Chips */}
              <div className="flex items-center gap-2 py-2.5 border-b border-slate-100 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  id="filter-all-companions"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  All Friends ({ALL_COMPANIONS.length})
                </button>

                <button
                  type="button"
                  id="filter-boys-companions"
                  onClick={() => setActiveCategory('boys')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'boys'
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-sm ring-2 ring-orange-400/40'
                      : 'bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-100/80 hover:border-amber-400'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Powerful Animals ⚡ ({ALL_COMPANIONS.filter((k) => COMPANIONS[k]?.isBoyFavorite).length})</span>
                </button>

                <button
                  type="button"
                  id="filter-gentle-companions"
                  onClick={() => setActiveCategory('gentle')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'gentle'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 border border-purple-200/60 hover:bg-purple-100/70'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  Gentle & Cute 🌿 ({ALL_COMPANIONS.filter((k) => !COMPANIONS[k]?.isBoyFavorite).length})
                </button>
              </div>

              {/* Companion Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-3 overflow-y-auto pr-1 flex-1">
                {filteredCompanions.map((key) => {
                  const comp = COMPANIONS[key];
                  const isSelected = selectedCompanion === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      id={`companion-option-${key}`}
                      onClick={() => {
                        onSelect(key);
                      }}
                      className={`relative p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer group ${
                        isSelected
                          ? comp.isBoyFavorite
                            ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                            : 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Companion Mini Illustration Container */}
                      <div
                        className={`w-16 h-16 shrink-0 rounded-xl p-1 flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform ${
                          comp.isBoyFavorite
                            ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-amber-500/40 shadow-inner'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <AnimalIllustration type={key} state="idle" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-base leading-none">{comp.emoji}</span>
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {comp.name}
                            </span>
                          </div>

                          {/* Tag / Badge */}
                          {comp.isBoyFavorite ? (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs whitespace-nowrap shrink-0 flex items-center gap-0.5">
                              ⚡ Powerful
                            </span>
                          ) : (
                            comp.tag && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap shrink-0">
                                {comp.tag}
                              </span>
                            )
                          )}
                        </div>

                        <span
                          className={`text-[11px] font-bold block mt-0.5 ${
                            comp.isBoyFavorite ? 'text-amber-800' : 'text-teal-700'
                          }`}
                        >
                          {comp.label}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                          {comp.description}
                        </p>
                      </div>

                      {/* Selected check indicator */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 2: USER AVATAR */}
          {activeTab === 'avatar' && (
            <>
              {/* Header Title */}
              <div className="pt-3 pb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <User className="w-3 h-3 text-indigo-600" />
                    Personal Profile Avatar
                  </span>
                  {avatarNotice && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {avatarNotice}
                    </motion.span>
                  )}
                </div>
                <h2 id="companion-selector-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Choose Your User Avatar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Select a unique avatar persona that represents you, or upload your personal photo.
                </p>
              </div>

              {/* Active Avatar Overview Card & Upload Button */}
              <div className="p-3 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <UserAvatar avatarId={userAvatar} size="lg" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                        Current Avatar
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {isCustomPhoto ? 'Custom Uploaded Photo' : currentAvatarMeta.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isCustomPhoto
                        ? 'Custom photo displayed in sidebar, profile, and dashboard.'
                        : currentAvatarMeta.description}
                    </p>
                  </div>
                </div>

                {/* Upload Photo Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="avatar-upload-file-input"
                  />
                  <button
                    type="button"
                    id="avatar-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>

              {/* Avatar Filter Chips */}
              <div className="flex items-center gap-2 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  id="filter-all-avatars"
                  onClick={() => setAvatarCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    avatarCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  All Avatars ({USER_AVATARS.length})
                </button>

                <button
                  type="button"
                  id="filter-boys-avatars"
                  onClick={() => setAvatarCategory('boys')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    avatarCategory === 'boys'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100/70'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Boys' Avatars 🚀 ({USER_AVATARS.filter((a) => a.category === 'boys' || a.isBoyFavorite).length})
                </button>

                <button
                  type="button"
                  id="filter-mindful-avatars"
                  onClick={() => setAvatarCategory('mindful')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    avatarCategory === 'mindful'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-teal-50 text-teal-800 border border-teal-200/60 hover:bg-teal-100/70'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Mindful & Nature 🌿 ({USER_AVATARS.filter((a) => a.category === 'mindful').length})
                </button>

                <button
                  type="button"
                  id="filter-girls-avatars"
                  onClick={() => setAvatarCategory('girls')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    avatarCategory === 'girls'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 border border-purple-200/60 hover:bg-purple-100/70'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Creative & Expressive ✨ ({USER_AVATARS.filter((a) => a.category === 'girls').length})
                </button>
              </div>

              {/* User Avatars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-3 overflow-y-auto pr-1 flex-1">
                {filteredAvatars.map((av) => {
                  const isSelected = userAvatar === av.id;

                  return (
                    <button
                      key={av.id}
                      type="button"
                      id={`user-avatar-option-${av.id}`}
                      onClick={() => handleSelectAvatar(av)}
                      className={`relative p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Avatar preview bubble */}
                      <div
                        className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr ${av.bgGradient} flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform border border-white/50`}
                      >
                        <span className="drop-shadow-sm leading-none">{av.emoji}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {av.name}
                          </span>

                          {av.isBoyFavorite ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap shrink-0">
                              Boys' Fav
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap shrink-0 capitalize">
                              {av.category}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-indigo-700 block mt-0.5">
                          {av.label}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                          {av.description}
                        </p>
                      </div>

                      {/* Selected check indicator */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer note & action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              {activeTab === 'companion'
                ? 'Selected companion updates instantly and stays saved.'
                : 'Selected user avatar updates instantly in sidebar, profile, and dashboard.'}
            </span>
            <button
              type="button"
              id="companion-selector-confirm-btn"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
