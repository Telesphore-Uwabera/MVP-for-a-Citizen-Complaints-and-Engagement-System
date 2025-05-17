from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import ComplaintStatus, UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: str
    national_id: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AgencyBase(BaseModel):
    name: str
    description: str
    contact_email: EmailStr
    contact_phone: str

class AgencyCreate(AgencyBase):
    admin_id: int

class Agency(AgencyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str
    priority: Optional[int] = 1

class ComplaintCreate(ComplaintBase):
    pass

class Complaint(ComplaintBase):
    id: int
    status: ComplaintStatus
    submitter_id: int
    assigned_agency_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ComplaintResponseBase(BaseModel):
    message: str

class ComplaintResponseCreate(ComplaintResponseBase):
    complaint_id: int

class ComplaintResponse(ComplaintResponseBase):
    id: int
    complaint_id: int
    responder_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 