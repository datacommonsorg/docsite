---
layout: default
title: Node
nav_order: 3
parent: REST (v2)
grand_parent: API
published: true
---

# /v2/node

The Node API fetches node information for edges and neighboring nodes. This is useful for
finding local connections between nodes of the Data Commons knowledge graph.
More specifically, this API can perform the following tasks:
- Get all property labels associated with individual or multiple nodes.
- Get the values of a property for individual or multiple nodes. These can also
  be chained for multiple degrees in the graph.
- Get all connected nodes that are linked with invidiual or mutiple nodes.
Data Commons represents node relations as directed edges between nodes, or
property. The name of the property is a label, while the target node is the value of
the property. This endpoint returns the property labels and values that are
connected to the queried node.

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>DCID_LIST</var>&property=<var>RELATION_EXPRESSION</var>
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/node

Header:
X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI

JSON data:
{
  "nodes": [
      "<var>NODE_DCID_1</var>",
      "<var>NODE_DCID_2</var>",
      ...
    ],
  "property": "<var>RELATION_EXPRESSION</var>"
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Query parameters

| Name                                                  | Type   |  Description           |
| ----------------------------------------------------- | ------ | -----------------------|
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v2/getting_started.html#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag>    | list of strings | List of the [DCIDs](/glossary.html#dcid) of the nodes to query. |
| property <br /> <required-tag>Required</required-tag> | string | Property to query, represented with symbols including arrow notation. For more details, see the [Data Commons REST (v2) API overview](/api/rest/v2/index.html#relation-expressions). By using different `property` parameters, you can query node information in different ways, such as getting the edges and neighboring node values. Examples below show how to request this information for one or multiple nodes.   |

{: .doc-table }

## Response

The response looks like:

<pre>
{
  "data": {
    "<var>NODE_DCID</var>": {
      "arcs": {
        "<var>LABEL</var>": {
          "nodes": [
            ...
          ]
        }
        ...
      },
      "properties": [
        "<var>VALUE</var>",
      ],
    }
  }
  "nextToken": "<var>TOKEN_STRING</var>"
}
</pre>
{: .response-signature .scroll}

### Response fields

| Name      | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| data      | object | Data of the property label and value information, keyed by the queried nodes |
| nextToken | string | A token used to query [next page of data](index.md#pagination)                   |
{: .doc-table}

## Examples

### Example 1: Get all incoming arcs for a given node

Get all incoming arcs of the node with DCID `geoId/06` by querying all properties with the `<-` symbol. This returns just the property labels.

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

### Example 2: Get one property for a given node

Get a `name` property for a given node with DCID `dc/03lw9rhpendw5` by querying the `->name` symbol.

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


{: #multiple-properties}
### Example 3: Get multiple property values for multiple nodes

Get `name`, `latitude`, and `longitude` values for several nodes: `geoId/06085`
and `geoId/06087`. Note that multiple properties for a given node must be
enclosed in square brackets `[]`.

Parameters:
{: .example-box-title}

```bash
nodes: "geoId/06085", "geoId/06087"
property: "->[name, latitude, longitude]"
```

Request:
{: .example-box-title}

```json
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["geoId/06085", "geoId/06087"], "property": "->[name, latitude, longitude]"}'
```

Response:
{: .example-box-title}

```json

   "data" : {
      "geoId/06085" : {
         "arcs" : {
            "latitude" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "37.221614"
                  },
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "37.36"
                  }
               ]
            },
            "longitude" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "-121.68954"
                  },
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "-121.97"
                  }
               ]
            },
            "name" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "Santa Clara County"
                  }
               ]
            }
         }
      },
      "geoId/06087" : {
         "arcs" : {
            "latitude" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "37.012347"
                  },
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "37.03"
                  }
               ]
            },
            "longitude" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "-122.007789"
                  },
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "-122.01"
                  }
               ]
            },
            "name" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "Santa Cruz County"
                  }
               ]
            }
         }
      }
   }
}

```
{: .example-box-content .scroll}


{: #wildcard}
### Example 4: Get all incoming linked nodes for a node

Get all the incoming linked nodes for node `PowerPlant`, using `<-*`. Note that, unlike example 1, this query returns the actual property values, not just their labels.

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
        }
        "subClassOf" : {
          "nodes" : [
            {
              "dcid" : "PowerPlantUnit",
              "name" : "PowerPlantUnit",
              "provenanceId" : "dc/base/BaseSchema",
              "types" : [
                "Class"
              ]
            }
          ]
        },
        "typeOf" : {
          "nodes" : [
            {
              "dcid" : "dc/000qxlm93vn93",
              "name" : "Suzlon Project VIII LLC",
              "provenanceId" : "dc/base/EIA_860",
              "types" : [
                "PowerPlant"
              ]
           },
          ...
        },
        ...
      }
    }
  },
  "nextToken": "H4sIAAAAAAAA/0zIMQ6CMBjFcfus9fnpYP4Xs4MXYCgTAUKaEG7PyvqLf0Rd9rbVaZh7lH6s7TdejRtyQhbyHTkjP5AL8hPZyC/kQH6T/fmmEwAA//8BAAD///dHSrJWAAAA"
}
```
{: .example-box-content .scroll}