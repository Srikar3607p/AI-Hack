# Civic Aid — AI Intelligence Microservice

Python FastAPI AI microservice with 8 specialized civic analysis agents and Groq LLM integration.

## Architecture
- **Agents:** Intake, Summarization, Priority (4-Factor Formula), Duplicate Detection (Jaccard + Haversine), Routing, Follow-up, Escalation, Resolution Verification.
- **Resilient Fallback:** 100% deterministic rule-based fallback guarantees zero downtime when Groq is unreachable.

## Scripts
```bash
# Install dependencies
pip install -r requirements.txt

# Run FastAPI service (http://localhost:8000)
python run.py
# or
uvicorn app.main:app --reload --port 8000
```

## Environment
Create `.env` based on `.env.example`:
```env
GROQ_API_KEY=
PORT=8000
HOST=0.0.0.0
AI_MODEL=llama-3.3-70b-versatile
VISION_MODEL=llama-3.2-11b-vision-preview
NODE_BACKEND_URL=http://localhost:5000
```
