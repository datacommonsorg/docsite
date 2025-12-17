---
layout: default
title: MCP - Query data interactively with an AI agent
nav_order: 20
has_children: true
---

{:.no_toc}
# Query data interactively with an AI agent

* TOC
{:toc}

## Overview

The Data Commons [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) service gives AI agents access to the Data Commons knowledge graph and returns data related to statistical variables, topics, and observations. It allows end users to formulate complex natural-language queries interactively, get data in textual, structured or unstructured formats, and download the data as desired. For example, depending on the agent, a user can answer high-level questions such as "give me the economic indicators of the BRICS countries", view simple tables, and download a CSV file of the data in tabular format.

The MCP server returns data from datacommons.org by default or can be configured to query a Custom Data Commons instance. 

The server is a Python binary based on the [FastMCP 2.0 framework](https://gofastmcp.com). A prebuilt package is available at <https://pypi.org/project/datacommons-mcp/>.

At this time, there is no centrally deployed server; you run your own server, and any client you want to connect to it.

![alt text](/assets/images/mcp.png)

You can run the server and client locally, or you can run the server and client on different machines.

## Tools

The server currently supports the following tools:

- `search_indicators`: Searches for available variables and/or topics (a hierarchy of sub-topics and member variables) for a given place or metric. 
- `get_observations`: Fetches statistical data for a given variable and place.

## Clients

To connect to the Data Commons MCP Server, you can use any available AI application that supports MCP, or your own custom agent. 

The server supports both standard MCP [transport protocols](https://modelcontextprotocol.io/docs/learn/architecture#transport-layer):
- Stdio: For clients that connect directly using local processes
- Streamable HTTP: For clients that connect remotely or otherwise require HTTP (e.g. Typescript)

See [Run MCP tools](run_tools.md) for procedures for using [Gemini CLI](https://github.com/google-gemini/gemini-cli) and the [Gemini CLI Data Commons extension](https://geminicli.com/extensions/).

## Unsupported features

At the current time, the following are not supported:
- Non-geographical ("custom") entities
- Events
- Exploring nodes and relationships in the graph
- Returning data formatted for graphic visualizations

## Disclaimer

AI applications using the MCP server can make mistakes, so please double-check responses.
