from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional
from decimal import Decimal


class SessionEventBase(BaseModel):
    event_type: str
    position_id: Optional[UUID4] = None
    price: Optional[Decimal] = None
    quantity: Optional[int] = None
    message: Optional[str] = None


class SessionEventResponse(SessionEventBase):
    id: UUID4
    session_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True
