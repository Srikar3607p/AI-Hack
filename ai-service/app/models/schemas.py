"""Civic Aid AI Service — Models (Pydantic schemas for Phase 4 agents)."""

from pydantic import BaseModel
from typing import Optional, List, Any


class ComplaintInput(BaseModel):
    """Input payload sent from the Node backend to the AI service."""
    title: str
    description: str
    category: Optional[str] = None
    location: Optional[dict] = None
    affectedCitizens: Optional[int] = 1
    durationDays: Optional[int] = 0
    imageUrls: Optional[List[str]] = []
    existingComplaints: Optional[List[dict]] = []


class AIAnalysisOutput(BaseModel):
    """Full structured analysis returned by the AI orchestrator."""
    category: str
    subCategory: Optional[str] = None
    summary: str
    priorityScore: int
    priority: str
    priorityReason: str
    department: Optional[str] = None
    tags: Optional[List[str]] = []
    safetyHazard: bool = False
    duplicateDetected: bool = False
    masterComplaintId: Optional[str] = None
    analysisType: str  # "AI-assisted" | "Fallback analysis"
    agentsUsed: Optional[List[str]] = []
