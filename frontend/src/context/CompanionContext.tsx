import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanionType, COMPANIONS } from '../components/AnimalCompanion/animalData';
import { BreathingExercise } from '../components/AnimalCompanion/BreathingExercise';
import { CompanionSelectorModal } from '../components/AnimalCompanion/CompanionSelectorModal';

interface CompanionContextType {
  companionType: CompanionType;
  setCompanionType: (type: CompanionType) => void;
  openBreathingExercise: () => void;
  closeBreathingExercise: () => void;
  isBreathingOpen: boolean;
  openSelector: (tab?: 'companion' | 'avatar') => void;
  closeSelector: () => void;
  isSelectorOpen: boolean;
  selectorInitialTab: 'companion' | 'avatar';
  shouldShowWelcome: boolean;
  markWelcomeShown: () => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

const STORAGE_KEY = 'mindmate_companion';
const WELCOME_SESSION_KEY = 'mindmate_welcome_shown_session';

export const CompanionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Companion Type (Default: capybara)
  const [companionType, setCompanionTypeState] = useState<CompanionType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CompanionType;
      if (saved && COMPANIONS[saved]) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'capybara';
  });

  const setCompanionType = (type: CompanionType) => {
    setCompanionTypeState(type);
    try {
      localStorage.setItem(STORAGE_KEY, type);
    } catch (err) {
      console.warn('Could not save companion to localStorage:', err);
    }
  };

  // 2. Modals state
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorInitialTab, setSelectorInitialTab] = useState<'companion' | 'avatar'>('companion');

  const openBreathingExercise = () => setIsBreathingOpen(true);
  const closeBreathingExercise = () => setIsBreathingOpen(false);

  const openSelector = (tab: 'companion' | 'avatar' = 'companion') => {
    setSelectorInitialTab(tab);
    setIsSelectorOpen(true);
  };
  const closeSelector = () => setIsSelectorOpen(false);

  // 3. Welcome banner eligibility (occasionally, once per session or 4 hours)
  const [shouldShowWelcome, setShouldShowWelcome] = useState<boolean>(() => {
    try {
      const lastShown = sessionStorage.getItem(WELCOME_SESSION_KEY);
      return !lastShown;
    } catch {
      return true;
    }
  });

  const markWelcomeShown = () => {
    try {
      sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
      setShouldShowWelcome(false);
    } catch {
      setShouldShowWelcome(false);
    }
  };

  return (
    <CompanionContext.Provider
      value={{
        companionType,
        setCompanionType,
        openBreathingExercise,
        closeBreathingExercise,
        isBreathingOpen,
        openSelector,
        closeSelector,
        isSelectorOpen,
        selectorInitialTab,
        shouldShowWelcome,
        markWelcomeShown,
      }}
    >
      {children}

      {/* Global Modals rendered once */}
      <BreathingExercise
        isOpen={isBreathingOpen}
        onClose={closeBreathingExercise}
        companionType={companionType}
      />

      <CompanionSelectorModal
        isOpen={isSelectorOpen}
        onClose={closeSelector}
        selectedCompanion={companionType}
        onSelect={setCompanionType}
        initialTab={selectorInitialTab}
      />
    </CompanionContext.Provider>
  );
};

export const useCompanion = (): CompanionContextType => {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
};
