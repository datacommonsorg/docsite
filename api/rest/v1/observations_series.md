---
layout: default
title: Series of Observations
nav_order: 10
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/observations/series
---
 
# /v1/observations/series

Retrieve series of observations from a specific variable for an entity from the preferred facet.
 
<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve a single observation in a series of values, use [/v1/observations/point](/api/rest/v1/observations/point) <br />For querying multiple variables or entities, see the [bulk version](/api/rest/v1/bulk/observations/series) of this endpoint.
</div>
 
## Request
GET Request
{: .api-header}

<div class="api-signature">
https://api.datacommons.org/v1/observations/series/{ENTITY_DCID}/{VARIABLE_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
 

### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| VARIABLE_DCID <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the variable to query a value for. |
| ENTITY_DCID <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the entity that the variable describes. |
{: .doc-table }
 
### Query Parameters

| Name   | Type | Description  |
| -------| ---- | ------------ |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
{: .doc-table }
 
## Response

The response looks like:
 

```json
{
  "observations": [
    {
      "date": "YYYY-MM-DD",
      "value": 1234
    }, ...
  ],
  "facet": {
    "importName": "Name",
      "provenanceUrl": "https://provenance.url/",
      "measurementMethod": "MeasurementMethod",
      "unit": "unit"
  }
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observations    | list | A list of {date, value} pairs for the variable queried, where date is the date of measurement and value the measured value for the variable. Pairs are returned in chronological order. |
| facet    | dict   | Metadata on the [facet](/glossary.html#facet) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}
 
## Examples

### Example 1: Get the time series for a given variable and entity from a preferred facet.

Get the mean rainfall (DCID: `Mean_Rainfall` ) for New Delhi, India (DCID: `wikidataId/Q` 987).
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/series/wikidataId/Q987/Mean_Rainfall?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
Response:
{: .example-box-title}

```json
{
  "observations": [
    {
      "date": "1901-01",
      "value": 1.13871
    },
    {
      "date": "1901-02",
      "value": 0.487143
    },
      
    <... output truncated for brevity ...>
 
    {
      "date": "2022-02",
      "value": 1.07331
    },
    {
      "date": "2022-03"
    }
  ],
  "facet": {
    "importName": "NOAA_EPA_Observed_Historical_Weather",
    "provenanceUrl": "https://www.noaa.gov/",
    "measurementMethod": "NASAGSOD_NASAGHCN_EPA",
    "unit": "Millimeter"
  }
}
 
```
{: .example-box-content .scroll}
 
 
 
