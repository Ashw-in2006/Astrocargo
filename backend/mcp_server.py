"""MCP Server exposing space cargo mission tools"""
import json
from mcp.server import Server, stdio_server
from mission_data import get_mission, get_delayed_missions, MISSIONS

server = Server("astrocargo-mcp-server")

@server.list_tools()
async def list_tools():
    """List all available tools for the AI agent"""
    return [
        {
            "name": "get_mission_details",
            "description": "Get detailed information about a specific space cargo mission by its ID",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "mission_id": {
                        "type": "string",
                        "description": "Mission ID (e.g., CARGO-1, CARGO-2)"
                    }
                },
                "required": ["mission_id"]
            }
        },
        {
            "name": "get_delayed_missions",
            "description": "Get all missions that are currently delayed with their delay reasons",
            "inputSchema": {
                "type": "object",
                "properties": {}
            }
        },
        {
            "name": "get_all_missions",
            "description": "Get a list of all space cargo missions",
            "inputSchema": {
                "type": "object",
                "properties": {}
            }
        }
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """Execute the requested tool with given arguments"""
    
    if name == "get_mission_details":
        mission_id = arguments.get("mission_id")
        mission = get_mission(mission_id)
        if mission:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(mission, indent=2)
                    }
                ]
            }
        return {
            "content": [
                {
                    "type": "text",
                    "text": f"Mission {mission_id} not found"
                }
            ]
        }
    
    elif name == "get_delayed_missions":
        delayed = get_delayed_missions()
        if delayed:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(delayed, indent=2)
                    }
                ]
            }
        return {
            "content": [
                {
                    "type": "text",
                    "text": "No missions are currently delayed"
                }
            ]
        }
    
    elif name == "get_all_missions":
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps(MISSIONS, indent=2)
                }
            ]
        }
    
    return {
        "content": [
            {
                "type": "text",
                "text": f"Unknown tool: {name}"
            }
        ]
    }

async def main():
    """Run the MCP server"""
    async with stdio_server() as streams:
        await server.run(streams[0], streams[1])

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
