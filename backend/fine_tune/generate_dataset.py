"""
Dataset Generator for Fine-Tuning Backlink Hunter AI Model.
Generates instruction-tuning pairs for SEO auditing & outreach email drafting.
Output: backend/fine_tune/dataset.jsonl
"""

import json
import os

DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.jsonl")

# Sample high-quality SEO audit & outreach pitch training examples
TRAINING_SAMPLES = [
    {
        "instruction": "Analyze the webpage metadata and body text snapshot to produce a structured SEO audit report with severity, explanation, fix recommendations, and toxic backlink sites if any.",
        "input": "Title: Tech Startup Insights | Meta Description: | Word Count: 180 | Body: Welcome to our blog on modern cloud computing and SaaS architecture.",
        "output": json.dumps({
            "seo_errors": [
                {
                    "issue": "Missing Meta Description",
                    "severity": "high",
                    "explanation": "The webpage lacks a meta description tag, reducing click-through rates from search engines.",
                    "fix_recommendation": "Add a 150-160 character meta description tag outlining your cloud and SaaS insights.",
                    "toxic_sites": []
                },
                {
                    "issue": "Low Word Count",
                    "severity": "medium",
                    "explanation": "Page word count is 180 words, which is below the recommended 600+ threshold for indexable blog posts.",
                    "fix_recommendation": "Expand post content to at least 600 words with H2/H3 subheadings.",
                    "toxic_sites": []
                },
                {
                    "issue": "Low-Trust Referring Subnets Detected",
                    "severity": "high",
                    "explanation": "5 toxic referring domains from known link farm networks were detected targeting this page.",
                    "fix_recommendation": "Download generated disavow.txt file and submit to Google Search Console.",
                    "toxic_sites": ["spam-link-network.xyz", "pbn-hub-99.net", "lowtrust-referral.info", "bad-seo-farm.biz", "toxic-backlinks.org"]
                }
            ]
        }, indent=2)
    },
    {
        "instruction": "Draft a personalized, high-converting 3-sentence outreach pitch email to a target blog owner for a guest post partnership.",
        "input": "Target Domain: techcrunch.com | Topic: Next.js 15 Performance & AI Agents",
        "output": "Hi TechCrunch Editor,\n\nI loved your recent coverage on AI automation trends. I've put together a technical breakdown on optimizing Next.js 15 web applications for autonomous AI agents that your developer audience will find actionable.\n\nWould you be open to reviewing a draft for a guest contribution?\n\nBest regards,\nAuthor"
    },
    {
        "instruction": "Draft a personalized, high-converting 3-sentence outreach pitch email to a target blog owner for a guest post partnership.",
        "input": "Target Domain: hackernoon.com | Topic: Automated Backlink Audit Algorithms",
        "output": "Hello HackerNoon Team,\n\nI'm pitching an in-depth guide on automated SEO auditing and parallel domain verification built with Python and FastAPI.\n\nLet me know if you'd be interested in publishing this as a guest post!\n\nCheers,\nAuthor"
    }
]

def generate_dataset():
    os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
    with open(DATASET_PATH, "w", encoding="utf-8") as f:
        for sample in TRAINING_SAMPLES:
            f.write(json.dumps(sample, ensure_ascii=False) + "\n")
    print(f"Dataset generated successfully at: {DATASET_PATH} ({len(TRAINING_SAMPLES)} samples)")

if __name__ == "__main__":
    generate_dataset()
