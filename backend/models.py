from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

class UserBase(MongoBaseModel):
    email: EmailStr
    full_name: str
    phone_number: str
    national_id: str
    role: str = "citizen"
    parent_role: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ComplaintBase(MongoBaseModel):
    title: str
    description: str
    category: str
    location: str
    status: str = "pending"
    priority: str = "medium"
    attachments: List[str] = []

class ComplaintCreate(ComplaintBase):
    pass

class Complaint(ComplaintBase):
    user_id: PyObjectId
    agency_id: Optional[PyObjectId] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class AgencyBase(MongoBaseModel):
    name: str
    description: str
    email: EmailStr
    phone_number: str
    address: str

class AgencyCreate(AgencyBase):
    pass

class Agency(AgencyBase):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow) 