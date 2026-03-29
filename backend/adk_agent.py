# backend/adk_agent.py - Improved fallback
import asyncio
import httpx
import json
from datetime import datetime

# Mission data
MISSIONS = [
    {"id": "CARGO-1", "name": "ISS Resupply Mission 1", "status": "Completed", "destination": "ISS", "launch_date": "2024-01-15", "cargo": ["Food", "Water", "Equipment"]},
    {"id": "CARGO-2", "name": "Lunar Gateway Supply", "status": "In Transit", "destination": "Lunar Gateway", "launch_date": "2024-02-20", "cargo": ["Fuel", "Materials"]},
    {"id": "CARGO-3", "name": "Mars Mission Prep", "status": "Delayed", "destination": "Mars Transit", "launch_date": "2024-03-10", "delay_reason": "Weather", "cargo": ["Life Support"]}
]

async def call_external_api(api_type: str):
    """Call external APIs for real-time data"""
    async with httpx.AsyncClient() as client:
        if api_type == "iss":
            try:
                response = await client.get("http://api.open-notify.org/iss-now.json", timeout=5)
                data = response.json()
                iss = data.get("iss_position", {})
                lat = iss.get('latitude', 'N/A')
                lon = iss.get('longitude', 'N/A')
                return f"🌍 **ISS Current Location**\n📍 Latitude: {lat}\n📍 Longitude: {lon}\n🕐 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            except:
                return "⚠️ Unable to fetch ISS location. The API might be temporarily unavailable."
        
        elif api_type == "astronauts":
            try:
                response = await client.get("http://api.open-notify.org/astros.json", timeout=5)
                data = response.json()
                astronauts = data.get("people", [])
                if astronauts:
                    result = f"👨‍🚀 **Astronauts in Space ({len(astronauts)} people):**\n\n"
                    for astro in astronauts:
                        result += f"• **{astro['name']}** on {astro['craft']}\n"
                    return result
                return "No astronauts in space currently."
            except:
                return "⚠️ Unable to fetch astronaut data."
        
        elif api_type == "spacex":
            try:
                response = await client.get("https://api.spacexdata.com/v4/launches/upcoming", timeout=5)
                launches = response.json()
                if launches:
                    result = "🚀 **Upcoming SpaceX Launches:**\n\n"
                    for launch in launches[:5]:
                        date = launch.get('date_utc', 'TBD')[:10]
                        result += f"• **{launch.get('name')}** - {date}\n"
                    return result
                return "No upcoming SpaceX launches at this time."
            except:
                return "⚠️ Unable to fetch SpaceX data."
    
    return "Service temporarily unavailable."

async def run_query(user_query: str) -> str:
    """Main agent function - improved responses"""
    q = user_query.lower()
    
    # ISS location
    if "iss" in q or "space station" in q:
        return await call_external_api("iss")
    
    # Astronauts
    if "astronaut" in q or "who is in space" in q or "crew" in q:
        return await call_external_api("astronauts")
    
    # SpaceX launches
    if "spacex" in q or "launch" in q:
        return await call_external_api("spacex")
    
    # Specific mission by ID (cargo1, cargo-1, etc.)
    for mission in MISSIONS:
        mission_id_lower = mission["id"].lower().replace("-", "")
        if mission_id_lower in q.replace("-", ""):
            response = f"🚀 **{mission['id']} - {mission['name']}**\n\n"
            response += f"📍 **Destination:** {mission.get('destination', 'Unknown')}\n"
            response += f"📊 **Status:** {mission['status']}\n"
            response += f"📅 **Launch Date:** {mission.get('launch_date', 'TBD')}\n"
            response += f"📦 **Cargo:** {', '.join(mission.get('cargo', []))}\n"
            if mission.get('delay_reason'):
                response += f"⚠️ **Delay Reason:** {mission['delay_reason']}\n"
            return response
    
    # All missions
    if "all missions" in q or "cargos list" in q or "list missions" in q:
        result = "🚀 **All Space Cargo Missions**\n\n"
        for m in MISSIONS:
            icon = "✅" if m['status'] == "Completed" else "🚀" if m['status'] == "In Transit" else "⚠️"
            result += f"{icon} **{m['id']}** → {m['destination']}\n"
            result += f"   Status: {m['status']}\n"
            result += f"   Launch: {m.get('launch_date', 'TBD')}\n\n"
        return result
    
    # Delayed missions
    if "delay" in q:
        delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
        if delayed:
            result = "⚠️ **Delayed Missions**\n\n"
            for m in delayed:
                result += f"• **{m['id']}**: {m.get('delay_reason', 'Unknown reason')}\n"
            return result
        return "✅ No missions are currently delayed."
    
    # Completed missions
    if "complete" in q:
        completed = [m for m in MISSIONS if m.get("status") == "Completed"]
        if completed:
            result = "✅ **Completed Missions**\n\n"
            for m in completed:
                result += f"• **{m['id']}** - Completed on {m.get('launch_date', 'Unknown')}\n"
            return result
        return "No completed missions yet."
    
    # Default response
    return """🤖 **AstroCargo AI Assistant**

I can help you with:

**🚀 Missions**
• "Show me all missions"
• "Tell me about CARGO-1"
• "Which missions are delayed?"

**🛰️ Real-time Space Data**
• "Where is the ISS?"
• "Who is in space?"
• "Upcoming SpaceX launches"

**📦 Cargo**
• "What's on CARGO-2?"
• "Cargos list"

Try asking me something!"""