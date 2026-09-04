import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export type MoodType = 'happy' | 'calm' | 'okay' | 'sad' | 'anxious' | 'stressed' | 'lonely' | 'angry';

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  intensity: number; // 1-10
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

export interface MusicTrack {
  id: string;
  user_id: string;
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

interface DatabaseSchema {
  users: User[];
  mood_entries: MoodEntry[];
  chat_sessions: ChatSession[];
  messages: ChatMessage[];
  music_tracks?: MusicTrack[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'mindmate_db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDB(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      users: [],
      mood_entries: [],
      chat_sessions: [],
      messages: [],
    };
    saveDB(initial);
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading database file, initializing empty:', err);
    return { users: [], mood_entries: [], chat_sessions: [], messages: [] };
  }
}

function saveDB(db: DatabaseSchema) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Initialize and seed demo user if not present
export async function initDatabase() {
  const db = loadDB();
  const demoEmail = 'demo@mindmate.local';
  let demoUser = db.users.find((u) => u.email.toLowerCase() === demoEmail.toLowerCase());

  if (!demoUser) {
    const passwordHash = await bcrypt.hash('Demo@12345', 10);
    const now = new Date();
    const demoId = 'demo-user-1';

    demoUser = {
      id: demoId,
      full_name: 'Aakash',
      email: demoEmail,
      password_hash: passwordHash,
      created_at: new Date(now.getTime() - 7 * 86400000).toISOString(),
      updated_at: now.toISOString(),
    };
    db.users.push(demoUser);

    // Seed mood entries for demo user across recent days
    const moodsSeed: MoodEntry[] = [
      {
        id: 'mood-seed-1',
        user_id: demoId,
        mood: 'calm',
        intensity: 7,
        note: 'Took a morning walk in the park. Feeling centered and ready for the day.',
        created_at: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
      },
      {
        id: 'mood-seed-2',
        user_id: demoId,
        mood: 'anxious',
        intensity: 6,
        note: 'Had a tight deadline at work today. Practiced box breathing.',
        created_at: new Date(now.getTime() - 26 * 3600000).toISOString(), // Yesterday
      },
      {
        id: 'mood-seed-3',
        user_id: demoId,
        mood: 'okay',
        intensity: 5,
        note: 'Just an average Wednesday. Drank chamomile tea before sleeping.',
        created_at: new Date(now.getTime() - 50 * 3600000).toISOString(), // 2 days ago
      },
      {
        id: 'mood-seed-4',
        user_id: demoId,
        mood: 'happy',
        intensity: 8,
        note: 'Had lunch with an old friend. Felt connected and supported.',
        created_at: new Date(now.getTime() - 74 * 3600000).toISOString(), // 3 days ago
      },
      {
        id: 'mood-seed-5',
        user_id: demoId,
        mood: 'lonely',
        intensity: 4,
        note: 'Quiet evening at home. Talked with MindMate and felt heard.',
        created_at: new Date(now.getTime() - 98 * 3600000).toISOString(), // 4 days ago
      },
    ];
    db.mood_entries.push(...moodsSeed);

    // Seed chat sessions & messages
    const sessionId = 'session-seed-1';
    db.chat_sessions.push({
      id: sessionId,
      user_id: demoId,
      title: 'Finding calm amidst busy days',
      created_at: new Date(now.getTime() - 26 * 3600000).toISOString(),
      updated_at: new Date(now.getTime() - 25 * 3600000).toISOString(),
    });

    db.messages.push(
      {
        id: 'msg-seed-1',
        session_id: sessionId,
        role: 'user',
        content: "Hi MindMate. I've been feeling a bit overwhelmed by everything on my plate this week.",
        created_at: new Date(now.getTime() - 26 * 3600000).toISOString(),
      },
      {
        id: 'msg-seed-2',
        session_id: sessionId,
        role: 'assistant',
        content:
          "Hello, I hear you. When tasks pile up, it is very natural to feel overwhelmed. Thank you for taking a moment to pause and check in with yourself.\n\nWhat is taking up the most space in your mind right now?",
        created_at: new Date(now.getTime() - 25.9 * 3600000).toISOString(),
      },
      {
        id: 'msg-seed-3',
        session_id: sessionId,
        role: 'user',
        content: 'Work deadlines and not having enough quiet time for myself.',
        created_at: new Date(now.getTime() - 25.5 * 3600000).toISOString(),
      },
      {
        id: 'msg-seed-4',
        session_id: sessionId,
        role: 'assistant',
        content:
          "That combination can feel like you're running on empty. When demands are high, even a five-minute micro-break can help reset your nervous system.\n\nWould you like to try a quick two-minute grounding exercise together, or would it feel better to just talk through what's on your list?",
        created_at: new Date(now.getTime() - 25 * 3600000).toISOString(),
      }
    );

    saveDB(db);
  }
}

// User CRUD
export function findUserByEmail(email: string): User | undefined {
  const db = loadDB();
  return db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const db = loadDB();
  return db.users.find((u) => u.id === id);
}

