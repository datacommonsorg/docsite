---
layout: default
title: Rest API Bulk Page Template
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/end/point
---

# /v1/bulk/end/point

One line summary of what it does.

Longer details if necessary can go in a short paragraph here. This is where to document any particular nuances in behavior or to provide special notes for end users. If there’s any special Data Commons terminology to define (e.g. triples), that should be done here as well.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To do some other related, but different thing, see [/v1/other/end/point](https://docs.datacommons.org)
</div>
 

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div> 

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/end/point?query={value}&query={value}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/end/point

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "parameter_1": [
    "{value_1}",
    "{value_2}",
    ...
  ],
  "parameter_2": [
    "{value_1}",
    "{value_2}",
    ...
  ]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>



 

### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| param1 <br /> <required-tag>Required</required-tag> | description of parameter here |
| param2 <br /> <required-tag>Required</required-tag> | description of parameter here |
{: .doc-table }

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| query <br /> <optional-tag>Optional</optional-tag> | type | description of query here |
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
| field    | type   | description of output here |
{: .doc-table}
 

## Examples

 

### Example 1: Description of what we're trying to show

One sentence explanation of details of the example.

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/end/point?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/end/point \
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
 
 
