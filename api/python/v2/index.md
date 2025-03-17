---
layout: default
title: Python (V2)
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

The latest version of Python client libraries implements the [REST V2 APIs](/api/rest/v2/) and adds many convenience methods. The package name is `datacommons_client`.

Here are just some of the changes from the previous version of the libraries:

- You can use this new version to query custom Data Commons instances in addition to base datacommons.org.
- The Data Commons [Pandas]((https://pandas.pydata.org/){: target="_blank"} module is included as an option in the install package; there is no need to install each library separately. Pandas APIs have also been migrated to use the REST V2 [Observation](/api/rest/v2/observation.html) API.
- Requests to base datacommons.org require an [API key](/api/index.html#get-key).
- The primary interface is a set of classes representing the REST V2 API endpoints.
- Each class provides a `fetch` method that takes an API [_relation expression_](/api/rest/v2/index.md#relation-expressions) as an argument as well as several convenience methods for commonly used operations.
- There is no SPARQL endpoint.

## Install the Python Data Commons V2 API

This procedure uses a Python virtual environment as recommended by Google Cloud [Setting up a Python development environment](https://cloud.google.com/python/docs/setup){: target="_blank"}.

1. If not done already, install `python3` and `pip3`. See [Installing Python](https://cloud.google.com/python/docs/setup#installing_python) for procedures.
1. Go to your project directory and create a virtual environment using venv, as described in [Using venv to isolate dependencies](https://cloud.google.com/python/docs/setup#installing_and_using_virtualenv){: target="_blank"}. 
1. Install the the `datacommons-client` package:

   ```bash
   $ pip install datacommons-client
   ```

To get additional functionality with Pandas DataFrames, run:

```bash
$ pip install "datacommons-client[Pandas]"
```
## Run Python interactively

The pages in this site demonstrate running Python methods interactively from the Bash shell. To use this facility, be sure to import the `datacommons_client` package:

From your virtual environment, run:

```bash
python3
>>> import datacommons_client
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

All access to the base Data Commons (datacommons.org) the V2 APIs must be authenticated and authorized with an API key. The `DataCommonsClient` object manages propagating the API key to all requests, so you don't need to specify it as part of data requests.

We provide a trial API key for general public use. This key will let you try the APIs and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

_The trial key is capped with a limited quota for requests._ If you are planning on using the APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request an official key without any quota limits; see [Obtain an API key](/api/index.html#get-key) for information.

For custom DC instances, you do _not_ need to provide any API key.

## Request endpoints and responses

The Python client library sends HTTP POST requests to the Data Commons [REST API endpoints](/api/rest/v2/index.md#service-endpoints) and receives JSON responses. Each endpoint has a corresponding response type. The classes are below:

| API | Endpoint | Description | Response type |
| --- | --- -----| ----------- |---------------|
| Observation | [`observation`](observation.md) | Fetches statistical observations (time series) | `ObservationResponse` |
| Observations Pandas DataFrame | [`observations_dataframe`](observation.md#) | Same as above, except the functionality is provided by a method of the `DataCommonsClient` class directly, instead of an intermediate endpoint | `pd.DataFrame` |
| Node | [`node`](node.md) | Fetches information about edges and neighboring nodes | `NodeResponse` |
| Resolve entities | [`resolve`](resolve.md) | Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph | `ResolveResponse` |

To send a request, you use one of the endpoints available as methods of the client object. For example: 

```python
>>> client.resolve.fetch_dcids_by_name(names="Georgia")
ResolveResponse(entities=[Entity(node='Georgia', candidates=[Candidate(dcid='geoId/13', dominantType=None), Candidate(dcid='country/GEO', dominantType=None), Candidate(dcid='geoId/5027700', dominantType=None)])])
```

See the linked pages for descriptions of the methods available for each endpoint, its methods and responses.

## Find available entities, variables, and their DCIDs

Many requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. For tips on how to find relevant DCIDs, entities and variables, please see the [Key concepts](/data_model.html) document, specifically the following sections:

- [Find a DCID for an entity or variable](/data_model.html#find-dcid)
- [Find places available for a statistical variable](/data_model.html#find-places)

{: #relation-expressions}
## Relation expressions

Each endpoint has a `fetch()` method that takes a relation expression. For complete information on the syntax and usage of relation expressions, please see the [REST V2 API relation expressions](/api/rest/v2/index.html#relation-expressions) documentation. 

For common requests, each endpoint also provides convenience methods that build the expressions for you. See the endpoint pages for details.

## Response formatting

By default, responses are returned as Python `dataclass` objects with the full structure. For example:

```python
>>> response = client.resolve.fetch_dcids_by_name(names="Georgia")
>>> print(response)
>>> ResolveResponse(entities=[Entity(node='Georgia', candidates=[Candidate(dcid='geoId/13', dominantType=None), Candidate(dcid='country/GEO', dominantType=None), Candidate(dcid='geoId/5027700', dominantType=None)])])
``` 

Each response class provides some property methods that are useful for formatting the output.

| Method | Description |
|--------|-------------|
| to_dict | Converts the dataclass to a Python dictionary. |
| to_json | Serializes the dataclass to a JSON string (using `json.dumps()`). |
{: .doc-table }

Both methods take the following input parameter:

| Parameter | Description |
|-----------|-------------|
| exclude_none  <br /> <optional-tag>Optional </optional-tag> | Compact response with nulls and empty lists removed. Defaults to `True`. To preserve the original structure and return all properties including null values and empty lists, set this to `False`. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Return dictionary in compact format

This example removes all properties that have null values or empty lists.

```python
>>> client.resolve.fetch_dcids_by_name(names="Georgia").to_dict()
{'entities': [{'node': 'Georgia', 'candidates': [{'dcid': 'geoId/13'}, {'dcid': 'country/GEO'}, {'dcid': 'geoId/5027700'}]}]}
```

{: .no_toc}
#### Example 2: Return dictionary with original structure 

This example sets `exclude_none` to `False` to preserve all properties from the original response, including all nulls and empty lists.

```python
>>> client.resolve.fetch_dcids_by_name(names="Georgia").to_dict(exclude_none=False)
{'entities': [{'node': 'Georgia', 'candidates': [{'dcid': 'geoId/13', 'dominantType': None}, {'dcid': 'country/GEO', 'dominantType': None}, {'dcid': 'geoId/5027700', 'dominantType': None}]}]}
```

{: .no_toc}
#### Example 3: Return compact JSON string

This example converts the response to a formatted JSON string, in compact form, and prints the response for better readability.

```python
>>> print(client.resolve.fetch_dcids_by_name(names="Georgia").to_json())
{
  "entities": [
    {
      "node": "Georgia",
      "candidates": [
        {
          "dcid": "geoId/13"
        },
        {
          "dcid": "country/GEO"
        },
        {
          "dcid": "geoId/5027700"
        }
      ]
    }
  ]
}
```