export interface AvatarProfile {
  id: string;
  name: string;
  label: string;
  category: 'boys' | 'girls' | 'mindful';
  emoji: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  description: string;
  isBoyFavorite?: boolean;
}

export const USER_AVATARS: AvatarProfile[] = [
  // Boys' Favorites & Popular Profiles
  {
    id: 'boy-gamer',
    name: 'Neo',
    label: 'Gamer & Techie',
    category: 'boys',
    emoji: '🎮',
    bgGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    borderColor: 'border-blue-300',
    accentColor: '#3b82f6',
    description: 'High energy, loves challenges, and stays focused under pressure.',
    isBoyFavorite: true,
  },
  {
    id: 'boy-skater',
    name: 'Jax',
    label: 'Skater & Explorer',
    category: 'boys',
    emoji: '🛹',
    bgGradient: 'from-amber-500 via-orange-500 to-red-600',
    borderColor: 'border-amber-300',
    accentColor: '#f97316',
    description: 'Adventurous, creative, and always looking for new lines and tricks.',
    isBoyFavorite: true,
  },
  {
    id: 'boy-headphones',
    name: 'Leo',
    label: 'Beats & Lo-Fi',
    category: 'boys',
    emoji: '🎧',
    bgGradient: 'from-cyan-500 via-teal-600 to-emerald-700',
    borderColor: 'border-cyan-300',
    accentColor: '#06b6d4',
    description: 'Calm and steady, always tuned into inspiring rhythms and focus tunes.',
    isBoyFavorite: true,
  },
  {
    id: 'boy-astronaut',
    name: 'Cosmo',
    label: 'Space Explorer',
    category: 'boys',
    emoji: '🚀',
    bgGradient: 'from-indigo-700 via-purple-700 to-slate-900',
    borderColor: 'border-indigo-300',
    accentColor: '#6366f1',
    description: 'Dreamer with curiosity as boundless as the cosmic universe.',
    isBoyFavorite: true,
  },
  {
    id: 'boy-dino',
    name: 'Rex Hunter',
    label: 'Jurassic Adventurer',
    category: 'boys',
    emoji: '🦖',
    bgGradient: 'from-emerald-600 via-green-600 to-teal-800',
    borderColor: 'border-emerald-300',
    accentColor: '#10b981',
    description: 'Brave, spirited, and fascinated by ancient giants and nature.',
    isBoyFavorite: true,
  },
  {
    id: 'boy-athlete',
    name: 'Dash',
    label: 'Track & Champion',
    category: 'boys',
    emoji: '⚡',
    bgGradient: 'from-yellow-500 via-amber-500 to-orange-600',
    borderColor: 'border-amber-300',
    accentColor: '#eab308',
    description: 'Quick-footed, resilient, and always ready to push past limits.',
    isBoyFavorite: true,
  },

  // Mindful & Creative
  {
    id: 'zen-seeker',
    name: 'Kai',
    label: 'Peaceful Meditator',
    category: 'mindful',
    emoji: '🧘',
    bgGradient: 'from-teal-500 via-emerald-600 to-slate-800',
    borderColor: 'border-teal-300',
    accentColor: '#14b8a6',
    description: 'Deep breaths, grounded thoughts, and calm presence in every storm.',
  },
  {
    id: 'nature-wanderer',
    name: 'Cedar',
    label: 'Forest Wanderer',
    category: 'mindful',
    emoji: '🌲',
    bgGradient: 'from-green-600 via-emerald-700 to-stone-800',
    borderColor: 'border-green-300',
    accentColor: '#15803d',
    description: 'Finds serenity among pine needles, fresh rain, and mountain trails.',
  },
  {
    id: 'coffee-hoodie',
    name: 'Milo',
    label: 'Cozy Thinker',
    category: 'mindful',
    emoji: '☕',
    bgGradient: 'from-amber-700 via-stone-700 to-neutral-900',
    borderColor: 'border-amber-400',
    accentColor: '#b45309',
    description: 'Soft hoodies, warm mugs, quiet journaling, and deep reflection.',
  },

  // Girls & Expressive
  {
    id: 'girl-artist',
    name: 'Luna',
    label: 'Creative Dreamer',
    category: 'girls',
    emoji: '🎨',
    bgGradient: 'from-pink-500 via-rose-500 to-purple-600',
    borderColor: 'border-pink-300',
    accentColor: '#ec4899',
    description: 'Splashes bold colors and mindful poetry into every blank canvas.',
  },
  {
    id: 'girl-stargazer',
    name: 'Stella',
    label: 'Star Gazer',
    category: 'girls',
    emoji: '✨',
    bgGradient: 'from-violet-600 via-fuchsia-600 to-indigo-800',
    borderColor: 'border-violet-300',
    accentColor: '#8b5cf6',
    description: 'Observant, gentle-hearted, and inspired by twilight constellations.',
  },
  {
    id: 'girl-music',
    name: 'Aria',
    label: 'Melody & Harmony',
    category: 'girls',
    emoji: '🎶',
    bgGradient: 'from-rose-500 via-orange-400 to-amber-500',
    borderColor: 'border-rose-300',
    accentColor: '#f43f5e',
    description: 'Expresses emotions through soothing acoustic chords and melodies.',
  },
];

export const DEFAULT_AVATAR_ID = 'boy-gamer';
