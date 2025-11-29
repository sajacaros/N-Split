import uuid
from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, func, Text, Integer
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.guid import GUID


class SessionEvent(Base):
    __tablename__ = "session_events"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    session_id = Column(GUID(), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)

    # Event info
    event_type = Column(String(20), nullable=False)  # buy, sell, start, pause, resume, complete, error
    position_id = Column(GUID(), nullable=True)
    price = Column(Numeric(12, 2), nullable=True)
    quantity = Column(Integer, nullable=True)
    message = Column(Text, nullable=True)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    session = relationship("Session", back_populates="events")
