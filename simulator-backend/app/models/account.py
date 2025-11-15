import uuid
from sqlalchemy import Column, String, Numeric, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.config import settings


class SimAccount(Base):
    __tablename__ = "sim_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False, index=True)
    cash = Column(Numeric(12, 2), nullable=False, default=settings.DEFAULT_INITIAL_CASH)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    orders = relationship("SimOrder", back_populates="account", cascade="all, delete-orphan")
    stocks = relationship("SimStock", back_populates="account", cascade="all, delete-orphan")
