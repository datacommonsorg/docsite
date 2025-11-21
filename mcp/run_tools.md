---
layout: default
title: Run MCP tools
nav_order: 2
parent: MCP - Query data interactively with an AI agent
---

{:.no_toc}
# Run MCP tools

This page shows you how to run a local agent and connect to a Data Commons MCP server running locally or remotely.

* TOC
{:toc}

We provide specific instructions for the following agents. All may be used to query datacommons.org or a Custom Data Commons instance.

- [Gemini CLI extension](https://geminicli.com/extensions/) 
   - Best for querying datacommons.org
   - Provides a built-in "agent" and context file for Data Commons
   - Downloads extension files locally
   - Uses `uv` to run the MCP server locally
   - Minimal setup

   See [Use the Gemini CLI extension](#use-the-gemini-cli-extension) for this option.

- [Gemini CLI](https://geminicli.com/) 
   - No additional downloads
   - MCP server can be run locally or remotely
   - You can create your own context file 
   - Minimal setup

   See [Use Gemini CLI](#use-gemini-cli) for this option.

- A sample basic agent based on the Google [Agent Development Kit](https://google.github.io/adk-docs/) 
   - Best for interacting with a Web GUI
   - Can be customized to run other LLMs and prompts
   - Downloads agent code locally
   - Server may be run remotely
   - Some additional setup

   See [Use the sample agent](#use-the-sample-agent) for this option.

For an end-to-end tutorial using a server and agent over HTTP, see the sample Data Commons Colab notebook, [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb).

For other clients/agents, see the relevant documentation; you should be able to reuse the commands and arguments detailed below.

## Prerequisites

These are required for all agents:

- A (free) Data Commons API key. To obtain an API key, go to <https://apikeys.datacommons.org> and request a key for the `api.datacommons.org` domain.
- Install `uv` for managing and installing Python packages; see the instructions at <https://docs.astral.sh/uv/getting-started/installation/>. 

Other requirements for specific agents are given in their respective sections.

> **Important**: Additionally, for Custom Data Commons instances:
> If you have not rebuilt your Data Commons image since the stable release of 2025-09-08, you must [sync to the latest stable release](/custom_dc/build_image.html#sync-code-to-the-stable-branch), [rebuild your image](/custom_dc/build_image.html#build-package) and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).

## Configure environment variables

### Base Data Commons (datacommons.org)

For basic usage against datacommons.org, set the required `DC_API_KEY` in your shell/startup script (e.g. `.bashrc`).
<pre>
export DC_API_KEY="<var>YOUR API KEY</var>"
</pre>

### Custom Data Commons

To run against a Custom Data Commons instance, you must set additional variables. All supported options are documented in [packages/datacommons-mcp/.env.sample](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/.env.sample). 

The following variables are required:
- <code>export DC_API_KEY="<var>YOUR API KEY</var>"</code>
- `export DC_TYPE="custom"`
- <code>export CUSTOM_DC_URL="<var>YOUR_INSTANCE_URL</var>"</code>

If you're using the Gemini CLI extension, just set these in your shell/startup script. 

If you're not using the extension, you may wish to use a `.env` file, which the server locates automatically, to keep all the settings in one place. To set all variables using a `.env` file:

1. From Github, download the file [`.env.sample`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/.env.sample) to the desired directory. Alternatively, if you plan to run the sample agent, clone the repo <https://github.com/datacommonsorg/agent-toolkit/>.

1. From the directory where you saved the sample file, copy it to a new file called `.env`. For example:
   ```bash
   cd ~/agent-toolkit/packages/datacommons-mcp
   cp .env.sample .env
   ```
1. Set the following variables, without quotes: 
   - `DC_API_KEY`: Set to your Data Commons API key
   - `DC_TYPE`: Set to `custom`.
   - `CUSTOM_DC_URL`: Uncomment and set to the URL of your instance. 
1. Optionally, set other variables.
1. Save the file.

## Use the Gemini CLI extension

**Additional prerequisites** 
In addition to the [standard prerequisites](#prerequisites), you must have the following installed:
- [Git](https://git-scm.com/)
- [Google Gemini CLI](https://geminicli.com/docs/get-started/)

When you install the extension, it clones the [Data Commons extension Github repo](https://github.com/gemini-cli-extensions/datacommons) to your local system.

{:.no_toc}
### Install
 
Open a new terminal and install the extension directly from GitHub:
```sh
gemini extensions install https://github.com/gemini-cli-extensions/datacommons [--auto-update]
```
The installation creates a local `.gemini/extensions/datacommons` directory with the required files.

> Note: If you have previously configured Gemini CLI to use the Data Commons MCP Server and want to use the extension instead, be sure to delete the `datacommons-mcp` section from the relevant `settings.json` file (e.g. `~/.gemini/settings.json`).

{:.no_toc}
### Run

1. Run `gemini` from any directory. 
1. To verify that the Data commons tools are running, enter `/mcp list`. You should see `datacommons-mcp` listed as `Ready`. If you don't, see the [Troubleshoot](#troubleshoot) section.
1. To verify that the extension is running, enter `/extensions list`. You should see `datacommons` listed as `active`. 
1. Start sending [natural-language queries](#sample-queries).

{:.no_toc}
### Update

After starting up Gemini CLI, you may see the message `You have one extension with an update available`.

In this case, run `/extensions list`. If `datacommons` is displayed with `update available`, enter the following in the Gemini input field:
```
/extensions update datacommons
```

{:.no_toc}
### Troubleshoot

You can diagnose common errors, such as invalid API keys, by using the debug flag:
```
gemini -d
```
You can also use the `Ctrl-o` option from inside the Gemini input field.

Here are solutions to some commonly experienced problems.

{:.no_toc}
#### Install/update/uninstall hangs and does not complete

1. Check that you are not running the `gemini extensions` command from inside the Gemini input field. Start a new terminal and run it from the command line.
1. Check that you've spelled commands correctly, e.g. `extensions` and not `extension`.

{:.no_toc}
#### datacommons-mcp is disconnected

This is usually due to a missing [Data Commons API key](#prerequisites). Be sure to obtain a key and export it on the command line or in a startup script (e.g. `.bashrc`). If you've exported it in a startup script, be sure to start a new terminal.

{:.no_toc}
#### Failed to clone Git repository

Make sure you have installed [Git](https://git-scm.com/) on your system.

{:.no_toc}
### Uninstall

To uninstall the extension, run:
```
gemini extensions uninstall datacommons
```

## Use Gemini CLI

Before installing, be sure to check the [Prerequisites](#prerequisites) above.

{:.no_toc}
### Install

To install Gemini CLI, see the instructions at <https://github.com/google-gemini/gemini-cli#quick-install>. 

{:.no_toc}
### Configure to run a local server

To configure Gemini CLI to recognize the Data Commons server, edit the relevant `settings.json` file (e.g. `~/.gemini/settings.json`) to add the following:

<pre>
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
                "DC_API_KEY": "<var>YOUR_DATA_COMMONS_API_KEY</var>"
                // If you are using a Google API key
                "GEMINI_API_KEY": "<var>YOUR_GOOGLE_API_KEY</var>"
            },
            "trust": true
        }
    }
   // ...
}
</pre>

{:.no_toc}
### Configure to connect to a remote server

1. Start up the MCP server in standalone mode, as described in [Run a standalone server](#run-a-standalone-server).
1. In the `settings.json` file, replace the `datacommons-mcp` specification as follows:
   <pre>
   {
    "mcpServers": {
        "datacommons-mcp": {
            "httpUrl": "http://<var>HOST</var>:<var>PORT</var>/mcp"
            // other settings as above
         }
      }
   }
   </pre>

{:.no_toc}
### Send queries

1. From any directory, run `gemini`. 
1. To see the Data Commons tools, use `/mcp tools`.
1. Start sending [natural-language queries](#sample-queries).

> **Tip**: To ensure that Gemini CLI uses the Data Commons MCP tools, and not its own `GoogleSearch` tool, include a prompt to use Data Commons in your query. For example, use a query like "Use Data Commons tools to answer the following: ..."  You can also add such a prompt to a [`GEMINI.md` file](https://codelabs.developers.google.com/gemini-cli-hands-on#9) so that it's persisted across sessions.

## Use the sample agent

We provide a basic agent for interacting with the MCP Server in [packages/datacommons-mcp/examples/sample_agents/basic_agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent). 

**Additional prerequisites** 
In addition to the [standard prerequisites](#prerequisites), you will need:
- A GCP project and a Google AI API key. For details on supported keys, see <https://google.github.io/adk-docs/get-started/quickstart/#set-up-the-model>.
- [Git](https://git-scm.com/) installed.

{:.no_toc}
### Set the API key environment variable

Set `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in your shell/startup script (e.g. `.bashrc`):
<pre>
export GEMINI_API_KEY=<var>YOUR API KEY</var>
</pre>

{:.no_toc}
### Install

From the desired directory, clone the `agent-toolkit` repo:
```bash
git clone https://github.com/datacommonsorg/agent-toolkit.git
```

{:.no_toc}
### Run

By default, the agent will spawn a local server and connect to it over Stdio. If you want to connect to a remote server, modify the code as described in [Connect to a remote server](#remote) before using this procedure.

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

{: #remote}
{:.no_toc}
### Configure to connect to a remote server

If you want to connect to a remote MCP server, follow this procedure before starting the agent:

1. Start up the MCP server in standalone mode, as described in [Run a standalone server](#run-a-standalone-server).
1. Modify the code in [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py) to set import modules and agent initialization parameters as follows:

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

## Sample queries

The Data Commons MCP tools excel at natural-language queries that involve:
- Comparisons between two or more entities, such as countries or metrics
- Exploring data available for a given topic

Here are some examples of such queries:

- "What health data do you have for Africa?"
- "What data do you have on water quality in Zimbabwe?"
- "Compare the life expectancy, economic inequality, and GDP growth for BRICS nations."
- "Generate a concise report on income vs diabetes in US counties."

## Run a standalone server

1. Ensure you've set up the relevant server [environment variables](#configure-environment-variables). If you're using a `.env` file, go to the directory where the file is stored.
1. Run:
   <pre>
   uvx datacommons-mcp serve http [--host <var>HOSTNAME</var>] [--port <var>PORT</var>]
   </pre>
By default, the host is `localhost` and the port is `8080` if you don't set these flags explicitly.

The server is addressable with the endpoint `mcp`. For example, `http://my-mcp-server:8080/mcp`.

You can connect to the server using [Gemini CLI](#use-gemini-cli) or the [sample ADK agent](#use-the-sample-agent).  If you're using a different client from the ones documented on this page, consult its documentation to determine how to specify an HTTP URL.
