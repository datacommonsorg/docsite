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

The MCP server returns data from datacommons.org ("base") by default. It can also be configured to query a Custom Data Commons instance. 

For base Data Commons, the server is available as a hosted managed deployment to which you can connect from any AI agent running locally or remotely.

![base Data Commons](/assets/images/mcp1.png)

You can also run your own MCP server locally, or in Google Cloud Platform. If you want to use the server to query a Custom Data Commons instance, you _must_ run your own. The server is available as a prebuilt Python package or as a prebuilt Docker image for running as a Google Cloud Run service.

![base or Custom Data Commons](/assets/images/mcp2.png)

## Tools

The server currently supports the following tools:

- `search_indicators`: Searches for available variables and/or topics (a hierarchy of sub-topics and member variables) for a given place or metric. 
- `get_observations`: Fetches statistical data for a given variable and place.

## Clients

To connect to the Data Commons MCP Server, you can use any available AI application that supports MCP, or your own custom agent. 

For self-hosted deployments, the server supports both standard MCP [transport protocols](https://modelcontextprotocol.io/docs/learn/architecture#transport-layer):
- Streamable HTTP: For clients that connect remotely or otherwise require HTTP (e.g. Typescript)
- Stdio: For clients that connect directly using local processes

See [Run MCP tools](run_tools.md) for procedures for using [Gemini CLI](https://github.com/google-gemini/gemini-cli) and the [Gemini CLI Data Commons extension](https://geminicli.com/extensions/).

## Unsupported features

At the current time, the following are not supported:
- Non-geographical ("custom") entities
- Events
- Exploring nodes and relationships in the graph
- Returning data formatted for graphic visualizations

## Disclaimer

AI applications using the MCP server can make mistakes, so please double-check responses.
