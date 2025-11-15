from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: str
    profile_picture_url: Optional[str] = None


class UserCreate(UserBase):
    google_id: str


class UserResponse(UserBase):
    id: UUID4
    google_id: str
    created_at: datetime
    last_login_at: datetime

    class Config:
        from_attributes = True
