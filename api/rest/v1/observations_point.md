---
layout: default
title: Single Observation
nav_order: 8
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/observations/point
---

# /v1/observations/point

Retrieve a specific observation at a set date from a variable for an entity from the
[preferred facet](/glossary.html#preferred-facet). If no date is provided, the latest
observation is returned.

<div markdown="span" class="alert alert-warning" role="alert">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve the entire series of observations, use [/v1/observations/series](/api/rest/v1/observations/series)<br />
   For querying multiple variables or entities, see the [bulk version](/api/rest/v1/bulk/observations/point) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
https://api.datacommons.org/v1/observations/point/{ENTITY_DCID}/{VARIABLE_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>


### Path Parameters

| Name                                                       | Description                                     |
| ---------------------------------------------------------- | ----------------------------------------------- |
| VARIABLE_DCID <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the variable to query a value for.      |
| ENTITY_DCID <br /> <required-tag>Required</required-tag>   | [DCID](/glossary.html#dcid) of the entity that the variable describes. |
{: .doc-table }

### Query Parameters

| Name                                              | Type | Description                                                                                                                                                                                                                                                             |
| ------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| date <br /> <optional-tag>Optional</optional-tag> | type | Datetime of measurement of the value requested in ISO 8601 format. To see the dates available, look up the variable in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). If date is not provided, the latest available datapoint is returned. |
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

| Name  | Type   | Description                                                                                                                                        |
| ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| value | type   | Value of the variable queried for the queried entity.                                                                                              |
| date  | string | Datetime the value returned was measured.                                                                                                          |
| facet | dict   | Metadata on the [facet](/glossary.html#facet) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}

## Examples

### Example 1: Get latest observation for given variable and entity

Get the population count (DCID: `Count_Person` ) for the United States of America (DCID: `country/USA` ). Note that the latest entry available will be returned.

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/point/country/USA/Count_Person?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "date": "2020",
  "value": 331449281,
  "facet": {
    "importName": "USDecennialCensus_RedistrictingRelease",
    "provenanceUrl": "https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html",
    "measurementMethod": "USDecennialCensus"
  }
}
```
{: .example-box-content .scroll}

### Example 2: Get single observation at a **specific date**, for given variable and entity

Get the annual electricity generation (DCID: `Annual_Generation_Electricity` ) of California (DCID: `geoId/06` ) in 2018.

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/point/geoId/06/Annual_Generation_Electricity?date=2018&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
 {
   "date": "2018",
   "value": 195465638180,
   "facet": {
     "importName": "EIA_Electricity",
     "provenanceUrl": "https://www.eia.gov/opendata/qb.php?category=0",
     "unit": "KilowattHour"
   }
 }
}
```
{: .example-box-content .scroll}
