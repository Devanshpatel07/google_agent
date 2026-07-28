import asyncio
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routers import router
from backend.database.db import engine
from backend.database.models import Base
import logging

logging.basicConfig(level=logging.INFO)

# Critical fix: Ensure Playwright Windows support before anything else in the main thread
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

app = FastAPI(title="Backlink Hunter AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Auto-create tables for local simple scaffold without requiring alembic run initially
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Backlink Hunter AI Backend API", "docs": "/docs"}

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
