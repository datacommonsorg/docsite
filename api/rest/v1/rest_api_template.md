---
layout: default
title: REST API Page Template
nav_order: 999
parent: v1 REST
grand_parent: API
published: false
---

# /v1/end/point

One line summary of what it does.

Longer details if necessary can go in a short paragraph here. This is where to document any particular nuances in behavior or to provide special notes for end users. If there’s any special Data Commons terminology to define (e.g. triples), that should be done here as well.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To do some other related, but different thing, see [/v1/other/end/point](https://docs.datacommons.org)
</div>

## Request

GET http://api.datacommons.org/v1/end/point/{param1}/{param2}
{: #api-signature}

<script src="/assets/js/syntax_highlighting.js"></script>

### Parameters

#### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| param1 <br /> <required-tag>Required</required-tag> | description of parameter here |
| param2 <br /> <required-tag>Required</required-tag> | description of parameter here |
{: .doc-table }

#### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| query <br /> <optional-tag>Optional</optional-tag> | type | description of query here |
{: .doc-table }

## Response

The response will look something like:

```json
{
  "value": 1234,
  "date": "YYYY-MM-DD",
  "Metadata": {}
}
```

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| value    | type   | description of output here |
| date     | string | description of output here |
| metadata | dict   | description of output here |
{: .doc-table}

## Examples

### Example 1: Description of what we're trying to show

One sentence explanation of details of the example.

Request:
{: .example-box-title}
```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/end/point/param1/param2?query=value'
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
