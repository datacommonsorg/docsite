---
layout: default
title: Node
nav_order: 0
parent: REST (v2)
grand_parent: API
published: false
permalink: /api/rest/v2/node
---

# /v2/node

Fetches node information for edges and neighboring nodes. This is useful for
finding local connections between nodes of the Data Commons knowledge graph.
More specifically, this API can perform the following tasks:

- Get all property labels associated with individual or multiple nodes.
- Get the values of a property for individual or multiple nodes. These can also
  be chained for multiple degrees in the graph.
- Get all connected nodes that are linked with invidiual or mutiple nodes.

Data Commons represents node relations as directed edges between nodes, or
property. The name of the property is label, while the target node is a value of
the property. This endpoint returns the property labels and values that are
connected to the queried node.

The REST (v2) API introduces relation expressions in the API syntax to represent
neighboring nodes, and to support chaining and filtering. For more information
see Data Commons REST (v2) API Overview.

_Note: For filtering, this API currently only supports the `containedInPlace`
property to fetch multiple `Place` nodes. Support for more properties and node
types will be added in the future._

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET Request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST Request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v2/node?key={your_api_key}&nodes={DCID}&property={PROPERTY}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/node

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "nodes": [
      "{value_1}",
      "{value_2}",
      ...
    ],
  "property": "{property_expression}"
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Query Parameters

| Name                                                  | Type   | Description                                                                                                                                                     |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag>    | string | [DCIDs](/glossary.html#dcid) of the nodes to query.                                                                                                             |
| property <br /> <required-tag>Required</required-tag> | string | Property to query, represented with symbols including arrow notation. For more details, see Data Commons REST (v2) API Overview.                                |
{: .doc-table }

By using different “property” parameters, you can query node information in
different ways such as getting the edges and neighboring node values. Notice
that the “property parameter” should follow the syntax section (reference).
You can also request this information for one or multiple nodes, as demonstrated
in the following examples.

## Response

The response looks like:

```json
{
  "data": {
    "{node_DCID}": {
      "arcs": {
        "{label}": {
          "nodes": [
            ...
          ]
        }
        ...
      },
      "properties": [
        "{value}",
      ],
    }
  }
  "nextToken": "{token_string}"
}
```

### Response fields

| Name      | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| data      | object | Data of the property label and value information, keyed by the queried nodes |
| nextToken | string | [Pagination] A token used to query next page of data                         |
{: .doc-table}

## Examples

### Example 1: All "in" Properties for a Given Node

Get the properties of the node with DCID `geoId/06` by querying all in
properties with the `<-` symbol.

Parameters:
{: .example-box-title}

```bash
nodes: "geoId/06"
property: "<-"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId/06&property=<-'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "geoId/06": {
      "properties": [
        "affectedPlace",
        "containedInPlace",
        "location",
        "member",
        "overlapsWith"
      ]
    }
  }
}
```
{: .example-box-content .scroll}

### Example 2: Get One Property for a Given Node

Get a `name` property for a given node with DCID `dc/03lw9rhpendw5` by querying the
`->name` symbol.

Parameters:
{: .example-box-title}

```bash
nodes: "dc/03lw9rhpendw5"
property: "->name"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=dc/03lw9rhpendw5&property=->name'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "dc/03lw9rhpendw5": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/EIA_860",
              "value": "191 Peachtree Tower"
            }
          ]
        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

### Example 3: Get Multiple Property Values for Multiple Nodes

Get `name`, `latitude`, and `longitude` value for several nodes: `geoId/06085`
and `geoId/06086`. Note that multiple properties for a given node must be
enclosed in square brackets `[]`.

Parameters:
{: .example-box-title}

```bash
nodes: "geoId/06085", "geoId/06086"
property: "->[name, latitude, longitude]"
```

Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["geoId/06085", "geoId/06086"], "property": "->[name, latitude, longitude]"}'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "geoId/06085": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "Santa Clara County"
            }
          ]
        },
        "latitude": {
          "nodes": [
            { "provenanceId": "dc/base/WikidataOtherIdGeos", "value": "37.36" }
          ]
        },
        "longitude": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "-121.68954"
            }
          ]
        }
      }
    },
    "geoId/06087": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "Santa Cruz County"
            }
          ]
        },
        "latitude": {
          "nodes": [
            { "provenanceId": "dc/base/WikidataOtherIdGeos", "value": "37.03" }
          ]
        },
        "longitude": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "-122.01"
            }
          ]
        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

### Example 4: "In" Triples for a Node

Get the `in` triples for node `PowerPlant` with property `<-*`.

Parameters:
{: .example-box-title}

```bash
nodes: "PowerPlant"
property: "<-*"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=PowerPlant&property=<-*'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "PowerPlant": {
      "arcs": {
        "domainIncludes": {
          "nodes": [
            {
              "types": [
                "Property"
              ],
              "dcid": "ashImpoundmentStatus",
              "provenanceId": "dc/base/BaseSchema"
            },
            ...
          ],
        },
        ...
      },
    },
  },
  "nextToken": "{token_string}"
}
```
{: .example-box-content .scroll}