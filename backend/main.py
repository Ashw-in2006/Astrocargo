from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os

from mission_data import MISSIONS

# =========================
# 🤖 MCP + ADK AGENT IMPORT
# =========================
try:
    from adk_agent import run_query as mcp_run_query
    MCP_AGENT_AVAILABLE = True
    print("✅ MCP + ADK Agent loaded successfully")
except Exception as e:
    print(f"⚠️ MCP Agent import failed: {e}")
    MCP_AGENT_AVAILABLE = False

# =========================
# 📦 SIMPLE AGENT FALLBACK
# =========================
try:
    from agent import ask_astrocargo
    SIMPLE_AGENT_AVAILABLE = True
    print("✅ Simple Agent (Gemini) loaded")
except Exception as e:
    print(f"⚠️ Simple Agent import failed: {e}")
    SIMPLE_AGENT_AVAILABLE = False

app = FastAPI(
    title="AstroCargo MCP Agent",
    description="AI agent using ADK + MCP for space logistics",
    version="4.0.0"
)

# =========================
# 🌐 CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 📦 MODELS
# =========================
class QueryRequest(BaseModel):
    message: str

class QueryResponse(BaseModel):
    reply: str
    source: str  # "mcp_agent", "simple_agent", or "fallback"
    agent_type: Optional[str] = None

# =========================
# 🚀 ROOT + HEALTH
# =========================
@app.get("/")
async def root():
    return {
        "service": "AstroCargo MCP Agent",
        "status": "operational",
        "description": "AI-powered space logistics using ADK + MCP",
        "version": "4.0.0",
        "architecture": "ADK Agent + MCP Server + External APIs",
        "agents": {
            "mcp_adk": MCP_AGENT_AVAILABLE,
            "simple_gemini": SIMPLE_AGENT_AVAILABLE
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "missions_count": len(MISSIONS),
        "agents": {
            "mcp_adk": MCP_AGENT_AVAILABLE,
            "simple_gemini": SIMPLE_AGENT_AVAILABLE
        }
    }

# =========================
# 🤖 MAIN CHAT ENDPOINT
# =========================
@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        # 🥇 PRIORITY 1: Use MCP + ADK Agent (Track 2 compliant)
        if MCP_AGENT_AVAILABLE:
            print(f"🤖 Using MCP + ADK Agent for: {request.message[:50]}...")
            reply = await mcp_run_query(request.message)
            return QueryResponse(
                reply=reply,
                source="mcp_agent",
                agent_type="ADK + MCP + External APIs"
            )
        
        # 🥈 PRIORITY 2: Use Simple Gemini Agent
        elif SIMPLE_AGENT_AVAILABLE:
            print(f"🤖 Using Simple Gemini Agent for: {request.message[:50]}...")
            reply = await ask_astrocargo(request.message)
            return QueryResponse(
                reply=reply,
                source="simple_agent",
                agent_type="Gemini + Rule-based"
            )
        
        # 🥉 PRIORITY 3: Fallback to rule-based
        else:
            print(f"⚠️ No AI agents available, using fallback for: {request.message[:50]}...")
            reply = simple_response(request.message)
            return QueryResponse(
                reply=reply,
                source="fallback",
                agent_type="Rule-based"
            )
            
    except Exception as e:
        print(f"❌ ERROR in chat endpoint: {e}")
        
        # Last resort fallback
        return QueryResponse(
            reply=simple_response(request.message),
            source="fallback_error",
            agent_type=f"Error fallback: {str(e)[:50]}"
        )

# =========================
# 📊 MISSION APIs
# =========================
@app.get("/missions")
async def get_all_missions():
    return {"missions": MISSIONS, "count": len(MISSIONS)}

@app.get("/missions/{mission_id}")
async def get_mission(mission_id: str):
    mission = next((m for m in MISSIONS if m["id"] == mission_id.upper()), None)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return mission

@app.get("/missions/status/delayed")
async def get_delayed():
    delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
    return {"delayed_missions": delayed, "count": len(delayed)}

@app.get("/missions/status/{status}")
async def get_by_status(status: str):
    filtered = [m for m in MISSIONS if m.get("status", "").lower() == status.lower()]
    return {"missions": filtered, "count": len(filtered), "status": status}

# =========================
# 🧠 SMARTER FALLBACK RESPONSES
# =========================
def simple_response(query: str) -> str:
    """Enhanced fallback for when AI agents are unavailable"""
    q = query.lower()
    
    # Check for mission-specific queries
    for mission in MISSIONS:
        if mission["id"].lower() in q:
            return f"""
🚀 **{mission['id']} - {mission['name']}**
📍 Destination: {mission.get('destination', 'Unknown')}
📊 Status: {mission['status']}
{'⚠️ ' + mission.get('delay_reason', '') if mission.get('delay_reason') else ''}
{'📦 Cargo: ' + ', '.join(mission.get('cargo', [])) if mission.get('cargo') else ''}
"""
    
    # Check for delayed missions
    if "delay" in q or "delayed" in q:
        delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
        if delayed:
            response = "⚠️ **Delayed Missions:**\n"
            for m in delayed:
                response += f"- {m['id']}: {m['name']}"
                if m.get('delay_reason'):
                    response += f" - {m['delay_reason']}"
                response += "\n"
            return response
        return "✅ No missions are currently delayed."
    
    # Check for all missions
    if "all" in q and ("mission" in q or "cargo" in q):
        missions_list = [f"{m['id']} ({m['status']})" for m in MISSIONS]
        return f"🚀 **All Space Cargo Missions:**\n{', '.join(missions_list)}\n\nTry asking about a specific mission like CARGO-1 for more details."
    
    # Check for status-specific
    if "in transit" in q:
        transit = [m for m in MISSIONS if m.get("status") == "In Transit"]
        if transit:
            return f"🚀 **In Transit:** {', '.join([m['id'] for m in transit])}"
        return "No missions currently in transit."
    
    if "completed" in q:
        completed = [m for m in MISSIONS if m.get("status") == "Completed"]
        if completed:
            return f"✅ **Completed Missions:** {', '.join([m['id'] for m in completed])}"
        return "No completed missions yet."
    
    # Default helpful response
    return """🤖 **AstroCargo AI Assistant**

I can help you track space cargo missions! Try asking:

• "Show me all missions"
• "Tell me about CARGO-1"
• "Which missions are delayed?"
• "What's the status of CARGO-2?"
• "Where is CARGO-3 going?"

💡 For real-time space data (ISS location, astronauts), make sure the MCP agent is enabled!
"""

# =========================
# 🧪 TEST ENDPOINT
# =========================
@app.get("/agent-status")
async def agent_status():
    """Check which AI agents are available"""
    return {
        "mcp_adk_agent": MCP_AGENT_AVAILABLE,
        "simple_gemini_agent": SIMPLE_AGENT_AVAILABLE,
        "recommended": "MCP + ADK" if MCP_AGENT_AVAILABLE else "Simple Gemini" if SIMPLE_AGENT_AVAILABLE else "Fallback only"
    }

# =========================
# ▶ RUN
# =========================
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8081))
    uvicorn.run(app, host="0.0.0.0", port=port)