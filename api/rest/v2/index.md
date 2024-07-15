---
layout: default
title: REST (v2)
nav_order: 1
parent: API
has_children: true
published: true
---

{:.no_toc}
# Data Commons REST API 

* TOC
{:toc}

## Overview

The Data Commons REST API is a
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library
that enables developers to programmatically access data in the Data Commons
knowledge graph, using [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). This allows you to explore the structure of the
graph, integrate statistics from the graph into data analysis applications and
much more.

You can use the REST API with any tool or language that supports HTTP. You can make queries on the command line (e.g. using [cURL](https://curl.se/)), by scripting HTTP requests in another language like Javascript, or even by entering an endpoint into your web browser!

## What's new in V2

The V2 API collapses functionality from [V1 API](/api/rest/v1) into a smaller number of endpoints, by introducing a syntax for _relation expressions_, [described below](#relation-expressions). Each API endpoint can also handle both single and bulk requests.


## Find available entities, variables, and their DCIDs

Most requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. Curious what entities and variables are available? Want to find a DCID? Take a look at our explorer tools:

- [Search](https://datacommons.org/search) Search Data Commons
- [Knowledge Graph](https://datacommons.org/browser/) Click through nodes in the knowledge graph
- [Place Browser](https://datacommons.org/place) Summaries of data available for entities that are geographic locations
- [Statistical Variable Explorer](https://datacommons.org/tools/statvar) See metadata for variables

{: #authentication}
## Authentication

API keys are required in any REST API request. To obtain an API key, please see [Get API key](/api/index.html#get-key).


