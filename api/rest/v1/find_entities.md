---
layout: default
title: Find DCIDs
parent: REST (v1)
grand_parent: API
nav_order: 1
published: true
permalink: /api/rest/v1/find/entities
---

# /v1/find/entities

Find the [DCID](/glossary.html#dcid) of a given entity.

Given the description of an entity, this endpoint searches for an entry in the Data Commons knowledge graph and returns the DCIDs of matches. For example, you could query for "San Francisco, CA" or "San Francisco" to find that its DCID is `geoId/0667000`. You can also provide the type of entity (country, city, state, etc.) to disambiguate (Georgia the country vs. Georgia the US state).

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
    For querying multiple entities, see the [bulk version](/api/rest/v1/bulk/find/entities) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
URL:
https://api.datacommons.org/v1/find/entities?key={your_api_key}&description={entity_description}
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
  "dcids": ["dcid"]
}
```
{: .response-signature .scroll}

### Response fields

| Name        | Type   | Description                                                                                            |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| dcids       | list   | DCIDs matching the description you provided. If no matches are found, this field will not be returned. |
{: .doc-table}

## Examples

### Example 1: Find the DCID of a place

This queries for the DCID of "_Georgia_". Notice that specifying "_Georgia_" without specifying `type` returned the DCID of the US state.

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/find/entities?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&description=Georgia'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{"dcids":["geoId/13"]}

```
{: .example-box-content .scroll}

### Example 2: Find the DCID of a place, including a type

This queries for the DCIDs of "_Georgia_" while specifing we want the country.

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/find/entities?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&type=Country&description=Georgia'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{"dcids":["country/GEO"]}
```
{: .example-box-content .scroll}
