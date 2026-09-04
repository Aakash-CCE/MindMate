# MindMate — AI-Powered Emotional Wellness and Personalized Support System

MindMate is an empathetic, AI-powered emotional wellness web application designed for anyone feeling stressed, lonely, overwhelmed, or looking for a safe, non-judgmental space to pause and reflect.

> **Important Non-Clinical Disclaimer:**  
> MindMate provides supportive, non-clinical conversation and daily reflection tools. It is **not** a medical device, diagnosis tool, or substitute for professional medical, psychological, or psychiatric care. MindMate does not claim to diagnose or treat health conditions. If you are experiencing an emergency or crisis, please call or text **988** (US/Canada) or reach out to local emergency services immediately.

---

## 1. Features

- **User Authentication & Security**: Register, login, password hashing with bcrypt/argon2, secure JWT sessions, automatic session restoration, and one-click demo access.
- **Daily Mood Check-In & Reflection**:
  - 8 core emotions: Happy, Calm, Okay, Sad, Anxious, Stressed, Lonely, Angry
  - Intensity rating slider from 1 to 10
  - Optional personal journaling note
  - Visual timeline & reflection history
- **Supportive AI Companion**:
  - Powered by Google Gemini (`gemini-3.8-flash`) with server-side API calls
  - Empathetic listening, non-judgmental validation, and gentle follow-up questions
  - Safety keyword detection with crisis intervention resources (988 Lifeline, Crisis Text Line)
  - Persistent conversation history with auto-generated session titles
- **User Dashboard**: Time-based greeting, today's mood highlight, quick reflection prompts, and recent conversation shortcuts.
- **Privacy & Data Ownership**: Permanent conversation deletion, account wipe, and complete user data isolation.
- **Calming, Accessible UI**: Warm, non-clinical color palette, responsive desktop navigation, and mobile bottom bar.

---

## 2. Architecture & Tech Stack

```text
React (Vite + Tailwind CSS + Lucide)
   │
   ▼ HTTP / JSON (Bearer JWT)
Node.js / Express API  &  Python FastAPI Backend
   │
   ├── Google GenAI SDK (gemini-3.8-flash)
   └── Persistent Database (JSON / PostgreSQL)
```

### Frontend
- **React 19** with **Vite 6**
- **Tailwind CSS 4**
- **React Router DOM 7**
- **Lucide React Icons**

### Backend
- **Node.js & Express** (native fullstack dev and production server in AI Studio preview)
- **Python 3.11 & FastAPI** (production Python microservice included in `/backend`)
- **SQLAlchemy & PostgreSQL**
- **bcrypt / Passlib** for password hashing
- **JWT (jose / jsonwebtoken)** for authentication

### AI Service
- Server-side integration with `@google/genai` using model `gemini-3.8-flash`.
- Non-clinical wellness companion system prompt and safety layer.

---

## 3. Folder Structure

```text
mindmate/
│
├── src/                        # React Frontend
│   ├── components/             # Navbar, CrisisModal, ProtectedRoute, PublicOnlyRoute
│   ├── context/                # AuthContext (JWT state & user persistence)
│   ├── pages/                  # LandingPage, LoginPage, RegisterPage, DashboardPage, MoodPage, ChatPage, ProfilePage
│   ├── services/               # Client API methods
│   ├── types/                  # TypeScript interfaces & mood definitions
│   ├── App.tsx                 # Route router
│   ├── index.css               # Global typography & Tailwind styles
│   └── main.tsx
│
├── server/                     # Full-Stack Node/Express API
│   ├── ai.ts                   # Gemini AI companion engine & safety router
│   ├── api.ts                  # Express router (Auth, Moods, Chat, Profile)
│   └── db.ts                   # Persistent user & conversation data store
│
├── backend/                    # Python FastAPI Backend Monorepo
│   ├── app/
│   │   ├── database.py         # SQLAlchemy engine & session factory
│   │   ├── models.py           # User, MoodEntry, ChatSession, Message models
│   │   ├── schemas.py          # Pydantic request/response schemas
│   │   ├── routers/            # auth.py, mood.py, chat.py, user.py
│   │   ├── services/           # ai_service.py (Gemini LLM integration)
│   │   └── main.py             # FastAPI entrypoint & CORS middleware
│   ├── tests/                  # Pytest test suite
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml          # Multi-container orchestration (PostgreSQL + Backend + Frontend)
├── metadata.json
├── vite.config.ts
└── README.md
```

---

## 4. Database Schema

### `users`
- `id` (String, PK)
- `full_name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### `mood_entries`
- `id` (String, PK)
- `user_id` (String, FK -> `users.id`)
- `mood` (`happy`, `calm`, `okay`, `sad`, `anxious`, `stressed`, `lonely`, `angry`)
- `intensity` (Integer, 1–10)
- `note` (Text, optional)
- `created_at` (DateTime)

### `chat_sessions`
- `id` (String, PK)
- `user_id` (String, FK -> `users.id`)
- `title` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### `messages`
- `id` (String, PK)
- `session_id` (String, FK -> `chat_sessions.id`)
- `role` (`user` | `assistant`)
- `content` (Text)
- `created_at` (DateTime)

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/demo` — Instant sign-in as Demo User
- `GET /api/auth/me` — Get current authenticated user profile

### Moods
- `GET /api/moods` — Retrieve user's mood entries
- `POST /api/moods` — Create a new daily mood entry
- `DELETE /api/moods/:id` — Delete a mood entry

### Chat Sessions
- `GET /api/chat/sessions` — List user's conversations
- `POST /api/chat/sessions` — Create a new chat session
- `GET /api/chat/sessions/:id` — Get session messages
- `POST /api/chat/sessions/:id/messages` — Send user message and get AI companion response
- `DELETE /api/chat/sessions/:id` — Delete a conversation

### Profile & Privacy
- `DELETE /api/user/conversations` — Permanently erase all conversations
- `DELETE /api/user/account` — Permanently delete user profile and all records

---

## 6. Getting Started & Installation

### Option A: Running with Docker Compose (Recommended for Full Stack)
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

### Option B: Local Development (Node.js & Vite)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up `.env`:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### Option C: Running the Python Backend
1. Navigate to backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Run database migrations / start server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

## 7. Demo / Seed Credentials

You can use the instant demo button or sign in with:
- **Email**: `demo@mindmate.local`
- **Password**: `Demo@12345`

---

## 8. Testing

Run backend tests:
```bash
cd backend
pytest tests/test_api.py -v
```

Tests cover:
- Authentication (registration, duplicate rejection, invalid login, unauthorized routes)
- Mood tracking (creation, isolation, deletion)
- Chat sessions & messages (creation, retrieval, safety fallback, user isolation)

---

## 9. Security & Privacy Policies

- **Data Minimization**: Collects only email, name, and user-initiated mood/chat reflections.
- **Strict User Isolation**: Database queries enforce `user_id` ownership on every request.
- **Zero Plaintext Passwords**: Hashed with bcrypt with salt rounds.
- **Server-Side AI Secrets**: API keys are never leaked to the client browser.
- **Right to Erasure**: Full one-click wipe for conversations and account deletion.

---

## 10. Future Roadmap

- **V2**: Emotion detection & longitudinal mood analytics
- **V3**: Personalized relaxation activities (guided breathing timer, somatic grounding)
- **V4**: Advanced safety and crisis routing engine
- **V5**: AI wellness summaries and personalized weekly reflections
- **V6**: Multilingual support (Tamil / English) + voice interaction
- **V7**: Advanced enterprise security hardening, HIPAA-conscious architecture, and offline sync
