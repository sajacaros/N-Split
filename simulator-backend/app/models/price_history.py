import uuid
from sqlalchemy import Column, String, Numeric, DateTime, func, Index
from app.database import Base
from app.models.guid import GUID


class SimPriceHistory(Base):
    __tablename__ = "sim_price_history"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    stock_code = Column(String(10), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Indexes
    __table_args__ = (
        Index("idx_stock_timestamp", "stock_code", "timestamp"),
    )
