import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, mood, chat, user

# Create tables if database is available
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MindMate API",
    description="Backend service for MindMate AI-Powered Emotional Wellness Platform",
    version="1.0.0"
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(mood.router)
app.include_router(chat.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {
        "app": "MindMate API",
        "status": "healthy",
        "version": "1.0.0",
        "message": "Emotional Wellness & AI Companion Backend"
    }
