import asyncio
import os
import json
import httpx
from mission_data import MISSIONS

async def call_external_api(api_type: str):
    """Call external APIs for real-time data"""
    
    async with httpx.AsyncClient() as client:
        if api_type == "iss":
            try:
                response = await client.get("http://api.open-notify.org/iss-now.json", timeout=5)
                data = response.json()
                iss_data = data.get("iss_position", {})
                return f"🌍 **ISS Current Location:**\n📍 Latitude: {iss_data.get('latitude', 'N/A')}\n📍 Longitude: {iss_data.get('longitude', 'N/A')}\n🕐 Timestamp: {data.get('timestamp', 'N/A')}"
            except Exception as e:
                return f"⚠️ Unable to fetch ISS location: {str(e)}"
        
        elif api_type == "astronauts":
            try:
                response = await client.get("http://api.open-notify.org/astros.json", timeout=5)
                data = response.json()
                astronauts = data.get("people", [])
                if astronauts:
                    result = f"👨‍🚀 **Astronauts in Space ({len(astronauts)}):**\n\n"
                    for i, astro in enumerate(astronauts, 1):
                        result += f"{i}. {astro['name']} ({astro['craft']})\n"
                    return result
                return "No astronauts in space currently"
            except Exception as e:
                return f"⚠️ Unable to fetch astronaut data: {str(e)}"
        
        elif api_type == "spacex":
            try:
                response = await client.get("https://api.spacexdata.com/v4/launches/upcoming", timeout=5)
                launches = response.json()
                if launches:
                    result = "🚀 **Upcoming SpaceX Launches:**\n\n"
                    for launch in launches[:3]:
                        result += f"**{launch.get('name')}**\n"
                        result += f"📅 Date: {launch.get('date_utc', 'TBD')[:10]}\n"
                        details = launch.get('details', '')
                        if details:
                            result += f"📝 {details[:100]}...\n"
                        result += "\n"
                    return result
                return "No upcoming SpaceX launches at this time"
            except Exception as e:
                return f"⚠️ Unable to fetch SpaceX data: {str(e)}"
    
    return "API service temporarily unavailable"

async def run_query(user_query: str) -> str:
    """Simple working agent - No Gemini required"""
    
    try:
        q = user_query.lower()
        
        # ========== EXTERNAL API REQUESTS ==========
        if "iss" in q or "space station" in q or "where is iss" in q:
            return await call_external_api("iss")
        
        if "astronaut" in q or "who is in space" in q or "people in space" in q:
            return await call_external_api("astronauts")
        
        if "spacex" in q or "space x" in q or "launch" in q:
            return await call_external_api("spacex")
        
        # ========== MISSION QUERIES ==========
        # Check for specific mission
        for mission in MISSIONS:
            if mission["id"].lower() in q:
                response = f"""
🚀 **{mission['id']} - {mission['name']}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 **Destination:** {mission.get('destination', 'Unknown')}
📊 **Status:** {mission['status']}
📅 **Launch Date:** {mission.get('launch_date', 'TBD')}
🚀 **Origin:** {mission.get('origin', 'Unknown')}
"""
                if mission.get('cargo'):
                    response += f"📦 **Cargo:** {', '.join(mission['cargo'])}\n"
                if mission.get('delay_reason'):
                    response += f"⚠️ **Delay Reason:** {mission['delay_reason']}\n"
                if mission.get('estimated_new_date'):
                    response += f"📅 **New Date:** {mission['estimated_new_date']}\n"
                if mission.get('completed_date'):
                    response += f"✅ **Completed:** {mission['completed_date']}\n"
                if mission.get('progress'):
                    response += f"📈 **Progress:** {mission['progress']}\n"
                
                return response
        
        # Show all missions
        if "all" in q and ("mission" in q or "cargo" in q or "show me all" in q):
            result = "🚀 **All Space Cargo Missions**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            for m in MISSIONS:
                status_icon = "🚀" if m['status'] == "In Transit" else "⚠️" if m['status'] == "Delayed" else "📅" if m['status'] == "Scheduled" else "✅"
                result += f"{status_icon} **{m['id']}** → {m['destination']}\n"
                result += f"   Status: {m['status']}\n"
                result += f"   Launch: {m.get('launch_date', 'TBD')}\n\n"
            return result
        
        # Delayed missions
        if "delay" in q or "delayed" in q:
            delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
            if delayed:
                result = "⚠️ **Delayed Missions**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                for m in delayed:
                    result += f"🚀 **{m['id']}** - {m['name']}\n"
                    result += f"   📍 Destination: {m['destination']}\n"
                    result += f"   ⚠️ Reason: {m.get('delay_reason', 'Unknown')}\n"
                    if m.get('estimated_new_date'):
                        result += f"   📅 New Date: {m['estimated_new_date']}\n"
                    result += "\n"
                return result
            return "✅ No missions are currently delayed. All missions are on schedule!"
        
        # Completed missions
        if "complete" in q:
            completed = [m for m in MISSIONS if m.get("status") == "Completed"]
            if completed:
                result = "✅ **Completed Missions**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                for m in completed:
                    result += f"🚀 **{m['id']}** - {m['name']}\n"
                    result += f"   📍 Destination: {m['destination']}\n"
                    result += f"   ✅ Completed: {m.get('completed_date', 'Unknown')}\n\n"
                return result
            return "No completed missions yet. Check back later!"
        
        # In transit missions
        if "transit" in q or "in transit" in q:
            transit = [m for m in MISSIONS if m.get("status") == "In Transit"]
            if transit:
                result = "🚀 **Missions In Transit**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                for m in transit:
                    result += f"🚀 **{m['id']}** - {m['name']}\n"
                    result += f"   📍 Destination: {m['destination']}\n"
                    if m.get('progress'):
                        result += f"   📈 Progress: {m['progress']}\n"
                    result += "\n"
                return result
            return "No missions currently in transit."
        
        # Destination-based queries
        destinations = {
            "iss": "International Space Station",
            "mars": "Mars",
            "moon": "Lunar Gateway",
            "lunar": "Lunar Gateway",
            "orbit": "Low Earth Orbit"
        }
        
        for key, dest in destinations.items():
            if key in q:
                missions_to_dest = [m for m in MISSIONS if dest.lower() in m['destination'].lower()]
                if missions_to_dest:
                    result = f"🪐 **Missions to {dest}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                    for m in missions_to_dest:
                        result += f"🚀 **{m['id']}** - {m['name']}\n"
                        result += f"   Status: {m['status']}\n"
                        result += f"   Launch: {m.get('launch_date', 'TBD')}\n\n"
                    return result
        
        # ========== DEFAULT HELP RESPONSE ==========
        return """🤖 **AstroCargo AI Assistant** - Your Space Logistics Companion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I can help you with:

**🚀 Space Missions**
• "Show me all missions"
• "Tell me about CARGO-1"
• "Which missions are delayed?"
• "What's the status of CARGO-2?"
• "Where is CARGO-3 going?"
• "Show me completed missions"

**🛰️ Real-time Space Data** (External APIs)
• "Where is the ISS right now?"
• "Who is in space?"
• "Upcoming SpaceX launches"

**📊 Mission Status**
• "Show in transit missions"
• "Missions to Mars"
• "Missions to ISS"

💡 **Try asking any of the above questions!** I fetch real-time data from NASA and SpaceX APIs.
"""
        
    except Exception as e:
        return f"❌ Error: {str(e)}\n\nPlease try again with a different question."