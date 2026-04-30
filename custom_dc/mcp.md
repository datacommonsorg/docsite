---
layout: default
title: Configure the MCP server
nav_order: 6
parent: Build your own Data Commons
redirect_from: /run_mcp_tools
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
- `DC_INSTRUCTIONS_DIR`: This allows you to provide customized instructions for the server tools and agents making tool calls. For details, see [below](#instructions).

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

To set the options on a server in Cloud Run, see [Start/restart the services container](deploy_cloud.md#start-service). 

{: #instructions}
## Provide custom instructions for the server

The MCP server tools are prompted by instructions Markdown files located at [agent-toolkit/packages/datacommons-mcp/datacommons_mcp/instructions/tools/](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/datacommons_mcp/instructions/tools){: target="_blank"}. These instructions are also used by agents when they make tool calls to the server.

You can customize the instructions by providing your own versions of the Markdown files for the tools whose instructions you want to replace. For example, the `search_indicators` tool instruction has this prompt:
```
Action: If a user asks a general question about available data, proactively call the tool for "World" to provide an initial overview.
```
If your dataset doesn't involve global data, you could rewrite it to instruct the tool to use a specific location instead of "World". 

{: #structure}
### Required directory structure

The server expects a specific directory structure and naming, as follows:

<pre>
<var>INSTRUCTIONS_DIRECTORY</var>/
├── server.md
└── tools/
    └──<var>TOOL_NAME</var>.md
</pre>

You can provide a Markdown file for each tool you want to customize. Any file you provide will completely replace the default version of the file. For any tool file you don't provide, the server will just use the default instructions.

> Tip: Most AI agents ignore `server.md` so there is little benefit to overriding this file specifically.

### Run the server locally

1. Create a new directory anywhere in your file system, as described above. For example:
  ```
  cd projectdir
  mkdir instructions
  ```
1. Go to <https://github.com/datacommonsorg/agent-toolkit>{: target="_blank"} and from [/packages/datacommons-mcp/datacommons_mcp/instructions/tools/](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/datacommons_mcp/instructions/tools){: target="_blank"}, copy the tool file(s) you want to customize. 
 > Tip: You can download the full directory structure easily by going to <https://download-directory.github.io/>{: target="_blank"}
and entering the folder URL, `https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/datacommons_mcp/instructions`. This will download a .zip file containing all the files. Extract them imto your instructions directory. 
1. Edit the file(s) as necessary.
1. In your `env.list` file, set the `DC_INSTRUCTIONS_DIR` variable to your top-level instructions directory, using an absolute path. For example for a directory called `instructions` in your home directory, it could look like this:
```
DC_INSTRUCTIONS_DIR=/usr/local/home/username/instructions
```
1. When you restart the Docker service container, you need to mount the new directory as a Docker volume. If you use the Bash convenience script this is done for you automatically.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
      <p>
       <pre>./run_cdc_dev_docker.sh --container service</pre>
       </p>
      </div>
    <div>
    <p>
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
    </p>
   </div>
  </div>
</div>

To verify that the custom files are loaded, in the MCP server output, you should see something like the following:

```
INFO:datacommons_mcp.app:Loaded custom instructions for server.md from /usr/local/google/home/username/website/instructions
INFO:datacommons_mcp.app:Loaded custom instructions for tools/get_observations.md from /usr/local/google/home/username/website/instructions
INFO:datacommons_mcp.app:Loaded custom instructions for tools/search_indicators.md from /usr/local/google/home/username/website/instructions
```

To specify custom instructions on a Cloud Run server, see [Provide custom MCP instructions files](deploy_cloud.md#instructions). 
To specify custom instructions hosted in Cloud Storage but loaded by a local server, see [Running the service container locally, and custom MCP instructions in Google Cloud](advanced.md#instructions)

{: #agent}
## Connect an AI agent to a local server

You can use any AI agent to connect to the MCP server. The server is accessible at the `/mcp` endpoint. 

Below we provide procedures for Gemini CLI and for a sample Google ADK agent provided in the GitHub Data Commons [`agent-toolkit` repo](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent){: target="_blank"}. You should be able to adapt the configuration to any other MCP-compliant agent, including your own custom-built agent.

To connect to a server running in Google Cloud, see [Connect an AI agent to the MCP server](deploy_cloud.md#mcp).

### Use Gemini CLI

1. If you don't have it on your system, install [Node.js](https://nodejs.org/en/download){: target="_blank"}.
1. Install [Google Gemini CLI](https://geminicli.com/docs/get-started/installation/){: target="_blank"}.
1. Start the service container if it's not already running.
1. Configure Gemini CLI to connect to the Data Commons MCP server: edit the relevant `settings.json` file (e.g. `~/.gemini/settings.json`) to add the following:
    <pre>
    {
      ...
      "mcpServers": {
          "<var>SERVER_NAME</var>": {         
             "httpUrl": "http://localhost:8080/mcp"
          }
      }
      ...
    }
    </pre>
    The server name can be anything you want; for example, `datacommons-mcp-local`.
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

<script src="/assets/js/customdc-doc-tabs.js"></script>