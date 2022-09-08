---
layout: default
title: Property Values (linked)
nav_exclude: true
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/bulk/property/values/in/linked
---

# /v1/bulk/property/values/in/linked

Get all places of a specific type that are contained in the same parent place, for multiple parent places.

More specifically, this endpoint returns property values for [properties](/glossary.html#property) that can be chained for multiple degrees in the knowledge graph. For example, in the following diagram:

![Example of a chained property](/assets/images/rest/property_value_direction_example.png){:width=100%}

The property `containedInPlace` is chained. Buenos Aires is contained in Argentina, which is itself contained in South America -- implying Buenos Aires is also contained in South America. With this endpoint, you could query for countries in South America (returning Argentina) or for cities in South America (returning Buenos Aires).

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   Currently, this endpoint only supports the `containedInPlace` property.
</div>

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For single requests with a simpler output, see the [simple version](/api/rest/v1/property/values/in/linked) of this endpoint.
</div>

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/property/values/in/linked?property=containedInPlace&value_entity_type={place_type}&entities={parent_place_dcid_1}&entities={parent_place_dcid_2}&key={your_api_key}
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
  "entities": [
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

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| entities <br /> <required-tag>Required</required-tag> | list | [DCIDs](/glossary.html#dcid) of the parent places to query.|
| value_entity_type <br /> <required-tag>Required</required-tag> | string | Type of place to query for (e.g. city, county, state, etc.). For a list of available values, see the [Graph Browser page on Place](https://datacommons.org/browser/Place). |
| property <br /> <required-tag>Required</required-tag> | string | [DCID](/glossary.html#dcid) of the property to query. Must be `containedInPlace`.|
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "entity": "Parent Place 1 DCID",
      "values":
      [
        {
          "name": "Child Place Name",
          "dcid": "Child Place DCID"
        }, ...
      ]
    },
    {
      "entity": "Parent Place 2 DCID",
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

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| entity   | string | [DCID](/glossary.html#dcid) of the entity queried. |
| values   | list   | list of nodes connected by the property queried. |
{: .doc-table}

## Examples

### Example 1: Get all states of multiple countries.

Get the states of the countries USA (DCID: 'country/USA') and India (DCID: 'country/IND'). Note that this works because both countries have entries for the `State` class of places.

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/property/values/in/linked?property=containedInPlace&value_entity_type=State&entities=country/USA&entities=country/IND&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
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
--data '{"entities":["country/USA", "country/IND"], "property":"containedInPlace", value_entity_type="State"}'
```
{: .example-box-content .scroll}

{% endtab %}

{% endtabs %}
</div>

Response:
{: .example-box-title}

```json
{
  "data":
  [
    {
      "entity": "country/USA",
      "values":
      [
        {
          "name": "Alabama",
          "dcid": "geoId/01"
        },
        {
          "name": "Alaska",
          "dcid": "geoId/02"
        },
        {
          "name": "Arizona",
          "dcid": "geoId/04"
        },
        {
          "name": "Arkansas",
          "dcid": "geoId/05"
        },
        {
          "name": "California",
          "dcid": "geoId/06"
        },
        {
          "name": "Colorado",
          "dcid": "geoId/08"
        },
        {
          "name": "Connecticut",
          "dcid": "geoId/09"
        },
        {
          "name": "Delaware",
          "dcid": "geoId/10"
        },
        {
          "name": "District of Columbia",
          "dcid": "geoId/11"
        },
        {
          "name": "Florida",
          "dcid": "geoId/12"
        },
        {
          "name": "Georgia",
          "dcid": "geoId/13"
        },
        {
          "name": "Hawaii",
          "dcid": "geoId/15"
        },
        {
          "name": "Idaho",
          "dcid": "geoId/16"
        },
        {
          "name": "Illinois",
          "dcid": "geoId/17"
        },
        {
          "name": "Indiana",
          "dcid": "geoId/18"
        },
        {
          "name": "Iowa",
          "dcid": "geoId/19"
        },
        {
          "name": "Kansas",
          "dcid": "geoId/20"
        },
        {
          "name": "Kentucky",
          "dcid": "geoId/21"
        },
        {
          "name": "Louisiana",
          "dcid": "geoId/22"
        },
        {
          "name": "Maine",
          "dcid": "geoId/23"
        },
        {
          "name": "Maryland",
          "dcid": "geoId/24"
        },
        {
          "name": "Massachusetts",
          "dcid": "geoId/25"
        },
        {
          "name": "Michigan",
          "dcid": "geoId/26"
        },
        {
          "name": "Minnesota",
          "dcid": "geoId/27"
        },
        {
          "name": "Mississippi",
          "dcid": "geoId/28"
        },
        {
          "name": "Missouri",
          "dcid": "geoId/29"
        },
        {
          "name": "Montana",
          "dcid": "geoId/30"
        },
        {
          "name": "Nebraska",
          "dcid": "geoId/31"
        },
        {
          "name": "Nevada",
          "dcid": "geoId/32"
        },
        {
          "name": "New Hampshire",
          "dcid": "geoId/33"
        },
        {
          "name": "New Jersey",
          "dcid": "geoId/34"
        },
        {
          "name": "New Mexico",
          "dcid": "geoId/35"
        },
        {
          "name": "New York",
          "dcid": "geoId/36"
        },
        {
          "name": "North Carolina",
          "dcid": "geoId/37"
        },
        {
          "name": "North Dakota",
          "dcid": "geoId/38"
        },
        {
          "name": "Ohio",
          "dcid": "geoId/39"
        },
        {
          "name": "Oklahoma",
          "dcid": "geoId/40"
        },
        {
          "name": "Oregon",
          "dcid": "geoId/41"
        },
        {
          "name": "Pennsylvania",
          "dcid": "geoId/42"
        },
        {
          "name": "Rhode Island",
          "dcid": "geoId/44"
        },
        {
          "name": "South Carolina",
          "dcid": "geoId/45"
        },
        {
          "name": "South Dakota",
          "dcid": "geoId/46"
        },
        {
          "name": "Tennessee",
          "dcid": "geoId/47"
        },
        {
          "name": "Texas",
          "dcid": "geoId/48"
        },
        {
          "name": "Utah",
          "dcid": "geoId/49"
        },
        {
          "name": "Vermont",
          "dcid": "geoId/50"
        },
        {
          "name": "Virginia",
          "dcid": "geoId/51"
        },
        {
          "name": "Washington",
          "dcid": "geoId/53"
        },
        {
          "name": "West Virginia",
          "dcid": "geoId/54"
        },
        {
          "name": "Wisconsin",
          "dcid": "geoId/55"
        },
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
      "entity": "country/IND",
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
  ]
}
```
{: .example-box-content .scroll}
