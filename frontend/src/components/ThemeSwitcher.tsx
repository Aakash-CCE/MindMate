import React from 'react';
import { useTheme, ThemePalette } from '../context/ThemeContext';
import { Sun, Snowflake, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = true, className = '' }) => {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <div
        id="theme-switcher-compact"
        role="group"
        aria-label="Mood Palette Switcher"
        className={`inline-flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-2xs transition-all ${className}`}
      >
        <button
          id="theme-warm-btn"
          type="button"
          onClick={() => setTheme('warm')}
          aria-pressed={theme === 'warm'}
          title="Warm Mood Palette: Cozy, earthy & grounding"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            theme === 'warm'
              ? 'bg-amber-100 text-amber-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
          }`}
        >
          <Sun className={`w-3.5 h-3.5 ${theme === 'warm' ? 'text-amber-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Warm</span>
        </button>

        <button
          id="theme-cool-btn"
          type="button"
          onClick={() => setTheme('cool')}
          aria-pressed={theme === 'cool'}
          title="Cool Mood Palette: Crisp, serene & refreshing"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            theme === 'cool'
              ? 'bg-sky-100 text-sky-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
          }`}
        >
          <Snowflake className={`w-3.5 h-3.5 ${theme === 'cool' ? 'text-sky-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Cool</span>
        </button>
      </div>
    );
  }

  // Expanded card view for settings / profile page
  return (
    <div id="theme-switcher-expanded" className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Warm Theme Card */}
        <button
          id="theme-option-warm"
          type="button"
          onClick={() => setTheme('warm')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
            theme === 'warm'
              ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Warm Palette</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Cozy & Grounding
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Gentle sand canvas with earthy teal, emerald, and amber warmth.
              </p>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-4 h-4 rounded-full bg-[#fbfbf9] border border-slate-300" title="Canvas #fbfbf9" />
                <span className="w-4 h-4 rounded-full bg-[#0f766e]" title="Teal #0f766e" />
                <span className="w-4 h-4 rounded-full bg-[#f59e0b]" title="Amber #f59e0b" />
                <span className="w-4 h-4 rounded-full bg-[#10b981]" title="Emerald #10b981" />
              </div>
            </div>
          </div>
          {theme === 'warm' && (
            <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
          )}
        </button>

        {/* Cool Theme Card */}
        <button
          id="theme-option-cool"
          type="button"
          onClick={() => setTheme('cool')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
            theme === 'cool'
              ? 'bg-sky-50/60 border-sky-300 ring-2 ring-sky-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Cool Palette</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Crisp & Calming
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Serene cool mist canvas with refreshing ocean blue and sky indigo tones.
              </p>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-4 h-4 rounded-full bg-[#f0f5fa] border border-slate-300" title="Canvas #f0f5fa" />
                <span className="w-4 h-4 rounded-full bg-[#0284c7]" title="Ocean Blue #0284c7" />
                <span className="w-4 h-4 rounded-full bg-[#38bdf8]" title="Sky #38bdf8" />
                <span className="w-4 h-4 rounded-full bg-[#4f46e5]" title="Indigo #4f46e5" />
              </div>
            </div>
          </div>
          {theme === 'cool' && (
            <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
