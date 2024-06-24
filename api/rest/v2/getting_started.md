---
layout: default
title: Get started
nav_order: 0
parent: REST (v2)
grand_parent: API
published: true
---

# Get started

Welcome! Whether you're new to Data Commons or are just looking for a refresher, this guide gives an overview of what you need to know to get started using our REST API.

Use the links below to jump to any section:

* TOC
{:toc}

## What is a REST API?

Our REST API follows the [RESTful architectural style](https://en.wikipedia.org/wiki/Representational_state_transfer) to allow you to query the Data Commons Knowledge Graph via [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). This allows you to explore the local graph and query data from specific variables and entities programatically.

## How to use the REST API

You can use the REST API with any tool or language that supports HTTP. You can make queries on the command line (e.g. using [cURL](https://curl.se/)), by scripting HTTP requests in another language like Javascript, or even by entering an endpoint into your web browser!

Following HTTP, a REST API call consists of a _request_ that you provide, and a _response_ from the Data Commons servers with the data you requested, in [JSON](https://json.org) format. The next section details how to assemble a request.

### Assemble a request

#### Endpoints

You make requests through [API endpoints](https://en.wikipedia.org/wiki/Web_API#Endpoints). See the list of available endpoints [here](/api/rest/v2)).

You access each endpoint using its unique URL, which is a combination of a base URL and the endpoint's [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier).

The base URL for all REST endpoints is:

```bash
https://api.datacommons.org
```

A URI looks like [`/v2/node`](/api/rest/v2/node). To access a particular endpoint, append the URI to the base URL (e.g. `https://api.datacommons.org/v2/node` ).

#### Parameters

Endpoints take a set of parameters which allow you to specify the entities, variables, timescales, etc. you are interested in. The V2 APIs only use query parameters.

##### Query parameters

Query parameters are chained at the end of a URL behind a `?` symbol. Separate multiple parameter entries with an `&` symbol. For example, this would look like:

<pre>
https://api.datacommons.org/v2/node?key=<var>API_KEY</var>&nodes=<var>DCID1</var>&nodes=<var>DCID2</var>&property=<-*
</pre>

Still confused? Each endpoint's documentation page has examples at the bottom tailored to the endpoint you're trying to use.

#### POST requests

All V2 endpoints allow for `POST` requests. For `POST` requests, feed all parameters in JSON format. For example, in cURL, this would look like:

<pre>
curl -X POST \
-H "X-API-Key: <var>API_KEY</var>" \
--url https://api.datacommons.org/v2/node \
--data '{
  "nodes": [
    "geoId/06085",
    "geoId/06086"
  ],
  "property": "->[name, latitude, longitude]"
}'
</pre>

#### Find available entities, variables, and their DCIDs

Most requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. Curious what entities and variables are available? Want to find a DCID? Take a look at our explorer tools:

- [Search](https://datacommons.org/search) Data Commons
- [Knowledge Graph](https://datacommons.org/browser/): click through nodes in the knowledge graph
- [Statistical Variable Explorer](https://datacommons.org/tools/statvar): see metadata for variables
- [v2/resolve API endpoint](/api/v2/resolve.html): get DCIDs programmatically

#### Find dates for observations

Many endpoints allow you to filter their results to specific dates. When querying for data at a specific date, the string you pass for the date queried must match the date format (in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601)) used by the target variable. An easy way to see the date format a variable uses is to look up your variable of interest in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar).

{: #authentication}
### Authentication

<b>IMPORTANT:</b> API keys are now required. To use the REST API, you must include a valid API key in all requests.

#### Use API keys

API keys are required in any REST API request. To include an API key, add your API key to the URL as a query parameter by appending <code>?key=<var>API_KEY</var></code>.

For GET requests, this looks like:

<pre>
https://api.datacommons.org/v2/endpoint?key=<var>API_KEY</var>
</pre>

If the key is not the first query parameter, use <code>&key=<var>API_KEY</var></code> instead. This looks like:

<pre>
https://api.datacommons.org/v2/endpoint?query=value&key=<var>API_KEY</var>
</pre>

For POST requests, pass the key as a header. For example, in cURL, this looks like:

<pre>
curl -X POST \
--url https://api.datacommons.org/v2/node \
--header 'X-API-Key: <var>API_KEY</var>' \
--data '{
  "nodes": [
    "entity_dcid_1",
    "entity_dcid_2",
    ...
  ],
  "property: "relation_expression"
}'
</pre>

#### Get API keys

We provide a trial API key for general public use. This key will let you try the API and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial Key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

<b>The trial key is capped with a limited quota for requests.</b> If you are planning on using our APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request one by
[filling out this form](https://docs.google.com/forms/d/e/1FAIpQLSeVCR95YOZ56ABsPwdH1tPAjjIeVDtisLF-8oDYlOxYmNZ7LQ/viewform) and selecting "API access" to request an official key without any quota limits. 

{: #pagination}
### Pagination

When the response to a request is too long, the returned payload is
**paginated**. Only a subset of the response is returned, along with a long string
of characters called a **token**. To get the next set of entries, repeat the
request with `nextToken` as an query parameter, with the token as its value.

For example, the request:

<pre>
curl --request GET \
  'https://api.datacommons.org/v2/node?key=<var>API_KEY</var>&nodes=geoId/06&property=<-*'
</pre>>

will return something like:

```json
{
  "data": {
    "geoId/06": {
      "arcs": < ... output truncated for brevity ...>
    },
  },
  "nextToken": "SoME_veRy_L0ng_S+rIng"
}
```

To get the next set of entries, repeat the previous command and append the `nextToken`:

```bash
curl --request GET \
  'https://api.datacommons.org/v2/node?key=<var>API_KEY</var>&nodes=geoId/06&property=<-*&nextToken=SoME_veRy_L0ng_S+rIng'
```

Similarly for POST requests, this would look like:

<pre>
curl -X POST \
-H "X-API-Key: <var>API_KEY</var>" \
--url https://api.datacommons.org/v2/node \
--data '{
  "nodes": "geoId/06",
  "property": "<-*",
  "nextToken": "SoME_veRy_L0ng_S+rIng"
</pre>

## Troubleshooting

### Common error responses

#### "Method does not exist"

```json
{
  "code": 5,
  "message": "Method does not exist.",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "service_control"
    }
  ]
}
```

This is most commonly seen when the endpoint is misspelled or otherwise malformed. Check the spelling of your endpoint and that all required path parameters are provided in the right order.

#### Missing API key

```json
{
 "code": 16,
 "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.",
 "details": [
  {
   "@type": "type.googleapis.com/google.rpc.DebugInfo",
   "stackEntries": [],
   "detail": "service_control"
  }
 ]
}
```

This is seen when your request is missing an API key. Please request your own API key.


#### "Invalid request URI"

```json
{
  "code": 3,
  "message": "Invalid request URI",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```

This is most commonly seen when your request is missing a required path parameter. Make sure endpoints and parameters are both spelled correctly and provided in the right order.

#### Empty response

```json
{}
```

Sometimes your query might return an empty result. This is most commonly seen when the value provided for a parameter is misspelled or doesn't exist. Make sure the values you are passing for parameters are spelled correctly.

#### Marshaling errors

```json
{
 "code": 13,
 "message": "grpc: error while marshaling: proto: Marshal called with nil",
 "details": [
  {
   "@type": "type.googleapis.com/google.rpc.DebugInfo",
   "stackEntries": [],
   "detail": "internal"
  }
 ]
}
```

This is most commonly seen when a query parameter is missing, misspelled or incorrect. Check the spelling of query parameters and ensure all required parameters are sent in the request.
