---
layout: default
title: Find DCIDs
parent: REST (v1)
grand_parent: API
nav_order: 1
published: true
permalink: /api/rest/v1/bulk/find/entities
---

# /v1/bulk/find/entities

Find the [DCID](/glossary.html#dcid) of an entity.

Given the name of the entity, this endpoint searches for an entry in the Data Common knowledge graph and returns the DCID of the best match. For example, you could query for "San Francisco, CA" or "San Francisco" to find that its DCID is `geoId/0667000`. You can also provide the type of entity (country, city, state, etc.) to disambiguate (Georgia the country vs. Georgia the US state).

## Request

POST Request
{: .api-header}

<div class="api-signature">
URL:
https://api.datacommons.org/v1/bulk/find/entities

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities": [
    {
        "description": "{entity_name_1}",
        "type": "{entity_type_1}"
    },
    {
        "description": "{entity_name_2}",
        "type": "{entity_type_3}"
    },
    ...
  ]
}
</div>
<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

There are no path parameters for this end point.

### Query Parameters

| Name                                                     | Type   | Description                                                                                                                                                     |
| -------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>         | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| description <br /> <required-tag>Required</required-tag> | string | The name of the entity.                                                                                                                                         |
| type <br /> <optional-tag>Optional</optional-tag>        | string | The DCID of the entity's class. Common values are "Country", "State", "County", "City".                                                                         |
{: .doc-table }

## Response

The response looks like:

```json
{
  "entities": [
    {
      "description":"Description provided",
      "type":"Type provided",
      "dcids":["DCID"]
    }
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name        | Type   | Description                                                                                            |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| description | string | The description you provided.                                                                          |
| type        | string | The DCID of the entity's class, if provided.                                                           |
| dcids       | list   | DCIDs matching the description you provided. If no matches are found, this field will not be returned. |
{: .doc-table}

## Examples

### Example 1: Find the DCID of a place

Find the DCID of "Georgia". Note that the DCID of the US state of Georgia is returned.

Request:
{: .example-box-title}

```bash
curl -X POST \
--url 'https://api.datacommons.org/v1/bulk/find/entities' \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities": [{"description": "Georgia"}]}'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "description": "Georgia",
      "type": "Country",
      "dcids": ["geoId/13"]
    }
  ]
}
```
{: .example-box-content .scroll}

### Example 2: Find the DCID of a place that is a country

Find the DCID of the country of Georgia. Here we specify "Country" for type to get the DCID of the country instead of the US state.

Request:
{: .example-box-title}

```bash
curl -X POST \
--url 'https://api.datacommons.org/v1/bulk/find/entities' \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities": [{"description": "Georgia", "type": "Country"}]}'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "description": "Georgia",
      "type": "Country",
      "dcids": ["country/GEO"]
    }
  ]
}
```
{: .example-box-content .scroll}
