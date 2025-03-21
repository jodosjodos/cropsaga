
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import os
from ml_model import train_model, predict_crop_data

# Initialize FastAPI app
app = FastAPI(title="CropSage API", 
              description="API for agricultural monitoring and prediction")

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CropData(BaseModel):
    fieldName: str
    cropType: str
    soilType: str
    fieldSize: float
    soilPH: float
    nitrogenLevel: float
    phosphorusLevel: float
    potassiumLevel: float
    irrigationSystem: Optional[str] = None

class PredictionResult(BaseModel):
    yieldPrediction: float
    healthScore: float
    recommendations: List[str]
    riskFactors: List[str]

# Ensure model is trained on startup
@app.on_event("startup")
async def startup_event():
    train_model()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to CropSage API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Prediction endpoint
@app.post("/api/predict", response_model=PredictionResult)
def predict(crop_data: CropData):
    try:
        # Process the input data and run prediction
        prediction = predict_crop_data(crop_data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# User mock data (in a real app, this would use a database)
users = {
    "demo@cropsage.com": {
        "password": "password123",
        "name": "Demo Farmer"
    }
}

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    email: str
    name: str

# Login endpoint
@app.post("/api/login")
def login(user_data: UserLogin):
    if user_data.email in users and users[user_data.email]["password"] == user_data.password:
        return {
            "success": True,
            "user": {
                "email": user_data.email,
                "name": users[user_data.email]["name"]
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
