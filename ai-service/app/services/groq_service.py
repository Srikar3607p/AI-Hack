"""
Civic Aid AI Service — Groq Service
Wraps the Groq client with error handling and fallback detection.
Phase 4 will add full invocation logic.
"""

from app.core.settings import settings


def is_groq_available() -> bool:
    """Returns True if a Groq API key is configured."""
    return bool(settings.groq_api_key)


async def groq_chat(messages: list, model: str = None) -> dict:
    """
    Send a chat completion request to Groq.
    Returns the response content or raises on failure.
    Phase 4 will fully implement this.
    """
    if not is_groq_available():
        raise RuntimeError("Groq API key not configured — fallback mode active")

    # TODO Phase 4: implement groq_client.chat.completions.create(...)
    raise NotImplementedError("Full Groq implementation deferred to Phase 4")
