import subprocess
import os

root = r"e:\Web 3.0\google ai agent"

print("1. Staging files...")
subprocess.run(["git", "add", "."], cwd=root)

print("2. Committing changes...")
subprocess.run(["git", "commit", "-m", "Deploy Backlink Hunter AI backend, frontend, and Groq LLM fixes"], cwd=root)

print("3. Checking git log...")
res = subprocess.run(["git", "log", "-n", "3", "--oneline"], cwd=root, capture_output=True, text=True)
print(res.stdout)
