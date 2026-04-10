---
layout: default
title: Configure the MCP server
nav_order: 6
parent: Build your own Data Commons
---

{:.no_toc}
# Configure the MCP server

The Custom Data Commons services container includes the [Data Commons MCP server](/mcp/index.html) as a component. This page describes how to connect from an AI agent to a local MCP server. This is step 3 of the [recommended workflow](/custom_dc/index.html#workflow).

> **Important**: 
> This feature is available starting from the stable release of 2026-02-10. To use it, you must [sync your code](/custom_dc/image.html#sync-code-to-the-stable-branch) to a stable release from that date or later, [rebuild your image](/custom_dc/image.html#build-package), and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).

* TOC
{:toc}

## Set options

The MCP server runs by default, in HTTP streaming mode, when you start up the services. You don't need an API key for the server or for any agent connecting to it.

There are a few additional environment variables you can configure, all of which are optional:
-  `ENABLE_MCP`: By default this is set to true. If you want to disable the MCP server from running, set it to false.
-  `DC_SEARCH_SCOPE`: This controls the datasets (base and/or custom) that are searched in response to AI queries. By default it is set to search both base and custom data (`base_and_custom`). If you would like to search only your custom data, set it to `custom_only`.
- `DC_INSTRUCTIONS_DIR`: This allows you to provide overrides or additional instructions for the server tools and agents making tool calls. For details, see below.

To set the options on a locally running server, specify them in your `env.list` file, and restart the services, for example:

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
       <pre>./run_cdc_dev_docker.sh --container service</pre>
      </div>
    <div>
    <pre>
    docker run -it \
    -p 8080:8080 \
    -e DEBUG=true \
    --env-file $PWD/custom_dc/env.list \
    -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
    -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
    gcr.io/datcom-ci/datacommons-services:stable
    </pre>   
   </div>
  </div>
</div>

To set the options on a server in Cloud Run, see xxx 

<script src="/assets/js/customdc-doc-tabs.js"></script>

{: #instructions}
### Provide custom instructions for the server

You can customize the instructions that the server tools send to agents, by providing additional prompts in Markdown files. You can see the default instructions in [agent-toolkit/packages/datacommons-mcp/datacommons_mcp/instructions/tools/](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/datacommons_mcp/instructions/tools){: target="_blank"}. You should not try to completely override these prompts; just provide additional hints for any or all of the tools. 

To run locally:
1. Create a new directory anywhere in your file system, with the following structure and naming:
  <ul><li><var><code>INSTRUCTIONS_DIRECTORY</code></var>
  <ul>
      <li><code>server.md</code> (optional) </li>
        <li><code>tools</code></></li>
        <ul>
          <li><code><var>TOOL_NAME</var>.md</code></li>
        </ul>
      </ul>
  </ul>
1. Add Markdown files for any or all of the tools for which you would like to customize the instructions. Each Markdown file must be in the format listed above.
1. In your `env.list` file, set the `DC_INSTRUCTIONS_DIR` variable to your top-level instructions directory.
1. When you restart the Docker service container, you will need to mount the new directory as a Docker volume. If you use the Bash convenience script this is done for you automatically.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
       <pre>./run_cdc_dev_docker.sh --container service</pre>
      </div>
    <div>
    <pre>
    docker run -it \
    -p 8080:8080 \
    -e DEBUG=true \
    --env-file $PWD/custom_dc/env.list \
    -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
    -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
    -v <var>INSTRUCTIONS_DIRECTORY</var>:<var>INSTRUCTIONS_DIRECTORY</var> \
    gcr.io/datcom-ci/datacommons-services:stable
    </pre>   
   </div>
  </div>
</div>

To specify custom instructions on a Cloud Run server, see xx

## Connect an AI agent to a local server

You can use any AI agent to connect to the MCP server. The server is accessible at the `/mcp` endpoint. 

Below we provide procedures for Gemini CLI and for a sample Google ADK agent provided in the GitHub Data Commons [`agent-toolkit` repo](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent){: target="_blank"}. You should be able to adapt the configuration to any other MCP-compliant agent, including your own custom-built agent.

To connect to a server in Google Cloud Run, see ...

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
