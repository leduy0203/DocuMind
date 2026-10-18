from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

# Schema for User Registration request
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

# Schema for User Login request
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for User Response
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for Login/Token Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
