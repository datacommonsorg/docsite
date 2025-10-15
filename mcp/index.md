---
layout: default
title: MCP - Query data interactively with an AI agent
nav_order: 20
has_children: true
---

# Query data interactively with an AI agent

## Overview

The [Data Commons](https://datacommons.org) [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) service gives AI agents access to the Data Commons knowledge graph and returns data related to statistical variables, topics, and observations. It allows end users to formulate complex natural-language queries interactively, get data in textual, structured or unstructured formats, and download the data as desired. For example, depending on the agent, a user can answer high-level questions such as "give me the economic indicators of the BRICS countries", view simple tables, and download a CSV file of the data in tabular format.

The MCP server returns data from datacommons.org by default or can be configured for a Custom Data Commons instance. 

The server is a Python binary based on the [FastMCP 2.0 framework](https://gofastmcp.com). A prebuilt package is available at <https://pypi.org/project/datacommons-mcp/>.

At this time, there is no centrally deployed server; you run your own server, and any client you want to connect to it.

![alt text](mcp.png)

## Tools

The server currently supports the following tools:

- `search_indicators`: Searches for available variables and/or topics (a hierarchy of sub-topics and member variables) for a given place or metric. Topics are only relevant for Custom Data Commons instances that have implemented them.
- `get_observations`: Fetches statistical data for a given variable and place.

> Tip: If you want a deeper understanding of how the tools work, you may use the [MCP Inspector](https://modelcontextprotocol.io/legacy/tools/inspector) to make tool calls directly; see [Test with MCP Inspector](/mcp/develop_agent.html#test-with-mcp-inspector) for details.

## Clients

To connect to the Data Commons MCP Server, you can use any available AI application that supports MCP, or your own custom agent. 

The server supports both standard MCP [transport protocols](https://modelcontextprotocol.io/docs/learn/architecture#transport-layer):
- Stdio: For clients that connect directly using local processes
- Streamable HTTP: For clients that connect remotely or otherwise require HTTP (e.g. Typescript)

See [Run MCP tools](run_tools.md) for how to use the server with Google-based clients over Stdio.

For an end-to-end tutorial using a server and agent over HTTP in the cloud, see the sample Data Commons Colab notebook, [Try Data Commons MCP Tools with a Custom Agent](https://github.com/datacommonsorg/agent-toolkit/blob/main/notebooks/datacommons_mcp_tools_with_custom_agent.ipynb).

## Unsupported features

At the current time, the following are not supported:
- Non-geographical ("custom") entities
- Events
- Exploring nodes and relationships in the graph

## Disclaimer

AI applications using the MCP server can make mistakes, so please double-check responses.

