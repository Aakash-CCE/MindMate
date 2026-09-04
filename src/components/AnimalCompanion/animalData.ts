export type CompanionType =
  | 'lion'
  | 'dino'
  | 'wolf'
  | 'tiger'
  | 'eagle'
  | 'bear'
  | 'fox'
  | 'elephant'
  | 'penguin'
  | 'parrot'
  | 'capybara'
  | 'panda'
  | 'cat'
  | 'puppy'
  | 'bunny';

export type CompanionCategory = 'all' | 'boys_favorites' | 'gentle';

export type CompanionState =
  | 'idle'
  | 'welcome'
  | 'happy'
  | 'calm'
  | 'sad'
  | 'anxious'
  | 'stressed'
  | 'lonely'
  | 'okay'
  | 'angry'
  | 'thinking'
  | 'listening'
  | 'success'
  | 'breathing';

export interface CompanionProfile {
  id: CompanionType;
  name: string;
  label: string;
  emoji: string;
  title: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  isBoyFavorite?: boolean;
  tag?: string;
}

export const COMPANIONS: Record<CompanionType, CompanionProfile> = {
  // =========================================================================
  // POWERFUL ANIMALS (Boys' Section) - Fierce, mighty, apex guardians!
  // =========================================================================
  lion: {
    id: 'lion',
    name: 'Leo',
    label: 'Apex King Lion',
    emoji: '🦁',
    title: 'Leo the Apex Lion King',
    description: 'Regal, fearless, and commanding. The mighty King of Beasts stands by your side with unyielding courage and a majestic golden mane.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300',
    isBoyFavorite: true,
    tag: 'Apex Monarch ⚡',
  },
  dino: {
    id: 'dino',
    name: 'Rex',
    label: 'Apex Tyrannosaurus',
    emoji: '🦖',
    title: 'Rex the Apex T-Rex',
    description: 'Thunderous, armored, and colossal. A prehistoric apex titan with razor sharp teeth, armored dorsal spikes, and unstoppable power.',
    accentColor: '#15803d',
    badgeBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
    isBoyFavorite: true,
    tag: 'Primal Titan ⚡',
  },
  wolf: {
    id: 'wolf',
    name: 'Shadow',
    label: 'Apex Dire Wolf',
    emoji: '🐺',
    title: 'Shadow the Dire Wolf',
    description: 'Fierce, vigilant, and intensely loyal. A nocturnal alpha predator with piercing hunter eyes, razor canines, and unbreakable focus.',
    accentColor: '#475569',
    badgeBg: 'bg-slate-100/90 text-slate-900 border-slate-300',
    isBoyFavorite: true,
    tag: 'Alpha Guardian ⚡',
  },
  tiger: {
    id: 'tiger',
    name: 'Fang',
    label: 'Apex Saber Tiger',
    emoji: '🐅',
    title: 'Fang the Royal Tiger',
    description: 'Muscular, stealthy, and ferocious. Striking with lightning agility, razor fangs, and primal warrior dominance.',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-100/90 text-orange-900 border-orange-300',
    isBoyFavorite: true,
    tag: 'Apex Striker ⚡',
  },
  eagle: {
    id: 'eagle',
    name: 'Talon',
    label: 'Apex Thunder Eagle',
    emoji: '🦅',
    title: 'Talon the Sky Titan',
    description: 'Sharp-eyed, majestic, and dominant. Soars above every storm with razor curved talons and unshakeable mastery.',
    accentColor: '#b45309',
    badgeBg: 'bg-yellow-100/90 text-yellow-900 border-yellow-300',
    isBoyFavorite: true,
    tag: 'Sky Sovereign ⚡',
  },
  bear: {
    id: 'bear',
    name: 'Kodiak',
    label: 'Titan Grizzly',
    emoji: '🐻',
    title: 'Kodiak the Mountain Titan',
    description: 'An immovable mountain of raw primal strength. Protects your peace with colossal ground-shaking power and formidable claws.',
    accentColor: '#78350f',
    badgeBg: 'bg-amber-100/90 text-amber-950 border-amber-300',
    isBoyFavorite: true,
    tag: 'Colossal Guard ⚡',
  },

  // =========================================================================
  // GENTLE & CLASSIC FRIENDS
  // =========================================================================
  fox: {
    id: 'fox',
    name: 'Rusty',
    label: 'Adventurous Fox',
    emoji: '🦊',
    title: 'Rusty the Clever Fox',
    description: 'Smart, swift, and sharp-witted. Loved for high spirits, bright bushy tail, and cozy wilderness loyalty.',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-100/80 text-orange-900 border-orange-200',
    tag: 'Clever Explorer',
  },
  elephant: {
    id: 'elephant',
    name: 'Peanut',
    label: 'Gentle Elephant',
    emoji: '🐘',
    title: 'Peanut the Elephant',
    description: 'Mighty, gentle, and deeply loyal. An unwavering mountain of calm strength and peaceful reassurance.',
    accentColor: '#0284c7',
    badgeBg: 'bg-blue-100/80 text-blue-900 border-blue-200',
    tag: 'Calm Giant',
  },
  penguin: {
    id: 'penguin',
    name: 'Pingo',
    label: 'Chubby Penguin',
    emoji: '🐧',
    title: 'Pingo the Penguin',
    description: 'Cool, playful, and loyal. Wades steadily through any icy currents with cheer.',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-100/80 text-sky-900 border-sky-200',
    tag: 'Cheerful',
  },
  parrot: {
    id: 'parrot',
    name: 'Rio',
    label: 'Curious Parakeet',
    emoji: '🦜',
    title: 'Rio the Jungle Parrot',
    description: 'Vibrant, lively, and fearless. Brings bright colorful energy to every new day.',
    accentColor: '#65a30d',
    badgeBg: 'bg-lime-100/80 text-lime-900 border-lime-200',
    tag: 'Vibrant',
  },
  bunny: {
    id: 'bunny',
    name: 'Pip',
    label: 'Sweet Bunny',
    emoji: '🐰',
    title: 'Pip the Bunny',
    description: 'Quiet and tender-hearted. Hugs its fresh carrot and loves slow calming breaths.',
    accentColor: '#8b5cf6',
    badgeBg: 'bg-purple-100/70 text-purple-900 border-purple-200',
    tag: 'Classic',
  },
  puppy: {
    id: 'puppy',
    name: 'Biscuit',
    label: 'Friendly Pup',
    emoji: '🐶',
    title: 'Biscuit the Pup',
    description: 'Affectionate and attentive with floppy bouncing ears. Always glad you checked in.',
    accentColor: '#d97706',
    badgeBg: 'bg-yellow-100/70 text-yellow-900 border-yellow-200',
    tag: 'Popular',
  },
  capybara: {
    id: 'capybara',
    name: 'Capi',
    label: 'Baby Capybara',
    emoji: '🦫',
    title: 'Capi the Capybara',
    description: 'Serene, calm, and grounded. Hugs a warm sunflower and sits peacefully by your side.',
    accentColor: '#92400e',
    badgeBg: 'bg-amber-100/70 text-amber-900 border-amber-200',
    tag: 'Calm',
  },
  panda: {
    id: 'panda',
    name: 'Pan',
    label: 'Gentle Panda',
    emoji: '🐼',
    title: 'Pan the Panda',
    description: 'Soft and peaceful with bamboo shoots. Brings quiet comfort when things feel loud.',
    accentColor: '#334155',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
    tag: 'Peaceful',
  },
  cat: {
    id: 'cat',
    name: 'Mochi',
    label: 'Calm Kitten',
    emoji: '🐱',
    title: 'Mochi the Kitten',
    description: 'Gentle and observant. Holding a pink blossom with quiet warmth without pressure.',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-100/70 text-orange-900 border-orange-200',
    tag: 'Gentle',
  },
};

