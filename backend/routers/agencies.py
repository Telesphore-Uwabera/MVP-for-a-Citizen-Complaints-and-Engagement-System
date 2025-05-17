from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db
from auth import get_current_active_user

router = APIRouter(
    prefix="/agencies",
    tags=["agencies"]
)

@router.post("/", response_model=schemas.Agency)
def create_agency(
    agency: schemas.AgencyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Only system admins can create agencies
    if current_user.role != models.UserRole.SYSTEM_ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to create agencies")
    
    # Check if agency name already exists
    db_agency = db.query(models.Agency).filter(models.Agency.name == agency.name).first()
    if db_agency:
        raise HTTPException(status_code=400, detail="Agency name already exists")
    
    # Check if admin user exists and is an agency admin
    admin_user = db.query(models.User).filter(models.User.id == agency.admin_id).first()
    if not admin_user or admin_user.role != models.UserRole.AGENCY_ADMIN:
        raise HTTPException(status_code=400, detail="Invalid admin user")
    
    db_agency = models.Agency(**agency.dict())
    db.add(db_agency)
    db.commit()
    db.refresh(db_agency)
    return db_agency

@router.get("/", response_model=List[schemas.Agency])
def read_agencies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    agencies = db.query(models.Agency).offset(skip).limit(limit).all()
    return agencies

@router.get("/{agency_id}", response_model=schemas.Agency)
def read_agency(
    agency_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    agency = db.query(models.Agency).filter(models.Agency.id == agency_id).first()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")
    return agency

@router.put("/{agency_id}", response_model=schemas.Agency)
def update_agency(
    agency_id: int,
    agency_update: schemas.AgencyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Only system admins and agency admins can update agencies
    if current_user.role not in [models.UserRole.SYSTEM_ADMIN, models.UserRole.AGENCY_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to update agencies")
    
    # If agency admin, can only update their own agency
    if (current_user.role == models.UserRole.AGENCY_ADMIN and
        current_user.id != agency_update.admin_id):
        raise HTTPException(status_code=403, detail="Not authorized to update this agency")
    
    db_agency = db.query(models.Agency).filter(models.Agency.id == agency_id).first()
    if not db_agency:
        raise HTTPException(status_code=404, detail="Agency not found")
    
    for key, value in agency_update.dict().items():
        setattr(db_agency, key, value)
    
    db.commit()
    db.refresh(db_agency)
    return db_agency

@router.delete("/{agency_id}")
def delete_agency(
    agency_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Only system admins can delete agencies
    if current_user.role != models.UserRole.SYSTEM_ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to delete agencies")
    
    db_agency = db.query(models.Agency).filter(models.Agency.id == agency_id).first()
    if not db_agency:
        raise HTTPException(status_code=404, detail="Agency not found")
    
    db.delete(db_agency)
    db.commit()
    return {"message": "Agency deleted successfully"} 