export function createUser(userData: { full_name: string; email: string; password_hash: string }): User {
  const db = loadDB();
  const now = new Date().toISOString();
  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    full_name: userData.full_name.trim(),
    email: userData.email.trim().toLowerCase(),
    password_hash: userData.password_hash,
    created_at: now,
    updated_at: now,
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function deleteUserAccount(userId: string): boolean {
  const db = loadDB();
  db.users = db.users.filter((u) => u.id !== userId);
  db.mood_entries = db.mood_entries.filter((m) => m.user_id !== userId);

  // find sessions to delete
  const userSessions = db.chat_sessions.filter((s) => s.user_id === userId);
  const sessionIds = new Set(userSessions.map((s) => s.id));
  db.chat_sessions = db.chat_sessions.filter((s) => s.user_id !== userId);
  db.messages = db.messages.filter((msg) => !sessionIds.has(msg.session_id));

  saveDB(db);
  return true;
}

// Mood CRUD (strictly user-isolated)
export function getMoodEntries(userId: string): MoodEntry[] {
  const db = loadDB();
  return db.mood_entries
    .filter((m) => m.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createMoodEntry(userId: string, data: { mood: MoodType; intensity: number; note?: string }): MoodEntry {
  const db = loadDB();
  const newEntry: MoodEntry = {
    id: `mood-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    mood: data.mood,
    intensity: Math.min(10, Math.max(1, Math.round(data.intensity))),
    note: data.note ? data.note.trim() : undefined,
    created_at: new Date().toISOString(),
  };
  db.mood_entries.push(newEntry);
  saveDB(db);
  return newEntry;
}

export function deleteMoodEntry(userId: string, moodId: string): boolean {
  const db = loadDB();
  const initialLength = db.mood_entries.length;
  db.mood_entries = db.mood_entries.filter((m) => !(m.id === moodId && m.user_id === userId));
  const changed = db.mood_entries.length < initialLength;
  if (changed) saveDB(db);
  return changed;
}

// Chat CRUD (strictly user-isolated)
export function getChatSessions(userId: string): ChatSession[] {
  const db = loadDB();
  return db.chat_sessions
    .filter((s) => s.user_id === userId)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export function getChatSession(userId: string, sessionId: string): ChatSession | undefined {
  const db = loadDB();
  return db.chat_sessions.find((s) => s.id === sessionId && s.user_id === userId);
}

export function createChatSession(userId: string, title = 'New Conversation'): ChatSession {
  const db = loadDB();
  const now = new Date().toISOString();
  const newSession: ChatSession = {
    id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    user_id: userId,
    title: title.trim(),
    created_at: now,
    updated_at: now,
  };
  db.chat_sessions.push(newSession);
  saveDB(db);
  return newSession;
}

export function updateChatSessionTitle(userId: string, sessionId: string, title: string) {
  const db = loadDB();
  const session = db.chat_sessions.find((s) => s.id === sessionId && s.user_id === userId);
  if (session) {
    session.title = title.trim();
    session.updated_at = new Date().toISOString();
    saveDB(db);
  }
}

export function deleteChatSession(userId: string, sessionId: string): boolean {
  const db = loadDB();
  const exists = db.chat_sessions.some((s) => s.id === sessionId && s.user_id === userId);
  if (!exists) return false;

  db.chat_sessions = db.chat_sessions.filter((s) => !(s.id === sessionId && s.user_id === userId));
  db.messages = db.messages.filter((m) => m.session_id !== sessionId);
  saveDB(db);
  return true;
}

export function deleteAllUserConversations(userId: string): boolean {
  const db = loadDB();
  const userSessions = db.chat_sessions.filter((s) => s.user_id === userId);
  const sessionIds = new Set(userSessions.map((s) => s.id));
  db.chat_sessions = db.chat_sessions.filter((s) => s.user_id !== userId);
  db.messages = db.messages.filter((m) => !sessionIds.has(m.session_id));
  saveDB(db);
  return true;
}

export function getSessionMessages(userId: string, sessionId: string): ChatMessage[] {
  const db = loadDB();
  // Ensure session belongs to user
  const session = db.chat_sessions.find((s) => s.id === sessionId && s.user_id === userId);
  if (!session) return [];

  return db.messages
    .filter((m) => m.session_id === sessionId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function addMessage(
  userId: string,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): ChatMessage | null {
  const db = loadDB();
  const session = db.chat_sessions.find((s) => s.id === sessionId && s.user_id === userId);
  if (!session) return null;

  const now = new Date().toISOString();
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    session_id: sessionId,
    role,
    content: content.trim(),
    created_at: now,
  };
  db.messages.push(newMsg);
  session.updated_at = now;
  saveDB(db);
  return newMsg;
}

export function getUserTracks(userId: string): MusicTrack[] {
  const db = loadDB();
  const tracks = db.music_tracks || [];
  return tracks
    .filter((t) => t.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function saveUserTrack(userId: string, track: Omit<MusicTrack, 'id' | 'user_id' | 'created_at'>): MusicTrack {
  const db = loadDB();
  if (!db.music_tracks) {
    db.music_tracks = [];
  }
  const newTrack: MusicTrack = {
    ...track,
    id: `track-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    created_at: new Date().toISOString(),
  };
  db.music_tracks.unshift(newTrack);
  // Keep up to 30 tracks per user
  saveDB(db);
  return newTrack;
}

export function deleteUserTrack(userId: string, trackId: string): boolean {
  const db = loadDB();
  if (!db.music_tracks) return false;
  const initialLen = db.music_tracks.length;
  db.music_tracks = db.music_tracks.filter((t) => !(t.id === trackId && t.user_id === userId));
  if (db.music_tracks.length !== initialLen) {
    saveDB(db);
    return true;
  }
  return false;
}
