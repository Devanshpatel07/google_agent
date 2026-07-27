@echo off
echo Killing existing servers on ports 3000 and 8000
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO taskkill /F /PID %%T
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :8000') DO taskkill /F /PID %%T
echo Restarting Dev Servers
call run_dev.bat
