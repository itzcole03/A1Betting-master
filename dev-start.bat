@echo off
setlocal enabledelayedexpansion
title A1Betting Development Environment

echo.
echo ========================================
echo   🚀 A1Betting Development Environment
echo   Enhanced Testing & Development Setup
echo ========================================
echo.

:MENU
echo.
echo Choose your development setup:
echo.
echo 1. 🚀 Start Full Stack (Frontend + Backend)
echo 2. 🎨 Start Frontend Only
echo 3. 📊 Start Backend Only  
echo 4. 🧪 Run Frontend Tests
echo 5. 🔬 Run Backend Tests
echo 6. 📦 Install Dependencies
echo 7. 🧹 Clean & Reset
echo 8. 📈 Build Production
echo 9. 🔍 Health Check
echo 0. ❌ Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto FULL_STACK
if "%choice%"=="2" goto FRONTEND_ONLY
if "%choice%"=="3" goto BACKEND_ONLY
if "%choice%"=="4" goto TEST_FRONTEND
if "%choice%"=="5" goto TEST_BACKEND
if "%choice%"=="6" goto INSTALL_DEPS
if "%choice%"=="7" goto CLEAN_RESET
if "%choice%"=="8" goto BUILD_PROD
if "%choice%"=="9" goto HEALTH_CHECK
if "%choice%"=="0" goto EXIT

echo Invalid choice. Please try again.
goto MENU

:FULL_STACK
echo.
echo 🚀 Starting Full Stack Development Environment...
echo.

REM Kill existing processes
echo 🧹 Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1

echo 📊 Starting Backend...
cd backend
start "A1Betting Backend" cmd /k "title Backend Server && echo ========== A1BETTING BACKEND ========== && echo Starting backend server... && python main.py"
cd ..

echo ⏳ Waiting for backend initialization...
timeout /t 8 /nobreak > nul

echo 🎨 Starting Frontend...
cd frontend  
start "A1Betting Frontend" cmd /k "title Frontend Server && echo ========== A1BETTING FRONTEND ========== && echo Starting frontend server... && npm run dev:frontend"
cd ..

echo.
echo ✅ Full stack is starting up!
echo    📱 Frontend: http://localhost:5173 (or next available port)
echo    🔧 Backend:  http://localhost:8000
echo    📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:FRONTEND_ONLY
echo.
echo 🎨 Starting Frontend Development Server...
cd frontend
start "A1Betting Frontend" cmd /k "title Frontend Server && echo ========== A1BETTING FRONTEND ========== && npm run dev:frontend"
cd ..
echo ✅ Frontend started on http://localhost:5173
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:BACKEND_ONLY
echo.
echo 📊 Starting Backend Development Server...
cd backend
start "A1Betting Backend" cmd /k "title Backend Server && echo ========== A1BETTING BACKEND ========== && python main.py"
cd ..
echo ✅ Backend started on http://localhost:8000
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:TEST_FRONTEND
echo.
echo 🧪 Running Frontend Tests...
cd frontend
echo Running Jest tests...
npm test
echo.
echo Running TypeScript type checking...
npm run type-check
echo.
echo Running ESLint...
npm run lint
cd ..
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:TEST_BACKEND
echo.
echo 🔬 Running Backend Tests...
cd backend
if exist "tests" (
    echo Running Python tests...
    python -m pytest tests/ -v
) else (
    echo No tests directory found. Creating basic health test...
    echo import requests > test_health.py
    echo. >> test_health.py
    echo def test_health(): >> test_health.py
    echo     try: >> test_health.py
    echo         response = requests.get('http://localhost:8000/health') >> test_health.py
    echo         assert response.status_code == 200 >> test_health.py
    echo         print('✅ Backend health check passed') >> test_health.py
    echo     except: >> test_health.py
    echo         print('❌ Backend not running or health check failed') >> test_health.py
    echo. >> test_health.py
    echo if __name__ == '__main__': >> test_health.py
    echo     test_health() >> test_health.py
    
    python test_health.py
    del test_health.py
)
cd ..
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:INSTALL_DEPS
echo.
echo 📦 Installing Dependencies...
echo.
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt --user
cd ..
echo.
echo Installing frontend dependencies...
cd frontend
npm install --user
cd ..
echo.
echo ✅ All dependencies installed!
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:CLEAN_RESET
echo.
echo 🧹 Cleaning and Resetting Environment...
echo.

REM Kill processes
echo Stopping all servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1

REM Clean backend
echo Cleaning backend cache...
cd backend
if exist "__pycache__" rmdir /s /q "__pycache__"
if exist ".pytest_cache" rmdir /s /q ".pytest_cache"
cd ..

REM Clean frontend  
echo Cleaning frontend cache...
cd frontend
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q "node_modules"
)
if exist "dist" rmdir /s /q "dist"
if exist ".vite" rmdir /s /q ".vite"
cd ..

echo ✅ Environment cleaned!
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:BUILD_PROD
echo.
echo 📈 Building Production Version...
echo.
echo Building frontend...
cd frontend
npm run build
cd ..
echo.
echo ✅ Production build complete!
echo Built files are in frontend/dist/
echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:HEALTH_CHECK
echo.
echo 🔍 Running Health Checks...
echo.

REM Check if services are running
echo Checking backend health...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running and healthy
) else (
    echo ❌ Backend is not responding
)

echo.
echo Checking frontend...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend is not responding
)

echo.
echo Checking ports...
netstat -an | findstr :8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 8000 is in use (Backend)
) else (
    echo ❌ Port 8000 is free (Backend not running)
)

netstat -an | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 5173 is in use (Frontend)
) else (
    echo ❌ Port 5173 is free (Frontend not running)
)

echo.
echo Press any key to return to menu...
pause > nul
goto MENU

:EXIT
echo.
echo 👋 Goodbye! Thanks for using A1Betting Development Environment.
echo.
exit /b 0
