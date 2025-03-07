from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import routers
from app.routers import measurements

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="InBody Measurement API",
    description="API for processing and storing InBody measurement data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(measurements.router, prefix="/api/measurements", tags=["measurements"])

@app.get("/")
async def root():
    """Root endpoint to check if the API is running."""
    return {"message": "InBody Measurement API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
