@echo off
setlocal enabledelayedexpansion
title A1Betting Development Server

echo.
echo ========================================
echo   🚀 A1Betting Ultimate Platform 
echo   Starting Development Environment
echo ========================================
echo.

REM Color coding for Windows
color 0A

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python and try again
    pause
    exit /b 1
)

REM Check if Node.js is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js/npm is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Create log directory if it doesn't exist
if not exist "logs" mkdir logs

REM Kill any existing processes on our ports
echo 🧹 Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
echo.

echo � Starting Backend Server...
echo    Port: 8000
echo    API Docs: http://localhost:8000/docs
cd backend

REM Check if backend dependencies are installed
if not exist "__pycache__" (
    echo � Installing backend dependencies...
    pip install -r requirements.txt --user
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
)

start "A1Betting Backend Server" cmd /k "echo Backend starting... && python main.py"
cd ..

echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

echo.
echo 🎨 Starting Frontend Development Server...
echo    Port: 5173
echo    URL: http://localhost:5173
cd frontend

REM Check if frontend dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
)

start "A1Betting Frontend Server" cmd /k "echo Frontend starting... && npm run dev:frontend"
cd ..

echo.
echo ⏳ Waiting for frontend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo ✅ A1Betting Platform is Running!
echo ========================================
echo.
echo 🎯 DEVELOPMENT URLS:
echo    📱 Frontend App:  http://localhost:5173
echo    🔧 Backend API:   http://localhost:8000
echo    📚 API Docs:      http://localhost:8000/docs
echo    📊 Health Check:  http://localhost:8000/health
echo.
echo 🔧 DEVELOPMENT COMMANDS:
echo    - Press Ctrl+C in any terminal to stop that service
echo    - Close this window to see running services
echo    - Check logs/ folder for detailed logs
echo.
echo 💡 TIP: Keep this window open to monitor the startup
echo.
echo Press any key to hide this window (servers will continue running)...
pause > nul

echo.
echo Servers are running in background windows.
echo Close the server terminal windows to stop the services.
echo.
