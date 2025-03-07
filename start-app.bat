@echo off
echo Starting the InBody Measurement Tracker application...

REM Start the backend server
echo Starting the backend server...
start cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for the backend to start
timeout /t 2 /nobreak > nul

REM Start the frontend server
echo Starting the frontend server...
start cmd /k "cd frontend && npm start"

echo Both servers are running. Close the command windows to stop the servers.
