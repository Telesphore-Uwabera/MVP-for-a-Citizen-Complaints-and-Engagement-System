from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class ComplaintStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    AGENCY_ADMIN = "agency_admin"
    SYSTEM_ADMIN = "system_admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    phone_number = Column(String)
    national_id = Column(String, unique=True)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaints = relationship("Complaint", back_populates="submitter")
    agency = relationship("Agency", back_populates="admin")

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    contact_email = Column(String)
    contact_phone = Column(String)
    admin_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    admin = relationship("User", back_populates="agency")
    complaints = relationship("Complaint", back_populates="assigned_agency")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.PENDING)
    priority = Column(Integer, default=1)  # 1-5 scale
    submitter_id = Column(Integer, ForeignKey("users.id"))
    assigned_agency_id = Column(Integer, ForeignKey("agencies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    submitter = relationship("User", back_populates="complaints")
    assigned_agency = relationship("Agency", back_populates="complaints")
    responses = relationship("ComplaintResponse", back_populates="complaint")

class ComplaintResponse(Base):
    __tablename__ = "complaint_responses"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    responder_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaint = relationship("Complaint", back_populates="responses")
    responder = relationship("User") 