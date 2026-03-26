from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import json
import asyncio
import httpx
from mission_data import MISSIONS

server = Server("astrocargo-mcp-server")

@server.list_tools()
async def list_tools() -> list[Tool]:
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
            name="get_real_time_space_data",
            description="Get real-time space data from external API (ISS location, astronauts, etc.)",
            inputSchema={
                "type": "object",
                "properties": {
                    "data_type": {
                        "type": "string", 
                        "description": "Type of data: 'iss_location', 'astronauts', or 'space_news'",
                        "enum": ["iss_location", "astronauts", "space_news"]
                    }
                },
                "required": ["data_type"]
            }
        ),
        Tool(
            name="get_spacex_launches",
            description="Get upcoming SpaceX launches from external API",
            inputSchema={"type": "object", "properties": {}}
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    
    if name == "get_mission_details":
        mission_id = arguments.get("mission_id", "").upper()
        mission = next((m for m in MISSIONS if m["id"] == mission_id), None)
        result = json.dumps(mission, indent=2) if mission else f"No mission found with ID: {mission_id}"
        return [TextContent(type="text", text=result)]
    
    elif name == "get_all_missions":
        result = json.dumps(MISSIONS, indent=2)
        return [TextContent(type="text", text=result)]
    
    elif name == "get_delayed_missions":
        delayed = [m for m in MISSIONS if m.get("status") == "Delayed"]
        result = json.dumps(delayed, indent=2)
        return [TextContent(type="text", text=result)]
    
    elif name == "get_real_time_space_data":
        data_type = arguments.get("data_type", "")
        
        async with httpx.AsyncClient() as client:
            if data_type == "iss_location":
                # External API: ISS current location
                response = await client.get("http://api.open-notify.org/iss-now.json")
                data = response.json()
                return [TextContent(type="text", text=json.dumps(data, indent=2))]
            
            elif data_type == "astronauts":
                # External API: People in space
                response = await client.get("http://api.open-notify.org/astros.json")
                data = response.json()
                return [TextContent(type="text", text=json.dumps(data, indent=2))]
            
            elif data_type == "space_news":
                # External API: Space news (placeholder - you can add real API)
                return [TextContent(type="text", text="Space news feature coming soon!")]
    
    elif name == "get_spacex_launches":
        async with httpx.AsyncClient() as client:
            # External API: SpaceX upcoming launches
            response = await client.get("https://api.spacexdata.com/v4/launches/upcoming")
            data = response.json()
            # Format to show only relevant info
            formatted = []
            for launch in data[:5]:  # Get next 5 launches
                formatted.append({
                    "name": launch.get("name"),
                    "date": launch.get("date_utc"),
                    "details": launch.get("details", "No details available")[:100]
                })
            return [TextContent(type="text", text=json.dumps(formatted, indent=2))]
    
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())