See the instructions for this project:

Using the provided “avalon_nuclear.csv” dataset of nuclear power plants
across Europe, your team will follow a data science workflow, as you will
start with a Problem Statement, for example, predicting true risk,
incidents, or Avalon’s evacuation or shutdown decisions or etc. Then
your team will conduct the Exploratory Data Analysis to understand key
patterns and anomalies. After that, your team will perform Data
Cleaning & Preprocessing to fix or transform features. Your team also
have to go through the Model Building step, where you create at least
one machine learning model, followed by Model Evaluation to check
how well it performs. You will then focus on Insights & Interpretation of
the results, comparing your findings to Avalon’s behaviour to highlight
possible AI misalignment or overreaction. You will finish this project
with a Presentation that clearly explains what you did, what you
discovered, and how your analysis or model could help operators make
better decisions in a nuclear AI crisis.

## Project Structure

- **Frontend**: React + TypeScript + Vite application with shadcn/ui components
  - Located in the root directory (src/, public/, etc.)
  - Interactive nuclear reactor monitoring dashboard
  - Currently uses mock data for predictions

- **Backend**: To be implemented
  - Located in `backend/` directory
  - Will provide ML model API integration
  - Should serve predictions based on the avalon_nuclear.csv dataset

- **Data**: `avalon_nuclear.csv` contains nuclear power plant monitoring data

## Frontend Features

The frontend dashboard includes:
- Input panel for reactor parameters
- Real-time plant visualization
- Prediction panel showing risk assessments
- Mock ML predictions (to be replaced with real backend API)

## Next Steps for Integration

1. Build ML model using avalon_nuclear.csv data
2. Create backend API (Python/Flask or Node.js/Express)
3. Update frontend API calls in `src/pages/Index.tsx:13-37` to connect to real backend
4. Deploy both frontend and backend

## Getting Started

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
```

Edit `backend/.env` and add your HuggingFace model URL:
```
HUGGINGFACE_MODEL_URL=https://huggingface.co/your-username/your-model/resolve/main/model.pickle
```

5. Start the backend server:
```bash
cd api
python app.py
```

The backend API will be available at http://localhost:5000

## Running Both Together

**Terminal 1 - Backend:**
```bash
cd backend/api
source ../venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## API Integration

The frontend automatically calls the backend API at `http://localhost:5000/api/predict` when you run a simulation. If the backend is not available, it will fall back to mock data and show a warning notification.

### Key Integration Points:

- **API Service**: `src/services/api.ts` - Handles all backend communication
- **Frontend Integration**: `src/pages/Index.tsx:16-58` - Uses the API service to get predictions
- **Backend Endpoint**: `backend/api/app.py:100-152` - Processes predictions using HuggingFace model

## Project Structure Details

```
.
├── src/                          # Frontend React application
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── services/                # API service layer
│   │   └── api.ts              # Backend API integration
│   └── types/                   # TypeScript type definitions
├── backend/                     # Backend Python API
│   ├── api/
│   │   └── app.py              # Flask application
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend configuration
├── avalon_nuclear.csv          # Training dataset
└── README.txt                  # Original project description
```
