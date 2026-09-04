import { Variants } from 'motion/react';
import { CompanionState } from './animalData';

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Character Body Motion Variants
export const getBodyVariants = (reduced: boolean): Variants => {
  if (reduced) {
    return {
      idle: { y: 0, scale: 1, rotate: 0 },
      welcome: { opacity: 1, scale: 1 },
      happy: { y: 0, scale: 1 },
      calm: { y: 0, scale: 1 },
      sad: { y: 0, scale: 1.02 },
      anxious: { y: 0, scale: 1 },
      stressed: { y: 0, scale: 1 },
      lonely: { y: 0, scale: 1.02 },
      okay: { y: 0, scale: 1 },
      angry: { y: 0, scale: 1 },
      thinking: { y: 0, scale: 1 },
      listening: { y: 0, scale: 1 },
      success: { y: 0, scale: 1.02 },
      breathing: { y: 0, scale: 1.05 },
    };
  }

  return {
    idle: {
      y: [0, -3, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: 3.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    welcome: {
      x: [-12, 0],
      rotate: [0, -4, 4, 0],
      y: [0, -4, 0],
      transition: {
        duration: 1.6,
        ease: 'easeOut',
      },
    },
    happy: {
      y: [0, -9, 0, -4, 0],
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: 'easeInOut',
      },
    },
    calm: {
      y: [0, -4, 0],
      scale: [1, 1.035, 1],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    sad: {
      y: [0, 2, 0],
      scale: 1.03,
      transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    anxious: {
      x: [0, -1, 1, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    stressed: {
      y: [0, -2, 0],
      scale: [1, 1.025, 1],
      transition: {
        duration: 3.0,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    lonely: {
      y: [0, 1.5, 0],
      scale: 1.03,
      transition: {
        duration: 4.0,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    okay: {
      y: [0, -2, 0],
      scale: [1, 1.015, 1],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    angry: {
      x: [0, -1.5, 1.5, 0],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    thinking: {
      rotate: [0, -3, 0],
      y: [0, -2, 0],
      transition: {
        duration: 2.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    listening: {
      rotate: [0, 2, 0],
      scale: [1, 1.015, 1],
      transition: {
        duration: 2.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    success: {
      y: [0, -8, 0, -3, 0],
      scale: [1, 1.06, 1],
      transition: {
        duration: 1.4,
        ease: 'easeOut',
      },
    },
    breathing: {
      scale: [1, 1.12, 1],
      transition: {
        duration: 4.0,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };
};

// Breathing Circle Guide Variants
export const breathingRingVariants: Variants = {
  inhale: {
    scale: 1.35,
    opacity: 0.85,
    transition: {
      duration: 4.0,
      ease: 'easeInOut',
    },
  },
  hold: {
    scale: 1.35,
    opacity: 0.9,
    transition: {
      duration: 4.0,
      ease: 'linear',
    },
  },
  exhale: {
    scale: 1.0,
    opacity: 0.45,
    transition: {
      duration: 4.0,
      ease: 'easeInOut',
    },
  },
};
