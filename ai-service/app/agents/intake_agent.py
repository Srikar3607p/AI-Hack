import json
import logging
from typing import Dict, Any, Optional
from groq import Groq
from ..config import GROQ_API_KEY, AI_MODEL, SUPPORTED_CATEGORIES
from ..fallback.rule_classifier import classify_complaint_fallback

logger = logging.getLogger("civic-aid-ai")

def run_intake_agent(description: str, voice_transcript: Optional[str] = None, title: Optional[str] = "") -> Dict[str, Any]:
    combined_text = f"{title}. {description}".strip()
    if voice_transcript:
        combined_text += f" (Voice transcript: {voice_transcript})"

    if not GROQ_API_KEY:
        res = classify_complaint_fallback(combined_text)
        res["isAiAssisted"] = False
        return res

    try:
        client = Groq(api_key=GROQ_API_KEY)
        categories_str = ", ".join(SUPPORTED_CATEGORIES)
        prompt = f"""You are the Civic Intake & Classification Agent for a municipal government platform.
Analyze the citizen complaint below and return ONLY valid JSON matching this schema:
{{
  "category": "One of: {categories_str}",
  "issueType": "Specific civic issue title (e.g., Deep Pothole Hazard, Sewage Overflow, Streetlight Outage)",
  "summary": "1-sentence concise, action-oriented summary for municipal officers",
  "description": "{description}",
  "severity": "Low | Medium | High",
  "safetyRisk": "Low | Medium | High",
  "confidence": float between 0.0 and 1.0,
  "detectedLabels": ["list", "of", "3-5", "keywords"]
}}

Citizen Complaint:
\"\"\"{combined_text}\"\"\"

Do not invent categories outside the provided list. Return JSON only."""

        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        if data.get("category") not in SUPPORTED_CATEGORIES:
            data["category"] = "Other"
        data["isAiAssisted"] = True
        return data
    except Exception as e:
        logger.warning(f"Intake agent Groq API call failed: {e}. Using deterministic fallback.")
        res = classify_complaint_fallback(combined_text)
        res["isAiAssisted"] = False
        return res
