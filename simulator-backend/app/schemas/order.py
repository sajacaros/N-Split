from pydantic import BaseModel, UUID4
from datetime import datetime
from decimal import Decimal


class OrderCreate(BaseModel):
    user_id: str
    stock_code: str
    price: float
    quantity: int


class OrderResponse(BaseModel):
    id: UUID4
    account_id: UUID4
    stock_code: str
    order_type: str
    price: Decimal
    quantity: int
    status: str
    executed_at: datetime

    class Config:
        from_attributes = True
