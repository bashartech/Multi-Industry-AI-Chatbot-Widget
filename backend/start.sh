#!/bin/bash
# Script to start the backend server

echo "Starting Chatbot Backend Server..."

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000