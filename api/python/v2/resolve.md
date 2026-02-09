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

You can also query for statistical variables and topics. For example, you could find the DCIDs for all statistical variables related to the string "population".

[Source code](https://github.com/datacommonsorg/api-python/blob/master/datacommons_client/endpoints/resolve.py){: target="_blank"}

* TOC
{:toc}

## Request methods

The following are the methods available for the `resolve` endpoint.

| Method | Description | 
|--------|-------------|
| [fetch](#fetch) | Resolve entities by name/description or by [relation expression](/api/rest/v2/index.html#relation-expressions) containing a property to search on. |
| [fetch_dcids_by_name](#fetch_dcids_by_name) | Look up DCIDs of places by name. |
| [fetch_dcids_by_wikidata_id](#fetch_dcids_by_wikidata_id) | Look up DCIDs of places by Wikidata ID. |
| [fetch_dcid_by_coordinates](#fetch_dcid_by_coordinates) | Look up a DCID of a single place by geographical coordinates. |
| [fetch_indicators](#fetch_indicators) | Look up the DCIDs of all matching statistical variables and topics. |

## Response

For all the methods that resolve places (default `fetch`, `fetch_dcids_by_name`, `fetch_dcids_by_wikidata_id`, and `fetch_dcid_by_coordinates`), the response looks like this:

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
        {
          "dcid": "<var>DCID_2</var>",
          "dominantType": "<var>TYPE_OF_DCID_2</var>"
        },
      ]
    },
    {
      "node": "<var>NODE_2</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_3</var>",
          "dominantType": "<var>TYPE_OF_DCID_3</var>"
        },
      ]
    },
    ...
  ]
}
</pre>
{: .response-signature .scroll}

For the methods `fetch_indicators` and `fetch` with the `resolver` parameter set to `indicator`, the response looks like this:

