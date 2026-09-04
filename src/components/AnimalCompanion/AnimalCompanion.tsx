import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CompanionType,
  CompanionState,
  COMPANIONS,
  STATE_CONFIGS,
} from './animalData';
import { getBodyVariants, isReducedMotion } from './animalAnimations';
import { AnimalIllustration } from './AnimalIllustration';
import { Wind, MessageCircle, Check, Heart, Sparkles } from 'lucide-react';

export interface AnimalCompanionProps {
  type?: CompanionType;
  state?: CompanionState;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  timePeriod?: 'morning' | 'afternoon' | 'evening' | 'night';
  showSpeechBubble?: boolean;
  customMessage?: string;
  onActionClick?: () => void;
  actionLabel?: string;
  interactive?: boolean;
  className?: string;
  id?: string;
}

const SIZE_MAP = {
  xs: 'w-10 h-10',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-44 h-44',
};

export const AnimalCompanion: React.FC<AnimalCompanionProps> = ({
  type = 'capybara',
  state = 'idle',
  size = 'md',
  timePeriod = 'morning',
  showSpeechBubble = false,
  customMessage,
  onActionClick,
  actionLabel,
  interactive = true,
  className = '',
  id,
}) => {
  const [isPet, setIsPet] = useState(false);
  const reduced = isReducedMotion();
  const profile = COMPANIONS[type] || COMPANIONS.capybara;
  const stateConfig = STATE_CONFIGS[state] || STATE_CONFIGS.idle;

  const currentMessage = customMessage || stateConfig.message;
  const currentAction = actionLabel || stateConfig.actionText;

  // Handle gentle petting interaction
  const handlePet = () => {
    if (!interactive) return;
    setIsPet(true);
    setTimeout(() => setIsPet(false), 1400);
  };

  const bodyVariants = getBodyVariants(reduced);
  const activeAnimationState = isPet ? 'happy' : state;

  return (
    <div
      id={id || `animal-companion-${type}`}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
    >
      {/* Speech / Thought Bubble */}
      <AnimatePresence mode="wait">
        {showSpeechBubble && currentMessage && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-2 max-w-[280px] sm:max-w-xs px-3.5 py-2.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 shadow-xs text-xs text-slate-700 leading-relaxed text-center relative z-10"
          >
            {/* Thinking Dots Indicator */}
            {state === 'thinking' ? (
              <div className="flex items-center justify-center gap-1.5 py-1 text-slate-500">
                <span className="font-medium text-slate-600">Reflecting</span>
                <span className="inline-flex gap-1">
                  <motion.span
                    animate={reduced ? {} : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-teal-600"
                  />
                  <motion.span
                    animate={reduced ? {} : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-teal-600"
                  />
                  <motion.span
                    animate={reduced ? {} : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-1.5 h-1.5 rounded-full bg-teal-600"
                  />
                </span>
              </div>
            ) : (
              <p className="font-medium text-slate-700">
                {isPet ? `*${profile.name} leans in happily*` : currentMessage}
              </p>
            )}

            {/* Optional Action Pill (e.g., [Start Breathing]) */}
            {currentAction && onActionClick && !isPet && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex justify-center">
                <button
                  type="button"
                  id="companion-speech-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  {stateConfig.actionType === 'breathing' ? (
                    <Wind className="w-3 h-3" />
                  ) : stateConfig.actionType === 'chat' ? (
                    <MessageCircle className="w-3 h-3" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>{currentAction}</span>
                </button>
              </div>
            )}

            {/* Downward Pointer Triangle */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200/90 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Character Body Wrapper with Framer Motion */}
      <div className="relative flex items-center justify-center">
        {/* Animated Moving Halo Aura Circle behind character */}
        <motion.div
          animate={
            reduced
              ? { scale: 1 }
              : {
                  scale: [1, 1.14, 1],
                  opacity: [0.45, 0.8, 0.45],
                  y: [-3, 3, -3],
                }
          }
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute rounded-full pointer-events-none -z-10 ${
            size === 'lg' || size === 'xl' ? 'w-36 h-36' : 'w-26 h-26'
          } ${
            timePeriod === 'night'
              ? 'bg-gradient-to-tr from-indigo-500/40 via-purple-500/30 to-blue-400/20 blur-xl'
              : timePeriod === 'evening'
              ? 'bg-gradient-to-tr from-orange-400/40 via-rose-400/30 to-purple-300/25 blur-xl'
              : timePeriod === 'afternoon'
              ? 'bg-gradient-to-tr from-sky-400/40 via-cyan-300/35 to-amber-300/25 blur-xl'
              : 'bg-gradient-to-tr from-amber-400/40 via-orange-300/35 to-teal-300/30 blur-xl'
          }`}
        />

        {/* Orbiting / pulsing dashed ring */}
        <motion.div
          animate={
            reduced
              ? {}
              : {
                  rotate: [0, 180, 360],
                  scale: [0.94, 1.08, 0.94],
                  opacity: [0.35, 0.65, 0.35],
                }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute rounded-full border-2 border-dashed pointer-events-none -z-10 ${
            size === 'lg' || size === 'xl' ? 'w-40 h-40' : 'w-28 h-28'
          } ${
            timePeriod === 'night'
              ? 'border-indigo-400/40'
              : timePeriod === 'evening'
              ? 'border-orange-400/40'
              : timePeriod === 'afternoon'
              ? 'border-sky-400/40'
              : 'border-amber-400/40'
          }`}
        />

        {/* Visual Breathing Ring (Appears when anxious, stressed, or breathing) */}
        {(state === 'anxious' || state === 'stressed' || state === 'breathing') && (
          <motion.div
            animate={
              reduced
                ? { scale: 1.1, opacity: 0.3 }
                : {
                    scale: [1, 1.32, 1],
                    opacity: [0.2, 0.6, 0.2],
                  }
            }
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 -m-3 rounded-full border-2 border-dashed border-teal-500/60 pointer-events-none"
          />
        )}

        {/* Petting heart reaction */}
        <AnimatePresence>
          {isPet && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -20, scale: 1.1 }}
              exit={{ opacity: 0, y: -28, scale: 0.8 }}
              transition={{ duration: 0.7 }}
              className="absolute -top-3 right-0 text-rose-500 pointer-events-none z-20"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={bodyVariants}
          animate={activeAnimationState}
          onClick={handlePet}
          title={interactive ? `Gentle tap to say hi to ${profile.name}` : undefined}
          className={`${SIZE_MAP[size]} cursor-pointer shrink-0 transition-transform ${
            interactive ? 'hover:scale-105 active:scale-95' : ''
          }`}
        >
          <AnimalIllustration
            type={type}
            state={isPet ? 'happy' : state}
            reducedMotion={reduced}
          />
        </motion.div>
      </div>
    </div>
  );
};
