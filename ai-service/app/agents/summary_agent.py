import json
import logging
from typing import Optional
from groq import Groq
from ..config import GROQ_API_KEY, AI_MODEL

logger = logging.getLogger("civic-aid-ai")

def run_summary_agent(description: str, category: str = "", issue_type: str = "") -> str:
    if not GROQ_API_KEY:
        sentences = [s.strip() for s in description.replace('\n', ' ').split('.') if len(s.strip()) > 5]
        summary = sentences[0] if sentences else description[:120]
        if len(summary) > 120:
            summary = summary[:117] + "..."
        return summary

    try:
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"""You are a Municipal Summarization Agent.
Summarize the following citizen complaint into exactly 1 clear, actionable, professional sentence (under 25 words) preserving key location and safety specifics.
Category: {category}
Issue Type: {issue_type}
Original Complaint: \"\"\"{description}\"\"\"

Return ONLY JSON:
{{"summary": "your 1 sentence summary"}}"""

        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        return data.get("summary", description[:100])
    except Exception as e:
        logger.warning(f"Summary agent error: {e}. Using fallback.")
        sentences = [s.strip() for s in description.replace('\n', ' ').split('.') if len(s.strip()) > 5]
        return sentences[0] if sentences else description[:100]
