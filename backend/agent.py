"""ADK Agent that uses MCP tools to answer space logistics questions"""
import asyncio
import subprocess
import sys
import json
from google.adk.agents import Agent
from google.adk.models import GeminiModel
from google.adk.tools import FunctionTool
from mcp import Client

class AstroCargoAgent:
    def __init__(self):
        self.server_process = None
        self.mcp_client = None
        self.agent = None
        
    async def initialize(self):
        """Initialize MCP server connection and ADK agent"""
        # Start MCP server as subprocess
        self.server_process = subprocess.Popen(
            [sys.executable, "mcp_server.py"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Connect to MCP server
        self.mcp_client = Client()
        await self.mcp_client.connect_to_stdio(self.server_process)
        
        # Get tools from MCP server
        tools = await self.get_mcp_tools()
        
        # Create ADK agent
        self.agent = Agent(
            name="astrocargo_agent",
            model=GeminiModel(model_name="gemini-1.5-flash"),
            instruction="""You are AstroCargo, an AI-powered space logistics assistant for NASA-style missions.
            
            Your job is to help users with information about space cargo missions. You have access to real mission data through MCP tools.
            
            When answering questions:
            1. Use the available MCP tools to fetch real mission data
            2. Provide clear, accurate information about mission status, delays, cargo, and timelines
            3. If a mission is delayed, explain the reason
            4. Be enthusiastic about space exploration!
            
            Always verify information through the tools before answering - don't make up data.""",
            tools=tools
        )
    
    async def get_mcp_tools(self):
        """Convert MCP tools to ADK FunctionTools"""
        mcp_tools = await self.mcp_client.list_tools()
        adk_tools = []
        
        for tool in mcp_tools:
            # Create wrapper function for each MCP tool
            async def make_tool_call(tool_name=tool["name"]):
                async def wrapper(**kwargs):
                    result = await self.mcp_client.call_tool(tool_name, kwargs)
                    # Parse MCP response
                    if result and "content" in result:
                        for content in result["content"]:
                            if content["type"] == "text":
                                return content["text"]
                    return "No data available"
                return wrapper
            
            adk_tools.append(
                FunctionTool(
                    name=tool["name"],
                    description=tool["description"],
                    function=await make_tool_call()
                )
            )
        
        return adk_tools
    
    async def ask(self, user_query):
        """Process user query and return AI response"""
        if not self.agent:
            await self.initialize()
        
        response = await self.agent.run(user_query)
        return response
    
    async def cleanup(self):
        """Clean up MCP server process"""
        if self.server_process:
            self.server_process.terminate()
            await self.server_process.wait()

# Global agent instance
_agent_instance = None

async def get_agent():
    """Get or create the global agent instance"""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = AstroCargoAgent()
        await _agent_instance.initialize()
    return _agent_instance

async def ask_astrocargo(query: str) -> str:
    """Main entry point for queries"""
    agent = await get_agent()
    response = await agent.ask(query)
    return response
