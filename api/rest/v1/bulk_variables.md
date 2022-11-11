---
layout: default
title: <bulk-tag>BULK</bulk-tag> Variables
parent: REST (v1)
grand_parent: API
nav_order: 112
published: true
permalink: /api/rest/v1/bulk/variables
---

# /v1/bulk/variables

Get all [variables](/glossary.html#variable) with data associated with a
specific entity, for multiple entities.

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For querying a single entity with simpler output, see the [simple version](/api/rest/v1/variables) of this endpoint.
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

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/variables?entities={entity_dcid_1}&entities={entity_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/variables

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities":
    [
      "{entity_dcid_1}",
      "{entity_dcid_2}",
      ...
    ]
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

There are no path parameters for this endpoint.

### Query Parameters

| Name                                                   | Type   | Description                                                                                                                                                     |
| ------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>       | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| variables <br /> <required-tag>Required</required-tag> | list   | List of variables associated with the entity queried.                                                                                                           |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "entity": "entity_dcid_1",
      "variables":
      [
        "variable_dcid_1",
        "variable_dcid_2",
        ...
      ]
    },
    {
      "entity": "entity_dcid_2",
      "variables":
      [
        "variable_dcid_1",
        "variable_dcid_2",
        ...
      ], ...
    }
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name      | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| entity    | string | [DCID](/glossary.html#dcid) of the entity queried. |
| variables | list   | List of variables connected to the entity queried. |
{: .doc-table}

## Examples

### Example 1: Get variables associated with multiple entities.

Get variables for the cities of Tokyo, Japan (DCID: `wikidataId/Q1490`) and
Seoul, South Korea (DCID: `wikidataId/Q8684`).

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/variables?entities=wikidataId/Q1490&entities=wikidataId/Q8684&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/variables \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":["wikidataId/Q1490", "wikidataId/Q8684"]}'
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
      "entity": "wikidataId/Q1490",
      "variables":
      [
        "Count_CycloneEvent",
        "Count_CycloneEvent_TropicalStorm",
        "Count_Person",
        < ... output truncated for brevity ... >
        "Min_Rainfall",
        "Min_Snowfall",
        "Min_Temperature"
      ]
    },
    {
      "entity": "wikidataId/Q8684",
      "variables":
      [
        "Count_Death",
        "Count_Death_10To14Years_Female",
        "Count_Death_10To14Years_Male",
        < ... output truncated for brevity ...>
        "dc/sw43w4pbtgq4d",
        "dc/x73k9t2mzzcs2",
        "dc/xh9d9e2le1r41"
      ]
    }
  ]
}
```
{: .example-box-content .scroll}
