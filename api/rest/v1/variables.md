---
layout: default
title: Variables
nav_order: 12
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/variables
---

# /v1/variables

Get all [variables](/glossary.html#variable) with data associated with a specific entity.

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For querying multiple entities, see the [bulk version](/api/rest/v1/bulk/variables) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
http://api.datacommons.org/v1/variables/{ENTITY_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| ENTITY_DCID <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the entity to query. |
{: .doc-table }

### Query Parameters

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
{: .doc-table}

## Response

The response looks like:

```json
{
  "entity": "Entity DCID",
  "variables": [
    "variable_dcid_1",
    "variable_dcid_2",
    ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| entity   | string   | [DCID](/glossary.html#dcid) of the entity queried. |
| variables | list | List of variables associated with the entity queried. |
{: .doc-table}

## Examples

### Example 1: Get variables for an entity

Get all properties that describe the city of Hagåtña, the capital of Guam. (DCID: `wikidataId/Q30988`).

Request:
{: .example-box-title}
```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/variables/wikidataId/Q30988'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
```json
{
  "entity": "wikidataId/Q30988",
  "variables": [
    "Count_Person",
    "Max_Rainfall",
    "Max_Snowfall",
    "Max_Temperature",
    "Mean_BarometricPressure",
    "Mean_Rainfall",
    "Mean_Snowfall",
    "Mean_Temperature",
    "Mean_Visibility",
    "Min_Rainfall",
    "Min_Snowfall",
    "Min_Temperature"
  ]
}
```
{: .example-box-content .scroll}
