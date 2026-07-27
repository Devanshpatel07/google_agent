import logging
import json
import os
from typing import Dict, Any, List
from bs4 import BeautifulSoup
from dotenv import load_dotenv

from backend.crawler.playwright_setup import fetch_html

# Load API keys
load_dotenv()

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from duckduckgo_search import DDGS
import aiohttp

logger = logging.getLogger(__name__)

class SEOIssue(BaseModel):
    issue: str = Field(description="Short title of the SEO issue")
    severity: str = Field(description="high, medium, or low")
    explanation: str = Field(description="Explanation of the issue")
    fix_recommendation: str = Field(description="Actionable fix recommendation")

class SEOReport(BaseModel):
    seo_errors: List[SEOIssue]

async def scrap_node(state: Dict) -> Dict:
    url = state.get("url")
    logger.info(f"Scraping URL: {url}")
    
    try:
        html = await fetch_html(url)
        soup = BeautifulSoup(html, "html.parser")
        
        title = soup.title.string if soup.title else ""
        meta_desc = ""
        meta_tag = soup.find("meta", {"name": "description"})
        if meta_tag:
            meta_desc = meta_tag.get("content", "")
            
        words = len(soup.get_text().split())
        links = soup.find_all("a")
        
        # Truncate HTML to avoid passing 100k tokens to LLM
        truncated_text = soup.get_text(separator=' ', strip=True)[:10000]
        
        return {
            "title": title,
            "meta_description": meta_desc,
            "word_count": words,
            "html": truncated_text, 
            "internal_links": len([l for l in links if url in str(l.get("href"))]),
            "external_links": len([l for l in links if url not in str(l.get("href")) and str(l.get("href")).startswith("http")]),
            "status": "auditing"
        }
    except Exception as e:
        logger.error(f"Scrape Error: {e}")
        return {"error": str(e), "status": "error"}

async def audit_node(state: Dict) -> Dict:
    logger.info("Auditing content...")
    if "error" in state:
        return state
        
    try:
        model_name = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        llm = ChatGroq(model=model_name, temperature=0)
        structured_llm = llm.with_structured_output(SEOReport, method="json_mode")
        
        prompt = f"""
        You are an elite SEO auditor. Analyze the following webpage text and metrics.
        Identify On-Page SEO errors (like missing H1, short meta description, weak word count, etc).
        
        Title: {state.get("title")}
        Meta Description: {state.get("meta_description")}
        Word Count: {state.get("word_count")}
        
        Body text snapshot:
        {state.get("html", "")[:2000]}

        Return ONLY a JSON object matching this format:
        {{
          "seo_errors": [
            {{
              "issue": "Short title of issue",
              "severity": "high",
              "explanation": "Detailed explanation of the issue",
              "fix_recommendation": "Actionable fix recommendation"
            }}
          ]
        }}
        """
        
        result = await structured_llm.ainvoke(prompt)
        if hasattr(result, "seo_errors"):
            seo_errors = [issue.dict() for issue in result.seo_errors]
        elif isinstance(result, dict) and "seo_errors" in result:
            seo_errors = result["seo_errors"]
        else:
            seo_errors = []
        
        return {"seo_errors": seo_errors, "status": "finding_backlinks"}
    except Exception as e:
        # Fallback if OPENAI_API_KEY fails or is missing
        logger.error(f"Audit LLM Error: {e}")
        return {"seo_errors": [{"issue": "API Key Missing or Error", "severity": "high", "explanation": str(e), "fix_recommendation": "Check backend/.env for GROQ_API_KEY"}], "status": "finding_backlinks"}

async def backlink_discovery_node(state: Dict) -> Dict:
    logger.info("Discovering backlinks...")
    if "error" in state:
        return state
        
    keyword = str(state.get("title", "")).split()[0] if state.get("title") else "technology"
    search_query = f'{keyword} "write for us" OR "guest post"'
    
    candidates = []
    try:
        results = DDGS().text(search_query, max_results=5)
        for r in results:
            candidates.append({"domain": r.get('title', 'Unknown'), "url": r.get('href')})
    except Exception as e:
        logger.error(f"Search error: {e}")
        
    return {"candidates": candidates[:5], "status": "verifying"}

async def verification_node(state: Dict) -> Dict:
    logger.info("Verifying backlinks...")
    if "error" in state:
        return state
        
    verified = []
    async with aiohttp.ClientSession() as session:
        for c in state.get("candidates", []):
            try:
                # Fast HEAD request to check if site is live
                async with session.head(c["url"], timeout=5) as response:
                    status = response.status
                if status < 400:
                    verified.append(c)
            except:
                pass
                
    return {"verified_candidates": verified, "status": "scoring"}

async def scoring_node(state: Dict) -> Dict:
    logger.info("Scoring backlinks...")
    if "error" in state:
        return state
        
    scored = []
    for idx, c in enumerate(state.get("verified_candidates", [])):
        domain_name = c["url"].split("//")[-1].split("/")[0]
        scored.append({
            "domain": domain_name,
            "url": c["url"],
            "score": 90.0 - (idx * 5),
            "relevance": "High",
            "spam_risk": "Low" if idx < 3 else "Medium"
        })
    return {"scored_opportunities": scored, "status": "drafting_outreach"}

async def outreach_node(state: Dict) -> Dict:
    logger.info("Drafting outreach...")
    if "error" in state:
        return state
        
    try:
        model_name = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        llm = ChatGroq(model=model_name, temperature=0.7)
        opportunities = state.get("scored_opportunities", [])
        for opp in opportunities:
            prompt = f"Write a very short, polite 3-sentence email pitching a guest post to the owner of {opp['domain']}. Return only the email content."
            res = await llm.ainvoke(prompt)
            opp["outreach_draft"] = res.content
        return {"final_opportunities": opportunities, "status": "done"}
    except:
        opportunities = state.get("scored_opportunities", [])
        for opp in opportunities:
            opp["outreach_draft"] = f"Hi,\n\nI loved your recent posts on {opp['domain']}. Would you be open to a guest contribution?\n\nThanks!"
        return {"final_opportunities": opportunities, "status": "done"}
