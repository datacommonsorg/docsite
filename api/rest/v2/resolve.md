---
layout: default
title: Resolve entities
nav_order: 4
parent: REST (V2)
grand_parent: API - Query data programmatically
published: true
---
{: .no_toc}
# /v2/resolve

* TOC
{:toc}

The Resolve API returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph.
Each entity in Data Commons has an associated `DCID` which is used to refer to it
in other API calls or programs. An important step for a Data Commons developer is to
identify the DCIDs of entities they care about. This API searches for an entry in the
Data Commons knowledge graph based on certain properties and returns the DCIDs of matches. 

Note that you can only resolve entities by some terminal properties. You cannot resolve properties that represent linked entities with incoming or outgoing arc relationships. For that, you need to use the [Node](node.md) API. For example, if you wanted to get all the DCIDs of entities that are related to a given entity by the `containedInPlace` property (say, all states in the United States), use the Node API.

> **Note**: Currently, this endpoint only supports [place](/glossary.html#place) entities.

> **IMPORTANT:**
   This endpoint relies on name-based geocoding and is prone to inaccuracies.
   One common pattern is ambiguous place names that exist in different
   countries, states, etc. For example, there is at least one popular city
   called "Cambridge" in both the UK and USA. Thus, for more precise results,
   please provide as much context in the description as possible. For example,
   to resolve Cambridge in USA, pass "Cambridge, MA, USA" if you can.

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
https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>DCID_LIST</var>&property=<var>RELATION_EXPRESSION</var>
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/resolve

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

### Query parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| key <br /> <required-tag>Required</required-tag> | string | Your API key. See the [section on authentication](/api/rest/v2/index.html#authentication) for details. |
| nodes <br /> <required-tag>Required</required-tag>  | list of strings | Property or property values of the nodes to query, e.g. the node name or description. This currently only supports place nodes. |
| property <br /> <required-tag>Required</required-tag> | string | An expression that represents the label of the property by which you are identifying the node to query. For example, if you are using a node name for the `nodes` parameter, the expression would be `<-description`. Only three properties are currently supported: <br />`description`: Searches for nodes based on name-related properties (such as `name`, `alternateName`, etc.)<br/>`wikidataId`: Searches for nodes based on their Wikidata ID.<br/>`geoCoordinates`: Searches for nodes based on latitude and/or longitude.<br/> Note that the expression must end with `->dcid` |
{: .doc-table }

## Response

The response looks like:

<pre>
{
  "entities": [
    {
      "node": "<var>NODE_1</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_1</var>",
          "dominantType": "<var>TYPE_OF_DCID_1</var>"
        },
      ]
    },
    {
      "node": "<var>NODE_2</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_2</var>",
          "dominantType": "<var>TYPE_OF_DCID_2</var>"
        },
      ]
    },
    ...
  ]
}
</pre>
{: .response-signature .scroll}

### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| node | string | The property value or description provided. |
| candidates | list | DCIDs matching the description you provided.
| dominantType | string | Optional field which, where present, disambiguates between multiple results. |
{: .doc-table}

> **Note:**
  There is a deprecated field `resolvedIds` that is currently returned by the API. It will be removed soon. Examples below omit this redundant field.

## Examples

### Example 1: Find the DCID of a place by another known ID

