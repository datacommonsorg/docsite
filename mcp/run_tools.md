---
layout: default
title: Run MCP tools
nav_order: 2
parent: MCP - Query data interactively with an AI agent
---

{:.no_toc}
# Run MCP tools

This page describes how to run a local agent and connect to a Data Commons MCP server to query datacommons.org, using the centrally hosted server at https://api.datacommons/mcp. For advanced use cases, the page also describes how to run your own server and connect to it. 

For procedures to use MCP with a Custom Data Commons instance, please see instead [Run MCP tools with a Custom Data Commons instance](/custom_dc/use_mcp_tools.html).

* TOC
{:toc}

We provide specific instructions for the following agents. All may be used to query datacommons.org or a [Custom Data Commons instance](/custom_dc).

- [Gemini CLI extension](#extension) 
   - Best for querying datacommons.org
   - Provides a built-in "agent" and context file for Data Commons
   - Downloads extension files locally
   - Minimal setup

- [Gemini CLI](#use-gemini-cli) 
   - No additional downloads
   - You can create your own LLM context file 
   - Minimal setup

- A [sample basic agent](develop_agent.md) based on the Google [Agent Development Kit](https://google.github.io/adk-docs/){: target="_blank"}
   - Best for interacting with a Web GUI
   - Can be used to run other LLMs and prompts
   - Downloads agent code locally
   - Some additional setup

For an end-to-end tutorial using a locally running server and agent over HTTP, see the sample Data Commons Colab notebook, [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb){: target="_blank"}.

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
   // ...
   "mcpServers": {
     "datacommons-mcp": {
         "httpUrl": "https://api.datacommons.org/mcp",
         "headers": {
           "X-API-Key": "$DC_API_KEY"
            // If you're using a Google API key to authenticate to Gemini
           "X-API-Key": "$GOOGLE_API_KEY"
         }
      }
   }
   // ...
}
</pre>

{:.no_toc}
### Run

1. From any directory, run `gemini`. 
1. To see the Data Commons tools, use `/mcp tools`.
1. Start sending [natural-language queries](#sample-queries).

> **Tip**: To ensure that Gemini CLI uses the Data Commons MCP tools, and not its own `GoogleSearch` tool, include a prompt to use Data Commons in your query. For example, use a query like "Use Data Commons tools to answer the following: ..."  You can also add such a prompt to a [`GEMINI.md` file](https://codelabs.developers.google.com/gemini-cli-hands-on#9){: target="_blank"} so that it's persisted across sessions.


## Sample queries

The Data Commons MCP tools excel at natural-language queries that involve:
- Comparisons between two or more entities, such as countries or metrics
- Exploring data available for a given topic

Here are some examples of such queries:

- "What health data do you have for Africa?"
- "What data do you have on water quality in Zimbabwe?"
- "Compare the life expectancy, economic inequality, and GDP growth for BRICS nations."
- "Generate a concise report on income vs diabetes in US counties."


## Advanced: Run your own MCP server

This section describes how to run the Data Commons MCP locally, and how to configure a client to connect to it. When you run locally, there are two options:
- The agent spawns the server in a subprocess using Stdio as the transport protocol.
- You start up the server as a standalone process and then connect the agent to it using streaming HTTP as the protocol.

Both options are described below, using Gemini CLI as the sample client/agent. You should be able to adapt the configurations to other MCP-compliant agents/clients.

**Additional prerequisities**

- Install `uv` for managing and installing Python packages; see the instructions at <https://docs.astral.sh/uv/getting-started/installation/>{: target="_blank"}. 

### Spawn a local server from Gemini CLI

To instruct Gemini CLI to start up a local server using Stdio, replace the `datacommons-mcp` in your `settings.json` file as follows:

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
      }
   }
   // ...
}
</pre>

Run Gemini as usual.

### Connect Gemini CLI to a standalone server

#### Start the server as a standalone process

Run:
<pre>
uvx datacommons-mcp serve http [--host <var>HOSTNAME</var>] [--port <var>PORT</var>]
</pre>
By default, the host is `localhost` and the port is `8080` if you don't set these flags explicitly.

The server is addressable with the endpoint `mcp`. For example, `http://my-mcp-server:8080/mcp`.

#### Configure Gemini CLI to connect to the server

To instruct Gemini CLI to connect to an already running server over HTTP, replace the `datacommons-mcp` in your `settings.json` file as follows:
<pre>
{
   "mcpServers": {
      "datacommons-mcp": {
         "httpUrl": "http://<var>HOST</var>:<var>PORT</var>/mcp",
         "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream"
         }
      }
   }
}
</pre>
The host and port are what you have configured in the previous step.

Run Gemini as usual.

<script src="/assets/js/customdc-doc-tabs.js"></script>
