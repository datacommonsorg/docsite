---
layout: default
title: Get a series of observations
nav_order: 2
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/observations/series
---
 
 
 

# /v1/observations/series

 
Retrieve time series from a specific variable for an entity from the [preferred facet](/api/intro_to_data_commons#preferred).
 
<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve a single point in a series of values, use [/v1/observations/point](/api/rest/v1/observations/point)<br />
   For querying multiple variables or entities, see the [bulk version](/api/rest/v1/bulk/observations/series) of this endpoint.
</div>
 
 
 

## Request

 
GET https://api.datacommons.org/v1/observations/series/{ENTITY_DCID}/{VARIABLE_DCID}
{: #api-signature}
<script src="/assets/js/syntax_highlighting.js"></script>
 

### Parameters

 

#### Path Parameters

 
| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| VARIABLE_DCID <br /> <required-tag>Required</required-tag> | DCID of the variable to query a value for. |
| ENTITY_DCID <br /> <required-tag>Required</required-tag> | DCID of the entity that the variable describes. |
{: .doc-table }
 

#### Query Parameters

 
There are no query string parameters for this method.
 

## Response

 
The response will look something like:
 

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

 

### Response fields

 
| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observations    | list | A list of {date, value} pairs for the variable queried, where date is the date of measurement and value the measured value for the variable. Pairs are returned in chronological order. |
| facet    | dict   | Metadata on the [facet](/api/rest/v1/intro_to_data_commons#facet) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}
 

## Examples

 

### Example 1: Get the time series for a given variable and entity from a preferred facet.

 
Get the mean rainfall (DCID: `Mean_Rainfall` ) for New Delhi, India (DCID: `wikidataId/Q` 987).
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
‘https://api.datacommons.org/v1/observations/series/wikidataId/Q987/Mean_Rainfall’
```
{: .example-box-content}
 
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
{: .example-box-content}
 
 
 
