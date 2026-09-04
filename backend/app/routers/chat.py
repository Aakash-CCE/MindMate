from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user
from app.services.ai_service import generate_response

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.get("/sessions", response_model=dict)
def get_sessions(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = (
        db.query(models.ChatSession)
        .filter(models.ChatSession.user_id == current_user.id)
        .order_by(models.ChatSession.updated_at.desc())
        .all()
    )
    return {"sessions": sessions}

@router.post("/sessions", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_session(
    session_in: schemas.SessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = models.ChatSession(
        user_id=current_user.id,
        title=session_in.title or "New Conversation"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"session": session}

@router.get("/sessions/{session_id}", response_model=dict)
def get_session(
    session_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Conversation session not found")

    messages = (
        db.query(models.Message)
        .filter(models.Message.session_id == session.id)
        .order_by(models.Message.created_at.asc())
        .all()
    )
    return {"session": session, "messages": messages}

@router.post("/sessions/{session_id}/messages", response_model=dict)
async def send_message(
    session_id: str,
    msg_in: schemas.MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Conversation session not found")

    # Save user message
    user_msg = models.Message(
        session_id=session.id,
        role="user",
        content=msg_in.content.strip()
    )
    db.add(user_msg)

    # If first message or default title, update title
    if session.title == "New Conversation":
        words = msg_in.content.strip().split()[:5]
        session.title = " ".join(words).capitalize()

    # Load history for AI
    existing = (
        db.query(models.Message)
        .filter(models.Message.session_id == session.id)
        .order_by(models.Message.created_at.asc())
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in existing]

    # Generate AI response
    ai_text = await generate_response(history, msg_in.content.strip())

    # Save AI response
    assistant_msg = models.Message(
        session_id=session.id,
        role="assistant",
        content=ai_text
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(user_msg)
    db.refresh(assistant_msg)

    return {
        "userMessage": user_msg,
        "assistantMessage": assistant_msg
    }

@router.delete("/sessions/{session_id}", response_model=dict)
def delete_session(
    session_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found or unauthorized")

    db.delete(session)
    db.commit()
    return {"message": "Conversation deleted"}
