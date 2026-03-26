import json
import asyncio
import httpx
from typing import List
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
from mission_data import MISSIONS

server = Server("astrocargo-mcp-server")

@server.list_tools()
async def list_tools() -> List[Tool]:
    return [
        Tool(
            name="get_mission_details",
            description="Get details of a specific space cargo mission by ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "mission_id": {"type": "string", "description": "Mission ID like CARGO-1"}
                },
                "required": ["mission_id"]
            }
        ),
        Tool(
            name="get_all_missions",
            description="Get all space cargo missions",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="get_delayed_missions",
            description="Get all delayed missions with reasons",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="get_completed_missions",
            description="Get all completed missions",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="get_iss_location",
            description="Get real-time International Space Station location",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="get_astronauts",
            description="Get astronauts currently in space",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="get_spacex_launches",
            description="Get upcoming SpaceX launches",
            inputSchema={"type": "object", "properties": {}}
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> List[TextContent]:
    
    # Local Mission Data Tools
    if name == "get_mission_details":
        mission_id = arguments.get("mission_id", "").upper()
        mission = next((m for m in MISSIONS if m["id"] == mission_id), None)
        if mission:
            result = json.dumps(mission, indent=2)
        else:
            result = f"No mission found with ID: {mission_id}"
        return [TextContent(type="text", text=result)]
    
    elif name == "get_all_missions":
        result = json.dumps(MISSIONS, indent=2)
        return [TextContent(type="text", text=result)]
    
    elif name == "get_delayed_missions":
        delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
        result = json.dumps(delayed, indent=2) if delayed else "No delayed missions"
        return [TextContent(type="text", text=result)]
    
    elif name == "get_completed_missions":
        completed = [m for m in MISSIONS if m.get("status") == "Completed"]
        result = json.dumps(completed, indent=2) if completed else "No completed missions"
        return [TextContent(type="text", text=result)]
    
    # External APIs
    elif name == "get_iss_location":
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("http://api.open-notify.org/iss-now.json", timeout=10.0)
                data = response.json()
                iss_data = data.get("iss_position", {})
                result = f"🌍 **ISS Current Location:**\n📍 Latitude: {iss_data.get('latitude', 'N/A')}\n📍 Longitude: {iss_data.get('longitude', 'N/A')}\n🕐 Timestamp: {data.get('timestamp', 'N/A')}"
                return [TextContent(type="text", text=result)]
            except Exception as e:
                return [TextContent(type="text", text=f"Error: {str(e)}")]
    
    elif name == "get_astronauts":
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("http://api.open-notify.org/astros.json", timeout=10.0)
                data = response.json()
                astronauts = data.get("people", [])
                result = f"👨‍🚀 **Astronauts in Space ({len(astronauts)}):**\n\n"
                for i, astro in enumerate(astronauts, 1):
                    result += f"{i}. {astro['name']} ({astro['craft']})\n"
                return [TextContent(type="text", text=result)]
            except Exception as e:
                return [TextContent(type="text", text=f"Error: {str(e)}")]
    
    elif name == "get_spacex_launches":
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("https://api.spacexdata.com/v4/launches/upcoming", timeout=10.0)
                launches = response.json()
                if not launches:
                    return [TextContent(type="text", text="No upcoming SpaceX launches found.")]
                
                result = "🚀 **Upcoming SpaceX Launches:**\n\n"
                for launch in launches[:5]:
                    result += f"**{launch.get('name')}**\n"
                    result += f"📅 Date: {launch.get('date_utc', 'TBD')[:10]}\n"
                    details = launch.get('details', 'No details available')
                    if details:
                        result += f"📝 {details[:150]}\n"
                    result += "\n"
                return [TextContent(type="text", text=result)]
            except Exception as e:
                return [TextContent(type="text", text=f"Error: {str(e)}")]
    
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())