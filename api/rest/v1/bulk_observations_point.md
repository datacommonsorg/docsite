---
layout: default
title: Single Observation
nav_order: 106
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/bulk/observations/point
is_bulk: true 
---
 
 
 

# /v1/bulk/observations/point

 
Retrieve a specific observation at a set date from multiple variables for multiple entities.
 
 
<div markdown="span" class="alert alert-warning" role="alert">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve the entire series of observations, use [/v1/bulk/observations/series](/api/rest/v1/observations/series)<br />
   For single queries with a simpler output, see the [simple version](/api/rest/v1/observations/point) of this endpoint
</div>
 

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div> 

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/observations/point?entities={entity_dcid_1}&entities={entity_dcid_2}&variables={variable_dcid_1}&variables={variable_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/observations/point

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities": [
    "{entity_dcid_1}",
    "{entity_dcid_2}",
    ...
  ],
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
| entities <br /><required-tag>Required</required-tag> | Repeated string | [DCIDs](/glossary.html#dcid) of the entities the variables describe. |
| variables <br /><required-tag>Required</required-tag> | Repeated string | [DCIDs](/glossary.html#dcid) of the variables to query observations for.|
| date <br /> <optional-tag>Optional</optional-tag> | string | Datetime of measurement of the value requested in ISO 8601 format. To see the dates available, look up the variable in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). If date is not provided, the latest available datapoint is returned.  |
| all_facets <br /><optional-tag>Optional</optional-tag> | Boolean | Whether to return data from all [facets](/glossary.html#facet) available. If true, data from all facets available will be returned. If false, only data from the [preferred facet](/glossary.html#preferred-facet) will be returned. Defaults to false.
{: .doc-table }
 
 

## Response

 
The response looks like:
 

```json
{
  "observationsByVariable": [
    {
      "variable": "variable1_DCID",
      "observationsByEntity": [
        {
          "entity": "entity1_DCID",
          "pointsByFacet": [
            {
              "date": "YYYY",
              "value": 1234,
              "facet": 1234567890
            }, ...
          ]
        },
      ]
    }
  ],
  "facets": {
    "1234567890": {
      "importName": "Import_name_string",
      "provenanceUrl": "https://provenance.url",
      "measurementMethod": "MeasurementMethod"
    } ...     
  }
}
```
{: .response-signature .scroll}
 

### Response fields

 
| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observationsByVariable   | list   | List of observations organized by variable. These are further organized by entity, and then by facet.|
| facets    | object   | Metadata on the [facet(s)](/glossary.html#facet) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}
 

## Examples

 

### Example 1: Get values for multiple variables and entities from the preferred facet **at a set date**

 
Get latest count of men (DCID: `Count_Person_Male` ) and count of women (DCID: `Count_Person_Female` ) for both California (DCID: `geoId/06` ) and Texas (DCID: `geoId/48` ) in 2019.
 
<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/observations/point?entities=geoId/06&entities=geoId/48&variables=Count_Person_Male&variables=Count_Person_Female&date=2019&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/observations/point \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":["geoId/06", "geoId/48"], "variables":["Count_Person_Male", "Count_Person_Female"], "date":"2019"}'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
{% endtabs %}
</div>
 
Response:
{: .example-box-title}

```json
{
  "observationsByVariable": [
    {
      "variable": "Count_Person_Male",
      "observationsByEntity": [
        {
          "entity": "geoId/06",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 19526298,
              "facet": 1145703171
            }
          ]
        },
        {
          "entity": "geoId/48",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 14034009,
              "facet": 1145703171
            }
          ]
        }
      ]
    },
    {
      "variable": "Count_Person_Female",
      "observationsByEntity": [
        {
          "entity": "geoId/06",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 19757199,
              "facet": 1145703171
            }
          ]
        },
        {
          "entity": "geoId/48",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 14226847,
              "facet": 1145703171
            }
          ]
        }
      ]
    }
  ],
  "facets": {
    "1145703171": {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey"
    }
  }
}
```
{: .example-box-content .scroll}
 

### Example 2: Get values for multiple variables and entities **from all facets**

 
Get latest count of men (DCID: `Count_Person_Male` ) and count of women (DCID: `Count_Person_Female` ) for both California (DCID: `geoId/06` ) and Texas (DCID: `geoId/48` ) for all facets.
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/observations/point?entities=geoId/06&entities=geoId/48&variables=Count_Person_Male&variables=Count_Person_Female&all_facets=true&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
Response:
{: .example-box-title}

```json
{
  "observationsByVariable": [
    {
      "variable": "Count_Person_Male",
      "observationsByEntity": [
        {
          "entity": "geoId/06",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 19526298,
              "facet": 1145703171
            },
            {
              "date": "2019",
              "value": 19640794,
              "facet": 1226172227
            },
            {
              "date": "2019",
              "value": 19523898.009,
              "facet": 10983471
            },
            {
              "date": "2019",
              "value": 19523898.009,
              "facet": 196790193
            },
            {
              "date": "2018",
              "value": 19663600,
              "facet": 1151455814
            }
          ]
        },
        {
          "entity": "geoId/48",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 14034009,
              "facet": 1145703171
            },
            {
              "date": "2019",
              "value": 14385762,
              "facet": 1226172227
            },
            {
              "date": "2019",
              "value": 14045645.432,
              "facet": 10983471
            },
            {
              "date": "2019",
              "value": 14045645.432,
              "facet": 196790193
            },
            {
              "date": "2018",
              "value": 14260100,
              "facet": 1151455814
            }
          ]
        }
      ]
    },
    {
      "variable": "Count_Person_Female",
      "observationsByEntity": [
        {
          "entity": "geoId/06",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 19757199,
              "facet": 1145703171
            },
            {
              "date": "2019",
              "value": 19871429,
              "facet": 1226172227
            },
            {
              "date": "2019",
              "value": 19759598.991,
              "facet": 10983471
            },
            {
              "date": "2019",
              "value": 19759598.991,
              "facet": 196790193
            },
            {
              "date": "2018",
              "value": 19817700,
              "facet": 1151455814
            }
          ]
        },
        {
          "entity": "geoId/48",
          "pointsByFacet": [
            {
              "date": "2019",
              "value": 14226847,
              "facet": 1145703171
            },
            {
              "date": "2019",
              "value": 14610119,
              "facet": 1226172227
            },
            {
              "date": "2019",
              "value": 14215210.568,
              "facet": 10983471
            },
            {
              "date": "2019",
              "value": 14215210.568,
              "facet": 196790193
            },
            {
              "date": "2018",
              "value": 14250900,
              "facet": 1151455814
            }
          ]
        }
      ]
    }
  ],
  "facets": {
    "10983471": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "196790193": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2602",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "1145703171": {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey"
    },
    "1151455814": {
      "importName": "OECDRegionalDemography",
      "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "1226172227": {
      "importName": "CensusACS1YearSurvey",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS1yrSurvey"
    }
  }
}
```
{: .example-box-content .scroll}
 
<script src="/assets/js/tabs.js"></script>
 
