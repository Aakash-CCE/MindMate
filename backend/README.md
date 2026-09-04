# MindMate Backend Services

Backend infrastructure supporting MindMate's API, authentication, mood tracking, chat histories, and AI intelligence.

## Folder Structure
- `app/`: Python FastAPI service
  - `routers/`: API route controllers for authentication, chat, moods, and music
  - `services/`: AI integrations and business logic
  - `models.py`: Database models (PostgreSQL)
  - `schemas.py`: Pydantic validation schemas
  - `database.py`: Database connection and session management
  - `main.py`: FastAPI application entry point
- `server/`: Node.js Express API & WebSocket service
  - `api.ts`: Express REST endpoints for authentication, moods, chat sessions, and music
  - `db.ts`: SQLite / JSON file database persistence layer
  - `ai.ts`: Gemini model prompts and conversational intelligence
  - `live.ts`: Live WebSocket streaming audio server
  - `music.ts`: Ambient music generation handler
- `Dockerfile`: Container build configuration
- `requirements.txt`: Python package requirements
