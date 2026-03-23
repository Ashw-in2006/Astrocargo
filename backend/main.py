"""FastAPI server - Entry point for Cloud Run deployment"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import asyncio
from agent import ask_astrocargo, get_agent

app = FastAPI(title="AstroCargo MCP Agent", description="AI-powered space logistics assistant")

# Enable CORS for your Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://astrocargo.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    response: str
    status: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "AstroCargo MCP Agent",
        "status": "operational",
        "description": "AI-powered space logistics assistant using ADK + MCP"
    }

@app.get("/health")
async def health():
    """Health check for Cloud Run"""
    return {"status": "healthy"}

@app.post("/ask", response_model=QueryResponse)
async def ask(request: QueryRequest):
    """Main endpoint - send query to AI agent"""
    try:
        response = await ask_astrocargo(request.query)
        return QueryResponse(
            response=response,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    """Initialize agent on startup"""
    try:
        await get_agent()
        print("✅ AstroCargo agent initialized successfully")
    except Exception as e:
        print(f"⚠️ Agent initialization failed: {e}")
        # Don't crash the server - will retry on first request

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    from agent import _agent_instance
    if _agent_instance:
        await _agent_instance.cleanup()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
