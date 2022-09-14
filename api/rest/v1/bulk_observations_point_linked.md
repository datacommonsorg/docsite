---
layout: default
title: Single Observation (linked)
nav_order: 6
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/observations/point/linked
---

# /v1/bulk/observations/point/linked

Retrieve a single [observation](/glossary.html#observation) of multiple [variables](/glossary.html#variable) 
at a set date for entities linked to an ancestor entity by the same property.

More specifically, in the following diagram:

![Example of a linked property](/assets/images/rest/property_value_direction_example.png){:width=100%}

The property `containedInPlace` is linked. Buenos Aires is contained in
Argentina, which is itself contained in South America -- implying Buenos Aires
is also contained in South America. With this endpoint, you could query for
countries in South America (returning observations for Argentina) or for cities 
in South America (returning observations for Buenos Aires).

This is useful for retrieving an observation for all places within an ancestor place. 
For example, this could be getting the population of women in 2018 for all states in the United States.

<div markdown="span" class="alert alert-info" role="alert">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   Currently, this endpoint only supports the `containedInPlace` property and `Place` entities. Support for other properties and entity types will be added in the future.
</div>

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To get a single observation for a single place, see [/v1/observations/point](/api/rest/v1/observations/point).<br />
    To get a series of observations for all places within an ancestor place, see [/v1/bulk/observations/series/linked](/api/rest/v1/observations/series/linked).
</div>

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/observations/point/linked?linked_property=containedInPlace&linked_entity={ancestor_place_dcid}&entity_type={place_type}&variables={variable_dcid_1}&variables={variable_dcid_2}&date={date}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/observations/point/linked

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "linked_property": "containedInPlace",
  "linked_entity": "{ancestor_place_dcid}"
  "entity_type": "{place_type}",
  "date": "{date}",
  "variables": [
    "{variable_dcid_1}",
    "{variable_dcid_2}",
    ...
  ]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

There are no path parameters for this endpoint.

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| linked_entity <br /> <required-tag>Required</required-tag> | list | [DCIDs](/glossary.html#dcid) of the ancestor place to query.|
| entity_type <br /> <required-tag>Required</required-tag> | string | Type of place to query for (e.g. city, county, state, etc.). For a list of available values, see the [Graph Browser page on Place](https://datacommons.org/browser/Place). |
| variables <br /> <required-tag>Required</required-tag> | list | [DCIDs](/glossary.html#dcid) of the [variables](/glossary.html#variables) to query. |
| linked_property <br /> <required-tag>Required</required-tag> | string | [DCID](/glossary.html#dcid) of the property to query. Must be `containedInPlace`.|
| date <br /> <optional-tag>Optional</optional-tag> | string | Datetime of measurement of the value requested in ISO 8601 format. To see the dates available, look up the variable in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). If date is not provided, the latest available datapoint is returned.  |
| all_facets <br /><optional-tag>Optional</optional-tag> | boolean | Whether to return data from all [facets](/glossary.html#facet) available. If true, data from all facets available will be returned. If false, only data from the [preferred facet](/glossary.html#preferred-facet) will be returned. Defaults to false.|
{: .doc-table }

## Response

The response looks like:

```json
{
  "observationsByVariable":
  [
    {
      "variable": "variable_dcid",
      "observationsByEntity":
      [
        {
          "entity": "entity_dcid",
          "pointsByFacet":
          [
            {
              "date": "YYYY-MM-DD",
              "value": 1234,
              "facet": 0123456789
            }
          ]
        }, ...
      ]
    }, ...
  ],
  "facets":
  {
    "0123456789":
    {
      "importName": "ImoprtName",
      "provenanceUrl": "https://provenance.url/here",
      "measurementMethod": "MeasurementMethod",
      "observationPeriod": "P<N>Y"
    }, ...
  }
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observationsByVariable   | list   | List of observations organized by variable. These are further organized by entity, and then by [facet](/glossary.html#facet).|
| facets    | object   | Metadata on the [facet(s)](/glossary.html#facet) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}

## Examples

### Example 1: Get a single observation from multiple variables at a set date for all places within a ancestor place.

Get the population (DCID: `Count_Person`) and median income (DCID: `Median_Income_Person`) for all states in the US (DCID: `country/USA`) in the year 2020.

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/observations/point/linked?linked_entity=country/USA&linked_property=containedInPlace&variables=Count_Person&variables=Median_Income_Person&entity_type=State&date=2020&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/observations/point/linked \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"linked_property":"containedInPlace", "linked_entity":"country/USA", "entity_type":"State", "date":"2020", "variables":["Count_Person", "Median_Income_Person"]}'
```
{: .example-box-content .scroll}

{% endtab %}

{% endtabs %}
</div>

Response:
{: .example-box-title}

```json
{
  "observationsByVariable":
  [
    {
      "variable": "Count_Person",
      "observationsByEntity":
      [
        {
          "entity": "geoId/01",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 4921532,
              "facet": 2176550201
            }
          ]
        },
        {
          "entity": "geoId/02",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 731158,
              "facet": 2176550201
            }
          ]
        },
        < ... output truncated for brevity ... >
        {
          "entity": "geoId/56",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 582328,
              "facet": 2176550201
            }
          ]
        },
        {
          "entity": "geoId/72",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 3255642,
              "facet": 1145703171
            }
          ]
        }
      ]
    },
    {
      "variable": "Median_Income_Person",
      "observationsByEntity":
      [
        {
          "entity": "geoId/01",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 27030,
              "facet": 1305418269
            }
          ]
        },
        {
          "entity": "geoId/02",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 34881,
              "facet": 1305418269
            }
          ]
        },
        < ... output truncated for brevity ... >
        {
          "entity": "geoId/56",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 33031,
              "facet": 1305418269
            }
          ]
        },
        {
          "entity": "geoId/72",
          "pointsByFacet":
          [
            {
              "date": "2020",
              "value": 13814,
              "facet": 1305418269
            }
          ]
        }
      ]
    }
  ],
  "facets":
  {
    "2176550201":
    {
      "importName": "USCensusPEP_Annual_Population",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    },
    < ... output truncated for brevity ... >
    "1305418269":
    {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey",
      "unit": "USDollar"
    }
  }
}
```
{: .example-box-content .scroll}
