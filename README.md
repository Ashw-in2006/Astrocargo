# 🚀 AstroCargo AI - Track 2 MCP Agent

## 📌 Project Overview

AstroCargo AI is a space logistics assistant that connects AI agents to real-world space data using **Model Context Protocol (MCP)**. It provides real-time information about cargo missions, ISS location, astronauts, and SpaceX launches.

**Track:** 2 - Connect AI agents to real-world data using MCP

---

## ✨ Features

- 🚀 **Space Missions** - View all cargo missions, status, delays
- 🌍 **ISS Location** - Real-time International Space Station tracking
- 👨‍🚀 **Astronauts** - Who's currently in space
- 🚀 **SpaceX Launches** - Upcoming launches
- 💬 **Natural Language Chat** - Ask questions naturally

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI, ADK, MCP |
| Frontend | React, TypeScript, Tailwind CSS |
| APIs | Open Notify, SpaceX Data |
| Deployment | Docker, Cloud Run |

---

## 📸 Screenshots
<img width="1903" height="893" alt="image" src="https://github.com/user-attachments/assets/dfe2c2e9-dc0e-4556-8747-e21f6150a666" />



---

## 🚀 How to Run

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### Step 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8081
Step 2: Start Frontend (New Terminal)
bash
npm install
npm run dev
Step 3: Open Browser
text
http://localhost:5173
Click "AI Search" and start chatting!

💬 Example Questions
Ask This	Get This
"Who is in space?"	List of astronauts
"Where is the ISS?"	Current location
"Show me all missions"	All cargo missions
"Upcoming launches"	SpaceX launches
"Tell me about CARGO-1"	Mission details
🔗 API Endpoints
Endpoint	Method	Description
/health	GET	Check backend status
/chat	POST	Send message to AI
/agent-status	GET	Agent information
📁 Project Structure
text
orbitops-main/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── adk_agent.py     # AI agent logic
│   ├── mission_data.py  # Mission dataset
│   └── requirements.txt # Python packages
├── src/
│   ├── pages/AISearch.tsx  # Chat interface
│   └── lib/api.ts          # API client
└── package.json
🐳 Docker Deployment
bash
cd backend
docker build -t astrocargo-agent .
docker run -p 8081:8081 astrocargo-agent
✅ Track 2 Compliance
Requirement	Status
ADK Agent	✅
MCP Protocol	✅
External Data Source	✅ (ISS, Astronauts, SpaceX APIs)
Real-time Data	✅
Cloud Ready	✅
📝 Notes
Works without Gemini API key (fallback mode)

All external APIs are free

Chat history saves automatically

👨‍💻 Author
ASHWIN R

📅 Submission Date
March 2026
