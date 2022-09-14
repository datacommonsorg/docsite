---
layout: default
title: Property Values
nav_exclude: true
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/property/values
---

# /v1/bulk/property/values

Get the values of a [property](/glossary.html#property) for multiple nodes.

Data Commons represents properties as labels of directed edges between nodes,
where the successor node is a value of the property. Thus, this endpoint returns
nodes connected to the queried node via the property queried.

_Note: If you want to query values for the property `containedInPlace`, consider
using
[/v1/bulk/property/values/linked](/api/rest/v1/bulk/property/values/linked)
instead._

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To get a list of properties available for an node, see [/v1/bulk/properties](/api/rest/v1/bulk/properties).<br />
    For single queries with a simpler output, see the [simple version](/api/rest/v1/property/values) of this endpoint.
</div>

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/property/values/{EDGE_DIRECTION}?property={property_dcid}&nodes={node_dcid_1}&nodes={node_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/property/values/{EDGE_DIRECTION}

Header:
X-API-Key: {your_api_key}

JSON Data:
{ 
  "property": "property_dcid",
  "nodes": [
    "{node_dcid_1}",
    "{node_dcid_2}",
    ...
  ]
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. <br /><br />If `in`, returns nodes for which the queried node is a property value. If `out`, returns values of properties describing the node queried. |
{: .doc-table }

### Query Parameters

| Name                                                  | Type   | Description                                                                                                                                                     |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag> | list   | [DCIDs](/glossary.html#dcid) of the entitis to query.                                                                                                           |
| property <br /> <required-tag>Required</required-tag> | string | [DCID](/glossary.html#dcid) of the property to query.                                                                                                           |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "node": "connected_node_dcid",
      "values":
      [
        {
          "property_of_connected_node_1": "value",
          "property_of_connected_node_1": "value",
          ...
        },
        {
          "property_of_connected_node_2": "value",
          "property_of_connected_node_2": "value",
          ...
        }
      ]
    },
    {
      "node": "connected_node_dcid_2",
      "values":
      [
        {
          "property_of_connected_node_1": "value",
          "property_of_connected_node_1": "value",
          ...
        },
        {
          "property_of_connected_node_2": "value",
          "property_of_connected_node_2": "value",
          ...
        }
      ]
    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name   | Type   | Description                                        |
| ------ | ------ | -------------------------------------------------- |
| node | string | [DCID](/glossary.html#dcid) of the node queried. |
| values | list   | list of nodes connected by the property queried.   |
{: .doc-table}

## Examples

### Example 1: Get property values for multiple nodes

Get the names (property: `name`) of nodes with DCIDs `wikidataId/Q27119`,
`wikidataId/Q27116`, and `wikidataId/Q21181`.

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/property/values/out?property=name&nodes=wikidataId/Q27119&nodes=wikidataId/Q27116&nodes=wikidataId/Q21181&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/property/values/out \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"nodes":["wikidataId/Q27119", "wikidataId/Q27116", "wikidataId/Q21181"], "property":"name"}'
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
      "node": "wikidataId/Q27119",
      "values": [
        {
          "provenanceId": "dc/5n63hr1",
          "value": "Kolding"
        }
      ]
    },
    {
      "node": "wikidataId/Q27116",
      "values": [
        {
          "provenanceId": "dc/5n63hr1",
          "value": "Vejle"
        }
      ]
    },
    {
      "node": "wikidataId/Q21181",
      "values": [
        {
          "provenanceId": "dc/5n63hr1",
          "value": "Fredericia"
        }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}
