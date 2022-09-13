---
layout: default
title: Properties
nav_order: 2
parent: REST (v1)
grand_parent: API
published: false
permalink: /api/rest/v1/properties
---

# /v1/properties

Get all [properties](/glossary.html#property) associated with a specific node.

More specifically, this endpoint returns the labels of the edges connected to a
specific node in the Data Commons Knowledge Graph. Edges in the graph are
directed, so properties can either be labels for edges _towards_ or _away_ from
the node. Outgoing edges correspond to properties of the node. Incoming edges
denote that the node is the value of this property for some other node.

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To find all possible values of a specific property, see [/v1/property/values](/api/rest/v1/property/values).<br />
    To find connected edges and nodes, see [/v1/triples](/api/rest/v1/triples).<br />
    For querying multiple nodes, see the [bulk version](/api/rest/v1/bulk/properties) of this endpoint.
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
http://api.datacommons.org/v1/properties/{EDGE_DIRECTION}/{NODE_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                        | Description                                                                                                                                                           |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EDGE_DIRECTION <br /> <required-tag>Required</required-tag> | One of `in` or `out`. <br /><br />If `in`, returns properties for which the queried node is a value. If `out`, returns properties that describe the queried node. |
| NODE_DCID <br /> <required-tag>Required</required-tag>    | [DCID](/glossary.html#dcid) of the node to query.                                                                                                                   |
{: .doc-table }

### Query Parameters

| Name                                             | Type   | Description                                                                                                                                                     |
| ------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag> | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
{: .doc-table}

## Response

The response looks like:

```json
{
  "node": "Node DCID",
  "properties": [
    "property_name_1",
    "property_name_2",
    ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name       | Type   | Description                                                                                     |
| ---------- | ------ | ----------------------------------------------------------------------------------------------- |
| node     | string | [DCID](/glossary.html#dcid) of the node queried.                                              |
| properties | list   | List of properties connected to the node queried, for the direction specified in the request. |
{: .doc-table}

## Examples

### Example 1: Get properties describing a node

Get all properties that describe the city of Chicago, IL, USA (DCID:
`geoId/1714000`).

Request:
{: .example-box-title}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/properties/out/geoId/1714000'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "node": "geoId/1714000",
  "properties": [
    "alternateName",
    "ansiCode",
    "archinformLocationId",
    "babelnetId",
    "brockhausEncylcopediaOnlineId",
    "censusAreaDescriptionCode",
    "censusFunctionalStatusCode",
    "containedInPlace",
    "czechNkcrAutId",
    "encyclopediaBritannicaOnlineId",
    "encyclopediaUniversalisId",
    "facebookPlacesId",
    "finlandYsoId",
    "fips553",
    "franceNationalLibraryId",
    "geoId",
    "geoJsonCoordinates",
    "geoOverlaps",
    "gettyThesaurusOfGeographicNamesId",
    "gndId",
    "gnisId",
    "granEnciclopediaCatalanaId",
    "iataAirportCode",
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
    "postalCode",
    "provenance",
    "quoraTopicId",
    "swedishNationalEncyclopediaId",
    "typeOf",
    "unitedKingdomParliamentThesaurusId",
    "unitedNationsLocode",
    "unitedStatesNationalArchivesIdentifier",
    "uppsalaUniversityAlvinId",
    "viafId",
    "waterArea",
    "whereOnEarthId",
    "whosOnFirstId",
    "wikidataId",
    "worldcatIdentitiesId"
  ]
}
```
{: .example-box-content .scroll}

### Example 2: Get properties that have the queried node as a value

Find all properties that have carbon dioxide (DCID: `CarbonDioxide`) as a value.

Request:
{: .example-box-title}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/properties/in/CarbonDioxide&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "node": "CarbonDioxide",
  "properties": ["emittedThing"]
}
```
{: .example-box-content .scroll}
