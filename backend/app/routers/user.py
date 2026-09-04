from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])

@router.delete("/conversations", response_model=dict)
def delete_all_conversations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(models.ChatSession).filter(models.ChatSession.user_id == current_user.id).all()
    for s in sessions:
        db.delete(s)
    db.commit()
    return {"message": "All conversations permanently deleted"}

@router.delete("/account", response_model=dict)
def delete_account(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if user:
        db.delete(user)
        db.commit()
    return {"message": "Account and associated records deleted"}
