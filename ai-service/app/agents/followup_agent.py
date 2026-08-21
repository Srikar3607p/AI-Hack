from datetime import datetime, timezone
from typing import Dict, Any

def run_followup_agent(
    complaint_id: str,
    status: str,
    priority: str,
    created_at_iso: str,
    deadline_iso: str,
    last_updated_iso: str
) -> Dict[str, Any]:
    try:
        now = datetime.now(timezone.utc)
        created_at = datetime.fromisoformat(created_at_iso.replace('Z', '+00:00'))
        deadline = datetime.fromisoformat(deadline_iso.replace('Z', '+00:00'))
        
        total_duration = (deadline - created_at).total_seconds()
        elapsed_duration = (now - created_at).total_seconds()
        
        sla_percentage = round((elapsed_duration / total_duration) * 100, 1) if total_duration > 0 else 100.0
        remaining_hours = max(0.0, round((deadline - now).total_seconds() / 3600, 1))
        
        is_delayed = status in ["Submitted", "Assigned"] and sla_percentage >= 50.0
        needs_attention = sla_percentage >= 75.0 and status not in ["Resolved", "Closed"]
        
        suggestion = "On track for resolution within standard SLA."
        if is_delayed:
            suggestion = f"Case unacknowledged with {sla_percentage}% of SLA elapsed. Prompting field officer."
        elif needs_attention:
            suggestion = f"Approaching SLA deadline in {remaining_hours}h. Prioritize field work."

        return {
            "complaintId": complaint_id,
            "slaPercentageElapsed": sla_percentage,
            "remainingHours": remaining_hours,
            "isDelayed": is_delayed,
            "needsAttention": needs_attention,
            "followUpSuggestion": suggestion
        }
    except Exception as e:
        return {
            "complaintId": complaint_id,
            "slaPercentageElapsed": 50.0,
            "remainingHours": 12.0,
            "isDelayed": False,
            "needsAttention": False,
            "followUpSuggestion": f"Monitoring active: {str(e)}"
        }
