from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional, List
from decimal import Decimal


class SessionBase(BaseModel):
    stock_code: str = Field(..., min_length=6, max_length=10)
    stock_name: str = Field(..., min_length=1, max_length=100)
    initial_buy_price: Optional[Decimal] = None
    amount_per_step: Decimal = Field(..., gt=0)
    max_steps: int = Field(..., ge=1, le=10)
    sell_trigger_pct: Decimal = Field(..., ge=1, le=20)
    buy_trigger_pct: Decimal = Field(..., ge=1, le=20)


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    stock_code: Optional[str] = Field(None, min_length=6, max_length=10)
    stock_name: Optional[str] = Field(None, min_length=1, max_length=100)
    initial_buy_price: Optional[Decimal] = None
    amount_per_step: Optional[Decimal] = Field(None, gt=0)
    max_steps: Optional[int] = Field(None, ge=1, le=10)
    sell_trigger_pct: Optional[Decimal] = Field(None, ge=1, le=20)
    buy_trigger_pct: Optional[Decimal] = Field(None, ge=1, le=20)


class SessionResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    stock_code: str
    stock_name: str
    initial_buy_price: Optional[Decimal]
    amount_per_step: Decimal
    max_steps: int
    sell_trigger_pct: Decimal
    buy_trigger_pct: Decimal
    status: str
    current_step: int
    first_buy_price: Optional[Decimal]
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class SessionDetailResponse(SessionResponse):
    positions: List["PositionResponse"] = []

    class Config:
        from_attributes = True


# Forward reference resolution
from app.schemas.position import PositionResponse
SessionDetailResponse.model_rebuild()
