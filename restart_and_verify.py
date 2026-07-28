import os
import sys
import subprocess
import time
import urllib.request

root = r"e:\Web 3.0\google ai agent"
f_dir = os.path.join(root, "frontend")

DETACHED = 0x00000008 | 0x00000200

# Kill running processes
subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)

env = os.environ.copy()
env["PYTHONPATH"] = root

print("1. Starting Backend...")
b_log = open(os.path.join(root, "backend_server.log"), "w", buffering=1)
subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=root,
    stdout=b_log,
    stderr=b_log,
    env=env,
    creationflags=DETACHED
)

print("2. Starting Frontend...")
f_log = open(os.path.join(root, "frontend_server.log"), "w", buffering=1)
subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=f_dir,
    stdout=f_log,
    stderr=f_log,
    env=env,
    creationflags=DETACHED
)

time.sleep(5)

def check_endpoint(url):
    try:
        res = urllib.request.urlopen(url, timeout=4)
        return f"OK ({res.status})"
    except Exception as e:
        return f"ERR: {e}"

print("Checking endpoints:")
print(" - Backend docs        :", check_endpoint("http://127.0.0.1:8000/docs"))
print(" - Frontend Home       :", check_endpoint("http://localhost:3000/"))
print(" - Frontend SEO Audit  :", check_endpoint("http://localhost:3000/seo-audit"))
print(" - Frontend Backlinks  :", check_endpoint("http://localhost:3000/backlinks"))
