---
layout: default
title: Properties
parent: REST (v1)
grand_parent: API
nav_exclude: true
published: false
permalink: /api/rest/v1/bulk/properties
---

# /v1/bulk/properties

Get all [properties](/glossary.html#property) associated with a specific node,
for multiple nodes.

More specifically, this endpoint returns the labels of the edges connected to a
specific node in the Data Commons Knowledge Graph. Edges in the graph are
directed, so properties can either be labels for edges _towards_ or _away_ from
the node. Outgoing edges correspond to properties of the node. Incoming edges
denote that the node is the value of this property for some other node.

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To the values of properties, see [/v1/bulk/property/values](/api/rest/v1/bulk/property/values).<br />
    To find connected edges and nodes, see [/v1/bulk/triples](/api/rest/v1/bulk/triples).<br />
    For querying a single node with simpler output, see the [simple version](/api/rest/v1/properties) of this endpoint.
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
https://api.datacommons.org/v1/bulk/properties/{EDGE_DIRECTION}?nodes={node_dcid_1}&nodes={node_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/properties/{EDGE_DIRECTION}

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "nodes":
  [
    "{value_1}",
    "{value_2}",
    ...
  ]
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. Denotes direction of edges to get triples for. <br /><br />If `in`, returns properties represented by edges pointing _toward_ the node provided. If `out`, returns properties represented by edges pointing _away_ from the node provided. |
{: .doc-table }

### Query Parameters

| Name                                               | Type   | Description                                                                                                                                                     |
| -------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag> | string | [DCIDs](/glossary.html#dcid) of the nodes to query.                                                                                                             |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "node": "node_1_dcid",
      "properties":
      [
        "property_1",
        "property_2",
        ...
      ]
    },
    {
      "node": "node_2_dcid",
      "properties":
      [
        "property_1",
        "property_2",
        ...
      ]

    }, ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name       | Type   | Description                                                                                   |
| ---------- | ------ | --------------------------------------------------------------------------------------------- |
| node       | string | [DCID](/glossary.html#dcid) of the node queried.                                              |
| properties | list   | List of properties connected to the node queried, for the direction specified in the request. |
{: .doc-table}

## Examples

### Example 1: Get properties for mulitple nodes.

Get properties describing the US states of Virgina (DCID: `geoId/51`), Maryland
(DCID: `geoId/24`), and Delaware (DCID: `geoId/10`).

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/properties/out?nodes=geoId/51&nodes=geoId/24&nodes=geoId/10&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/properties/out \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"nodes":["geoId/51", "geoId/24", "geoId/10"]}'
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
      "node": "geoId/51",
      "properties":
      [
        "administrativeCapital",
        "alternateName",
        "archinformLocationId",
        < ... output truncated for brevity ... >
        "whosOnFirstId",
        "wikidataId",
        "worldcatIdentitiesId"
      ]
    },
    {
      "node": "geoId/24",
      "properties":
      [
        "administrativeCapital",
        "alternateName",
        "archinformLocationId",
        < ... output truncated for brevity ... >
        "whosOnFirstId",
        "wikidataId",
        "worldcatIdentitiesId"
      ]
    },
    {
      "node": "geoId/10",
      "properties":
      [
        "administrativeCapital",
        "alternateName",
        "archinformLocationId",
        < ... output truncated for brevity ... >
        "whosOnFirstId",
        "wikidataId",
        "worldcatIdentitiesId"
      ]
    }
  ]
}
```
{: .example-box-content .scroll}
