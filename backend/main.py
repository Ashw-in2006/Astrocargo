from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import os
from mission_data import MISSIONS

app = FastAPI(title="AstroCargo AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str

class QueryResponse(BaseModel):
    reply: str

@app.get("/")
async def root():
    return {"service": "AstroCargo MCP Agent", "status": "operational", "description": "AI-powered space logistics assistant using ADK + MCP"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        from agent import run_query
        reply = await run_query(request.message)
        return QueryResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.get("/missions")
async def get_all_missions():
    return {"missions": MISSIONS}

@app.get("/missions/{mission_id}")
async def get_mission(mission_id: str):
    mission = next((m for m in MISSIONS if m["id"] == mission_id.upper()), None)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return mission

@app.get("/missions/status/delayed")
async def get_delayed():
    delayed = [m for m in MISSIONS if m["status"] == "Delayed"]
    return {"delayed_missions": delayed, "count": len(delayed)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
