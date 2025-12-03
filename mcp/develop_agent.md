---
layout: default
title: Develop a custom agent
nav_order: 3
parent: MCP - Query data interactively with an AI agent
---

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

