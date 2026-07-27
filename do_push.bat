@echo off
echo 1. Staging files...
git add .

echo 2. Committing...
git commit -m "Deploy Backlink Hunter AI frontend, backend, and Groq LLM fixes"

echo 3. Pushing to https://github.com/Devanshpatel07/google_agent.git ...
git push -u origin main --force
echo Push attempt finished.
