import subprocess
import os

root = r"e:\Web 3.0\google ai agent"

print("1. Removing git locks...")
lock = os.path.join(root, ".git", "index.lock")
if os.path.exists(lock):
    try:
        os.remove(lock)
    except:
        pass

print("2. Staging all project files...")
subprocess.run(["git", "add", "-A"], cwd=root)

print("3. Committing all files...")
subprocess.run(["git", "commit", "-m", "Full Backlink Hunter AI codebase (Frontend, Backend, Agents)"], cwd=root)

print("4. Configuring remote origin...")
subprocess.run(["git", "remote", "remove", "origin"], cwd=root)
subprocess.run(["git", "remote", "add", "origin", "https://github.com/Devanshpatel07/google_agent.git"], cwd=root)

print("5. Force pushing all code to GitHub...")
p = subprocess.run(["git", "push", "-u", "origin", "main", "--force"], cwd=root, capture_output=True, text=True)
print("STDOUT:", p.stdout)
print("STDERR:", p.stderr)
print("Return Code:", p.returncode)
