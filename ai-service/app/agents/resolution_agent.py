import json
import logging
from typing import Dict, Any, List, Optional
from groq import Groq
from ..config import GROQ_API_KEY, AI_MODEL
from ..fallback.rule_verifier import verify_resolution_fallback

logger = logging.getLogger("civic-aid-ai")

def run_resolution_agent(
    complaint_description: str,
    category: str,
    resolution_notes: str,
    before_images: Optional[List[str]] = None,
    after_images: Optional[List[str]] = None,
    team_name: Optional[str] = "Municipal Response Team"
) -> Dict[str, Any]:
    if not GROQ_API_KEY:
        return verify_resolution_fallback(
            description=complaint_description,
            category=category,
            resolution_notes=resolution_notes,
            before_images=before_images,
            after_images=after_images,
            team_name=team_name
        )

    try:
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"""You are the Civic Resolution Verification & Citizen Communications Agent.
An officer has completed work on a complaint. Verify the work based on notes and context, and write a clear, polite, transparent explanation for the citizen.

Original Complaint: \"\"\"{complaint_description}\"\"\"
Category: {category}
Field Team: {team_name}
Officer Resolution Notes: \"\"\"{resolution_notes}\"\"\"
Has After Image Evidence: {bool(after_images and len(after_images) > 0)}

Return ONLY valid JSON matching this schema:
{{
  "verified": true or false,
  "confidence": float between 0.0 and 1.0,
  "verificationNotes": "Brief internal verification summary for audit",
  "citizenExplanation": "Polite, human-readable 2-3 sentence explanation to the citizen detailing what happened, what action was taken by {team_name}, and completion details."
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
        logger.warning(f"Resolution agent Groq call error: {e}. Using fallback.")
        return verify_resolution_fallback(
            description=complaint_description,
            category=category,
            resolution_notes=resolution_notes,
            before_images=before_images,
            after_images=after_images,
            team_name=team_name
        )
