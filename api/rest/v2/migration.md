---
layout: default
title: Migrate to REST API V2
nav_order: 7
parent: REST (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Migrate from API V1 to V2

V2 of the Data Commons REST API is significantly different from V1. This document summarizes the important differences that you should be aware of, gives tips for upgrading, and provides examples of translating queries from V1 to V2.

* TOC
{:toc}

## Summary of changes 

| Feature | V1 | V2 |
|---------|----|----|
| Base URL | https://api.datacommons.org/v1/ | https://api.datacommons.org/v2/ |
| Service endpoints | 12 endpoints + 12 bulk versions of each | 5 endpoints |
| Simple vs. bulk query | Every endpoint has an equivalent "bulk" version | Not used |
| APIs for graph exploration | triples<br/>


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
| <bulk-tag>bulk</bulk-tag> Triples                  | [/v1/bulk/triples](/api/rest/v1/bulk/triples)                                     | Get neighboring nodes and edge labels for multiple nodes                       |
| <bulk-tag>bulk</bulk-tag> Properties               | [/v1/bulk/properties](/api/rest/v1/bulk/properties)                               | Get all properties for multiple nodes.                                         |
| <bulk-tag>bulk</bulk-tag> Property values          | [/v1/bulk/property/values](/api/rest/v1/bulk/property/values)                     | Get property values for multiple properties and multiple nodes                 |
| <bulk-tag>bulk</bulk-tag> Property Values (linked) | [/v1/bulk/property/values/in/linked](/api/rest/v1/bulk/property/values/in/linked) | Get all places of a specific type for mulitple ancestor places                 |

### Node Information

Methods for retrieving information of certain types of nodes.

| API                                           | URI                                                                   | Description                                    |
| --------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| Find Entities                                 | [/v1/find/entities](/api/rest/v1/find/entities)                       | Find the DCID of an entity                     |
| Place Info                                    | [/v1/info/place](/api/rest/v1/info/place)                             | Get information about a place                  |
| Variable Info                                 | [/v1/info/variable](/api/rest/v1/info/variable)                       | Get information about a variable               |
| Variable Group Info                           | [/v1/info/variable-group](/api/rest/v1/info/variable-group)           | Get information about a variable group         |
|                                               |                                                                       |                                                |
| <bulk-tag>bulk</bulk-tag> Find Entities       | [/v1/bulk/find/entities](/api/rest/v1/bulk/find/entities)             | Find the DCID of an entity                     |
| <bulk-tag>bulk</bulk-tag> Place Info          | [/v1/bulk/info/place](/api/rest/v1/bulk/info/place)                   | Get information about multiple places          |
| <bulk-tag>bulk</bulk-tag> Variable Info       | [/v1/bulk/info/variable](/api/rest/v1/bulk/info/variable)             | Get information about multiple variables       |
| <bulk-tag>bulk</bulk-tag> Variable Group Info | [/v1/bulk/info/variable-group](/api/rest/v1/bulk/info/variable-group) | Get information about multiple variable groups |

### Statistical Observations

Methods for retrieving statistical observations associated with a set of
entities.

| API                                                          | URI                                                                                 | Description                                                           |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Observation (single value)                                   | [/v1/observations/point](/api/rest/v1/observations/point)                           | Get a single value from a time-series variable for a specific entity  |
| Observation (series)                                         | [/v1/observations/series](/api/rest/v1/observations/series)                         | Get all values from a variable for a specific entity                  |
|                                                              |                                                                                     |                                                                       |
| <bulk-tag>bulk</bulk-tag> Observation (single value)         | [/v1/bulk/observations/point](/api/rest/v1/bulk/observations/point)                 | Get a single value from variables for multiple entities               |
| <bulk-tag>bulk</bulk-tag> Observation (single value, linked) | [/v1/bulk/observations/point/linked](/api/rest/v1/bulk/observations/point/linked)   | Get a single value from variables for all places in an ancestor place |
| <bulk-tag>bulk</bulk-tag> Observation (series)               | [/v1/bulk/observations/series](/api/rest/v1/bulk/observations/series)               | Get all values from variables for multiple entities                   |
| <bulk-tag>bulk</bulk-tag> Observation (series, linked)       | [/v1/bulk/observations/series/linked](/api/rest/v1/bulk/observations/series/linked) | Get all values from a variable for all places in an ancestor place    |

### Statistical Variable

Methods for retrieving statistical variable related data.

| API                                 | URI                                               | Description                                         |
| ----------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Variables                           | [/v1/variables](/api/rest/v1/variables)           | Get all variables associated with a specific entity |
| <bulk-tag>bulk</bulk-tag> Variables | [/v1/bulk/variables](/api/rest/v1/bulk/variables) | Get all variables available for multiple entities   |

### Graph Query

Methods for querying the Data Commons knowledge graph with [SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

| API    | URI                             | Description        |
| ------ | ------------------------------- | ------------------ |
| SPARQL | [/v1/query](/api/rest/v1/query) | Use SPARQL queries |


#### Endpoints

Requests are made through [API endpoints](https://en.wikipedia.org/wiki/Web_API#Endpoints). We provide endpoints for many different queries (see the list of available endpoints [here](/api/rest/v1)).

Each endpoint can be acessed using its unique URL, which is a combination of a base URL and the endpoint's [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier).

The base URL for all REST endpoints is:

```bash
https://api.datacommons.org
```

And a URI looks like [`/v1/observation/point`](/api/rest/v1/observation/point). To access a particular endpoint, append the URI to the base URL (e.g. `https://api.datacommons.org/v1/observation/point` ).

#### Parameters

Endpoints take a set of **parameters** which allow you to specify which entities, variables, timescales, etc. you are interested in. There are two kinds of parameters: path parameters and query parameters.

##### Path Parameters

Path parameters must be passed in a specific order as part of the URL. For example, `/v1/observations/point` requires the DCIDs of the entity and variable to query, in that order. This would look something like:

```bash
https://api.datacommons.org/v1/observations/point/entity_DCID/variable_DCID
```

##### Query Parameters

Query parameters are chained at the end of a URL behind a `?` symbol. Separate multiple parameter entries with an `&` symbol. For example, this would look like:

```bash
https://api.datacommons.org/v1/observations/point/variable_DCID/entity_DCID?date=YYYY&facet=XXXXXXXXXXX
```

Still confused? Each endpoint's documentation page has examples at the bottom tailored to the endpoint you're trying to use.

#### Finding Available Entities, Variables, and their DCIDs

Most requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. Curious what entities and variables are available? Want to find a DCID? Take a look at our explorer tools:

- [Search](https://datacommons.org/search) Search Data Commons
- [Knowledge Graph](https://datacommons.org/browser/) Click through the knowledge graph
- [Place Browser](https://datacommons.org/place) Summaries of data available for entities that are geographic locations
- [Statistical Variable Explorer](https://datacommons.org/tools/statvar) See metadata for variables

#### Finding Datetimes for Observations

Many endpoints allow the user to filter their results to specific dates. When querying for data at a specific date, the string passed for the date queried must match the date format (in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601)) used by the target variable. An easy way to see what date format a variable uses is to look up your variable of interest in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar).

### Bulk Retrieval

Many of our APIs come in both “simple” and “bulk” versions. The simple versions of endpoints have prefix `/v1/` and are designed for handling single requests with a simplified return structure. The bulk versions of endpoints have prefix `/v1/bulk/` and are meant for querying multiple variables or entities at once, and provide richer details in the response.

#### POST requests

Some bulk endpoints allow for `POST` requests. For `POST` requests, feed all parameters in JSON format. For example, in cURL, this would look like:

```bash
curl -X POST \
--url https://api.datacommons.org/v1/bulk/observations/point \
--data '{
  "entities": [
    "entity_dcid_1",
    "entity_dcid_2",
    ...
  ],
  "variables: [
    "variable_dcid_1",
    "variable_dcid_2",
    ...
  ]
}'
```

### Authentication

{: #authentication}

<div markdown="span" class="alert alert-danger" role="alert">
   <span class="material-icons exclamation-icon">priority_high</span><b>IMPORTANT:</b><br />
   API keys are now required. To use the REST API, a valid API key must be included in all requests.
</div>

#### Using API Keys

API keys are required in any REST API request. To include an API key, add your API key to the URL as a query parameter by appending `?key=<YOUR_API_KEY_HERE>`.

For GET requests, this looks like:

```bash
https://api.datacommons.org/v1/end/point?key=<YOUR_KEY_HERE>
```

If the key is not the first query parameter, use `&key=<YOUR_API_KEY_HERE>` instead. This looks like:

```bash
https://api.datacommons.org/v1/end/point?query=value&key=<YOUR_KEY_HERE>
```

For POST requests, pass the key as a header. For example, in cURL, this looks like:

```bash
curl -X POST \
--url https://api.datacommons.org/v1/bulk/end/point \
--header 'X-API-Key: <YOUR_KEY_HERE>' \
--data '{
  "entities": [
    "entity_dcid_1",
    "entity_dcid_2",
    ...
  ],
  "variables: [
    "variable_dcid_1",
    "variable_dcid_2",
    ...
  ]
}'
```

#### Getting API Keys

We've provided a trial API key for general public use. This key will let you try the API and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial Key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

<b>The trial key is capped with a limited quota for requests.</b> If you are planning on using our APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please go to the portal at https://apikeys.datacommons.org and request a key for `api.datacommons.org`.