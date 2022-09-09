---
layout: default
title: REST (v1)
nav_order: 0
parent: API
has_children: true
published: false
permalink: /api/rest/v1
---

# Data Commons REST API

The Data Commons REST API is a
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library
that enables developers to programmatically access data in the Data Commons
knowledge graph. This package allows users to explore the structure of the
graph, integrate statistics from the graph into data analysis applications and
much more.

## Getting Started

First time using the Data Commons API, or just need a refresher? Take a look at
our [Getting Started Guide](/api/rest/v1/getting_started).

## Service Endpoints

The base URL for all endpoints below is:

```bash
https://api.datacommons.org
```

### Local Graph Exploration

Methods for exploring the graph around a set of nodes.

| API                        | URI                                                           | Description                                                                      |
| -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Info about a Place         | [/v1/info/place](/api/rest/v1/info/place)                     | Get basic information about a specific entity that is a place                    |
| Info about a Variable      | [/v1/info/variable](/api/rest/v1/info/variable)               | Get information about a specific variable                                        |
| Info about Variable Groups | [/v1/info/variable-groups](/api/rest/v1/info/variable-groups) | Get variable groups                                                              |
| Properties                 | [/v1/properties](/api/rest/v1/properties)                     | Get all properties (labels of directed edges) available for a specific entity    |
| Triples                    | [/v1/triples](/api/rest/v1/triples)                           | Get neighboring nodes and property labels of directed edges of a specific entity |
| Variables                  | [/v1/variables](/api/rest/v1/variables)                       | Get all variables associated with a specific entity                              |
{: .main}

### Querying Values

Methods for retrieving data associated with a set of nodes.

| API                        | URI                                                                     | Description                                                          |
| -------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Observation (single value) | [/v1/observations/point](/api/rest/v1/observations/point)               | Get a single value from a time-series variable for a specific entity |
| Observation (series)       | [/v1/observations/series](/api/rest/v1/observations/series)             | Get all values from a variable for a specific entity                 |
| Places within a place      | [/v1/property/values/in/linked](/api/rest/v1/property/values/in/linked) | Get all places of a specific type contained in a parent place        |
| Property Values            | [/v1/property/values/](/api/rest/v1/property/values)                    | Get the value for a property of a specific entity                    |
{: .main}

### Bulk Queries

Bulk versions of above APIs, designed for handling multiple queries at a time,
with more detailed output.

| API                          | URI                                                                                 | Description                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Info on Places               | [/v1/bulk/info/place](/api/rest/v1/bulk/info/place)                                 | Get information about multiple entities that are places               |
| Info on Variables            | [/v1/bulk/info/variables](/api/rest/v1/bulk/info/variables)                         | Get information about multiple variables                              |
| Observations (single values) | [/v1/bulk/observations/point](/api/rest/v1/bulk/observations/point)                 | Get a single value from a time-series variables for multiple entities |
| Observations (series)        | [/v1/bulk/observations/series](/api/rest/v1/bulk/observations/series)               | Get all values from variables for multiple entities                   |
| Observation (series, linked) | [/v1/bulk/observations/series/linked](/api/rest/v1/bulk/observations/series/linked) | Get all values from a variable for all places in a parent place       |
| Places within a place        | [/v1/bulk/property/values/in/linked](/api/rest/v1/bulk/property/values/in/linked)   | Get all places of a specific type for mulitple parent places          |
| Properties                   | [/v1/bulk/properties](/api/rest/v1/bulk/properties)                                 | Get all properties for multiple entities.                             |
| Property values              | [/v1/bulk/property/values](/api/rest/v1/bulk/property/values)                       | Get property values for multiple properties and multiple entities     |
| Triples                      | [/v1/bulk/triples](/api/rest/v1/bulk/triples)                                       | Get neighboring nodes and edge labels for multiple entities           |
| Variables                    | [/v1/bulk/variables](/api/rest/v1/bulk/variables)                                   | Get all variables available for multiple entities                     |
{: .main}
