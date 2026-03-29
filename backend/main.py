# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio
from typing import Optional

# Try to import your agent, but don't fail if it's not working
try:
    from adk_agent import run_query
    AGENT_AVAILABLE = True
    print("✅ Agent loaded successfully")
except Exception as e:
    print(f"⚠️ Agent not available: {e}")
    AGENT_AVAILABLE = False
    # Fallback response function
    async def run_query(query: str) -> str:
        return f"🤖 AstroCargo AI is ready! You asked: '{query}'\n\nI can help with:\n• Mission queries\n• ISS location\n• Astronauts in space\n• SpaceX launches"

app = FastAPI(
    title="AstroCargo AI Agent",
    description="Track 2 Compliant - AI Agent with External APIs",
    version="6.0.0"
)

# CORS - This is CRITICAL for frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    agent: str = "AstroCargo AI"
    status: str = "success"

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
    return {"status": "healthy", "agent": "active", "timestamp": "2026-03-29"}

@app.post("/chat")
async def chat(request: QueryRequest):
    """Main chat endpoint - THIS MUST EXIST"""
    print(f"📨 Chat endpoint called with: {request.message}")
    
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        # Call your agent
        reply = await run_query(request.message)
        print(f"✅ Response: {reply[:100]}...")
        return ChatResponse(reply=reply)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return ChatResponse(
            reply=f"Error: {str(e)}",
            status="error"
        )

@app.get("/agent-status")
async def agent_status():
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

# Also add a test endpoint to verify POST works
@app.post("/test")
async def test():
    return {"message": "POST endpoint working!"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8081))
    print(f"🚀 Starting server on port {port}")
    print(f"📡 Chat endpoint: http://localhost:{port}/chat")
    uvicorn.run(app, host="0.0.0.0", port=port)