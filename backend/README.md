# Backend API

Flask-based API server that integrates with HuggingFace-hosted ML model for nuclear reactor risk prediction.

## Setup

1. Install Python dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your HuggingFace model URL:
```
HUGGINGFACE_MODEL_URL=https://huggingface.co/your-username/your-model/resolve/main/model.pickle
```

3. Run the server:
```bash
cd api
python app.py
```

The API will be available at http://localhost:5000

## API Endpoints

### POST /api/predict
Accepts simulation data and returns risk predictions.

**Request Body:**
```json
{
  "reactor_age_years": 25,
  "reactor_type_code": "PWR",
  "core_temp_c": 310,
  "coolant_pressure_bar": 155,
  "maintenance_score": 75,
  ...
}
```

**Response:**
```json
{
  "incident_occurred": false,
  "true_risk_level": 1,
  "avalon_evac_recommendation": false,
  "avalon_shutdown_recommendation": false,
  "human_override": false,
  "top_contributors": [
    {
      "feature": "core_temp_c",
      "impact": 0.92,
      "value": 310
    }
  ],
  "incident_type": "Normal Operation",
  "confidence": 0.87
}
```

### GET /health
Health check endpoint.

### GET /api/model-info
Returns information about the loaded model.

## Deployment

For production deployment with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app
```
