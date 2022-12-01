---
layout: default
title: Property Values (linked)
nav_order: 105
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/bulk/property/values/in/linked
is_bulk: true
---

# /v1/bulk/property/values/in/linked

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
    For single requests with a simpler output, see the [simple version](/api/rest/v1/property/values/in/linked) of this endpoint.
</div>

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/property/values/in/linked?property=containedInPlace&value_node_type={place_type}&nodes={parent_place_dcid_1}&nodes={parent_place_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/property/values/in/linked

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "property": "containedInPlace",
  "value_place_type": "{place_type}",
  "nodes":
  [
    "{parent_place_dcid_1}",
    "{parent_place_dcid_2}",
    ...
  ]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

There are no path parameters for this endpoint.

### Query Parameters

| Name                                                         | Type   | Description                                                                                                                                                                |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>             | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key.            |
| nodes <br /> <required-tag>Required</required-tag>           | list   | [DCIDs](/glossary.html#dcid) of the parent places to query.                                                                                                                |
| value_node_type <br /> <required-tag>Required</required-tag> | string | Type of place to query for (e.g. city, county, state, etc.). For a list of available values, see the [Graph Browser page on Place](https://datacommons.org/browser/Place). |
| property <br /> <required-tag>Required</required-tag>        | string | [DCID](/glossary.html#dcid) of the property to query. Must be `containedInPlace`.                                                                                          |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "node": "Parent Place 1 DCID",
      "values":
      [
        {
          "name": "Child Place Name",
          "dcid": "Child Place DCID"
        }, ...
      ]
    },
    {
      "node": "Parent Place 2 DCID",
      "values":
      [
        {
          "name": "Child Place Name",
          "dcid": "Child Place DCID"
        }, ...
      ]
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name   | Type   | Description                                      |
| ------ | ------ | ------------------------------------------------ |
| node   | string | [DCID](/glossary.html#dcid) of the node queried. |
| values | list   | list of nodes connected by the property queried. |
{: .doc-table}

## Examples

### Example 1: Get all states of multiple countries.

Get the states of the countries USA (DCID: 'country/USA') and India (DCID:
'country/IND'). Note that this works because both countries have entries for the
`State` class of places.

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/property/values/in/linked?property=containedInPlace&value_node_type=State&nodes=country/USA&nodes=country/IND&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/property/values/in/linked \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"nodes":["country/USA", "country/IND"], "property":"containedInPlace", "value_node_type":"State"}'
```
{: .example-box-content .scroll}

{% endtab %}

{% endtabs %}

</div>

Response:
{: .example-box-title}

```json
{
  "data": [
    {
      "node": "country/USA",
      "values": [
        {
          "name": "Alabama",
          "dcid": "geoId/01"
        },
        {
          "name": "Alaska",
          "dcid": "geoId/02"
        },
        < ... output truncated for brevity ... >
        {
          "name": "Wyoming",
          "dcid": "geoId/56"
        },
        {
          "name": "Puerto Rico",
          "dcid": "geoId/72"
        }
      ]
    },
    {
      "node": "country/IND",
      "values": [
        {
          "name": "Gujarat",
          "dcid": "wikidataId/Q1061"
        },
        {
          "name": "Andhra Pradesh",
          "dcid": "wikidataId/Q1159"
        },
        < ... output truncated for brevity ... >
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
  ]
}
```
{: .example-box-content .scroll}
