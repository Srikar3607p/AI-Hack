"""
Civic Aid AI Service — API Router
All HTTP endpoints are registered here and mounted in main.py.
Phase 4/5 will add full agent invocation endpoints.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    return {"service": "Civic Aid AI Service", "status": "healthy"}


@router.get("/")
async def root():
    return {
        "service": "Civic Aid AI Service",
        "version": "1.0.0",
        "description": "AI Orchestrator with 8 Specialized Civic Analysis Agents",
        "phase": "Phase 1 — Foundation",
        "endpoints": {
            "health": "/health",
            "analyze": "/ai/analyze  (Phase 4+)",
        },
    }
