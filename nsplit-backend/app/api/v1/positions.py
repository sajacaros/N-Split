from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.models.position import Position
from app.models.session import Session as SessionModel
from app.schemas.position import PositionResponse
from app.dependencies import get_current_user, verify_resource_ownership

router = APIRouter(prefix="/positions", tags=["positions"])


@router.get("/session/{session_id}", response_model=List[PositionResponse])
async def list_positions_by_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all positions for a session"""
    # Verify session exists and belongs to user
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)

    positions = db.query(Position).filter(
        Position.session_id == session_id
    ).order_by(Position.step_number).all()

    return positions


@router.get("/{position_id}", response_model=PositionResponse)
async def get_position(
    position_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get position details"""
    position = db.query(Position).filter(Position.id == position_id).first()

    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found",
        )

    # Verify session belongs to user
    session = db.query(SessionModel).filter(SessionModel.id == position.session_id).first()
    verify_resource_ownership(session.user_id, current_user)

    return position
