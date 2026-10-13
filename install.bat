@echo off
cd /d "%~dp0backend" && call npm install
cd /d "%~dp0frontend" && call npm install
echo.
echo Install finished. Now double-click start.bat
pause
