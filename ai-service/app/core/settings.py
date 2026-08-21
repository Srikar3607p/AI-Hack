"""
Civic Aid AI Service — Core Configuration
Loads environment variables and exposes a typed settings object.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    groq_api_key: str = ""
    ai_model: str = "llama-3.3-70b-versatile"
    vision_model: str = "llama-3.2-11b-vision-preview"
    node_backend_url: str = "http://localhost:5000"
    port: int = 8000
    host: str = "0.0.0.0"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
