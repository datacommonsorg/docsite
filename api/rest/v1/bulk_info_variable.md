---
layout: default
title: Get info on a variable
nav_exclude: true
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/info/variable
---



## /v1/bulk/info/variable

Get basic information about multiple variables.

This API returns basic information on multiple variables, given each of their DCIDs. The information is provided per variable, and includes the number of places with data on each variable, the minimum and maximum values observed, and the name and DCID of the top 3 entities with highest observed values for each variable.

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>Tip:</b><br />
    To explore variables available in the Data Commons knowledge graph, take a look at the [Statistical Variable Explorer](https://datacommons.org/tools/statvar).
</div>

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To get information on a place instead of a variable, see [/v1/bulk/info/place](/api/rest/v1/info/place).<br />
    For querying a single variable and a simpler output, see the [simple version](/api/rest/v1/info/variable) of this endpoint.
</div>



## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div> 

```
https://api.datacommons.org/v1/bulk/info/variable?entities={entity_dcid_1}&entities={entity_dcid_2}
```
{: #GET-request .api-tabcontent .api-signature .scroll}


```
URL:
https://api.datacommons.org/v1/bulk/info/variable

JSON Data:
{
  "entities": [
    "{entity_dcid_1}",
    "{entity_dcid_2}",
    ...
  ]
}
```
{: #POST-request .api-tabcontent .api-signature .scroll}


<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>


### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| VARIABLE_DCID <br /> <required-tag>Required</required-tag> | [DCID](/api/rest/v1/getting_started#dcid) of the variable to query a value for. |
| ENTITY_DCID <br /> <required-tag>Required</required-tag> | [DCID](/api/rest/v1/getting_started#dcid) of entity that the variable describes. |
{: .doc-table }

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| date <br /> <optional-tag>Optional</optional-tag> | type | Datetime of  measurement of the value requested in ISO 8601 format. To see the dates available, lookup the variable in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). If date is not provided, the latest available datapoint is returned.  |
{: .doc-table }

## Response

The response looks like:

```json
{
  "date": "YYYY-MM-DD",
  "value": 1234,
  "facet": {...},
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| value    | type   | Value of the variable queried for the queried entity. |
| date     | string | Datetime the value returned was measured. |
| facet    | dict   | Metadata on the [facet](/api/rest/v1/getting_started#facet) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}

## Examples

### Example 1: Get single value for given variable and entity

Get the population count (DCID: `Count_Person`) for the United States of America (DCID: `country/USA`). Note that the latest entry available will be returned.

Request:
{: .example-box-title}
```bash
$ curl --request GET --url \ 
‘https://api.datacommons.org/v1/bulk/info/variable?entities=Count_Farm&entities=Amount_Stock’
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
```json
{
  "data": [
    {
      "entity": "Count_Farm",
      "info": {
        "placeTypeSummary": {
          "Country": {
            "topPlaces": [{ "dcid": "country/USA", "name": "United States" }],
            "placeCount": 1,
            "minValue": 2042220,
            "maxValue": 2042220
          },
          "State": {
            "topPlaces": [
              { "dcid": "geoId/06", "name": "California" },
              { "dcid": "geoId/48", "name": "Texas" },
              { "dcid": "geoId/12", "name": "Florida" }
            ],
            "placeCount": 50,
            "minValue": 990,
            "maxValue": 248416
          },
          "County": {
            "topPlaces": [
              { "dcid": "geoId/06037", "name": "Los Angeles County" },
              { "dcid": "geoId/17031", "name": "Cook County" },
              { "dcid": "geoId/48201", "name": "Harris County" }
            ],
            "placeCount": 3076,
            "minValue": 2,
            "maxValue": 5551
          }
        },
        "provenanceSummary": {
          "dc/m02b5p": {
            "importName": "USDA_AgricultureCensus",
            "releaseFrequency": "P5Y",
            "seriesSummary": [
              {
                "seriesKey": { "observationPeriod": "P5Y" },
                "earliestDate": "2017",
                "latestDate": "2017",
                "placeTypeSummary": {
                  "Country": {
                    "topPlaces": [
                      { "dcid": "country/USA", "name": "United States" }
                    ],
                    "placeCount": 1,
                    "minValue": 2042220,
                    "maxValue": 2042220
                  },
                  "State": {
                    "topPlaces": [
                      { "dcid": "geoId/06", "name": "California" },
                      { "dcid": "geoId/48", "name": "Texas" },
                      { "dcid": "geoId/12", "name": "Florida" }
                    ],
                    "placeCount": 50,
                    "minValue": 990,
                    "maxValue": 248416
                  },
                  "County": {
                    "topPlaces": [
                      { "dcid": "geoId/06037", "name": "Los Angeles County" },
                      { "dcid": "geoId/17031", "name": "Cook County" },
                      { "dcid": "geoId/48201", "name": "Harris County" }
                    ],
                    "placeCount": 3076,
                    "minValue": 2,
                    "maxValue": 5551
                  }
                },
                "minValue": 2,
                "maxValue": 2042220,
                "observationCount": 3127,
                "timeSeriesCount": 3127
              }
            ],
            "observationCount": 3127,
            "timeSeriesCount": 3127
          }
        }
      }
    },
    {
      "entity": "Amount_Stock",
      "info": {
        "placeTypeSummary": {
          "Place": {
            "topPlaces": [{ "dcid": "Earth", "name": "Earth" }],
            "placeCount": 1,
            "minValue": 2318922620000,
            "maxValue": 79233321687795.8
          },
          "Country": {
            "topPlaces": [
              { "dcid": "country/CHN", "name": "China" },
              { "dcid": "country/IND", "name": "India" },
              { "dcid": "country/USA", "name": "United States" }
            ],
            "placeCount": 99,
            "maxValue": 32120702650000
          }
        },
        "provenanceSummary": {
          "dc/jccrh82": {
            "importName": "WorldDevelopmentIndicators",
            "seriesSummary": [
              {
                "seriesKey": { "observationPeriod": "P1Y", "unit": "USDollar" },
                "earliestDate": "1975",
                "latestDate": "2019",
                "placeTypeSummary": {
                  "Country": {
                    "topPlaces": [
                      { "dcid": "country/CHN", "name": "China" },
                      { "dcid": "country/IND", "name": "India" },
                      { "dcid": "country/USA", "name": "United States" }
                    ],
                    "placeCount": 99,
                    "maxValue": 32120702650000
                  },
                  "Place": {
                    "topPlaces": [{ "dcid": "Earth", "name": "Earth" }],
                    "placeCount": 1,
                    "minValue": 2318922620000,
                    "maxValue": 79233321687795.8
                  }
                },
                "maxValue": 79233321687795.8,
                "observationCount": 2290,
                "timeSeriesCount": 100
              }
            ],
            "observationCount": 2290,
            "timeSeriesCount": 100
          }
        }
      }
    }
  ]
}
```
{: .example-box-content .scroll}
