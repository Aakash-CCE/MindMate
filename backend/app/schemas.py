from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User schemas
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    message: str
    token: str
    user: UserResponse

# Mood schemas
class MoodCreate(BaseModel):
    mood: str = Field(..., regex="^(happy|calm|okay|sad|anxious|stressed|lonely|angry)$")
    intensity: int = Field(..., ge=1, le=10)
    note: Optional[str] = None

class MoodResponse(BaseModel):
    id: str
    user_id: str
    mood: str
    intensity: int
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Chat schemas
class SessionCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)

class MessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SessionDetailResponse(BaseModel):
    session: SessionResponse
    messages: List[MessageResponse]
