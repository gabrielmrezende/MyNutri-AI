@echo off
cd /d "%~dp0"
echo Instalando dependencias (npm)...
call npm.cmd install
if errorlevel 1 exit /b 1
echo.
echo Iniciando frontend em http://localhost:5173
echo Pressione Ctrl+C para parar.
call npm.cmd run dev
