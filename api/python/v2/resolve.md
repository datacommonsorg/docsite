---
layout: default
title: Resolve entities
nav_order: 6
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Resolve

The Resolve API returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph.
Each entity in Data Commons has an associated `DCID` which is used to refer to it
in other API calls or programs. An important step for a Data Commons developer is to
identify the DCIDs of entities they care about. This API searches for an entry in the
Data Commons knowledge graph and returns the DCIDs of matches. You can use
common properties or even descriptive words to find entities.

For example, you could query for "San Francisco, CA" or "San Francisco" to find
that its DCID is `geoId/0667000`. You can also provide the type of entity
(country, city, state, etc.) to disambiguate between candidates (for example, Georgia the country vs. Georgia
the US state).

Note that you can only resolve entities by some terminal properties. You cannot resolve properties that represent linked entities with incoming or outgoing arc relationships. For that, you need to use the [Node](node.md) API. For example, if you wanted to get all the DCIDs of entities that are related to a given entity by the `containedInPlace` property (say, all states in the United States), use the Node API.

> **Note**: Currently, this endpoint only supports [place](/glossary.html#place) entities.

[Source code](https://github.com/datacommonsorg/api-python/blob/master/datacommons_client/endpoints/resolve.py){: target="_blank"}

* TOC
{:toc}

## Request methods

The following are the methods available for the `resolve` endpoint.

| Method | Description | 
|--------|-------------|
| [fetch](#fetch) | Resolve entities by using a [relation expression](/api/rest/v2/index.html#relation-expressions) for the property or properties to search on. |
| [fetch_dcids_by_name](#fetch_dcids_by_name) | Look up DCIDs of entities by name. |
| [fetch_dcids_by_wikidata_id](#fetch_dcids_by_wikidata_id) | Look up DCIDs of entities by Wikidata ID. |
| [fetch_dcid_by_coordinates](#fetch_dcid_by_coordinates) | Look up a DCID of a single entity by geographical coordinates. |

## Response

All request methods return a `ResolveResponse` object. It looks like this:

The response looks like:

<pre>
{
  "entities": [
    {
      "node": "<var>NODE_1</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_1</var>",
          "dominantType": "<var>TYPE_OF_DCID_1</var>"
        },
      ]
    },
    {
      "node": "<var>NODE_2</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_2</var>",
          "dominantType": "<var>TYPE_OF_DCID_2</var>"
        },
      ]
    },
    ...
  ]
}
</pre>
{: .response-signature .scroll}

### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| node | string | The property value or description provided. |
| candidates | list | DCIDs matching the description you provided.
| dominantType | string | Optional field which, where present, disambiguates between multiple results. |
{: .doc-table}

### Response property methods

You can call the following methods on the `ResolveResponse` object:

| Method | Description | 
|--------|-------------|
| to_dict | Converts the dataclass to a Python dictionary. See [Response formatting](index.md#response-formatting) for details. |
| to_json | Serializes the dataclass to a JSON string (using `json.dumps()`). See [Response formatting](index.md#response-formatting) for details. |
| to_flat_dict | Flattens resolved candidate data into a dictionary where each node maps to a list of candidates. If a node has only one candidate, it maps directly to the candidate instead of a list. <!--- TODO: Add examples of these ---> |

{: .doc-table}

## fetch

Resolve entities to DCIDs by using a relation expression to specify the property being used to identify candidates.

### Signature

```python
fetch(node_ids, expression)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| node_ids <br /> <required-tag>Required</required-tag>  | string or list of strings | A term or list of terms that identify each node to search for, such as their name. |
| expression <br /> <required-tag>Required</required-tag> | string | An expression that describes the identifier used in the `node_ids` parameter. Only three are currently supported: <br />`<-description`: Search for nodes based on name-related properties (such as `name`, `alternateName`, etc.).<br/>`<-wikidataId`: Search for nodes based on their Wikidata ID(s).<br/>`<-geoCoordinates`: Search for nodes based on latitude and/or longitude.<br/> Note that these are not necessarily "properties" that appear in the knowledge graph; instead, they are "synthetic" attributes that cover searches over multiple properties. <br/>Each expression must end with `->dcid` and may optionally include a [`typeOf` filter](/api/rest/v2/index.html#filters). |
{: .doc-table }

### Examples

{: #fetch_ex1}
{: .no_toc}
#### Example 1: Find the DCID of a place by another known ID

This queries for the DCID of a place by its Wikidata ID. This property is represented in the graph by [`wikidataId`](https://datacommons.org/browser/wikidataId){: target="_blank"}.

Request:
{: .example-box-title}

```python
resolve.fetch(node_ids="Q30", expression="<-wikidataId->dcid")
```

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "Q30",
         "candidates" : [
            {
               "dcid" : "country/USA"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 2: Find the DCID of places by name, with a type filter

This queries for the DCIDs of "Mountain View" and "California" (cities) using their names, and filters for only cities to be returned in the results. Notice that there are 4 cities named "California"!

Request:
{: .example-box-title}

```python
resolve.fetch(node_ids = ["Mountain View, CA", "California"], expression="<-description{typeOf:City}->dcid")
```

Response:
{: .example-box-title}

```json
{
  "entities": [
    {
      "node": "California",
      "candidates": [
        {
          "dcid": "geoId/2412150"
        },
        {
          "dcid": "geoId/4210768"
        },
        {
          "dcid": "geoId/2910468"
        },
        {
          "dcid": "geoId/2111872"
        }
      ]
    },
    {
      "node": "Mountain View, CA",
      "candidates": [
        {
          "dcid": "geoId/0649670"
        },
        {
          "dcid": "geoId/0649651"
        }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}

## fetch_dcids_by_name

Resolve entities to DCIDs by using a name.

### Signature

```python
fetch_dcids_by_name(names, entity_type)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| names <br /> <required-tag>Required</required-tag>  | string or list of strings | The names or descriptions of the entities to look up. |
| entity_type <br /> <optional-tag>Optional</optional-tag> | string | The type of the entities to be returned. This acts as a filter, by limiting the number of result candidates limit the number of possible candidates (like using the `typeof` parameter in the `fetch` method).|
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCID of a place by name

This queries for the DCID of "Georgia". Notice that specifying `Georgia` without an `entity_type` parameter returns all possible DCIDs with the same name: the state of Georgia in USA ([geoId/13](https://datacommons.org/browser/geoId/13){: target="_blank"}), the country Georgia ([country/GEO](https://datacommons.org/browser/country/GEO){: target="_blank"}) and the city Georgia in the US state of Vermont ([geoId/5027700](https://datacommons.org/browser/geoId/5027700){: target="_blank"}).

Request:
{: .example-box-title}

```python
resolve.fetch_dcids_by_name(names="Georgia")
```

> Tip: This example is equivalent to `resolve.fetch(node_ids="Georgia", expression="<-description->dcid")`.

Response:
{: .example-box-title}

```json
{ 
   "entities" : [
      {
        "node" : "Georgia",
        "candidates" : [
            {
               "dcid" : "geoId/13"
            },
            {
               "dcid" : "country/GEO"
            },
            {
               "dcid" : "geoId/5027700"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 2: Find the DCID of a place by name, with a type filter

This queries for the DCID of "Georgia", the U.S. State. Unlike in the previous example, here
we also specify the entity type as a filter and only get one place in the response.

Request:
{: .example-box-title}

```python
resolve.fetch_dcids_by_name(names="Georgia", entity_type="State")
```
> Tip: This example is equivalent to `resolve.fetch(node_ids="Georgia", expression="<-description{typeOf:State}->dcid")`.

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "Georgia",
         "candidates" : [
            {
               "dcid" : "geoId/13"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

## fetch_dcids_by_wikidata_id

Resolve entities to DCIDs by Wikidata ID.

### Signature

```python
fetch_dcids_by_wikidata_id(wikidata_ids, entity_type)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| wikidata_ids <br /> <required-tag>Required</required-tag>  | string or list of strings | The Wikidata ID(s) of the entities to look up. |
| entity_type <br /> <optional-tag>Optional</optional-tag> | string | See [fetch_dcids_by_name](#fetch_dcids_by_name) for description. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCID of a place by Wikidata ID

This example is identical to [example 1](#fetch_ex1) of the `fetch` method.

Request:
{: .example-box-title}

```python
resolve.fetch_dcids_by_wikidata_id(wikidata_ids="Q30")
```

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "Q30",
         "candidates" : [
            {
               "dcid" : "country/USA"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}

## fetch_dcid_by_coordinates

Resolve an entity to its DCID by geo coordinates.

### Signature

```python
fetch_dcid_by_coordinates(latitude, longitude, entity_type)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| latitude <br /> <required-tag>Required</required-tag>  | string | The latitude of the entity to look up. It should be expressed in decimal format e.g., `37.42` |
| longitude <br /> <required-tag>Required</required-tag>  | string | The longitude of the entity to look up. It should be expressed in decimal format e.g, `-122.08` |
| entity_type <br /> <optional-tag>Optional</optional-tag> | string | See [fetch_dcids_by_name](#fetch_dcids_by_name) for description. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCID of a place by coordinates

This queries for the DCID of "Mountain View" by its latitude and longitude.

Request:
{: .example-box-title}

```python
resolve.fetch_dcid_by_coordinates(latitude = "37.42", longitude = "-122.08")
```

> Tip: This is equivalent to `client.resolve.fetch(node_ids=["37.42#-122.08"], expression= "<-geoCoordinate->dcid")`

Response:
{: .example-box-title}

```json
{
   "entities" : [
      {
         "node" : "37.42#-122.08",
         "candidates" : [
            {
               "dcid" : "geoId/0649670",
               "dominantType" : "City"
            },
            {
               "dcid" : "geoId/06085",
               "dominantType" : "County"
            },
            {
               "dcid" : "geoId/06",
               "dominantType" : "State"
            },
            {
               "dcid" : "country/USA",
               "dominantType" : "Country"
            },
            {
               "dcid" : "geoId/06085504601",
               "dominantType" : "CensusTract"
            },
            {
               "dcid" : "geoId/060855046011",
               "dominantType" : "CensusBlockGroup"
            },
            {
               "dcid" : "geoId/0608592830",
               "dominantType" : "CensusCountyDivision"
            },
            {
               "dcid" : "geoId/0618",
               "dominantType" : "CongressionalDistrict"
            },
            {
               "dcid" : "geoId/sch0626280",
               "dominantType" : "SchoolDistrict"
            },
            {
               "dcid" : "ipcc_50/37.25_-122.25_USA",
               "dominantType" : "IPCCPlace_50"
            },
            {
               "dcid" : "zip/94043",
               "dominantType" : "CensusZipCodeTabulationArea"
            }
         ],
      }
   ]
}
```
{: .example-box-content .scroll}
