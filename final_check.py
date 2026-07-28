import subprocess
import urllib.request

root = r"e:\Web 3.0\google ai agent"

print("--- GIT STATUS ---")
res = subprocess.run(["git", "status", "-s"], cwd=root, capture_output=True, text=True)
print(res.stdout if res.stdout else "Clean working directory.")

print("--- LOCAL ENDPOINTS ---")
def check(url):
    try:
        r = urllib.request.urlopen(url, timeout=3)
        return f"200 OK"
    except Exception as e:
        return f"Offline / {e}"

print("Backend /docs:", check("http://127.0.0.1:8000/docs"))
print("Frontend /    :", check("http://localhost:3000/"))
print("Frontend /seo-audit:", check("http://localhost:3000/seo-audit"))
print("Frontend /backlinks:", check("http://localhost:3000/backlinks"))
