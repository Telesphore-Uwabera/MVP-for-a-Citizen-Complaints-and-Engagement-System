from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

import models
import schemas
from database import get_db
from auth import get_current_active_user

router = APIRouter(
    prefix="/complaints",
    tags=["complaints"]
)

@router.post("/", response_model=schemas.Complaint)
def create_complaint(
    complaint: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_complaint = models.Complaint(
        **complaint.dict(),
        submitter_id=current_user.id,
        status=models.ComplaintStatus.PENDING
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("/", response_model=List[schemas.Complaint])
def read_complaints(
    skip: int = 0,
    limit: int = 100,
    status: Optional[models.ComplaintStatus] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    query = db.query(models.Complaint)
    
    # Filter by status if provided
    if status:
        query = query.filter(models.Complaint.status == status)
    
    # Filter by category if provided
    if category:
        query = query.filter(models.Complaint.category == category)
    
    # If user is not admin, only show their complaints
    if current_user.role == models.UserRole.CITIZEN:
        query = query.filter(models.Complaint.submitter_id == current_user.id)
    
    # If user is agency admin, show complaints assigned to their agency
    elif current_user.role == models.UserRole.AGENCY_ADMIN:
        agency = db.query(models.Agency).filter(models.Agency.admin_id == current_user.id).first()
        if agency:
            query = query.filter(models.Complaint.assigned_agency_id == agency.id)
    
    complaints = query.offset(skip).limit(limit).all()
    return complaints

@router.get("/{complaint_id}", response_model=schemas.Complaint)
def read_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Check if user has permission to view this complaint
    if (current_user.role == models.UserRole.CITIZEN and 
        complaint.submitter_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this complaint")
    
    return complaint

@router.put("/{complaint_id}", response_model=schemas.Complaint)
def update_complaint(
    complaint_id: int,
    complaint_update: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Only allow updates from the submitter or agency admin
    if (current_user.role == models.UserRole.CITIZEN and 
        db_complaint.submitter_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this complaint")
    
    for key, value in complaint_update.dict().items():
        setattr(db_complaint, key, value)
    
    db_complaint.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.post("/{complaint_id}/responses", response_model=schemas.ComplaintResponse)
def create_complaint_response(
    complaint_id: int,
    response: schemas.ComplaintResponseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Check if user has permission to respond
    if (current_user.role == models.UserRole.CITIZEN and 
        complaint.submitter_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to respond to this complaint")
    
    db_response = models.ComplaintResponse(
        **response.dict(),
        responder_id=current_user.id
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response 