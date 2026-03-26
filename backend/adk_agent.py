import asyncio
import os
import sys
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part

AGENT_INSTRUCTION = """You are AstroCargo AI, an intelligent space logistics assistant using Model Context Protocol (MCP).

You have access to the following MCP tools:
- get_mission_details: Get details of a specific space cargo mission
- get_all_missions: List all space cargo missions  
- get_delayed_missions: Show delayed missions with reasons
- get_real_time_space_data: Get real-time space data (ISS location, astronauts in space)
- get_spacex_launches: Get upcoming SpaceX launches

Instructions:
1. Use MCP tools to fetch real data - never make up information
2. If a user asks about space missions, use the mission tools
3. If a user asks about real-time space data (ISS, astronauts), use the real-time data tools
4. Combine data from multiple tools when relevant
5. Be concise but informative
"""

async def create_agent():
    """Create and return the ADK agent with MCP tools"""
    
    # Path to MCP server
    mcp_server_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mcp_server.py")
    
    # Connect to MCP server
    tools, exit_stack = await MCPToolset.from_server(
        connection_params=StdioServerParameters(
            command=sys.executable,
            args=[mcp_server_path],
        )
    )
    
    # Create ADK agent with MCP tools
    agent = LlmAgent(
        model="gemini-2.0-flash-exp",
        name="astrocargo_mcp_agent",
        instruction=AGENT_INSTRUCTION,
        tools=tools,
    )
    
    return agent, exit_stack

async def run_query(user_query: str) -> str:
    """Run a query through the ADK agent with MCP tools"""
    
    try:
        agent, exit_stack = await create_agent()
        
        session_service = InMemorySessionService()
        await session_service.create_session(
            app_name="astrocargo",
            user_id="user_1",
            session_id="session_1"
        )
        
        runner = Runner(
            agent=agent,
            app_name="astrocargo",
            session_service=session_service
        )
        
        message = Content(role="user", parts=[Part(text=user_query)])
        
        response_text = ""
        async for event in runner.run_async(
            user_id="user_1",
            session_id="session_1",
            new_message=message
        ):
            if event.is_final_response():
                if event.content and event.content.parts:
                    response_text = event.content.parts[0].text
                break
        
        await exit_stack.aclose()
        return response_text or "Sorry, I could not process your request."
        
    except Exception as e:
        return f"Error: {str(e)}"