from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.models.session import Session as SessionModel
from app.models.session_event import SessionEvent
from app.schemas.session import SessionCreate, SessionUpdate, SessionResponse, SessionDetailResponse
from app.schemas.session_event import SessionEventResponse
from app.dependencies import get_current_user, verify_resource_ownership

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new trading session"""
    session = SessionModel(
        user_id=current_user.id,
        **session_data.model_dump()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("", response_model=List[SessionResponse])
async def list_sessions(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all sessions for current user with optional status filter"""
    query = db.query(SessionModel).filter(SessionModel.user_id == current_user.id)

    if status_filter:
        query = query.filter(SessionModel.status == status_filter)

    sessions = query.order_by(SessionModel.created_at.desc()).all()
    return sessions


@router.get("/{session_id}", response_model=SessionDetailResponse)
async def get_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get session details with positions"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)
    return session


@router.patch("/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: UUID,
    session_data: SessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update session (only allowed in 'ready' status)"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)

    if session.status != "ready":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only update sessions in 'ready' status",
        )

    # Update fields
    update_data = session_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete session (only allowed in 'ready' status)"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)

    if session.status != "ready":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only delete sessions in 'ready' status",
        )

    db.delete(session)
    db.commit()
    return None


@router.post("/{session_id}/start", response_model=SessionResponse)
async def start_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Start or resume a session"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)

    if session.status not in ["ready", "paused"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot start session in '{session.status}' status",
        )

    # Update status
    previous_status = session.status
    session.status = "running"

    if previous_status == "ready":
        session.started_at = datetime.utcnow()
        event_type = "start"
    else:
        event_type = "resume"

    # Log event
    event = SessionEvent(
        session_id=session.id,
        event_type=event_type,
        message=f"Session {event_type}ed",
    )
    db.add(event)

    db.commit()
    db.refresh(session)
    return session


@router.post("/{session_id}/pause", response_model=SessionResponse)
async def pause_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Pause a running session"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)

    if session.status != "running":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only pause running sessions",
        )

    session.status = "paused"

    # Log event
    event = SessionEvent(
        session_id=session.id,
        event_type="pause",
        message="Session paused",
    )
    db.add(event)

    db.commit()
    db.refresh(session)
    return session


@router.get("/{session_id}/events", response_model=List[SessionEventResponse])
async def get_session_events(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get session event timeline"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    verify_resource_ownership(session.user_id, current_user)

    events = db.query(SessionEvent).filter(
        SessionEvent.session_id == session_id
    ).order_by(SessionEvent.created_at.desc()).all()

    return events
