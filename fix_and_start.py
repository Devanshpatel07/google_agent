import os
import sys
import time
import subprocess
import urllib.request

root = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(root, "frontend")

print("=== 1. Terminating previous server processes on 8000 and 3000 ===")
# Kill node and uvicorn processes using taskkill on Windows
try:
    subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)
except Exception as e:
    print("taskkill node notice:", e)

# Install frontend dependencies cleanly
print("=== 2. Ensuring frontend dependencies (including autoprefixer) are installed ===")
try:
    install_res = subprocess.run(
        ["npm.cmd", "install", "--legacy-peer-deps"],
        cwd=frontend_dir,
        capture_output=True,
        text=True,
        timeout=120
    )
    print("Frontend npm install status:", install_res.returncode)
    if install_res.stderr:
        print("npm install stderr tail:", install_res.stderr[-300:])
except Exception as e:
    print("npm install error:", e)

print("=== 3. Starting FastAPI Backend on http://127.0.0.1:8000 ===")
env = os.environ.copy()
env["PYTHONPATH"] = root

backend_log = open(os.path.join(root, "backend_server.log"), "w", buffering=1)
backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=root,
    stdout=backend_log,
    stderr=backend_log,
    env=env
)

print("=== 4. Starting Next.js Frontend on http://localhost:3000 ===")
frontend_log = open(os.path.join(root, "frontend_server.log"), "w", buffering=1)
frontend_proc = subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=frontend_dir,
    stdout=frontend_log,
    stderr=frontend_log,
    env=env
)

print("=== 5. Waiting for servers to initialize... ===")
time.sleep(8)

def check(url, label):
    for attempt in range(6):
        try:
            req = urllib.request.urlopen(url, timeout=5)
            print(f"[SUCCESS] {label} is live at {url} (HTTP {req.status})")
            return True
        except Exception as e:
            print(f"[WAIT {attempt+1}/6] {label} at {url} - {e}")
            time.sleep(3)
    return False

b_ok = check("http://127.0.0.1:8000/docs", "FastAPI Backend")
f_ok = check("http://127.0.0.1:3000", "Next.js Frontend")

if b_ok and f_ok:
    print("\n>>> BOTH SERVERS ARE RUNNING LOCALLY AND VERIFIED READY! <<<")
else:
    print("\n>>> Check logs for details. <<<")
