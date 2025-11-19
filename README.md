# Nuclear Reactor Risk Analysis System

An AI-powered nuclear reactor monitoring and risk prediction system built for the Avalon Nuclear Safety Challenge. This project analyzes nuclear power plant data to predict safety incidents and provide real-time risk assessments.

## Overview

This application combines machine learning with an interactive dashboard to help operators make better decisions in nuclear AI crisis scenarios. It uses the `avalon_nuclear.csv` dataset containing data from European nuclear power plants to predict incidents, risk levels, and generate evacuation/shutdown recommendations.

### Key Features

- **Real-time Risk Monitoring**: Interactive dashboard displaying reactor parameters and status
- **ML-Powered Predictions**: Backend API integrated with HuggingFace-hosted ML models
- **Visual Analytics**: Comprehensive visualization of plant status and risk factors
- **Feature Importance**: Identifies top contributing factors to risk predictions
- **Graceful Degradation**: Falls back to mock data if backend is unavailable

## Technologies Used

**Frontend:**
- React + TypeScript
- Vite
- shadcn-ui components
- Tailwind CSS
- React Query for API state management

**Backend:**
- Python Flask
- HuggingFace model integration
- NumPy & Pandas for data processing
- CORS-enabled REST API

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- A trained ML model hosted on HuggingFace (pickle format)

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run at **http://localhost:5173**

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your HUGGINGFACE_MODEL_URL

# Start server
cd api
python app.py
```

Backend API will run at **http://localhost:5000**

### 3. Configure HuggingFace Model

Edit `backend/.env`:
```
HUGGINGFACE_MODEL_URL=https://huggingface.co/your-username/your-model/resolve/main/model.pickle
```

## Project Structure

```
.
├── src/                          # Frontend application
│   ├── components/              # UI components
│   ├── pages/                   # Page components
│   ├── services/
│   │   └── api.ts              # Backend API integration
│   └── types/
│       └── simulation.ts       # TypeScript interfaces
│
├── backend/                     # Backend API
│   ├── api/
│   │   └── app.py              # Flask server + ML integration
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Configuration
│
├── avalon_nuclear.csv          # Training dataset (37 features)
├── CLAUDE.md                   # Detailed project documentation
└── README.txt                  # Original challenge description
```

## API Endpoints

### `POST /api/predict`
Accepts reactor simulation data and returns risk predictions.

**Request:**
```json
{
  "reactor_age_years": 25,
  "reactor_type_code": "PWR",
  "core_temp_c": 310,
  "coolant_pressure_bar": 155,
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
  "top_contributors": [
    {"feature": "core_temp_c", "impact": 0.92, "value": 310}
  ],
  "incident_type": "Normal Operation",
  "confidence": 0.87
}
```

### `GET /health`
Health check endpoint.

### `GET /api/model-info`
Returns information about the loaded ML model.

## Dataset Features

The `avalon_nuclear.csv` dataset includes 37 features across multiple categories:

- **Reactor Core**: Temperature, pressure, neutron flux, control rod position
- **Safety Systems**: Radiation levels, maintenance scores, backup generators
- **Environmental**: Weather, seismic activity, population density
- **Operational**: Load factor, grid demand, staff fatigue
- **Avalon AI**: Raw risk scores, learned reward scores
- **Outcomes**: True risk level, incidents, evacuation/shutdown recommendations

See `README.txt` for complete feature descriptions.

## Development

### Running Tests
```bash
npm run lint  # Frontend linting
```

### Building for Production

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app
```

## Key Integration Points

- **API Service**: `src/services/api.ts` handles all backend communication
- **Frontend Integration**: `src/pages/Index.tsx:16-58` manages prediction workflow
- **Backend ML Model**: `backend/api/app.py:25-42` loads model from HuggingFace
- **Prediction Logic**: `backend/api/app.py:100-152` processes requests

## Challenge Objectives

This project addresses the following data science workflow:

1. **Problem Statement**: Predicting true risk and analyzing Avalon AI behavior
2. **Exploratory Data Analysis**: Understanding patterns in nuclear plant data
3. **Data Preprocessing**: Feature engineering and cleaning
4. **Model Building**: ML models for incident prediction
5. **Model Evaluation**: Performance metrics and validation
6. **Insights & Interpretation**: Comparing model predictions to Avalon's behavior
7. **Presentation**: Interactive dashboard for stakeholders

## Contributing

This is a hackathon project. For production use, consider:
- Adding authentication/authorization
- Implementing rate limiting
- Adding comprehensive error handling
- Creating unit and integration tests
- Setting up CI/CD pipelines
- Implementing model versioning

## License

See project repository for license information.

## Acknowledgments

- Original Lovable frontend template: https://lovable.dev/projects/8fc96307-af03-48cd-b038-2c9fc9f8c03e
- Challenge dataset: Avalon Nuclear Safety Dataset
- UI Components: shadcn/ui

---

**For detailed setup instructions and architecture details, see [CLAUDE.md](./CLAUDE.md)**
