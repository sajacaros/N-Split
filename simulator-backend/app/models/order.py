import uuid
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, func, Integer
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.guid import GUID


class SimOrder(Base):
    __tablename__ = "sim_orders"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    account_id = Column(GUID(), ForeignKey("sim_accounts.id", ondelete="CASCADE"), nullable=False)
    stock_code = Column(String(10), nullable=False)
    order_type = Column(String(10), nullable=False)  # buy, sell
    price = Column(Numeric(12, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="filled")  # filled (instant execution)
    executed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    account = relationship("SimAccount", back_populates="orders")
