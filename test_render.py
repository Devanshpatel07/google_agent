import urllib.request

url = "https://google-agent.onrender.com/docs"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req, timeout=10)
    print("Status:", res.status)
    print("Backend URL https://google-agent.onrender.com is LIVE and functional!")
except Exception as e:
    print("Error:", e)
