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

### Simple vs Bulk Query

Some APIs have a bulk version, designed for handling multiple queries at a time,
with more detailed output. Bulk endpoints are tagged with <bulk-tag>bulk</bulk-tag> below.

### Local Graph Exploration

Methods for exploring the graph around a set of nodes.

| API                                                | URI                                                                               | Description                                                                    |
| -------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Triples                                            | [/v1/triples](/api/rest/v1/triples)                                               | Get neighboring nodes and property labels of directed edges of a specific node |
| Properties                                         | [/v1/properties](/api/rest/v1/properties)                                         | Get all properties (labels of directed edges) available for a specific node    |
| Property Values                                    | [/v1/property/values/](/api/rest/v1/property/values)                              | Get the value for a property of a specific node                                |
| Property Values (linked)                           | [/v1/property/values/in/linked](/api/rest/v1/property/values/in/linked)           | Get all places of a specific type contained in an ancestor place               |
|                                                    |                                                                                   |                                                                                |
| Triples <bulk-tag>bulk</bulk-tag>                  | [/v1/bulk/triples](/api/rest/v1/bulk/triples)                                     | Get neighboring nodes and edge labels for multiple nodes                       |
| Properties <bulk-tag>bulk</bulk-tag>               | [/v1/bulk/properties](/api/rest/v1/bulk/properties)                               | Get all properties for multiple nodes.                                         |
| Property values <bulk-tag>bulk</bulk-tag>          | [/v1/bulk/property/values](/api/rest/v1/bulk/property/values)                     | Get property values for multiple properties and multiple nodes                 |
| Property Values (linked) <bulk-tag>bulk</bulk-tag> | [/v1/bulk/property/values/in/linked](/api/rest/v1/bulk/property/values/in/linked) | Get all places of a specific type for mulitple ancestor places                 |

### Node Information

Methods for retrieving information of certain types of nodes.

| API                                           | URI                                                                   | Description                                    |
| --------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| Place Info                                    | [/v1/info/place](/api/rest/v1/info/place)                             | Get information about a place                  |
| Variable Info                                 | [/v1/info/variable](/api/rest/v1/info/variable)                       | Get information about a variable               |
| Variable Group Info                           | [/v1/info/variable-group](/api/rest/v1/info/variable-group)           | Get information about a variable group         |
|                                               |                                                                       |                                                |
| Place Info <bulk-tag>bulk</bulk-tag>          | [/v1/bulk/info/place](/api/rest/v1/bulk/info/place)                   | Get information about multiple places          |
| Variable Info <bulk-tag>bulk</bulk-tag>       | [/v1/bulk/info/variable](/api/rest/v1/bulk/info/variable)             | Get information about multiple variables       |
| Variable Group Info <bulk-tag>bulk</bulk-tag> | [/v1/bulk/info/variable-group](/api/rest/v1/bulk/info/variable-group) | Get information about multiple variable groups |

### Statistical Observations

Methods for retrieving statistical observations associated with a set of
entities.

| API                                                          | URI                                                                                 | Description                                                           |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Observation (single value)                                   | [/v1/observations/point](/api/rest/v1/observations/point)                           | Get a single value from a time-series variable for a specific entity  |
| Observation (series)                                         | [/v1/observations/series](/api/rest/v1/observations/series)                         | Get all values from a variable for a specific entity                  |
|                                                              |                                                                                     |                                                                       |
| Observation (single value) <bulk-tag>bulk</bulk-tag>         | [/v1/bulk/observations/point](/api/rest/v1/bulk/observations/point)                 | Get a single value from variables for multiple entities               |
| Observation (single value, linked) <bulk-tag>bulk</bulk-tag> | [/v1/bulk/observations/point/linked](/api/rest/v1/bulk/observations/point/linked)   | Get a single value from variables for all places in an ancestor place |
| Observation (series) <bulk-tag>bulk</bulk-tag>               | [/v1/bulk/observations/series](/api/rest/v1/bulk/observations/series)               | Get all values from variables for multiple entities                   |
| Observation (series, linked) <bulk-tag>bulk</bulk-tag>       | [/v1/bulk/observations/series/linked](/api/rest/v1/bulk/observations/series/linked) | Get all values from a variable for all places in an ancestor place    |

### Statistical Variable

Methods for retrieving statistical variable related data.

| API                                 | URI                                               | Description                                         |
| ----------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Variables                           | [/v1/variables](/api/rest/v1/variables)           | Get all variables associated with a specific entity |
| Variables <bulk-tag>bulk</bulk-tag> | [/v1/bulk/variables](/api/rest/v1/bulk/variables) | Get all variables available for multiple entities   |

### Graph Query

Methods for querying the Data Commons knowledge graph with other query languages

| API              | URI                                               | Description                                         |
| ---------------- | ------------------------------------------------- | --------------------------------------------------- |
| SPARQL           | [/v1/query](/api/rest/v1/query)                   | Use SPARQL queries                                  |
