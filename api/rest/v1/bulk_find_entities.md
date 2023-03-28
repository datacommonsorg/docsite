---
layout: default
title: Find Entities
parent: REST (v1)
grand_parent: API
nav_order: 101
published: true
permalink: /api/rest/v1/bulk/find/entities
is_bulk: true
---

# /v1/bulk/find/entities

Find the [DCIDs](/glossary.html#dcid) of multiple entities.

Given the description of an entity, this endpoint searches for an entry in the Data Commons knowledge graph and returns the DCIDs of matches. For example, you could query for "San Francisco, CA" or "San Francisco" to find that its DCID is `geoId/0667000`. You can also provide the type of entity (country, city, state, etc.) to disambiguate (Georgia the country vs. Georgia the US state). If multiple DCIDs are returned, the first is the most likely best match given the available info.

<div markdown="span" class="alert alert-info" role="alert">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   Currently, this endpoint only supports [place](/glossary.html#place) entities. Support for other entity types will be added as the knowledge graph grows.
</div>

<div markdown="span" class="alert alert-danger" role="alert">
   <span class="material-icons exclamation-icon">priority_high</span><b>IMPORTANT:</b><br />
   This endpoint relies on name-based geocoding and is prone to inaccuracies. One common pattern is ambiguous place names that exist in different countries, states, etc. For example, there is at least one popular city called "Cambridge" in both the UK and USA. Thus, for more precise results, please provide as much context in the description as possible. For example, to resolve Cambridge in USA, pass "Cambridge, MA, USA" if you can.
</div>

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For querying a single entity and a simpler output, see the [simple version](/api/rest/v1/find/entities) of this endpoint.
</div>

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
        "type": "{entity_type_2}"
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
| description <br /> <required-tag>Required</required-tag> | string | Description of the entity. Typically the name of the place.                                                                                                                                         |
| type <br /> <optional-tag>Optional</optional-tag>        | string | The type of entity, specified as a DCID. Common values are "Country", "State", "County", "City".                                                                         |
{: .doc-table }

## Response

The response looks like:

```json
{
  "entities": [
    {
      "description":"Description provided 1",
      "type":"Type provided 1",
      "dcids":["DCID 1"]
    },
    {
      "description":"Description provided 2",
      "type":"Type provided 2",
      "dcids":["DCID 2"]
    },
    ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name        | Type   | Description                                                                                            |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| description | string | The description you provided.                                                                          |
| type        | string | The type of entity, if provided.                                                           |
| dcids       | list   | DCIDs matching the description you provided. If no matches are found, this field will not be returned. |
{: .doc-table}

## Examples

### Example 1: Find the DCID of places, with and without the type field

This queries for the DCID of "_Georgia_" twice: once without specifying type, and once with. Notice that specifying "_Georgia_" without specifying `type` returned the DCID of the US state of Georgia. When including `"type":"Country"`, the DCID of the country of Georgia is returned.

Request:
{: .example-box-title}

```bash
curl -X POST \
--url 'https://api.datacommons.org/v1/bulk/find/entities' \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities": [{"description": "Georgia"}, {"description": "Georgia", "type":"Country"}]}'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities":[
    {
      "description":"Georgia",
      "dcids":["geoId/13"]
    },
    {
      "description":"Georgia",
      "type":"Country",
      "dcids":["country/GEO"]
    }
  ]
}

```
{: .example-box-content .scroll}

### Example 2: Find the DCID of places, using different descriptions

This queries for the DCIDs of "_London_", "_London, ON_" and "_London, UK_". Notice how including "_ON_" or "_UK_" in the description helps disambiguate.

Request:
{: .example-box-title}

```bash
curl -X POST \
--url 'https://api.datacommons.org/v1/bulk/find/entities' \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":[{"description": "London"},{"description": "London, ON"},{"description": "London, UK"}]}'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "entities":[
    {
      "description":"London",
      "dcids":["nuts/UKI"]
    },
    {
      "description":"London, ON",
      "dcids":["wikidataId/Q92561"]
    },
    {
      "description":"London, UK",
      "dcids":["nuts/UKI"]
    }
  ]
}
```
{: .example-box-content .scroll}
