---
layout: default
title: Use MCP
nav_order: 2
parent: MCP - Query data interactively with an AI agent
---

{:.no_toc}
# Use MCP

This page describes how to run a local agent and connect to a Data Commons MCP server to query datacommons.org, using the centrally hosted server at `https://api.datacommons.org/mcp`. 

For advanced use cases, such as developing a custom agent, [Run a self-hosted MCP server](host_server.md) describes how to run your own local server and connect to it from an agent. 

For procedures for Custom Data Commons instances, please see instead [Use MCP tools](/custom_dc/mcp.html).

* TOC
{:toc}

We provide specific instructions for the following clients:

* [Google Antigravity](#antigravity) (CLI or IDE)

* A [sample basic agent](#use-the-sample-agent) based on the Google [Agent Development Kit](https://google.github.io/adk-docs/){: target="_blank"}

For other clients/agents, see the relevant documentation; you should be able to easily adapt the configurations detailed here.

## Prerequisites

This is required for all agents, regardless of the server deployment:

- A (free) Data Commons API key. To obtain an API key, go to <https://apikeys.datacommons.org>{: target="_blank"} and request a key for the `api.datacommons.org` domain.

{: #antigravity}
## Use Google Antigravity

1. Download and install Google Antigravity from <https://antigravity.google/download>.
2. To configure Antigravity to connect to the Data Commons server, use the IDE or a text editor to open `~/.gemini/config/mcp_config.json` and add the following:
   <pre>
   {
      "mcpServers": {
         "datacommons-mcp": {
            "serverUrl": "https://api.datacommons.org/mcp",
            "headers": {
               "X-API-Key": "<var>YOUR_DATA_COMMONS_API_KEY</var>"
            }
         }
      }
   }
   </pre>
3. Run the IDE or CLI as usual.
4. Start sending [natural-language queries](#sample-queries).

To see the Data Commons tools, use `/mcp tools`. To see the Data Commons resources, use `/mcp resources`.

> **Tip**: Data Commons provides a set of [agent skills](index.md#skills) as server resources, so you don't need to provide any Data Commons-specific customizations.

## Use the sample agent 

**Additional prerequisites** 

In addition to the Data Commons API key, you will need:
- [Git](https://git-scm.com/){: target="_blank"} installed.
- [`uv`](https://docs.astral.sh/uv/getting-started/installation/), a Python package manager, installed.

> Tip: You do not need to install the Google ADK; when you use the [command we provide](#run-sample) to start the agent, it downloads the ADK dependencies at run time.

{:.no_toc}
### Install

From the desired directory, clone the `agent-toolkit` repo:
```bash
git clone https://github.com/datacommonsorg/agent-toolkit.git
```

{:.no_toc}
{: #run-sample}
### Run

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

{:.no_toc}
{: #customize-agent}
### Customize the agent

To customize the sample agent, you can make changes directly to the Python files. You'll need to [restart the agent](#run-sample) any time you make changes.

{:.no_toc}
#### Customize the model

To change to a different LLM or model version, edit the `AGENT_MODEL` constant in [packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py#L23){: target="_blank"}.

{:.no_toc}
#### Customize agent behavior {#agent-behavior}

The agent's behavior is determined by prompts provided in the `AGENT_INSTRUCTIONS` in [packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py){: target="_blank"}.

You can add your own prompts to modify how the client processes the results of tool calls. See the Google ADK page on [LLM agent instructions](https://google.github.io/adk-docs/agents/llm-agents/#guiding-the-agent-instructions-instruction){: target="_blank"} for tips on how to write good prompts.

> Tip: Data Commons provides a set of agent [skills](index.md#skills) as server resources, so you don't need to provide any Data Commons-specific instructions.

## Sample queries

The Data Commons MCP tools excel at natural-language queries that involve:
- Comparisons between two or more entities, such as countries or metrics
- Exploring data available for a given topic

Here are some examples of such queries:

- "What health data do you have for Africa?"
- "What data do you have on water quality in Zimbabwe?"
- "Compare the life expectancy, economic inequality, and GDP growth for BRICS nations."
- "Generate a concise report on income vs diabetes in US counties."
