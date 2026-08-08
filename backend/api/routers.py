from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, HttpUrl
import uuid
from backend.database.db import get_db
from backend.database.models import Project, Analysis, Opportunity
from backend.agents.graph import run_pipeline
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ProjectRequest(BaseModel):
    url: HttpUrl

class ProjectResponse(BaseModel):
    project_id: str

async def process_project_task(project_id: str, url: str, db: AsyncSession):
    try:
        # Run graph
        result = await run_pipeline(project_id, url)
        
        # Update DB with results
        project = await db.get(Project, project_id)
        if not project:
            return
            
        if result.get("error"):
            project.status = "error"
            project.error_message = result.get("error")
            await db.commit()
            return
            
        project.status = "done"
        
        # Save Analysis
        analysis = Analysis(
            project_id=project_id,
            title=result.get("title", ""),
            meta_description=result.get("meta_description", ""),
            word_count=result.get("word_count", 0),
            internal_links=result.get("internal_links", 0),
            external_links=result.get("external_links", 0),
            seo_errors=result.get("seo_errors", [])
        )
        db.add(analysis)
        
        # Save Opportunities
        for opp in result.get("final_opportunities", []):
            o = Opportunity(
                project_id=project_id,
                domain=opp["domain"],
                url=opp["url"],
                score=opp["score"],
                relevance=opp["relevance"],
                spam_risk=opp["spam_risk"],
                outreach_draft=opp.get("outreach_draft", "")
            )
            db.add(o)
            
        await db.commit()
    except Exception as e:
        logger.error(f"Pipeline error: {e}")
        project = await db.get(Project, project_id)
        if project:
            project.status = "error"
            project.error_message = str(e)
            await db.commit()

@router.get("/projects")
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    projects = result.scalars().all()
    return [{"project_id": p.project_id, "url": p.url, "status": p.status, "created_at": p.created_at} for p in projects]

@router.post("/projects", response_model=ProjectResponse)
async def create_project(req: ProjectRequest, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    project_id = str(uuid.uuid4())
    new_project = Project(project_id=project_id, url=str(req.url), status="queued")
    db.add(new_project)
    await db.commit()
    
    # Kick off background pipeline
    background_tasks.add_task(process_project_task, project_id, str(req.url), db)
    return {"project_id": project_id}

@router.get("/projects/{project_id}/status")
async def get_status(project_id: str, db: AsyncSession = Depends(get_db)):
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": project.status, "error_message": project.error_message}

@router.get("/projects/{project_id}/seo-audit")
async def get_seo_audit(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analysis).where(Analysis.project_id == project_id))
    analysis = result.scalars().first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found or still processing")
        
    return {
        "metrics": {
            "title": analysis.title,
            "meta_description": analysis.meta_description,
            "word_count": analysis.word_count,
            "internal_links": analysis.internal_links,
            "external_links": analysis.external_links
        },
        "issues": analysis.seo_errors
    }

@router.get("/projects/{project_id}/opportunities")
async def get_opportunities(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Opportunity).where(Opportunity.project_id == project_id))
    opportunities = result.scalars().all()
    
    return [
        {
            "id": o.id,
            "domain": o.domain,
            "url": o.url,
            "score": o.score,
            "relevance": o.relevance,
            "spam_risk": o.spam_risk,
            "outreach_draft": o.outreach_draft
        }
        for o in opportunities
    ]
