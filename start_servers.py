import subprocess, os, sys

env = os.environ.copy()
env["CI"] = "true"

print("1. Starting FastAPI backend on port 8000...")
b_log = open(r"e:\Web 3.0\google ai agent\backend.log", "w", buffering=1)
b_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--port", "8000", "--host", "127.0.0.1"],
    cwd=r"e:\Web 3.0\google ai agent\backend",
    stdout=b_log,
    stderr=b_log,
    env=env
)

print("2. Starting Next.js frontend on port 3000...")
f_log = open(r"e:\Web 3.0\google ai agent\frontend.log", "w", buffering=1)
f_proc = subprocess.Popen(
    ["npx.cmd", "next", "dev", "-p", "3000"],
    cwd=r"e:\Web 3.0\google ai agent\frontend",
    stdout=f_log,
    stderr=f_log,
    env=env
)

print("Started processes PID:", b_proc.pid, f_proc.pid)
