---
layout: default
title: Triples
parent: v1 REST
grand_parent: API
nav_exclude: true
published: false
permalink: /api/rest/v1/bulk/triples
---

# /v1/bulk/triples

Get [triples](/glossary.html#triple) for multiple entities.

Useful for finding local connections between nodes of the Data Commons knowledge
graph.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
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
https://api.datacommons.org/v1/bulk/triples/{EDGE_DIRECTION}?entities={entity_dcid_1}&entities={entity_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/triples/{EDGE_DIRECTION}

Header: X-API-Key: {your_api_key}

JSON Data: { "entities": [ "{value_1}", "{value_2}", ... ] }

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. Denotes direction of edges to get triples for. <br /><br />If `in`, returns triples with edges pointing _toward_ the entity provided. If `out`, returns triples with edges pointing _away_ from the entity provided. |
{: .doc-table }

### Query Parameters

| Name                                                  | Type   | Description                                                                                                                                                     |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| entities <br /> <required-tag>Required</required-tag> | string | [DCIDs](/glossary.html#dcid) of the entities to query.                                                                                                          |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "entity": "entity_dcid_1",
      "triples":
      {
        "property_of_entity":
        {
          "entities":
          [
            {
              "property_of_connected_node_1": "value",
              "property_of_connected_node_2": "value",
              ...
            }, ...
          ]
        }, ...

      }
    },
    {
      "entity": "entity_dcid_2",
      "triples":
      {
        "property_of_entity":
        {
          "entities":
          [
            {
              "property_of_connected_node_1": "value",
              "property_of_connected_node_2": "value",
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
| entity  | string | [DCID](/glossary.html#dcid) of the entity queried.                                                                                                                                |
| triples | object | A nested JSON object containing [DCIDs](/glossary.html#dcid) of both properties that describe the entity queried, and nodes connected to the queried entity via those properties. |
{: .doc-table}

## Examples

### Example 1: Get outgoing triples for multiple entities.

Get triples for the greenhouse gases carbon dioxide (DCID: `CarbonDioxide`) and
methane (DCID: `Methane`), for edges going _away_ from those nodes.

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/triples/out?entities=CarbonDioxide&entities=Methane&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
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
--data '{"entities":["CarbonDioxide", "Methane"]}'
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
      "entity": "CarbonDioxide",
      "triples": {
        "description": {
          "entities": [
            {
              "provenanceId": "dc/5l5zxr1",
              "value": "A colorless gas consisting of a carbon atom covalently double bonded to two oxygen atoms."
            }
          ]
        },
        "descriptionUrl": {
          "entities": [
            {
              "provenanceId": "dc/5l5zxr1",
              "value": "https://en.wikipedia.org/wiki/Carbon_dioxide"
            }
          ]
        },
        "name": {
          "entities": [
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
          "entities": [
            {
              "name": "https://datacommons.org",
              "types": ["Provenance"],
              "dcid": "dc/5l5zxr1",
              "provenanceId": "dc/5l5zxr1"
            }
          ]
        },
        "typeOf": {
          "entities": [
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
      "entity": "Methane",
      "triples": {
        "isProvisional": {
          "entities": [
            {
              "name": "True",
              "types": ["Boolean"],
              "dcid": "True",
              "provenanceId": "dc/5l5zxr1"
            }
          ]
        },
        "name": {
          "entities": [
            {
              "provenanceId": "dc/5l5zxr1",
              "value": "Methane"
            }
          ]
        },
        "provenance": {
          "entities": [
            {
              "name": "https://datacommons.org",
              "types": ["Provenance"],
              "dcid": "dc/5l5zxr1",
              "provenanceId": "dc/5l5zxr1"
            }
          ]
        },
        "typeOf": {
          "entities": [
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

### Example 2: Get incoming triples for multiple entities.

Get triples for the greenhouse gases carbon dioxide (DCID: `CarbonDioxide`) and
methane (DCID: `Methane`), for edges going _towards_ those nodes.

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/triples/in?entities=geoId/51&entities=CarbonDioxide&entities=Methane&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
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
--data '{"entities":["CarbonDioxide", "Methane"]}'
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
      "entity": "CarbonDioxide",
      "triples": {
        "emittedThing": {
          "entities": [
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
      "entity": "Methane",
      "triples": {
        "contaminant": {
          "entities": [
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
          "entities": [
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
