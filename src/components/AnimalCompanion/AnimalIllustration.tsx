import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CompanionType, CompanionState } from './animalData';

interface AnimalIllustrationProps {
  type?: CompanionType;
  state?: CompanionState;
  reducedMotion?: boolean;
}

export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  type = 'capybara',
  state = 'idle',
  reducedMotion = false,
}) => {
  // Natural realistic blinking cycle with random intervals
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextDelay = 2600 + Math.random() * 3200;
        timeoutId = setTimeout(triggerBlink, nextDelay);
      }, 180);
    };

    timeoutId = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(timeoutId);
  }, [reducedMotion]);

  // Determine emotional states
  const isHappy = state === 'happy' || state === 'success' || state === 'welcome';
  const isCalm = state === 'calm' || state === 'breathing';
  const isThinking = state === 'thinking';
  const isSadOrLonely = state === 'sad' || state === 'lonely';

  // =========================================================================
  // 1. SWEET BUNNY (Pip) - Directly inspired by Reference Image 4 (top-right)
  // Holding fresh orange carrot with leafy greens, anime eyes, twitching ears
  // =========================================================================
  const renderBunny = () => {
    return (
      <g id="bunny-character">
        {/* Ground Ambient Shadow */}
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Fluffy Cotton Tail (wiggles gently) */}
        <motion.ellipse
          cx="28"
          cy="96"
          rx="9"
          ry="9"
          fill="url(#bunnyWhiteGrad)"
          stroke="#e2e8f0"
          strokeWidth="1"
          animate={reducedMotion ? {} : { x: [-1, 2, -1], y: [0, -1.5, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Back Ears with organic 3D gradient and lively twitching */}
        {/* Left Ear */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  rotate: isHappy ? [-5, 7, -5] : [-2, 3, -2],
                  y: [0, -1.5, 0],
                }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '48px 45px' }}
        >
          {/* Outer Ear */}
          <path
            d="M 44 48 C 30 24 35 2 48 3 C 58 4 58 24 53 48 Z"
            fill="url(#bunnyWhiteGrad)"
            stroke="#e2e8f0"
            strokeWidth="1.4"
          />
          {/* Inner Ear Soft Pink Glow */}
          <path
            d="M 45 42 C 37 24 40 10 48 10 C 53 10 53 24 50 42 Z"
            fill="url(#pinkInnerEarGrad)"
            opacity="0.85"
          />
        </motion.g>

        {/* Right Ear (playfully angled with gentle tip flutter) */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  rotate: isHappy ? [6, -6, 6] : [3, -2, 3],
                  y: [0, -1.5, 0],
                }
          }
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
          style={{ transformOrigin: '82px 45px' }}
        >
          {/* Outer Ear */}
          <path
            d="M 77 48 C 72 24 72 4 82 3 C 95 2 100 24 86 48 Z"
            fill="url(#bunnyWhiteGrad)"
            stroke="#e2e8f0"
            strokeWidth="1.4"
          />
          {/* Inner Ear Soft Pink Glow */}
          <path
            d="M 80 42 C 77 24 77 10 82 10 C 90 10 93 24 85 42 Z"
            fill="url(#pinkInnerEarGrad)"
            opacity="0.85"
          />
        </motion.g>

        {/* Chubby Sitting Body with Breathing Motion */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.025, 1],
                  y: [0, -1, 0],
                }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 85px' }}
        >
          {/* Main Body */}
          <ellipse
            cx="65"
            cy="88"
            rx="34"
            ry="28"
            fill="url(#bunnyBodyGrad)"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />

          {/* Soft Cream Tummy Patch */}
          <ellipse cx="65" cy="90" rx="22" ry="19" fill="#ffffff" opacity="0.9" />
        </motion.g>

        {/* Round Chubby Bunny Head */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, -1.8, 0],
                  rotate: isHappy ? [-1.5, 1.5, -1.5] : [-0.8, 0.8, -0.8],
                }
          }
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 60px' }}
        >
          {/* Head Base */}
          <circle
            cx="65"
            cy="58"
            r="32"
            fill="url(#bunnyHeadGrad)"
            stroke="#e2e8f0"
            strokeWidth="1.3"
          />

          {/* Chubby Cheeks Bulge */}
          <ellipse cx="44" cy="66" rx="14" ry="11" fill="url(#bunnyWhiteGrad)" />
          <ellipse cx="86" cy="66" rx="14" ry="11" fill="url(#bunnyWhiteGrad)" />

          {/* Radiant Rosy Blushing Cheeks with Soft Stipples */}
          <ellipse cx="43" cy="68" rx="7" ry="4.5" fill="#fb7185" opacity={isHappy ? 0.65 : 0.48} />
          <ellipse cx="87" cy="68" rx="7" ry="4.5" fill="#fb7185" opacity={isHappy ? 0.65 : 0.48} />
          <circle cx="41" cy="67" r="1" fill="#ffffff" opacity="0.8" />
          <circle cx="85" cy="67" r="1" fill="#ffffff" opacity="0.8" />

          {/* Eyes: Expressive Chibi Anime Eyes with Multiple Specular Highlights */}
          {isBlinking ? (
            // Cute closed blinking eyelashes
            <>
              <path d="M 43 57 Q 50 63 57 57" fill="none" stroke="#261b17" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 73 57 Q 80 63 87 57" fill="none" stroke="#261b17" strokeWidth="2.8" strokeLinecap="round" />
            </>
          ) : isHappy ? (
            // Curved joyous smiling eyes (like in cute anime)
            <>
              <path d="M 42 59 Q 50 51 58 59" fill="none" stroke="#261b17" strokeWidth="3" strokeLinecap="round" />
              <path d="M 72 59 Q 80 51 88 59" fill="none" stroke="#261b17" strokeWidth="3" strokeLinecap="round" />
              <path d="M 40 60 L 38 57" stroke="#261b17" strokeWidth="2" strokeLinecap="round" />
              <path d="M 90 60 L 92 57" stroke="#261b17" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            // Large Sparkling Chibi Eyes (Image 4 style)
            <g id="bunny-sparkling-eyes">
              {/* Left Eye */}
              <ellipse cx="49" cy="56" rx="6.8" ry="8.5" fill="#1e1815" />
              {/* Eye Color Rim / Iris Reflection */}
              <path d="M 44 58 C 45 62 53 62 54 58" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
              {/* Big Upper Specular Glint */}
              <circle cx="47" cy="52.5" r="2.8" fill="#ffffff" />
              {/* Secondary Lower Twinkle Glint */}
              <circle cx="52" cy="60" r="1.4" fill="#ffffff" />
              {/* Tiny Side Sparkle */}
              <circle cx="45" cy="57" r="0.8" fill="#ffffff" />
              {/* Cute upper eyelash */}
              <path d="M 44 49 Q 50 47 56 49" fill="none" stroke="#261b17" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 42 51 L 39 49" stroke="#261b17" strokeWidth="1.6" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="81" cy="56" rx="6.8" ry="8.5" fill="#1e1815" />
              <path d="M 76 58 C 77 62 85 62 86 58" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="79" cy="52.5" r="2.8" fill="#ffffff" />
              <circle cx="84" cy="60" r="1.4" fill="#ffffff" />
              <circle cx="77" cy="57" r="0.8" fill="#ffffff" />
              <path d="M 74 49 Q 80 47 86 49" fill="none" stroke="#261b17" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 88 51 L 91 49" stroke="#261b17" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}

          {/* Tiny Cute Pink Nose */}
          <ellipse cx="65" cy="63" rx="2.5" ry="1.8" fill="#f43f5e" />

          {/* Sweet Bunny Mouth */}
          <path
            d="M 61 67 Q 65 71 69 67"
            fill="none"
            stroke="#261b17"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Subtle line from nose to mouth */}
          <line x1="65" y1="64.8" x2="65" y2="67" stroke="#261b17" strokeWidth="1.4" />
        </motion.g>

        {/* HELD OBJECT: The Fresh Cute Carrot from Reference Image 4! */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  rotate: isHappy ? [-3, 3, -3] : [-1.5, 1.5, -1.5],
                  y: [0, -1.2, 0],
                }
          }
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 92px' }}
        >
          {/* Carrot Lush Green Tops / Leaves */}
          <g transform="translate(65, 78)">
            {/* Center leaf */}
            <path
              d="M 0 0 C -4 -12 -1 -17 0 -19 C 1 -17 4 -12 0 0 Z"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="0.8"
            />
            {/* Left curved leaf */}
            <path
              d="M -2 -2 C -10 -8 -13 -13 -11 -15 C -8 -15 -4 -10 -2 -2 Z"
              fill="#16a34a"
              stroke="#15803d"
              strokeWidth="0.8"
            />
            {/* Right curved leaf */}
            <path
              d="M 2 -2 C 10 -8 13 -13 11 -15 C 8 -15 4 -10 2 -2 Z"
              fill="#4ade80"
              stroke="#15803d"
              strokeWidth="0.8"
            />
          </g>

          {/* Carrot Plump Orange Body */}
          <path
            d="M 57 78 C 55 76 75 76 73 78 C 72 90 67 104 65 107 C 63 104 58 90 57 78 Z"
            fill="url(#carrotBodyGrad)"
            stroke="#ea580c"
            strokeWidth="1.2"
          />

          {/* Carrot Texture Creases */}
          <path d="M 60 83 Q 64 84 68 83" fill="none" stroke="#c2410c" strokeWidth="1" strokeLinecap="round" />
          <path d="M 61 90 Q 65 91 69 89" fill="none" stroke="#c2410c" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M 63 97 Q 65 98 67 97" fill="none" stroke="#c2410c" strokeWidth="0.8" strokeLinecap="round" />

          {/* Little Front Paws Hugging the Carrot */}
          <ellipse
            cx="55"
            cy="84"
            rx="6"
            ry="4.8"
            fill="url(#bunnyWhiteGrad)"
            stroke="#e2e8f0"
            strokeWidth="1"
            transform="rotate(18 55 84)"
          />
          <ellipse
            cx="75"
            cy="84"
            rx="6"
            ry="4.8"
            fill="url(#bunnyWhiteGrad)"
            stroke="#e2e8f0"
            strokeWidth="1"
            transform="rotate(-18 75 84)"
          />
        </motion.g>

        {/* Adorable Sitting Back Feet with Pink Paw Pads (Reference Image 4 & 6) */}
        {/* Left Foot */}
        <g transform="translate(37, 102)">
          <ellipse cx="0" cy="0" rx="10" ry="7" fill="url(#bunnyWhiteGrad)" stroke="#cbd5e1" strokeWidth="1" />
          {/* Main Heel Pad */}
          <ellipse cx="0" cy="1" rx="5" ry="3.8" fill="#fda4af" />
          {/* Toe Beans */}
          <circle cx="-5" cy="-4" r="1.8" fill="#fda4af" />
          <circle cx="0" cy="-5" r="2" fill="#fda4af" />
          <circle cx="5" cy="-4" r="1.8" fill="#fda4af" />
        </g>

        {/* Right Foot */}
        <g transform="translate(93, 102)">
          <ellipse cx="0" cy="0" rx="10" ry="7" fill="url(#bunnyWhiteGrad)" stroke="#cbd5e1" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="5" ry="3.8" fill="#fda4af" />
          <circle cx="-5" cy="-4" r="1.8" fill="#fda4af" />
          <circle cx="0" cy="-5" r="2" fill="#fda4af" />
          <circle cx="5" cy="-4" r="1.8" fill="#fda4af" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 2. GENTLE PANDA (Pan) - Directly inspired by Reference Image 4 (bottom-left)
  // Holding leafy fresh green bamboo branch, large glossy eyes, twitching ears
  // =========================================================================
  const renderPanda = () => {
    return (
      <g id="panda-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Soft Fluffy Black Ears */}
        <motion.circle
          cx="38"
          cy="38"
          r="13"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.2"
          animate={reducedMotion ? {} : { rotate: [-4, 4, -4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '42px 46px' }}
        />
        <motion.circle
          cx="92"
          cy="38"
          r="13"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.2"
          animate={reducedMotion ? {} : { rotate: [4, -4, 4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '88px 46px' }}
        />

        {/* Chubby White Body */}
        <ellipse cx="65" cy="88" rx="34" ry="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />

        {/* Head */}
        <circle cx="65" cy="60" r="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.3" />

        {/* Cute Panda Black Eye Patches */}
        <ellipse cx="48" cy="57" rx="9" ry="11.5" fill="#1e293b" transform="rotate(-16 48 57)" />
        <ellipse cx="82" cy="57" rx="9" ry="11.5" fill="#1e293b" transform="rotate(16 82 57)" />

        {/* Sparkling Big Eyes */}
        {isBlinking ? (
          <>
            <path d="M 44 57 Q 48 61 52 57" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 78 57 Q 82 61 86 57" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          </>
        ) : isHappy ? (
          <>
            <path d="M 44 58 Q 48 53 52 58" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 78 58 Q 82 53 86 58" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
          </>
        ) : (
          <g>
            <circle cx="48" cy="56" r="4.2" fill="#ffffff" />
            <circle cx="49" cy="55.5" r="2.4" fill="#0f172a" />
            <circle cx="47" cy="54" r="1.3" fill="#ffffff" />
            <circle cx="50" cy="57.5" r="0.8" fill="#ffffff" />

            <circle cx="82" cy="56" r="4.2" fill="#ffffff" />
            <circle cx="81" cy="55.5" r="2.4" fill="#0f172a" />
            <circle cx="80" cy="54" r="1.3" fill="#ffffff" />
            <circle cx="83" cy="57.5" r="0.8" fill="#ffffff" />
          </g>
        )}

        {/* Nose & Mouth */}
        <ellipse cx="65" cy="65" rx="3.5" ry="2.6" fill="#0f172a" />
        <path d="M 61 69 Q 65 73 69 69" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <ellipse cx="37" cy="69" rx="6.5" ry="4" fill="#fda4af" opacity="0.6" />
        <ellipse cx="93" cy="69" rx="6.5" ry="4" fill="#fda4af" opacity="0.6" />

        {/* Held Bamboo Shoot with Leaves */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-2, 2, -2] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 88px' }}
        >
          {/* Bamboo Stalk */}
          <rect x="63" y="74" width="5" height="32" rx="2" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          <line x1="62" y1="84" x2="69" y2="84" stroke="#15803d" strokeWidth="1.2" />
          <line x1="62" y1="94" x2="69" y2="94" stroke="#15803d" strokeWidth="1.2" />
          {/* Bamboo Leaves */}
          <path d="M 68 76 C 76 72 82 74 85 76 C 80 80 73 80 68 78 Z" fill="#4ade80" stroke="#15803d" strokeWidth="0.8" />
          <path d="M 62 82 C 54 78 48 80 45 82 C 50 86 57 86 62 84 Z" fill="#16a34a" stroke="#15803d" strokeWidth="0.8" />

          {/* Black Front Paws */}
          <ellipse cx="55" cy="85" rx="7" ry="5.5" fill="#1e293b" transform="rotate(20 55 85)" />
          <ellipse cx="75" cy="85" rx="7" ry="5.5" fill="#1e293b" transform="rotate(-20 75 85)" />
        </motion.g>

        {/* Sitting Feet with Pink Pads */}
        <g transform="translate(36, 104)">
          <ellipse cx="0" cy="0" rx="10" ry="7" fill="#1e293b" />
          <ellipse cx="0" cy="1" rx="5" ry="3.8" fill="#fda4af" />
          <circle cx="-5" cy="-4" r="1.8" fill="#fda4af" />
          <circle cx="0" cy="-5" r="2" fill="#fda4af" />
          <circle cx="5" cy="-4" r="1.8" fill="#fda4af" />
        </g>
        <g transform="translate(94, 104)">
          <ellipse cx="0" cy="0" rx="10" ry="7" fill="#1e293b" />
          <ellipse cx="0" cy="1" rx="5" ry="3.8" fill="#fda4af" />
          <circle cx="-5" cy="-4" r="1.8" fill="#fda4af" />
          <circle cx="0" cy="-5" r="2" fill="#fda4af" />
          <circle cx="5" cy="-4" r="1.8" fill="#fda4af" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 3. BABY CAPYBARA (Capi) - Directly inspired by Reference Image 5
  // Holding a big radiant golden sunflower with green leaves, serene warm eyes
  // =========================================================================
  const renderCapybara = () => {
    return (
      <g id="capybara-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Little Round Capybara Ears */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '38px 46px' }}
        >
          <ellipse cx="38" cy="46" rx="7.5" ry="9.5" fill="#a46835" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="38" cy="46" rx="4" ry="6" fill="#5c2605" />
        </motion.g>
        <motion.g
          animate={reducedMotion ? {} : { rotate: [3, -3, 3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '92px 46px' }}
        >
          <ellipse cx="92" cy="46" rx="7.5" ry="9.5" fill="#a46835" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="92" cy="46" rx="4" ry="6" fill="#5c2605" />
        </motion.g>

        {/* Chubby Barrel Body */}
        <rect x="33" y="44" width="64" height="64" rx="30" fill="url(#capybaraGrad)" stroke="#854d0e" strokeWidth="1.3" />
        {/* Soft Cream Chest */}
        <ellipse cx="65" cy="80" rx="20" ry="17" fill="#fef3c7" opacity="0.6" />

        {/* Snout */}
        <rect x="44" y="58" width="42" height="27" rx="13" fill="#dfbd96" stroke="#a46d3e" strokeWidth="1" />
        <ellipse cx="58" cy="67" rx="2.2" ry="2.8" fill="#5c3817" />
        <ellipse cx="72" cy="67" rx="2.2" ry="2.8" fill="#5c3817" />
        <path d="M 59 73 Q 65 77 71 73" fill="none" stroke="#5c3817" strokeWidth="1.8" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <ellipse cx="40" cy="68" rx="5" ry="3.5" fill="#fb7185" opacity="0.55" />
        <ellipse cx="90" cy="68" rx="5" ry="3.5" fill="#fb7185" opacity="0.55" />

        {/* Eyes */}
        {isBlinking ? (
          <>
            <line x1="46" y1="55" x2="53" y2="55" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="77" y1="55" x2="84" y2="55" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
          </>
        ) : isHappy ? (
          <>
            <path d="M 46 56 Q 50 50 54 56" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 76 56 Q 80 50 84 56" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="50" cy="55" r="4.2" fill="#451a03" />
            <circle cx="48.5" cy="53.5" r="1.8" fill="#ffffff" />
            <circle cx="51.5" cy="56.5" r="0.9" fill="#ffffff" />
            <circle cx="80" cy="55" r="4.2" fill="#451a03" />
            <circle cx="78.5" cy="53.5" r="1.8" fill="#ffffff" />
            <circle cx="81.5" cy="56.5" r="0.9" fill="#ffffff" />
          </>
        )}

        {/* HELD SUNFLOWER (Reference Image 5) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 95px' }}
        >
          {/* Flower Stem */}
          <path d="M 65 85 Q 67 98 65 108" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          {/* Green leaf */}
          <path d="M 66 94 Q 78 92 78 98 Q 72 102 66 97" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />

          {/* Sunflower Head */}
          <g transform="translate(65, 82)">
            {/* Golden Petals Ring */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-13"
                rx="3.5"
                ry="7.5"
                fill="#facc15"
                stroke="#eab308"
                strokeWidth="0.7"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Center Disc */}
            <circle cx="0" cy="0" r="8.5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <circle cx="0" cy="0" r="5" fill="#92400e" opacity="0.8" />
          </g>

          {/* Cute Capybara Paws Hugging Sunflower Stem */}
          <ellipse cx="54" cy="94" rx="6" ry="4.5" fill="#a46d3e" stroke="#78350f" strokeWidth="1" transform="rotate(15 54 94)" />
          <ellipse cx="76" cy="94" rx="6" ry="4.5" fill="#a46d3e" stroke="#78350f" strokeWidth="1" transform="rotate(-15 76 94)" />
        </motion.g>

        {/* Sitting Paws */}
        <ellipse cx="44" cy="110" rx="8" ry="5" fill="#a46d3e" stroke="#78350f" strokeWidth="1" />
        <ellipse cx="86" cy="110" rx="8" ry="5" fill="#a46d3e" stroke="#78350f" strokeWidth="1" />
      </g>
    );
  };

  // =========================================================================
  // 4. CALM KITTEN / FOX (Mochi) - Holding cute blossom flower (Image 4 top-left)
  // =========================================================================
  const renderCat = () => {
    return (
      <g id="cat-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Fluffy Tail Wag */}
        <motion.path
          d="M 94 92 C 112 85 116 65 106 58 C 100 55 96 65 92 82 Z"
          fill="#fed7aa"
          stroke="#ea580c"
          strokeWidth="1.2"
          animate={reducedMotion ? {} : { rotate: [-6, 8, -6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '92px 88px' }}
        />

        {/* Pointed Ears */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '42px 42px' }}
        >
          <path d="M 32 46 L 30 20 L 52 32 Z" fill="#ffedd5" stroke="#fdba74" strokeWidth="1.3" />
          <path d="M 35 40 L 33 25 L 48 33 Z" fill="#fda4af" opacity="0.75" />
        </motion.g>
        <motion.g
          animate={reducedMotion ? {} : { rotate: [3, -3, 3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '88px 42px' }}
        >
          <path d="M 98 46 L 100 20 L 78 32 Z" fill="#ffedd5" stroke="#fdba74" strokeWidth="1.3" />
          <path d="M 95 40 L 97 25 L 82 33 Z" fill="#fda4af" opacity="0.75" />
        </motion.g>

        {/* Body & Head */}
        <ellipse cx="65" cy="88" rx="34" ry="28" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.2" />
        <circle cx="65" cy="58" r="32" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.3" />

        {/* Whiskers */}
        <line x1="32" y1="62" x2="44" y2="64" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="32" y1="68" x2="44" y2="67" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="86" y1="64" x2="98" y2="62" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="86" y1="67" x2="98" y2="68" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />

        {/* Eyes */}
        {isBlinking ? (
          <>
            <path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 74 56 Q 80 62 86 56" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <g>
            <ellipse cx="50" cy="55" rx="6" ry="7.5" fill="#0d9488" />
            <ellipse cx="50" cy="55" rx="3.5" ry="6" fill="#134e4a" />
            <circle cx="48" cy="52" r="2.2" fill="#ffffff" />
            <circle cx="52" cy="57" r="1.1" fill="#ffffff" />

            <ellipse cx="80" cy="55" rx="6" ry="7.5" fill="#0d9488" />
            <ellipse cx="80" cy="55" rx="3.5" ry="6" fill="#134e4a" />
            <circle cx="78" cy="52" r="2.2" fill="#ffffff" />
            <circle cx="82" cy="57" r="1.1" fill="#ffffff" />
          </g>
        )}

        {/* Nose & Mouth */}
        <polygon points="65,65 62,62 68,62" fill="#f43f5e" />
        <path d="M 61 68 Q 65 71 69 68" fill="none" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="40" cy="67" rx="6" ry="4" fill="#fda4af" opacity="0.65" />
        <ellipse cx="90" cy="67" rx="6" ry="4" fill="#fda4af" opacity="0.65" />

        {/* Holding Pink Blossom Flower */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-3, 3, -3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 88px' }}
        >
          {/* Flower */}
          <g transform="translate(65, 80)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle
                key={deg}
                cx="0"
                cy="-10"
                r="5.5"
                fill="#f472b6"
                stroke="#db2777"
                strokeWidth="0.7"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fde047" stroke="#eab308" strokeWidth="0.8" />
          </g>
          {/* Kitten Paws */}
          <ellipse cx="55" cy="85" rx="6" ry="4.5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <ellipse cx="75" cy="85" rx="6" ry="4.5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
        </motion.g>

        {/* Sitting Feet */}
        <g transform="translate(37, 104)">
          <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#fda4af" />
        </g>
        <g transform="translate(93, 104)">
          <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#fda4af" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 5. FRIENDLY PUPPY (Biscuit) - Floppy ears bounce, holding golden biscuit/heart
  // =========================================================================
  const renderPuppy = () => {
    return (
      <g id="puppy-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Wagging Puppy Tail */}
        <motion.path
          d="M 94 92 C 108 85 116 75 110 65 C 104 64 100 75 92 84 Z"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="1.2"
          animate={reducedMotion ? {} : { rotate: [-10, 12, -10] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '92px 88px' }}
        />

        {/* Bouncing Floppy Ears */}
        <motion.ellipse
          cx="33"
          cy="52"
          rx="10"
          ry="19"
          fill="#b45309"
          stroke="#78350f"
          strokeWidth="1.2"
          animate={reducedMotion ? {} : { rotate: [-18, -6, -18], y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '38px 40px' }}
        />
        <motion.ellipse
          cx="97"
          cy="52"
          rx="10"
          ry="19"
          fill="#b45309"
          stroke="#78350f"
          strokeWidth="1.2"
          animate={reducedMotion ? {} : { rotate: [18, 6, 18], y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          style={{ transformOrigin: '92px 40px' }}
        />

        {/* Body & Head */}
        <ellipse cx="65" cy="88" rx="34" ry="28" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.2" />
        <circle cx="65" cy="58" r="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.3" />

        {/* Eye Patch */}
        <ellipse cx="50" cy="53" rx="10" ry="12" fill="#fde68a" />

        {/* Eyes */}
        {isBlinking ? (
          <>
            <path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 74 56 Q 80 62 86 56" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <g>
            <ellipse cx="50" cy="55" rx="6.5" ry="8" fill="#451a03" />
            <circle cx="48" cy="52" r="2.6" fill="#ffffff" />
            <circle cx="52" cy="58" r="1.3" fill="#ffffff" />

            <ellipse cx="80" cy="55" rx="6.5" ry="8" fill="#451a03" />
            <circle cx="78" cy="52" r="2.6" fill="#ffffff" />
            <circle cx="82" cy="58" r="1.3" fill="#ffffff" />
          </g>
        )}

        {/* Nose & Smile */}
        <ellipse cx="65" cy="65" rx="4.5" ry="3.2" fill="#1e293b" />
        <path d="M 60 70 Q 65 76 70 70" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        {/* Tiny Tongue */}
        <path d="M 63 71 Q 65 77 67 71 Z" fill="#f43f5e" />

        <ellipse cx="40" cy="68" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
        <ellipse cx="90" cy="68" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />

        {/* Holding Golden Puppy Bone */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 86px' }}
        >
          <g transform="translate(65, 84)">
            <rect x="-14" y="-3" width="28" height="6" rx="3" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1" />
            <circle cx="-13" cy="-4" r="3" fill="#fffbeb" stroke="#fcd34d" strokeWidth="0.8" />
            <circle cx="-13" cy="4" r="3" fill="#fffbeb" stroke="#fcd34d" strokeWidth="0.8" />
            <circle cx="13" cy="-4" r="3" fill="#fffbeb" stroke="#fcd34d" strokeWidth="0.8" />
            <circle cx="13" cy="4" r="3" fill="#fffbeb" stroke="#fcd34d" strokeWidth="0.8" />
          </g>
          <ellipse cx="55" cy="85" rx="6" ry="4.5" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="75" cy="85" rx="6" ry="4.5" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
        </motion.g>

        {/* Sitting Feet */}
        <g transform="translate(37, 104)">
          <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#fca5a5" />
        </g>
        <g transform="translate(93, 104)">
          <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#fca5a5" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 6. BRAVE BABY DINO (Rex) - Huge favorite for boys!
  // =========================================================================
  // 6. APEX TYRANNOSAURUS TITAN (Rex) - Fierce prehistoric apex predator!
  // Muscular silhouette, sharp serrated teeth, armored dorsal spikes, predator eyes
  // =========================================================================
  const renderDino = () => {
    return (
      <g id="dino-character">
        <ellipse cx="65" cy="118" rx="42" ry="7" fill="#0f172a" opacity="0.18" />

        {/* Thrashing Muscular Armored Tail with Battle Spikes */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-6, 9, -6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '88px 84px' }}
        >
          {/* Heavy Armored Tail */}
          <path
            d="M 86 80 C 114 74 128 58 124 44 C 116 48 104 62 82 74 Z"
            fill="url(#dinoApexGrad)"
            stroke="#052e16"
            strokeWidth="1.6"
          />
          {/* Jagged Dorsal Tail Armor Spikes */}
          <polygon points="102,64 112,50 114,64" fill="#052e16" stroke="#14532d" strokeWidth="1" />
          <polygon points="114,52 124,38 122,54" fill="#052e16" stroke="#14532d" strokeWidth="1" />
          <polygon points="122,44 129,32 126,46" fill="#f59e0b" stroke="#052e16" strokeWidth="0.8" />
        </motion.g>

        {/* Armored Dorsal Plates along the Spine */}
        <g id="dino-back-armor">
          <polygon points="44,20 48,8 54,20" fill="#052e16" stroke="#14532d" strokeWidth="1.2" />
          <polygon points="56,18 62,6 68,18" fill="#052e16" stroke="#14532d" strokeWidth="1.2" />
          <polygon points="70,22 78,8 84,22" fill="#052e16" stroke="#14532d" strokeWidth="1.2" />
          <polygon points="84,32 94,18 96,36" fill="#052e16" stroke="#14532d" strokeWidth="1.2" />
        </g>

        {/* Muscular Armored Torso with Predator Camo Stripes */}
        <ellipse cx="64" cy="85" rx="35" ry="27" fill="url(#dinoApexGrad)" stroke="#052e16" strokeWidth="1.6" />

        {/* Camouflage War Stripes */}
        <path d="M 46 72 L 56 78 M 76 72 L 66 78 M 50 86 L 60 90 M 82 84 L 70 88" stroke="#052e16" strokeWidth="3" strokeLinecap="round" opacity="0.65" />

        {/* Armored Chest Plates */}
        <path d="M 52 74 Q 64 78 76 74 L 72 96 Q 64 100 56 96 Z" fill="#166534" stroke="#052e16" strokeWidth="1.2" />
        <line x1="55" y1="80" x2="73" y2="80" stroke="#052e16" strokeWidth="1" />
        <line x1="56" y1="86" x2="72" y2="86" stroke="#052e16" strokeWidth="1" />
        <line x1="58" y1="92" x2="70" y2="92" stroke="#052e16" strokeWidth="1" />

        {/* Powerful T-Rex Skull with Heavy Serrated Jaw */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -2, 0], rotate: [-1, 1.5, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 56px' }}
        >
          {/* Heavy Armored Skull Base */}
          <path
            d="M 38 42 C 38 24 58 18 78 20 C 94 22 99 36 96 50 L 66 54 L 38 48 Z"
            fill="url(#dinoApexGrad)"
            stroke="#052e16"
            strokeWidth="1.6"
          />

          {/* Heavy Armored Brow Ridge */}
          <path d="M 52 28 L 74 30 L 76 34 L 52 32 Z" fill="#052e16" />

          {/* Deep Predator Jaw (Open with Sharp Serrated White Teeth) */}
          <path d="M 44 48 L 94 50 L 90 64 L 50 60 Z" fill="#090d0b" stroke="#052e16" strokeWidth="1.4" />

          {/* Sharp White Razor Teeth */}
          {/* Upper Teeth */}
          <polygon points="52,48 54,54 56,48" fill="#ffffff" />
          <polygon points="58,49 61,56 64,49" fill="#ffffff" />
          <polygon points="66,49 69,57 72,49" fill="#ffffff" />
          <polygon points="74,50 77,57 80,50" fill="#ffffff" />
          <polygon points="82,50 85,56 88,50" fill="#ffffff" />
          <polygon points="89,50 91,55 93,50" fill="#ffffff" />
          {/* Lower Teeth */}
          <polygon points="54,60 56,54 58,60" fill="#ffffff" />
          <polygon points="61,61 63,54 65,61" fill="#ffffff" />
          <polygon points="68,61 71,53 74,61" fill="#ffffff" />
          <polygon points="76,62 79,54 82,62" fill="#ffffff" />
          <polygon points="84,62 86,56 88,62" fill="#ffffff" />

          {/* Piercing Glowing Amber Reptilian Predator Eyes */}
          {isBlinking ? (
            <line x1="56" y1="36" x2="68" y2="37" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
          ) : (
            <g id="dino-predator-eye">
              {/* Eye Socket Shadow */}
              <ellipse cx="62" cy="35" rx="7.5" ry="5.5" fill="#052e16" />
              {/* Glowing Amber Iris */}
              <ellipse cx="62" cy="35" rx="6" ry="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
              {/* Vertical Slit Predator Pupil */}
              <ellipse cx="62" cy="35" rx="1.4" ry="4" fill="#000000" />
              {/* Specular Glint */}
              <circle cx="60.5" cy="33.5" r="1.1" fill="#ffffff" />
            </g>
          )}

          {/* Nostril Horn Crest */}
          <ellipse cx="88" cy="32" rx="2" ry="1.4" fill="#052e16" />
          <polygon points="86,28 92,20 94,29" fill="#052e16" stroke="#14532d" strokeWidth="0.8" />
        </motion.g>

        {/* Muscular Armored Forelimbs with Sharp Talons */}
        <g id="dino-arms">
          <ellipse cx="48" cy="80" rx="7" ry="4.5" fill="#15803d" stroke="#052e16" strokeWidth="1.2" transform="rotate(30 48 80)" />
          {/* Claws */}
          <path d="M 43 83 L 39 88 M 46 84 L 44 90 M 49 84 L 49 90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="82" cy="80" rx="7" ry="4.5" fill="#15803d" stroke="#052e16" strokeWidth="1.2" transform="rotate(-30 82 80)" />
          {/* Claws */}
          <path d="M 87 83 L 91 88 M 84 84 L 86 90 M 81 84 L 81 90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Colossal Muscular Raptor Legs with Razor Talons */}
        <g transform="translate(36, 102)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#15803d" stroke="#052e16" strokeWidth="1.4" />
          {/* 3 Lethal Claws */}
          <polygon points="-8,4 -13,12 -5,7" fill="#ffffff" stroke="#052e16" strokeWidth="0.8" />
          <polygon points="-1,6 -1,15 3,7" fill="#ffffff" stroke="#052e16" strokeWidth="0.8" />
          <polygon points="6,4 12,12 5,7" fill="#ffffff" stroke="#052e16" strokeWidth="0.8" />
        </g>
        <g transform="translate(94, 102)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#15803d" stroke="#052e16" strokeWidth="1.4" />
          {/* 3 Lethal Claws */}
          <polygon points="-6,4 -12,12 -5,7" fill="#ffffff" stroke="#052e16" strokeWidth="0.8" />
          <polygon points="-1,6 -1,15 3,7" fill="#ffffff" stroke="#052e16" strokeWidth="0.8" />
          <polygon points="8,4 13,12 5,7" fill="#ffffff" stroke="#052e16" strokeWidth="0.8" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 7. CHUBBY BABY PENGUIN (Pingo) - Directly inspired by Reference Image 2!
  // Dark navy cap, big blue-ringed anime eyes, orange beak, flapping flippers
  // =========================================================================
  const renderPenguin = () => {
    return (
      <g id="penguin-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Flapping Flippers */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: isHappy ? [-16, 12, -16] : [-8, 6, -8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '33px 66px' }}
        >
          <path
            d="M 36 62 C 22 72 16 92 28 98 C 34 94 36 82 38 66 Z"
            fill="url(#penguinDarkGrad)"
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        </motion.g>
        <motion.g
          animate={reducedMotion ? {} : { rotate: isHappy ? [16, -12, 16] : [8, -6, 8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          style={{ transformOrigin: '97px 66px' }}
        >
          <path
            d="M 94 62 C 108 72 114 92 102 98 C 96 94 94 82 92 66 Z"
            fill="url(#penguinDarkGrad)"
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        </motion.g>

        {/* Main Body Silhouette (Dark Navy Charcoal Cap) */}
        <path
          d="M 65 24 C 42 24 32 40 32 70 C 32 96 46 112 65 112 C 84 112 98 96 98 70 C 98 40 88 24 65 24 Z"
          fill="url(#penguinDarkGrad)"
          stroke="#0f172a"
          strokeWidth="1.4"
        />

        {/* Soft White Chubby Tummy & Face Mask (Reference Image 2 Heart Shape) */}
        <path
          d="M 65 42 C 54 30 40 38 40 56 C 40 76 38 98 52 106 C 58 110 72 110 78 106 C 92 98 90 76 90 56 C 90 38 76 30 65 42 Z"
          fill="url(#penguinWhiteGrad)"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Eyes: Striking Baby Blue Anime Eyes (Exactly like Reference Image 2) */}
        {isBlinking ? (
          <>
            <path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 74 56 Q 80 62 86 56" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : isHappy ? (
          <>
            <path d="M 43 58 Q 50 51 57 58" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            <path d="M 73 58 Q 80 51 87 58" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <g id="penguin-blue-eyes">
            {/* Left Eye */}
            <ellipse cx="50" cy="55" rx="7.5" ry="9" fill="#0f172a" />
            <ellipse cx="50" cy="55" rx="6.5" ry="7.8" fill="#0284c7" />
            <ellipse cx="50" cy="56" rx="4.5" ry="5.5" fill="#0f172a" />
            <circle cx="48" cy="52" r="2.8" fill="#ffffff" />
            <circle cx="53" cy="58" r="1.3" fill="#ffffff" />
            <circle cx="46.5" cy="55.5" r="0.8" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="80" cy="55" rx="7.5" ry="9" fill="#0f172a" />
            <ellipse cx="80" cy="55" rx="6.5" ry="7.8" fill="#0284c7" />
            <ellipse cx="80" cy="56" rx="4.5" ry="5.5" fill="#0f172a" />
            <circle cx="78" cy="52" r="2.8" fill="#ffffff" />
            <circle cx="83" cy="58" r="1.3" fill="#ffffff" />
            <circle cx="76.5" cy="55.5" r="0.8" fill="#ffffff" />
          </g>
        )}

        {/* Cute Baby Beak (Image 2 vibrant orange) */}
        <motion.g
          animate={reducedMotion ? {} : { y: isHappy ? [-1, 1, -1] : [0, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Upper Beak */}
          <path
            d="M 57 63 Q 65 57 73 63 Q 65 72 57 63 Z"
            fill="#f97316"
            stroke="#c2410c"
            strokeWidth="1.2"
          />
          {/* Open Smile Mouth inside beak */}
          <path d="M 60 64 Q 65 70 70 64" fill="#7f1d1d" stroke="#c2410c" strokeWidth="0.8" />
          {/* Cute Tongue */}
          <ellipse cx="65" cy="66.5" rx="2.2" ry="1.4" fill="#fb7185" />
        </motion.g>

        {/* Rosy Cheeks */}
        <ellipse cx="38" cy="67" rx="6" ry="4" fill="#fda4af" opacity="0.6" />
        <ellipse cx="92" cy="67" rx="6" ry="4" fill="#fda4af" opacity="0.6" />

        {/* Orange Webbed Feet (Reference Image 2) */}
        <g transform="translate(48, 108)">
          <path d="M -12 0 C -12 6 -6 8 0 7 C 6 8 10 6 10 0 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
          <circle cx="-6" cy="4" r="2" fill="#ea580c" />
          <circle cx="0" cy="5" r="2" fill="#ea580c" />
          <circle cx="6" cy="4" r="2" fill="#ea580c" />
        </g>
        <g transform="translate(82, 108)">
          <path d="M -10 0 C -10 6 -6 8 0 7 C 6 8 12 6 12 0 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
          <circle cx="-6" cy="4" r="2" fill="#ea580c" />
          <circle cx="0" cy="5" r="2" fill="#ea580c" />
          <circle cx="6" cy="4" r="2" fill="#ea580c" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 8. CURIOUS PARROT / PARAKEET (Rio) - Directly inspired by Reference Image 1!
  // Lime-green plumage, bright cyan-turquoise mask, shiny eyes, layered wings
  // =========================================================================
  const renderParrot = () => {
    return (
      <g id="parrot-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Cute Head Feather Crest Tuft (Bounces cheerfully) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-4, 6, -4], y: [0, -2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 22px' }}
        >
          <path d="M 64 24 C 60 10 66 4 67 2 C 70 8 72 16 67 24 Z" fill="#a3e635" stroke="#65a30d" strokeWidth="0.8" />
          <path d="M 67 24 C 69 12 76 6 78 5 C 78 12 76 18 70 24 Z" fill="#4ade80" stroke="#16a34a" strokeWidth="0.8" />
        </motion.g>

        {/* Round Lime Green Parrot Head and Body */}
        <ellipse cx="65" cy="60" rx="34" ry="32" fill="url(#parrotGreenGrad)" stroke="#4d7c0f" strokeWidth="1.3" />
        {/* Fluffy Chest & Tummy */}
        <ellipse cx="65" cy="85" rx="30" ry="26" fill="url(#parrotGreenGrad)" stroke="#4d7c0f" strokeWidth="1.2" />
        <ellipse cx="65" cy="86" rx="20" ry="17" fill="#bef264" opacity="0.8" />

        {/* TURQUOISE EYE MASK RINGS (Exact iconic hallmark from Reference Image 1!) */}
        <ellipse cx="48" cy="54" rx="14" ry="16" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" transform="rotate(-6 48 54)" />
        <ellipse cx="82" cy="54" rx="14" ry="16" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" transform="rotate(6 82 54)" />

        {/* Big Sparkling Eyes */}
        {isBlinking ? (
          <>
            <path d="M 42 54 Q 48 60 54 54" fill="none" stroke="#083344" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 76 54 Q 82 60 88 54" fill="none" stroke="#083344" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : isHappy ? (
          <>
            <path d="M 42 56 Q 48 48 54 56" fill="none" stroke="#083344" strokeWidth="3" strokeLinecap="round" />
            <path d="M 76 56 Q 82 48 88 56" fill="none" stroke="#083344" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <g id="parrot-glossy-eyes">
            <ellipse cx="48" cy="54" rx="7.5" ry="9" fill="#083344" />
            <circle cx="46" cy="50" r="3" fill="#ffffff" />
            <circle cx="51" cy="57" r="1.4" fill="#ffffff" />

            <ellipse cx="82" cy="54" rx="7.5" ry="9" fill="#083344" />
            <circle cx="80" cy="50" r="3" fill="#ffffff" />
            <circle cx="85" cy="57" r="1.4" fill="#ffffff" />
          </g>
        )}

        {/* Curved Golden-Peach Parrot Beak (Reference Image 1) */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Upper curved beak */}
          <path
            d="M 58 58 C 58 52 72 52 72 58 C 72 74 65 79 65 79 C 65 79 58 74 58 58 Z"
            fill="#fb923c"
            stroke="#ea580c"
            strokeWidth="1.2"
          />
          {/* Beak highlight */}
          <path d="M 62 58 Q 65 65 64 72" fill="none" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" />
          {/* Lower beak */}
          <path d="M 60 70 Q 65 76 70 70" fill="#c2410c" stroke="#9a3412" strokeWidth="0.8" />
        </motion.g>

        {/* Layered Feathered Wings (Reference Image 1) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-6, 8, -6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 76px' }}
        >
          {/* Left Wing Layered Feathers */}
          <path
            d="M 36 70 C 22 75 16 90 24 100 C 32 104 38 90 40 76 Z"
            fill="#16a34a"
            stroke="#15803d"
            strokeWidth="1.2"
          />
          <path d="M 28 80 Q 24 92 30 96" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        <motion.g
          animate={reducedMotion ? {} : { rotate: [6, -8, 6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '98px 76px' }}
        >
          {/* Right Wing Layered Feathers */}
          <path
            d="M 94 70 C 108 75 114 90 106 100 C 98 104 92 90 90 76 Z"
            fill="#16a34a"
            stroke="#15803d"
            strokeWidth="1.2"
          />
          <path d="M 102 80 Q 106 92 100 96" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* Parrot Orange Clawed Feet */}
        <g transform="translate(52, 108)">
          <path d="M -6 0 L -8 6 M 0 0 L 0 7 M 6 0 L 8 6" stroke="#ea580c" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g transform="translate(78, 108)">
          <path d="M -6 0 L -8 6 M 0 0 L 0 7 M 6 0 L 8 6" stroke="#ea580c" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 9. ADVENTUROUS FOX (Rusty) - Directly inspired by Reference Image 4 top-left!
  // Fiery orange coat, plush white cheeks, bushy white-tipped wagging tail
  // =========================================================================
  const renderFox = () => {
    return (
      <g id="fox-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Big Bushy Fox Tail with White Tip (Reference Image 4 top-left) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-10, 14, -10] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '92px 90px' }}
        >
          {/* Orange base */}
          <path
            d="M 90 88 C 114 80 126 62 118 46 C 110 42 98 56 88 80 Z"
            fill="url(#foxOrangeGrad)"
            stroke="#c2410c"
            strokeWidth="1.3"
          />
          {/* Fluffy White Tail Tip */}
          <path
            d="M 118 46 C 124 50 122 60 114 66 C 110 56 112 48 118 46 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        </motion.g>

        {/* Pointed Fox Ears with Dark Tips and Pink Interior */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-3, 4, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '42px 42px' }}
        >
          <polygon points="34,48 26,18 50,34" fill="url(#foxOrangeGrad)" stroke="#c2410c" strokeWidth="1.2" />
          <polygon points="26,18 29,26 36,24" fill="#1e293b" />
          <polygon points="34,42 30,26 44,35" fill="#fda4af" opacity="0.8" />
        </motion.g>
        <motion.g
          animate={reducedMotion ? {} : { rotate: [3, -4, 3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '88px 42px' }}
        >
          <polygon points="96,48 104,18 80,34" fill="url(#foxOrangeGrad)" stroke="#c2410c" strokeWidth="1.2" />
          <polygon points="104,18 101,26 94,24" fill="#1e293b" />
          <polygon points="96,42 100,26 86,35" fill="#fda4af" opacity="0.8" />
        </motion.g>

        {/* Chubby Orange Body */}
        <ellipse cx="65" cy="88" rx="34" ry="28" fill="url(#foxOrangeGrad)" stroke="#c2410c" strokeWidth="1.2" />
        {/* White Chest Bib */}
        <path d="M 52 82 Q 65 96 78 82 Q 65 74 52 82 Z" fill="#ffffff" />

        {/* Head */}
        <circle cx="65" cy="58" r="32" fill="url(#foxOrangeGrad)" stroke="#c2410c" strokeWidth="1.3" />

        {/* White Fluffy Cheek Bulges (Image 4) */}
        <ellipse cx="44" cy="65" rx="14" ry="11" fill="#ffffff" />
        <ellipse cx="86" cy="65" rx="14" ry="11" fill="#ffffff" />
        <ellipse cx="42" cy="67" rx="6" ry="4" fill="#fb7185" opacity="0.55" />
        <ellipse cx="88" cy="67" rx="6" ry="4" fill="#fb7185" opacity="0.55" />

        {/* Eyes */}
        {isBlinking ? (
          <>
            <path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#261b17" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 74 56 Q 80 62 86 56" fill="none" stroke="#261b17" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : (
          <g>
            <ellipse cx="50" cy="54" rx="6.8" ry="8.2" fill="#261b17" />
            <circle cx="48" cy="51" r="2.8" fill="#ffffff" />
            <circle cx="52" cy="57" r="1.3" fill="#ffffff" />

            <ellipse cx="80" cy="54" rx="6.8" ry="8.2" fill="#261b17" />
            <circle cx="78" cy="51" r="2.8" fill="#ffffff" />
            <circle cx="82" cy="57" r="1.3" fill="#ffffff" />
          </g>
        )}

        {/* Cute Black Nose & Smile */}
        <ellipse cx="65" cy="63" rx="3.5" ry="2.5" fill="#1e293b" />
        <path d="M 61 67 Q 65 71 69 67" fill="none" stroke="#261b17" strokeWidth="1.8" strokeLinecap="round" />

        {/* Holding Pink Wildflower (Reference Image 4 top-left) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 86px' }}
        >
          <g transform="translate(65, 82)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx="0" cy="-9" r="4.5" fill="#f472b6" stroke="#db2777" strokeWidth="0.6" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="3.8" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
          </g>
          {/* Little Front Paws */}
          <ellipse cx="55" cy="85" rx="6" ry="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <ellipse cx="75" cy="85" rx="6" ry="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        </motion.g>

        {/* Sitting Feet */}
        <g transform="translate(37, 104)">
          <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#fda4af" />
        </g>
        <g transform="translate(93, 104)">
          <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#fda4af" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 10. GENTLE BABY ELEPHANT (Peanut) - Directly inspired by Reference Image 3!
  // Sky blue body, big floppy ears with pink centers, curled swaying trunk
  // =========================================================================
  const renderElephant = () => {
    return (
      <g id="elephant-character">
        <ellipse cx="65" cy="118" rx="38" ry="6.5" fill="#0f172a" opacity="0.1" />

        {/* Big Floppy Elephant Ears with Pink Centers (Reference Image 3) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-5, 6, -5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '40px 48px' }}
        >
          <ellipse cx="32" cy="48" rx="20" ry="24" fill="url(#elephantBlueGrad)" stroke="#0284c7" strokeWidth="1.3" />
          <ellipse cx="32" cy="48" rx="13" ry="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
        </motion.g>
        <motion.g
          animate={reducedMotion ? {} : { rotate: [5, -6, 5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '90px 48px' }}
        >
          <ellipse cx="98" cy="48" rx="20" ry="24" fill="url(#elephantBlueGrad)" stroke="#0284c7" strokeWidth="1.3" />
          <ellipse cx="98" cy="48" rx="13" ry="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
        </motion.g>

        {/* Chubby Sitting Body */}
        <ellipse cx="65" cy="88" rx="34" ry="28" fill="url(#elephantBlueGrad)" stroke="#0284c7" strokeWidth="1.2" />

        {/* Big Round Elephant Head with cute little head tuft */}
        <circle cx="65" cy="56" r="32" fill="url(#elephantBlueGrad)" stroke="#0284c7" strokeWidth="1.3" />
        <path d="M 64 24 C 62 18 68 18 66 24 Z" fill="#38bdf8" />

        {/* Eyes: Bright Blue/Dark Anime Eyes (Reference Image 3) */}
        {isBlinking ? (
          <>
            <path d="M 44 52 Q 50 58 56 52" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 74 52 Q 80 58 86 52" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : (
          <g>
            <ellipse cx="50" cy="50" rx="7" ry="8.5" fill="#0f172a" />
            <circle cx="50" cy="51" r="5.2" fill="#0284c7" />
            <circle cx="48" cy="48" r="2.8" fill="#ffffff" />
            <circle cx="52" cy="53" r="1.3" fill="#ffffff" />

            <ellipse cx="80" cy="50" rx="7" ry="8.5" fill="#0f172a" />
            <circle cx="80" cy="51" r="5.2" fill="#0284c7" />
            <circle cx="78" cy="48" r="2.8" fill="#ffffff" />
            <circle cx="82" cy="53" r="1.3" fill="#ffffff" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="40" cy="62" rx="6" ry="4" fill="#fda4af" opacity="0.6" />
        <ellipse cx="90" cy="62" rx="6" ry="4" fill="#fda4af" opacity="0.6" />

        {/* Curled Trunk with Gentle Sway Animation (Reference Image 3) */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-3, 5, -3], y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 60px' }}
        >
          {/* Elephant Trunk */}
          <path
            d="M 61 58 C 61 68 56 78 52 82 C 48 85 45 82 48 76 C 51 72 55 68 55 60"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 61 58 C 61 68 56 78 52 82 C 48 85 45 82 48 76 C 51 72 55 68 55 60"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          {/* Trunk creases */}
          <line x1="56" y1="64" x2="62" y2="64" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
          <line x1="54" y1="70" x2="60" y2="70" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
        </motion.g>

        {/* Chubby Elephant Front Feet with White Toenails (Reference Image 3) */}
        <g transform="translate(50, 96)">
          <rect x="-10" y="0" width="20" height="16" rx="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <circle cx="-5" cy="13" r="2.5" fill="#ffffff" />
          <circle cx="0" cy="14" r="2.5" fill="#ffffff" />
          <circle cx="5" cy="13" r="2.5" fill="#ffffff" />
        </g>
        <g transform="translate(80, 96)">
          <rect x="-10" y="0" width="20" height="16" rx="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <circle cx="-5" cy="13" r="2.5" fill="#ffffff" />
          <circle cx="0" cy="14" r="2.5" fill="#ffffff" />
          <circle cx="5" cy="13" r="2.5" fill="#ffffff" />
        </g>
      </g>
    );
  };

  // =========================================================================
  // 11. APEX KING LION (Leo) - Mighty Monarch of the Savanna!
  // Massive flowing multi-point golden-amber mane, fierce amber predator eyes,
  // warrior brow, sharp canines, muscular paws with unsheathed claws
  // =========================================================================
  const renderLion = () => {
    return (
      <g id="lion-character">
        <ellipse cx="65" cy="118" rx="42" ry="7" fill="#0f172a" opacity="0.18" />

        {/* Regal Whipping Lion Tail with Dark Amber Tuft */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-10, 14, -10] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '92px 88px' }}
        >
          <path d="M 88 84 C 114 80 126 66 118 50" fill="none" stroke="#b45309" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M 118 50 C 126 44 130 52 124 58 C 118 64 112 56 118 50 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        </motion.g>

        {/* Outer Radiant Dark Chestnut Mane Spikes (Sunburst Crown) */}
        <path
          d="M 65 12 L 74 20 L 87 15 L 93 25 L 107 26 L 107 39 L 119 46 L 113 58 L 120 70 L 110 80 L 113 93 L 99 97 L 93 108 L 79 105 L 65 113 L 51 105 L 37 108 L 31 97 L 17 93 L 20 80 L 10 70 L 17 58 L 11 46 L 23 39 L 23 26 L 37 25 L 43 15 L 56 20 Z"
          fill="url(#lionManeGrad)"
          stroke="#78350f"
          strokeWidth="1.8"
        />

        {/* Inner Golden Layered Mane Spikes */}
        <path
          d="M 65 20 L 73 27 L 84 24 L 89 33 L 100 35 L 99 46 L 108 52 L 103 62 L 108 72 L 99 79 L 101 90 L 89 93 L 83 101 L 73 99 L 65 106 L 57 99 L 47 101 L 41 93 L 29 90 L 31 79 L 22 72 L 27 62 L 22 52 L 31 46 L 30 35 L 41 33 L 46 24 L 57 27 Z"
          fill="#d97706"
          stroke="#b45309"
          strokeWidth="1.2"
        />

        {/* Muscular Lion Chest & Torso */}
        <ellipse cx="65" cy="86" rx="34" ry="26" fill="url(#lionBodyGrad)" stroke="#b45309" strokeWidth="1.5" />

        {/* Powerful Stalking Paws with White Claws */}
        <g transform="translate(42, 98)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#d97706" stroke="#b45309" strokeWidth="1.4" />
          <path d="M -7 5 L -8 11 M -1 6 L -1 12 M 5 5 L 6 11" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g transform="translate(88, 98)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#d97706" stroke="#b45309" strokeWidth="1.4" />
          <path d="M -5 5 L -6 11 M 1 6 L 1 12 M 7 5 L 8 11" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Noble Head with Powerful Facial Structure */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -2, 0], rotate: [-0.8, 0.8, -0.8] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 58px' }}
        >
          {/* Head Base */}
          <ellipse cx="65" cy="58" rx="28" ry="25" fill="url(#lionBodyGrad)" stroke="#b45309" strokeWidth="1.5" />

          {/* Majestic Tufted Ears */}
          <path d="M 38 40 L 30 28 L 44 33 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.2" />
          <path d="M 92 40 L 100 28 L 86 33 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.2" />

          {/* Tawny Cream Muzzle */}
          <path d="M 52 62 Q 65 65 78 62 L 75 78 Q 65 83 55 78 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />

          {/* Broad Predator Nose */}
          <polygon points="65,68 58,60 72,60" fill="#451a03" />

          {/* Fierce Mouth & Canines */}
          <path d="M 60 74 Q 65 77 70 74" fill="none" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
          <polygon points="57,72 59,78 61,73" fill="#ffffff" stroke="#78350f" strokeWidth="0.8" />
          <polygon points="69,73 71,78 73,72" fill="#ffffff" stroke="#78350f" strokeWidth="0.8" />

          {/* Whiskers */}
          <line x1="50" y1="71" x2="36" y2="70" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="50" y1="74" x2="38" y2="76" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="80" y1="71" x2="94" y2="70" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="80" y1="74" x2="92" y2="76" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />

          {/* Piercing Amber Eyes with Intense Warrior Brow */}
          {isBlinking ? (
            <>
              <line x1="46" y1="52" x2="58" y2="54" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <line x1="84" y1="52" x2="72" y2="54" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <g id="lion-predator-eyes">
              {/* Heavy Brow */}
              <path d="M 44 48 L 59 52" stroke="#78350f" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 86 48 L 71 52" stroke="#78350f" strokeWidth="3.2" strokeLinecap="round" />
              {/* Golden Irises */}
              <polygon points="46,52 58,54 52,60" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              <polygon points="84,52 72,54 78,60" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              {/* Pupils */}
              <circle cx="52" cy="56" r="2.2" fill="#000000" />
              <circle cx="78" cy="56" r="2.2" fill="#000000" />
              <circle cx="51" cy="54.5" r="0.8" fill="#ffffff" />
              <circle cx="77" cy="54.5" r="0.8" fill="#ffffff" />
            </g>
          )}
        </motion.g>
      </g>
    );
  };

  // =========================================================================
  // 12. APEX DIRE WOLF (Shadow) - Fierce Alpha Nocturnal Hunter!
  // Silver-slate fur, alert ears, ice-blue glowing eyes, razor canines
  // =========================================================================
  const renderWolf = () => {
    return (
      <g id="wolf-character">
        <ellipse cx="65" cy="118" rx="42" ry="7" fill="#0f172a" opacity="0.18" />

        {/* Sweeping Bushy Wolf Tail */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-8, 10, -8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '92px 88px' }}
        >
          <path d="M 88 82 C 114 78 126 62 120 46 C 112 50 102 66 84 76 Z" fill="url(#wolfDarkGrad)" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 120 46 L 126 40 L 118 52 Z" fill="#94a3b8" />
        </motion.g>

        {/* Muscular Wolf Torso */}
        <ellipse cx="65" cy="86" rx="34" ry="26" fill="url(#wolfDarkGrad)" stroke="#1e293b" strokeWidth="1.5" />

        {/* Layered Silver Winter Fur Ruff */}
        <path
          d="M 38 62 L 30 72 L 40 74 L 32 86 L 46 84 L 40 96 L 54 90 L 65 98 L 76 90 L 90 96 L 84 84 L 98 86 L 90 74 L 100 72 L 92 62 Z"
          fill="url(#wolfLightGrad)"
          stroke="#475569"
          strokeWidth="1.4"
        />

        {/* Powerful Wolf Paws with Claws */}
        <g transform="translate(42, 98)">
          <ellipse cx="0" cy="0" rx="11" ry="7.5" fill="#334155" stroke="#1e293b" strokeWidth="1.3" />
          <path d="M -6 4 L -7 10 M 0 5 L 0 11 M 6 4 L 7 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g transform="translate(88, 98)">
          <ellipse cx="0" cy="0" rx="11" ry="7.5" fill="#334155" stroke="#1e293b" strokeWidth="1.3" />
          <path d="M -6 4 L -7 10 M 0 5 L 0 11 M 6 4 L 7 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Alpha Wolf Head & Ears */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -1.8, 0], rotate: [-0.6, 0.6, -0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 56px' }}
        >
          {/* Head Base */}
          <ellipse cx="65" cy="56" rx="26" ry="23" fill="url(#wolfDarkGrad)" stroke="#1e293b" strokeWidth="1.5" />

          {/* Upright Alert Triangular Predator Ears */}
          <polygon points="44,46 32,18 54,34" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="42,42 36,24 50,34" fill="#64748b" />
          <polygon points="86,46 98,18 76,34" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="88,42 94,24 80,34" fill="#64748b" />

          {/* Chiseled White Lupine Muzzle */}
          <path d="M 54 60 Q 65 63 76 60 L 72 76 Q 65 81 58 76 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />

          {/* Black Nose & Canines */}
          <polygon points="65,63 59,58 71,58" fill="#0f172a" />
          <path d="M 61 71 Q 65 74 69 71" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <polygon points="58,68 60,75 62,69" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />
          <polygon points="68,69 70,75 72,68" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />

          {/* Piercing Glowing Ice-Blue Predator Eyes */}
          {isBlinking ? (
            <>
              <line x1="46" y1="50" x2="58" y2="52" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <line x1="84" y1="50" x2="72" y2="52" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <g id="wolf-predator-eyes">
              <path d="M 44 46 L 58 50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <path d="M 86 46 L 72 50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <polygon points="46,50 56,52 51,57" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
              <polygon points="84,50 74,52 79,57" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
              <circle cx="51" cy="53.5" r="2" fill="#000000" />
              <circle cx="79" cy="53.5" r="2" fill="#000000" />
              <circle cx="50" cy="52.5" r="0.8" fill="#ffffff" />
              <circle cx="78" cy="52.5" r="0.8" fill="#ffffff" />
            </g>
          )}
        </motion.g>
      </g>
    );
  };

  // =========================================================================
  // 13. APEX SABER TIGER (Fang) - Ferocious jungle predator!
  // Muscular orange body with black tiger stripes, radiant eyes, saber fangs
  // =========================================================================
  const renderTiger = () => {
    return (
      <g id="tiger-character">
        <ellipse cx="65" cy="118" rx="42" ry="7" fill="#0f172a" opacity="0.18" />

        {/* Striped Tiger Tail */}
        <motion.g
          animate={reducedMotion ? {} : { rotate: [-10, 12, -10] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '90px 88px' }}
        >
          <path d="M 88 84 C 114 80 126 66 116 52" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
          <path d="M 98 76 L 102 78 M 106 68 L 110 70 M 114 58 L 118 60" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

        {/* Muscular Orange Torso with Black Predator Stripes */}
        <ellipse cx="65" cy="86" rx="34" ry="26" fill="url(#tigerOrangeGrad)" stroke="#c2410c" strokeWidth="1.5" />
        {/* Bold Black Tiger Body Stripes */}
        <path d="M 40 76 L 52 82 L 44 88 M 90 76 L 78 82 L 86 88 M 50 92 L 62 94 M 80 92 L 68 94" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />

        {/* Powerful Paws with Claws */}
        <g transform="translate(42, 98)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#ea580c" stroke="#c2410c" strokeWidth="1.4" />
          <path d="M -7 5 L -8 11 M -1 6 L -1 12 M 5 5 L 6 11" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g transform="translate(88, 98)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#ea580c" stroke="#c2410c" strokeWidth="1.4" />
          <path d="M -5 5 L -6 11 M 1 6 L 1 12 M 7 5 L 8 11" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Fierce Tiger Head */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -2, 0], rotate: [-0.8, 0.8, -0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 56px' }}
        >
          {/* Head Base */}
          <circle cx="65" cy="56" r="26" fill="url(#tigerOrangeGrad)" stroke="#c2410c" strokeWidth="1.5" />

          {/* Tiger Ears with White Spots */}
          <circle cx="42" cy="36" r="9" fill="#09090b" />
          <circle cx="42" cy="36" r="5" fill="#ffffff" />
          <circle cx="88" cy="36" r="9" fill="#09090b" />
          <circle cx="88" cy="36" r="5" fill="#ffffff" />

          {/* Forehead & Cheek Stripes */}
          <path d="M 65 32 L 65 42 M 57 36 L 61 44 M 73 36 L 69 44 M 42 52 L 50 54 M 88 52 L 80 54" stroke="#09090b" strokeWidth="2.6" strokeLinecap="round" />

          {/* Broad White Muzzle & Saber Fangs */}
          <ellipse cx="65" cy="65" rx="14" ry="10" fill="#ffffff" stroke="#c2410c" strokeWidth="1" />
          <polygon points="65,62 60,57 70,57" fill="#09090b" />
          {/* Saber Canines */}
          <polygon points="56,66 58,78 62,67" fill="#ffffff" stroke="#09090b" strokeWidth="1" />
          <polygon points="68,67 72,78 74,66" fill="#ffffff" stroke="#09090b" strokeWidth="1" />

          {/* Radiant Feline Amber Eyes */}
          {isBlinking ? (
            <>
              <line x1="46" y1="50" x2="58" y2="52" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
              <line x1="84" y1="50" x2="72" y2="52" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <g id="tiger-eyes">
              <path d="M 44 46 L 58 50" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
              <path d="M 86 46 L 72 50" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
              <polygon points="46,50 56,52 52,58" fill="#facc15" stroke="#09090b" strokeWidth="1" />
              <polygon points="84,50 74,52 78,58" fill="#facc15" stroke="#09090b" strokeWidth="1" />
              <circle cx="52" cy="54" r="2" fill="#000000" />
              <circle cx="78" cy="54" r="2" fill="#000000" />
            </g>
          )}
        </motion.g>
      </g>
    );
  };

  // =========================================================================
  // 14. APEX THUNDER EAGLE (Talon) - Sky Sovereign!
  // White raptor head, curved razor beak, piercing hunter eyes, talons
  // =========================================================================
  const renderEagle = () => {
    return (
      <g id="eagle-character">
        <ellipse cx="65" cy="118" rx="42" ry="7" fill="#0f172a" opacity="0.18" />

        {/* Broad Layered Feather Wings */}
        <g id="eagle-wings">
          <path d="M 28 66 L 14 82 L 28 80 L 16 96 L 32 92 L 24 104 L 42 96" fill="#291002" stroke="#1c0a00" strokeWidth="1.4" />
          <path d="M 102 66 L 116 82 L 102 80 L 114 96 L 98 92 L 106 104 L 88 96" fill="#291002" stroke="#1c0a00" strokeWidth="1.4" />
        </g>

        {/* Muscular Raptor Body */}
        <ellipse cx="65" cy="88" rx="32" ry="26" fill="url(#eagleFeatherGrad)" stroke="#1c0a00" strokeWidth="1.5" />

        {/* Curved Razor Golden Talons */}
        <g transform="translate(48, 102)">
          <path d="M -6 4 L -8 12 M 0 5 L 0 14 M 6 4 L 8 12" stroke="#f59e0b" strokeWidth="2.8" strokeLinecap="round" />
        </g>
        <g transform="translate(82, 102)">
          <path d="M -6 4 L -8 12 M 0 5 L 0 14 M 6 4 L 8 12" stroke="#f59e0b" strokeWidth="2.8" strokeLinecap="round" />
        </g>

        {/* Regal White Raptor Head with Crest */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -2, 0], rotate: [-0.6, 0.6, -0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 52px' }}
        >
          {/* Head Base */}
          <path d="M 44 64 C 40 40 50 24 65 24 C 74 24 82 28 86 38 L 92 34 L 88 46 L 94 48 L 86 64 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Formidable Curved Hooked Golden Beak */}
          <path d="M 76 46 Q 98 48 94 64 Q 84 66 76 58 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.4" />

          {/* Piercing Raptor Eye */}
          {isBlinking ? (
            <line x1="58" y1="44" x2="72" y2="44" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <g id="eagle-eye">
              {/* Hooded Brow */}
              <path d="M 56 40 L 72 44" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
              <ellipse cx="65" cy="46" rx="5.5" ry="4.5" fill="#facc15" stroke="#0f172a" strokeWidth="1" />
              <circle cx="65" cy="46" r="2.2" fill="#000000" />
              <circle cx="63.5" cy="44.5" r="0.8" fill="#ffffff" />
            </g>
          )}
        </motion.g>
      </g>
    );
  };

  // =========================================================================
  // 15. TITAN GRIZZLY (Kodiak) - Colossal Mountain Fortress!
  // Massive shoulder hump, thick dark umber fur, heavy paws with bear claws
  // =========================================================================
  const renderBear = () => {
    return (
      <g id="bear-character">
        <ellipse cx="65" cy="118" rx="44" ry="7" fill="#0f172a" opacity="0.18" />

        {/* Colossal Grizzly Torso with Muscular Shoulder Hump */}
        <path d="M 32 88 C 24 62 42 44 65 44 C 88 44 106 62 98 88 C 94 108 36 108 32 88 Z" fill="url(#bearFurGrad)" stroke="#291002" strokeWidth="1.6" />

        {/* Heavy Forearms with Formidable Bear Claws */}
        <ellipse cx="38" cy="84" rx="10" ry="18" fill="url(#bearFurGrad)" stroke="#291002" strokeWidth="1.3" transform="rotate(15 38 84)" />
        <ellipse cx="92" cy="84" rx="10" ry="18" fill="url(#bearFurGrad)" stroke="#291002" strokeWidth="1.3" transform="rotate(-15 92 84)" />
        {/* Sharp Bear Claws */}
        <path d="M 32 98 L 30 108 M 38 100 L 38 110 M 44 98 L 46 108" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 86 98 L 84 108 M 92 100 L 92 110 M 98 98 L 100 108" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />

        {/* Massive Grizzly Skull */}
        <motion.g
          animate={reducedMotion ? {} : { y: [0, -1.8, 0], rotate: [-0.6, 0.6, -0.6] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '65px 54px' }}
        >
          {/* Head Base */}
          <circle cx="65" cy="54" r="26" fill="url(#bearFurGrad)" stroke="#291002" strokeWidth="1.5" />

          {/* Rugged Bear Ears */}
          <circle cx="44" cy="34" r="8" fill="#451a03" stroke="#291002" strokeWidth="1.2" />
          <circle cx="86" cy="34" r="8" fill="#451a03" stroke="#291002" strokeWidth="1.2" />

          {/* Broad Snout */}
          <ellipse cx="65" cy="64" rx="14" ry="10" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
          <polygon points="65,62 58,57 72,57" fill="#1c0a00" />
          <path d="M 60 70 Q 65 73 70 70" fill="none" stroke="#1c0a00" strokeWidth="2" strokeLinecap="round" />

          {/* Focused Piercing Amber Eyes */}
          {isBlinking ? (
            <>
              <line x1="48" y1="48" x2="58" y2="50" stroke="#1c0a00" strokeWidth="3" strokeLinecap="round" />
              <line x1="82" y1="48" x2="72" y2="50" stroke="#1c0a00" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <g id="bear-eyes">
              <path d="M 46 46 L 58 49" stroke="#1c0a00" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 84 46 L 72 49" stroke="#1c0a00" strokeWidth="3.2" strokeLinecap="round" />
              <ellipse cx="53" cy="52" rx="4" ry="3.5" fill="#f59e0b" stroke="#1c0a00" strokeWidth="1" />
              <ellipse cx="77" cy="52" rx="4" ry="3.5" fill="#f59e0b" stroke="#1c0a00" strokeWidth="1" />
              <circle cx="53" cy="52" r="1.8" fill="#000000" />
              <circle cx="77" cy="52" r="1.8" fill="#000000" />
            </g>
          )}
        </motion.g>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 130 126"
      className="w-full h-full overflow-visible select-none drop-shadow-md"
      aria-hidden="true"
    >
      <defs>
        {/* Velvety Bunny Gradients (Reference Image 4 top-right) */}
        <radialGradient id="bunnyHeadGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#fefcf8" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </radialGradient>

        <radialGradient id="bunnyBodyGrad" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>

        <linearGradient id="bunnyWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>

        <linearGradient id="pinkInnerEarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="60%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>

        {/* Carrot Radiant Gradient */}
        <linearGradient id="carrotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="45%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Capybara Gradient */}
        <linearGradient id="capybaraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8b28a" />
          <stop offset="45%" stopColor="#cca075" />
          <stop offset="100%" stopColor="#b48356" />
        </linearGradient>

        {/* Dino Green Gradient */}
        <linearGradient id="dinoGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        {/* Powerful Apex Dino Gradient */}
        <linearGradient id="dinoApexGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="50%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Powerful Lion Gradients */}
        <linearGradient id="lionManeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="lionBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Dire Wolf Gradients */}
        <linearGradient id="wolfDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="wolfLightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Saber Tiger Gradient */}
        <linearGradient id="tigerOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        {/* Titan Grizzly Gradient */}
        <linearGradient id="bearFurGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="60%" stopColor="#59270b" />
          <stop offset="100%" stopColor="#3d1a05" />
        </linearGradient>

        {/* Thunder Eagle Gradient */}
        <linearGradient id="eagleFeatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="60%" stopColor="#291002" />
          <stop offset="100%" stopColor="#1c0a00" />
        </linearGradient>

        {/* Penguin Dark Gradient (Reference Image 2) */}
        <linearGradient id="penguinDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="40%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Penguin White Belly Gradient */}
        <linearGradient id="penguinWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Parrot Green Gradient (Reference Image 1) */}
        <linearGradient id="parrotGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="40%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#65a30d" />
        </linearGradient>

        {/* Fox Orange Gradient (Reference Image 4) */}
        <linearGradient id="foxOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Elephant Blue Gradient (Reference Image 3) */}
        <linearGradient id="elephantBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {type === 'lion'
        ? renderLion()
        : type === 'dino'
        ? renderDino()
        : type === 'wolf'
        ? renderWolf()
        : type === 'tiger'
        ? renderTiger()
        : type === 'eagle'
        ? renderEagle()
        : type === 'bear'
        ? renderBear()
        : type === 'panda'
        ? renderPanda()
        : type === 'cat'
        ? renderCat()
        : type === 'puppy'
        ? renderPuppy()
        : type === 'bunny'
        ? renderBunny()
        : type === 'penguin'
        ? renderPenguin()
        : type === 'parrot'
        ? renderParrot()
        : type === 'fox'
        ? renderFox()
        : type === 'elephant'
        ? renderElephant()
        : renderCapybara()}
    </svg>
  );
};

