---
layout: default
title: Variable Info
nav_order: 6
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/info/variable
---

# /v1/info/variable

Get basic information about a [variable](/glossary.html#variable).

This API returns basic information on a variable, given the variable's
[DCID](/glossary.html#dcid). The information provided includes the
number of entities that have data for the variable, the minimum and maximum
value observed, and the name and DCID of the top 3 entities with highest
observed values for that variable. The information is grouped by place type
(country, state, county, etc.).

<div markdown="span" class="alert alert-info" role="alert">
   <span class="material-icons md-16">info </span><b>Tip:</b><br />
   To explore variables available in the Data Commons knowledge graph, take a look at the [Statistical Variable Explorer](https://datacommons.org/tools/statvar).
</div>

<div markdown="span" class="alert alert-warning" role="alert">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To get information on a place instead of a variable, see [/v1/info/place](/api/rest/v1/info/place).<br />
   For querying multiple variables, see the [bulk version](/api/rest/v1/bulk/info/variable) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
https://api.datacommons.org/v1/info/variable/{VARIABLE_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                       | Description                                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| VARIABLE_DCID <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the variable to query information for. |
{: .doc-table}

### Query Parameters

| Name                                             | Type   | Description                                                                                                                                                     |
| ------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag> | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
{: .doc-table }

## Response

The response looks like:

```json
{
  "node": "dcid",
  "info": {
    "placeTypeSummary": {
      "Country/State/City/Etc": {
        "topPlaces": [{ "dcid": "dcid", "name": "Place Name" }],
        "placeCount": 123,
        "minValue": 123456,
        "maxValue": 123456
      }, ...
    },
    "provenanceSummary": {
      "provenance_dcid": {
        "importName": "Import_Name",
        "releaseFrequency": "P<N>Y",
        "seriesSummary": [
          {
            "seriesKey": { "observationPeriod": "P<N>Y" },
            "earliestDate": "YYYY-MM-DD",
            "latestDate": "YYYY-MM-DD",
            "placeTypeSummary": {
              "County/Country/State/Etc": {
                "topPlaces": [
                  { "dcid": "dcid", "name": "Place Name" },
                  { "dcid": "dcid", "name": "Place Name" },
                  { "dcid": "dcid", "name": "Plance Name" }
                ],
                "placeCount": 123,
                "minValue": 12,
                "maxValue": 123456
              }, ...
            },
            "minValue": 12,
            "maxValue": 123456,
            "observationCount": 123,
            "timeSeriesCount": 123
          }
        ],
        "observationCount": 1234,
        "timeSeriesCount": 1234
      }
    }
  }
}
```
{: .response-signature .scroll}

### Response fields

| Name | Type   | Description                                                                                                                                                                                                                                                                                                                 |
| ---- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node | string | [DCID](/glossary.html#dcid) of the variable queried.                                                                                                                                                                                                                                                          |
| info | object | Information about the variable queried. Includes maximum and minimum values, and number of places with data on the variable queried, grouped by place type (country-level, state-level, city-level, etc. statistics are grouped together). Also includes information about the provenance of data for the variable queried. |
{: .doc-table}

## Examples

### Example 1: Get information on a single variable

Get basic information about the variable for number of farms (DCID:
`Count_Farm`).

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/info/variable/Count_Farm?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "node": "Count_Farm",
  "info": {
    "placeTypeSummary": {
      "Country": {
        "topPlaces": [{ "dcid": "country/USA", "name": "United States" }],
        "placeCount": 1,
        "minValue": 123456,
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
              "County": {
                "topPlaces": [
                  { "dcid": "geoId/06037", "name": "Los Angeles County" },
                  { "dcid": "geoId/17031", "name": "Cook County" },
                  { "dcid": "geoId/48201", "name": "Harris County" }
                ],
                "placeCount": 3076,
                "minValue": 2,
                "maxValue": 5551
              },
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
}
```
{: .example-box-content .scroll}
