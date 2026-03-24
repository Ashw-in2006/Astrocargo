from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import asyncio
import os
import sys
from typing import Optional, List, Dict, Any

# Import mission data and agent
from mission_data import MISSIONS

# Try to import agent functions
try:
    from agent import run_query, ask_astrocargo
    AGENT_AVAILABLE = True
except Exception as e:
    print(f"Warning: Agent import failed: {e}")
    AGENT_AVAILABLE = False

app = FastAPI(
    title="AstroCargo AI Backend",
    version="2.0.0",
    description="AI-powered space logistics assistant with MCP tools"
)

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class QueryRequest(BaseModel):
    message: str

class QueryResponse(BaseModel):
    reply: str
    tool_used: Optional[str] = None

class Mission(BaseModel):
    id: str
    name: str
    status: str
    destination: Optional[str] = None
    launch_date: Optional[str] = None
    delay_reason: Optional[str] = None
    cargo: Optional[List[str]] = None

# Helper function to get mission details
def get_mission_details(mission_id: str) -> Dict[str, Any]:
    mission = next((m for m in MISSIONS if m["id"] == mission_id.upper()), None)
    if not mission:
        return None
    return mission

# API Endpoints
@app.get("/")
async def root():
    return {
        "service": "AstroCargo MCP Agent",
        "status": "operational",
        "description": "AI-powered space logistics assistant using ADK + MCP",
        "version": "2.0.0",
        "agent_available": AGENT_AVAILABLE
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "missions_count": len(MISSIONS),
        "agent_available": AGENT_AVAILABLE
    }

@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    """Process natural language queries about space cargo missions"""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        if AGENT_AVAILABLE:
            # Use AI agent
            reply = await run_query(request.message)
            return QueryResponse(reply=reply, tool_used="ai_agent")
        else:
            # Simple rule-based fallback
            reply = simple_response(request.message)
            return QueryResponse(reply=reply, tool_used="rule_based")
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/missions")
async def get_all_missions():
    """Get all space cargo missions"""
    return {
        "missions": MISSIONS,
        "count": len(MISSIONS)
    }

@app.get("/missions/{mission_id}")
async def get_mission(mission_id: str):
    """Get specific mission by ID"""
    mission = get_mission_details(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return mission

@app.get("/missions/status/delayed")
async def get_delayed():
    """Get all delayed missions"""
    delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
    return {
        "delayed_missions": delayed,
        "count": len(delayed)
    }

@app.get("/missions/status/{status}")
async def get_by_status(status: str):
    """Get missions by status (Delayed, In Transit, Completed)"""
    filtered = [m for m in MISSIONS if m.get("status", "").lower() == status.lower()]
    return {
        "missions": filtered,
        "count": len(filtered),
        "status": status
    }

# Simple fallback responses
def simple_response(query: str) -> str:
    query_lower = query.lower()
    
    if any(mid in query_lower for mid in ["cargo-1", "cargo-2", "cargo-3", "cargo-4"]):
        for mission in MISSIONS:
            if mission["id"].lower() in query_lower:
                return f"{mission['id']}: {mission['name']} - Status: {mission['status']}. {mission.get('delay_reason', '')}"
    
    if "delay" in query_lower or "delayed" in query_lower:
        delayed = [m for m in MISSIONS if m["status"] == "Delayed"]
        if delayed:
            return f"Delayed missions: {', '.join([m['id'] for m in delayed])}. " + delayed[0].get('delay_reason', '')
        return "No delayed missions"
    
    if "all" in query_lower and "mission" in query_lower:
        return f"Total missions: {len(MISSIONS)}. Missions: {', '.join([m['id'] for m in MISSIONS])}"
    
    return f"I'm AstroCargo AI. I can help you track missions. Try asking about specific missions like CARGO-1, or ask which missions are delayed."

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)