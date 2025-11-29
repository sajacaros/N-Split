import uuid
from sqlalchemy import Column, String, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base
from app.config import settings
from app.models.guid import GUID


class SimAccount(Base):
    __tablename__ = "sim_accounts"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), unique=True, nullable=False, index=True)
    cash = Column(Numeric(12, 2), nullable=False, default=settings.DEFAULT_INITIAL_CASH)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    orders = relationship("SimOrder", back_populates="account", cascade="all, delete-orphan")
    stocks = relationship("SimStock", back_populates="account", cascade="all, delete-orphan")
