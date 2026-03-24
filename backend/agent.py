import asyncio
import sys
import os
import json
from typing import List, Dict, Any

# Import your mission data
from mission_data import MISSIONS

# Simple instruction for the AI
AGENT_INSTRUCTION = """You are AstroCargo AI, an intelligent space logistics assistant.
You help users track space cargo missions between Earth, the Moon, Mars and deep space stations.
Use the available tools to fetch real mission data. Be concise but informative.
If a mission is delayed, always mention the delay reason.

Available missions: CARGO-1, CARGO-2, CARGO-3, CARGO-4
"""

# Simple tool functions (no MCP server needed)
def get_all_missions() -> str:
    """Get all space cargo missions"""
    missions = []
    for m in MISSIONS:
        missions.append(f"- {m['id']}: {m['name']} - Status: {m['status']}")
    return "\n".join(missions) if missions else "No missions found"

def get_mission_details(mission_id: str) -> str:
    """Get details for a specific mission"""
    mission = next((m for m in MISSIONS if m["id"] == mission_id.upper()), None)
    if not mission:
        return f"Mission {mission_id} not found"
    
    details = f"""
Mission: {mission['id']} - {mission['name']}
Status: {mission['status']}
Destination: {mission.get('destination', 'Unknown')}
Launch Date: {mission.get('launch_date', 'Unknown')}
"""
    if mission.get('delay_reason'):
        details += f"Delay Reason: {mission['delay_reason']}\n"
    
    if mission.get('cargo'):
        details += f"Cargo Items: {', '.join(mission['cargo'])}\n"
    
    return details

def get_delayed_missions() -> str:
    """Get all delayed missions with reasons"""
    delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
    if not delayed:
        return "No delayed missions"
    
    result = "Delayed Missions:\n"
    for m in delayed:
        result += f"- {m['id']}: {m['name']}\n"
        if m.get('delay_reason'):
            result += f"  Reason: {m['delay_reason']}\n"
    return result

def get_missions_by_status(status: str) -> str:
    """Get missions by status (Delayed, In Transit, Completed)"""
    filtered = [m for m in MISSIONS if m.get("status", "").lower() == status.lower()]
    if not filtered:
        return f"No missions with status '{status}'"
    
    result = f"Missions with status '{status}':\n"
    for m in filtered:
        result += f"- {m['id']}: {m['name']}\n"
    return result

# Tool definitions for the AI
TOOLS = {
    "get_all_missions": get_all_missions,
    "get_mission_details": get_mission_details,
    "get_delayed_missions": get_delayed_missions,
    "get_missions_by_status": get_missions_by_status,
}

def process_query_with_tools(query: str) -> str:
    """Process user query and call appropriate tools"""
    query_lower = query.lower()
    
    # Check for mission-specific queries
    if any(mid.lower() in query_lower for mid in ["cargo-1", "cargo-2", "cargo-3", "cargo-4"]):
        for mission_id in ["CARGO-1", "CARGO-2", "CARGO-3", "CARGO-4"]:
            if mission_id.lower() in query_lower:
                return get_mission_details(mission_id)
    
    # Check for delayed missions
    if "delay" in query_lower or "delayed" in query_lower:
        return get_delayed_missions()
    
    # Check for all missions
    if "all mission" in query_lower or "list mission" in query_lower:
        return get_all_missions()
    
    # Check for status-specific queries
    if "in transit" in query_lower:
        return get_missions_by_status("In Transit")
    if "completed" in query_lower:
        return get_missions_by_status("Completed")
    
    # Default response
    return f"I can help you with space cargo missions! Try asking:\n" + \
           "- 'Show me all missions'\n" + \
           "- 'Tell me about CARGO-1'\n" + \
           "- 'Which missions are delayed?'\n" + \
           "- 'Show me in transit missions'"

async def run_query(user_query: str) -> str:
    """Main function to process user queries"""
    try:
        # Try to use Gemini if available, otherwise use rule-based
        try:
            import google.generativeai as genai
            from dotenv import load_dotenv
            
            load_dotenv()
            api_key = os.getenv("GEMINI_API_KEY")
            
            if api_key and api_key != "AIzaSyCOQyuk":  # Check if it's the real key
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                
                # Enhance query with mission data context
                context = f"""
                Available mission data:
                {json.dumps(MISSIONS, indent=2)}
                
                User question: {user_query}
                
                Answer based on the mission data above. Be helpful and concise.
                """
                
                response = model.generate_content(context)
                return response.text
        except Exception as e:
            print(f"Gemini unavailable: {e}, using rule-based")
        
        # Fallback to rule-based processing
        return process_query_with_tools(user_query)
        
    except Exception as e:
        return f"Error processing request: {str(e)}"

async def ask_astrocargo(query: str) -> str:
    """Simple wrapper for the query function"""
    return await run_query(query)

def get_agent():
    """Placeholder for agent compatibility"""
    return None