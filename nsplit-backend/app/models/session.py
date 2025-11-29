import uuid
from sqlalchemy import Column, String, DateTime, Integer, Numeric, ForeignKey, func, Index
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.guid import GUID


class Session(Base):
    __tablename__ = "sessions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Stock info
    stock_code = Column(String(10), nullable=False)
    stock_name = Column(String(100), nullable=False)

    # Strategy settings
    initial_buy_price = Column(Numeric(12, 2), nullable=True)  # null = current price
    amount_per_step = Column(Numeric(12, 2), nullable=False)
    max_steps = Column(Integer, nullable=False)
    sell_trigger_pct = Column(Numeric(5, 2), nullable=False)
    buy_trigger_pct = Column(Numeric(5, 2), nullable=False)

    # State
    status = Column(String(20), nullable=False, default="ready")  # ready, running, paused, completed
    current_step = Column(Integer, nullable=False, default=0)
    first_buy_price = Column(Numeric(12, 2), nullable=True)  # Actual first buy price

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")
    positions = relationship("Position", back_populates="session", cascade="all, delete-orphan")
    events = relationship("SessionEvent", back_populates="session", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_user_status", "user_id", "status"),
        Index("idx_status", "status"),
    )
