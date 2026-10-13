@echo off
start "Riyadvi Backend" cmd /k "cd /d %~dp0backend && npm run dev"
start "Riyadvi Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 8 >nul
start http://localhost:3000
