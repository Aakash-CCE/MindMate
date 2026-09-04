import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'full' | 'icon' | 'badge';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = false,
  className = '',
  onClick,
}) => {
  // Dimension mapping for height; width is calculated from the 176:96 (~1.833:1) infinity loop aspect ratio
  const getDimensions = () => {
    let h = 36;
    if (typeof size === 'number') {
      h = size;
    } else {
      switch (size) {
        case 'xs':
          h = 22;
          break;
        case 'sm':
          h = 28;
          break;
        case 'md':
          h = 36;
          break;
        case 'lg':
          h = 50;
          break;
        case 'xl':
          h = 68;
          break;
        default:
          h = 36;
      }
    }
    const w = Math.round(h * (176 / 96));
    return { height: h, width: w };
  };

  const { height, width } = getDimensions();

  // Colors matching the uploaded image:
  // Left loop: Soothing Sage Green (#7E9F85)
  // Right loop: Serene Slate Blue (#61849A)
  // Wordmark: Organic rich graphite (#232826)
  const SAGE_GREEN = '#7E9F85';
  const SLATE_BLUE = '#61849A';
  const TEXT_DARK = '#232826';

  // The Infinity Loop & Soundwave Emblem SVG
  const IconElement = (
    <svg
      viewBox="0 0 176 96"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform select-none"
      aria-label="MindMate Infinity Wave Emblem"
    >
      <defs>
        {/* Main Ribbon Gradient: Sage Green (left) to Slate Blue (right) */}
        <linearGradient id="mindmateRibbonGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#7E9F85" />
          <stop offset="32%" stopColor="#8DAF93" />
          <stop offset="50%" stopColor="#7B9E94" />
          <stop offset="68%" stopColor="#698D9F" />
          <stop offset="100%" stopColor="#5D8196" />
        </linearGradient>

        {/* Top crossing strand gradient */}
        <linearGradient id="mindmateCrossingGrad" x1="30%" y1="20%" x2="70%" y2="80%">
          <stop offset="0%" stopColor="#88AA8E" />
          <stop offset="50%" stopColor="#7A9D93" />
          <stop offset="100%" stopColor="#668B9D" />
        </linearGradient>

        {/* Subtle 3D shadow for ribbon depth */}
        <filter id="crossoverShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e322b" floodOpacity="0.2" />
        </filter>

        {/* Soundwave Gradient */}
        <linearGradient id="mindmateWaveGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#7FA290" />
          <stop offset="45%" stopColor="#70949E" />
          <stop offset="100%" stopColor="#63869A" />
        </linearGradient>
      </defs>

      {/* Base Infinity Ribbon (Continuous Lemniscate Path) */}
      <path
        d="M 88,48 C 71,26 55,15 38,15 C 19,15 9,30 9,48 C 9,66 19,81 38,81 C 55,81 71,70 88,48 C 105,26 121,15 138,15 C 157,15 167,30 167,48 C 167,66 157,81 138,81 C 121,81 105,70 88,48 Z"
        stroke="url(#mindmateRibbonGrad)"
        strokeWidth="13.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle under-crossing shadow for organic ribbon depth */}
      <path
        d="M 78,59 C 83,53 88,48 93,42"
        stroke="rgba(24, 45, 36, 0.16)"
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* Top Over-Crossing Ribbon Strand (from top-left to bottom-right) */}
      <path
        d="M 72,28 C 80,38 88,48 96,58 C 101,64 105,68 111,74"
        stroke="url(#mindmateCrossingGrad)"
        strokeWidth="13.5"
        strokeLinecap="round"
        filter="url(#crossoverShadow)"
      />

      {/* Soundwave / Frequency Pulse traversing through right loop */}
      <path
        d="M 88,48 C 95,48 99,48 104,48 C 108,48 111,42 114,38 C 117,34 120,58 123,66 C 127,74 131,23 135,23 C 139,23 142,60 145,66 C 148,72 151,43 154,43 C 157,43 160,48 165,48"
        stroke="url(#mindmateWaveGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
        {IconElement}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center p-3 sm:p-4 rounded-3xl bg-[#F5F8F6] border border-slate-200/80 shadow-xs ${className}`}
        onClick={onClick}
      >
        {IconElement}
      </div>
    );
  }

  // Full Logo: Icon + "MindMate" Wordmark (matching the typography in the image)
  return (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      onClick={onClick}
    >
      <div className="group-hover:scale-105 transition-transform duration-200 shrink-0 flex items-center justify-center">
        {IconElement}
      </div>

      <div className="flex flex-col text-left justify-center">
        <div
          className="font-extrabold tracking-tight leading-none flex items-center"
          style={{
            fontFamily: '"Nunito", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: `${Math.round(height * 0.72)}px`,
            letterSpacing: '-0.025em',
            color: TEXT_DARK,
          }}
        >
          <span style={{ color: SAGE_GREEN }}>Mind</span>
          <span style={{ color: SLATE_BLUE }}>Mate</span>
        </div>

        {showSubtitle && (
          <span
            className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-0.5"
            style={{ color: '#6A897E' }}
          >
            Emotional Wellness
          </span>
        )}
      </div>
    </div>
  );
};
export default Logo;
