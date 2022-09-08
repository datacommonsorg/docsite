---
layout: default
title: Property Values (linked)
nav_order: 6.5
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/property/values/in/linked
---

# /v1/property/values/in/linked

Get all places of a specific type that are contained in the same parent place.

More specifically, this endpoint returns property values for [properties](/glossary.html#property) that can be chained for multiple degrees in the knowledge graph. For example, in the following diagram:

![Example of a chained property](/assets/images/rest/property_value_direction_example.png){:width=100%}

The property `containedInPlace` is chained. Buenos Aires is contained in Argentina, which is itself contained in South America -- implying Buenos Aires is also contained in South America. With this endpoint, you could query for countries in South America (returning Argentina) or for cities in South America (returning Buenos Aires).

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   Currently, this endpoint only supports the `containedInPlace` property.
</div>

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To query multiple entites or properties, see the [bulk version](/api/rest/v1/bulk/property/values/in/linked) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
http://api.datacommons.org/v1/property/values/in/linked/{CONTAINING_PLACE}/containedInPlace?value_entity_type={place_type}&key={your_api_key}
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
| value_entity_type <br /> <required-tag>Required</required-tag> | string | The type of place to get results for (e.g. state, country, city, county). For a list of available values, see the [Graph Browser page on Place](https://datacommons.org/browser/Place).|
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
  'https://api.datacommons.org/v1/property/values/in/linked/country/IND/containedInPlace?value_entity_type=State&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
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
    {
      "name": "Arunachal Pradesh",
      "dcid": "wikidataId/Q1162"
    },
    {
      "name": "Assam",
      "dcid": "wikidataId/Q1164"
    },
    {
      "name": "Bihar",
      "dcid": "wikidataId/Q1165"
    },
    {
      "name": "Chhattisgarh",
      "dcid": "wikidataId/Q1168"
    },
    {
      "name": "Goa",
      "dcid": "wikidataId/Q1171"
    },
    {
      "name": "Haryana",
      "dcid": "wikidataId/Q1174"
    },
    {
      "name": "Himachal Pradesh",
      "dcid": "wikidataId/Q1177"
    },
    {
      "name": "Jharkhand",
      "dcid": "wikidataId/Q1184"
    },
    {
      "name": "Karnataka",
      "dcid": "wikidataId/Q1185"
    },
    {
      "name": "Kerala",
      "dcid": "wikidataId/Q1186"
    },
    {
      "name": "Madhya Pradesh",
      "dcid": "wikidataId/Q1188"
    },
    {
      "name": "Maharashtra",
      "dcid": "wikidataId/Q1191"
    },
    {
      "name": "Manipur",
      "dcid": "wikidataId/Q1193"
    },
    {
      "name": "Meghalaya",
      "dcid": "wikidataId/Q1195"
    },
    {
      "name": "Delhi",
      "dcid": "wikidataId/Q1353"
    },
    {
      "name": "West Bengal",
      "dcid": "wikidataId/Q1356"
    },
    {
      "name": "Tripura",
      "dcid": "wikidataId/Q1363"
    },
    {
      "name": "Rajasthan",
      "dcid": "wikidataId/Q1437"
    },
    {
      "name": "Tamil Nadu",
      "dcid": "wikidataId/Q1445"
    },
    {
      "name": "Uttar Pradesh",
      "dcid": "wikidataId/Q1498"
    },
    {
      "name": "Uttarakhand",
      "dcid": "wikidataId/Q1499"
    },
    {
      "name": "Mizoram",
      "dcid": "wikidataId/Q1502"
    },
    {
      "name": "Sikkim",
      "dcid": "wikidataId/Q1505"
    },
    {
      "name": "Nagaland",
      "dcid": "wikidataId/Q1599"
    },
    {
      "name": "Ladakh",
      "dcid": "wikidataId/Q200667"
    },
    {
      "name": "Odisha",
      "dcid": "wikidataId/Q22048"
    },
    {
      "name": "Punjab",
      "dcid": "wikidataId/Q22424"
    },
    {
      "name": "Lakshadweep",
      "dcid": "wikidataId/Q26927"
    },
    {
      "name": "Andaman and Nicobar Islands",
      "dcid": "wikidataId/Q40888"
    },
    {
      "name": "Chandigarh",
      "dcid": "wikidataId/Q43433"
    },
    {
      "name": "Jammu and Kashmir",
      "dcid": "wikidataId/Q66278313"
    },
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
