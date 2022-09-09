---
layout: default
title: Info on a place
nav_exclude: true
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/info/place
---



## /v1/bulk/info/place

Get basic information about multiple [places](/glossary.md#place).

This API returns basic information on multiple places, given each of their DCIDs. The information provided is per place, and includes the place's name, type (city, state, country, etc.), as well as information on all parent places that contain the place queried.

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>Tip:</b><br />
   For a rich, graphical exploration of places available in the Data Commons knowledge graph, take a look at the [Place Explorer](https://datacommons.org/place).
</div>

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To get information on a variable instead of a place, see [/v1/bulk/info/variable](/api/rest/v1/info/variable).<br />
    For querying a single variable and a simpler output, see the [simple version](/api/rest/v1/info/place) of this endpoint.
</div>



## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET Request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST Request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature"><div class="scroll">
https://api.datacommons.org/v1/bulk/info/place?entities={place_dcid_1}&entities={place_dcid_2}&key={your_api_key}
</div></div>


<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/info/place

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities": [
    "{place_dcid_1}",
    "{place_dcid_2}",
    ...
  ]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>


### Path Parameters

This endpoint has no path parameters.

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag> | string | Your API Key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| entities <br /> <required-tag>Required</required-tag> | string | [DCIDs](/glossary.md#dcid) of the places to query information for. |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "entity": "place_dcid_1",
      "info":
      {
        "self":
        {
          "dcid": "place_dcid_1",
          "name": "Place Name",
          "type": "City/State/Country/Etc"
        },
        "parents":
        [
          {
            "dcid": "Containing Place DCID",
            "name": "Containing Place Name",
            "type": "City/State/Country/Etc"
          }, ...
        ]
      }
    },
    {
      "entity": "place_dcid_2",
      "info": {...}
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| entity   | string | [DCID](/glossary.md#dcid) of the places queried. |
| info     | object | Information about the place queried. Includes the name and type (city, state, country, etc.) of the place, as well as those of all "parent" places that contain the place queried (e.g. North America is a parent place of the United States). |
{: .doc-table}

## Examples

### Example 1: Get information for multiple places

Get information on the US states of California (DCID: `geoId/06`) and Alaska (DCID: `geoId/02`).

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/info/place?entities=geoId/06&entities=geoId/06&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/info/place \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":["geoId/06", "geoId/02"]}'
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
      "entity": "geoId/06",
      "info":
      {
        "self":
        {
          "dcid": "geoId/06",
          "name": "California",
          "type": "State"
        },
        "parents":
        [
          {
            "dcid": "usc/PacificDivision",
            "name": "Pacific Division",
            "type": "CensusDivision"
          },
          {
            "dcid": "country/USA",
            "name": "United States",
            "type": "Country"
          },
          {
            "dcid": "usc/WestRegion",
            "name": "West Region"
          },
          {
            "dcid": "northamerica",
            "name": "North America",
            "type": "Continent"
          },
          {
            "dcid": "Earth",
            "name": "Earth",
            "type": "Place"
          }
        ]
      }
    },
    {
      "entity": "geoId/02",
      "info":
      {
        "self":
        {
          "dcid": "geoId/02",
          "name": "Alaska",
          "type": "State"
        },
        "parents":
        [
          {
            "dcid": "usc/PacificDivision",
            "name": "Pacific Division",
            "type": "CensusDivision"
          },
          {
            "dcid": "country/USA",
            "name": "United States",
            "type": "Country"
          },
          {
            "dcid": "usc/WestRegion",
            "name": "West Region"
          },
          {
            "dcid": "northamerica",
            "name": "North America",
            "type": "Continent"
          },
          {
            "dcid": "Earth",
            "name": "Earth",
            "type": "Place"
          }
        ]
      }
    }
  ]
}
```
{: .example-box-content .scroll}
