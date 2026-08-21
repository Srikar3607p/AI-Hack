"""
Civic Aid AI Service — Fallback Service
Rule-based deterministic analysis used when Groq is unavailable.
This interface is the contract that Phase 4 agents will call.
"""

from typing import Any


def classify_complaint(title: str, description: str) -> dict[str, Any]:
    """
    Returns a structured classification using keyword rules.
    Phase 4 agents will call this when Groq fails.
    """
    # TODO Phase 4: port rule_classifier.py logic here
    return {
        "category": "Other",
        "subCategory": "General",
        "tags": [],
        "safetyHazard": False,
        "analysisType": "Fallback analysis",
    }


def prioritize_complaint(data: dict) -> dict[str, Any]:
    """
    Returns a priority score using the 4-factor formula.
    Phase 4 will refine weights from impact/urgency/affected/duration.
    """
    return {
        "priorityScore": 40,
        "priority": "Medium",
        "priorityReason": "Default medium priority assigned by fallback engine.",
        "analysisType": "Fallback analysis",
    }


def route_complaint(category: str, location: dict) -> dict[str, Any]:
    """Returns department and team assignment based on category."""
    CATEGORY_DEPT_MAP = {
        "Roads & Potholes": "Roads & Infrastructure",
        "Drainage": "Drainage",
        "Waste Management": "Sanitation",
        "Water Supply": "Water Supply",
        "Streetlights": "Electrical",
        "Public Facilities": "Public Facilities",
    }
    return {
        "department": CATEGORY_DEPT_MAP.get(category, "Public Facilities"),
        "analysisType": "Fallback analysis",
    }
