
import { toast } from "sonner";

export interface CropData {
  fieldName: string;
  cropType: string;
  soilType: string;
  fieldSize: number;
  soilPH: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  irrigationSystem?: string;
}

export interface PredictionResult {
  yieldPrediction: number;
  healthScore: number;
  recommendations: string[];
  riskFactors: string[];
}

// API base URL
const API_URL = "http://localhost:8000";

// Function to predict crop yield and health
export const predictCropYield = async (cropData: CropData): Promise<PredictionResult> => {
  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cropData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get prediction");
    }

    return await response.json();
  } catch (error) {
    console.error("Prediction error:", error);
    toast.error("Could not connect to the prediction service. Using mock data instead.");
    
    // Return mock data if API is unavailable
    return {
      yieldPrediction: Math.round(Math.random() * 40 + 60),
      healthScore: Math.round(Math.random() * 30 + 70),
      recommendations: [
        "Consider increasing nitrogen application by 10%",
        "Monitor soil moisture levels during the next growth stage",
        "Implement pest control measures within the next two weeks"
      ],
      riskFactors: [
        "Potential phosphorus deficiency",
        "Risk of drought stress if rainfall remains below average",
        "Possible pest pressure due to recent weather conditions"
      ]
    };
  }
};

// Function to handle user login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
