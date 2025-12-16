---
layout: default
title: REST (V2)
nav_order: 1
parent: API - Query data programmatically
has_children: true
published: true
redirect_from: 
   /api/rest/v1/getting_started
   /api/rest/index
   /api/rest/v1/index
---

{:.no_toc}
# Data Commons REST API V2

* TOC
{:toc}

## Overview

The Data Commons REST API is a
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer){: target="_blank"} library
that enables developers to programmatically access data in the Data Commons
knowledge graph, using [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods){: target="_blank"}. This allows you to explore the structure of the
graph, integrate statistics from the graph into data analysis applications and
much more.

Following HTTP, a REST API call consists of a _request_ that you provide, and a _response_ from the Data Commons servers with the data you requested, in [JSON](https://json.org){: target="_blank"} format. You can use the REST API with any tool or language that supports HTTP. You can make queries on the command line (e.g. using [cURL](https://curl.se/){: target="_blank"}), by scripting HTTP requests in another language like Javascript, or even by entering an endpoint into your web browser!

## Service endpoints

You make requests through [API endpoints](https://en.wikipedia.org/wiki/Web_API#Endpoints){: target="_blank"}. You access each endpoint using its unique URL, which is a combination of a base URL and the endpoint's [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier){: target="_blank"}.

The base URL for all REST endpoints is:

<pre>
https://api.datacommons.org/<var>VERSION</var>
</pre>

The current version is `v2`.

To access a particular endpoint, append the URI to the base URL, e.g. `https://api.datacommons.org/v2/node`.

The URIs for the V2 API are below:

| API | URI path | Description |
| --- | --- | ----------- |
| Observation | [/observation](/api/rest/v2/observation) | Fetches statistical observations |
| Node | [/node](/api/rest/v2/node) | Fetches information about edges and neighboring nodes |
| Resolve entities | [/resolve](/api/rest/v2/resolve) | Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph |
| SPARQL | [/v2/sparql](/sparql) | Returns matches to a [SPARQL](https://www.w3.org/TR/rdf-sparql-query/){: target="_blank"} graph query |

### Base URL for custom instances

If you are running your own Data Commons, the base URL is slightly different:

<pre>
<var>CUSTOM_URL</var>/core/api/v2/
</pre>

For example, for a publicly available instance:

```
https://datacommons.one.org/core/api/v2/
```

For a locally running instance:

```
https://localhost:8080/core/api/v2/
```

Endpoints are the same as above; append the URI to the base URL, e.g. `https://localhost:8080/core/api/v2/node`.

## Query parameters {#query-param}

Endpoints take a set of parameters which allow you to specify the entities, variables, timescales, etc. you are interested in. The V2 APIs only use query parameters.

Query parameters are chained at the end of a URL behind a `?` symbol. Separate multiple parameter entries with an `&` symbol. For example, this would look like:

<pre>
https://api.datacommons.org/v2/node?key=<var>API_KEY</var>&nodes=<var>DCID1</var>&nodes=<var>DCID2</var>&property=<-*
</pre>

Still confused? Each endpoint's documentation page has examples at the bottom tailored to the endpoint you're trying to use.

## POST requests

All V2 endpoints allow for POST requests. For POST requests, feed all parameters in JSON format. For example, in cURL, this would look like:

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

{: #authentication}
## Authentication

All access to the base Data Commons (datacommons.org) using the REST APIs must be authenticated and authorized with an API key.

We provide a trial API key for general public use. This key will let you try the API and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

_The trial key is capped with a limited quota for requests._ If you are planning on using our APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request an official key without any quota limits; please see [Obtain an API key](/api/index.html#get-key) for information.

> **Note:** If you are sending API requests to a custom Data Commons instance, do _not_ include any API key in the requests.

To include an API key, add your API key to the URL as a query parameter by appending <code>?key=<var>API_KEY</var></code>.

For GET requests, this looks like:

<pre>
https://api.datacommons.org/v2/<var>ENDPOINT</var>?key=<var>API_KEY</var>
</pre>

If the key is not the first query parameter, use <code>&key=<var>API_KEY</var></code> instead. This looks like:

<pre>
https://api.datacommons.org/v2/<var>ENDPOINT</var>?<var>QUERY</var>=<var>VALUE</var>&key=<var>API_KEY</var>
</pre>

For POST requests, pass the key as a header. For example, in cURL, this looks like:

<pre>
curl -X POST \
--url https://api.datacommons.org/v2/node \
--header 'X-API-Key: <var>API_KEY</var>' \
--data '{
  "nodes": [
    "<var>ENTITY_DCID_1</var>",
    "<var>ENTITY_DCID_2</var>",
    ...
  ],
  "property: "<var>RELATION_EXPRESSION</var>"
}'
</pre>

## Find available entities, variables, and their DCIDs

Many requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. For tips on how to find relevant DCIDs, entities and variables, please see the [Key concepts](/data_model.html) document, specifically the following sections:

- [Find a DCID for an entity or variable](/data_model.html#find-dcid)
- [Find places available for a statistical variable](/data_model.html#find-places)

{: #relation-expressions}
## Relation expressions

Data Commons represents real world entities and data as nodes. These
nodes are connected by directed edges, or arcs, to form a knowledge graph. The
label of the arc is the name of the [property](/glossary.html#property).

Relation expressions include arrow annotation and other symbols in the syntax to
represent neighboring nodes, and to support chaining and filtering.
These new expressions allow all of the functionality of the V1 API to be
expressed with fewer API endpoints in V2. All V2 API calls require relation
expressions in the `property` or `expression` parameter.

The following table describes symbols in the V2 API relation expressions:

| ------ | ---------- |
| `->` | An outgoing arc |
| `<-` | An incoming arc |
| <code>{<var>PROPERTY</var>:<var>VALUE</var>}</code> | Filtering; identifies the property and associated value |
| `[]` | Multiple properties, separated by commas |
| `*` | All properties linked to this node |
| `+` | Allows arcs from nodes not directly connected, i.e. can be several hops away. Only supported for the `containedInPlace` property. |

### Incoming and outgoing relations

Relations ("arcs") in the Data Commons Graph have directions. In the example below, for the node [Argentina](https://datacommons.org/browser/country/ARG){: target="_blank"}, the property `containedInPlace` exists in both in and out directions, illustrated in the following figure:

![](/assets/images/rest/property_value_direction_example.png)

Note the directionality of the property `containedInPlace`: the incoming relation represents "Argentina contains Buenos Aires", while the outgoing relation represents "Argentina is in South America".

Nodes for outgoing relations are represented by `->`. Nodes for incoming relations are represented by `<-`. To illustrate using the above example:

- Regions that include Argentina (DCID: `country/ARG`): `country/ARG->containedInPlace`
- All cities contained in Argentina (DCID: `country/ARG`): `country/ARG<-containedInPlace+{typeOf:City}`

### Specify multiple properties

You can combine multiple properties together within `[]`. For example, to request a few outgoing arcs for a node, use
`->[name, latitude, longitude]`. See more in this [Node API example](/api/rest/v2/node.html#multiple-properties)).

### Filters

V2 supports limited filtering of result candidates. Currently the only support is to restrict candidates by entity type. The format of this filter (for non-SPARQL queries) is:

<pre>
{typeOf:<var>VALUE</var>}
</pre>

Here are the contexts where this filter is currently supported:

| API | Context  | Use |
|-----|--------------------------------------|-------------|
| Node and Observation | Incoming property `<-containedInPlace+`  | Return entities of the specified type, that are contained in the selected place entity (or entities). **Note:** the `+` character is required between the property and filter. |
| Resolve entity | Incoming properties `<-description` <br />`<-wikiId` <br /> `<-geoCoordinate` | Return entities of the specified type, that match a selected name, wiki ID, or geocoordinate. |
| SPARQL | In a `WHERE` clause, for any entity being queried | Return only entities of the specified type. |

See the endpoint pages for examples.

The Observation endpoint supports additional filters for provenances and facets. See the [Observation page](observation.md) for details. 

### Wildcard

To retrieve all properties linked to a node, use the `*` wildcard, e.g. `<-*`.
See more in this [Node API example](/api/rest/v2/node.html#wildcard).


{: #url-encode}
## URL-encoding reserved characters in GET requests

HTTP GET requests do not allow some of the characters used by Data Commons DCIDs and relation expressions. When sending GET requests, you may need to use the [corresponding percent codes](https://en.wikipedia.org/wiki/Percent-encoding){: target="_blank"} for reserved characters. For example, a query string such as the following:

```
https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId/06&property=<-*
```
 should be encoded as:

```
https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId%2F06&property=%3C-%2A
```

Although sometimes the original characters may work, it's safest to always encode them.

> **Tip:** Don't URL-encode delimiters between parameters (`&`), separators between parameter names and values  (`=`), or `-`. 

See [https://www.w3schools.com/tags/ref_urlencode.ASP](https://www.w3schools.com/tags/ref_urlencode.ASP){: target="_blank"} for a handy reference.

{: #pagination}
## Pagination

When the response to a request is too long, the returned payload is
_paginated_. Only a subset of the response is returned, along with a long string
of characters called a _token_. To get the next set of entries, repeat the
request with `nextToken` as an query parameter, with the token as its value.

For example, the request:

```bash
curl --request GET \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId%2F06&property=%3C-%2A'
```

will return something like:

```jsonc
{
  "data": {
    "geoId/06": {
      "arcs": // ... output truncated for brevity ...
    },
  },
  "nextToken": "SoME_veRy_L0ng_STrIng"
}
```

To get the next set of entries, repeat the previous command and append the `nextToken`:

```bash
curl --request GET \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId%2F06&property=%3C-%2A&nextToken=SoME_veRy_L0ng_STrIng'
```

Similarly for POST requests, this would look like:

```bash
curl -X POST \
-H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
--url https://api.datacommons.org/v2/node \
--data '{
  "nodes": "geoId/06",
  "property": "<-*",
  "nextToken": "SoME_veRy_L0ng_STrIng"
}'
```
You must [URL-encode](#url-encode) any special characters that appear in the string.
