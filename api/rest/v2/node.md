---
layout: default
title: Get node properties
nav_order: 13
parent: REST (V2)
grand_parent: API - Query data programmatically
published: true
---

# /v2/node

Data Commons represents node relations as directed edges between nodes, or
_properties_. The name of the property is a _label_, while the target node is the _value_ of
the property. The Node API returns the property labels and values that are
connected to the queried node. This is useful for
finding local connections between nodes of the Data Commons knowledge graph.

More specifically, this API can perform the following tasks:
- Get all property labels associated with individual or multiple nodes.
- Get the values of a property for individual or multiple nodes. These can also
  be chained for multiple hops in the graph.
- Get all connected nodes that are linked with individual or multiple nodes.

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
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the section on [authentication](/api/rest/v2/index.html#authentication) for details. |
| nodes <br /> <required-tag>Required</required-tag>    | list of strings | List of the [DCIDs](/glossary.html#dcid) of the nodes to query. |
| property <br /> <required-tag>Required</required-tag> | string | Property to query, represented with symbols including arrow notation. For more details, see [relation expressions](/api/rest/v2/#relation-expressions). By using different `property` parameters, you can query node information in different ways, such as getting the edges and neighboring node values. Examples below show how to request this information for one or multiple nodes.   |

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
| nextToken | string | A token used to query [next page of data](/api/rest/v2/index.html#pagination) |
{: .doc-table}

## Examples

### Example 1: Get all incoming arc labels for a given node

Get all incoming arc property labels of the node with DCID `geoId/06` by querying all properties with the `<-` symbol. This returns just the property labels but not the property values.

Parameters:
{: .example-box-title}

```bash
nodes: "geoId/06"
property: "<-"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId%2F06&property=%3C-'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["geoId/06"], "property": "<-"}'
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

### Example 2: Get one property for a given node

Get a `name` property for a given node with DCID `dc/03lw9rhpendw5` by querying the `->name` symbol.

Parameters:
{: .example-box-title}

```bash
nodes: "dc/03lw9rhpendw5"
property: "->name"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=dc%2F03lw9rhpendw5&property=-%3Ename'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["dc/03lw9rhpendw5"], "property": "->name"}'
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

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId%2F06085&nodes=geoId%2F06087&property=-%3E%5Bname,%20latitude,%20longitude%5D'

```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["geoId/06085", "geoId/06087"], "property": "->[name, latitude, longitude]"}'
```

Response:
{: .example-box-title}

```json
{
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
### Example 4: Get all incoming arc values for a node

Get all the incoming linked nodes for node `PowerPlant`, using `<-*`. Note that, unlike example 1, this query returns the actual property values, not just their labels. 

Also note that the response contains a `nextToken`, so you need to send additional requests with the continuation tokens to get all the data.

Parameters:
{: .example-box-title}

```bash
nodes: "PowerPlant"
property: "<-*"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=PowerPlant&property=%3C-%2A'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["PowerPlant"], "property": "<-*"}'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "PowerPlant": {
      "arcs": {
        "subClassOf": {
          "nodes": [
            {
              "name": "PowerPlantUnit",
              "types": [
                "Class"
              ],
              "dcid": "PowerPlantUnit",
              "provenanceId": "dc/base/BaseSchema"
            }
          ]
        },
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
          "nodes": [
            {
              "name": "Suzlon Project VIII LLC",
              "types": [
                "PowerPlant"
              ],
              "dcid": "dc/000qxlm93vn93",
              "provenanceId": "dc/base/EIA_860"
            },
            {
              "name": "NYC-HH - CONEY ISLAND HOSPITAL",
              "types": [
                "PowerPlant"
              ],
              "dcid": "dc/002x855kf3wv3",
              "provenanceId": "dc/base/EIA_860"
            },
            {
              "name": "Bridgeport Gas Processing Plant",
              "types": [
                "PowerPlant"
              ],
              "dcid": "dc/0053j61z19gn6",
              "provenanceId": "dc/base/EIA_860"
            },
            {
              "name": "Hennepin Island",
              "types": [
                "PowerPlant"
              ],
              "dcid": "dc/005r26ht43r1f",
              "provenanceId": "dc/base/EIA_860"
            },
            {
              "name": "Bountiful City",
              "types": [
                "PowerPlant"
              ],
              "dcid": "dc/006cgl79w0bj9",
              "provenanceId": "dc/base/EIA_860"
           } ...
          ]
        },
        "domainIncludes": {
          "nodes": [
            {
              "types": [
                "Property"
              ],
              "dcid": "ashImpoundmentStatus",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "co2Mass",
              "types": [
                "Property"
              ],
              "dcid": "co2Mass",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "co2Rate",
              "types": [
                "Property"
              ],
              "dcid": "co2Rate",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "eiaPlantCode",
              "types": [
                "Property"
              ],
              "dcid": "eiaPlantCode",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "types": [
                "Property"
              ],
              "dcid": "fercCogenerationDocketNumber",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "types": [
                "Property"
              ],
              "dcid": "fercExemptWholesaleGeneratorDocketNumber",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "types": [
                "Property"
              ],
              "dcid": "fercSmallPowerProducerDocketNumber",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "types": [
                "Property"
              ],
              "dcid": "fercStatus",
              "provenanceId": "dc/base/BaseSchema"
            } ...
          ]
        }
      }
    }
  },
  "nextToken": "H4sIAAAAAAAA/0zIMQ6CMBjFcfus9fnpYP4Xs4MXYCgTAUKaEG7PyvqLf0Rd9rbVaZh7lH6s7TdejRtyQhbyHTkjP5AL8hPZyC/kQH6T/fmmEwAA//8BAAD///dHSrJWAAAA"
}
```
{: .example-box-content .scroll}

### Example 5: Get a list of all existing statistical variables

Get all incoming linked nodes of node `StatisticalVariable`, with the `typeof` property. Since `StatisticalVariable` is a top-level entity, or entity type, this effectively gets all statistical variables.

Also note that the response contains a `nextToken`, so you need to send additional requests with the continuation tokens to get all the data.

Parameters:
{: .example-box-title}

```bash
nodes: "StatisticalVariable"
property: "<-typeOf"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=StatisticalVariable&property=%3C-typeOf'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["StatisticalVariable"], "property": "<-typeOf"}'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "StatisticalVariable": {
      "arcs": {
        "typeOf": {
          "nodes": [
            {
              "name": "Max Temperature (Difference Relative To Base Date): Relative To 1990, Highest Value, Median Across Models",
              "types": [
                "StatisticalVariable"
              ],
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate1990_Max_Temperature",
              "provenanceId": "dc/base/HumanReadableStatVars"
            },
            {
              "name": "Max Temperature (Difference Relative To Base Date): Relative To Between 2006 And 2020, Based on RCP 4.5, Highest Value, Median Across Models",
              "types": [
                "StatisticalVariable"
              ],
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006To2020_Max_Temperature_RCP45",
              "provenanceId": "dc/base/HumanReadableStatVars"
            },
            {
              "name": "Max Temperature (Difference Relative To Base Date): Relative To Between 2006 And 2020, Based on RCP 8.5, Highest Value, Median Across Models",
              "types": [
                "StatisticalVariable"
              ],
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006To2020_Max_Temperature_RCP85",
              "provenanceId": "dc/base/HumanReadableStatVars"
            },
            {
              "name": "Max Temperature (Difference Relative To Base Date): Relative To 2006, Based on RCP 4.5, Highest Value, Median Across Models",
              "types": [
                "StatisticalVariable"
              ],
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006_Max_Temperature_RCP45",
              "provenanceId": "dc/base/HumanReadableStatVars"
            },
            {
              "name": "Max Temperature (Difference Relative To Base Date): Relative To 2006, Based on RCP 8.5, Highest Value, Median Across Models",
              "types": [
                "StatisticalVariable"
              ],
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006_Max_Temperature_RCP85",
              "provenanceId": "dc/base/HumanReadableStatVars"
            }...
          ]
        }
      }
    }
  },
  "nextToken": "H4sIAAAAAAAA/2zJsQ6CMBQFUHut9fp0MNcPcyBhf5CSNOlA4C38PT/AfGyx3xAebY82ex99az71aiWOtf6vUTdlpm8SCIF3gVngQ2AR+BRIgS+BJvAt8HMCAAD//wEAAP//522gCWgAAAA="
}
```
{: .example-box-content .scroll}

### Example 6: Get a list of all existing entity types

Get all incoming linked nodes of node `Class`, with the `typeof` property. Since `Class` is the top-level entity in the knowledge graph, getting all directly linked nodes effectively gets all entity types.

Also note that the response contains a `nextToken`, so you need to send additional requests with the continuation tokens to get all the data.

Parameters:
{: .example-box-title}

```bash
nodes: "Class"
property: "<-typeOf"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
  'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Class&property=%3C-typeOf'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/node \
  -d '{"nodes": ["Class"], "property": "<-typeOf"}'
