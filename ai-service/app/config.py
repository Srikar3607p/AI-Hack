import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
AI_MODEL = os.getenv("AI_MODEL", "llama-3.3-70b-versatile")
VISION_MODEL = os.getenv("VISION_MODEL", "llama-3.2-11b-vision-preview")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

SUPPORTED_CATEGORIES = [
    "Roads & Potholes",
    "Drainage",
    "Waste Management",
    "Water Supply",
    "Streetlights",
    "Public Facilities",
    "Other"
]

DEPARTMENTS = [
    {"name": "Roads & Infrastructure", "categories": ["Roads & Potholes"]},
    {"name": "Sanitation", "categories": ["Waste Management"]},
    {"name": "Water Supply", "categories": ["Water Supply"]},
    {"name": "Drainage", "categories": ["Drainage"]},
    {"name": "Electrical", "categories": ["Streetlights"]},
    {"name": "Public Facilities", "categories": ["Public Facilities", "Other"]}
]
