#!/bin/bash

# Nuclear Reactor Risk Analysis System - Development Start Script
# This script starts both the backend and frontend servers

echo "🚀 Starting Nuclear Reactor Risk Analysis System..."
echo ""

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Backend virtual environment not found!"
    echo "Please run the following commands first:"
    echo "  cd backend"
    echo "  python -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Frontend dependencies not found!"
    echo "Please run: npm install"
    exit 1
fi

# Check if .env files exist (optional for this setup)
if [ ! -f "backend/.env" ]; then
    echo "ℹ️  Creating backend .env file from template..."
    cp backend/.env.example backend/.env
fi

echo "✅ All prerequisites met"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start backend server
echo "🔧 Starting Backend API (Flask)..."
cd backend/api
source ../venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🎨 Starting Frontend (Vite)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "📡 Backend API: http://localhost:5001"
echo "🌐 Frontend:    http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
