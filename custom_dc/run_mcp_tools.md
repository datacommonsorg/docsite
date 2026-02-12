---
layout: default
title: Run MCP tools
nav_order: 9
parent: Build your own Data Commons
---

{:.no_toc}
# Run MCP tools

The Custom Data Commons services container includes the [Data Commons MCP server](/mcp/index.html) as a component. This page describes how to connect from an AI agent to the server running locally or in Google Cloud Run. For the most part, the procedures are identical to those provided in the [MCP](/mcp/index.html) pages, with a few minor differences. 

> **Important**: 
> If you have not rebuilt your Data Commons image since the stable release of 2026-02-10, you must [sync to the latest stable release](/custom_dc/build_image.html#sync-code-to-the-stable-branch), [rebuild your image](/custom_dc/build_image.html#build-package) and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).

* TOC
{:toc}

## Configure the MCP server

The MCP server runs by default, in HTTP streaming mode, when you start up the services. There are a few additional environment variables you may wish to configure:
-  `ENABLE_MCP`: By default this is set to true. If you want to disable the MCP server from running, set it to false.
-  `DC_SEARCH_SCOPE`: This controls the datasets (base and/or custom) that are searched in response to AI queries. By default it is set to search both base and custom data (`base_and_custom`). If you would like to search only your custom data, set it to `custom_only`.

To set the options for a locally running service, set the variables in your `env.list` file.

To set the options for a Cloud Run service, edit the [Terraform variables file](deploy_cloud.md#optional) to add them and rerun `terraform apply`, or do either of the following:

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
  <div class="active">
           <ol>
           <li>Go to the <a href="https://console.cloud.google.com/run/services" target="_blank">https://console.cloud.google.com/run/services</a> page for your project.</li>
             <li>From the list of services, click the link of the web service created by the Terraform scripts.</li>
             <li>Click <b>Edit & Deploy Revision</b>.</li>
           <li>Select the <b>Variables & secrets</b> tab.</li>
           <li>Click <b>Add new variable</b>.</li>
           <li>Add the name and value for the variable you want to add.</li>
           <li>Click <b>Deploy</b>. It will take several minutes for the service to start. You can click the <b>Logs</b> tab to view the progress.</li>
        </ol>
      </div>
    <div><p>From any local directory, run the following command:
      <pre>gcloud run deploy <var>SERVICE_NAME</var> --set-env-vars=<var>KEY</var>=<var>VALUE</var></pre></p>
      <p> To view the startup status, run the following command:
            <pre>gcloud beta run jobs logs tail <var>SERVICE_NAME</var></pre>
    </p>
     </div>
   </div>
  </div>

  <script src="/assets/js/customdc-doc-tabs.js"></script>

## Connect an AI agent to the running server

You can use any AI agent to connect to the MCP server. The server is accessible at the `/mcp` endpoint. 

Below we provide procedures for Gemini CLI and for a sample Google ADK agent provided in the Github Data Commons [`agent-toolkit` repo](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent){: target="_blank"}. You should be able to adapt the configuration to any other MCP-compliant agent.

### Use Gemini CLI

1. If you don't have it on your system, install [Node.js](https://nodejs.org/en/download){: target="_blank"}.
1. Install [Google Gemini CLI](https://geminicli.com/docs/get-started/installation/){: target="_blank"}.
1. To configure Gemini CLI to connect to the Data Commons MCP server, edit the relevant `settings.json` file (e.g. `~/.gemini/settings.json`) to add the following:
  <pre>{
    # ...
    "mcpServers": {
      "datacommons-mcp": {
        # For a locally running server          
        "httpUrl": "http://localhost:8080/mcp",
        # For a server in Google Cloud Run
        "httpUrl": "https://<var>YOUR_CUSTOM_DC_URL</var>/mcp",
        "headers": {
           # For a locally running server
           "X-API-Key": "$DC_API_KEY"
           # For a server in Google Cloud Run
           "X-API-Key": "<var>YOUR DC API KEY</var>"
        },
        "trust": true
      }
     }
   # ...
  }</pre>
1. Start the service container if it's not already running.
1. From any directory, start Gemini as described in [Run Gemini CLI](run_tools.md#run-gemini) from any directory. 

### Use the sample agent

1. Install [`uv`](https://docs.astral.sh/uv/getting-started/installation/), a Python package manager.
1. From the desired directory, clone the `agent-toolkit` repo:
  ```bash
  git clone https://github.com/datacommonsorg/agent-toolkit.git
  ```
  > Tip: You do not need to install the Google ADK; when you use the [command we provide](#run-sample) to start the agent, it downloads the ADK dependencies at run time.
1. If your server is running in Google Cloud, set the `DC_API_KEY` variable in your environment:
   <pre>
   export DC_API_KEY="<var>YOUR_API_KEY</var>"
   </pre>
1. Go to the directory where you've installed the repo. For example, from the root:
   ```bash
   cd agent-toolkit
   ```
1. Modify [`basic_agent/agent.py`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py){: target="_blank"} to set the `url` parameter of the `StreamableHTTPConnectionParams` object. 
   For a locally running server:
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
   For a server in Google Cloud Run:
   <pre>
   ...
   tools=[McpToolset(
         connection_params=StreamableHTTPConnectionParams(
            url="https://<var>YOUR_CUSTOM_DC_URL</var>/mcp",
            ...
          )
         )
        ]
   ...
   </pre>
1. Customize the agent as desired, as described in [Customize the agent](run_tools.md#customize-the-agent).
1. Start the services container if it's not already running.
1. Start the agent as described in [Run the startup commands](run_tools.md#run-sample).