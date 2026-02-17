---
layout: default
title: Run an MCP Server
nav_order: 3
parent: MCP - Query data interactively with an AI agent
---

{:.no_toc}
# Run a self-hosted MCP server

This page describes how to run your own local Data Commons MCP server and connect to it from an agent. This is useful for advanced use cases, such as developing your own custom AI agent/client to use with Data Commons.

For procedures for Custom Data Commons instances, please see instead [Run MCP tools](/custom_dc/run_mcp_tools.html).

* TOC
{:toc}

We provide procedures for the following scenarios:
- Local server and local agent: The agent spawns the server in a subprocess using Stdio as the transport protocol.
- Remote server and local agent: You start up the server as a standalone process and then connect the agent to it using streaming HTTP as the protocol.

For both scenarios, we use Gemini CLI and the sample agent as examples. You should be able to adapt the configurations to other MCP-compliant agents/clients.

> **Tip:** For an end-to-end tutorial using a locally running server and agent over HTTP, see the sample Data Commons Colab notebook, [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb){: target="_blank"}.

## Prerequisites

In addition to a [Data Commons API key](run_tools.md#prerequisites), you will need the following:

- Install `uv` for managing and installing Python packages; see the instructions at <https://docs.astral.sh/uv/getting-started/installation/>{: target="_blank"}. 

## Run a local server and agent

### Gemini CLI

To instruct Gemini CLI to start up a local server using Stdio, replace the `datacommons-mcp` section in your `settings.json` file as follows:

<pre>
{
   ...
   "mcpServers": {
      "datacommons-mcp": {
         "command": "uvx",
         "args": [
            "datacommons-mcp@latest",
            "serve",
            "stdio"
         ],
         // Only needed if you have not set the key in your environment
         "env": "<var>YOUR DC API KEY</var>"
      }
   }
   ...
}
</pre>

[Run Gemini CLI](run_tools.md#run-gemini) as usual.

### Sample agent

To instruct the sample agent to spawn a local server that uses the Stdio protocol, modify [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py){: target="_blank"} to set import modules and agent initialization parameters as follows:

```python
from google.adk.tools.mcp_tool.mcp_toolset import (
    McpToolset,
    StdioConnectionParams,
    StdioServerParameters,
)

#...

root_agent = LlmAgent(
    model=AGENT_MODEL,
    name="basic_agent",
    instruction=AGENT_INSTRUCTIONS,
    tools=[
        McpToolset(
            connection_params=StdioConnectionParams(
                timeout=10,
                server_params=StdioServerParameters(
                    command="uvx",
                    args=["datacommons-mcp", "serve", "stdio"],
                    env={"DC_API_KEY": DC_API_KEY}
                )
            )
        )
    ],
)
```
[Run the startup commands](run_tools.md#run-sample) as usual.

## Run a remote server and a local agent

{: #standalone}
### Step 1: Start the server as a standalone process

1. Be sure to set the API key as an [environment variable](run_tools.md#prerequisites).
2. Run:
   <pre>
   uvx datacommons-mcp serve http [--host <var>HOSTNAME</var>] [--port <var>PORT</var>]
   </pre>
   By default, the host is `localhost` and the port is `8080` if you don't set these flags explicitly.

The server is addressable with the endpoint `mcp`. For example, `http://my-mcp-server:8080/mcp`.

{: #standalone-client}
### Step 2: Configure an agent to connect to the running server

#### Gemini CLI

1. Replace the `datacommons-mcp` section in your `settings.json` file as follows:
   <pre>
   {
      "mcpServers": {
         "datacommons-mcp": {
           "httpUrl": "http://<var>HOST</var>:<var>PORT</var>/mcp",
           "headers": {
             "Accept": "application/json, text/event-stream"
            }
         }
      }
   }
   </pre>

1. [Run Gemini CLI](run_tools.md#run-gemini) as usual.

#### Sample agent

1. Modify [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py){: target="_blank"} as follows:
   <pre>
   from google.adk.tools.mcp_tool.mcp_toolset import (
   MCPToolset,
   StreamableHTTPConnectionParams
   )
   #...
   root_agent = LlmAgent(
      # ...
      tools=[McpToolset(
         connection_params=StreamableHTTPConnectionParams(
            url="http://<var>HOST</var>:<var>PORT</var>/mcp",
            headers={
               "Accept": "application/json, text/event-stream"
            }
         )
      )
    ],
   )  
   </pre>
1. Customize the agent as desired, as described in [Customize the agent](run_tools.md#customize-agent).
1. [Run the startup commands](run_tools.md#run-sample) as usual.

<script src="/assets/js/customdc-doc-tabs.js"></script>
