from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any, Optional
from backend.agents.nodes import (
    scrap_node, audit_node, backlink_discovery_node,
    verification_node, scoring_node, outreach_node
)
import logging

logger = logging.getLogger(__name__)

class GraphState(TypedDict, total=False):
    url: str
    project_id: str
    status: str
    error: Optional[str]
    title: Optional[str]
    meta_description: Optional[str]
    word_count: Optional[int]
    internal_links: Optional[int]
    external_links: Optional[int]
    seo_errors: Optional[List[Dict[str, Any]]]
    candidates: Optional[List[Dict[str, str]]]
    verified_candidates: Optional[List[Dict[str, str]]]
    scored_opportunities: Optional[List[Dict[str, Any]]]
    final_opportunities: Optional[List[Dict[str, Any]]]

def router(state: GraphState) -> str:
    if "error" in state and state["error"]:
        return "end"
    return "continue"

workflow = StateGraph(GraphState)

workflow.add_node("scraper", scrap_node)
workflow.add_node("auditor", audit_node)
workflow.add_node("discovery", backlink_discovery_node)
workflow.add_node("verifier", verification_node)
workflow.add_node("scorer", scoring_node)
workflow.add_node("outreach", outreach_node)

workflow.set_entry_point("scraper")

workflow.add_conditional_edges("scraper", router, {"continue": "auditor", "end": END})
workflow.add_conditional_edges("auditor", router, {"continue": "discovery", "end": END})
workflow.add_conditional_edges("discovery", router, {"continue": "verifier", "end": END})
workflow.add_conditional_edges("verifier", router, {"continue": "scorer", "end": END})
workflow.add_conditional_edges("scorer", router, {"continue": "outreach", "end": END})
workflow.add_edge("outreach", END)

app_graph = workflow.compile()

async def run_pipeline(project_id: str, url: str) -> GraphState:
    logger.info(f"Starting pipeline for project {project_id}, URL: {url}")
    initial_state = {"url": url, "project_id": project_id, "status": "scraping"}
    result = await app_graph.ainvoke(initial_state)
    return result
