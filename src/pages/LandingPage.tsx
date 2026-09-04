import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompanion } from '../context/CompanionContext';
import { CapybaraMugHero } from '../components/AnimalCompanion/CapybaraMugHero';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  MessageCircleHeart,
  SmilePlus,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginDemo, isLoading } = useAuth();
  const { openBreathingExercise } = useCompanion();

  return (
    <div id="landing-page" className="min-h-screen pb-20 flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Soft atmospheric background glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-teal-100/40 via-emerald-50/40 to-amber-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Brand Logo & Pill Badge */}
            <div className="mb-4">
              <Logo size={44} showSubtitle={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f2] border border-[#a7f3d0] text-[#0f766e] text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              <span>Gentle, safe, and private emotional wellness</span>
            </div>

            {/* Main Headline with Teal Emphasis */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.14]">
              A calm space to <span className="text-[#0d9488]">talk,</span><br />
              <span className="text-[#0d9488]">reflect,</span> and take a <span className="text-[#0d9488]">breath.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              Talk with an AI companion, check in with your mood, and build healthier everyday wellness habits.
            </p>

            {/* CTA Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                id="hero-start-journey-btn"
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#0f766e] hover:bg-[#115e59] shadow-sm hover:shadow transition-all text-sm sm:text-base"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                id="hero-sign-in-btn"
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all text-sm sm:text-base"
              >
                Sign In
              </Link>

              <button
                id="hero-demo-login-btn"
                onClick={() => loginDemo()}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-[#0f766e] bg-[#e6f7f2] hover:bg-[#d1fae5] border border-[#a7f3d0] transition-all text-sm sm:text-base cursor-pointer"
              >
                <span>Instant Demo Account</span>
              </button>
            </div>
          </div>

          {/* Right Column: Capybara with Mug & Speech Bubble */}
          <div className="lg:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
            <CapybaraMugHero
              onInteract={openBreathingExercise}
              bubbleText="Hey! I'm here whenever you need to talk."
            />
          </div>
        </div>

        {/* 3 Horizontal Feature Badges Row (as in screenshot) */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: 100% Private to You */}
          <div
            id="hero-trust-private"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">100% Private to You</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Your conversations stay completely private.
              </p>
            </div>
          </div>

          {/* Card 2: No Commercial Tracking */}
          <div
            id="hero-trust-tracking"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">No Commercial Tracking</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                We don't sell your data or show ads.
              </p>
            </div>
          </div>

          {/* Card 3: Non-Clinical & Compassionate */}
          <div
            id="hero-trust-compassionate"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Non-Clinical & Compassionate</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Supportive conversations, not medical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What MindMate Offers</h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Thoughtfully built for gentle daily emotional clarity and self-care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Supportive AI Conversation */}
          <div
            id="feature-card-chat"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-4">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Supportive AI Conversation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Express whatever is on your mind. MindMate listens first, responds with empathetic understanding, asks gentle reflective questions, and never judges or shames.
            </p>
          </div>

          {/* Card 2: Daily Mood Check-ins */}
          <div
            id="feature-card-mood"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 mb-4">
              <SmilePlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Daily Mood Check-ins</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track how you feel across 8 core emotional states with a 1–10 intensity scale and private journal reflections to build awareness over time.
            </p>
          </div>

          {/* Card 3: Private Conversation History */}
          <div
            id="feature-card-privacy"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Private Conversation History</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your conversations are stored securely for your personal reflection only. You maintain full ownership and can permanently erase your history or account at any time.
            </p>
          </div>

          {/* Card 4: Simple Wellness-Focused Experience */}
          <div
            id="feature-card-wellness"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Simple Wellness Experience</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No clinical jargon, hospital dashboards, or overwhelming metrics. Just an uncluttered, soothing digital sanctuary to pause and catch your breath.
            </p>
          </div>
        </div>
      </section>

      {/* Important Disclaimer Section */}
      <section className="mt-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div
          id="disclaimer-card"
          className="p-6 sm:p-7 rounded-2xl bg-slate-100/90 border border-slate-200/90"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Important Non-Clinical Disclaimer</h3>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed font-medium">
                MindMate provides general emotional wellness support and is not a substitute for professional medical or mental-health care.
              </p>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                MindMate is an artificial intelligence companion designed for thoughtful conversation, daily reflection, and stress relief. The AI does not diagnose, treat, or prescribe for mental health conditions, and never replaces a licensed psychologist, psychiatrist, therapist, or physician. If you are in crisis, please call or text <strong>988</strong> immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 text-center px-4">
        <h3 className="text-2xl font-bold text-slate-900">Ready to take a gentle pause?</h3>
        <p className="text-sm text-slate-600 mt-1 mb-5">
          Join MindMate today — free, private, and always here to listen.
        </p>
        <Link
          id="landing-bottom-register-btn"
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-teal-700 hover:bg-teal-800 shadow-sm transition-all"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
