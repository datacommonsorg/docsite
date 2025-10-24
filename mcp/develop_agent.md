---
layout: default
title: Develop an ADK agent
nav_order: 3
parent: MCP - Query data interactively with an AI agent
---

# Develop your own ADK agent

We provide two sample Google Agent Development Kit-based agents you can use as inspiration for building your own agent:

- [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb) is a Google Colab tutorial that shows how to build an ADK Python agent step by step. 
- The sample [basic agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent) is a simple Python [Google ADK](https://google.github.io/adk-docs/) agent you can use to develop locally. 

## Customize the sample agent

You can make changes directly to the Python files in <https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/>. You'll need to [restart the agent](/mcp/run_tools.html#use-the-sample-agent) any time you make changes.

> Tip: You do not need to install the Google ADK; when you use the [command we provide](run_tools.md#use-the-sample-agent) to start the agent, it downloads the ADK dependencies at run time.

### Customize the model

To change to a different LLM, edit the `AGENT_MODEL` constant in [packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py#L23){: target="_blank"}.

### Customize agent behavior

The agent's behavior is determined by prompts provided in the `AGENT_INSTRUCTIONS` in [packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py){: target="_blank"}.

You can add your own prompts to modify how the agent handles tool results. For example, you might want to give a prompt to "build a report for every response" or "always save tabular results to a CSV file". See the Google ADK page on [LLM agent instructions](https://google.github.io/adk-docs/agents/llm-agents/#guiding-the-agent-instructions-instruction){: target="_blank"} for tips on how to write good prompts.

