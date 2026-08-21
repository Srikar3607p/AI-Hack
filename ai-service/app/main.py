import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from .config import GROQ_API_KEY, AI_MODEL, PORT, HOST
from .schemas.ai_schemas import (
    ComplaintAnalysisRequest,
    DuplicateCheckRequest,
    ResolutionVerificationRequest,
    FullOrchestratedAnalysis
)
from .orchestrator import ai_orchestrator
from .agents.intake_agent import run_intake_agent
from .agents.priority_agent import run_priority_agent
from .agents.routing_agent import run_routing_agent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("civic-aid-fastapi")

app = FastAPI(
    title="Civic Aid - Agentic AI Service",
    description="Intelligent Civic Complaint-to-Resolution Agentic AI Microservice",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "service": "Civic Aid AI Service",
        "status": "healthy",
        "groqConfigured": bool(GROQ_API_KEY),
        "model": AI_MODEL,
        "mode": "Live Groq AI" if GROQ_API_KEY else "Deterministic Rule-based Fallback Engine",
    }


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Civic Aid AI Intelligence Service",
        "groqConfigured": bool(GROQ_API_KEY),
        "model": AI_MODEL,
        "mode": "Live Groq AI" if GROQ_API_KEY else "Deterministic Rule-based Fallback Engine"
    }

@app.post("/ai/analyze")
def analyze_complaint(req: ComplaintAnalysisRequest):
    try:
        result = ai_orchestrator.orchestrate_complaint_intake(
            description=req.description,
            title=req.title,
            voice_transcript=req.voiceTranscript,
            images=req.images,
            location=req.location,
            existing_complaints=req.existingComplaints
        )
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Error in orchestrated analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/classify")
def classify_endpoint(req: Dict[str, Any]):
    text = req.get("description", "")
    title = req.get("title", "")
    res = run_intake_agent(description=text, title=title)
    return {"success": True, "data": res}

@app.post("/ai/prioritize")
def prioritize_endpoint(req: Dict[str, Any]):
    text = req.get("description", "")
    category = req.get("category", "Other")
    issue_type = req.get("issueType", "")
    res = run_priority_agent(description=text, category=category, issue_type=issue_type)
    return {"success": True, "data": res}

@app.post("/ai/duplicate")
def duplicate_endpoint(req: DuplicateCheckRequest):
    res = ai_orchestrator.orchestrate_complaint_intake(
        description=req.description,
        existing_complaints=req.existingComplaints,
        location=req.location
    )["duplicateInfo"]
    return {"success": True, "data": res}

@app.post("/ai/route")
def route_endpoint(req: Dict[str, Any]):
    category = req.get("category", "Other")
    issue_type = req.get("issueType", "")
    desc = req.get("description", "")
    res = run_routing_agent(category=category, issue_type=issue_type, description=desc)
    return {"success": True, "data": res}

@app.post("/ai/resolve")
def resolve_endpoint(req: ResolutionVerificationRequest):
    res = ai_orchestrator.verify_resolution(
        complaint_description=req.complaintDescription,
        category=req.category,
        resolution_notes=req.resolutionNotes,
        before_images=req.beforeImages,
        after_images=req.afterImages,
        team_name=req.teamName
    )
    return {"success": True, "data": res}

@app.post("/ai/followup")
def followup_endpoint(req: Dict[str, Any]):
    res = ai_orchestrator.assess_followup(req)
    return {"success": True, "data": res}

@app.post("/ai/escalate")
def escalate_endpoint(req: Dict[str, Any]):
    res = ai_orchestrator.evaluate_escalation(req)
    return {"success": True, "data": res}
