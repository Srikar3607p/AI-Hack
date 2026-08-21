import json
import logging
from typing import Dict, Any
from groq import Groq
from ..config import GROQ_API_KEY, AI_MODEL, DEPARTMENTS
from ..fallback.rule_router import route_complaint_fallback

logger = logging.getLogger("civic-aid-ai")

def run_routing_agent(category: str, issue_type: str, description: str = "") -> Dict[str, Any]:
    if not GROQ_API_KEY:
        return route_complaint_fallback(category, issue_type)

    try:
        client = Groq(api_key=GROQ_API_KEY)
        dept_names = [d["name"] for d in DEPARTMENTS]
        prompt = f"""You are the Civic Department Routing Agent.
Assign the complaint to the most appropriate municipal department and recommend a specialized field team.

Available Departments: {dept_names}
Category: {category}
Issue Type: {issue_type}
Description: \"\"\"{description}\"\"\"

Return ONLY valid JSON matching this schema:
{{
  "department": "Department name from the available list",
  "team": "Recommended specialized unit name (e.g., 'Road Maintenance & Pothole Rapid Unit')",
  "confidence": float between 0.0 and 1.0,
  "reason": "Explainable justification for this routing assignment"
}}"""

        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        if data.get("department") not in dept_names:
            data["department"] = route_complaint_fallback(category, issue_type)["department"]
        return data
    except Exception as e:
        logger.warning(f"Routing agent Groq call failed: {e}. Falling back to rule-based router.")
        return route_complaint_fallback(category, issue_type)
