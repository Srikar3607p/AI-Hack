"""Civic Aid AI Utils — shared helper functions for agents."""

import re


def extract_json_from_text(text: str) -> str:
    """
    Extracts the first JSON block from a string.
    Used to parse model responses that wrap JSON in prose.
    """
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text


def clamp(value: float, min_val: float = 0, max_val: float = 100) -> float:
    """Clamps a numeric value to [min_val, max_val]."""
    return max(min_val, min(max_val, value))
