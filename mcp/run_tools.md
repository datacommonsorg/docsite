---
layout: default
title: Use MCP tools
nav_order: 2
parent: MCP - Query data interactively with an AI agent
---

{:.no_toc}
# Use MCP tools

This page describes how to run a local agent and connect to a Data Commons MCP server to query datacommons.org, using the centrally hosted server at `https://api.datacommons.org/mcp`. 

For advanced use cases, such as developing a custom agent, [Run a self-hosted MCP server](host_server.md) describes how to run your own local server and connect to it from an agent. 

For procedures for Custom Data Commons instances, please see instead [Run MCP tools](/custom_dc/run_mcp_tools.html).

* TOC
{:toc}

We provide specific instructions for the following agents.

- [Gemini CLI extension](#extension) 
   - Best for querying datacommons.org
   - Provides a built-in "agent" and context file for Data Commons
   - Downloads extension files locally
   - Minimal setup

- [Gemini CLI](#use-gemini-cli) 
   - No additional downloads
   - You can create your own LLM context file 
   - Minimal setup

- A [sample basic agent](#use-the-sample-agent) based on the Google [Agent Development Kit](https://google.github.io/adk-docs/){: target="_blank"}
   - Best for interacting with a Web GUI
   - Can be used to run other LLMs and prompts
   - Downloads agent code locally
   - Some additional setup

For other clients/agents, see the relevant documentation; you should be able to easily adapt the configurations detailed here.

## Prerequisites

This is required for all agents, regardless of the server deployment:

- A (free) Data Commons API key. To obtain an API key, go to <https://apikeys.datacommons.org>{: target="_blank"} and request a key for the `api.datacommons.org` domain.

Other requirements for specific agents are given in their respective sections.

### Configure environment variable

For basic usage against datacommons.org, set the required `DC_API_KEY` in your shell/startup script (e.g. `.bashrc`).

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Linux or Mac shell</li>
    <li>Windows Powershell</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
       <pre>
   export DC_API_KEY="<var>YOUR API KEY</var>"</pre>
      </div>
    <div>
    <pre>
   $env:DC_API_KEY="<var>YOUR API KEY</var>"</pre> 
   </div>
  </div>
</div>

> **Tip:** If you are using Gemini CLI (not the extension), you can skip this step and specify the key in the Gemini CLI configuration file.

{: #extension}
## Use the Gemini CLI extension

**Additional prerequisites** 

In addition to the Data Commons API key, you must install the following:
- [Git](https://git-scm.com/){: target="_blank"}
- [Google Gemini CLI](https://geminicli.com/docs/get-started/installation/){: target="_blank"} 

When you install the extension, it clones the [Data Commons extension Github repo](https://github.com/gemini-cli-extensions/datacommons){: target="_blank"} to your local system.

{:.no_toc}
### Install
 
Open a new terminal and install the extension directly from GitHub:
```sh
gemini extensions install https://github.com/gemini-cli-extensions/datacommons [--auto-update]
```
The installation creates a local `.gemini/extensions/datacommons` directory with the required files.

> Note: If you have previously configured Gemini CLI to use Data Commons MCP tools and want to use the extension instead, be sure to delete the `datacommons-mcp` section from the relevant `settings.json` file (e.g. `~/.gemini/settings.json`).

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

Make sure you have installed [Git](https://git-scm.com/){: target="_blank"} on your system.

{:.no_toc}
### Uninstall

To uninstall the extension, run:
```
gemini extensions uninstall datacommons
```
## Use Gemini CLI

In addition to the Data Commons API key, you must install the following:
- [Google Gemini CLI](https://geminicli.com/docs/get-started/installation/){: target="_blank"}

{:.no_toc}
### Configure

To configure Gemini CLI to connect to the Data Commons server, edit the relevant `settings.json` file (e.g. `~/.gemini/settings.json`) to add the following:
<pre>
{
   ...
   "mcpServers": {
     "datacommons-mcp": {
         "httpUrl": "https://api.datacommons.org/mcp",
         "headers": {
           // If you have set the key in your environment
           "X-API-Key": "$DC_API_KEY"
            // If you have not set the key in your environment
           "X-API-Key": "<var>YOUR DC API KEY</var>"
         }
      }
   }
   ...
}
</pre>

{:.no_toc}
{: #run-gemini}
### Run

1. From any directory, run `gemini`. 
1. To see the Data Commons tools, use `/mcp tools`.
1. Start sending [natural-language queries](#sample-queries).

> **Tip**: To ensure that Gemini CLI uses the Data Commons MCP tools, and not its own `GoogleSearch` tool, include a prompt to use Data Commons in your query. For example, use a query like "Use Data Commons tools to answer the following: ..."  You can also add such a prompt to a [`GEMINI.md` file](https://codelabs.developers.google.com/gemini-cli-hands-on#9){: target="_blank"} so that it's persisted across sessions.

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
#### Customize agent behavior

The agent's behavior is determined by prompts provided in the `AGENT_INSTRUCTIONS` in [packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py){: target="_blank"}.

You can add your own prompts to modify how the agent handles tool results. See the Google ADK page on [LLM agent instructions](https://google.github.io/adk-docs/agents/llm-agents/#guiding-the-agent-instructions-instruction){: target="_blank"} for tips on how to write good prompts.

## Sample queries

The Data Commons MCP tools excel at natural-language queries that involve:
- Comparisons between two or more entities, such as countries or metrics
- Exploring data available for a given topic

Here are some examples of such queries:

- "What health data do you have for Africa?"
- "What data do you have on water quality in Zimbabwe?"
- "Compare the life expectancy, economic inequality, and GDP growth for BRICS nations."
- "Generate a concise report on income vs diabetes in US counties."
