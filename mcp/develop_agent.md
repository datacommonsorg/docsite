---
layout: default
title: Develop an ADK agent
nav_order: 3
parent: MCP - Query data interactively with an AI agent
---

# Develop your own ADK agent

We provide two sample Google Agent Development Kit-based agents you can use as inspiration for building your own agent:

- [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb) is a Google Colab tutorial that shows how to build an ADK Python agent step by step. 
- The sample [basic agent](https://github.com/datacommonsorg/agent-toolkit/tree/main/packages/datacommons-mcp/examples/sample_agents/basic_agent) is a simple Python ADK agent you can use to develop locally. At the most basic level, you can modify its configuration, including:
   - The [AGENT_INSTRUCTIONS](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/instructions.py)
   - The [AGENT_MODEL](https://github.com/datacommonsorg/agent-toolkit/blob/main/packages/datacommons-mcp/examples/sample_agents/basic_agent/agent.py#L23)
   - The transport layer protocol: see [Connect to a remote server](/mcp/run_tools.html#connect-to-an-already-running-server-from-a-remote-client) for details.

   To run the custom code, see [Use the sample agent](/mcp/run_tools.html#use-the-sample-agent).

