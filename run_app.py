import subprocess, sys, os, time, urllib.request

root = os.path.dirname(os.path.abspath(__file__))
env = os.environ.copy()
env["PYTHONPATH"] = root

print("=========================================")
print("  STARTING BACKLINK HUNTER AI PLATFORM  ")
print("=========================================")

# Start Backend
backend_log_path = os.path.join(root, "backend_server.log")
b_log = open(backend_log_path, "w", buffering=1)
print("1. Launching FastAPI Backend on http://127.0.0.1:8000 ...")
b_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=root,
    stdout=b_log,
    stderr=b_log,
    env=env
)

# Start Frontend
frontend_log_path = os.path.join(root, "frontend_server.log")
f_log = open(frontend_log_path, "w", buffering=1)
print("2. Launching Next.js Frontend on http://127.0.0.1:3000 ...")
f_proc = subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=os.path.join(root, "frontend"),
    stdout=f_log,
    stderr=f_log,
    env=env
)

print("\nWaiting for servers to start (5 seconds)...")
time.sleep(5)

def check_url(url, name):
    try:
        req = urllib.request.urlopen(url, timeout=5)
        print(f"[SUCCESS] {name} is LIVE at {url} (Status: {req.status})")
        return True
    except Exception as e:
        print(f"[WAITING] {name} at {url} - {e}")
        return False

check_url("http://127.0.0.1:8000/docs", "FastAPI Backend Docs")
check_url("http://127.0.0.1:3000", "Next.js Frontend")

print("\nServers are running in background.")
