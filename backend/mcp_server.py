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
        Tool(name="get_mission_details", description="Get details of a specific mission by ID", inputSchema={"type":"object","properties":{"mission_id":{"type":"string","description":"Mission ID like CARGO-1"}},"required":["mission_id"]}),
        Tool(name="get_all_missions", description="Get all space cargo missions", inputSchema={"type":"object","properties":{}}),
        Tool(name="get_delayed_missions", description="Get all delayed missions", inputSchema={"type":"object","properties":{}}),
        Tool(name="get_missions_by_status", description="Get missions by status", inputSchema={"type":"object","properties":{"status":{"type":"string"}},"required":["status"]}),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "get_mission_details":
        mission_id = arguments.get("mission_id","").upper()
        mission = next((m for m in MISSIONS if m["id"] == mission_id), None)
        result = json.dumps(mission) if mission else f"No mission found with ID: {mission_id}"
    elif name == "get_all_missions":
        result = json.dumps([{"id":m["id"],"name":m["name"],"status":m["status"],"origin":m["origin"],"destination":m["destination"]} for m in MISSIONS])
    elif name == "get_delayed_missions":
        delayed = [m for m in MISSIONS if m["status"] == "Delayed"]
        result = json.dumps(delayed) if delayed else "No delayed missions."
    elif name == "get_missions_by_status":
        status = arguments.get("status","")
        filtered = [m for m in MISSIONS if m["status"].lower() == status.lower()]
        result = json.dumps(filtered) if filtered else f"No missions with status: {status}"
    else:
        result = f"Unknown tool: {name}"
    return [TextContent(type="text", text=result)]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
