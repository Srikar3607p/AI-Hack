from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ComplaintAnalysisRequest(BaseModel):
    title: str = ""
    description: str
    voiceTranscript: Optional[str] = None
    images: Optional[List[str]] = []
    location: Optional[Dict[str, Any]] = None
    existingComplaints: Optional[List[Dict[str, Any]]] = []

class IntakeResponse(BaseModel):
    category: str
    issueType: str
    summary: str
    description: str
    severity: str
    confidence: float
    detectedLabels: List[str] = []
    safetyRisk: str = "Low"

class PriorityFactors(BaseModel):
    impact: float
    urgency: float
    affectedCitizens: float
    duration: float

class PriorityResponse(BaseModel):
    priority: str
    priorityScore: int
    factors: PriorityFactors
    explanation: str

class DuplicateCheckRequest(BaseModel):
    description: str
    category: str
    location: Optional[Dict[str, Any]] = None
    existingComplaints: List[Dict[str, Any]] = []

class DuplicateResponse(BaseModel):
    isDuplicate: bool
    similarityScore: float
    relatedComplaintId: Optional[str] = None
    explanation: str

class RoutingResponse(BaseModel):
    department: str
    team: str
    confidence: float
    reason: str

class VisionAnalysisRequest(BaseModel):
    image_url_or_base64: str
    complaintText: Optional[str] = ""

class VisionAnalysisResponse(BaseModel):
    detectedIssue: str
    category: str
    severity: str
    safetyRisk: str
    confidence: float
    visibleEvidence: str
    suggestedDepartment: str

class ResolutionVerificationRequest(BaseModel):
    complaintDescription: str
    category: str
    resolutionNotes: str
    beforeImages: Optional[List[str]] = []
    afterImages: Optional[List[str]] = []
    teamName: Optional[str] = "Maintenance Team"

class ResolutionVerificationResponse(BaseModel):
    verified: bool
    confidence: float
    verificationNotes: str
    citizenExplanation: str

class FullOrchestratedAnalysis(BaseModel):
    intake: IntakeResponse
    summary: str
    priority: PriorityResponse
    duplicateInfo: DuplicateResponse
    routing: RoutingResponse
    isAiAssisted: bool
    analysisType: str
