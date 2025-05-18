import asyncio
from database import users_collection
from passlib.context import CryptContext
from datetime import datetime
import sys

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def create_superuser(email: str, password: str, full_name: str, phone_number: str, national_id: str):
    try:
        # Check if user already exists
        if await users_collection.find_one({"email": email}):
            print(f"User with email {email} already exists.")
            return

        # Create superuser
        user = {
            "email": email,
            "hashed_password": get_password_hash(password),
            "full_name": full_name,
            "phone_number": phone_number,
            "national_id": national_id,
            "role": "system_admin",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await users_collection.insert_one(user)
        print(f"Superuser created successfully with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Error creating superuser: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("Usage: python create_superuser.py <email> <password> <full_name> <phone_number> <national_id>")
        sys.exit(1)
    
    email, password, full_name, phone_number, national_id = sys.argv[1:]
    asyncio.run(create_superuser(email, password, full_name, phone_number, national_id)) 