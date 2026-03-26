import os
import json
from typing import List, Dict, Any
from mission_data import MISSIONS

# =========================
# 🔧 CORE FUNCTIONS
# =========================

def get_all_missions() -> str:
    result = "🚀 All Missions:\n"
    for m in MISSIONS:
        result += f"- {m['id']} → {m['destination']} ({m['status']})\n"
    return result


def get_mission_details(mission_id: str) -> str:
    mission = next((m for m in MISSIONS if m["id"] == mission_id.upper()), None)

    if not mission:
        return f"❌ Mission {mission_id} not found"

    return f"""
🚀 Mission: {mission['id']}
📍 From: {mission['origin']}
🎯 To: {mission['destination']}
📊 Status: {mission['status']}
📅 Launch: {mission['launch_date']}
⏳ ETA: {mission['eta']}
📦 Cargo: {", ".join(mission['cargo'])}
⚠️ Note: {mission['reason']}
"""


def get_delayed_missions() -> str:
    delayed = [m for m in MISSIONS if m["status"] == "Delayed"]

    if not delayed:
        return "✅ No delayed missions"

    result = "⚠️ Delayed Missions:\n"
    for m in delayed:
        result += f"- {m['id']} → {m['destination']}\n"
        result += f"  Reason: {m['reason']}\n"

    return result


def get_missions_by_status(status: str) -> str:
    filtered = [m for m in MISSIONS if m["status"].lower() == status.lower()]

    if not filtered:
        return f"❌ No missions with status '{status}'"

    result = f"📊 Missions ({status}):\n"
    for m in filtered:
        result += f"- {m['id']} → {m['destination']}\n"

    return result


def get_missions_by_destination(destination: str) -> str:
    filtered = [m for m in MISSIONS if destination.lower() in m["destination"].lower()]

    if not filtered:
        return f"❌ No missions going to {destination}"

    result = f"🪐 Missions to {destination}:\n"
    for m in filtered:
        result += f"- {m['id']} ({m['status']})\n"

    return result


# =========================
# 🧠 QUERY ENGINE (SMART)
# =========================

def process_query(query: str) -> str:
    q = query.lower()

    # Specific mission
    for mid in ["cargo-1", "cargo-2", "cargo-3", "cargo-4"]:
        if mid in q:
            return get_mission_details(mid)

    # Delayed
    if "delay" in q:
        return get_delayed_missions()

    # All missions
    if "all" in q or "list" in q:
        return get_all_missions()

    # Status-based
    if "transit" in q:
        return get_missions_by_status("In Transit")

    if "completed" in q:
        return get_missions_by_status("Completed")

    if "scheduled" in q:
        return get_missions_by_status("Scheduled")

    # Destination-based
    if "mars" in q:
        return get_missions_by_destination("Mars")

    if "moon" in q:
        return get_missions_by_destination("Moon")

    if "iss" in q or "space station" in q:
        return get_missions_by_destination("International Space Station")

    # Fallback suggestions
    return """🤖 I can help you with space cargo missions!

Try:
- Show me all missions
- Tell me about CARGO-1
- Which missions are delayed?
- Show missions to Mars
- Show in transit missions
"""


# =========================
# 🤖 GEMINI + FALLBACK
# =========================

async def ask_astrocargo(query: str) -> str:
    try:
        import google.generativeai as genai
        from dotenv import load_dotenv

        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        print("API KEY:", api_key)

        # 🧠 If Gemini exists → ALWAYS use it (primary brain)
        if api_key and api_key.startswith("AIza"):
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("models/gemini-1.5-flash")

            prompt = f"""
You are AstroCargo AI 🚀 — a smart assistant like ChatGPT/Claude.

You can:
1. Answer general questions (like education, science, etc.)
2. Answer space mission queries using the data below

Mission Data:
{json.dumps(MISSIONS, indent=2)}

User Question:
{query}

Instructions:
- If mission-related → use mission data
- If general → answer normally (like ChatGPT)
- Always give a clear answer
- Then give 2 helpful suggestions user can ask next

Format:

Answer:
<your answer>

Suggestions:
- ...
- ...
"""

            response = model.generate_content(prompt)
            return response.text

        # 🔁 fallback ONLY if Gemini fails
        return process_query(query)

    except Exception as e:
        return f"❌ Error: {str(e)}"
   