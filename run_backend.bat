@echo off
cd /d "e:\Web 3.0\google ai agent"
set PYTHONPATH=e:\Web 3.0\google ai agent
python -m uvicorn backend.main:app --port 8000 --host 127.0.0.1 > backend\server.log 2>&1
