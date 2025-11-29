import uuid
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, func, Integer, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.guid import GUID


class SimStock(Base):
    __tablename__ = "sim_stocks"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    account_id = Column(GUID(), ForeignKey("sim_accounts.id", ondelete="CASCADE"), nullable=False)
    stock_code = Column(String(10), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    avg_buy_price = Column(Numeric(12, 2), nullable=False, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    account = relationship("SimAccount", back_populates="stocks")

    # Constraints
    __table_args__ = (
        UniqueConstraint('account_id', 'stock_code', name='uq_account_stock'),
    )
