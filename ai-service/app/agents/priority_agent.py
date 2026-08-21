import json
import logging
from typing import Dict, Any
from groq import Groq
from ..config import GROQ_API_KEY, AI_MODEL
from ..fallback.rule_prioritizer import calculate_priority_fallback

logger = logging.getLogger("civic-aid-ai")

def run_priority_agent(description: str, category: str, issue_type: str = "") -> Dict[str, Any]:
    if not GROQ_API_KEY:
        return calculate_priority_fallback(description, category)

    try:
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"""You are the Civic Prioritization Agent.
Calculate an explainable municipal priority score for the complaint using this exact formula:
Priority Score = (40% * Impact) + (35% * Urgency) + (15% * Affected Citizens) + (10% * Duration)
Each factor must be a score from 0 to 100.
Normalized Score Thresholds:
0-30: Low
31-60: Medium
61-80: High
81-100: Critical

Category: {category}
Issue Type: {issue_type}
Complaint: \"\"\"{description}\"\"\"

Return ONLY valid JSON matching this schema:
{{
  "priority": "Low | Medium | High | Critical",
  "priorityScore": int (0 to 100),
  "factors": {{
    "impact": float (0-100),
    "urgency": float (0-100),
    "affectedCitizens": float (0-100),
    "duration": float (0-100)
  }},
  "explanation": "Clear, human-readable justification (e.g., 'High priority because the issue creates a public safety risk and affects a frequently used road.')"
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
        logger.warning(f"Priority agent Groq call failed: {e}. Falling back to rule-based prioritizer.")
        return calculate_priority_fallback(description, category)
