---
layout: default
title: Develop an ADK agent
nav_order: 3
parent: MCP - Query data interactively with an AI agent
---

# Develop your own ADK agent

We provide two sample Google Agent Development Kit-based agents you can use as inspiration for building your own agent:

- [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb) is a Google Colab tutorial that shows how to build an ADK Python agent step by step. 
- The sample [basic agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent) is a simple Python ADK agent you can use to develop locally. At the most basic level, you can modify its configuration, including:
   - The [AGENT_INSTRUCTIONS](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py)
   - The [AGENT_MODEL](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py#L23)
   - The transport layer protocol: see [Connect to a remote server](/mcp/run_tools.html#connect-to-an-already-running-server-from-a-remote-client) for details.

   To run the custom code, see [Use the sample agent](/mcp/run_tools.html#use-the-sample-agent).

## Test with MCP Inspector

If you're interested in getting a deeper understanding of Data Commons tools and API, the [MCP Inspector](https://modelcontextprotocol.io/legacy/tools/inspector) is a useful web UI for interactively sending tool calls to the server using JSON messages. It runs locally and spawns a server. It uses token-based OAuth for authentication, which it generates itself, so you don't need to specify any keys.

To use it:

1. If not already installed on your system, install [`Node.js`](https://nodejs.org/en/download) and [`uv`](https://docs.astral.sh/uv/getting-started/installation/).
1. Ensure you've set up the relevant server [environment variables](/mcp/run_tools.html#environment-variables). If you're using a `.env` file, go to the directory where the file is stored.
1. Run:
   ```
   npx @modelcontextprotocol/inspector uvx datacommons-mcp serve stdio
   ```
1. Open the Inspector via the pre-filled session token URL which is printed to terminal on server startup. It should look like `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=<session token>`. 
1. Click on the link to open the browser. The tool is prepopulated with all relevant variables.
1. In the far left pane, click **Connect**. 
1. Click the **Tools** button to display the Data Commons tools and prompts.
1. In the left pane, select a tool. 
1. In the right pane, scroll below the prompts to view the input form.
1. Enter values for required fields and click **Run Tool**. Data are shown in the **Tool Result** box.

