---
layout: default
title: Run MCP tools
nav_order: 8
parent: Build your own Data Commons
---

{:.no_toc}
# Run MCP tools

The Custom Data Commons services container includes the [Data Commons MCP server](/mcp/index.html) as a component. This page describes how to connect from an AI agent to a local MCP server. This is step 4 of the [recommended workflow](/custom_dc/index.html#workflow).

> **Important**: 
> This feature is available starting from the stable release of 2026-02-10. To use it, you must [sync your code](/custom_dc/build_image.html#sync-code-to-the-stable-branch) to a stable release from that date or later, [rebuild your image](/custom_dc/build_image.html#build-package), and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).

* TOC
{:toc}

## Configure the MCP server

The MCP server runs by default, in HTTP streaming mode, when you start up the services. You don't need an API key for the server or for any agent connecting to it.

There are a few additional environment variables you can configure in your `env.list` file:
-  `ENABLE_MCP`: By default this is set to true. If you want to disable the MCP server from running, set it to false.
-  `DC_SEARCH_SCOPE`: This controls the datasets (base and/or custom) that are searched in response to AI queries. By default it is set to search both base and custom data (`base_and_custom`). If you would like to search only your custom data, set it to `custom_only`.

<script src="/assets/js/customdc-doc-tabs.js"></script>

## Connect an AI agent to a locally running server

You can use any AI agent to connect to the MCP server. The server is accessible at the `/mcp` endpoint. 

Below we provide procedures for Gemini CLI and for a sample Google ADK agent provided in the GitHub Data Commons [`agent-toolkit` repo](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent){: target="_blank"}. You should be able to adapt the configuration to any other MCP-compliant agent, including your own custom-built agent.

### Use Gemini CLI

1. If you don't have it on your system, install [Node.js](https://nodejs.org/en/download){: target="_blank"}.
1. Install [Google Gemini CLI](https://geminicli.com/docs/get-started/installation/){: target="_blank"}.
1. Start the service container if it's not already running.
1. Configure Gemini CLI to connect to the Data Commons MCP server: edit the relevant `settings.json` file (e.g. `~/.gemini/settings.json`) to add the following:
    <pre>
    {
      ...
      "mcpServers": {
          "datacommons-mcp": {         
             "httpUrl": "http://localhost:8080/mcp"
          }
      }
      ...
    }
    </pre>
1. From any directory, start Gemini as described in [Run Gemini CLI](/mcp/run_tools.html#run-gemini). 

### Use the sample agent

1. Install [`uv`](https://docs.astral.sh/uv/getting-started/installation/), a Python package manager.
1. Start the services container if it's not already running.
1. From the desired directory, clone the `agent-toolkit` repo:
```bash
git clone https://github.com/datacommonsorg/agent-toolkit.git
```
  > Tip: You do not need to install the Google ADK; when you use the [command we provide](/mcp/run_tools.html#run-sample) to start the agent, it downloads the ADK dependencies at run time.
1. Modify [`packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py){: target="_blank"} to set the `url` parameter of the `StreamableHTTPConnectionParams` object. 
   <pre>
   ...
   tools=[McpToolset(
         connection_params=StreamableHTTPConnectionParams(
            url="http://localhost:8080/mcp",
            ...
          )
         )
        ]
   ...
   </pre>
1. Customize the agent as desired, as described in [Customize the agent](/mcp/run_tools.html#customize-agent).
1. Start the agent as described in [Run the startup commands](/mcp/run_tools.html#run-sample).
