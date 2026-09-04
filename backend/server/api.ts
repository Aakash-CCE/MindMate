import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  initDatabase,
  findUserByEmail,
  findUserById,
  createUser,
  deleteUserAccount,
  getMoodEntries,
  createMoodEntry,
  deleteMoodEntry,
  getChatSessions,
  getChatSession,
  createChatSession,
  updateChatSessionTitle,
  deleteChatSession,
  deleteAllUserConversations,
  getSessionMessages,
  addMessage,
  getUserTracks,
  saveUserTrack,
  deleteUserTrack,
  MoodType,
} from './db.js';
import { generateCompanionResponse, generateSessionTitle } from './ai.js';
import { generateLyriaMusic } from './music.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mindmate-jwt-secret-key-super-safe';

export const apiApp = express();

apiApp.use(express.json());
apiApp.use(express.urlencoded({ extended: true }));

// Initialize DB on start
initDatabase().catch(console.error);

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
}

// Authentication middleware
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; full_name: string };
    const user = findUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User no longer exists.' });
      return;
    }
    req.user = { id: user.id, email: user.email, full_name: user.full_name };
    next();
  } catch {
    res.status(401).json({ error: 'Session expired or invalid token. Please sign in again.' });
  }
}

// ---------------- AUTH ROUTES ----------------

// Register
apiApp.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { full_name, email, password, confirm_password } = req.body;

    if (!full_name || !email || !password || !confirm_password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = createUser({ full_name, email, password_hash });

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, created_at: user.created_at },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// Login
apiApp.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, created_at: user.created_at },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Demo login
apiApp.post('/auth/demo', async (_req: Request, res: Response) => {
  try {
    await initDatabase();
    const demo = findUserByEmail('demo@mindmate.local');
    if (!demo) {
      return res.status(500).json({ error: 'Demo account not initialized.' });
    }

    const token = jwt.sign(
      { id: demo.id, email: demo.email, full_name: demo.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Logged in as Demo User',
      token,
      user: { id: demo.id, full_name: demo.full_name, email: demo.email, created_at: demo.created_at },
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ error: 'Unable to start demo session.' });
  }
});

// Current user
apiApp.get('/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    user: { id: user.id, full_name: user.full_name, email: user.email, created_at: user.created_at },
  });
});

// ---------------- MOOD ROUTES ----------------

// Get user's moods
apiApp.get('/moods', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const entries = getMoodEntries(req.user!.id);
    return res.json({ moods: entries });
  } catch (err) {
    console.error('Get moods error:', err);
    return res.status(500).json({ error: 'Failed to retrieve mood history.' });
  }
});

// Create mood entry
apiApp.post('/moods', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { mood, intensity, note } = req.body;
    const validMoods: MoodType[] = ['happy', 'calm', 'okay', 'sad', 'anxious', 'stressed', 'lonely', 'angry'];

    if (!validMoods.includes(mood)) {
      return res.status(400).json({ error: `Invalid mood. Allowed: ${validMoods.join(', ')}` });
    }

    const intensityNum = Number(intensity);
    if (isNaN(intensityNum) || intensityNum < 1 || intensityNum > 10) {
      return res.status(400).json({ error: 'Intensity must be a number between 1 and 10.' });
    }

    const entry = createMoodEntry(req.user!.id, { mood, intensity: intensityNum, note });
    return res.status(201).json({ message: 'Mood recorded', mood: entry });
  } catch (err) {
    console.error('Create mood error:', err);
    return res.status(500).json({ error: 'Failed to save mood entry.' });
  }
});

// Delete mood entry
apiApp.delete('/moods/:id', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const success = deleteMoodEntry(req.user!.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Mood entry not found or unauthorized.' });
    }
    return res.json({ message: 'Mood entry deleted.' });
  } catch (err) {
    console.error('Delete mood error:', err);
    return res.status(500).json({ error: 'Failed to delete mood entry.' });
  }
});

// ---------------- CHAT ROUTES ----------------

// Get all sessions
apiApp.get('/chat/sessions', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const sessions = getChatSessions(req.user!.id);
    return res.json({ sessions });
  } catch (err) {
    console.error('Get sessions error:', err);
    return res.status(500).json({ error: 'Failed to load conversations.' });
  }
});

// Create session
apiApp.post('/chat/sessions', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const session = createChatSession(req.user!.id, title || 'New Conversation');
    return res.status(201).json({ session });
  } catch (err) {
    console.error('Create session error:', err);
    return res.status(500).json({ error: 'Failed to create conversation.' });
  }
});

// Get session details & messages
apiApp.get('/chat/sessions/:id', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const session = getChatSession(req.user!.id, req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    const messages = getSessionMessages(req.user!.id, session.id);
    return res.json({ session, messages });
  } catch (err) {
    console.error('Get session messages error:', err);
    return res.status(500).json({ error: 'Failed to retrieve conversation details.' });
  }
});

