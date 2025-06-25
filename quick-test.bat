@echo off
title A1Betting Quick Test Setup

echo.
echo ========================================
echo   ⚡ A1Betting Quick Test Setup
echo ========================================
echo.

REM Check prerequisites
python --version >nul 2>&1 || (echo ❌ Python not found & pause & exit /b 1)
npm --version >nul 2>&1 || (echo ❌ Node.js not found & pause & exit /b 1)

REM Kill existing processes
echo 🧹 Cleaning ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1

REM Start backend
echo 📊 Starting Backend (Port 8000)...
cd backend
start "Backend" cmd /c "python main.py"
cd ..

REM Wait and start frontend  
timeout /t 6 /nobreak > nul
echo 🎨 Starting Frontend (Port 5173)...
cd frontend
start "Frontend" cmd /c "npm run dev:frontend"
cd ..

REM Wait for services to start
timeout /t 4 /nobreak > nul

echo.
echo ✅ Services Started!
echo.
echo 🌐 URLS:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo 💡 TIP: Check the opened terminal windows for logs
echo.

REM Test connectivity
echo 🔍 Testing connectivity...
timeout /t 2 /nobreak > nul

ping -n 1 localhost >nul 2>&1 && echo ✅ Localhost responding || echo ❌ Network issue

echo.
echo Ready for testing! Press any key to exit this window.
echo (Services will continue running in their own windows)
pause > nul
