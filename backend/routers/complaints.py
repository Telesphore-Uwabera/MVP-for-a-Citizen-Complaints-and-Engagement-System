from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional
from datetime import datetime
from models import Complaint, ComplaintCreate
from database import complaints_collection, users_collection, agencies_collection, convert_id
from routers.users import get_current_user
from bson import ObjectId
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=Complaint)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        logger.info(f"Received complaint creation request from user: {current_user.get('_id')}")
        complaint_dict = complaint.dict()
        complaint_dict["user_id"] = ObjectId(current_user["_id"])
        complaint_dict["created_at"] = datetime.utcnow()
        complaint_dict["updated_at"] = datetime.utcnow()

        result = await complaints_collection.insert_one(complaint_dict)
        created_complaint = await complaints_collection.find_one({"_id": result.inserted_id})
        logger.info(f"Successfully created complaint with id: {result.inserted_id}")
        return convert_id(created_complaint)
    except Exception as e:
        logger.error(f"Error creating complaint: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while creating complaint: {e}")

@router.get("/", response_model=List[Complaint])
async def read_complaints(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None
):
    try:
        logger.info(f"Received request to read complaints for user: {current_user.get('_id')} with role: {current_user.get('role')}")
        query = {}

        # Filter by user role
        if current_user["role"] == "citizen":
            query["user_id"] = ObjectId(current_user["_id"])
        elif current_user["role"] == "agency_admin":
            agency = await agencies_collection.find_one({"admin_id": ObjectId(current_user["_id"])});
            if agency:
                query["agency_id"] = agency["_id"]
            else:
                # If agency admin is not linked to an agency, they see no complaints
                logger.info(f"Agency admin user {current_user.get('_id')} is not linked to an agency. Returning empty list.")
                return []

        # Filter by status if provided
        if status:
            query["status"] = status

        logger.info(f"Querying complaints collection with query: {query}")
        complaints = await complaints_collection.find(query).skip(skip).limit(limit).to_list(length=None)
        logger.info(f"Found {len(complaints)} complaints.")
        return [convert_id(complaint) for complaint in complaints]
    except Exception as e:
        logger.error(f"Error reading complaints: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while reading complaints: {e}")

@router.get("/{complaint_id}", response_model=Complaint)
async def read_complaint(
    complaint_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        logger.info(f"Received request to read complaint {complaint_id} for user: {current_user.get('_id')}")
        complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            logger.warning(f"Complaint {complaint_id} not found.")
            raise HTTPException(status_code=404, detail="Complaint not found")

        # Check authorization
        if current_user["role"] == "citizen" and str(complaint["user_id"]) != current_user["_id"]:
            logger.warning(f"User {current_user.get('_id')} is not authorized to view complaint {complaint_id}.")
            raise HTTPException(status_code=403, detail="Not authorized to view this complaint")

        logger.info(f"Successfully read complaint {complaint_id}.")
        return convert_id(complaint)
    except Exception as e:
        logger.error(f"Error reading complaint {complaint_id}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while reading complaint: {e}")

@router.put("/{complaint_id}", response_model=Complaint)
async def update_complaint(
    complaint_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        logger.info(f"Received request to update complaint {complaint_id} status to {status} for user: {current_user.get('_id')}")
        complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            logger.warning(f"Complaint {complaint_id} not found for update.")
            raise HTTPException(status_code=404, detail="Complaint not found")

        # Check authorization
        if current_user["role"] == "citizen" and str(complaint["user_id"]) != current_user["_id"]:
            logger.warning(f"User {current_user.get('_id')} is not authorized to update complaint {complaint_id}.")
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
        logger.info(f"Successfully updated complaint {complaint_id}.")
        return convert_id(updated_complaint)
    except Exception as e:
        logger.error(f"Error updating complaint {complaint_id}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while updating complaint: {e}")

@router.post("/{complaint_id}/assign")
async def assign_complaint(
    complaint_id: str,
    agency_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        logger.info(f"Received request to assign complaint {complaint_id} to agency {agency_id} for user: {current_user.get('_id')}")
        if current_user["role"] != "system_admin":
            logger.warning(f"User {current_user.get('_id')} is not authorized to assign complaints.")
            raise HTTPException(status_code=403, detail="Only system admin can assign complaints")

        complaint = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            logger.warning(f"Complaint {complaint_id} not found for assignment.")
            raise HTTPException(status_code=404, detail="Complaint not found")

        agency = await agencies_collection.find_one({"_id": ObjectId(agency_id)})
        if not agency:
            logger.warning(f"Agency {agency_id} not found for assignment.")
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

        logger.info(f"Successfully assigned complaint {complaint_id} to agency {agency_id}.")
        return {"message": "Complaint assigned successfully"}
    except Exception as e:
        logger.error(f"Error assigning complaint {complaint_id}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while assigning complaint: {e}") 