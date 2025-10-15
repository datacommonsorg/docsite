---
layout: default
title: Run MCP tools
nav_order: 2
parent: MCP - Query data interactively with an AI agent
---

{:.no_toc}
# Run MCP tools

This page shows you how to run a local agent and connect to a server running locally or remotely.

* TOC
{:toc}


We provide specific instructions for the following agents:
<!--[Gemini CLI extension](https://blog.google/technology/developers/gemini-cli-extensions/) -- Best for querying datacommons.org, requires minimal setup.See the [Quickstart](quickstart.md) for this option. -->
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) 
   - Can be used for datacommons.org or a Custom Data Commons instance
   - Requires minimal setup 
   - Uses [Gemini Flash 2.5](https://deepmind.google/models/gemini/flash/) 

   See [Use Gemini CLI](#use-gemini-cli) for this option.
- A sample basic agent based on the Google [Agent Development Kit](https://google.github.io/adk-docs/) and [Gemini Flash 2.5](https://deepmind.google/models/gemini/flash/) 
   - Best for interacting with a Web UI
   - Can be used for datacommons.org or a Custom Data Commons instance
   - Can be customized to run other LLMs
   - Requires some additional setup

   See [Use the sample agent](#use-the-sample-agent) for this option

For an end-to-end tutorial using a server and agent over HTTP in the cloud, see the sample Data Commons Colab notebook, [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb).

For other clients/agents, see the relevant documentation; you should be able to reuse the commands and arguments detailed below.

## Prerequisites

For all instances:

- A (free) Data Commons API key. To obtain an API key, go to <https://apikeys.datacommons.org> and request a key for the `api.datacommons.org` domain.
- For running the sample agent or the Colab notebook, a GCP project and a Google AI API key. For details on supported keys, see <https://google.github.io/adk-docs/get-started/quickstart/#set-up-the-model>.
- For running the sample agent locally, or running the server locally in standalone mode, install `uv` for managing and installing Python packages; see the instructions at <https://docs.astral.sh/uv/getting-started/installation/>. 
- For running the sample agent locally, install [Git](https://git-scm.com/).

> **Important**: Additionally, for custom Data Commons instances:
> If you have not rebuilt your Data Commons image since the stable release of 2025-09-08, you must [sync to the latest stable release](/custom_dc/build_image.html#sync-code-to-the-stable-branch), [rebuild your image](/custom_dc/build_image.html#build-package) and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).


## Configure environment variables

### Base Data Commons (datacommons.org)

For basic usage against datacommons.org, set the required `DC_API_KEY` in your shell/startup script (e.g. `.bashrc`).
```bash
export DC_API_KEY=<your API key>
```

### Custom Data Commons

If you're running a against a custom Data Commons instance, we recommend using a `.env` file, which the server locates automatically, to keep all the settings in one place. All supported options are documented in <https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/.env.sample>. 

To set variables using a `.env` file:

1. From Github, download the file [`.env.sample`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/.env.sample) to the desired directory. Or, if you plan to run the sample agent, clone the repo <https://github.com/datacommonsorg/agent-toolkit/>.

1. From the directory where you saved the sample file, copy it to a new file called `.env`. For example:
   ```bash
   cd ~/agent-toolkit/packages/datacommons-mcp
   cp .env.sample .env
   ```
1. Set the following variables: 
   - `DC_API_KEY`: Set to your Data Commons API key
   - `DC_TYPE`: Set to `custom`.
   - `CUSTOM_DC_URL`: Uncomment and set to the URL of your instance. 
1. Optionally, set other variables.
1. Save the file.

## Use Gemini CLI

1. Install Gemini CLI: see instructions at <https://github.com/google-gemini/gemini-cli#quick-install>. 
2. To configure Gemini CLI to recognize the Data Commons server, edit your `~/.gemini/settings.json` file to add the following:

```jsonc
{
// ...
    "mcpServers": {
       "datacommons-mcp": {
           "command": "uvx",
            "args": [
                "datacommons-mcp@latest",
                "serve",
                "stdio"
            ],
            "env": {
                "DC_API_KEY": "<your Data Commons API key>"
            },
            "trust": true
        }
    }
// ...
}
```
1. From any directory, run `gemini`. 
1. To see the Data Commons tools, use `/mcp tools`.
1. Start sending [natural-language queries](#sample-queries).

> **Tip**: To ensure that Gemini CLI uses the Data Commons MCP tools, and not its own `GoogleSearch` tool, include a prompt to use Data Commons in your query. For example, use a query like "Use Data Commons tools to answer the following: ..."  You can also add such a prompt to a [`GEMINI.md` file](https://codelabs.developers.google.com/gemini-cli-hands-on#9) so that it's persisted across sessions.

## Use the sample agent

We provide a basic agent for interacting with the MCP Server in [packages/datacommons-mcp/examples/sample_agents/basic_agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent). To run the agent locally:

1. If not already installed, install `uv` for managing and installing Python packages; see the instructions at <https://docs.astral.sh/uv/getting-started/installation/>. 
1. From the desired directory, clone the `agent-toolkit` repo:
   ```bash
   git clone https://github.com/datacommonsorg/agent-toolkit.git
   ```
1. Set the following environment variables in your shell or startup script:
   ```bash
   export DC_API_KEY=<your Data Commons API key>
   export GEMINI_API_KEY=<your Google AI API key>
   ```
1. Go to the root directory of the repo:
   ```bash
   cd agent-toolkit
   ```
1. Run the agent using one of the following methods.

### Web UI (recommended)

1. Run the following command:
   ```bash
   uvx --from google-adk adk web ./packages/datacommons-mcp/examples/sample_agents/
   ```
1. Point your browser to the address and port displayed on the screen (e.g. `http://127.0.0.1:8000/`). The Agent Development Kit Dev UI is displayed. 
1. From the **Type a message** box, type your [query for Data Commons](#sample-queries) or select another action.

### Command line interface

1. Run the following command:
   ```bash
   uvx --from google-adk adk run ./packages/datacommons-mcp/examples/sample_agents/basic_agent
   ```
1. Enter your [queries](#sample-queries) at the `User` prompt in the terminal.

## Sample queries

The Data Commons MCP tools excel at natural-language queries that involve comparisons between two or more entities, such as countries or metrics. Here are some examples of such queries:

- "What health data do you have for Africa?"
- "Compare the life expectancy, economic inequality, and GDP growth for BRICS nations."
- "Generate a concise report on income vs diabetes in US counties."

## Use a remote server/client

### Run a standalone server

1. Ensure you've set up the relevant server [environment variables](#environment-variables). If you're using a `.env` file, go to the directory where the file is stored.
1. Run:
   ```bash
   uvx datacommons-mcp serve http [--port <port>]
   ```
By default, the port is 8080 if you don't set it explicitly.

The server is addressable with the endpoint `mcp`. For example, `http://my-mcp-server:8080/mcp`.

### Connect to an already-running server from a remote client

Below we provide instructions for Gemini CLI and a sample ADK agent. If you're using a different client, consult its documentation to determine how to specify an HTTP URL.

#### Gemini CLI

To configure Gemini CLI to connect to a remote Data Commons server over HTTP, replace the `mcpServers` section in `~/.gemini/settings.json` (or other `settings.json` file) with the following:

```jsonc
{
// ... (additional configuration)
"mcpServers": {
    "datacommons-mcp": {
      "httpUrl": "http://<host>:<port>/mcp"
    }
    // ... (other mcpServers entries)
  }
}
```
#### Sample agent

To configure the sample agent to connect to a remote Data Commons MCP server over HTTP, you need to modify the code in [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py).  Set import modules and agent initialization parameters as follows:

```python
from google.adk.tools.mcp_tool.mcp_toolset import (
   MCPToolset,
   StreamableHTTPConnectionParams
)

root_agent = LlmAgent(
      # ...
      tools=[McpToolset(
         connection_params=StreamableHTTPConnectionParams(
            url=f"http://<host>:<port>/mcp"
         )
      )],
   )
```
Run the agent as described in [Use the sample agent](#use-the-sample-agent) above.


