@echo off
cd /d "%~dp0..\backend"
start "Money Manager - servidor (feche esta janela para encerrar)" cmd /k node dist\server.js
timeout /t 2 /nobreak >nul
start http://localhost:3001
