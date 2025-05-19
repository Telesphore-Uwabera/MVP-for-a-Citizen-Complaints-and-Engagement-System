from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection URL
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "citizen_complaints"

# Create MongoDB client
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Async client for async operations
async_client = AsyncIOMotorClient(MONGODB_URL)
async_db = async_client[DATABASE_NAME]

# Collections
users_collection = async_db.users
complaints_collection = async_db.complaints
agencies_collection = async_db.agencies

# Helper function to convert MongoDB _id to string
def convert_id(obj):
    if isinstance(obj, dict):
        if "_id" in obj:
            obj["_id"] = str(obj["_id"])
        for key, value in obj.items():
            obj[key] = convert_id(value)
    elif isinstance(obj, list):
        obj = [convert_id(item) for item in obj]
    return obj 