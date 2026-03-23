import asyncio
import sys
import os

AGENT_INSTRUCTION = """You are AstroCargo AI, an intelligent space logistics assistant.
You help users track space cargo missions between Earth, the Moon, Mars and deep space stations.
Always use MCP tools to fetch real mission data. Never make up details.
Be concise but informative. If a mission is delayed, always mention the delay reason.
"""

async def run_query(user_query: str) -> str:
    from google.adk.agents import LlmAgent
    from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai.types import Content, Part

    mcp_server_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mcp_server.py")

    tools, exit_stack = await MCPToolset.from_server(
        connection_params=StdioServerParameters(
            command=sys.executable,
            args=[mcp_server_path],
        )
    )

    agent = LlmAgent(
        model="gemini-2.0-flash",
        name="astrocargo_agent",
        instruction=AGENT_INSTRUCTION,
        tools=tools,
    )

    try:
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

        return response_text or "Sorry, I could not process your request."

    finally:
        await exit_stack.aclose()

async def ask_astrocargo(query: str) -> str:
    return await run_query(query)

def get_agent():
    return None