```

Response:
{: .example-box-title}

```json
{
  "data": {
    "Class": {
      "arcs": {
        "typeOf": {
          "nodes": [
            {
              "name": "ACLGroup",
              "types": [
                "Class"
              ],
              "dcid": "ACLGroup",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "ACSEDChild",
              "types": [
                "Class"
              ],
              "dcid": "ACSEDChild",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "ACSEDParent",
              "types": [
                "Class"
              ],
              "dcid": "ACSEDParent",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "APIReference",
              "types": [
                "Class"
              ],
              "dcid": "APIReference",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "AboutPage",
              "types": [
                "Class"
              ],
              "dcid": "AboutPage",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "AcademicAssessmentEvent",
              "types": [
                "Class"
              ],
              "dcid": "AcademicAssessmentEvent",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "AcademicAssessmentTypeEnum",
              "types": [
                "Class"
              ],
              "dcid": "AcademicAssessmentTypeEnum",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "AcceptAction",
              "types": [
                "Class"
              ],
              "dcid": "AcceptAction",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "Accommodation",
              "types": [
                "Class"
              ],
              "dcid": "Accommodation",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "AccountingService",
              "types": [
                "Class"
              ],
              "dcid": "AccountingService",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "AchieveAction",
              "types": [
                "Class"
              ],
              "dcid": "AchieveAction",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "Action",
              "types": [
                "Class"
              ],
              "dcid": "Action",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "ActionStatusType",
              "types": [
                "Class"
              ],
              "dcid": "ActionStatusType",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "ActivateAction",
              "types": [
                "Class"
              ],
              "dcid": "ActivateAction",
              "provenanceId": "dc/base/BaseSchema"
            }...
          ]
        }
      }
    }
  },
  "nextToken": "H4sIAAAAAAAA/yzHsQ5EQBiF0Z27O7PXTyFf5X20Es+goFJIRuPtRaI7J6bI477UGuW8jnXe3vKhOPVp+CEL+Yv8OCMX5D+ykRvkQG6RuxsAAP//AQAA//8tG+Q2TgAAAA=="
}         
```
{: .example-box-content .scroll}