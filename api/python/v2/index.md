---
layout: default
title: Python API (V2)
nav_order: 1
parent: API - Query data programmatically
has_children: true
published: true
---


{:.no_toc}
# Data Commons Python API V2

> **Note:** The V2 version of the Python client libraries is in Beta. Documentation and tutorials have not yet been updated to V2.

* TOC
{:toc}

## Overview

The Data Commons Python API is a Python client library that enables developers to
programmatically access nodes in the Data Commons knowledge graph. This package
allows you to explore the structure of the graph, integrate statistics from
the graph into data analysis workflows and much more. 

Before proceeding, make sure you have followed the setup instructions below.

## What's new in V2

The latest version of Python client libraries implements the [REST V2 APIs](/api/rest/v2/) and adds many convenience methods. The package name is `datacommons-client`.

Here are just some of the changes from the previous version of the libraries:

- You can use this new version to query custom Data Commons instances in addition to base datacommons.org.
- The Data Commons [Pandas]((https://pandas.pydata.org/){: target="_blank"} module is included as an option in the install package; there is no need to install each library separately. Pandas APIs have also been migrated to use the REST V2 [Observation](/api/rest/v2/observation.html) API.
- Requests to base datacommons.org require an [API key](/api/index.html#get-key).
- The primary interface is a set of classes representing the REST V2 API endpoints
- Each class provides a `fetch` method that takes an API [_relation expression_](/api/rest/v2/index.md#relation-expressions) as an argument as well as several convenience methods for commonly used operations
- (TODO: Check if this is true) There is no SPARQL endpoint, since the Pandas DataFrames provide equivalent functionality

## Install the Python Data Commons V2 API

This procedure uses a Python virtual environment as recommended by Google Cloud [Setting up a Python development environment](https://cloud.google.com/python/docs/setup){: target="_blank"}.

1. If not done already, install `python3` and `pip3`. See [Installing Python](https://cloud.google.com/python/docs/setup#installing_python) for procedures.
1. Go to your project directory and create a virtual environment using venv, as described in [Using venv to isolate dependencies](https://cloud.google.com/python/docs/setup#installing_and_using_virtualenv){: target="_blank"}. 
1. Install the the `datacommons_client` package:

  ```bash
  $ pip install datacommons-client
  ```
1. To get additional functionality with Pandas DataFrames, run:
 ```bash
  $ pip install "datacommons-client[Pandas]"
  ```
## Run Python interactively

The pages in this site demonstrate running Python methods interactively from the Bash shell. To use this facility, be sure to import the `datacommons_client` package:

From your virtual environment, run:

```bash
python3
>>> import datacommons_client
>>>
```

## Create a client

You access all Data Commons Python endpoints and methods through the [`DataCommonsClient`](https://github.com/datacommonsorg/api-python/blob/master/datacommons_client/client.py) class. 

To create a client and connect to the base Data Commons, namely datacommons.org:

<pre>
>>> from datacommons_client.client import DataCommonsClient
>>> client = DataCommonsClient(api_key="<var>YOUR_API_KEY</var>")
</pre>

See below about [API keys](#authentication).

To create a client and connect to a custom Data Commons by a publicly resolvable DNS hostname:

<pre>
>>> from datacommons_client.client import DataCommonsClient
>>> client = DataCommonsClient(dc_instance="<var>DNS_HOSTNAME</var>")
</pre>

For example:
```python
client = DataCommonsClient(dc_instance="datacommons.one.org")
```
To create a client and connect to a custom Data Commons by a private/non-resolvable address, specify the full API path, including the protocol and API version:

<pre>
>>> from datacommons_client.client import DataCommonsClient
>>> client = DataCommonsClient(url="http://<var>YOUR_ADDRESS</var>/core/api/v2/")
</pre>

For example, to connect to a locally running DataCommons instance:

<pre>
>>> from datacommons_client.client import DataCommonsClient
>>> client = DataCommonsClient(url="http://localhost:8080/core/api/v2/")
</pre>

### Authentication {#authentication}

All access to the base Data Commons (datacommons.org) using the REST APIs must be authenticated and authorized with an API key.

We provide a trial API key for general public use. This key will let you try the APIs and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

_The trial key is capped with a limited quota for requests._ If you are planning on using the APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request an official key without any quota limits; please see [Obtain an API key](/api/index.html#get-key) for information.

The `DataCommonsClient` object manages propagating the API key to all requests, so you don't need to specify it as part of data requests.

For custom DC instances, do _not_ provide any API key.

## Request endpoints and responses

The Python client library sends HTTP POST requests to the Data Commons [REST API endpoints](/api/rest/v2/index.md#service-endpoints) and receives JSON responses. Each endpoint has a corresponding response type. The classes are below:

| API | Endpoint | Description | Response type |
| --- | --- -----| ----------- |---------------|
| Observation | [`observation`](observation.md)) | Fetches statistical observations (time series) | `ObservationResponse` |
| Observations Pandas DataFrame | [`observations_dataframe`](observation.md#) | Same as above, except the functionality is provided by a method of the `DataCommonsClient` class directly, instead of an intermediate endpoint | `pd.DataFrame` |
| Node | [`node`](node.md) | Fetches information about edges and neighboring nodes | `NodeResponse` |
| Resolve entities | [`resolve`](resolve.md) | Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph | `ResolveResponse` |

To send a request, you inject an endpoint to the client object, call one of the endpoint's methods, and assign the result to a response object of the corresponding endpoint. Each response type has some methods for formatting. For example: 

```python
>>> response = client.resolve.fetch_dcids_by_name(names="Caliornia")
>>> print(response)
ResolveResponse(entities=[Entity(node='Caliornia', candidates=[Candidate(dcid='geoId/06', dominantType=None)])])
>>> print(response.json)
{'entities': [{'node': 'Caliornia', 'candidates': [{'dcid': 'geoId/06', 'dominantType': None}]}]}
```

See the linked pages for descriptions of the methods available for each endpoint and response type.

## Find available entities, variables, and their DCIDs

Many requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. For tips on how to find relevant DCIDs, entities and variables, please see the [Key concepts](/data_model.html) document, specifically the following sections:

- [Find a DCID for an entity or variable](/data_model.html#find-dcid)
- [Find places available for a statistical variable](/data_model.html#find-places)

{: #relation-expressions}
## Relation expressions

Each endpoint has a `fetch()` method that takes a relation expression. For complete information on the syntax and usage of relation expressions, please see the [REST V2 API relation expressions](/api/rest/v2/index.html#relation-expressions) documentation. 

For common requests, each endpoint also provides convenience methods that build the expressions for you.

## Pagination

All endpoint methods return all data in a single response by default. To improve the performance of requests that return a lot of data, you can "paginate" the returned payload, that is, split it over multiple requests. To do so, you can set a parameter accepted by all methods, `all_pages` to `False`. In this case, nnly a subset of the response is returned, along with a long string of characters called a _token_. To get the next set of entries, you repeat the request with `next_token` as a  method parameter, with the token as its value.

For example, this request, which returns all incoming relations for California, returns a huge number of data items and can take several seconds to complete:

```python
response = client.node.fetch(node_dcids="geoId/06", expression="<-*")
```
To paginate the data, send the first request like this: 

```json
response = client.node.fetch(node_dcids="geoId/06", expression="<-*", all_pages=False)
```
The response will have the following at the end:

```
...
"nextToken": "SoME_veRy_L0ng_STrIng"
```

To get the next set of entries, repeat the request with the `next_token` parameter set to the value in the response: For example:

```python
response = client.node.fetch(node_dcids="geoId/06", expression="<-*", all_pages=False, next_token="SoME_veRy_L0ng_STrIng")
```
Repeat until the response contains no `next_token`.

## Response formatting

By default, the client converts JSON responses into Python response class objects. For example:

```python
>>> print(response)
ResolveResponse(entities=[Entity(node='California', candidates=[Candidate(dcid='geoId/06', dominantType=None), Candidate(dcid='geoId/2412150', dominantType=None), Candidate(dcid='geoId/4210768', dominantType=None), Candidate(dcid='geoId/2910468', dominantType=None), Candidate(dcid='geoId/2111872', dominantType=None)])])
```
Each response class provides a property method, `json`, that converts the response back to JSON.

```python
>>> print(response.json)
{'entities': [{'node': 'California', 'candidates': [{'dcid': 'geoId/06', 'dominantType': None}, {'dcid': 'geoId/2412150', 'dominantType': None}, {'dcid': 'geoId/4210768', 'dominantType': None}, {'dcid': 'geoId/2910468', 'dominantType': None}, {'dcid': 'geoId/2111872', 'dominantType': None}]}]}
```


