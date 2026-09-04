import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useCompanion } from '../context/CompanionContext';
import { AnimalCompanion } from '../components/AnimalCompanion/AnimalCompanion';
import { COMPANIONS, STATE_CONFIGS } from '../components/AnimalCompanion/animalData';
import { UserAvatar } from '../components/Avatar/UserAvatar';
import { api } from '../services/api';
import { MoodEntry, ChatSession, MoodType, MOOD_DEFINITIONS } from '../types';
import {
  MessageCircleHeart,
  SmilePlus,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
  Plus,
  Calendar,
  Wind,
  Settings2,
  Mic,
  Music,
  Radio,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, userAvatar } = useAuth();
  const {
    companionType,
    openBreathingExercise,
    openSelector,
    shouldShowWelcome,
    markWelcomeShown,
  } = useCompanion();
  const navigate = useNavigate();
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;

  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Check-in form state
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [savingMood, setSavingMood] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Scroll to check-in helper
  const scrollToCheckIn = () => {
    markWelcomeShown();
    const el = document.getElementById('mood-checkin-widget');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const moodList: MoodType[] = ['happy', 'calm', 'okay', 'sad', 'anxious', 'stressed', 'lonely', 'angry'];

  // Personalized time-of-day greeting and helper
  const getUserDisplayName = () => {
    if (user?.full_name?.trim()) {
      const first = user.full_name.trim().split(/\s+/)[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    if (user?.email) {
      const namePart = user.email.split('@')[0].replace(/[0-9._-]+/g, ' ').trim();
      if (namePart) {
        const first = namePart.split(/\s+/)[0];
        return first.charAt(0).toUpperCase() + first.slice(1);
      }
    }
    return 'friend';
  };

  // Strictly automatic time of day calculation
  const getActivePeriod = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const getGreetingInfo = () => {
    const period = getActivePeriod();
    if (period === 'morning') {
      return {
        period: 'morning' as const,
        greeting: 'Good morning',
        periodLabel: 'Morning Sanctuary',
        subtext: 'Wishing you a peaceful, gentle start to your day.',
        icon: Sunrise,
        iconColor: 'text-amber-500',
        badgeClass: 'bg-amber-50/90 border-amber-200/80 text-amber-800',
        cardBg: 'bg-gradient-to-br from-[#fffdf8] via-[#fff7ed]/80 to-[#f0fdf9]/80 border-amber-200/80 text-slate-800',
        sunMoonOrbColor: 'from-amber-400/40 via-orange-300/30 to-yellow-200/20',
        secondaryOrbColor: 'from-rose-300/25 via-amber-200/20 to-teal-200/20',
        rippleBorder: 'border-amber-300/40',
        dashedBorder: 'border-amber-400/30',
        isNight: false,
      };
    }
    if (period === 'afternoon') {
      return {
        period: 'afternoon' as const,
        greeting: 'Good afternoon',
        periodLabel: 'Afternoon Sanctuary',
        subtext: 'Take a moment to pause, breathe, and check in with yourself.',
        icon: Sun,
        iconColor: 'text-amber-500',
        badgeClass: 'bg-sky-50/90 border-sky-200/80 text-sky-800',
        cardBg: 'bg-gradient-to-br from-[#f0f9ff]/95 via-[#e6f6fa]/80 to-[#f0fdf9]/80 border-sky-200/80 text-slate-800',
        sunMoonOrbColor: 'from-amber-300/40 via-sky-300/30 to-teal-300/20',
        secondaryOrbColor: 'from-teal-300/25 via-sky-200/20 to-cyan-200/20',
        rippleBorder: 'border-sky-300/40',
        dashedBorder: 'border-sky-400/30',
        isNight: false,
      };
    }
    if (period === 'evening') {
      return {
        period: 'evening' as const,
        greeting: 'Good evening',
        periodLabel: 'Evening Sanctuary',
        subtext: 'Unwind and give yourself credit for all you handled today.',
        icon: Sunset,
        iconColor: 'text-orange-500',
        badgeClass: 'bg-orange-50/90 border-orange-200/80 text-orange-800',
        cardBg: 'bg-gradient-to-br from-[#fff2ee]/95 via-[#feece8]/80 to-[#fdf2f8]/80 border-orange-200/80 text-slate-800',
        sunMoonOrbColor: 'from-orange-400/40 via-rose-300/30 to-purple-300/20',
        secondaryOrbColor: 'from-purple-300/25 via-rose-200/20 to-amber-200/20',
        rippleBorder: 'border-orange-300/40',
        dashedBorder: 'border-orange-400/30',
        isNight: false,
      };
    }
    return {
      period: 'night' as const,
      greeting: 'Good evening',
      periodLabel: 'Nighttime Sanctuary',
      subtext: 'Let go of the day’s worries and take gentle care of yourself.',
      icon: Moon,
      iconColor: 'text-indigo-300',
      badgeClass: 'bg-indigo-950/80 border-indigo-700/80 text-indigo-200',
      cardBg: 'bg-gradient-to-br from-[#0c1222] via-[#161f38] to-[#0f172a] border-indigo-800/80 text-slate-100 shadow-lg',
      sunMoonOrbColor: 'from-indigo-400/35 via-violet-400/25 to-blue-400/15',
      secondaryOrbColor: 'from-purple-500/20 via-indigo-400/15 to-blue-300/15',
      rippleBorder: 'border-indigo-400/30',
      dashedBorder: 'border-indigo-400/30',
      isNight: true,
    };
  };

  const loadData = async () => {
    try {
      const [moodRes, sessionRes] = await Promise.all([api.getMoods(), api.getSessions()]);
      setMoods(moodRes.moods || []);
      setSessions(sessionRes.sessions || []);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setSavingMood(true);
    try {
      const res = await api.createMood({
        mood: selectedMood,
        intensity,
        note: note.trim() || undefined,
      });

      setMoods((prev) => [res.mood, ...prev]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      setSelectedMood(null);
      setNote('');
      setIntensity(5);
    } catch (err) {
      console.error('Failed to save mood:', err);
    } finally {
      setSavingMood(false);
    }
  };

  // Find today's mood (created today in local time)
  const isToday = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const todayMood = moods.find((m) => isToday(m.created_at));
  const recentMoods = moods.slice(0, 5);

  const startNewConversation = async (initialPrompt?: string) => {
    try {
      const { session } = await api.createSession('New Conversation');
      if (initialPrompt) {
        // Send initial message and redirect
        await api.sendMessage(session.id, initialPrompt);
      }
      navigate(`/chat/${session.id}`);
    } catch (err) {
      console.error('Failed to create session:', err);
      navigate('/chat');
    }
  };

  const quickPrompts = [
    'I am feeling lonely today and wanted to talk.',
    'Work has been really stressful and overwhelming.',
    'I just need a quiet moment to catch my breath.',
    'I had a strange mix of emotions today.',
  ];

  const greetingInfo = getGreetingInfo();
  const userName = getUserDisplayName();
  const GreetingIcon = greetingInfo.icon;

  return (
    <div id="dashboard-container" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
      {/* Header Greeting */}
      <div id="dashboard-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${greetingInfo.badgeClass}`}
            >
              <GreetingIcon className={`w-3.5 h-3.5 ${greetingInfo.iconColor}`} />
              <span>{greetingInfo.periodLabel}</span>
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 id="dashboard-greeting-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greetingInfo.greeting}, {userName}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {greetingInfo.subtext}
          </p>
        </div>

        <button
          id="dashboard-start-chat-btn"
          onClick={() => startNewConversation()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <MessageCircleHeart className="w-4 h-4" />
          <span>Start a Conversation</span>
        </button>
      </div>

      {/* Companion Card (V1 Section 8 & Section 2) */}
      <div
        id="dashboard-companion-card"
        className={`relative overflow-hidden ${greetingInfo.cardBg} rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col items-center text-center transition-colors duration-500`}
      >
        {/* Animated Moving Background Circles (Time of Day Ambience) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
          {/* Main Celestial Orb (Sun / Moon) gently floating, breathing, and moving */}
          <motion.div
            key={`orb-${greetingInfo.period}`}
            animate={{
              y: [-12, 12, -12],
              x: [-6, 6, -6],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute -top-12 -right-8 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br ${greetingInfo.sunMoonOrbColor} blur-2xl opacity-75`}
          />

          {/* Secondary drifting ambient sphere */}
          <motion.div
            key={`secondary-orb-${greetingInfo.period}`}
            animate={{
              y: [10, -10, 10],
              x: [7, -7, 7],
              scale: [1.06, 0.95, 1.06],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute -bottom-14 -left-10 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr ${greetingInfo.secondaryOrbColor} blur-2xl opacity-65`}
          />

          {/* Large Concentric Breathing Aura Circle */}
          <motion.div
            key={`ring-${greetingInfo.period}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.65, 0.3],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full border-2 ${greetingInfo.rippleBorder}`}
          />

          {/* Outer Orbiting / Rotating Dashed Celestial Ring */}
          <motion.div
            key={`dashed-ring-${greetingInfo.period}`}
            animate={{
              rotate: [0, 360],
              scale: [0.96, 1.06, 0.96],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed ${greetingInfo.dashedBorder} opacity-50`}
          />

          {/* Visible Celestial Sky Bodies (Wake-up Morning Sun & Luminous Night Moon) */}
          {greetingInfo.period === 'morning' && (
            <motion.div
              key="morning-wake-up-sun"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-4 left-4 sm:top-6 sm:left-7 pointer-events-none select-none"
            >
              <div className="relative flex items-center justify-center">
                {/* Morning Sun Dawn Aura Pulse */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.65, 0.35],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-radial from-amber-300/45 via-orange-200/25 to-transparent blur-md"
                />

                {/* Rotating Morning Sunrays */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-amber-400/80"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="50"
                        y1="12"
                        x2="50"
                        y2="22"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        transform={`rotate(${deg} 50 50)`}
                      />
                    ))}
                  </svg>
                </motion.div>

                {/* Floating Morning Wake-up Sun Disk */}
                <motion.div
                  animate={{
                    y: [-3, 3, -3],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.45)] border-2 border-amber-300/90 flex items-center justify-center"
                >
                  {/* Sweet Wake-up Morning Face */}
                  <svg viewBox="0 0 40 40" className="w-8 h-8 text-amber-950/70">
                    {/* Cheerful waking curved smiling eyes */}
                    <path d="M12 18 Q15 22 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M22 18 Q25 22 28 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    {/* Gentle morning smile */}
                    <path d="M16 24 Q20 28 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Soft morning blushing cheeks */}
                    <circle cx="11" cy="22" r="2.2" fill="#f43f5e" opacity="0.45" />
                    <circle cx="29" cy="22" r="2.2" fill="#f43f5e" opacity="0.45" />
                  </svg>
                </motion.div>

                {/* Soft Drifting Morning Cloud */}
                <motion.div
                  animate={{
                    x: [-8, 12, -8],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-2 -left-3 drop-shadow-xs"
                >
                  <svg viewBox="0 0 64 36" className="w-13 h-7 fill-white/90">
                    <path d="M 12 28 Q 12 18 22 18 Q 25 10 36 10 Q 46 10 50 18 Q 58 18 58 28 Z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}

          {greetingInfo.period === 'afternoon' && (
            <motion.div
              key="afternoon-sun"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-4 left-4 sm:top-6 sm:left-7 pointer-events-none select-none"
            >
              <div className="relative flex items-center justify-center">
                {/* Afternoon Daylight Aura */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-radial from-amber-300/35 via-sky-200/20 to-transparent blur-md"
                />

                {/* Rotating Sunrays */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-amber-400/80"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="50"
                        y1="13"
                        x2="50"
                        y2="23"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        transform={`rotate(${deg} 50 50)`}
                      />
                    ))}
                  </svg>
                </motion.div>

                {/* Afternoon Sun Body */}
                <motion.div
                  animate={{
                    y: [-3, 3, -3],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.4)] border-2 border-amber-300/90 flex items-center justify-center"
                >
                  <svg viewBox="0 0 40 40" className="w-8 h-8 text-amber-950/70">
                    <circle cx="15" cy="19" r="2" fill="currentColor" />
                    <circle cx="25" cy="19" r="2" fill="currentColor" />
                    <path d="M16 24 Q20 27 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="11" cy="22" r="2" fill="#f43f5e" opacity="0.4" />
                    <circle cx="29" cy="22" r="2" fill="#f43f5e" opacity="0.4" />
                  </svg>
                </motion.div>

                {/* Gentle Drifting Cloud */}
                <motion.div
                  animate={{
                    x: [-10, 10, -10],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 11,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-2 -left-3 drop-shadow-xs"
                >
                  <svg viewBox="0 0 64 36" className="w-13 h-7 fill-white/90">
                    <path d="M 12 28 Q 12 18 22 18 Q 25 10 36 10 Q 46 10 50 18 Q 58 18 58 28 Z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}

          {greetingInfo.period === 'evening' && (
            <motion.div
              key="evening-sunset-sun"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-4 left-4 sm:top-6 sm:left-7 pointer-events-none select-none"
            >
              <div className="relative flex items-center justify-center">
                {/* Sunset Warm Halo */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.7, 0.35],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-radial from-orange-400/40 via-rose-300/20 to-transparent blur-md"
                />

                {/* Sunset Sun Body */}
                <motion.div
                  animate={{
                    y: [-2.5, 2.5, -2.5],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-rose-300 shadow-[0_0_20px_rgba(249,115,22,0.45)] border-2 border-orange-300/90 flex items-center justify-center"
                >
                  <svg viewBox="0 0 40 40" className="w-8 h-8 text-amber-950/70">
                    <path d="M13 19 Q16 22 19 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M21 19 Q24 22 27 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 25 Q20 28 24 25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </motion.div>

                {/* Soft Dusk Cloud Passing Over Sunset */}
                <motion.div
                  animate={{
                    x: [-6, 10, -6],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-2 -left-2.5 drop-shadow-xs"
                >
                  <svg viewBox="0 0 64 36" className="w-13 h-7 fill-rose-100/85">
                    <path d="M 12 28 Q 12 18 22 18 Q 25 10 36 10 Q 46 10 50 18 Q 58 18 58 28 Z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}

          {greetingInfo.period === 'night' && (
            <motion.div
              key="night-moon"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-4 left-4 sm:top-6 sm:left-7 pointer-events-none select-none"
            >
              <div className="relative flex items-center justify-center">
                {/* Luminous Night Lunar Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.4, 0.75, 0.4],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-radial from-indigo-300/35 via-violet-400/20 to-transparent blur-lg"
                />

                {/* Floating Serene Crescent Moon */}
                <motion.div
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  <svg
                    viewBox="0 0 54 54"
                    className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_16px_rgba(254,240,138,0.6)]"
                  >
                    <defs>
                      <linearGradient id="nightCrescentMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fffbeb" />
                        <stop offset="45%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#facc15" />
                      </linearGradient>
                    </defs>
                    {/* Graceful Crescent Moon */}
                    <path
                      d="M 38 12 C 22 12 12 24 12 36 C 12 43 16 48 20 50 C 13 46 8 38 8 28 C 8 16 18 6 31 6 C 34 6 36 7 38 8 C 36 9 37 11 38 12 Z"
                      fill="url(#nightCrescentMoonGrad)"
                      stroke="#fef08a"
                      strokeWidth="0.8"
                    />
                    {/* Gentle sleeping moon eye */}
                    <path
                      d="M 16 26 Q 19 29 22 26"
                      fill="none"
                      stroke="#854d0e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>
                </motion.div>

                {/* Drifting Translucent Night Cloud */}
                <motion.div
                  animate={{
                    x: [-8, 12, -8],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 11,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-2 -left-3 drop-shadow-xs"
                >
                  <svg viewBox="0 0 64 36" className="w-13 h-7 fill-indigo-300/30">
                    <path d="M 10 26 Q 10 17 20 17 Q 24 10 34 10 Q 44 10 48 17 Q 56 17 56 26 Z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Twinkling Night Stars when in Night Mode */}
          {greetingInfo.isNight && (
            <div className="absolute inset-0 pointer-events-none">
              {[
                { top: '14%', left: '12%', delay: 0 },
                { top: '22%', left: '32%', delay: 1.1 },
                { top: '16%', left: '72%', delay: 0.5 },
                { top: '38%', left: '88%', delay: 1.7 },
                { top: '62%', left: '14%', delay: 0.8 },
                { top: '78%', left: '82%', delay: 1.4 },
                { top: '84%', left: '38%', delay: 2.0 },
              ].map((star, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.25, 0.95, 0.25],
                    scale: [0.8, 1.35, 0.8],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: star.delay,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-indigo-100 shadow-xs"
                  style={{ top: star.top, left: star.left }}
                />
              ))}
              {/* Extra twinkle sparkle diamonds */}
              {[
                { top: '26%', left: '60%', delay: 0.3, size: 'w-2 h-2' },
                { top: '45%', left: '22%', delay: 1.5, size: 'w-2.5 h-2.5' },
              ].map((sparkle, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    rotate: [0, 90, 180],
                    scale: [0.7, 1.2, 0.7],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: sparkle.delay,
                    ease: 'easeInOut',
                  }}
                  className={`absolute ${sparkle.size} text-amber-200 pointer-events-none`}
                  style={{ top: sparkle.top, left: sparkle.left }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Top Controls Bar: Avatar & Companion Pickers */}
        <div className="w-full flex items-center justify-end gap-2 relative z-10 mb-2">
          {/* User Avatar customization pill */}
          <button
            type="button"
            id="dashboard-change-avatar-btn"
            onClick={() => openSelector('avatar')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
              greetingInfo.isNight
                ? 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-indigo-700/70 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="Personalize your user avatar"
          >
            <UserAvatar avatarId={userAvatar} size="xs" />
            <span className="hidden sm:inline text-slate-400">You:</span>
            <span className={greetingInfo.isNight ? 'font-semibold text-indigo-300' : 'font-semibold text-indigo-700'}>
              {userName}
            </span>
          </button>

          {/* Customization link top-right */}
          <button
            type="button"
            id="dashboard-change-companion-btn"
            onClick={() => openSelector('companion')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
              greetingInfo.isNight
                ? 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-indigo-700/70 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-2xs'
            }`}
            title="Change your animal companion"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Companion:</span>
            <span className={greetingInfo.isNight ? 'font-semibold text-teal-300' : 'font-semibold text-teal-800'}>
              {companion.name}
            </span>
          </button>
        </div>

        {/* Gentle Animal Illustration with moving halo & breathing ring */}
        <div className="my-2 relative z-10">
          <AnimalCompanion
            id="dashboard-main-companion"
            type={companionType}
            state={shouldShowWelcome ? 'welcome' : 'idle'}
            timePeriod={greetingInfo.period}
            size="lg"
            showSpeechBubble={true}
            customMessage={
              shouldShowWelcome
                ? `${greetingInfo.greeting}, ${userName}! How are you feeling today?`
                : `Taking things one gentle breath at a time.`
            }
            interactive={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 relative z-10">
          <button
            type="button"
            id="companion-card-checkin-btn"
            onClick={scrollToCheckIn}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <SmilePlus className="w-3.5 h-3.5" />
            <span>Check In</span>
          </button>

          <button
            type="button"
            id="companion-card-breathe-btn"
            onClick={openBreathingExercise}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer border ${
              greetingInfo.isNight
                ? 'bg-slate-800/90 hover:bg-slate-700/90 text-teal-300 border-indigo-700/80'
                : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Breathe with {companion.name}</span>
          </button>
        </div>
      </div>

      {/* Voice & Music Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Live Voice Conversation Card */}
        <Link
          id="dashboard-voice-card"
          to="/voice"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-sm transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-medium">
                Live API
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-700 transition-colors flex items-center gap-1.5">
              <span>Talk via Live Voice</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-teal-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Have a real-time conversational voice session with {companion.name} using <strong>gemini-3.1-flash-live-preview</strong> with instant spoken audio.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
            <span>Start Voice Session</span>
            <span className="text-[11px] font-normal text-slate-400">Microphone stream</span>
          </div>
        </Link>

        {/* Calm Music Studio Card */}
        <Link
          id="dashboard-music-card"
          to="/music"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-sm transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                Lyria Models
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <span>Calm Music Studio</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Compose soothing soundscapes & 432Hz ambient tracks with <strong>lyria-3-clip-preview</strong> (30s clips) and <strong>lyria-3-pro-preview</strong>.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Open Music Studio</span>
            <span className="text-[11px] font-normal text-slate-400">Therapeutic audio</span>
          </div>
        </Link>
      </div>

      {/* Today's Mood Status Banner */}
      {todayMood ? (
        <div
          id="todays-mood-banner"
          className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl p-2 bg-white rounded-xl shadow-2xs">
              {MOOD_DEFINITIONS[todayMood.mood].emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">Today's Mood</span>
                <span className="text-xs text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                  Intensity {todayMood.intensity}/10
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 capitalize mt-0.5">
                Feeling {MOOD_DEFINITIONS[todayMood.mood].label}
              </h3>
              {todayMood.note && (
                <p className="text-xs text-slate-600 italic mt-1 max-w-xl">
                  "{todayMood.note}"
                </p>
              )}
            </div>
          </div>

          <Link
            id="link-view-all-moods"
            to="/mood"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-white px-3 py-2 rounded-xl border border-teal-200 shadow-2xs shrink-0 self-start sm:self-center"
          >
            <span>View Mood History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
            <span>You haven't logged your mood yet today. Select an emotion below to check in.</span>
          </div>
        </div>
      )}

      {/* Main Interactive Mood Check-In Widget */}
      <div
        id="mood-checkin-widget"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs"
      >
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">How are you feeling today?</h2>
          <p className="text-xs text-slate-500 mt-0.5">Select the emotion that best reflects this moment.</p>
        </div>

        {savedSuccess && (
          <div className="mb-5 p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-teal-900 animate-in fade-in">
            <div className="w-16 h-16 shrink-0">
              <AnimalCompanion
                type={companionType}
                state="success"
                size="sm"
                interactive={false}
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-teal-900">
                Saved. Thanks for checking in with yourself today.
              </h4>
              <p className="text-xs text-teal-700 mt-0.5">
                Your mood has been securely recorded to your private journal.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Mood Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {moodList.map((m) => {
            const meta = MOOD_DEFINITIONS[m];
            const isSelected = selectedMood === m;
            return (
              <button
                key={m}
                id={`mood-btn-${m}`}
                type="button"
                onClick={() => setSelectedMood(m)}
                className={`p-3 sm:p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? `${meta.bg} ${meta.border} ring-2 ring-teal-600/30 shadow-2xs font-semibold`
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-2xl">{meta.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-sm capitalize font-medium text-slate-900">{meta.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step 2 & 3: Revealed when a mood is selected */}
        {selectedMood && (
          <form onSubmit={handleSaveMood} className="mt-6 pt-6 border-t border-slate-100 space-y-5 animate-in fade-in">
            {/* Emotion-specific Companion Response */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="shrink-0">
                <AnimalCompanion
                  type={companionType}
                  state={selectedMood}
                  size="md"
                  showSpeechBubble={false}
                  interactive={true}
                />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-0.5">
                  {companion.name}'s Reaction
                </span>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {STATE_CONFIGS[selectedMood]?.message || "I'm right here with you."}
                </p>
                {(selectedMood === 'anxious' || selectedMood === 'stressed') && (
                  <button
                    type="button"
                    id="mood-checkin-start-breathing-btn"
                    onClick={openBreathingExercise}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Start Breathing with {companion.name}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="mood-intensity-slider" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  How strong is this feeling?
                </label>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md">
                  {intensity} / 10
                </span>
              </div>
              <input
                id="mood-intensity-slider"
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1 mt-1">
                <span>1 (Gentle)</span>
                <span>5 (Moderate)</span>
                <span>10 (Very Strong)</span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label htmlFor="mood-note-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Want to write something about today? <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <textarea
                id="mood-note-input"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What contributed to how you're feeling right now? A quick sentence or thought..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedMood(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-mood-entry-btn"
                type="submit"
                disabled={savingMood}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingMood ? 'Saving Entry...' : 'Save Mood Entry'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two Column Layout: Recent Moods & Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Mood History Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SmilePlus className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base text-slate-900">Recent Moods</h3>
              </div>
              <Link
                id="view-all-moods-link"
                to="/mood"
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingData ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading mood history...</div>
            ) : recentMoods.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No mood entries yet.</p>
                <p className="text-xs text-slate-400 mt-1">Use the buttons above to log your first check-in.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMoods.map((m) => {
                  const meta = MOOD_DEFINITIONS[m.mood];
                  const dateObj = new Date(m.created_at);
                  const timeFormatted = dateObj.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{meta.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold capitalize text-slate-900">{meta.label}</span>
                            <span className="text-[11px] px-1.5 py-0.2 bg-white rounded border border-slate-200 text-slate-600 font-medium">
                              {m.intensity}/10
                            </span>
                          </div>
                          {m.note ? (
                            <p className="text-xs text-slate-500 line-clamp-1 italic">"{m.note}"</p>
                          ) : (
                            <p className="text-[11px] text-slate-400">No note attached</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 font-medium">{timeFormatted}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total logged check-ins: {moods.length}</span>
            <Link to="/mood" className="text-teal-700 font-semibold hover:underline">
              Check in on dedicated page →
            </Link>
          </div>
        </div>

        {/* Right: Recent Conversations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircleHeart className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base text-slate-900">Recent Conversations</h3>
              </div>
              <button
                id="new-chat-top-btn"
                onClick={() => startNewConversation()}
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
            </div>

            {loadingData ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading conversations...</div>
            ) : sessions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No conversations yet.</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Start your first supportive conversation with MindMate.
                </p>
                <button
                  id="empty-start-chat-btn"
                  onClick={() => startNewConversation()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Start Chat
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sessions.slice(0, 4).map((s) => {
                  const updatedDate = new Date(s.updated_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <Link
                      key={s.id}
                      id={`session-item-${s.id}`}
                      to={`/chat/${s.id}`}
                      className="p-3 rounded-xl bg-slate-50/70 hover:bg-teal-50/60 border border-slate-200/70 hover:border-teal-200 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <MessageCircleHeart className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 transition-colors" />
                        <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate">
                          {s.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {updatedDate}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-700 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Conversation Starters */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Reflection Starters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => startNewConversation(prompt)}
                  className="text-xs text-slate-600 hover:text-teal-900 bg-slate-100/80 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
