import subprocess

print("Running monorepo npm install...")
res = subprocess.run(["npm.cmd", "install", "--legacy-peer-deps", "--no-audit", "--no-fund"], capture_output=True, text=True, cwd=r"e:\Web 3.0\google ai agent")
print("Exit code:", res.returncode)
print("STDOUT:", res.stdout[:500])
print("STDERR:", res.stderr[:500])
