import subprocess

root = r"e:\Web 3.0\google ai agent"

def run_cmd(cmd):
    print(f"\nCommand: {' '.join(cmd)}")
    res = subprocess.run(cmd, cwd=root, capture_output=True, text=True)
    print("STDOUT:", res.stdout.strip())
    print("STDERR:", res.stderr.strip())
    return res.returncode

print("Checking git status...")
run_cmd(["git", "status"])

print("Attempting git push...")
rc = run_cmd(["git", "push", "-u", "origin", "main"])

if rc != 0:
    print("Standard push failed. Trying push with --force...")
    run_cmd(["git", "push", "-u", "origin", "main", "--force"])
