---
layout: default
title: Resolve Entities
nav_order: 3
parent: REST (v2)
grand_parent: API
published: true
permalink: /api/rest/v2/resolve
---

# /v2/resolve

Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph.

Each entity in Data Commons has an associated `DCID` which is used to refer to it
in other API calls or programs. An important step for a Data Commons user is to
identify the DCIDs of entities they care about. This API searches for an entry in the
Data Commons knowledge graph and returns the DCIDs of matches. Users can use
common properties or even descriptive words to find entities.

For example, you could query for "San Francisco, CA" or "San Francisco" to find
that its DCID is `geoId/0667000`. You can also provide the type of entity
(country, city, state, etc.) to disambiguate (Georgia the country vs. Georgia
the US state).

The REST (v2) API introduces [relation
expressions](/api/rest/v2/#relation-expressions) in the API syntax to represent
node relations, support chaining and filtering. For more information
see [Data Commons REST (v2) API Overview](/api/rest/v2/#relation-expressions).

<div markdown="span" class="alert alert-info" role="alert">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   Currently, this endpoint only supports [place](/glossary.html#place) entities.
   Support for other entity types will be added as the knowledge graph grows.
</div>

<div markdown="span" class="alert alert-danger" role="alert">
   <span class="material-icons exclamation-icon">priority_high</span><b>IMPORTANT:</b><br />
   This endpoint relies on name-based geocoding and is prone to inaccuracies.
   One common pattern is ambiguous place names that exist in different
   countries, states, etc. For example, there is at least one popular city
   called "Cambridge" in both the UK and USA. Thus, for more precise results,
   please provide as much context in the description as possible. For example,
   to resolve Cambridge in USA, pass "Cambridge, MA, USA" if you can.
</div>

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
https://api.datacommons.org/v2/resolve?key={your_api_key}&nodes={NODE}&property={PROPERTY_EXPRESSION}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/resolve

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "nodes": [
    "{NODE_1}",
    "{NODE_2}",
    ...
  ],
  "property": "{PROPERTY_EXPRESSION}"
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Query Parameters

| Name                                                  | Type   | Description                                                                                                                                                     |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v2/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag>    | string | The queried property value (e.g. entity name or ID), or description of the node (this currently only supports the name of the place).
| property <br /> <required-tag>Required</required-tag> | string | Property expression that represents the relation of the given nodes to the queried entities. Since we are resolving to DCID, note that this should always end with `->dcid` |

{: .doc-table }

## Response

The response looks like:

```json
{
  "entities": [
    {
      "node": "{NODE_1}",
      "candidates": [
        {
          "dcid": "{DCID 1}",
          "dominantType": "{type of DCID 1}"
        },
      ]
    },
    {
      "node": "{NODE_2}",
      "candidates": [
        {
          "dcid": "{DCID 2}",
          "dominantType": "{type of DCID 2}"
        },
      ]
    },
    ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name        | Type   | Description                                                                                            |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| node | string | The property value or description provided. |
| candidates | list | DCIDs matching the description you provided, along with an optional `dominantType` field which can be used for filtering multiple results. |
{: .doc-table}

<div markdown="span" class="alert alert-info" role="alert">
  <span class="material-icons md-16">info </span><b>Note:</b><br />
  There is a deprecated field `resolvedIds` that is currently returned by the API. It will be removed soon.
</div>

## Examples

### Example 1: Find the DCID of a place by another known ID

This queries for the DCID of a place by its Wikidata ID. This property is represented in the graph by [`wikidataId`](https://datacommons.org/browser/wikidataId).

Parameters:
{: .example-box-title}

```bash
nodes: "Q30"
property: "<-wikidataId->dcid"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Q30&property=<-wikidataId->dcid'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "node": "Q30",
      "candidates": [
        { "dcid": "country/USA" }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}

### Example 2: Find the DCID of a place by coordinates

This queries for the DCID of "_Mountain View_" by its coordinates. This is most often represented by the [`latitude`](https://datacommons.org/browser/latitude) and [`longitude`](https://datacommons.org/browser/longitude) properties on a node. Since the API only supports querying a single property, we use the synthetic `geoCoordinate` property. To specify the latitude and longitude, use the `#` sign to separate both values. This returns all the places in the graph that contains the coordinate.

Note: If using GET, the `#` should be escaped to `%23`.

Parameters:
{: .example-box-title}

```bash
nodes: "37.42#-122.08"
property: "<-geoCoordinate->dcid"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=37.42%23-122.08&property=<-geoCoordinate->dcid'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "node": "37.42#-122.08",
      "candidates": [
        {
          "dcid": "geoId/0649670",
          "dominantType": "City"
        },
        {
          "dcid": "geoId/06085",
          "dominantType": "County"
        },
        {
          "dcid": "geoId/06",
          "dominantType": "State"
        },
        {
          "dcid": "country/USA",
          "dominantType": "Country"
        },
        {
          "dcid": "geoId/06085504601",
          "dominantType": "CensusTract"
        },
        {
          "dcid": "geoId/060855046011",
          "dominantType": "CensusBlockGroup"
        },
        {
          "dcid": "geoId/0608592830",
          "dominantType": "CensusCountyDivision"
        },
        {
          "dcid": "geoId/0618",
          "dominantType": "CongressionalDistrict"
        },
        {
          "dcid": "geoId/sch0626280",
          "dominantType": "SchoolDistrict"
        },
        {
          "dcid": "ipcc_50/37.25_-122.25_USA",
          "dominantType": "IPCCPlace_50"
        },
        {
          "dcid": "zip/94043",
          "dominantType": "CensusZipCodeTabulationArea"
        }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}

### Example 3: Find the DCID of a place by name

This queries for the DCID of "_Georgia_". Notice that specifying "_Georgia_" without specifying `type` returns all possible DCIDs with the same name: the state of Georgia in USA ([geoId/13](https://datacommons.org/browser/geoId/13)), the country Georgia ([country/GEO](https://datacommons.org/browser/country/GEO)) and the city Georgia in the US state of Vermont ([geoId/5027700](https://datacommons.org/browser/geoId/5027700)).

Note that we use the `description` property in the request. This currently only supports resolving place entities by name.

Parameters:
{: .example-box-title}

```bash
nodes: "Georgia"
property: "<-description->dcid"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Georgia&property=<-description->dcid
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "node": "Georgia",
      "candidates": [
        { "dcid": "geoId/13" },
        { "dcid": "country/GEO" },
        { "dcid": "geoId/5027700" }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}

### Example 4: Find the DCID of a place by name, specifying type

This queries for the DCID of "_Georgia_". Unlike in the previous example, here
we also specify its type using a filter and only get one place in the response.

Parameters:
{: .example-box-title}

```bash
nodes: "Georgia"
property: "<-description{typeOf:State}->dcid"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Georgia&property=<-description{typeOf:State}->dcid
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "node": "Georgia",
      "candidates": [
        { "dcid": "geoId/13" },
      ]
    }
  ]
}
```
{: .example-box-content .scroll}

### Example 5: Find the DCID of multiple places by name, with a type filter

This queries for the DCID of "_Mountain View_" and "_New York City_".

Parameters:
{: .example-box-title}

```bash
nodes: "Mountain View, CA", "New York City"
property: "<-description{typeOf:City}->dcid"
```

Request (GET):
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes%3DMountain%20View%2C%20CA&nodes=New%20York%20City&property=%3C-description%7BtypeOf%3ACity%7D-%3Edcid'
```
{: .example-box-content .scroll}

Request (POST):
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
  "entities": [
    {
      "node": "Mountain View, CA",
      "candidates": [
        { "dcid": "geoId/0649670" },
        { "dcid": "geoId/0649651" }
      ]
    },
    {
      "node": "New York City",
      "candidates": [
        { "dcid": "geoId/3651000" }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}