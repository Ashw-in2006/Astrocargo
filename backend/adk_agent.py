import asyncio
import os
import json
import httpx
from mission_data import MISSIONS
from dotenv import load_dotenv

load_dotenv()

# Gemini Configuration
GEMINI_AVAILABLE = False
try:
    import google.generativeai as genai
    
    # Try both possible environment variable names
    API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    # Your specific key
    if not API_KEY:
        API_KEY = "AIzaSyCOQyuKTFMCIx9rT3N4TTZammwZqYsVd-U"
    
    print(f"🔑 Using API Key: {API_KEY[:15]}...")
    
    if API_KEY and API_KEY.startswith("AIza"):
        genai.configure(api_key=API_KEY)
        
        # Test the key with a simple call
        test_model = genai.GenerativeModel("models/gemini-1.5-flash")
        test_response = test_model.generate_content("Say 'OK'")
        print("✅ Gemini AI is ENABLED - Smart responses activated!")
        GEMINI_AVAILABLE = True
    else:
        print("⚠️ Invalid API key format - using fallback mode")
        
except Exception as e:
    print(f"⚠️ Gemini setup error: {e}")
    GEMINI_AVAILABLE = False

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

def get_mission_response(q: str) -> str:
    """Handle mission-specific queries"""
    
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
            if mission.get('progress'):
                response += f"📈 **Progress:** {mission['progress']}\n"
            return response
    
    # Show all missions
    if "all" in q and ("mission" in q or "cargo" in q):
        result = "🚀 **All Space Cargo Missions**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        for m in MISSIONS:
            status_icon = "🚀" if m['status'] == "In Transit" else "⚠️" if m['status'] == "Delayed" else "📅" if m['status'] == "Scheduled" else "✅"
            result += f"{status_icon} **{m['id']}** → {m['destination']}\n"
            result += f"   Status: {m['status']}\n"
            result += f"   Launch: {m.get('launch_date', 'TBD')}\n\n"
        return result
    
    # Delayed missions
    if "delay" in q:
        delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
        if delayed:
            result = "⚠️ **Delayed Missions**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            for m in delayed:
                result += f"🚀 **{m['id']}** - {m['name']}\n"
                result += f"   📍 Destination: {m['destination']}\n"
                result += f"   ⚠️ Reason: {m.get('delay_reason', 'Unknown')}\n\n"
            return result
        return "✅ No missions are currently delayed."
    
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
        return "No completed missions yet."
    
    return None

async def run_query(user_query: str) -> str:
    """Main agent - uses Gemini for smart responses, fallback for missions"""
    
    try:
        q = user_query.lower()
        
        # ========== PRIORITY 1: External API Requests ==========
        if "iss" in q or "space station" in q:
            return await call_external_api("iss")
        
        if "astronaut" in q or "who is in space" in q:
            return await call_external_api("astronauts")
        
        if "spacex" in q or "space x" in q or "launch" in q:
            return await call_external_api("spacex")
        
        # ========== PRIORITY 2: Mission Data ==========
        mission_response = get_mission_response(q)
        if mission_response:
            return mission_response
        
        # ========== PRIORITY 3: Gemini AI for ANY question ==========
        if GEMINI_AVAILABLE:
            try:
                model = genai.GenerativeModel("models/gemini-1.5-flash")
                
                prompt = f"""You are AstroCargo AI, a friendly and knowledgeable space logistics assistant. 
                
You have access to this mission data:
{json.dumps(MISSIONS, indent=2)}

The user asked: "{user_query}"

Instructions:
1. If the question is about space missions, use the mission data above
2. If the question is about general knowledge (like "how to drink water", "where is water"), answer helpfully
3. Be conversational, friendly, and use emojis
4. Keep responses concise but informative
5. If it's a simple question, give a direct answer

Answer naturally:"""
                
                response = model.generate_content(prompt)
                return response.text
                
            except Exception as e:
                print(f"Gemini error: {e}")
                # Fall through to default if Gemini fails
        
        # ========== PRIORITY 4: Default Help Response ==========
        return """🤖 **AstroCargo AI Assistant** - Your Space Logistics Companion

I can help you with:

**🚀 Space Missions**
• "Show me all missions"
• "Tell me about CARGO-1"
• "Which missions are delayed?"
• "Where is CARGO-3 going?"

**🛰️ Real-time Space Data**
• "Where is the ISS right now?"
• "Who is in space?"
• "Upcoming SpaceX launches"

**💬 General Questions**
• I can also answer general questions like:
  - "How do astronauts drink water?"
  - "What is the temperature in space?"
  - "How long does it take to reach Mars?"

💡 **Just ask me anything about space or general knowledge!**
"""
        
    except Exception as e:
        return f"❌ Error: {str(e)}"