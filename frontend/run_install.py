import subprocess

res = subprocess.run(["npm.cmd", "install", "--legacy-peer-deps"], capture_output=True, text=True, cwd=r"e:\Web 3.0\google ai agent\frontend")
with open(r"e:\Web 3.0\google ai agent\frontend\install_res.txt", "w") as f:
    f.write("STDOUT:\n" + res.stdout + "\n\nSTDERR:\n" + res.stderr)
print("Done, exit code:", res.returncode)
