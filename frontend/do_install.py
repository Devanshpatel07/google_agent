import subprocess, sys

print("Starting npm install in frontend...")
p = subprocess.Popen(["npm.cmd", "install", "--legacy-peer-deps", "--no-audit", "--no-fund"], cwd=r"e:\Web 3.0\google ai agent\frontend", stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
for line in p.stdout:
    print(line, end="")
p.wait()
print("Finished with exit code:", p.returncode)
