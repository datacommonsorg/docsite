---
layout: default
title: v1 REST
nav_order: 0
parent: API
has_children: true
published: false
permalink: /api/rest/v1
---
 

# Data Commons REST API

 
The Data Commons REST API is a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library that enables developers to programmatically access data in the Data Commons knowledge graph. This package allows users to explore the structure of the graph, integrate statistics from the graph into data analysis applications and much more.
 
 

## Getting Started

 
First time using the Data Commons API, or just need a refresher? Take a look at our [Getting Started Guide](/api/rest/v1/getting_started).
 
 

## Service Endpoints

 
The base URL for all endpoints below is:
 
 

```bash
https://api.datacommons.org
```

 
 

### Local Graph Exploration

 
Methods for exploring the graph around a set of nodes.
 
| API | URI | Description |
| --- | --- | ------------|
| Get triples | /v1/triples | Get neighboring nodes and property labels of directed edges of a specific entity
| Get properties | /v1/properties | Get all properties (labels of directed edges) available for a specific entity |
| Get variables | /v1/variables | Get all variables associated with a specific entity |
| Get info on a place |/v1/info/place | Get basic information about a specific entity that is a place |
| Get info on a variable | /v1/info/variable | Get information about a specific variable |
 
{: .main}
 
 
 

### Querying Values

 
Methods for retrieving data associated with a set of nodes.
 
| API | URI | Description |
| --- | --- | ------------|
| Get an observation | [/v1/observations/point](/api/rest/v1/observations/point) | Get a single value from a time-series variable for a specific entity |
| Get a series of observations | [/v1/observations/series](/api/rest/v1/observations/series) | Get all values from a variable for a specific entity |
| Get property values | /v1/property/values/ | Get the value for a property of a specific entity |
|
{: .main}
 
 

### Bulk Queries

 
Bulk versions of above APIs, designed for handling multiple queries at a time, with more detailed output.
 
| API | URI | Description |
| --- | --- | ------------|
| Get observations | [/v1/bulk/observations/point](/api/rest/v1/bulk/observations/point) | Get a single value from a time-series variables for multiple entities
| Get series of observations | [/v1/bulk/observations/series](/api/rest/v1/bulk/observations/series) | Get all values from variables for multiple entities |
| Get properties | /v1/bulk/properties | Get all properties for multiple entities. |
| Get property values | /v1/bulk/property/values | Get property values for multiple properties and multiple entities |
| Get triples | /v1/bulk/triples | Get neighboring nodes and edge labels for multiple entities |
| Get variables | /v1/bulk/variables | Get all variables available for multiple entities |
| Get info on places | /v1/bulk/info/place | Get information about multiple entities that are places |
| Get info on variables | /v1/bulk/info/variables | Get information about multiple variables |
{: .main}
