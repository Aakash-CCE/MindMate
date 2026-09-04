import React from 'react';
import { motion } from 'motion/react';

interface CapybaraMugHeroProps {
  onInteract?: () => void;
  bubbleText?: string;
}

export const CapybaraMugHero: React.FC<CapybaraMugHeroProps> = ({
  onInteract,
  bubbleText = "Hey! I'm here whenever you need to talk.",
}) => {
  return (
    <div
      id="capybara-hero-illustration-container"
      className="relative w-full max-w-[460px] mx-auto flex items-center justify-center select-none"
      onClick={onInteract}
    >
      {/* Speech Bubble */}
      <motion.div
        id="capybara-hero-speech-bubble"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.5 },
        }}
        className="absolute -top-4 sm:top-2 right-2 sm:right-0 z-20 max-w-[170px] sm:max-w-[200px] bg-[#fefaf4] border border-amber-200/90 rounded-2xl p-3 sm:p-3.5 shadow-md cursor-pointer group"
      >
        <p className="text-slate-700 text-xs sm:text-[13px] font-semibold leading-snug tracking-tight">
          {bubbleText}
        </p>
        {/* Tail pointing towards the capybara */}
        <div className="absolute -bottom-2 left-6 w-3 h-3 bg-[#fefaf4] border-b border-l border-amber-200/90 transform -rotate-45" />
      </motion.div>

      {/* Main SVG Composition */}
      <svg
        id="capybara-mug-hero-svg"
        viewBox="0 0 460 380"
        className="w-full h-auto overflow-visible filter drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft Hill Gradient */}
          <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="60%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>

          {/* Capybara Body Gradient */}
          <linearGradient id="capyBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d08f57" />
            <stop offset="40%" stopColor="#c28249" />
            <stop offset="100%" stopColor="#a76834" />
          </linearGradient>

          {/* Mug Gradient */}
          <linearGradient id="mugGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#80b898" />
            <stop offset="45%" stopColor="#67a180" />
            <stop offset="100%" stopColor="#53896b" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Background Grassy Hill / Mound --- */}
        <g id="grassy-hill">
          {/* Main Hill Curve */}
          <path
            d="M 10 330 Q 140 260 270 275 Q 360 285 450 335 L 450 380 L 10 380 Z"
            fill="url(#hillGrad)"
            opacity="0.9"
          />

          {/* Soft Ground Shadow beneath Capybara */}
          <ellipse cx="235" cy="308" rx="85" ry="14" fill="#065f46" opacity="0.12" />

          {/* Tiny Grass Sprouts on the Hill */}
          <path
            d="M 70 330 Q 75 315 85 320 M 80 330 Q 90 318 95 325"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 370 325 Q 378 312 390 318 M 382 328 Q 392 316 400 324"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 140 310 Q 143 298 152 302"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- Decorative Botanical Leaves on Left (as in screenshot) --- */}
        <g id="botanical-branch" transform="translate(100, 160)">
          <path
            d="M 0 60 Q -15 20 -2 0"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf 1 */}
          <path
            d="M -6 45 Q -22 42 -18 30 Q -6 35 -6 45 Z"
            fill="#34d399"
            stroke="#059669"
            strokeWidth="1"
          />
          {/* Leaf 2 */}
          <path
            d="M -10 25 Q -26 15 -18 5 Q -6 15 -10 25 Z"
            fill="#6ee7b7"
            stroke="#059669"
            strokeWidth="1"
          />
          {/* Leaf 3 */}
          <path
            d="M -2 0 Q -12 -12 2 -18 Q 8 -6 -2 0 Z"
            fill="#34d399"
            stroke="#059669"
            strokeWidth="1"
          />
        </g>

        {/* --- Capybara Animated Group --- */}
        <motion.g
          id="capybara-character-group"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* 1. Left Ear */}
          <ellipse
            cx="172"
            cy="96"
            rx="11"
            ry="14"
            fill="#915222"
            stroke="#6e3913"
            strokeWidth="2"
            transform="rotate(-15 172 96)"
          />
          <ellipse cx="172" cy="96" rx="6" ry="8" fill="#582a0b" transform="rotate(-15 172 96)" />

          {/* 2. Right Ear */}
          <ellipse
            cx="290"
            cy="104"
            rx="11"
            ry="14"
            fill="#915222"
            stroke="#6e3913"
            strokeWidth="2"
            transform="rotate(20 290 104)"
          />
          <ellipse cx="290" cy="104" rx="6" ry="8" fill="#582a0b" transform="rotate(20 290 104)" />

          {/* 3. Main Body */}
          <path
            d="M 165 140 
               C 130 180, 125 250, 145 295
               C 160 318, 305 320, 325 295
               C 345 250, 335 180, 305 140
               Z"
            fill="url(#capyBody)"
            stroke="#733e14"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 4. Warm Lighter Chest/Belly Patch */}
          <path
            d="M 185 180 
               C 160 215, 160 270, 185 298
               C 215 310, 255 310, 285 298
               C 305 270, 305 215, 285 180
               Z"
            fill="#deb084"
            opacity="0.85"
          />

          {/* 5. Head Shape */}
          <ellipse
            cx="230"
            cy="135"
            rx="62"
            ry="54"
            fill="#c28249"
            stroke="#733e14"
            strokeWidth="3.5"
          />

          {/* 6. Darker Snout / Muzzle Area */}
          <path
            d="M 205 130 
               C 192 138, 190 162, 204 175
               C 218 185, 242 185, 256 175
               C 270 162, 268 138, 255 130
               Z"
            fill="#8d4a1f"
            stroke="#653110"
            strokeWidth="2"
          />

          {/* 7. Cute Button Nose */}
          <ellipse cx="230" cy="144" rx="10" ry="7" fill="#2d1305" />
          <ellipse cx="228" cy="142" rx="3" ry="2" fill="#542b13" />

          {/* 8. Smiling Mouth Line */}
          <path
            d="M 230 151 L 230 163 M 220 160 Q 230 168 240 160"
            stroke="#2d1305"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 9. Closed Peaceful Smiling Eyes (^ ^) */}
          <g id="closed-happy-eyes">
            {/* Left Eye */}
            <path
              d="M 184 130 Q 195 120 206 130"
              stroke="#2d1305"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Eye lash */}
            <path
              d="M 183 131 L 178 128"
              stroke="#2d1305"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Right Eye */}
            <path
              d="M 254 130 Q 265 120 276 130"
              stroke="#2d1305"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Eye lash */}
            <path
              d="M 277 131 L 282 128"
              stroke="#2d1305"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* 10. Rosy Cheeks */}
          <ellipse cx="178" cy="146" rx="11" ry="7" fill="#f87171" opacity="0.4" />
          <ellipse cx="282" cy="146" rx="11" ry="7" fill="#f87171" opacity="0.4" />

          {/* 11. Left & Right Hind Feet on Grass */}
          <ellipse
            cx="155"
            cy="305"
            rx="16"
            ry="11"
            fill="#a76834"
            stroke="#733e14"
            strokeWidth="2.5"
          />
          <ellipse
            cx="315"
            cy="305"
            rx="16"
            ry="11"
            fill="#a76834"
            stroke="#733e14"
            strokeWidth="2.5"
          />

          {/* 12. Cozy Green Mug with Steam */}
          <g id="green-mug" transform="translate(200, 205)">
            {/* Mug Handle on Right */}
            <path
              d="M 46 15 C 62 15, 62 38, 46 38"
              stroke="#53896b"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 46 15 C 60 15, 60 38, 46 38"
              stroke="#67a180"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mug Body */}
            <rect
              x="8"
              y="6"
              width="44"
              height="40"
              rx="9"
              fill="url(#mugGrad)"
              stroke="#437055"
              strokeWidth="2.5"
            />

            {/* Mug Rim Highlight */}
            <ellipse
              cx="30"
              cy="7"
              rx="20"
              ry="4"
              fill="#8fc9a7"
              stroke="#437055"
              strokeWidth="1.5"
            />
            <ellipse cx="30" cy="7" rx="17" ry="2.5" fill="#365844" opacity="0.6" />

            {/* Hot Drink Surface */}
            <ellipse cx="30" cy="7" rx="15" ry="2" fill="#583115" />

            {/* Rising Steam Wisps */}
            <motion.path
              d="M 23 2 Q 19 -10 25 -20 T 21 -34"
              stroke="#a7f3d0"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{
                opacity: [0.3, 0.8, 0.2],
                y: [0, -6, -12],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 35 2 Q 40 -8 34 -18 T 37 -30"
              stroke="#a7f3d0"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{
                opacity: [0.2, 0.7, 0.2],
                y: [0, -5, -10],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            />
          </g>

          {/* 13. Cute Front Paws Holding the Mug */}
          {/* Left Paw */}
          <path
            d="M 190 220 C 195 210, 212 214, 214 228 C 214 238, 196 242, 190 234 Z"
            fill="#b87841"
            stroke="#733e14"
            strokeWidth="2"
          />
          {/* Paw digit lines */}
          <path d="M 204 220 L 206 226 M 209 222 L 211 228" stroke="#733e14" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right Paw */}
          <path
            d="M 270 220 C 265 210, 248 214, 246 228 C 246 238, 264 242, 270 234 Z"
            fill="#b87841"
            stroke="#733e14"
            strokeWidth="2"
          />
          <path d="M 256 220 L 254 226 M 251 222 L 249 228" stroke="#733e14" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* --- Floating Coral-Pink Heart (Right of Capybara) --- */}
        <motion.g
          id="floating-heart"
          transform="translate(365, 200)"
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M 0 10 
               C -12 -5, -30 8, -12 28 
               L 0 40 
               L 12 28 
               C 30 8, 12 -5, 0 10 Z"
            fill="#f87171"
            opacity="0.85"
            transform="scale(0.65)"
          />
        </motion.g>

        {/* --- Floating Breeze Leaf on Upper Right --- */}
        <motion.g
          id="floating-leaf-right"
          transform="translate(385, 130)"
          animate={{
            y: [0, -6, 0],
            rotate: [0, 8, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M 0 0 Q 12 2 15 14 Q 5 15 0 0 Z"
            fill="#86efac"
            stroke="#10b981"
            strokeWidth="1"
            opacity="0.8"
          />
        </motion.g>
      </svg>
    </div>
  );
};
