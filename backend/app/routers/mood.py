from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/moods", tags=["moods"])

@router.get("", response_model=dict)
def get_user_moods(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    moods = (
        db.query(models.MoodEntry)
        .filter(models.MoodEntry.user_id == current_user.id)
        .order_by(models.MoodEntry.created_at.desc())
        .all()
    )
    return {"moods": moods}

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_mood_entry(
    mood_in: schemas.MoodCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = models.MoodEntry(
        user_id=current_user.id,
        mood=mood_in.mood,
        intensity=mood_in.intensity,
        note=mood_in.note
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"message": "Mood recorded", "mood": entry}

@router.delete("/{mood_id}", response_model=dict)
def delete_mood_entry(
    mood_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(models.MoodEntry).filter(
        models.MoodEntry.id == mood_id,
        models.MoodEntry.user_id == current_user.id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Mood entry not found or unauthorized")

    db.delete(entry)
    db.commit()
    return {"message": "Mood entry deleted"}
