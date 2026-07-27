import os

def walk_dir(path):
    print(f"Walking {path}")
    for root, dirs, files in os.walk(path):
        print(f"Root: {root}")
        print(f"Dirs: {dirs}")
        print(f"Files: {files}")

if __name__ == "__main__":
    walk_dir("e:/Web 3.0/google ai agent")
