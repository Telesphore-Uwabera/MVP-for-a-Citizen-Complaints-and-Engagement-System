from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, List, Any
from models import User, UserCreate
from database import users_collection, convert_id
from bson import ObjectId
from .auth import (create_access_token,
                   authenticate_user,
                   get_password_hash,
                   ACCESS_TOKEN_EXPIRE_MINUTES,
                   get_current_user)
import logging
from pydantic import ValidationError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT Configuration
SECRET_KEY = "your-secret-key"  # Change this in production
ALGORITHM = "HS256"

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return convert_id(user)

@router.post("/register", response_model=User)
async def register_user(request: Request):
    try:
        body = await request.json()
        logger.info(f"Received registration request body: {body}")
        user = UserCreate(**body)
        logger.info(f"Pydantic validation successful for user: {user.email}")

        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user.email})
        if existing_user:
            logger.warning(f"Registration failed: User with email {user.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        existing_user_national_id = await users_collection.find_one({"national_id": user.national_id})
        if existing_user_national_id:
             logger.warning(f"Registration failed: User with national ID {user.national_id} already exists")
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="National ID already registered"
            )

        # Hash the password
        hashed_password = get_password_hash(user.password)
        user_dict = user.dict()
        user_dict["hashed_password"] = hashed_password
        del user_dict["password"] # Remove plain password

        # Insert the new user
        new_user = await users_collection.insert_one(user_dict)
        created_user = await users_collection.find_one({"_id": new_user.inserted_id})
        logger.info(f"User registered successfully with ID: {new_user.inserted_id}")
        return created_user
        
    except ValidationError as e:
        logger.error(f"Pydantic validation error during registration: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
    except Exception as e:
        logger.error(f"Error during user registration: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {e}"
        )

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user["_id"])}
        )
        logger.info(f"User logged in successfully: {form_data.username}")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error during user login: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {e}"
        )

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    try:
        logger.info(f"Fetching current user details for user ID: {current_user.get('_id')}")
        return current_user
    except Exception as e:
        logger.error(f"Error fetching current user details: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user details: {e}"
        )

@router.get("/users", response_model=List[User])
async def read_users(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Attempting to fetch all users for user ID: {current_user.get('_id')}")
        if current_user["role"] != "system_admin":
            logger.warning(f"User {current_user.get('_id')} attempted to access all users without system_admin role.")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view all users"
            )
        users = await users_collection.find().to_list(length=None)
        logger.info(f"Successfully fetched {len(users)} users.")
        return [convert_id(user) for user in users]
    except Exception as e:
        logger.error(f"Error fetching all users: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {e}"
        ) 