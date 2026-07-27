import subprocess

root = r"e:\Web 3.0\google ai agent"

def run_cmd(cmd):
    res = subprocess.run(cmd, cwd=root, capture_output=True, text=True)
    print(f"> {' '.join(cmd)}")
    print("STDOUT:", res.stdout.strip())
    print("STDERR:", res.stderr.strip())

run_cmd(["git", "remote", "-v"])
run_cmd(["git", "status", "-s"])
run_cmd(["git", "log", "-n", "2"])
