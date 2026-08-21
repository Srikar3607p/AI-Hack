import math
import re
from typing import Dict, Any, List, Optional

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000  # Earth radius in meters
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (math.sin(dLat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def text_jaccard_ngram_similarity(text1: str, text2: str) -> float:
    # Tokenize words + 3-grams for robust semantic & keyword matching
    def get_tokens(text: str):
        words = set(re.findall(r'\w{3,}', text.lower()))
        # Add 3-grams
        cleaned = re.sub(r'\s+', ' ', text.lower())
        ngrams = set(cleaned[i:i+3] for i in range(len(cleaned) - 2))
        return words.union(ngrams)

    tokens1 = get_tokens(text1)
    tokens2 = get_tokens(text2)
    if not tokens1 or not tokens2:
        return 0.0
    intersection = len(tokens1.intersection(tokens2))
    union = len(tokens1.union(tokens2))
    return intersection / union if union > 0 else 0.0

def run_duplicate_agent(
    description: str,
    category: str,
    location: Optional[Dict[str, Any]] = None,
    existing_complaints: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    if not existing_complaints:
        return {
            "isDuplicate": False,
            "similarityScore": 0.0,
            "relatedComplaintId": None,
            "explanation": "No existing active complaints found for comparison."
        }

    curr_lat = None
    curr_lon = None
    if location and "coordinates" in location and len(location["coordinates"]) >= 2:
        # GeoJSON is [lon, lat]
        curr_lon = float(location["coordinates"][0])
        curr_lat = float(location["coordinates"][1])

    best_match = None
    highest_score = 0.0
    distance_meters = None

    for existing in existing_complaints:
        ex_cat = existing.get("category", "")
        # Only compare same or related category
        if ex_cat != category and category != "Other":
            continue

        ex_desc = existing.get("description", "") + " " + existing.get("title", "")
        text_sim = text_jaccard_ngram_similarity(description, ex_desc)

        geo_factor = 0.5  # Neutral if no geo
        dist_m = None

        ex_loc = existing.get("location")
        if curr_lat is not None and curr_lon is not None and ex_loc and "coordinates" in ex_loc:
            ex_lon = float(ex_loc["coordinates"][0])
            ex_lat = float(ex_loc["coordinates"][1])
            dist_m = haversine_distance_meters(curr_lat, curr_lon, ex_lat, ex_lon)
            if dist_m < 50:
                geo_factor = 1.0
            elif dist_m < 150:
                geo_factor = 0.85
            elif dist_m < 300:
                geo_factor = 0.70
            elif dist_m < 600:
                geo_factor = 0.40
            else:
                geo_factor = 0.10

        # Weighted combined score (60% text semantic similarity + 40% geographic proximity)
        combined_score = (0.60 * text_sim) + (0.40 * geo_factor)

        if combined_score > highest_score:
            highest_score = combined_score
            best_match = existing
            distance_meters = dist_m

    is_dup = highest_score >= 0.65
    related_id = best_match.get("complaintId", str(best_match.get("_id", ""))) if best_match else None

    if is_dup and best_match:
        dist_text = f" within {int(distance_meters)} meters" if distance_meters is not None else ""
        explanation = f"Potential duplicate because the complaint describes a similar issue{dist_text} of {related_id}."
    else:
        explanation = "No matching duplicates detected; this is classified as a distinct civic issue."

    return {
        "isDuplicate": is_dup,
        "similarityScore": round(highest_score, 2),
        "relatedComplaintId": related_id if is_dup else None,
        "explanation": explanation
    }
