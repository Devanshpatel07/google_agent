import subprocess, os

root = r"e:\Web 3.0\google ai agent"
res = subprocess.run(
    ["npm.cmd", "install", "autoprefixer@latest", "--legacy-peer-deps", "--no-audit", "--no-fund"],
    cwd=root,
    capture_output=True,
    text=True
)

with open(os.path.join(root, "install_result.txt"), "w") as f:
    f.write(f"Return code: {res.returncode}\n")
    f.write(f"STDOUT:\n{res.stdout}\n")
    f.write(f"STDERR:\n{res.stderr}\n")

print("Done. Return code:", res.returncode)
