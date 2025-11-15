from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional
from decimal import Decimal


class PositionBase(BaseModel):
    step_number: int
    buy_price: Decimal
    quantity: int
    sell_target_price: Decimal


class PositionResponse(PositionBase):
    id: UUID4
    session_id: UUID4
    buy_time: datetime
    sell_price: Optional[Decimal]
    sell_time: Optional[datetime]
    realized_profit: Optional[Decimal]
    status: str

    class Config:
        from_attributes = True
