---
layout: default
title: Run MCP tools
nav_order: 9
parent: Build your own Data Commons
---

{:.no_toc}
# Run MCP tools

Custom Data Commons services container includes the Data Commons MCP server as a component. This page describes how to connect from an AI agent to the server running locally or in Google Cloud Run. 

> **Important**: 
> If you have not rebuilt your Data Commons image since the stable release of 2026-02-10, you must [sync to the latest stable release](/custom_dc/build_image.html#sync-code-to-the-stable-branch), [rebuild your image](/custom_dc/build_image.html#build-package) and [redeploy](/custom_dc/deploy_cloud.html#manage-your-service).

* TOC
{:toc}

## Configure a local MCP server

It runs by default.

You can use any AI agent to connect to the MCP server. For the most part, the procedures to do so are the same as those provided in [Run your own MCP server](/mcp/host_server.html). The main difference is that you must set additional environment variables, as described below.

<script src="/assets/js/customdc-doc-tabs.js"></script>

## Connect to the server

For details, see [Configure an agent to connect to the running server](/mcp/host_server.html#standalone-client).

The HTTP URL parameter can be your Cloud Run App URL or your public domain, with the `/mcp` parameter. For example, 
