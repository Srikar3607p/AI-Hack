import re
from typing import Dict, Any

CATEGORY_KEYWORDS = {
    "Roads & Potholes": [
        "pothole", "road", "crater", "asphalt", "tar", "footpath", "sidewalk", 
        "speed breaker", "divider", "pavement", "crack", "traffic light", "zebra crossing", "manhole open"
    ],
    "Drainage": [
        "drain", "drainage", "sewer", "sewage", "gutter", "waterlogging", "clogged drain", 
        "overflowing drain", "manhole overflow", "stormwater", "sludge", "stagnant water"
    ],
    "Waste Management": [
        "garbage", "trash", "waste", "dump", "dustbin", "litter", "debris", "dead animal", 
        "sweep", "overflowing bin", "stench", "rubbish", "refuse", "compost"
    ],
    "Water Supply": [
        "water supply", "pipe leak", "pipeline", "water leakage", "no water", "low pressure", 
        "dirty water", "contaminated water", "tap broken", "valve", "tanker", "drinking water"
    ],
    "Streetlights": [
        "streetlight", "street light", "lamp post", "pole light", "dark road", "bulb broken", 
        "flickering light", "lighting", "darkness", "light not working", "streetlamp"
    ],
    "Public Facilities": [
        "park", "public toilet", "bench", "bus stop", "community center", "playground", 
        "library", "foot overbridge", "fountain", "garden", "public gym", "monument"
    ]
}

def classify_complaint_fallback(text: str) -> Dict[str, Any]:
    lower_text = text.lower()
    scores = {}
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if re.search(r'\b' + re.escape(kw) + r'\b', lower_text))
        if score > 0:
            scores[category] = score
            
    if scores:
        best_category = max(scores, key=scores.get)
        confidence = min(0.85, 0.5 + (scores[best_category] * 0.1))
    else:
        best_category = "Other"
        confidence = 0.50

    # Determine specific issue type
    issue_type = "Civic Concern"
    if "pothole" in lower_text:
        issue_type = "Road Damage / Pothole"
    elif "garbage" in lower_text or "trash" in lower_text:
        issue_type = "Uncollected Garbage / Waste"
    elif "drain" in lower_text or "sewage" in lower_text or "waterlogging" in lower_text:
        issue_type = "Drainage Blockage / Sewage Overflow"
    elif "pipe" in lower_text or "water" in lower_text and "leak" in lower_text:
        issue_type = "Pipeline Leakage / Water Disruption"
    elif "streetlight" in lower_text or "light" in lower_text:
        issue_type = "Streetlight Outage / Malfunction"
    elif "park" in lower_text or "toilet" in lower_text:
        issue_type = "Public Facility Maintenance"

    # Severity analysis
    severe_words = ["danger", "hazard", "urgent", "accident", "injury", "fell", "broken", "critical", "overflowing", "deadly", "hospital"]
    has_severe = any(w in lower_text for w in severe_words)
    severity = "High" if has_severe else ("Medium" if len(text) > 40 else "Low")
    safety_risk = "High" if has_severe else ("Medium" if best_category in ["Roads & Potholes", "Drainage", "Streetlights"] else "Low")

    # Generate fallback summary (extract first 1-2 meaningful sentences)
    sentences = [s.strip() for s in text.replace('\n', ' ').split('.') if len(s.strip()) > 5]
    summary = sentences[0] if sentences else text[:120]
    if len(summary) > 120:
        summary = summary[:117] + "..."

    return {
        "category": best_category,
        "issueType": issue_type,
        "summary": summary,
        "description": text,
        "severity": severity,
        "safetyRisk": safety_risk,
        "confidence": confidence,
        "detectedLabels": [best_category, issue_type]
    }