// Send message & get AI response
apiApp.post('/chat/sessions/:id/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    const session = getChatSession(req.user!.id, req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Conversation session not found.' });
    }

    // Save user message
    const userMsg = addMessage(req.user!.id, session.id, 'user', content);

    // If this is the first message or title is still "New Conversation", auto-title
    const existingMessages = getSessionMessages(req.user!.id, session.id);
    if (session.title === 'New Conversation' || existingMessages.length <= 2) {
      const generatedTitle = generateSessionTitle(content);
      updateChatSessionTitle(req.user!.id, session.id, generatedTitle);
    }

    // Call AI Companion service
    const aiResponseText = await generateCompanionResponse(existingMessages, content);

    // Save AI response
    const assistantMsg = addMessage(req.user!.id, session.id, 'assistant', aiResponseText);

    return res.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (err) {
    console.error('Chat message error:', err);
    return res.status(500).json({ error: 'Unable to complete message exchange. Please try again.' });
  }
});

// Delete session
apiApp.delete('/chat/sessions/:id', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const success = deleteChatSession(req.user!.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Conversation not found or unauthorized.' });
    }
    return res.json({ message: 'Conversation deleted.' });
  } catch (err) {
    console.error('Delete session error:', err);
    return res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

// ---------------- PROFILE & PRIVACY ROUTES ----------------

// Delete all conversations
apiApp.delete('/user/conversations', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    deleteAllUserConversations(req.user!.id);
    return res.json({ message: 'All conversations have been permanently erased.' });
  } catch (err) {
    console.error('Delete all conversations error:', err);
    return res.status(500).json({ error: 'Failed to clear conversations.' });
  }
});

// Delete user account
apiApp.delete('/user/account', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    deleteUserAccount(req.user!.id);
    return res.json({ message: 'Account and associated records have been permanently removed.' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res.status(500).json({ error: 'Failed to delete account.' });
  }
});

// ---------------- MUSIC GENERATION (LYRIA) ROUTES ----------------

// Generate music using lyria-3-clip-preview or lyria-3-pro-preview
apiApp.post('/music/generate', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, modelType = 'clip', mood = 'calm', saveToLibrary = true, title } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a descriptive prompt for the music.' });
    }

    const mode: 'clip' | 'pro' = modelType === 'pro' ? 'pro' : 'clip';
    const result = await generateLyriaMusic({
      prompt: prompt.trim(),
      modelType: mode,
      mood,
    });

    let savedTrack = null;
    if (saveToLibrary && req.user) {
      const defaultTitle = title || `${mood.charAt(0).toUpperCase() + mood.slice(1)} Soundscape (${mode === 'clip' ? '30s' : 'Full'})`;
      savedTrack = saveUserTrack(req.user.id, {
        title: defaultTitle,
        prompt: prompt.trim(),
        model: result.model,
        duration_seconds: result.durationSeconds,
        audio_base64: result.audioBase64,
        mime_type: result.mimeType,
        lyrics: result.lyrics,
        mood_tag: mood,
      });
    }

    return res.json({
      track: savedTrack || {
        title: title || 'Ambient Soundtrack',
        model: result.model,
        duration_seconds: result.durationSeconds,
        audio_base64: result.audioBase64,
        mime_type: result.mimeType,
        lyrics: result.lyrics,
      },
      isFallback: result.isFallback,
      message: result.message,
    });
  } catch (err: any) {
    console.error('Music generation route error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate soothing soundtrack.' });
  }
});

// Get user saved tracks
apiApp.get('/music/tracks', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const tracks = getUserTracks(req.user!.id);
    return res.json({ tracks });
  } catch (err) {
    console.error('Fetch tracks error:', err);
    return res.status(500).json({ error: 'Failed to retrieve saved music tracks.' });
  }
});

// Delete saved track
apiApp.delete('/music/tracks/:id', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const success = deleteUserTrack(req.user!.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Track not found.' });
    }
    return res.json({ message: 'Track deleted.' });
  } catch (err) {
    console.error('Delete track error:', err);
    return res.status(500).json({ error: 'Failed to delete track.' });
  }
});

// Get live API voice configuration info
apiApp.get('/live/info', (_req: Request, res: Response) => {
  res.json({
    model: 'gemini-3.1-flash-live-preview',
    voices: [
      { id: 'Zephyr', name: 'Zephyr (Gentle & Calming)', description: 'Soft, grounded tone ideal for mindful breathing' },
      { id: 'Kore', name: 'Kore (Warm & Empathetic)', description: 'Nurturing, soothing tone for reflection' },
      { id: 'Puck', name: 'Puck (Playful & Cheerful)', description: 'Uplifting and energetic friend' },
      { id: 'Fenrir', name: 'Fenrir (Steady & Protective)', description: 'Deep, stabilizing presence for grounding' },
      { id: 'Charon', name: 'Charon (Thoughtful & Measured)', description: 'Paced, serene contemplative voice' },
    ],
    wsPath: '/api/live-ws',
  });
});

