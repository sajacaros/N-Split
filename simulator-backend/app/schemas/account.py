from pydantic import BaseModel, UUID4
from datetime import datetime
from decimal import Decimal
from typing import List, Optional


class AccountCreate(BaseModel):
    user_id: str


class StockHolding(BaseModel):
    stock_code: str
    quantity: int
    avg_buy_price: Decimal

    class Config:
        from_attributes = True


class AccountResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    cash: Decimal
    stocks: List[StockHolding] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