export interface CompanionStateConfig {
  message: string;
  actionText?: string;
  actionType?: 'breathing' | 'chat' | 'checkin';
}

export const STATE_CONFIGS: Record<CompanionState, CompanionStateConfig> = {
  idle: {
    message: 'Taking things one gentle breath at a time.',
  },
  welcome: {
    message: 'Hey! How are you feeling today?',
    actionText: 'Check In',
    actionType: 'checkin',
  },
  happy: {
    message: "I'm glad you're having a good moment.",
  },
  calm: {
    message: "Nice. Let's keep that calm feeling going.",
    actionText: 'Gentle Breathing',
    actionType: 'breathing',
  },
  sad: {
    message: "I'm here to listen. Want to talk about it?",
    actionText: 'Start a Chat',
    actionType: 'chat',
  },
  anxious: {
    message: "Let's slow things down together. Take a gentle breath.",
    actionText: 'Start Breathing',
    actionType: 'breathing',
  },
  stressed: {
    message: "There's no rush right now. Let's take a peaceful pause.",
    actionText: 'Start Breathing',
    actionType: 'breathing',
  },
  lonely: {
    message: "You don't have to put everything into words at once. I'm listening.",
    actionText: 'Open Chat',
    actionType: 'chat',
  },
  okay: {
    message: 'Steady and present. Checking in with yourself is always worthwhile.',
  },
  angry: {
    message: "It's completely okay to feel frustrated. I'm right here with you.",
    actionText: 'Cool Down Breathing',
    actionType: 'breathing',
  },
  thinking: {
    message: 'Reflecting thoughtfully...',
  },
  listening: {
    message: "I'm right here, listening...",
  },
  success: {
    message: 'Saved. Thanks for checking in with yourself today.',
  },
  breathing: {
    message: 'Inhale gently... hold... and release slowly.',
  },
};
