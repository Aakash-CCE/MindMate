import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanionType, COMPANIONS } from './animalData';
import { AnimalIllustration } from './AnimalIllustration';
import { isReducedMotion } from './animalAnimations';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Wind, CheckCircle2 } from 'lucide-react';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  companionType?: CompanionType;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_CONFIG: Record<BreathPhase, { label: string; sub: string; duration: number }> = {
  inhale: { label: 'Breathe In', sub: 'Inhale gently and deeply', duration: 4 },
  hold: { label: 'Hold', sub: 'Hold with gentle stillness', duration: 4 },
  exhale: { label: 'Breathe Out', sub: 'Release tension slowly', duration: 4 },
  rest: { label: 'Rest', sub: 'Stay present in this quiet moment', duration: 2 },
};

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  isOpen,
  onClose,
  companionType = 'capybara',
}) => {
  const reduced = isReducedMotion();
  const profile = COMPANIONS[companionType] || COMPANIONS.capybara;

  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false); // Silent by default per Rule 14

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Gentle soft tone when phase transitions (only if sound explicitly enabled by user)
  const playPhaseSound = (freq = 440) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore audio failure gracefully
    }
  };

  // Main Breathing Loop Timer
  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          let nextPhase: BreathPhase = 'inhale';
          if (phase === 'inhale') nextPhase = 'hold';
          else if (phase === 'hold') nextPhase = 'exhale';
          else if (phase === 'exhale') nextPhase = 'rest';
          else if (phase === 'rest') {
            nextPhase = 'inhale';
            setCyclesCompleted((c) => c + 1);
          }

          setPhase(nextPhase);

          // Phase audio feedback if opted in
          if (soundEnabled) {
            if (nextPhase === 'inhale') playPhaseSound(392); // G4
            else if (nextPhase === 'hold') playPhaseSound(440); // A4
            else if (nextPhase === 'exhale') playPhaseSound(330); // E4
          }

          return PHASE_CONFIG[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase, soundEnabled]);

  const handleReset = () => {
    setPhase('inhale');
    setCountdown(4);
    setCyclesCompleted(0);
    setIsActive(true);
  };

  if (!isOpen) return null;

  // Scale calculations for animal and circle expansion
  const isExpanding = phase === 'inhale';
  const isHeld = phase === 'hold';
  const isContracting = phase === 'exhale';

  let ringScale = 1;
  if (isExpanding) ringScale = 1.35;
  else if (isHeld) ringScale = 1.35;
  else if (isContracting) ringScale = 0.95;
  else ringScale = 1;

  let animalScale = 1;
  if (isExpanding) animalScale = 1.14;
  else if (isHeld) animalScale = 1.14;
  else if (isContracting) animalScale = 0.96;
  else animalScale = 1;

  return (
    <AnimatePresence>
      <div
        id="breathing-exercise-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="breathing-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#fbfbfa] to-[#f4f7f6] rounded-3xl border border-teal-100 shadow-2xl p-6 sm:p-8 overflow-hidden text-center"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-teal-800">
              <div className="p-1.5 rounded-lg bg-teal-100/70">
                <Wind className="w-4 h-4 text-teal-700" />
              </div>
              <span id="breathing-modal-title" className="text-xs sm:text-sm font-bold tracking-tight">
                Guided Breathing with {profile.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle (Off by default) */}
              <button
                type="button"
                id="breathing-sound-toggle-btn"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-teal-50 border-teal-200 text-teal-800'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title={soundEnabled ? 'Mute Phase Chimes' : 'Enable Soft Phase Chimes'}
                aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                id="breathing-close-btn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close breathing exercise"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Phase Instruction Display */}
          <div className="my-3 min-h-[68px] flex flex-col items-center justify-center">
            <motion.span
              key={phase}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase"
            >
              {PHASE_CONFIG[phase].label}
            </motion.span>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {PHASE_CONFIG[phase].sub}
            </p>
          </div>

          {/* Central Breathing Guide: Visual Circle + Expanding Companion Body */}
          <div className="relative my-8 flex items-center justify-center h-64 sm:h-72">
            {/* Outer Pulsing Wellness Glow Ring */}
            <motion.div
              animate={
                reduced
                  ? { scale: 1, opacity: 0.3 }
                  : {
                      scale: ringScale,
                      opacity: isExpanding || isHeld ? 0.8 : 0.3,
                    }
              }
              transition={{
                duration: PHASE_CONFIG[phase].duration,
                ease: isHeld ? 'linear' : 'easeInOut',
              }}
              className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-teal-200/40 via-emerald-100/30 to-teal-300/30 border-2 border-teal-300/60 pointer-events-none"
            />

            {/* Inner Expanding Ripple Ring */}
            <motion.div
              animate={
                reduced
                  ? { scale: 1, opacity: 0.2 }
                  : {
                      scale: ringScale * 0.82,
                      opacity: isExpanding ? 0.6 : 0.2,
                    }
              }
              transition={{
                duration: PHASE_CONFIG[phase].duration,
                ease: 'easeInOut',
              }}
              className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-dashed border-teal-500/50 pointer-events-none"
            />

            {/* Animal Companion: Scales dynamically in sync with inhale/exhale */}
            <motion.div
              animate={
                reduced
                  ? { scale: 1 }
                  : {
                      scale: animalScale,
                    }
              }
              transition={{
                duration: PHASE_CONFIG[phase].duration,
                ease: isHeld ? 'linear' : 'easeInOut',
              }}
              className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center cursor-default"
            >
              <AnimalIllustration
                type={companionType}
                state="breathing"
                reducedMotion={reduced}
              />
            </motion.div>

            {/* Countdown Badge Float */}
            <div className="absolute bottom-1 bg-white/95 px-3 py-1 rounded-full border border-teal-200/90 shadow-2xs z-20 flex items-center gap-1.5">
              <span className="text-xs font-bold text-teal-800">
                {countdown}s
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {phase}
              </span>
            </div>
          </div>

          {/* Cycles and Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {cyclesCompleted} {cyclesCompleted === 1 ? 'cycle' : 'cycles'} completed
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="breathing-play-pause-btn"
                onClick={() => setIsActive((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {isActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="breathing-reset-btn"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                title="Restart Session"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
