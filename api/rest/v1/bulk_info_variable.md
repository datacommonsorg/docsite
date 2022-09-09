---
layout: default
title: Info of a variable
nav_exclude: true
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/info/variable
---

## /v1/bulk/info/variable

Get basic information about multiple
[variables](/api/rest/v1/getting_started#variable).

This API returns basic information on multiple variables, given each of their
[DCIDs](/api/rest/v1/getting_started#dcid). The information is provided per
variable, and includes the number of entities with data on each variable, the
minimum and maximum values observed, and the name and DCID of the top 3 entities
with highest observed values for each variable.

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
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET Request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST Request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature"><div class="scroll">
https://api.datacommons.org/v1/bulk/info/variable?nodes={variable_dcid_1}&nodes={variable_dcid_2}&key={your_api_key}
</div></div>

<div id="POST-request" class="api-tabcontent api-signature"><div class="scroll">
URL:
https://api.datacommons.org/v1/bulk/info/variable

Header:
X-API-Key: {your_api_key}

JSON Data:
{
"nodes":
[
"{variable_dcid_1}",
"{variable_dcid_2}",
...
]
}

</div></div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

This endpoint has no path parameters.

### Query Parameters

| Name                                               | Type   | Description                                                                                                                                                     |
| -------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API Key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag> | string | [DCIDs](/api/rest/v1/getting_started#dcid) of the variables to query information for.                                                                           |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "node": "Variable_1_DCID",
      "info":
      {
        "placeTypeSummary":
        {
          "County/City/State/Etc":
          {
            "topPlaces":
            [
              {
                "dcid": "Place DCID",
                "name": "Place Name"
              },
              {
                "dcid": "Place DCID",
                "name": "Place Name"
              },
              {
                "dcid": "Place DCID",
                "name": "Place Name"
              }
            ],
            "placeCount": 123,
            "minValue": 1,
            "maxValue": 12345
          }, ...
          "provenanceSummary":
          {
            "DCID":
            {
              "importName": "Import_Name",
              "releaseFrequency": "P<N>Y",
              "seriesSummary":
              [
                {
                  "seriesKey":
                  {
                    "observationPeriod": "P<N>Y"
                  },
                  "earliestDate": "YYYY-MM-DD",
                  "latestDate": "YYYY-MM-DD",
                  "placeTypeSummary":
                  {
                    "Country/State/City/Etc":
                    {
                      "topPlaces":
                      [
                        {
                          "dcid": "Place DCID",
                          "name": "Place Name"
                        }
                      ],
                      "placeCount": 123,
                      "minValue": 1,
                      "maxValue": 123456
                    }, ...
                    "minValue": 1,
                    "maxValue": 123456,
                    "observationCount": 123,
                    "timeSeriesCount": 123
                  }
                }, ...
              ],
              "observationCount": 123,
              "timeSeriesCount": 123
            }
          }
        }
      },
    },
    {
      "node": "Variable_2_DCID",
      "info": {...}
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name | Type   | Description                                                                                                                                                                                                                                                                                                                 |
| ---- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node | string | [DCID](/api/rest/v1/getting_started#dcid) of the variable queried.                                                                                                                                                                                                                                                          |
| info | object | Information about the variable queried. Includes maximum and minimum values, and number of places with data on the variable queried, grouped by place type (country-level, state-level, city-level, etc. statistics are grouped together). Also includes information about the provenance of data for the variable queried. |
{: .doc-table}

## Examples

### Example 1: Get information for multiple variables

Get information on the variables for number of farms (DCID: `Count_Farm`) and
number of teachers (DCID: `Count_Teacher`).

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/info/variable?nodes=Count_Farm&nodes=Count_Teacher&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/info/variable \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"nodes":["Count_Farm", "Count_Teacher"]}'
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
      "node": "Count_Farm",
      "info": {
        "placeTypeSummary": {
          "County": {
            "topPlaces": [
              {
                "dcid": "geoId/06037",
                "name": "Los Angeles County"
              },
              {
                "dcid": "geoId/17031",
                "name": "Cook County"
              },
              {
                "dcid": "geoId/48201",
                "name": "Harris County"
              }
            ],
            "placeCount": 3076,
            "minValue": 2,
            "maxValue": 5551
          },
          "Country": {
            "topPlaces": [
              {
                "dcid": "country/USA",
                "name": "United States"
              }
            ],
            "placeCount": 1,
            "minValue": 2042220,
            "maxValue": 2042220
          },
          "State": {
            "topPlaces": [
              {
                "dcid": "geoId/06",
                "name": "California"
              },
              {
                "dcid": "geoId/48",
                "name": "Texas"
              },
              {
                "dcid": "geoId/12",
                "name": "Florida"
              }
            ],
            "placeCount": 50,
            "minValue": 990,
            "maxValue": 248416
          }
        },
        "provenanceSummary": {
          "dc/m02b5p": {
            "importName": "USDA_AgricultureCensus",
            "releaseFrequency": "P5Y",
            "seriesSummary": [
              {
                "seriesKey": {
                  "observationPeriod": "P5Y"
                },
                "earliestDate": "2017",
                "latestDate": "2017",
                "placeTypeSummary": {
                  "Country": {
                    "topPlaces": [
                      {
                        "dcid": "country/USA",
                        "name": "United States"
                      }
                    ],
                    "placeCount": 1,
                    "minValue": 2042220,
                    "maxValue": 2042220
                  },
                  "State": {
                    "topPlaces": [
                      {
                        "dcid": "geoId/06",
                        "name": "California"
                      },
                      {
                        "dcid": "geoId/48",
                        "name": "Texas"
                      },
                      {
                        "dcid": "geoId/12",
                        "name": "Florida"
                      }
                    ],
                    "placeCount": 50,
                    "minValue": 990,
                    "maxValue": 248416
                  },
                  "County": {
                    "topPlaces": [
                      {
                        "dcid": "geoId/06037",
                        "name": "Los Angeles County"
                      },
                      {
                        "dcid": "geoId/17031",
                        "name": "Cook County"
                      },
                      {
                        "dcid": "geoId/48201",
                        "name": "Harris County"
                      }
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
      "node": "Count_Teacher",
      "info": {
        "placeTypeSummary": {
          "SchoolDistrict": {
            "topPlaces": [
              {
                "dcid": "geoId/sch3620580",
                "name": "New York City Department Of Education"
              },
              {
                "dcid": "geoId/sch0622710",
                "name": "Los Angeles Unified"
              },
              {
                "dcid": "geoId/sch1709930",
                "name": "Chicago Public School District 299"
              }
            ],
            "placeCount": 18952,
            "maxValue": 28769.06
          },
          "School": {
            "topPlaces": [
              {
                "dcid": "nces/568025400549"
              },
              {
                "dcid": "nces/568025300548",
                "name": "Wyoming Behavioral Institute"
              },
              {
                "dcid": "nces/568025200350",
                "name": "Youth Emergency Services Inc."
              }
            ],
            "placeCount": 102977,
            "maxValue": 1702
          }
        },
        "provenanceSummary": {
          "dc/mzy8we": {
            "importName": "K12",
            "releaseFrequency": "P1Y",
            "seriesSummary": [
              {
                "seriesKey": {},
                "earliestDate": "2011",
                "latestDate": "2016",
                "placeTypeSummary": {
                  "SchoolDistrict": {
                    "topPlaces": [
                      {
                        "dcid": "geoId/sch3620580",
                        "name": "New York City Department Of Education"
                      },
                      {
                        "dcid": "geoId/sch0622710",
                        "name": "Los Angeles Unified"
                      },
                      {
                        "dcid": "geoId/sch1709930",
                        "name": "Chicago Public School District 299"
                      }
                    ],
                    "placeCount": 18952,
                    "maxValue": 28769.06
                  },
                  "School": {
                    "topPlaces": [
                      {
                        "dcid": "nces/568025400549"
                      },
                      {
                        "dcid": "nces/568025300548",
                        "name": "Wyoming Behavioral Institute"
                      },
                      {
                        "dcid": "nces/568025200350",
                        "name": "Youth Emergency Services Inc."
                      }
                    ],
                    "placeCount": 102977,
                    "maxValue": 1702
                  }
                },
                "maxValue": 28769.06,
                "observationCount": 618283,
                "timeSeriesCount": 121929
              }
            ],
            "observationCount": 618283,
            "timeSeriesCount": 121929
          }
        }
      }
    }
  ]
}
```
{: .example-box-content .scroll}
