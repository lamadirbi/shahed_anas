@echo off
chcp 65001 >nul
cd /d "%~dp0wedding-app"
if not exist node_modules (
  echo جاري تثبيت الحزم...
  call npm install
)
start http://localhost:5173
call npm run dev