This queries for the DCID of a place by its Wikidata ID. This property is represented in the graph by [`wikidataId`](https://datacommons.org/browser/wikidataId){: target="_blank"}.

Parameters:
{: .example-box-title}

```bash
nodes: "Q30"
property: "<-wikidataId->dcid"
```
GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Q30&property=%3C-wikidataId-%3Edcid'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/resolve \
  -d '{"nodes": ["Q30"], "property": "<-wikidataId->dcid"}'
```

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "Q30",
         "candidates" : [
            {
               "dcid" : "country/USA"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

### Example 2: Find the DCID of a place by coordinates

This queries for the DCID of "Mountain View" by its coordinates. This is most often represented by the [`latitude`](https://datacommons.org/browser/latitude){: target="_blank"} and [`longitude`](https://datacommons.org/browser/longitude){: target="_blank"} properties on a node. Since the API only supports querying a single property, use the synthetic `geoCoordinate` property. To specify the latitude and longitude, use the `#` sign to separate both values. This returns all the places in the graph that contains the coordinate.

Parameters:
{: .example-box-title}

```bash
nodes: "37.42#-122.08"
property: "<-geoCoordinate->dcid"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=37.42%23-122.08&property=%3C-geoCoordinate-%3Edcid'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/resolve \
  -d '{"nodes": ["37.42#-122.08"], "property": "<-geoCoordinate->dcid"}'
```

{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "37.42#-122.08",
         "candidates" : [
            {
               "dcid" : "geoId/0649670",
               "dominantType" : "City"
            },
            {
               "dcid" : "geoId/06085",
               "dominantType" : "County"
            },
            {
               "dcid" : "geoId/06",
               "dominantType" : "State"
            },
            {
               "dcid" : "country/USA",
               "dominantType" : "Country"
            },
            {
               "dcid" : "geoId/06085504601",
               "dominantType" : "CensusTract"
            },
            {
               "dcid" : "geoId/060855046011",
               "dominantType" : "CensusBlockGroup"
            },
            {
               "dcid" : "geoId/0608592830",
               "dominantType" : "CensusCountyDivision"
            },
            {
               "dcid" : "geoId/0618",
               "dominantType" : "CongressionalDistrict"
            },
            {
               "dcid" : "geoId/sch0626280",
               "dominantType" : "SchoolDistrict"
            },
            {
               "dcid" : "ipcc_50/37.25_-122.25_USA",
               "dominantType" : "IPCCPlace_50"
            },
            {
               "dcid" : "zip/94043",
               "dominantType" : "CensusZipCodeTabulationArea"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

### Example 3: Find the DCID of a place by name

This queries for the DCID of "Georgia". Notice that specifying `Georgia` without a type filter returns all possible DCIDs with the same name: the state of Georgia in USA ([geoId/13](https://datacommons.org/browser/geoId/13){: target="_blank"}), the country Georgia ([country/GEO](https://datacommons.org/browser/country/GEO){: target="_blank"}) and the city Georgia in the US state of Vermont ([geoId/5027700](https://datacommons.org/browser/geoId/5027700){: target="_blank"}).

Note the `description` property in the request. This currently only supports resolving place entities by name.

Parameters:
{: .example-box-title}

```bash
nodes: "Georgia"
property: "<-description->dcid"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Georgia&property=%3C-description-%3Edcid'
```
POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/resolve \
  -d '{"nodes": ["Georgia"], "property": "<-description->dcid"}'
```

Response:
{: .example-box-title}

```json
{ 
   "entities" : [
      {
        "node" : "Georgia",
        "candidates" : [
            {
               "dcid" : "geoId/13"
            },
            {
               "dcid" : "country/GEO"
            },
            {
               "dcid" : "geoId/5027700"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

### Example 4: Find the DCID of a place by name, with a type filter

This queries for the DCID of "Georgia". Unlike in the previous example, here
we also specify its type using a filter and only get one place in the response.

Parameters:
{: .example-box-title}

```bash
nodes: "Georgia"
property: "<-description{typeOf:State}->dcid"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Georgia&property=%3C-description%7BtypeOf:State%7D-%3Edcid'
```
POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/resolve \
  -d '{"nodes": ["Georgia"], "property": "<-description{typeOf:State}->dcid"}'
```

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "Georgia",
         "candidates" : [
            {
               "dcid" : "geoId/13"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

### Example 5: Find the DCID of multiple places by name, with a type filter

This queries for the DCIDs of "Mountain View" and "New York City".

Parameters:
{: .example-box-title}

```bash
nodes: "Mountain View, CA", "New York City"
property: "<-description{typeOf:City}->dcid"
```
GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Mountain%20View,%20CA&nodes=New%20York%20City&property=%3C-description%7BtypeOf:City%7D-%3Edcid'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/resolve \
  -d '{"nodes": ["Mountain View, CA", "New York City"], "property": "<-description{typeOf:City}->dcid"}'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "Mountain View, CA",
         "candidates" : [
            {
               "dcid" : "geoId/0649670"
            },
            {
               "dcid" : "geoId/0649651"
            }
         ],
      },
      {
         "node" : "New York City",
         "candidates" : [
            {
               "dcid" : "geoId/3651000"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}
