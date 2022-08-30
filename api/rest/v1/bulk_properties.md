---
layout: default
title: Rest API Bulk Page Template
parent: v1 REST
grand_parent: API
nav_exclude: true
published: false
permalink: /api/rest/v1/bulk/properties
---

# /v1/bulk/properties

Get all [properties](/glossary.html#property) associated with a specific entity, for multiple entities.

More specifically, this endpoint returns the labels of the edges connected to a specific node in the Data Commons Knowledge Graph. Edges in the graph are directed, so properties can either be labels for edges _towards_ or _away_ from the node. Outgoing edges correspond to properties of the node. Incoming edges denote that the node is the value of this property for some other node.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To the values of properties, see [/v1/bulk/property/values](/api/rest/v1/bulk/property/values).<br />
    To find connected edges and nodes, see [/v1/bulk/triples](/api/rest/v1/bulk/triples).<br />
    For querying a single entity with simpler output, see the [simple version](/api/rest/v1/properties) of this endpoint.
</div>
 

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div> 

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/properties/{EDGE_DIRECTION}?entities={entity_dcid_1}&entities={entity_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/properties/{EDGE_DIRECTION}

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities": [
    "{value_1}",
    "{value_2}",
    ...
  ]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | description of parameter here |
{: .doc-table }

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| entities <br /> <required-tag>Required</required-tag> | string | [DCIDs](/glossary.html#dcid) of the entities to query. |
{: .doc-table }
 
 

## Response

 
The response looks like:
 
```json
{
  "data":
  [
    {
      "entity": "entity_1_dcid",
      "properties":
      [
        "property_1",
        "property_2",
        ...
      ]
    },
    {
      "entity": "entity_2_dcid",
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

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| entity   | string   | [DCID](/glossary.html#dcid) of the entity queried. |
| properties | list | List of properties connected to the entity queried, for the direction specified in the request. |
{: .doc-table}
 

## Examples

 

### Example 1: Get properties describing multiple entities.

Get properties describing the US states of Virgina (DCID: `geoId/51`), Maryland (DCID: `geoId/24`), and Delaware (DCID: `geoId/10`).

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/properties/out?entities=geoId/51&entities=geoId/24&entities=geoId/10&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/end/point \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":["geoId/51", "geoId/24", "geoId/10"]}'
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
      "entity": "geoId/51",
      "properties":
      [
        "administrativeCapital",
        "alternateName",
        "archinformLocationId",
        "area",
        "babelnetId",
        "bbcThingsId",
        "containedInPlace",
        "czechNkcrAutId",
        "encyclopediaBritannicaOnlineId",
        "encyclopediaLarousseId",
        "finlandYsoId",
        "fips104",
        "fips52AlphaCode",
        "gacsId",
        "geoId",
        "geoJsonCoordinates",
        "geoJsonCoordinatesDP1",
        "geoJsonCoordinatesDP2",
        "geoJsonCoordinatesDP3",
        "gettyThesaurusOfGeographicNamesId",
        "gndId",
        "gnisId",
        "granEnciclopediaCatalanaId",
        "greatRussianEncyclopediaOnlineId",
        "isoCode",
        "kmlCoordinates",
        "landArea",
        "latitude",
        "libraryOfCongressAuthorityId",
        "longitude",
        "musicbrainzAreaId",
        "name",
        "nameWithLanguage",
        "nationalDietLibraryId",
        "nearbyPlaces",
        "osmRelationId",
        "provenance",
        "quoraTopicId",
        "ringgoldId",
        "selibrId",
        "typeOf",
        "unitedStatesNationalArchivesIdentifier",
        "viafId",
        "waterArea",
        "whosOnFirstId",
        "wikidataId",
        "worldcatIdentitiesId"
      ]
    },
    {
      "entity": "geoId/24",
      "properties":
      [
        "administrativeCapital",
        "alternateName",
        "archinformLocationId",
        "area",
        "babelnetId",
        "bbcThingsId",
        "containedInPlace",
        "czechNkcrAutId",
        "encyclopediaBritannicaOnlineId",
        "encyclopediaLarousseId",
        "finlandYsoId",
        "fips104",
        "fips52AlphaCode",
        "franceNationalLibraryId",
        "gacsId",
        "geoId",
        "geoJsonCoordinates",
        "geoJsonCoordinatesDP1",
        "geoJsonCoordinatesDP2",
        "geoJsonCoordinatesDP3",
        "gettyThesaurusOfGeographicNamesId",
        "gndId",
        "gnisId",
        "granEnciclopediaCatalanaId",
        "isoCode",
        "israelNationalLibraryId",
        "kmlCoordinates",
        "landArea",
        "latitude",
        "libraryOfCongressAuthorityId",
        "longitude",
        "musicbrainzAreaId",
        "name",
        "nameWithLanguage",
        "nationalDietLibraryId",
        "nearbyPlaces",
        "osmRelationId",
        "provenance",
        "quoraTopicId",
        "ringgoldId",
        "selibrId",
        "spainNationalLibraryId",
        "swedishNationalEncyclopediaId",
        "typeOf",
        "unitedStatesNationalArchivesIdentifier",
        "viafId",
        "waterArea",
        "whosOnFirstId",
        "wikidataId",
        "worldcatIdentitiesId"
      ]
    },
    {
      "entity": "geoId/10",
      "properties":
      [
        "administrativeCapital",
        "alternateName",
        "archinformLocationId",
        "area",
        "babelnetId",
        "bbcThingsId",
        "containedInPlace",
        "czechNkcrAutId",
        "encyclopediaBritannicaOnlineId",
        "encyclopediaLarousseId",
        "finlandYsoId",
        "fips104",
        "fips52AlphaCode",
        "franceIdRefId",
        "franceNationalLibraryId",
        "gacsId",
        "geoId",
        "geoJsonCoordinates",
        "geoJsonCoordinatesDP1",
        "geoJsonCoordinatesDP2",
        "geoJsonCoordinatesDP3",
        "gettyThesaurusOfGeographicNamesId",
        "gndId",
        "gnisId",
        "granEnciclopediaCatalanaId",
        "isoCode",
        "israelNationalLibraryId",
        "kmlCoordinates",
        "landArea",
        "latitude",
        "libraryOfCongressAuthorityId",
        "longitude",
        "musicbrainzAreaId",
        "name",
        "nameWithLanguage",
        "nearbyPlaces",
        "osmRelationId",
        "provenance",
        "quoraTopicId",
        "ringgoldId",
        "selibrId",
        "swedishNationalEncyclopediaId",
        "typeOf",
        "unitedStatesNationalArchivesIdentifier",
        "viafId",
        "waterArea",
        "whosOnFirstId",
        "wikidataId",
        "worldcatIdentitiesId"
      ]
    }
  ]
}
```
{: .example-box-content .scroll}
 
 
