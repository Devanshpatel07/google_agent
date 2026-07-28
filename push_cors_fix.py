import subprocess
import os

root = r"e:\Web 3.0\google ai agent"
env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"

subprocess.run(["git", "add", "."], cwd=root, env=env)
subprocess.run(["git", "commit", "-m", "Allow all origins in CORS middleware for Vercel"], cwd=root, env=env)
p = subprocess.run(["git", "push", "-u", "origin", "main", "--force"], cwd=root, capture_output=True, text=True, env=env)

print("Return Code:", p.returncode)
print("STDOUT:", p.stdout)
print("STDERR:", p.stderr)
