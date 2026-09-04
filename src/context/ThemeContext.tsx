import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemePalette = 'warm' | 'cool';

interface ThemeContextType {
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'mindmate_theme_palette';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePalette>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'cool' || saved === 'warm') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'warm';
  });

  useEffect(() => {
    // Apply theme attribute to html and body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e);
    }
  }, [theme]);

  const setTheme = (newTheme: ThemePalette) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'warm' ? 'cool' : 'warm'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
