import os
import sys
import time
import subprocess
import urllib.request

root = r"e:\Web 3.0\google ai agent"
frontend_dir = os.path.join(root, "frontend")

print("Checking autoprefixer in root node_modules:", os.path.exists(os.path.join(root, "node_modules", "autoprefixer")))
print("Checking autoprefixer in frontend node_modules:", os.path.exists(os.path.join(frontend_dir, "node_modules", "autoprefixer")))

# Kill existing node and uvicorn
subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)

# Spawn backend
env = os.environ.copy()
env["PYTHONPATH"] = root
b_log = open(os.path.join(root, "backend_server.log"), "w", buffering=1)
b_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=root,
    stdout=b_log,
    stderr=b_log,
    env=env
)

# Spawn frontend
f_log = open(os.path.join(root, "frontend_server.log"), "w", buffering=1)
f_proc = subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=frontend_dir,
    stdout=f_log,
    stderr=f_log,
    env=env
)

time.sleep(6)

def test_endpoint(url):
    try:
        res = urllib.request.urlopen(url, timeout=5)
        return f"HTTP {res.status}"
    except Exception as e:
        return f"Error: {e}"

print("Backend status:", test_endpoint("http://127.0.0.1:8000/docs"))
print("Frontend status:", test_endpoint("http://127.0.0.1:3000/"))
