import os
import sys
import time
import subprocess
import urllib.request

root = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(root, "frontend")

# 1. Kill old node and python uvicorn
try:
    subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)
except Exception:
    pass

# 2. Check & Install autoprefixer if missing
auto_path = os.path.join(frontend_dir, "node_modules", "autoprefixer")
if not os.path.exists(auto_path):
    print("Installing autoprefixer in frontend...")
    subprocess.run(["npm.cmd", "install", "autoprefixer", "--legacy-peer-deps"], cwd=frontend_dir, capture_output=True)

# 3. Environment setup
env = os.environ.copy()
env["PYTHONPATH"] = root

# 4. Start Backend
blog = open(os.path.join(root, "backend_server.log"), "w", buffering=1)
bproc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=root,
    stdout=blog,
    stderr=blog,
    env=env
)

# 5. Start Frontend
flog = open(os.path.join(root, "frontend_server.log"), "w", buffering=1)
fproc = subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=frontend_dir,
    stdout=flog,
    stderr=flog,
    env=env
)

# 6. Verify endpoints
b_live = False
f_live = False

for i in range(12):
    time.sleep(2)
    if not b_live:
        try:
            r = urllib.request.urlopen("http://127.0.0.1:8000/docs", timeout=3)
            if r.status == 200:
                b_live = True
        except Exception:
            pass
    if not f_live:
        try:
            r = urllib.request.urlopen("http://127.0.0.1:3000", timeout=3)
            if r.status == 200:
                f_live = True
        except Exception:
            pass
    if b_live and f_live:
        break

status_text = f"Backend (http://127.0.0.1:8000/docs): {'LIVE (200)' if b_live else 'STARTING'}\n"
status_text += f"Frontend (http://localhost:3000): {'LIVE (200)' if f_live else 'STARTING'}\n"

with open(os.path.join(root, "server_status.txt"), "w") as f:
    f.write(status_text)

print(status_text)
