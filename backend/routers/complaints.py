from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional
from datetime import datetime
from models import Complaint, ComplaintCreate
from database import complaints_collection, users_collection, agencies_collection, convert_id
from routers.users import get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=Complaint)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: dict = Depends(get_current_user)
):
    complaint_dict = complaint.dict()
    complaint_dict["user_id"] = ObjectId(current_user["_id"])
    complaint_dict["created_at"] = datetime.utcnow()
    complaint_dict["updated_at"] = datetime.utcnow()
    
    result = await complaints_collection.insert_one(complaint_dict)
    created_complaint = await complaints_collection.find_one({"_id": result.inserted_id})
    return convert_id(created_complaint)

@router.get("/", response_model=List[Complaint])
async def read_complaints(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None
):
    query = {}
    
    # Filter by user role
    if current_user["role"] == "citizen":
        query["user_id"] = ObjectId(current_user["_id"])
    elif current_user["role"] == "agency_admin":
        agency = await agencies_collection.find_one({"admin_id": ObjectId(current_user["_id"])})
        if agency:
            query["agency_id"] = agency["_id"]
    
    # Filter by status if provided
    if status:
        query["status"] = status
    
    complaints = await complaints_collection.find(query).skip(skip).limit(limit).to_list(length=None)
    return [convert_id(complaint) for complaint in complaints]

@router.get("/{complaint_id}", response_model=Complaint)
async def read_complaint(
    complaint_id: str,
    current_user: dict = Depends(get_current_user)
):
    complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Check authorization
    if current_user["role"] == "citizen" and str(complaint["user_id"]) != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this complaint")
    
    return convert_id(complaint)

@router.put("/{complaint_id}", response_model=Complaint)
async def update_complaint(
    complaint_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Check authorization
    if current_user["role"] == "citizen" and str(complaint["user_id"]) != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this complaint")
    
    # Update complaint
    update_data = {
        "status": status,
        "updated_at": datetime.utcnow()
    }
    if status == "resolved":
        update_data["resolved_at"] = datetime.utcnow()
    
    await complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": update_data}
    )
    
    updated_complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
    return convert_id(updated_complaint)

@router.post("/{complaint_id}/assign")
async def assign_complaint(
    complaint_id: str,
    agency_id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "system_admin":
        raise HTTPException(status_code=403, detail="Only system admin can assign complaints")
    
    complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    agency = await agencies_collection.find_one({"_id": ObjectId(agency_id)})
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")
    
    await complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {
            "$set": {
                "agency_id": ObjectId(agency_id),
                "status": "in_progress",
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Complaint assigned successfully"} 