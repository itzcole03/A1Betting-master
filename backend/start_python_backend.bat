@echo off
echo 🐍 A1Betting Python Backend Startup
echo =====================================

cd /d "%~dp0"
echo 📁 Current directory: %CD%

echo.
echo 🔍 Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found in PATH
    echo 💡 Please install Python 3.8+ and add to PATH
    pause
    exit /b 1
)

echo.
echo 📦 Installing/checking dependencies...
python -m pip install fastapi uvicorn --quiet
if %errorlevel% neq 0 (
    echo ⚠️ Dependency installation issues, continuing anyway...
)

echo.
echo 🚀 Starting Python backend options:
echo.
echo 1. Simple Backend (Recommended)
echo 2. Enhanced Backend (Complex dependencies)
echo 3. Exit
echo.
set /p choice="Choose option (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🎯 Starting Simple Python Backend...
    echo 📊 This will provide basic API endpoints for testing
    echo 🔗 Frontend will connect automatically
    echo.
    python simple_backend.py
) else if "%choice%"=="2" (
    echo.
    echo 🎯 Starting Enhanced Python Backend...
    echo ⚠️ This requires complex ML dependencies
    echo.
    python run_backend.py
) else if "%choice%"=="3" (
    echo.
    echo 👋 Exiting...
    exit /b 0
) else (
    echo.
    echo ❌ Invalid choice. Defaulting to Simple Backend...
    python simple_backend.py
)

echo.
echo 📱 Backend startup completed
pause
