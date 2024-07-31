---
layout: default
title: Getting started
nav_order: 0
parent: REST (v2)
grand_parent: API
published: true
---

{:.no_toc}
# Getting started

* TOC
{:toc}

Following HTTP, a REST API call consists of a _request_ that you provide, and a _response_ from the Data Commons servers with the data you requested, in [JSON](https://json.org) format. The following sections detail how to assemble a request.

## Service endpoints

You make requests through [API endpoints](https://en.wikipedia.org/wiki/Web_API#Endpoints). You access each endpoint using its unique URL, which is a combination of a base URL and the endpoint's [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier).

The base URL for all REST endpoints is:

<pre>
https://api.datacommons.org/<var>VERSION</var>
</pre>

The current version is `v2`.

To access a particular endpoint, append the URI to the base URL (e.g. `https://api.datacommons.org/v2/node` ).
The URIs for the V2 API are below:

| API | URI path | Description |
| --- | --- | ----------- |
| Node | [/node](/api/rest/v2/node) | Fetches information about edges and neighboring nodes |
| Observation | [/observation](/api/rest/v2/observation) | Fetches statistical observations |
| Resolve entities | [/resolve](/api/rest/v2/resolve) | Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph |
| SPARQL | [/v2/sparql](/sparql) | Returns matches to a [SPARQL](https://www.w3.org/TR/rdf-sparql-query/) graph query |

## Query parameters

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

API keys are required in any REST API request. To obtain an API key, please see [Get API key](/api//rest/v2/index.html#get-key).

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

{: #pagination}
## Pagination

When the response to a request is too long, the returned payload is
_paginated_. Only a subset of the response is returned, along with a long string
of characters called a _token_. To get the next set of entries, repeat the
request with `nextToken` as an query parameter, with the token as its value.

For example, the request:

```bash
curl --request GET \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId/06&property=<-*'
```

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
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId/06&property=<-*&nextToken=SoME_veRy_L0ng_S+rIng'
```

Similarly for POST requests, this would look like:

```bash
curl -X POST \
-H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
--url https://api.datacommons.org/v2/node \
--data '{
  "nodes": "geoId/06",
  "property": "<-*",
  "nextToken": "SoME_veRy_L0ng_S+rIng"
}'
```

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
| `+` | One or more expressions chained together for indirect relationships, like `containedInPlace+{typeOf:City}` |

### Incoming and outgoing arcs

Arcs in the Data Commons Graph have directions. In the example below, for the node [Argentina](https://datacommons.org/browser/country/ARG), the property `containedInPlace` exists in both in and out directions, illustrated in the following figure:

![](/assets/images/rest/property_value_direction_example.png)

Note the directionality of the property `containedInPlace`: incoming arc represents "Argentina contains Buenos Aires", while the outgoing arc represents "Argentina is in South America".*

Nodes for outgoing arcs are represented by `->`, while nodes for incoming arcs
arcs are represented by `<-`. To illustrate using the above example:

- Regions that include Argentina (DCID: `country/ARG`): `country/ARG->containedInPlace`
- All cities directly contained in Argentina (DCID: `country/ARG`): `country/ARG<-containedInPlace{typeOf:City}`

### Filters

You can use filters to reduce results to only match nodes with a specified property and value. Use {} to specify property:value pairs to define the filter. Using the same example, `country/ARG<-containedInPlace+{typeOf:City}` only returns nodes with the `typeOf:City`, filtering out `typeOf:AdministrativeArea1` and so on.

### Specify multiple properties

You can combine multiple properties together within `[]`. For example, to request a few outgoing arcs for a node, use
`->[name, latitude, longitude]`. See more in this [Node API example](/api/rest/v2/node.html#multiple-properties)).

### Wildcard

To retrieve all properties linked to a node, use the `*` wildcard, e.g. `<-*`.
See more in this [Node API example](/api/rest/v2/node.html#wildcard).

### Chain properties

Use `+` to express a chain expression. A chain expression represents requests for information about nodes
which are connected by the same property, but are a few hops away. This is supported only for the `containedInPlace` property.

To illustrate again using the Argentina example:
- All cities directly contained in Argentina (dcid: `country/ARG`): `country/ARG<-containedInPlace{typeOf:City}`
- All cities indirectly contained in Argentina (dcid: `country/ARG`): `country/ARG<-containedInPlace+{typeOf:City}`

## Escape codes for reserved characters in GET requests

HTTP GET requests do not allow some of the characters used by Data Commons DCIDs and relation expressions. When sending GET requests, you may need use the [corresponding percent codes](https://en.wikipedia.org/wiki/Percent-encoding) for reserved characters. 