@echo off
npm install
cd frontend
call npm install --legacy-peer-deps
cd ..
cd backend
python -m pip install -r requirements.txt
cd ..
npm run dev
