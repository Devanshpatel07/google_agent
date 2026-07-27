import subprocess

print("Installing autoprefixer in root...")
res1 = subprocess.run(["npm.cmd", "install", "autoprefixer", "--legacy-peer-deps"], cwd=r"e:\Web 3.0\google ai agent", capture_output=True, text=True)
print("Root install exit:", res1.returncode)
print("Root stdout:", res1.stdout[:300])
print("Root stderr:", res1.stderr[:300])

print("\nInstalling autoprefixer in frontend...")
res2 = subprocess.run(["npm.cmd", "install", "autoprefixer", "--legacy-peer-deps"], cwd=r"e:\Web 3.0\google ai agent\frontend", capture_output=True, text=True)
print("Frontend install exit:", res2.returncode)
print("Frontend stdout:", res2.stdout[:300])
print("Frontend stderr:", res2.stderr[:300])
