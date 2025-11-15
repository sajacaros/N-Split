from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


class PriceResponse(BaseModel):
    stock_code: str
    price: Decimal
    timestamp: datetime


class PriceHistoryResponse(BaseModel):
    stock_code: str
    price: Decimal
    timestamp: datetime

    class Config:
        from_attributes = True
