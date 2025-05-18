from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from backend.models import Agency, AgencyCreate
from backend.database import agencies_collection, users_collection, convert_id
from backend.routers.users import get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=Agency)
async def create_agency(
    agency: AgencyCreate,
    current_user: dict = Depends(get_current_user)
):
    # Only system admins can create agencies
    if current_user["role"] != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create agencies"
        )
    
    # Check if agency name already exists
    if await agencies_collection.find_one({"name": agency.name}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agency name already exists"
        )
    
    # Create agency
    agency_dict = agency.dict()
    agency_dict["created_at"] = datetime.utcnow()
    agency_dict["updated_at"] = datetime.utcnow()
    
    result = await agencies_collection.insert_one(agency_dict)
    created_agency = await agencies_collection.find_one({"_id": result.inserted_id})
    return convert_id(created_agency)

@router.get("/", response_model=List[Agency])
async def read_agencies(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    agencies = await agencies_collection.find().skip(skip).limit(limit).to_list(length=None)
    return [convert_id(agency) for agency in agencies]

@router.get("/{agency_id}", response_model=Agency)
async def read_agency(
    agency_id: str,
    current_user: dict = Depends(get_current_user)
):
    agency = await agencies_collection.find_one({"_id": ObjectId(agency_id)})
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )
    return convert_id(agency)

@router.put("/{agency_id}", response_model=Agency)
async def update_agency(
    agency_id: str,
    agency_update: AgencyCreate,
    current_user: dict = Depends(get_current_user)
):
    # Only system admins and agency admins can update agencies
    if current_user["role"] not in ["system_admin", "agency_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update agencies"
        )
    
    agency = await agencies_collection.find_one({"_id": ObjectId(agency_id)})
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )
    
    # If agency admin, can only update their own agency
    if (current_user["role"] == "agency_admin" and
        str(agency.get("admin_id")) != current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this agency"
        )
    
    update_data = agency_update.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await agencies_collection.update_one(
        {"_id": ObjectId(agency_id)},
        {"$set": update_data}
    )
    
    updated_agency = await agencies_collection.find_one({"_id": ObjectId(agency_id)})
    return convert_id(updated_agency)

@router.delete("/{agency_id}")
async def delete_agency(
    agency_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Only system admins can delete agencies
    if current_user["role"] != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete agencies"
        )
    
    agency = await agencies_collection.find_one({"_id": ObjectId(agency_id)})
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )
    
    await agencies_collection.delete_one({"_id": ObjectId(agency_id)})
    return {"message": "Agency deleted successfully"} 