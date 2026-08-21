import re
from typing import Dict, Any

def calculate_priority_fallback(text: str, category: str) -> Dict[str, Any]:
    lower = text.lower()
    
    # Impact estimation (0 - 100)
    # High impact if main road, hospital, school, market, severe danger
    impact = 40.0
    if any(w in lower for w in ["main road", "highway", "hospital", "school", "market", "junction", "heavy traffic", "hundreds", "everyone", "entire area", "major"]):
        impact += 35.0
    elif any(w in lower for w in ["street", "lane", "colony", "apartment", "neighborhood"]):
        impact += 15.0
    if category in ["Roads & Potholes", "Drainage", "Water Supply"]:
        impact += 10.0
    impact = min(100.0, impact)

    # Urgency estimation (0 - 100)
    urgency = 35.0
    if any(w in lower for w in ["immediate", "urgent", "emergency", "danger", "accident", "injured", "fell", "hazard", "risk", "deadly", "electrocution", "contamination"]):
        urgency += 45.0
    elif any(w in lower for w in ["soon", "trouble", "difficulty", "stuck", "smell", "dark"]):
        urgency += 20.0
    urgency = min(100.0, urgency)

    # Affected citizens estimation (0 - 100)
    affected = 30.0
    if any(w in lower for w in ["hundreds", "thousands", "all residents", "entire street", "public", "commuters", "students"]):
        affected = 85.0
    elif any(w in lower for w in ["many", "neighbors", "several", "families", "pedestrians", "vehicles"]):
        affected = 60.0
    affected = min(100.0, affected)

    # Duration estimation (0 - 100)
    duration = 25.0
    if any(w in lower for w in ["months", "month", "weeks", "two weeks", "many days", "long time", "repeatedly"]):
        duration = 80.0
    elif any(w in lower for w in ["days", "3 days", "4 days", "week", "yesterday"]):
        duration = 50.0
    duration = min(100.0, duration)

    # Formula: 40% Impact + 35% Urgency + 15% Affected + 10% Duration
    priority_score = int(round((0.40 * impact) + (0.35 * urgency) + (0.15 * affected) + (0.10 * duration)))
    priority_score = max(5, min(100, priority_score))

    if priority_score >= 81:
        priority_level = "Critical"
    elif priority_score >= 61:
        priority_level = "High"
    elif priority_score >= 31:
        priority_level = "Medium"
    else:
        priority_level = "Low"

    # Explainability string
    explanation_parts = []
    if urgency >= 65:
        explanation_parts.append("presents immediate safety risks or emergency conditions")
    elif impact >= 65:
        explanation_parts.append("affects a high-traffic area or critical infrastructure")
    if affected >= 60:
        explanation_parts.append("impacts a substantial number of citizens/commuters")
    if duration >= 60:
        explanation_parts.append("has been persistent for an extended duration")

    if explanation_parts:
        explanation = f"{priority_level} priority because the issue " + " and ".join(explanation_parts) + "."
    else:
        explanation = f"{priority_level} priority based on standard municipal assessment for {category} with moderate localized impact."

    return {
        "priority": priority_level,
        "priorityScore": priority_score,
        "factors": {
            "impact": round(impact, 1),
            "urgency": round(urgency, 1),
            "affectedCitizens": round(affected, 1),
            "duration": round(duration, 1)
        },
        "explanation": explanation
    }
