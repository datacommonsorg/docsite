---
layout: default
title: Run MCP tools against a custom instance
nav_order: 9
parent: Build your own Data Commons
---

{:.no_toc}
# Run MCP tools against a custom instance

To use Data Commons MCP tools with a Custom Data Commons instance, you must run your own instance of the Data Commons MCP server. This page describes how to run a server locally and in Google Cloud, and how to connect to each type of deployment from an MCP client.

* TOC
{:toc}

## Run a local MCP server

You can use any AI agent to spawn a local MCP server, or start a standalone server and connect to it from any client. 



## Configure environment variables

To run against a Custom Data Commons instance, you must set the following required variables:
- <code>DC_API_KEY="<var>YOUR API KEY</var>"</code>
- `DC_TYPE="custom"`
- <code>CUSTOM_DC_URL="<var>YOUR_INSTANCE_URL</var>"</code>

Various other optional variables are also available; all are documented in [packages/datacommons-mcp/.env.sample](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/.env.sample){: target="_blank"}. 

You can set variables in the following ways:
1. In your shell/startup script (e.g. `.bashrc`).
1. [Use an `.env` file](#env), which the server locates automatically. This is useful for Custom Data Commons with multiple options, to keep all settings in one place.
1. If you are using Gemini CLI (not the extension), you can use the `env` option in the [`settings.json` file](#gemini).

You can also set additional variables as described in the `.env.sample` file.

{: #env}
{: .no_toc}
#### Set variables with an `.env` file:

1. From Github, download the file [`.env.sample`](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/.env.sample){: target="_blank"} to the desired directory. Alternatively, if you plan to run the sample agent, clone the repo <https://github.com/datacommonsorg/agent-toolkit/>{: target="_blank"}.

1. From the directory where you saved the sample file, copy it to a new file called `.env`. For example:
   ```bash
   cd ~/agent-toolkit/packages/datacommons-mcp
   cp .env.sample .env
   ```
1. Set the following required variables, without quotes: 
   - `DC_API_KEY`: Set to your Data Commons API key
   - `DC_TYPE`: Set to `custom`.
   - `CUSTOM_DC_URL`: Uncomment and set to the URL of your instance. 
1. Optionally, set other variables.
1. Save the file.



> **Important**: Additionally, for Custom Data Commons instances:
> If you have not rebuilt your Data Commons image since the stable release of 2025-09-08, you must [sync to the latest stable release](/custom_dc/build_image.html#sync-code-to-the-stable-branch), [rebuild your image](/custom_dc/build_image.html#build-package) and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).

## Run the MCP Server in Google Cloud Platform

If you have built a custom agent or Gemini CLI extension which you want to make publicly available, this page describes how to run the [Data Commons MCP server](https://pypi.org/project/datacommons-mcp/) in the cloud, using Google Cloud Run. 

Since setting up an MCP server is a simple, one-time setup, there's no need to use Terraform to manage it. Data Commons provides a prebuilt Docker image in the Artifact Registry, so you only need to set up a new Cloud Run service to point to it. 

### Prebuilt images

There are several versions of the image available, viewable at <https://console.cloud.google.com/artifacts/docker/datcom-ci/us/gcr.io/datacommons-mcp-server>. We recommend that you choose a production version with a specific version number, to ensure that changes introduced by the Data Commons team don't break your application.

## Before you start: decide on a hosting model

There are several ways you can host the MCP server in Cloud Run, namely:

- As a standalone service. In this case, any client simply connects to it over HTTP, including your own MCP agent running as a separate Cloud Run service or locally. You can choose whether to make the internal Cloud Run app URL publicly available, or whether to put a load balancer in front of the service and map a domain name. 
- As a ["sidecar"](https://docs.cloud.google.com/run/docs/deploying#sidecars){: target="_blank"} to an MCP client. If you are hosting your own MCP client in Cloud Run as well, this may be a useful option. In this case, the MCP server is not directly addressable; all external connections are managed by the client.

In this page, we provide steps for running the Data Commons MCP server as a standalone container. If you want to go with the sidecar option, please see [Deploying multiple containers to a service (sidecars)](https://docs.cloud.google.com/run/docs/deploying#sidecars){: target="_blank"} for additional requirements and setup procedures.

## Prerequisites

The following procedures assume that you have set up the following Google Cloud Platform services, using the [Terraform scripts](deploy_cloud.md#terraform):
- A service account and roles. 
- A Google Cloud Secret Manager secret for storing your Data Commons API key. 

## Create a Cloud Run Service for the MCP server

The following procedure sets up a bare-bones container service. To set additional options, such as request timeouts, instance replication, etc., please see [Configure Cloud Run services](https://docs.cloud.google.com/run/docs/configuring){: target="_blank"} for details.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
  <div class="active">
    <ol>
      <li>Go to the <a href="https://console.cloud.google.com/run/services" target="_blank">https://console.cloud.google.com/run/services</a> page for your project.</li>
      <li>Click <b>Deploy container</b>.</li>
      <li>In the <b>Container image URL</b> field, click <b>Select</b>.</li>
      <li>In the Artifact Registry panel that appears in the right side of the window, that appears, click <b>Change</b>.</li>
      <li>In the project search bar, enter <code>datcom-ci</code> and click on the link that appears.</li>
      <li>Expand <b>gcr.io/datcom-ci</b> and expand <b>datacommons-mcp-server</b>.</li>
      <li>From the list of images, select a production image, e.g. <code>production-v1.1.4</code>.</li>
      <li>Under <b>Configure</b>, select the desired region for the service, e.g. <code>us-central1</code>.</li> 
      <li>Expand <b>Containers, Networking, Security</b>.</li>
      <li>Click the <b>Variables & secrets</b> tab.</li>
      <li>Under <b>Environment variables</b>, click <b>Add variable</b> and set the following variables:
        <ul>
          <li>name: <code>DC_TYPE</code>, value: <code>custom</code></li>
          <li>name: <code>CUSTOM_DC_URL</code>, value: <code><var>YOUR_INSTANCE_URL</var></code></li>
        </ul></li>
      <li>Under <b>Secrets exposed as environment variables</b>, click <b>Reference a secret</b>.</li>
      <li>In the <b>Name</b> field, enter <code>DC_API_KEY</code>, and from the <b>Secret</b> field, select  the secret previously created by the Terraform scripts. It is in the form <code><var>NAMESPACE</var>-datacommons-dc-api-key-<var>FINGERPRINT</var></code>.</li> 
      <li>In the <b>Version</b> field, select the desired version, e.g. <b>latest</b>.</li>
      <li>Click <b>Done</b>.</li>
      <li>Click the <b>Security</b> tab. From the <b>Service account</b> field, select the service account for your namespace and project, previously created by the Terraform scripts.</li>
      <li>Click <b>Create</b>. If correctly configured, the service will deploy automatically. It may take several minutes to start up.</li></ol>
    </div>
    <div>
      <ol>
        <li>If you haven't recently refreshed your Google Cloud credentials, run <code>gcloud auth application-default login</code> and authenticate.</li>
        <li>From any local directory, run the following command:
        <pre>gcloud run deploy datacommons-mcp-server --image <var>CONTAINER_IMAGE_URL</var> \
        --service-account <var>SERVICE_ACCOUNT</var> --region <var>REGION</var> \
        --allow-unauthenticated \
        --set-secrets="DC_API_KEY=<var>SECRET_NAME</var>:latest" \
        --set-env-vars="DC_TYPE=custom" --set-env-vars="CUSTOM_DC_URL=<var>INSTANCE_URL</var>"</pre></li>
        </ol>
        <ul>
          <li>The container image URL is <code>gcr.io/datcom-ci/datacommons-mcp-server:<var>TAG</var></code>. The tag should be a production image with a version number, e.g. <code>production-v1.1.4</code>.</li>
          <li>The service account was created when you ran Terraform. It is in the form <code><var>NAMESPACE</var>-datacommons-sa@<var>PROJECT_ID</var>.iam.gserviceaccount.com</code>.</li>
          <li>The region is the Cloud region where you want to run the service, e.g. <code>us-central1</code>.</li>
          <li>The secret name is the one created when you ran the Terraform scripts, in the form <code><var>NAMESPACE</var>-datacommons-dc-api-key-<var>FINGERPRINT</var></code>. If you're not sure about the name or fingerprint, go to <a href="https://console.cloud.google.com/security/secret-manager" target="_blank">https://console.cloud.google.com/security/secret-manager</a> for your project and look it up.</li>
        </ul>
    To view the startup status, run the following command:
    <pre>gcloud run services logs tail datacommons-mcp-server --region <var>REGION</var></pre>
    </div>
  </div>
</div>

<script src="/assets/js/customdc-doc-tabs.js"></script>

## Connect to the server from a remote client

For details, see the following pages:
- [Connect to the server from a local Gemini CLI client](/mcp/run_tools.html#gemini-cli-remote)
- [Connect to the server from a local agent](/mcp/run_tools.html#remote)

The HTTP URL parameter is the Cloud Run App URL, if you are exposing the service directly, or a custom domain URL if you are using a load balancer and domain mapping.

## Troubleshoot deployment issues

### Container fails to start

If you see this error message:

```
The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout...
```
This is a generic message that could indicate a number of configuration problems. Check all of these:
- Be sure you have specified the `DC_API_KEY` environment variable.
- Be sure you have specified the correct service account.
- Try increasing the health check timeout.



# Develop your own agent

This page shows you how to develop a custom Data Commons agent, using two approaches:

- Write a [custom Gemini CLI extension]()
   - Simple to set up, no code required
   - Minimal customization possible, mostly LLM prompts
   - Requires Gemini CLI as the client

- Write a [custom Google ADK agent](#customize-the-sample-agent)
    - Some code required
    - Any customization possible
    - Provides a UI client as part of the framework 

## Create a custom Gemini CLI extension

Before you start, be sure you have installed the [required prerequisites](/mcp/run_tools.html#extension).

### Create the extension

To create your own Data Commons Gemini CLI extension:

1. From the directory in which you want to create the extension, run the following command:
   <pre>
   gemini extensions new <var>EXTENSION_NAME</var>
   </pre>
   The extension name can be whatever you want; however, it must not collide with an existing extension name, so do not use `datacommons`. Gemini will create a subdirectory with the same name, with a skeleton configuration file `gemini-extension.json`.
1. Switch to the subdirectory that has been created:
   <pre>
   cd <var>EXTENSION_NAME</var>
   </pre>
1. Create a new Markdown file (with a `.md` suffix). You can name it however you want, or just use the default, `GEMINI.md`.
1. Write natural-language prompts to specify how Gemini should handle user queries and tool results. See <https://github.com/gemini-cli-extensions/datacommons/blob/main/DATACOMMONS.md> for a good example to get you started. Also see the Google ADK page on [LLM agent instructions](https://google.github.io/adk-docs/agents/llm-agents/#guiding-the-agent-instructions-instruction){: target="_blank"} for tips on how to write good prompts.
1. Modify `gemini-extension.json` to add the following configuration:
   <pre>
    {
        "name": "<var>EXTENSION_NAME</var>",
        "version": "1.0.0",
        "description": "<var>EXTENSION_DESCRIPTION</var>",
        // Only needed if the file name is not GEMINI.md
        "contextFileName": "<var>MARKDOWN_FILE_NAME</var>",
        "mcpServers": {
            "datacommons-mcp": {
                "command": "uvx",
                "args": [
                    "datacommons-mcp@latest",
                    "serve",
                    "stdio",
                    "--skip-api-key-validation"
                ],
                "env": {
                    "DC_API_KEY": "<var>YOUR_DATA_COMMONS_API_KEY</var>"
                    // Set these if you are running against a Custom Data Commons instance
                    "DC_TYPE="custom",
                  "CUSTOM_DC_URL"="<VAR>INSTANCE_URL</var>"
               }
            }
        }
    }
    </pre>
    The extension name is the one you created in step 1. In the `description` field, provide a brief description of your extension. If you release the extension publicly, this description will show up on <https://geminicli.com/extensions/>. 
    
    For additional options, see the [Gemini CLI extension documentation](https://geminicli.com/docs/extensions/#how-it-works){: target="_blank"}.
1.  Run the following command to install your new extension locally:
    ```
    gemini extensions link .
    ```

### Run the extension locally

1. From any directory, run `gemini`.
1. In the input box, enter `/extensions list` to verify that your extension is active.
1. Optionally, if you have already installed the Data Commons extension but do not want to use it, exit Gemini and from the command line, run:
  ```
  gemini extensions disable datacommons
  ```
1. Restart `gemini`. 
1. If you want to verify that `datacommons` is disabled, run `/extensions list` again.
1. Start sending queries!

### Make your extension public

If you would like to release your extension publicly for others to use, we recommend using a Github repository. See the [Gemini CLI extension release documentation](https://geminicli.com/docs/extensions/extension-releasing/){: target="_blank"} for full details.


## Customize the sample agent

We provide two sample Google Agent Development Kit-based agents you can use as inspiration for building your own agent:

- [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb) is a Google Colab tutorial that shows how to build an ADK Python agent step by step. 
- The sample [basic agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent) is a simple Python [Google ADK](https://google.github.io/adk-docs/) agent you can use to develop locally. You can make changes directly to the Python files. You'll need to [restart the agent](/mcp/run_tools.html#use-the-sample-agent) any time you make changes.

> Tip: You do not need to install the Google ADK; when you use the [command we provide](run_tools.md#use-the-sample-agent) to start the agent, it downloads the ADK dependencies at run time.

### Customize the model

To change to a different LLM or model version, edit the `AGENT_MODEL` constant in [packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py#L23){: target="_blank"}.

### Customize agent behavior

The agent's behavior is determined by prompts provided in the `AGENT_INSTRUCTIONS` in [packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py){: target="_blank"}.

You can add your own prompts to modify how the agent handles tool results. See the Google ADK page on [LLM agent instructions](https://google.github.io/adk-docs/agents/llm-agents/#guiding-the-agent-instructions-instruction){: target="_blank"} for tips on how to write good prompts.

