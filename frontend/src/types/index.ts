export type MoodType =
  | 'happy'
  | 'calm'
  | 'okay'
  | 'sad'
  | 'anxious'
  | 'stressed'
  | 'lonely'
  | 'angry';

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  intensity: number;
  note?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface MoodMeta {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  text: string;
}

export const MOOD_DEFINITIONS: Record<MoodType, MoodMeta> = {
  happy: {
    type: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: '#eab308',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
  },
  calm: {
    type: 'calm',
    label: 'Calm',
    emoji: '😌',
    color: '#0d9488',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
  },
  okay: {
    type: 'okay',
    label: 'Okay',
    emoji: '😐',
    color: '#64748b',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
  },
  sad: {
    type: 'sad',
    label: 'Sad',
    emoji: '😔',
    color: '#3b82f6',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
  },
  anxious: {
    type: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    color: '#8b5cf6',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-800',
  },
  stressed: {
    type: 'stressed',
    label: 'Stressed',
    emoji: '😩',
    color: '#f97316',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
  },
  lonely: {
    type: 'lonely',
    label: 'Lonely',
    emoji: '🫥',
    color: '#6366f1',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
  },
  angry: {
    type: 'angry',
    label: 'Angry',
    emoji: '😡',
    color: '#ef4444',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
  },
};

export interface MusicTrack {
  id: string;
  user_id?: string;
  title: string;
  prompt: string;
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  duration_seconds: number;
  audio_url?: string;
  audio_base64?: string;
  mime_type: string;
  lyrics?: string;
  mood_tag?: string;
  created_at: string;
}

