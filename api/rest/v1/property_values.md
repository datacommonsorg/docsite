---
layout: default
title: Property Values
nav_order: 4
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/property/values
---

# /v1/property/values

Get the values of a [property](/glossary.html#property) for a specific node.

Data Commons represents properties as labels of directed edges between nodes,
where the successor node is a value of the property. Thus, this endpoint returns
nodes connected to the queried node via the property queried.

_Note: If you want to query values for the property `containedInPlace`, consider
using [/v1/property/values/linked](/api/rest/v1/property/values/in/linked)
instead._

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To get a list of properties available for an node, see [/v1/properties](/api/rest/v1/properties).<br />
    To query multiple entites or properties, see the [bulk version](/api/rest/v1/bulk/property/values) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
http://api.datacommons.org/v1/property/values/{EDGE_DIRECTION}/{NODE}/{PROPERTY}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. <br /><br />If `in`, returns nodes for which the queried node is a property value. If `out`, returns values of properties describing the node queried. |
| NODE <br /> <required-tag>Required</required-tag>         | [DCID](/glossary.html#dcid) of the node to query.                                                                                                                              |
| PROPERTY <br /> <required-tag>Required</required-tag>       | [DCID](/glossary.html#dcid) of the property to query.                                                                                                                            |
{: .doc-table }

### Query Parameters

| Name                                             | Type   | Description                                                                                                                                                     |
| ------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag> | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
{: .doc-table }

## Response

The response looks like:

```json
{
  "values":
  [
    {
      "property_1_of_connected_node": "value",
      "property_2_of_connected_node": "value",
      ...
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name   | Type   | Description                                             |
| ------ | ------ | ------------------------------------------------------- |
| values | object | values of the property queried, for the node queried. |
{: .doc-table}

## Examples

### Example 1: Get the value of a property for an node

Get the name of the node with DCID `geoId/sch3620580` by querying the property
`name`.

Request:
{: .example-box-title}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/property/values/out/geoId/sch3620580/name?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "values": [
    {
      "provenanceId": "dc/sm3m2w3",
      "value": "New York City Department Of Education"
    }
  ]
}
```
{: .example-box-content .scroll}

### Example 2: Get the nodes that have the queried node as a property value

Get a list of natural disasters in Madagascar (DCID: `country/MDG`) by querying
the property `affectedPlace`.

Request:
{: .example-box-title}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/property/values/in/country/MDG/affectedPlace?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "values":
  [
    {
      "name": "Unnamed SouthIndian Cyclone (1912324S11066)",
      "types":
      [
        "CycloneEvent"
      ],
      "dcid": "cyclone/ibtracs_1912324S11066",
      "provenanceId": "dc/xwq0y5"
    },
    {
      "name": "Unnamed SouthIndian Cyclone (1913022S12053)",
      "types":
      [
        "CycloneEvent"
      ],
      "dcid": "cyclone/ibtracs_1913022S12053",
      "provenanceId": "dc/xwq0y5"
    },
    < ... output  truncated for brevity ... >
    {
      "name": "32 km SSE of Maroantsetra, Madagascar",
      "types":
      [
        "EarthquakeEvent"
      ],
      "dcid": "earthquake/usp000h6zw",
      "provenanceId": "dc/xz8ndk3"
    },
    {
      "name": "23 km ENE of Amparafaravola, Madagascar",
      "types":
      [
        "EarthquakeEvent"
      ],
      "dcid": "earthquake/usp000jgbb",
      "provenanceId": "dc/xz8ndk3"
    }
  ]
}
```
{: .example-box-content .scroll}
