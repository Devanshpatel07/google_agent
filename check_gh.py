import subprocess

def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    print(">", cmd)
    print("STDOUT:", p.stdout.strip())
    print("STDERR:", p.stderr.strip())

run("gh auth status")
run("git push -u origin main")
