---
layout: default
title: v1 REST
nav_order: 0
parent: API
has_children: true
published: true
permalink: /api/rest/v1
---

# Data Commons REST API

The Data Commons REST API is a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library that enables developers to programmatically access nodes in the Data Commons knowledge graph. This package allows users to explore the structure of the graph, integrate statistics from the graph into data analysis applications and much more. 


## Getting Started

First time using the Data Commons API, or just need a refresher? Take a look at our [Getting Started Guide](getting_started.html).


## Service Endpoints

The base URL for all endpoints below is:


```bash
https://api.datacommons.org
```


### Local Graph Exploration

Methods for exploring the graph around a set of nodes.

| API | URI | Description |
| --- | --- | ------------|
| Get a triple | /v1/triples | Get neighboring nodes and property labels of directed edges of a specific entity 
| Get variables | /v1/variables | Get all variables associated with a specific entity |
| Get info on a place |[/v1/info/place]({{ site.baseurl }}/api/rest/v1/info/place) | Get basic information about a specific entity that is a place |
| Get info on a variable | [/v1/info/variable]({{ site.baseurl }}/api/rest/v1/info/variable) | Get information about a specific variable |
{: .main}



### Querying Values

Methods for retrieving data associated with a set of nodes.

| API | URI | Description |
| --- | --- | ------------|
| Get an observation | [/v1/observations/point]({{ site.baseurl }}/api/rest/v1/observations/point) | Get a single value from a time-series variable for a specific entity
| Get a series of observations | [/v1/observations/series]({{ site.baseurl }}/api/rest/v1/observations/series) | Get all values from a variable for a specific entity |
{: .main}


 
### Bulk Queries

Bulk versions of above APIs, designed for handling mulitple queries at a time, with more detailed output.

| API | URI | Description |
| --- | --- | ------------|
| Get observations | [/v1/bulk/observations/point]({{ site.baseurl }}/api/rest/v1/bulk/observations/point) | Get a single value from a time-series variableo for multiple entities
| Get series of observations | [/v1/bulk/observations/series]({{ site.baseurl }}/api/rest/v1/bulk/observations/series) | Get all values from ariables for multiple entities |
{: .main}