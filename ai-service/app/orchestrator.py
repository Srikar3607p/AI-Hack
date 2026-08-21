import logging
from typing import Dict, Any, List, Optional
from .agents.intake_agent import run_intake_agent
from .agents.summary_agent import run_summary_agent
from .agents.priority_agent import run_priority_agent
from .agents.duplicate_agent import run_duplicate_agent
from .agents.routing_agent import run_routing_agent
from .agents.resolution_agent import run_resolution_agent
from .agents.followup_agent import run_followup_agent
from .agents.escalation_agent import run_escalation_agent

logger = logging.getLogger("civic-aid-ai")

class AIOrchestrator:
    def __init__(self):
        pass

    def orchestrate_complaint_intake(
        self,
        description: str,
        title: str = "",
        voice_transcript: Optional[str] = None,
        images: Optional[List[str]] = None,
        location: Optional[Dict[str, Any]] = None,
        existing_complaints: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Coordinates the multi-agent intake workflow:
        Intake Agent -> Summarizer Agent -> Priority Agent -> Duplicate Agent -> Routing Agent
        """
        logger.info(f"AI Orchestrator: Beginning analysis for complaint: '{title}'")
        
        # Step 1: Intake & Classification
        intake_res = run_intake_agent(
            description=description,
            voice_transcript=voice_transcript,
            title=title
        )
        category = intake_res.get("category", "Other")
        issue_type = intake_res.get("issueType", "Civic Issue")
        is_ai_assisted = intake_res.get("isAiAssisted", False)

        # Step 2: Summarization
        summary_text = intake_res.get("summary") or run_summary_agent(
            description=description,
            category=category,
            issue_type=issue_type
        )

        # Step 3: Priority Calculation (Explainable 4-Factor Formula)
        priority_res = run_priority_agent(
            description=description,
            category=category,
            issue_type=issue_type
        )

        # Step 4: Duplicate & Proximity Detection
        duplicate_res = run_duplicate_agent(
            description=description,
            category=category,
            location=location,
            existing_complaints=existing_complaints or []
        )

        # Step 5: Department & Team Routing
        routing_res = run_routing_agent(
            category=category,
            issue_type=issue_type,
            description=description
        )

        analysis_type = "AI-assisted" if is_ai_assisted else "Fallback analysis"

        return {
            "intake": intake_res,
            "summary": summary_text,
            "priority": priority_res,
            "duplicateInfo": duplicate_res,
            "routing": routing_res,
            "isAiAssisted": is_ai_assisted,
            "analysisType": analysis_type
        }

    def verify_resolution(
        self,
        complaint_description: str,
        category: str,
        resolution_notes: str,
        before_images: Optional[List[str]] = None,
        after_images: Optional[List[str]] = None,
        team_name: Optional[str] = "Municipal Response Team"
    ) -> Dict[str, Any]:
        return run_resolution_agent(
            complaint_description=complaint_description,
            category=category,
            resolution_notes=resolution_notes,
            before_images=before_images,
            after_images=after_images,
            team_name=team_name
        )

    def assess_followup(self, complaint_data: Dict[str, Any]) -> Dict[str, Any]:
        return run_followup_agent(
            complaint_id=complaint_data.get("complaintId", ""),
            status=complaint_data.get("status", ""),
            priority=complaint_data.get("priority", ""),
            created_at_iso=complaint_data.get("createdAt", ""),
            deadline_iso=complaint_data.get("deadline", ""),
            last_updated_iso=complaint_data.get("updatedAt", "")
        )

    def evaluate_escalation(self, complaint_data: Dict[str, Any]) -> Dict[str, Any]:
        return run_escalation_agent(
            complaint_id=complaint_data.get("complaintId", ""),
            title=complaint_data.get("title", ""),
            category=complaint_data.get("category", ""),
            priority=complaint_data.get("priority", ""),
            department=complaint_data.get("department", "Municipal Services"),
            hours_overdue=float(complaint_data.get("hoursOverdue", 0)),
            status=complaint_data.get("status", "")
        )

ai_orchestrator = AIOrchestrator()
