
# CropSage Backend

This is the FastAPI backend for the CropSage agricultural monitoring and prediction system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the API server:
```bash
python main.py
```

The server will be available at http://localhost:8000

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/predict` - Get crop predictions based on input data
- `POST /api/login` - User authentication

## Machine Learning Model

The system uses a Random Forest Regressor trained on synthetic agricultural data to predict:
- Crop yield
- Crop health score

It also provides recommendations and risk assessments based on the input parameters.

## Demo Credentials

- Email: demo@cropsage.com
- Password: password123
