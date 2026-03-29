@echo off
cd /d "%~dp0"
echo Study Buddy - Starting...

:: Kill any existing node dev servers on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
echo Starting dev server...
echo.
echo Browser will open in ~4s, or visit: http://localhost:3000
echo.
start /B cmd /c "timeout /t 4 /nobreak > nul && start http://localhost:3000"
call npm run dev
pause
