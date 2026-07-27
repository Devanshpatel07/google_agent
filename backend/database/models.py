from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    project_id = Column(String, primary_key=True, index=True)
    url = Column(String, index=True)
    status = Column(String, default="queued") # queued, scraping, auditing, done, error
    error_message = Column(String, nullable=True)

    analysis = relationship("Analysis", back_populates="project", uselist=False)
    opportunities = relationship("Opportunity", back_populates="project")

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.project_id"))
    
    # On-page metrics
    title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    word_count = Column(Integer, default=0)
    internal_links = Column(Integer, default=0)
    external_links = Column(Integer, default=0)
    
    # Audit Errors JSON List
    seo_errors = Column(JSON, default=list)

    project = relationship("Project", back_populates="analysis")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.project_id"))
    domain = Column(String)
    url = Column(String)
    score = Column(Float, default=0.0)
    relevance = Column(String, default="")
    spam_risk = Column(String, default="Low")
    outreach_draft = Column(String, nullable=True)

    project = relationship("Project", back_populates="opportunities")
