import uuid
from sqlalchemy import Column, String, DateTime, Integer, Numeric, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Position(Base):
    __tablename__ = "positions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)

    # Position info
    step_number = Column(Integer, nullable=False)
    buy_price = Column(Numeric(12, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    buy_time = Column(DateTime(timezone=True), nullable=False)

    # Sell info
    sell_target_price = Column(Numeric(12, 2), nullable=False)
    sell_price = Column(Numeric(12, 2), nullable=True)
    sell_time = Column(DateTime(timezone=True), nullable=True)
    realized_profit = Column(Numeric(12, 2), nullable=True)

    # State
    status = Column(String(20), nullable=False, default="holding")  # holding, sold

    # Relationships
    session = relationship("Session", back_populates="positions")

    # Indexes
    __table_args__ = (
        Index("idx_session_status", "session_id", "status"),
        Index("idx_session_step_status", "session_id", "step_number", "status"),
    )
