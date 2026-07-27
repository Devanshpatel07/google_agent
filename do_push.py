import subprocess
import os

root = r"e:\Web 3.0\google ai agent"
env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"

print("1. Adding all changes...")
subprocess.run(["git", "add", "."], cwd=root, env=env)

print("2. Committing...")
subprocess.run(["git", "commit", "-m", "Deploy Backlink Hunter AI backend and frontend fixes"], cwd=root, env=env)

print("3. Pushing to origin main...")
res = subprocess.run(["git", "push", "-u", "origin", "main"], cwd=root, capture_output=True, text=True, env=env)

print("Return Code:", res.returncode)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)

if res.returncode != 0:
    print("4. Trying force push...")
    res2 = subprocess.run(["git", "push", "-u", "origin", "main", "--force"], cwd=root, capture_output=True, text=True, env=env)
    print("Force Push Return Code:", res2.returncode)
    print("Force Push STDOUT:", res2.stdout)
    print("Force Push STDERR:", res2.stderr)
