---
layout: default
title: Property Values (linked)
nav_order: 5
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/property/values/in/linked
---

# /v1/property/values/in/linked

Return property values for [properties](/glossary.html#property) that can be
chained for multiple degrees in the knowledge graph.

<div markdown="span" class="alert alert-info" role="alert">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   This API currently only supports the `containedInPlace` property to fetch `Place` nodes. Support for more properties and node types will be added in the future.
</div>

For example, in the following diagram:

![Example of a chained property](/assets/images/rest/property_value_direction_example.png){:width=100%}

The property `containedInPlace` is chained. Buenos Aires is contained in
Argentina, which is itself contained in South America -- implying Buenos Aires
is also contained in South America. With this endpoint, you could query for
countries in South America (returning Argentina) or for cities in South America
(returning Buenos Aires).

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To query multiple entites or properties, see the [bulk version](/api/rest/v1/bulk/property/values/in/linked) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
http://api.datacommons.org/v1/property/values/in/linked/{CONTAINING_PLACE}/containedInPlace?value_node_type={place_type}&key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| CONTAINING_PLACE <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the parent place to query.|
{: .doc-table }

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| value_node_type <br /> <required-tag>Required</required-tag> | string | The type of place to get results for (e.g. state, country, city, county). For a list of available values, see the [Knowledge Graph page on Place](https://datacommons.org/browser/Place).|
{: .doc-table }

## Response

The response looks like:

```json
{
  "values":
  [
    {
      "name": "Place Name",
      "dcid": "Place DCID"
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| values    | list   | List of place nodes that are contained in the queried parent place. |
{: .doc-table}

## Examples

### Example 1: Get all states in a country.

Get all states in India (DCID: `country/IND`).

Request:
{: .example-box-title}
```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/property/values/in/linked/country/IND/containedInPlace?value_node_type=State&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
```json
{
  "values":
  [
    {
      "name": "Gujarat",
      "dcid": "wikidataId/Q1061"
    },
    {
      "name": "Andhra Pradesh",
      "dcid": "wikidataId/Q1159"
    },
    < ... output truncated for brevity ...>
    {
      "name": "Daman and Diu",
      "dcid": "wikidataId/Q66710"
    },
    {
      "name": "Telangana",
      "dcid": "wikidataId/Q677037"
    }
  ]
}
```
{: .example-box-content .scroll}
