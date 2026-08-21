from typing import Dict, Any

ROUTING_MAP = {
    "Roads & Potholes": {
        "department": "Roads & Infrastructure",
        "team": "Road Maintenance & Pothole Rapid Unit",
        "reason": "Complaint concerns asphalt, road surface integrity, or traffic hazards."
    },
    "Drainage": {
        "department": "Drainage",
        "team": "Stormwater & Desilting Response Unit",
        "reason": "Complaint involves sewer lines, blocked drains, or localized waterlogging."
    },
    "Waste Management": {
        "department": "Sanitation",
        "team": "Solid Waste & Cleanliness Squad",
        "reason": "Complaint relates to garbage accumulation, open dump sites, or sanitation."
    },
    "Water Supply": {
        "department": "Water Supply",
        "team": "Pipeline Repair & Supply Ops",
        "reason": "Complaint involves water line leakage, disruption, or contaminated supply."
    },
    "Streetlights": {
        "department": "Electrical",
        "team": "Streetlight & Power Maintenance Crew",
        "reason": "Complaint involves non-functional streetlights or electrical infrastructure."
    },
    "Public Facilities": {
        "department": "Public Facilities",
        "team": "Civic Amenities & Parks Team",
        "reason": "Complaint involves public parks, toilets, community structures, or bus shelters."
    },
    "Other": {
        "department": "Public Facilities",
        "team": "General Civic Grievance Team",
        "reason": "General civic issue requiring municipal assessment."
    }
}

def route_complaint_fallback(category: str, issue_type: str) -> Dict[str, Any]:
    matched = ROUTING_MAP.get(category, ROUTING_MAP["Other"])
    return {
        "department": matched["department"],
        "team": matched["team"],
        "confidence": 0.88,
        "reason": f"Assigned to {matched['department']} ({matched['team']}) because the issue is classified under {category}."
    }
