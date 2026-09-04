import { User, MoodEntry, ChatSession, ChatMessage, MoodType, MusicTrack } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mindmate_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  // Auth
  async register(data: { full_name: string; email: string; password: string; confirm_password: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; token: string; user: User }>(res);
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; token: string; user: User }>(res);
  },

  async loginDemo() {
    const res = await fetch(`${API_BASE}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ message: string; token: string; user: User }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: User }>(res);
  },

  // Moods
  async getMoods() {
    const res = await fetch(`${API_BASE}/moods`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ moods: MoodEntry[] }>(res);
  },

  async createMood(data: { mood: MoodType; intensity: number; note?: string }) {
    const res = await fetch(`${API_BASE}/moods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; mood: MoodEntry }>(res);
  },

  async deleteMood(id: string) {
    const res = await fetch(`${API_BASE}/moods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Chat
  async getSessions() {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ sessions: ChatSession[] }>(res);
  },

  async createSession(title?: string) {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title }),
    });
    return handleResponse<{ session: ChatSession }>(res);
  },

  async getSession(id: string) {
    const res = await fetch(`${API_BASE}/chat/sessions/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ session: ChatSession; messages: ChatMessage[] }>(res);
  },

  async sendMessage(sessionId: string, content: string) {
    const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(res);
  },

  async deleteSession(sessionId: string) {
    const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Profile
  async deleteConversations() {
    const res = await fetch(`${API_BASE}/user/conversations`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async deleteAccount() {
    const res = await fetch(`${API_BASE}/user/account`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Music Generation (Lyria)
  async generateMusic(data: {
    prompt: string;
    modelType?: 'clip' | 'pro';
    mood?: string;
    title?: string;
    saveToLibrary?: boolean;
  }) {
    const res = await fetch(`${API_BASE}/music/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{
      track: MusicTrack;
      isFallback?: boolean;
      message?: string;
    }>(res);
  },

  async getMusicTracks() {
    const res = await fetch(`${API_BASE}/music/tracks`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ tracks: MusicTrack[] }>(res);
  },

  async deleteMusicTrack(id: string) {
    const res = await fetch(`${API_BASE}/music/tracks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Live Voice API info
  async getLiveVoiceInfo() {
    const res = await fetch(`${API_BASE}/live/info`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{
      model: string;
      voices: Array<{ id: string; name: string; description: string }>;
      wsPath: string;
    }>(res);
  },
};
