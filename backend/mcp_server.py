from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import json
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mission_data import MISSIONS

server = Server("astrocargo-mcp-server")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="get_mission_details",
            description="Get details of a specific mission by ID",
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
            name="get_missions_by_status",
            description="Get missions by status (Delayed, In Transit, Completed)",
            inputSchema={
                "type": "object",
                "properties": {
                    "status": {"type": "string", "description": "Status: Delayed, In Transit, or Completed"}
                },
                "required": ["status"]
            }
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
    
    elif name == "get_missions_by_status":
        status = arguments.get("status", "")
        filtered = [m for m in MISSIONS if m.get("status", "").lower() == status.lower()]
        result = json.dumps(filtered, indent=2)
        return [TextContent(type="text", text=result)]
    
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())