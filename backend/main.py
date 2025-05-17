from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime

from database import engine, Base
from routers import users, complaints, agencies

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rwanda Citizen Engagement System API",
    description="API for managing citizen complaints and feedback",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(complaints.router)
app.include_router(agencies.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Rwanda Citizen Engagement System API",
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 