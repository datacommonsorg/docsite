---
layout: default
title: Develop a custom agent
nav_order: 3
parent: MCP - Query data interactively with an AI agent
---


{:.no_toc}
# Develop a custom agent

* TOC
{:toc}


We provide two sample Google Agent Development Kit-based agents you can use as inspiration for building your own agent:

- [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb) is a Google Colab tutorial that shows how to build an ADK Python agent step by step. 
- The sample [basic agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent) is a simple Python [Google ADK](https://google.github.io/adk-docs/) agent you can use to develop locally. You can make changes directly to the Python files. You'll need to [restart the agent](/mcp/run_tools.html#use-the-sample-agent) any time you make changes.

> Tip: You do not need to install the Google ADK; when you use the [command we provide](run_tools.md#use-the-sample-agent) to start the agent, it downloads the ADK dependencies at run time.

## Use the sample agent 

**Additional prerequisites** 

In addition to the Data Commons API key, you will need:
- [Git](https://git-scm.com/){: target="_blank"} installed.
- [`uv`](https://docs.astral.sh/uv/getting-started/installation/){: target="_blank"} installed.

> Tip: You do not need to install the Google ADK; when you use the [command we provide](run_tools.md#use-the-sample-agent) to start the agent, it downloads the ADK dependencies at run time.

### Install

From the desired directory, clone the `agent-toolkit` repo:
```bash
git clone https://github.com/datacommonsorg/agent-toolkit.git
```

### Run

By default, the agent connects to the hosted MCP server. If you want to spawn a local server from the agent, or connect to a local standalone server, modify the code as described in [Connect to a local server](#local) before using this procedure. 

1. Go to the root directory of the repo:
   ```bash
   cd agent-toolkit
   ```
1. Run the agent using one of the following methods.

{:.no_toc}
#### Web UI (recommended)

1. Run the following command:
   ```bash
   uvx --from google-adk adk web ./packages/datacommons-mcp/examples/sample_agents/
   ```
1. Point your browser to the address and port displayed on the screen (e.g. `http://127.0.0.1:8000/`). The Agent Development Kit Dev UI is displayed. 
1. From the **Type a message** box, type your [query for Data Commons](#sample-queries) or select another action.

{:.no_toc}
#### Command line interface

1. Run the following command:
   ```bash
   uvx --from google-adk adk run ./packages/datacommons-mcp/examples/sample_agents/basic_agent
   ```
1. Enter your [queries](#sample-queries) at the `User` prompt in the terminal.

{: #local}
### Configure to connect to a local server

For development purposes, you are likely to want to run the server locally. 

- To connect to a local [standalone server running Streaming HTTP](run_tools.md#standalone), modify [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py){: target="_blank"} to specify the correct hostname and port for the `httpUrl`. 

- To spawn a local server that uses the Stdio protocol, modify [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py){: target="_blank"} to set import modules and agent initialization parameters as follows:

```python
from google.adk.tools.mcp_tool.mcp_toolset import (
    McpToolset,
    StdioConnectionParams,
    StdioServerParameters,
)

//...

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
                    env={"DC_API_KEY": DC_API_KEY},
                ),
            )
        )
    ],
)
```
[Run the startup commands](#run) as usual.

## Customize the agent

To customize the sample agent, you can make changes directly to the Python files. You'll need to [restart the agent](#run) any time you make changes.

### Customize the model

To change to a different LLM or model version, edit the `AGENT_MODEL` constant in [packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py#L23){: target="_blank"}.

### Customize agent behavior

The agent's behavior is determined by prompts provided in the `AGENT_INSTRUCTIONS` in [packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py){: target="_blank"}.

You can add your own prompts to modify how the agent handles tool results. See the Google ADK page on [LLM agent instructions](https://google.github.io/adk-docs/agents/llm-agents/#guiding-the-agent-instructions-instruction){: target="_blank"} for tips on how to write good prompts.