<pre>
{
  "entities": [
    {
      "node": "<var>NODE_1</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_1</var>",
          "metadata": {
            "score": "<var>CONFIDENCE_SCORE</var>",
            "sentence": "<var>STATVAR_DESCRIPTION</var>"
          },
          "typeOf": [
            "<var>TYPE_OF_DCID_1</var>"
          ]
        },
         {
          "dcid": "<var>DCID_2</var>",
          "metadata": {
            "score": "<var>CONFIDENCE_SCORE</var>",
            "sentence": "<var>STATVAR_DESCRIPTION</var>"
          },
          "typeOf": [
            "<var>TYPE_OF_DCID_2</var>"
          ]
        },
      ]
    },
    {
      "node": "<var>NODE_2</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_3</var>",
          "metadata": {
            "score": "<var>CONFIDENCE_SCORE</var>",
            "sentence": "<var>STATVAR_DESCRIPTION</var>"
          },
          "typeOf": [
            "<var>TYPE_OF_DCID_3</var>"
          ]
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
| node | string | The query terms used to look up the DCIDs of entities. |
| candidates | list | List of nodes that match the query terms. Each node contains a DCID and (optionally) metadata and type information. |
| dcid | The DCID of the candidate node. |
| dominantType | string | Optional field which, when present, disambiguates between multiple results. Only returned when `resolver` is set to `place` (the default). |
| metadata.score | float | The confidence score for the result, used to rank multiple results. Only returned when `resolver` is set to `indicator`. |
| metadata.sentence | string | The matching substring contained in the node's name or description. Only returned when `resolver` is set to `indicator`. |
| typeOf | string or list of strings | The type of the result. Currently supports only `StatisticalVariable` and `Topic`. Only returned when `resolver` is set to `indicator`. |
{: .doc-table}


### Response property methods

You can call the following methods on the `ResolveResponse` object:

| Method | Description | 
|--------|-------------|
| to_dict | Converts the dataclass to a Python dictionary. See [Response formatting](index.md#response-formatting) for details. |
| to_json | Serializes the dataclass to a JSON string (using `json.dumps()`). See [Response formatting](index.md#response-formatting) for details. |
| to_flat_dict | Flattens resolved candidate data into a dictionary where each node maps to a list of candidates. If a node has only one candidate, it maps directly to the candidate instead of a list. See [Example 4](#ex4) below for details. |
{: .doc-table}

## fetch

Resolve entities to DCIDs by name/description or using a relation expression for specific properties.

### Signature

```python
fetch(node_ids, expression, resolver, target)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| node_ids <br /> <required-tag>Required</required-tag>  | string or list of strings | A list of terms that identify each node to search for, such as their names. A single string can contain spaces and commas. |
| resolver <br /> <optional-tag>Optional</optional-tag> | string literal | Currently accepted options are `place` (the default) and `indicator`, which resolves statistical variables. If not specified, the default is `place`. |
| expression <br /> <optional-tag>Optional</optional-tag>  | string | An expression that describes the identifier used in the `nodes` parameter. Only three are currently supported:<br />`<-description`: Search for nodes based on name-related properties (such as `name`, `alternateName`, etc.).<br/>`<-wikidataId`: Search for nodes based on their Wikidata ID(s) (place resolution only).<br/>`<-geoCoordinates`: Search for nodes based on latitude and/or longitude (place resolution only). <br/>If not specified, the default is `<-description`. <br/>Each expression must end with `->dcid` and may optionally include a [`typeOf` filter](/api/rest/v2/index.html#filters). <br/><b>Note:</b> To specify `wikidataId`,`geoCoordinates`, or a `typeOf` filter on the query, you must specify this parameter. <br/> Note: The `description` field is not necessarily present in the knowledge graph for all entities. It is a synthetic property that Data Commons uses to check various name-related fields, such as `name`. The `geoCoordinates` field is a synthesis of `latitude` and `longitude` properties. |
| target <br /> <optional-tag>Optional</optional-tag> | string literal | Only relevant for custom Data Commons: specifies the Data Commons instance(s) whose data should be queried. Supported options are: <br />`custom_only`<br />`base_only`<br/>`base_and_custom`. <br/>If not specified, the default is `base_and_custom`. |
{: .doc-table }

### Examples

{: #fetch_ex1}
{: .no_toc}
#### Example 1: Find the DCID of a place by another known ID

This queries for the DCID of a place by its Wikidata ID. This property is represented in the graph by [`wikidataId`](https://datacommons.org/browser/wikidataId){: target="_blank"}.

Request:
{: .example-box-title}

```python
client.resolve.fetch(node_ids="Q30", expression="<-wikidataId->dcid")
```

Response:
{: .example-box-title}

```python
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
{: #ex2}
#### Example 2: Find the DCIDs of places by name, with a type filter

This queries for the DCIDs of "Mountain View" and "California" (cities) using their names, and filters for only cities to be returned in the results. Notice that there are 4 cities named "California"!

Request:
{: .example-box-title}

```python
client.resolve.fetch(node_ids = ["Mountain View, CA", "California"], expression="<-description{typeOf:City}->dcid")
```

Response:
{: .example-box-title}

```python
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

{: .no_toc}
#### Example 3: Find the DCIDs of statistical variables

This example looks up statistical variables containing the term "population".

Request:
{: .example-box-title}

```python
client.resolve.fetch(node_ids = "population", resolver="indicator")
```
Response:
{: .example-box-title}

(truncated)

```python
{
'entities': [{'node': 'population',
   'candidates': [{'dcid': 'Count_Person',
     'metadata': {'score': '0.8982', 'sentence': 'population count'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'IncrementalCount_Person',
     'metadata': {'score': '0.8723', 'sentence': 'population change'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'Count_Person_PerArea',
     'metadata': {'score': '0.8354', 'sentence': 'Population Density'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'dc/topic/Demographics',
     'metadata': {'score': '0.8211', 'sentence': 'Demographics'},
     'typeOf': ['Topic']},
    {'dcid': 'Count_Person_18OrMoreYears',
     'metadata': {'score': '0.8167', 'sentence': 'adult population count'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'Count_Person_Upto18Years',
     'metadata': {'score': '0.8121', 'sentence': 'children population count'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'Count_BirthEvent',
     'metadata': {'score': '0.8097', 'sentence': 'number of births'},
     'typeOf': ['StatisticalVariable']},
```

{: .no_toc}
{: #ex4}
#### Example 4: Return candidate results as a flat dictionary

This is the same as [example 2](#ex2), but the response is returned as a concise, flattened dict.

Request:
{: .example-box-title}

```python
client.resolve.fetch(node_ids = ["Mountain View, CA", "California"], expression="<-description{typeOf:City}->dcid").to_flat_dict()
```

Response:
{: .example-box-title}

```python
{'California': ['geoId/2412150',
                'geoId/4210768',
                'geoId/2910468',
                'geoId/2111872'],
 'Mountain View, CA': ['geoId/0649670', 'geoId/0649651']}
```
{: .example-box-content .scroll}

## fetch_dcids_by_name

Resolve places to DCIDs by using a name.

### Signature

```python
fetch_dcids_by_name(names, entity_type)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| names <br /> <required-tag>Required</required-tag>  | string or list of strings | The names or descriptions of the places to look up. |
| entity_type <br /> <optional-tag>Optional</optional-tag> | string | The type of the places to be returned. This acts as a filter, by limiting the number of possible candidates (like using the `typeof` parameter in the `fetch` method).|
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCID of a place by name

This queries for the DCID of "Georgia". Notice that specifying `Georgia` without an `entity_type` parameter returns all possible DCIDs with the same name: the state of Georgia in USA ([geoId/13](https://datacommons.org/browser/geoId/13){: target="_blank"}), the country Georgia ([country/GEO](https://datacommons.org/browser/country/GEO){: target="_blank"}) and the city Georgia in the US state of Vermont ([geoId/5027700](https://datacommons.org/browser/geoId/5027700){: target="_blank"}).

Request:
{: .example-box-title}

```python
client.resolve.fetch_dcids_by_name(names="Georgia")
```

> Tip: This example is equivalent to `resolve.fetch(node_ids="Georgia", expression="<-description->dcid")`.

Response:
{: .example-box-title}

```python
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
client.resolve.fetch_dcids_by_name(names="Georgia", entity_type="State")
```
> Tip: This example is equivalent to `resolve.fetch(node_ids="Georgia", expression="<-description{typeOf:State}->dcid")`.

Response:
{: .example-box-title}

```python
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

Resolve places to DCIDs by Wikidata ID.

### Signature

```python
fetch_dcids_by_wikidata_id(wikidata_ids, entity_type)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| wikidata_ids <br /> <required-tag>Required</required-tag>  | string or list of strings | The Wikidata ID(s) of the places to look up. |
| entity_type <br /> <optional-tag>Optional</optional-tag> | string | See [fetch_dcids_by_name](#fetch_dcids_by_name) for description. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCID of a place by Wikidata ID

This example is identical to [example 1](#fetch_ex1) of the `fetch` method.

Request:
{: .example-box-title}

```python
client.resolve.fetch_dcids_by_wikidata_id(wikidata_ids="Q30")
```

Response:
{: .example-box-title}

```python
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

Resolve a place to its DCID by geo coordinates.

### Signature

```python
fetch_dcid_by_coordinates(latitude, longitude, entity_type)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| latitude <br /> <required-tag>Required</required-tag>  | string | The latitude of the place to look up. It should be expressed in decimal format e.g., `37.42` |
| longitude <br /> <required-tag>Required</required-tag>  | string | The longitude of the place to look up. It should be expressed in decimal format e.g, `-122.08` |
| entity_type <br /> <optional-tag>Optional</optional-tag> | string | See [fetch_dcids_by_name](#fetch_dcids_by_name) for description. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCID of a place by coordinates

This queries for the DCID of "Mountain View" by its latitude and longitude.

Request:
{: .example-box-title}

```python
client.resolve.fetch_dcid_by_coordinates(latitude = "37.42", longitude = "-122.08")
```

> Tip: This is equivalent to `client.resolve.fetch(node_ids=["37.42#-122.08"], expression= "<-geoCoordinate->dcid")`

Response:
{: .example-box-title}

```python
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


## fetch_indicators

Resolve statistical variables and topics to their DCIDs.

### Signature

```python
fetch_indicators(queries, target)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| queries <br /> <required-tag>Required</required-tag>  | string or list of strings | Terms to search for matching variables or topics. |
| target <br /> <optional-tag>Optional</optional-tag>  | string literal | See [fetch](#fetch) for description. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Find the DCIDs of statistical variables

This looks up all the statistical variables containing the terms "female population over 50".

Request:
{: .example-box-title}

```python
client.resolve.fetch_indicators(queries="female population over 50")
```

> Tip: This is equivalent to `client.resolve.fetch(node_ids="female population over 50", resolver="indicator")`

Response:
{: .example-box-title}

(truncated)

```python
{'entities': [{'node': 'female population over 50',
   'candidates': [{'dcid': 'Count_Person_85OrMoreYears_Female',
     'metadata': {'score': '0.8447',
      'sentence': 'Number of females older than 85'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'Count_Person_Female',
     'metadata': {'score': '0.8136', 'sentence': 'Number of females'},
     'typeOf': ['StatisticalVariable']},
    {'dcid': 'dc/topic/WhiteAloneFemalePopulationByAge',
     'metadata': {'score': '0.8126',
      'sentence': 'White Female Population By Age'},
     'typeOf': ['Topic']},
    {'dcid': 'dc/topic/UrbanFemalePopulationByAge',
     'metadata': {'score': '0.8048',
      'sentence': 'Urban Female Population By Age'},
     'typeOf': ['Topic']},
    {'dcid': 'dc/topic/SeparatedFemalePopulationByAge',
     'metadata': {'sentence': 'Separated Female Population By Age',
      'score': '0.7999'},
     'typeOf': ['Topic']},
    {'dcid': 'dc/topic/AsianAloneFemalePopulationByAge',
     'metadata': {'score': '0.7987',
      'sentence': 'Asian Female Population By Age'},
     'typeOf': ['Topic']},
    {'dcid': 'dc/topic/TwoOrMoreRacesFemalePopulationByAge',
     'metadata': {'score': '0.7878',
      'sentence': 'Two Or More Races Female Population By Age'},
     'typeOf': ['Topic']},
    {'dcid': 'dc/topic/NowMarriedFemalePopulationByAge',
     'metadata': {'score': '0.7873',
      'sentence': 'Now Married Female Population By Age'},
     'typeOf': ['Topic']},
```
{: .example-box-content .scroll}
