
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from typing import Dict, List

# Constants for model paths
MODEL_DIR = "models"
YIELD_MODEL_PATH = os.path.join(MODEL_DIR, "yield_model.pkl")
HEALTH_MODEL_PATH = os.path.join(MODEL_DIR, "health_model.pkl")

# Mappings for categorical features
CROP_TYPE_MAP = {
    'wheat': 0, 'rice': 1, 'corn': 2, 'soybean': 3, 'cotton': 4, 'sugarcane': 5
}

SOIL_TYPE_MAP = {
    'loamy': 0, 'sandy': 1, 'clay': 2, 'silt': 3, 'peaty': 4, 'chalky': 5
}

# Feature engineering function
def process_features(crop_data):
    # Extract features from input data
    features = [
        CROP_TYPE_MAP.get(crop_data.cropType.lower(), 0),
        SOIL_TYPE_MAP.get(crop_data.soilType.lower(), 0),
        crop_data.fieldSize,
        crop_data.soilPH,
        crop_data.nitrogenLevel,
        crop_data.phosphorusLevel,
        crop_data.potassiumLevel,
        1 if crop_data.irrigationSystem else 0
    ]
    return np.array(features).reshape(1, -1)

# Generate synthetic training data
def generate_training_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate random features
    crop_types = np.random.randint(0, 6, n_samples)
    soil_types = np.random.randint(0, 6, n_samples)
    field_sizes = np.random.uniform(0.1, 100, n_samples)
    soil_ph = np.random.uniform(3.5, 9.5, n_samples)
    nitrogen = np.random.uniform(0, 100, n_samples)
    phosphorus = np.random.uniform(0, 100, n_samples)
    potassium = np.random.uniform(0, 100, n_samples)
    irrigation = np.random.randint(0, 2, n_samples)
    
    # Combine features
    X = np.column_stack([crop_types, soil_types, field_sizes, soil_ph, 
                         nitrogen, phosphorus, potassium, irrigation])
    
    # Generate synthetic target variables using simplified agricultural relationships
    
    # Base yields by crop type (tons per hectare)
    base_yields = np.array([4.5, 5.2, 9.8, 3.2, 2.8, 75.0])
    crop_base_yields = base_yields[crop_types]
    
    # Optimal pH is around 6.5-7.0
    ph_factor = 1 - np.abs(soil_ph - 6.8) / 10
    
    # Nutrient factor (NPK)
    nutrient_factor = (nitrogen + phosphorus + potassium) / 300
    
    # Calculate yield
    y_yield = crop_base_yields * ph_factor * nutrient_factor * field_sizes
    
    # Calculate health score (0-100)
    base_health = 70 + np.random.normal(0, 5, n_samples)
    y_health = np.clip(base_health * ph_factor * nutrient_factor, 0, 100)
    
    # Return the dataset
    return X, y_yield, y_health

# Train the predictive models
def train_model():
    # Create model directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Generate training data
    X, y_yield, y_health = generate_training_data()
    
    # Train yield model
    yield_model = RandomForestRegressor(n_estimators=100, random_state=42)
    yield_model.fit(X, y_yield)
    joblib.dump(yield_model, YIELD_MODEL_PATH)
    
    # Train health model
    health_model = RandomForestRegressor(n_estimators=100, random_state=42)
    health_model.fit(X, y_health)
    joblib.dump(health_model, HEALTH_MODEL_PATH)
    
    print("Models trained successfully!")

# Generate recommendations based on crop data
def generate_recommendations(crop_data):
    recommendations = []
    risk_factors = []
    
    if crop_data.soilPH < 5.5:
        recommendations.append('Apply lime to increase soil pH.')
        risk_factors.append('Low soil pH may limit nutrient availability.')
    elif crop_data.soilPH > 7.5:
        recommendations.append('Consider adding sulfur to decrease soil pH.')
        risk_factors.append('High soil pH may cause micronutrient deficiencies.')
    
    if crop_data.nitrogenLevel < 30:
        recommendations.append('Increase nitrogen application.')
        risk_factors.append('Nitrogen deficiency may limit growth.')
    
    if crop_data.phosphorusLevel < 20:
        recommendations.append('Increase phosphorus application.')
        risk_factors.append('Phosphorus deficiency may affect flowering and fruiting.')
    
    if crop_data.potassiumLevel < 20:
        recommendations.append('Increase potassium application.')
        risk_factors.append('Potassium deficiency may reduce disease resistance.')
    
    if not crop_data.irrigationSystem:
        recommendations.append('Consider implementing an irrigation system.')
    
    return (
        recommendations if recommendations else ['No specific recommendations at this time.'],
        risk_factors if risk_factors else ['No significant risk factors identified.']
    )

# Make predictions using the trained models
def predict_crop_data(crop_data):
    # Check if models exist, train if not
    if not (os.path.exists(YIELD_MODEL_PATH) and os.path.exists(HEALTH_MODEL_PATH)):
        train_model()
    
    # Load the models
    yield_model = joblib.load(YIELD_MODEL_PATH)
    health_model = joblib.load(HEALTH_MODEL_PATH)
    
    # Process features
    features = process_features(crop_data)
    
    # Make predictions
    yield_prediction = float(yield_model.predict(features)[0])
    health_score = float(health_model.predict(features)[0])
    
    # Generate recommendations
    recommendations, risk_factors = generate_recommendations(crop_data)
    
    # Return prediction results
    return {
        "yieldPrediction": round(yield_prediction, 2),
        "healthScore": round(health_score, 1),
        "recommendations": recommendations,
        "riskFactors": risk_factors
    }
