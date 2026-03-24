from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os

from mission_data import MISSIONS

# ✅ Import ONLY ask_astrocargo (no run_query)
try:
    from agent import ask_astrocargo
    AGENT_AVAILABLE = True
except Exception as e:
    print(f"⚠️ Agent import failed: {e}")
    AGENT_AVAILABLE = False

app = FastAPI(
    title="AstroCargo AI Backend",
    version="4.0.0",
    description="AI-powered space logistics assistant"
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
    source: str


# =========================
# 🚀 ROOT + HEALTH
# =========================

@app.get("/")
async def root():
    return {
        "service": "AstroCargo AI",
        "status": "running",
        "agent_available": AGENT_AVAILABLE
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "missions": len(MISSIONS),
        "agent_available": AGENT_AVAILABLE
    }


# =========================
# 🤖 CHAT ENDPOINT (MAIN FIX)
# =========================

@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message empty")

    try:
        # ✅ Use AI if available
        if AGENT_AVAILABLE:
            reply = await ask_astrocargo(request.message)
            return {
                "reply": reply,
                "source": "ai"
            }

        # 🔁 fallback
        reply = simple_response(request.message)
        return {
            "reply": reply,
            "source": "fallback"
        }

    except Exception as e:
        print("❌ ERROR:", e)

        # 🔁 fallback on crash
        return {
            "reply": simple_response(request.message),
            "source": "fallback_error"
        }


# =========================
# 📊 MISSION APIs
# =========================

@app.get("/missions")
async def get_all_missions():
    return {"missions": MISSIONS}


@app.get("/missions/{mission_id}")
async def get_mission(mission_id: str):
    mission = next((m for m in MISSIONS if m["id"] == mission_id.upper()), None)

    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    return mission


@app.get("/missions/status/delayed")
async def delayed():
    return [m for m in MISSIONS if m["status"] == "Delayed"]


@app.get("/missions/status/{status}")
async def by_status(status: str):
    return [
        m for m in MISSIONS
        if m["status"].lower() == status.lower()
    ]


# =========================
# 🧠 FALLBACK (SMARTER)
# =========================

def simple_response(query: str) -> str:
    q = query.lower()

    # mission specific
    for m in MISSIONS:
        if m["id"].lower() in q:
            return f"""
🚀 {m['id']} - {m['name']}
📍 {m['origin']} → {m['destination']}
📊 Status: {m['status']}
⚠️ {m['reason']}
"""

    # delayed
    if "delay" in q:
        delayed = [m for m in MISSIONS if m["status"] == "Delayed"]
        if delayed:
            return "⚠️ Delayed: " + ", ".join([m["id"] for m in delayed])
        return "✅ No delayed missions"

    # all
    if "all" in q:
        return "🚀 Missions: " + ", ".join([m["id"] for m in MISSIONS])

    return """🤖 Try:
- Show all missions
- Tell me about CARGO-1
- Which missions are delayed?
"""


# =========================
# ▶ RUN
# =========================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)