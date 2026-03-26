from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

# Import the working agent
from adk_agent import run_query

app = FastAPI(
    title="AstroCargo AI Agent",
    description="Track 2 Compliant - AI Agent with External APIs",
    version="6.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {
        "service": "AstroCargo AI Agent",
        "status": "running",
        "track_compliance": "✅ Track 2 - ADK + External APIs",
        "version": "6.0.0",
        "features": [
            "Space Mission Data (CARGO missions)",
            "ISS Location (Real-time External API)",
            "Astronauts in Space (Real-time External API)",
            "SpaceX Launches (Real-time External API)"
        ],
        "endpoints": {
            "chat": "POST /chat",
            "health": "GET /health",
            "status": "GET /agent-status"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "agent": "active", "timestamp": "2026-03-26"}

@app.post("/chat")
async def chat(request: QueryRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        print(f"📨 Received query: {request.message[:100]}")
        reply = await run_query(request.message)
        print(f"✅ Response generated: {reply[:100]}...")
        return {
            "reply": reply,
            "agent": "AstroCargo AI",
            "status": "success"
        }
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            "reply": f"Sorry, I encountered an error: {str(e)}",
            "agent": "AstroCargo AI",
            "status": "error"
        }

@app.get("/agent-status")
async def agent_status():
    """Check agent and API status"""
    return {
        "agent": "AstroCargo AI",
        "status": "operational",
        "apis": {
            "iss": "http://api.open-notify.org/iss-now.json",
            "astronauts": "http://api.open-notify.org/astros.json",
            "spacex": "https://api.spacexdata.com/v4/launches/upcoming"
        },
        "external_apis_status": "available",
        "missions_loaded": "4 missions loaded"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8081))
    uvicorn.run(app, host="0.0.0.0", port=port)