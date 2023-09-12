---
layout: default
title: REST (v2)
nav_order: 0
parent: API
has_children: true
published: true
permalink: /api/rest/v2
---

# Data Commons REST API

The Data Commons REST API is a
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library
that enables developers to programmatically access data in the Data Commons
knowledge graph. This package allows users to explore the structure of the
graph, integrate statistics from the graph into data analysis applications and
much more.

## What's new in V2

[//]: <> (TODO: link to new section)
The V2 API collapses functionality from V1 into a smaller number of endpoints. We do this by introducing a syntax for "Relation Expressions". Each API endpoint can also handle both single and bulk requests.

## Getting Started

[//]: <> (TODO: update this section for v2)
First time using the Data Commons API, or just need a refresher? Take a look at
our [Getting Started Guide](/api/rest/v1/getting_started).

## Service Endpoints

The base URL for all endpoints below is:

```bash
https://api.datacommons.org/v2
```

| API | URI | Description |
| --- | --- | ----------- |
| Node | [/v2/node](/api/rest/v2/node) | Fetches information about edges and neighboring nodes |
| Observation | [/v2/observation](/api/rest/v2/observation) | Fetches statistical observations |
| Resolve Entities | [/v2/resolve](/api/rest/v2/resolve) | Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph |