---
layout: default
title: v1/observations/point
nav_order: 1
parent: v1 REST API
grand_parent: API
has_children: true
published: false
---

# v1/observations/point

Retrieve a specific value from a variable for an entity.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To retrieve the entire series of values, use [v1/observations/series](observations_series.html)
</div>

## Request


GET https://api.datacommons.org/v1/observations/point/{VARIABLE_DCID}/{ENTITY_DCID}
{: #api-signature}

<script src="/assets/js/syntax_highlighting.js"></script>

### Parameters

#### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| VARIABLE_DCID <br /> <required-tag>Required</required-tag> | DCID of the variable to query a value for. |
| ENTITY_DCID <br /> <required-tag>Required</required-tag> | DCID of entity that the variable describes. |
{: .doc-table }

#### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| date <br /> <optional-tag>Optional</optional-tag> | type | Datetime of  measurement of the value requested in ISO 8601 format. To see the dates available, lookup the variable in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). If date is not provided, the lastest available datapoint is returned.  |
{: .doc-table }

## Response

The response will look something like:

```json
{
  "date": "YYYY-MM-DD",
  "value": 1234,
  "facet": {...},
}
```

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| value    | type   | Value of the variable queried for the queried entity. |
| date     | string | Datetime the value returned was measured. |
| facet    | dict   | Metadata on the facet the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}

## Examples

### Example 1: Get single value for given variable and entity

Get the population count (DCID: `Count_Person`) for the United States of America (DCID: `country/USA`). Note that the latest entry available will be returned.

Request:
{: .example-box-title}
```bash
$ curl --request GET --url \ 
‘https://api.datacommons.org/v1/observations/point/Count_Person/country/USA’
```
{: .example-box-content}

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
{: .example-box-content}


### Example 2: Get single value at a **specific date**, for given variable and entity

Get the annual electricity generation (DCID: `Annual_Generation_Electricity`) of California (DCID: `geoId/06`) in 2018.

Request:
{: .example-box-title}
```bash
$ curl --request GET --url \ 
‘https://api.datacommons.org/v1/observations/point/Annual_Generation_Electricity/geoId/06&date=2018’
```
{: .example-box-content}

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
```
{: .example-box-content}
