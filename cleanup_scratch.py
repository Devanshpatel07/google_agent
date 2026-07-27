import os
import subprocess

root = r"e:\Web 3.0\google ai agent"

scratch_files = [
    "install_and_restart.py",
    "verify_all.py",
    "start_detached.py",
    "search_decommissioned.py",
    "inspect_db.py",
    "clean_db.py",
    "test_new_model.py",
    "run_live_test.py",
    "test_json_mode.py",
    "verify_json_mode_fix.py",
    "git_push.py",
    "push_and_check.py",
    "check_git_remote.py",
    "do_push.py",
    "check_gh.py",
    "force_commit_push.py",
    "scan_out.txt",
    "test_out.txt",
    "json_test.txt",
    "live_out.txt",
    "push_result.txt"
]

for sf in scratch_files:
    p = os.path.join(root, sf)
    if os.path.exists(p):
        try:
            os.remove(p)
            print(f"Removed temporary file: {sf}")
        except Exception as e:
            print(f"Could not remove {sf}: {e}")

subprocess.run(["git", "add", "."], cwd=root)
subprocess.run(["git", "commit", "-m", "Clean up and finalize repository code for push"], cwd=root)
print("Cleanup complete.")
