---
layout: default
title: Info of a place
nav_order: 1
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/info/place
---



# /v1/info/place

Get basic information about a [place](/glossary.html#place).

This API returns basic information on a place, given the place's [DCID](/glossary.html#dcid). The information provided includes the place's name, type (city, state, country, etc.), as well as information on all parent places that contain the place queried.

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>Tip:</b><br />
   For a rich, graphical exploration of places available in the Data Commons knowledge graph, take a look at the [Place Explorer](https://datacommons.org/place).
</div>

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To get information on a variable instead of a place, see [/v1/info/variable](/api/rest/v1/info/variable).<br />
   For querying multiple places, see the [bulk version](/api/rest/v1/bulk/info/place) of this endpoint.
</div>



## Request
GET Request
{: .api-header}

<div class="api-signature">
https://api.datacommons.org/v1/info/place/{PLACE_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>


### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| PLACE_DCID <br /> <required-tag>Required</required-tag> | [DCID](/glossary.html#dcid) of the place to query information for. |
{: .doc-table}

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag> | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
{: .doc-table }

## Response

The response looks like:

```json
{
    "entity": "Place DCID",
    "info":
    {
        "self":
        {
            "dcid": "Place DCID",
            "name": "Place Name",
            "type": "State/City/Country/Etc"
        },
        "parents":
        [
            {
                "dcid": "Containing Place DCID",
                "name": "Containing Place Name",
                "type": "State/City/Country/Etc"
            }, ...
        ]
    }
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| entity   | string | [DCID](/glossary.html#dcid) of the place queried. |
| info     | object | Information about the place queried. Includes the name and type (city, state, country, etc.) of the place, as well as those of all "parent" places that contain the place queried (e.g. North America is a parent place of the United States). |
{: .doc-table}

## Examples

### Example 1: Get information on a single variable

Get basic information about New York City (DCID: `geoId/3651000`).

Request:
{: .example-box-title}
```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/info/place/geoId/3651000?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
```json
{
  "entity": "geoId/3651000",
  "info":
  {
    "self":
    {
      "dcid": "geoId/3651000",
      "name": "New York",
      "type": "City"
    },
    "parents":
    [
      {
        "dcid": "geoId/36085",
        "name": "Richmond County",
        "type": "County"
      },
      {
        "dcid": "geoId/36081",
        "name": "Queens",
        "type": "County"
      },
      {
        "dcid": "geoId/36061",
        "name": "Manhattan",
        "type": "County"
      },
      {
        "dcid": "geoId/36047",
        "name": "Brooklyn",
        "type": "County"
      },
      {
        "dcid": "geoId/36005",
        "name": "Bronx County",
        "type": "County"
      },
      {
        "dcid": "geoId/36",
        "name": "New York",
        "type": "State"
      },
      {
        "dcid": "geoId/3651000",
        "name": "New York",
        "type": "City"
      },
      {
        "dcid": "usc/MiddleAtlanticDivision",
        "name": "Middle Atlantic Division",
        "type": "CensusDivision"
      },
      {
        "dcid": "country/USA",
        "name": "United States",
        "type": "Country"
      },
      {
        "dcid": "usc/NortheastRegion",
        "name": "Northeast Region"
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
```
{: .example-box-content .scroll}



