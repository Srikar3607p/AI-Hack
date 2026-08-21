import json
import logging
from typing import Dict, Any
from groq import Groq
from ..config import GROQ_API_KEY, AI_MODEL

logger = logging.getLogger("civic-aid-ai")

def run_escalation_agent(
    complaint_id: str,
    title: str,
    category: str,
    priority: str,
    department: str,
    hours_overdue: float,
    status: str
) -> Dict[str, Any]:
    # Determine escalation tier
    if hours_overdue > 48 or priority == "Critical":
        escalation_tier = "Tier 3 - Super Admin / Department Head"
    elif hours_overdue > 24 or priority == "High":
        escalation_tier = "Tier 2 - Zonal Supervisor"
    else:
        escalation_tier = "Tier 1 - Ward Lead Officer"

    default_summary = f"Case {complaint_id} ({category}) is {round(hours_overdue, 1)} hours overdue. Assigned to {department}. Priority: {priority}."

    if not GROQ_API_KEY:
        return {
            "isEscalated": True,
            "escalationTier": escalation_tier,
            "hoursOverdue": hours_overdue,
            "executiveBrief": default_summary,
            "recommendedAction": "Reassign to rapid response unit and notify zonal supervisor."
        }

    try:
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"""You are the Municipal Escalation Intelligence Agent.
A civic complaint has breached its SLA deadline. Generate an executive supervisory escalation brief.

Complaint ID: {complaint_id}
Title: {title}
Category: {category}
Priority: {priority}
Department: {department}
Hours Overdue: {hours_overdue}
Status: {status}

Return ONLY valid JSON matching this schema:
{{
  "isEscalated": true,
  "escalationTier": "{escalation_tier}",
  "hoursOverdue": {hours_overdue},
  "executiveBrief": "2-sentence executive summary explaining the delay risk and civic impact",
  "recommendedAction": "Specific actionable intervention for supervisors"
}}"""

        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        return data
    except Exception as e:
        logger.warning(f"Escalation agent Groq call error: {e}. Using deterministic brief.")
        return {
            "isEscalated": True,
            "escalationTier": escalation_tier,
            "hoursOverdue": hours_overdue,
            "executiveBrief": default_summary,
            "recommendedAction": "Immediate supervisor review and reallocation of field resources."
        }
