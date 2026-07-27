import requests
import time
import sys

BASE_URL = "http://localhost:8000/api/projects"

def run_test():
    print("Testing Backend E2E Pipeline...")
    
    # 1. Create a project
    payload = {"url": "https://example.com"}
    print(f"Submitting URL: {payload['url']}")
    try:
        res = requests.post(BASE_URL, json=payload, timeout=5)
    except Exception as e:
        print(f"Server is not running on 8000! Start the backend first. Error: {e}")
        sys.exit(1)
        
    if res.status_code != 200:
        print(f"Failed to create project: {res.text}")
        sys.exit(1)
        
    project_id = res.json().get("project_id")
    print(f"Started Project ID: {project_id}")

    # 2. Poll Status
    max_retries = 30
    status = "queued"
    for i in range(max_retries):
        status_res = requests.get(f"{BASE_URL}/{project_id}/status")
        if status_res.status_code == 200:
            data = status_res.json()
            status = data.get("status")
            error_msg = data.get("error_message")
            
            print(f"[{i+1}/{max_retries}] Status: {status}")
            
            if status == "error":
                print(f"Pipeline Failed! Error: {error_msg}")
                sys.exit(1)
            elif status == "done":
                print("Pipeline Completed Successfully!")
                break
        
        time.sleep(2)
    
    if status != "done":
        print("Test timed out before completion.")
        sys.exit(1)

    # 3. Get Results
    audit_res = requests.get(f"{BASE_URL}/{project_id}/seo-audit").json()
    print("\n--- SEO Audit Results ---")
    print(f"Metrics: {audit_res.get('metrics')}")
    print(f"Errors Found: len({len(audit_res.get('issues', []))})")
    
    opp_res = requests.get(f"{BASE_URL}/{project_id}/opportunities").json()
    print("\n--- Backlink Opportunities ---")
    print(f"Scored Opportunities: {len(opp_res)}")
    for o in opp_res[:2]:
        print(f"Domain: {o['domain']} | Score: {o['score']} | Risk: {o['spam_risk']}")
    
    print("\nAll integration tests passed safely!")

if __name__ == "__main__":
    run_test()
