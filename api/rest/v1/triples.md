---
layout: default
title: Triples
nav_order: 7
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/triples
---

# /v1/triples

Get a [triple](/glossary.html#triple).

Useful for finding local connections between nodes of the Data Commons knowledge
graph.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To query triples for multiple nodes, see the [bulk version](/api/rest/v1/bulk/triples) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
http://api.datacommons.org/v1/triples/{EDGE_DIRECTION}/{NODE_DCID}?key={api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. Denotes direction of edges to get triples for. <br /><br />If `in`, returns triples with edges pointing _toward_ the node provided. If `out`, returns triples with edges pointing _away_ from the node provided. |
| NODE_DCID <br /> <required-tag>Required</required-tag>    | [DCID](/glossary.html#dcid) of the node to query.                                                                                                                                                                                        |

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
  "triples":
  {
    "property_describing_node_queried_1":
    {
      "nodes":
      [
        {
          "property_1": "value",
          "property_2": "value",
          ...
        }, ...
      ]
    }, ...
  }
}
```
{: .response-signature .scroll}

### Response fields

| Name    | Type   | Description                                                                                                                                                                       |
| ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| triples | object | A nested JSON object containing [DCIDs](/glossary.html#dcid) of both properties that describe the node queried, and nodes connected to the queried node via those properties. |
{: .doc-table}

## Examples

### Example 1: Get triples of outgoing edges

Get triples for the node representing Carbon Dioxide (DCID: `CarbonDioxide`),
where edges point _away_ from the node for Carbon Dioxide.

Request:
{: .example-box-title}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/triples/out/CarbonDioxide&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "triples": {
    "description": {
      "nodes": [
        {
          "provenanceId": "dc/5l5zxr1",
          "value": "A colorless gas consisting of a carbon atom covalently double bonded to two oxygen atoms."
        }
      ]
    },
    "descriptionUrl": {
      "nodes": [
        {
          "provenanceId": "dc/5l5zxr1",
          "value": "https://en.wikipedia.org/wiki/Carbon_dioxide"
        }
      ]
    },
    "name": {
      "nodes": [
        {
          "provenanceId": "dc/5l5zxr1",
          "value": "Carbon Dioxide"
        },
        {
          "provenanceId": "dc/5l5zxr1",
          "value": "CarbonDioxide"
        }
      ]
    },
    "provenance": {
      "nodes": [
        {
          "name": "https://datacommons.org",
          "types": ["Provenance"],
          "dcid": "dc/5l5zxr1",
          "provenanceId": "dc/5l5zxr1"
        }
      ]
    },
    "typeOf": {
      "nodes": [
        {
          "name": "GasType",
          "types": ["Class"],
          "dcid": "GasType",
          "provenanceId": "dc/5l5zxr1"
        },
        {
          "name": "GreenhouseGas",
          "types": ["Class"],
          "dcid": "GreenhouseGas",
          "provenanceId": "dc/5l5zxr1"
        }
      ]
    }
  }
}
```
{: .example-box-content .scroll}

### Example 2: Get triples of incoming edges

Get triples for the node representing Carbon Dioxide (DCID: `CarbonDioxide`),
where edges point _towards_ the node Carbon Dioxide.

Request:
{: .example-box-title}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/triples/in/CarbonDioxide?query=value&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "triples": {
    "emittedThing": {
      "nodes": [
        {
          "name": "CO2 Emissions Per Capita",
          "types": ["StatisticalVariable"],
          "dcid": "Amount_Emissions_CarbonDioxide_PerCapita",
          "provenanceId": "dc/d7tbsb1"
        },
        {
          "name": "Annual Amount of Emissions: Biogenic Emission Source, Carbon Dioxide",
          "types": ["StatisticalVariable"],
          "dcid": "Annual_Emissions_CarbonDioxide_Biogenic",
          "provenanceId": "dc/d7tbsb1"
        },
        {
          "name": "Annual Amount of Emissions: Non Biogenic Emission Source, Carbon Dioxide",
          "types": ["StatisticalVariable"],
          "dcid": "Annual_Emissions_CarbonDioxide_NonBiogenic",
          "provenanceId": "dc/d7tbsb1"
        },
        {
          "types": ["StatisticalVariable"],
          "dcid": "dc/pelkj2pkyww1",
          "provenanceId": "dc/6zzrcr2"
        }
      ]
    }
  }
}
```
{: .example-box-content .scroll}
