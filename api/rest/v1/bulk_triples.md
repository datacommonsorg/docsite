---
layout: default
title: Triples
parent: REST (v1)
grand_parent: API
nav_order: 102
published: true
permalink: /api/rest/v1/bulk/triples
is_bulk: true
---

# /v1/bulk/triples

Get [triples](/glossary.html#triple) for multiple nodes.

Useful for finding local connections between nodes of the Data Commons knowledge
graph.

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For single queries with a simpler output, see the [simple version](/api/rest/v1/triples) of this endpoint.
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
https://api.datacommons.org/v1/bulk/triples/{EDGE_DIRECTION}?nodes={node_dcid_1}&nodes={node_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/triples/{EDGE_DIRECTION}

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "nodes": [
    "{value_1}",
    "{value_2}",
    ...
  ]
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. Denotes direction of edges to get triples for. <br /><br />If `in`, returns triples with edges pointing _toward_ the node provided. If `out`, returns triples with edges pointing _away_ from the node provided. |
{: .doc-table }

### Query Parameters

| Name                                                  | Type   | Description                                                                                                                                                     |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag> | string | [DCIDs](/glossary.html#dcid) of the nodes to query.                                                                                                          |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "node": "node_dcid_1",
      "triples":
      {
        "property_of_node":
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
    },
    {
      "node": "node_dcid_2",
      "triples":
      {
        "property_of_node":
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
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name    | Type   | Description                                                                                                                                                                       |
| ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node  | string | [DCID](/glossary.html#dcid) of the node queried.                                                                                                                                |
| triples | object | A nested JSON object containing [DCIDs](/glossary.html#dcid) of both properties that describe the node queried, and nodes connected to the queried node via those properties. |
{: .doc-table}

## Examples

### Example 1: Get outgoing triples for multiple nodes.

Get triples for the greenhouse gases carbon dioxide (DCID: `CarbonDioxide`) and
methane (DCID: `Methane`), for edges going _away_ from those nodes.

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/triples/out?nodes=CarbonDioxide&nodes=Methane&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/triples/out \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"nodes":["CarbonDioxide", "Methane"]}'
```
{: .example-box-content .scroll}

{% endtab %}

{% endtabs %}

</div>

Response:
{: .example-box-title}

```json
{
  "data": [
    {
      "node": "CarbonDioxide",
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
    },
    {
      "node": "Methane",
      "triples": {
        "isProvisional": {
          "nodes": [
            {
              "name": "True",
              "types": ["Boolean"],
              "dcid": "True",
              "provenanceId": "dc/5l5zxr1"
            }
          ]
        },
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/5l5zxr1",
              "value": "Methane"
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
              "name": "ChemicalCompound",
              "types": ["Class"],
              "dcid": "ChemicalCompound",
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
  ]
}
```
{: .example-box-content .scroll}

### Example 2: Get incoming triples for multiple nodes.

Get triples for the greenhouse gases carbon dioxide (DCID: `CarbonDioxide`) and
methane (DCID: `Methane`), for edges going _towards_ those nodes.

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/triples/in?nodes=geoId/51&nodes=CarbonDioxide&nodes=Methane&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/triples/in \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"nodes":["CarbonDioxide", "Methane"]}'
```
{: .example-box-content .scroll}

{% endtab %}

{% endtabs %}

</div>
 
Response:
{: .example-box-title}

```json
{
  "data": [
    {
      "node": "CarbonDioxide",
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
    },
    {
      "node": "Methane",
      "triples": {
        "contaminant": {
          "nodes": [
            {
              "name": "Whether Atmosphere is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_Atmosphere",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether EPA_OtherContaminatedThing is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_EPAOtherContaminatedThing",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether GroundWater is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_GroundWater",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether LandfillGas is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_LandfillGas",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether Leachate is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_Leachate",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether SoilGas is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_SoilGas",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether Soil is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_Soil",
              "provenanceId": "dc/d7tbsb1"
            },
            {
              "name": "Whether SolidWaste is contaminated with Methane.",
              "types": ["StatisticalVariable"],
              "dcid": "IsContaminated_Methane_SolidWaste",
              "provenanceId": "dc/d7tbsb1"
            }
          ]
        },
        "emittedThing": {
          "nodes": [
            {
              "name": "Annual Amount of Emissions: Non Biogenic Emission Source, Methane",
              "types": ["StatisticalVariable"],
              "dcid": "Annual_Emissions_Methane_NonBiogenic",
              "provenanceId": "dc/d7tbsb1"
            }
          ]
        }
      }
    }
  ]
}
```
{: .example-box-content .scroll}
