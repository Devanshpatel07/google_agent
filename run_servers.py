import os
import sys
import time
import subprocess
import urllib.request

root = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(root, "frontend")

print("1. Cleaning up background node/uvicorn processes...")
subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)

print("2. Installing autoprefixer dependency for frontend...")
install_proc = subprocess.run(
    ["npm.cmd", "install", "autoprefixer@^10.4.20", "--legacy-peer-deps", "--no-audit", "--no-fund"],
    cwd=frontend_dir,
    capture_output=True,
    text=True
)
print("npm install code:", install_proc.returncode)

print("3. Starting FastAPI Backend on http://127.0.0.1:8000 ...")
env = os.environ.copy()
env["PYTHONPATH"] = root

b_log = open(os.path.join(root, "backend_server.log"), "w", buffering=1)
subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=root,
    stdout=b_log,
    stderr=b_log,
    env=env
)

print("4. Starting Next.js Frontend on http://localhost:3000 ...")
f_log = open(os.path.join(root, "frontend_server.log"), "w", buffering=1)
subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=frontend_dir,
    stdout=f_log,
    stderr=f_log,
    env=env
)

print("5. Polling localhost services to verify operational status...")
b_ready = False
f_ready = False

for attempt in range(15):
    time.sleep(2)
    if not b_ready:
        try:
            req = urllib.request.urlopen("http://127.0.0.1:8000/docs", timeout=3)
            if req.status == 200:
                b_ready = True
                print(f"   [Backend] LIVE on http://127.0.0.1:8000 (Status: {req.status})")
        except Exception as e:
            pass
            
    if not f_ready:
        try:
            req = urllib.request.urlopen("http://127.0.0.1:3000", timeout=3)
            if req.status == 200:
                f_ready = True
                print(f"   [Frontend] LIVE on http://localhost:3000 (Status: {req.status})")
        except Exception as e:
            pass
            
    if b_ready and f_ready:
        break

print("\n=========================================")
print(f"Backend Status : {'ONLINE' if b_ready else 'STARTING/FAILED'}")
print(f"Frontend Status: {'ONLINE' if f_ready else 'STARTING/FAILED'}")
print("=========================================")
