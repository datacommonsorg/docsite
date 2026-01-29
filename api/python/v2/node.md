---
layout: default
title: Get node properties
nav_order: 5
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Node 

Data Commons represents node relations as directed edges between nodes, or
_properties_. The name of the property is a _label_, while the _value_ of
the property may be a connected node. The Node API returns the property labels and values that are connected to the queried node. This is useful for finding connections between nodes of the Data Commons knowledge graph.

More specifically, this API can perform the following tasks:
- Get all property labels associated with individual or multiple nodes.
- Get the values of a property for individual or multiple nodes. 
- Get all connected nodes that are linked with individual or multiple nodes.

[Source code](https://github.com/datacommonsorg/api-python/blob/master/datacommons_client/endpoints/node.py){: target="_blank"}

* TOC
{:toc}

## Request methods

The following are the methods available for this endpoint. 

| Method | Description | 
|--------|-------------|
| [fetch](#fetch) | Fetch properties (or "arcs") of specified nodes, by using a [relation expression](/api/rest/v2/index.html#relation-expressions) |
| [fetch_property_labels](#fetch_property_labels) | Fetch property labels of specified nodes |
| [fetch_property_values](#fetch_property_values) | Fetch values of specified nodes and properties |
| [fetch_all_classes](#fetch_all_classes) | Fetch the DCIDs and other properties of all nodes of `Class` type. This is useful for listing out all the entity types in the graph. |
| [fetch_entity_names](#fetch_entity_names) | Look up the names of entities, in one or two languages, based on their DCIDs. |
| [fetch_place_children](#fetch_place_children) | Look up the names of direct child place entities (related by the `containedInPlace` property), based on entity DCIDs. |
| [fetch_place_descendants](#fetch_place_descendants) | Fetch the full graph of direct and indirect children of places (related by the `containedInPlace` property), based on their DCIDs. |
| [fetch_place_parents](#fetch_place_parents) | Look up the names of direct parent place entities (related by the `containedInPlace` property), based on entity DCIDs. |
| [fetch_place_ancestors](#fetch_place_ancestors) | Fetch the full graph of direct and indirect parents of places (related by the `containedInPlace` property), based on their DCIDs. |
| [fetch_statvar_constraints](#fetch_statvar_constraints) | Fetch [constraint properties](https://datacommons.org/browser/constraintProperties){: target="_blank"} defined for statistical variables. | 

## Response

The `fetch_entity_names`, `fetch_place_*` and `fetch_statvar_constraints` methods return a Python dictionary. All other request methods return a `NodeResponse` object. It looks like this:

<pre>
{
  "data": {
    "<var>NODE_DCID</var>": {
      "arcs": {
        "<var>LABEL</var>": {
          "nodes": [
            ...
          ]
        }
        ...
      },
      "properties": [
        "<var>VALUE</var>",
      ],
    }
  }
  "nextToken": None
}
</pre>
{: .response-signature .scroll}

### Response fields

| Name      | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| data      | object | Data of the property label and value information, keyed by the queried nodes.  |
| nextToken | string | A token used to query the [next page of data](#pagination), if `all_pages` is set to `False` in the query. |
{: .doc-table}

### Response property methods

You can call the following methods on a `NodeResponse` object:

| Method | Description | 
|--------|-------------|
| to_dict | Converts the dataclass to a Python dictionary. See [Response formatting](index.md#response-formatting) for details. |
| to_json | Serializes the dataclass to a JSON string (using `json.dumps()`). See [Response formatting](index.md#response-formatting) for details. |
| nextToken | Extracts the `nextToken` value from the response. See [Pagination](#pagination) below for more details |
{: .doc-table }

## fetch

Fetches properties (or "arcs") of specified nodes, by using a [relation expression](/api/rest/v2/index.html#relation-expressions).

### Signature

```python
fetch(node_dcids, expression, all_pages, next_token)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| node_dcids <br/> <required-tag>Required</required-tag> | string or list of strings | One or more DCIDs of the nodes to query.  |
| expression <br/> <required-tag>Required</required-tag> | string  | A [relation expression](/api/rest/v2/#relation-expressions), represented with symbols including arrow notation, that specifies the property (or properties) to query. For more details, see [relation expressions](/api/rest/v2/#relation-expressions). By using different relations, you can query node information in different ways, such as getting the edges and neighboring node values. Examples below show how to request this information for one or multiple nodes. |
| all_pages <br/> <optional-tag>Optional</optional-tag> | bool | Whether all data should be sent in the response. Defaults to `True`. Set to `False` to return paginated responses. See [Pagination](#pagination) for details. |
| next_token <br/> <optional-tag>Optional</optional-tag> | string | If `all_pages` is set to `False`, set this to the next token returned by the previous response. Defaults to `None`. See [Pagination](#pagination) for details. |
{: .doc-table }

### Response
`NodeResponse` dataclass object

### Examples

{: .no_toc}
{: #fetch_ex1}
#### Example 1: Get all incoming property labels for a given node

This examples gets all incoming arc property labels, i.e. the property labels of attached nodes, for the node with DCID `geoId/06` (California) by querying with the `<-` symbol. This returns just the property labels but not the property values. 

Request:
{: .example-box-title}

```python
client.node.fetch(node_dcids=["geoId/06"], expression="<-")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "data": {
    "geoId/06": {
      "properties": [
        "affectedPlace",
        "containedInPlace",
        "location",
        "member",
        "overlapsWith"
      ]
    }
  }
}
```
{: .example-box-content .scroll}

{: .no_toc}
{: #fetch_ex2 }
#### Example 2: Get one (outgoing) property value for a given node

This example gets the value of the `name` property for a given node with DCID `dc/03lw9rhpendw5` by querying the `->name` symbol.

Request:
{: .example-box-title}

```python
client.node.fetch(node_dcids=["dc/03lw9rhpendw5"], expression="->name")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "data": {
    "dc/03lw9rhpendw5": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/EIA_860",
              "value": "191 Peachtree Tower"
            }
          ]
        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 3: Get a list of all statistical variables

This example gets the list of all statistical variables in the knowledge graph, by fetching all nodes that are types of the class `StatisticalVariable` and using the `<-typeOf` symbol to express the incoming relationships. Also, because of the size of the response, it enables [pagination](#pagination) to split up the response data into multiple calls.

Request:
{: .example-box-title}

```python
client.node.fetch(node_dcids=["StatisticalVariable"], expression="<-typeOf", all_pages=False)
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```
{
  "data": {
    "StatisticalVariable": {
      "arcs": {
        "typeOf": {
          "nodes": [
            {
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate1990_Max_Temperature",
              "name": "Max Temperature (Difference Relative To Base Date): Relative To 1990, Highest Value, Median Across Models",
              "provenanceId": "dc/base/HumanReadableStatVars",
              "types": [
                "StatisticalVariable"
              ]
            },
            {
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006To2020_Max_Temperature_RCP45",
              "name": "Max Temperature (Difference Relative To Base Date): Relative To Between 2006 And 2020, Based on RCP 4.5, Highest Value, Median Across Models",
              "provenanceId": "dc/base/HumanReadableStatVars",
              "types": [
                "StatisticalVariable"
              ]
            },
            {
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006To2020_Max_Temperature_RCP85",
              "name": "Max Temperature (Difference Relative To Base Date): Relative To Between 2006 And 2020, Based on RCP 8.5, Highest Value, Median Across Models",
              "provenanceId": "dc/base/HumanReadableStatVars",
              "types": [
                "StatisticalVariable"
              ]
            },
            {
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006_Max_Temperature_RCP45",
              "name": "Max Temperature (Difference Relative To Base Date): Relative To 2006, Based on RCP 4.5, Highest Value, Median Across Models",
              "provenanceId": "dc/base/HumanReadableStatVars",
              "types": [
                "StatisticalVariable"
              ]
            },
            {
              "dcid": "AggregateMax_MedianAcrossModels_DifferenceRelativeToBaseDate2006_Max_Temperature_RCP85",
              "name": "Max Temperature (Difference Relative To Base Date): Relative To 2006, Based on RCP 8.5, Highest Value, Median Across Models",
              "provenanceId": "dc/base/HumanReadableStatVars",
              "types": [
                "StatisticalVariable"
              ]
            },
            ...
            "nextToken": "H4sIAAAAAAAA/2zJsQ6CMBQFUHut9fp0MNcPcyBhf5CSNOlA4C38PT/AfGyx3xAebY82ex99az71aiWOtf6vUTdlpm8SCIF3gVngQ2AR+BRIgS+BJvAt8HMCAAD//wEAAP//522gCWgAAAA="
}
```
{: .example-box-content .scroll}

## fetch_property_labels

Fetches only the labels of properties of specified nodes (or their attached nodes), without using relation expressions. This returns just the property labels but not the property values. 

### Signature

```python
fetch_property_labels(node_dcids, out, all_pages, next_token)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| node_dcids <br/>  <required-tag>Required</required-tag> | string or list of strings   | See [fetch](#fetch) for description.  |
| out <br/> <optional-tag>Optional</optional-tag> | bool |  Whether the edge is an outgoing (`True`) or incoming (`False`) arc. Defaults to outgoing (`True`). |
| all_pages <br/> <optional-tag>Optional</optional-tag> | bool | See [fetch](#fetch) for description. |
| next_token <br/> <optional-tag>Optional</optional-tag> | string | See [fetch](#fetch) for description. |
{: .doc-table }

### Response
`NodeResponse` dataclass object

### Examples

{: .no_toc}
#### Example 1: Get all incoming property labels for a given node

Get all incoming arc property labels, i.e. the property labels that are used in attached nodes, of the node with DCID `geoId/06` (California) by setting the `out` parameter to `False`. This is identical to [example 1](#fetch_ex1) of the `fetch` method.

Request:
{: .example-box-title}

```python
client.node.fetch_property_labels(node_dcids=["geoId/06"], out=False)
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "data": {
    "geoId/06": {
      "properties": [
        "affectedPlace",
        "containedInPlace",
        "location",
        "member",
        "overlapsWith"
      ]
    }
  }
}
```
{: .example-box-content .scroll}

## fetch_property_values

Fetches the values of specified properties of specified nodes (or their attached nodes), without using relation expressions. 

### Signature

```python
fetch_property_values(node_dcids, properties, constraints, out, all_pages, next_token)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| node_dcids <br/>  <required-tag>Required</required-tag> | string or list of strings   | See [fetch](#fetch) for description.   |
| properties <br/>  <required-tag>Required</required-tag> | string or list of strings | List of properties to query |
| constraints <br/> <optional-tag>Optional</optional-tag> | string | Additional [filters](/api/rest/v2/index.html#filters), of the form `{typeof:PROPERTY}`. |
| out <br/> <optional-tag>Optional</optional-tag> | bool |  See [fetch_property_labels](#fetch_property_labels) for description. |
| all_pages <br/> <optional-tag>Optional</optional-tag> | bool | See [fetch](#fetch) for description. |
| next_token <br/> <optional-tag>Optional</optional-tag> | string | See [fetch](#fetch) for description. |
{: .doc-table }

### Response
`NodeResponse` dataclass object

### Examples

{: .no_toc}
#### Example 1: Get one (outgoing) property value for a given node

This example gets the `name` property for a given node with DCID `dc/03lw9rhpendw5`. This is identical to [example 2](#fetch_ex2) of the `fetch` method.

Request:
{: .example-box-title}

```python
client.node.fetch_property_values(node_dcids=["dc/03lw9rhpendw5"], properties="name")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "data": {
    "dc/03lw9rhpendw5": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/EIA_860",
              "value": "191 Peachtree Tower"
            }
          ]
        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 2: Get multiple (outgoing) property values for multiple nodes

This example gets the `name`, `latitude`, and `longitude` values for nodes `geoId/06085` and `geoId/06087`.

Request:
{: .example-box-title}

```python
client.node.fetch_property_values(node_dcids=["geoId/06085", "geoId/06087"], properties=["name", "latitude", "longitude"])
```
{: .example-box-content .scroll}

> Tip: This example is equivalent to `client.node.fetch(node_dcids=["geoId/06085", "geoId/06087"], expression="->[name, latitude, longitude]")`.

Response:
{: .example-box-title}

```json
{
  "data": {
    "geoId/06085": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "Santa Clara County"
            }
          ]
        },
        "latitude": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "37.221614"
            },
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "37.36"
            }
          ]
        },
        "longitude": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "-121.68954"
            },
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "-121.97"
            }
          ]
        }
      }
    },
    "geoId/06087": {
      "arcs": {
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "Santa Cruz County"
            }
          ]
        },
        "latitude": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "37.012347"
            },
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "37.03"
            }
          ]
        },
        "longitude": {
          "nodes": [
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "-122.007789"
            },
            {
              "provenanceId": "dc/base/WikidataOtherIdGeos",
              "value": "-122.01"
            }
          ]
        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 3: Get DCIDs of nodes of a specific type, with an incoming relation to a node

In this example, we use a [filter expression](/api/rest/v2/#filters) to specify "all contained places in
[United States](https://datacommons.org/browser/country/USA){: target="_blank"} (DCID `country/USA`) of type `State`".

Request:
{: .example-box-title}

```python
client.node.fetch_property_values(node_dcids=["country/USA"], properties="containedInPlace+{typeOf:State}", out=False)
```
{: .example-box-content .scroll}

> Tip: This example is equivalent to `client.node.fetch(node_dcids="country/USA", expression="<-containedInPlace+{typeOf:State}")`.

Response:
{: .example-box-title}

```jsonc
{
  "data": {
    "country/USA": {
      "arcs": {
        "containedInPlace+": {
          "nodes": [
            {
              "dcid": "geoId/01",
              "name": "Alabama"
            },
            {
              "dcid": "geoId/02",
              "name": "Alaska"
            },
            {
              "dcid": "geoId/04",
              "name": "Arizona"
            },
            {
              "dcid": "geoId/05",
              "name": "Arkansas"
            },
            {
              "dcid": "geoId/06",
              "name": "California"
            },
            {
              "dcid": "geoId/08",
              "name": "Colorado"
            },
            {
              "dcid": "geoId/09",
              "name": "Connecticut"
            },
            {
              "dcid": "geoId/10",
              "name": "Delaware"
            },
            //...
        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

## fetch_all_classes

Fetches all nodes that are entity types, that is, have `Class` as their type.

### Signature

```python
fetch_all_classes(all_pages, next_token)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| all_pages <br/> <optional-tag>Optional</optional-tag> | bool | See [fetch](#fetch) for description. |
| next_token <br/> <optional-tag>Optional</optional-tag> | string | See [fetch](#fetch) for description. |
{: .doc-table }

### Response
`NodeResponse` dataclass object.

### Examples

{: .no_toc}
#### Example 1: Fetch all classes, with pagination

This example sets `all_pages` to get a [paginated response](#pagination) with a `next_token` value. 

Request:
{: .example-box-title}

```python
client.node.fetch_all_classes(all_pages=False)
```
{: .example-box-content .scroll}

> Tip: This example is equivalent to `client.node.fetch(node_dcids="Class", expression="<-typeOf", all_pages=False)`.

Response:
{: .example-box-title}

```jsonc
{
  "data": {
    "Class": {
      "arcs": {
        "typeOf": {
          "nodes": [
            {
              "dcid": "ACLGroup",
              "name": "ACLGroup",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "ACSEDChild",
              "name": "ACSEDChild",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "ACSEDParent",
              "name": "ACSEDParent",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "APIReference",
              "name": "APIReference",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "AboutPage",
              "name": "AboutPage",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "AcademicAssessmentEvent",
              "name": "AcademicAssessmentEvent",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "AcademicAssessmentTypeEnum",
              "name": "AcademicAssessmentTypeEnum",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "AcceptAction",
              "name": "AcceptAction",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            {
              "dcid": "Accommodation",
              "name": "Accommodation",
              "provenanceId": "dc/base/BaseSchema",
              "types": [
                "Class"
              ]
            },
            //...
          ]
        }
      }
    }
  },
  "nextToken": "H4sIAAAAAAAA/yzHMQ5EQBjF8Z23O7PPRyH/yn20EmdQUCkko3F7kSh/MUUe96XWKOd1rPP2kg/FqU9DRhbyF/mH/Lgg/5GN3CAHcovc3QAAAP//AQAA//9hM3KVTgAAAA=="
}
```
{: .example-box-content .scroll}

## fetch_entity_names

Fetches the names corresponding to entity DCIDs, in the selected language.

### Signature

```python
fetch_entity_names(entity_dcids,language,fallback_language)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| entity_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more DCIDs of entities whose names you want to look up. |
| language <br/><optional-tag>Optional</optional-tag> | string | The [ISO 639](https://www.loc.gov/standards/iso639-2/php/code_list.php){: target="_blank"} 2-letter code representing the language to be used in the response. If not specified, defaults to `en`(English). |
| fallback_language <br/><optional-tag>Optional</optional-tag> | string | The ISO 639 2-letter code representing the language to be used in the response if the language specfied in the previous parameter is not available. |
{: .doc-table }

### Response
Dictionary mapping each DCID to a dictionary with the mapped name and language.

### Examples

{: .no_toc}
#### Example 1: Fetch the names of several entity DCIDs in German

This example gets the German names of 3 different DCID entities (places): USA, Guatemala and Africa.

Request:
{: .example-box-title}

```python
client.node.fetch_entity_names(entity_dcids=["africa", "country/GTM", "country/USA", "wikidataId/Q2608785"],
language="de")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```python
{'africa': Name(value='Afrika', 
                language='de', 
                property='nameWithLanguage'),
 'country/GTM': Name(value='Guatemala',
                     language='de',
                     property='nameWithLanguage'),
 'country/USA': Name(value='Vereinigte Staaten',
                     language='de',
                     property='nameWithLanguage')}
```
{: .example-box-content .scroll}

## fetch_place_children

Fetches the names, DCIDs, and types of direct child places of the selected place entities.

### Signature

```python
fetch_place_children(place_dcids, children_type, as_dict)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| place_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more place entities whose direct children you want to look up. |
| children_type <br/><optional-tag>Optional</optional-tag> | string | The type of the child entities to fetch, for example, `Country`, `State`, `IPCCPlace_50`. If not specified, fetches all child types. This option is useful for cases where the input place may have direct links from various entities, and you only want a specific entity type. For example, in the case of the United States, states, counties, and some cities are directly linked to the `country/USA` entity, while others or not; if you only want states, set this option to `State`. |
| as_dict <br/><optional-tag>Optional</optional-tag> | bool | Whether to return the response as a dictionary mapping each input DCID to a dict of child entities (when set to `True`), or a dictionary mapping each input DCID to a list of child `NodeResponse` objects (when set to `False`). Defaults to `True`. |
{: .doc-table }

### Response
Dependent on the setting of the `as_dict` parameter. See above for details.

### Examples

{: .no_toc}
#### Example 1: Fetch the direct children of a single place, as a dictionary
This example gets the DCIDs of all the direct children of the city of Paris. Note that several types are returned: `AdministrativeArea`, `AdministrativeArea5`, and `Neighbourhood`.

Request:
{: .example-box-title}

```python
client.node.fetch_place_children(place_dcids=["nuts/FR101"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
(truncated)

```python
{'nuts/FR101': [{'dcid': 'wikidataId/Q161741',
                 'name': '1st arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q163948',
                 'name': '10th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q169293',
                 'name': '11th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q171689',
                 'name': '12th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q175129',
                 'name': '13th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q1867640',
                 'name': 'neighborhood of Beaugrenelle',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},
                {'dcid': 'wikidataId/Q187153',
                 'name': '14th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q191066',
                 'name': '15th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q194420',
                 'name': '16th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q197297',
                 'name': '17th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q200126',
                 'name': '18th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q204622',
                 'name': '19th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q20723084',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},
                {'dcid': 'wikidataId/Q209549',
                 'name': '2nd arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q210720',
                 'name': '20th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q223140',
                 'name': '3rd arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q230127',
                 'name': '4th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q238723',
                 'name': '5th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q245546',
                 'name': '6th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q259463',
                 'name': '7th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q270230',
                 'name': '8th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q275118',
                 'name': '9th arrondissement of Paris',
                 'provenanceId': 'dc/base/WikidataOtherIdGeos',
                 'types': ['AdministrativeArea5', 'Neighborhood']},
                {'dcid': 'wikidataId/Q28040572',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},
                {'dcid': 'wikidataId/Q2967971',
                 'name': 'Château Rouge',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},
                {'dcid': 'wikidataId/Q2972946',
                 'name': "Paris' 5th constituency",
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q2974809',
                 'name': 'Floral City, Paris',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},
                {'dcid': 'wikidataId/Q3025141',
                 'name': "Paris' 2nd constituency",
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q3032517',
                 'name': "Paris' 18th constituency",
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q3032527',
                 'name': "Paris' 17th constituency",
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q3032605',
                 'name': "Paris' 10th constituency",
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q3038236',
                 'name': "Paris' 12th constituency",
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q3067304',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['AdministrativeArea']},
                {'dcid': 'wikidataId/Q3067308',
                 'name': 'Saint-Antoine district',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},
                {'dcid': 'wikidataId/Q3067309',
                 'name': 'Faubourg Saint-Jacques',
                 'provenanceId': 'dc/base/WikidataGeos',
                 'types': ['Neighborhood']},     
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 2: Fetch the direct children of a single place by type, as a dict
This example gets the DCIDs of all the states in the United States by limiting to a child type of `State` only.

Request:
{: .example-box-title}

```python
client.node.fetch_place_children(place_dcids=["country/USA"], children_type="State")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
(truncated)

```python
{'country/USA': [{'dcid': 'geoId/01', 'name': 'Alabama'},
                 {'dcid': 'geoId/02', 'name': 'Alaska'},
                 {'dcid': 'geoId/04', 'name': 'Arizona'},
                 {'dcid': 'geoId/05', 'name': 'Arkansas'},
                 {'dcid': 'geoId/06', 'name': 'California'},
                 {'dcid': 'geoId/08', 'name': 'Colorado'},
                 {'dcid': 'geoId/09', 'name': 'Connecticut'},
                 {'dcid': 'geoId/10', 'name': 'Delaware'},
                 {'dcid': 'geoId/11', 'name': 'District of Columbia'},
                 {'dcid': 'geoId/12', 'name': 'Florida'},
                 {'dcid': 'geoId/13', 'name': 'Georgia'},
                 {'dcid': 'geoId/15', 'name': 'Hawaii'},
                 {'dcid': 'geoId/16', 'name': 'Idaho'},
                 {'dcid': 'geoId/17', 'name': 'Illinois'},
                 {'dcid': 'geoId/18', 'name': 'Indiana'},
                 {'dcid': 'geoId/19', 'name': 'Iowa'},
                 {'dcid': 'geoId/20', 'name': 'Kansas'},
                 {'dcid': 'geoId/21', 'name': 'Kentucky'},
                 {'dcid': 'geoId/22', 'name': 'Louisiana'},
                 {'dcid': 'geoId/23', 'name': 'Maine'},
                 {'dcid': 'geoId/24', 'name': 'Maryland'},
                 {'dcid': 'geoId/25', 'name': 'Massachusetts'},
                 {'dcid': 'geoId/26', 'name': 'Michigan'},
                 {'dcid': 'geoId/27', 'name': 'Minnesota'},
                 {'dcid': 'geoId/28', 'name': 'Mississippi'},
...
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 3: Fetch the direct children of a single place by type, as a list of objects
This example is the same as the previous one, but the response is returned as a list of `NodeResponse` objects.

Request:
{: .example-box-title}

```python
client.node.fetch_place_children(place_dcids=["country/USA"], children_type="State", as_dict=False)
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
(truncated)

```python
{'country/USA': [Node(dcid='geoId/01',
                      name='Alabama',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/02',
                      name='Alaska',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/04',
                      name='Arizona',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/05',
                      name='Arkansas',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/06',
                      name='California',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/08',
                      name='Colorado',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/09',
                      name='Connecticut',
                      provenanceId=None,
                      types=None,
                      value=None),
                 Node(dcid='geoId/10',
                      name='Delaware',
                      provenanceId=None,
                      types=None,
                      value=None),
...
```
{: .example-box-content .scroll}

{: .no_toc}
#### Example 4: Fetch the direct children of multiple places, as a dict
This example gets the DCIDs of the countries contained in 3 continents, namely Africa, Asia, and South America, and returns the result as a dict.

Request:
{: .example-box-title}

```python
client.node.fetch_place_children(place_dcids=["africa", "asia", "southamerica"], children_type="Country")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
(truncated)

```python
{'africa': [{'dcid': 'country/AGO', 'name': 'Angola'},
            {'dcid': 'country/ATF', 'name': 'French Southern Territories'},
            {'dcid': 'country/BDI', 'name': 'Burundi'},
            {'dcid': 'country/BEN', 'name': 'Benin'},
            {'dcid': 'country/BFA', 'name': 'Burkina Faso'},
            {'dcid': 'country/BWA', 'name': 'Botswana'},
            {'dcid': 'country/CAF', 'name': 'Central African Republic'},
            {'dcid': 'country/CIV', 'name': "Côte d'Ivoire"},
            {'dcid': 'country/CMR', 'name': 'Cameroon'},
            {'dcid': 'country/COD', 'name': 'Congo [DRC]'},
            {'dcid': 'country/COG', 'name': 'Congo [Republic]'},
            {'dcid': 'country/COM', 'name': 'Comoros'},
            {'dcid': 'country/CPV', 'name': 'Cape Verde'},
            {'dcid': 'country/DJI', 'name': 'Djibouti'},
            {'dcid': 'country/DZA', 'name': 'Algeria'},
            {'dcid': 'country/EGY', 'name': 'Egypt'},
            {'dcid': 'country/ERI', 'name': 'Eritrea'},
            {'dcid': 'country/ESH', 'name': 'Western Sahara'},
            {'dcid': 'country/ETH', 'name': 'Ethiopia'},
            {'dcid': 'country/GAB', 'name': 'Gabon'},
            {'dcid': 'country/GHA', 'name': 'Ghana'},
            {'dcid': 'country/GIN', 'name': 'Guinea'},
            {'dcid': 'country/GMB', 'name': 'Gambia'},
            {'dcid': 'country/GNB', 'name': 'Guinea-Bissau'},
            {'dcid': 'country/GNQ', 'name': 'Equatorial Guinea'},
            {'dcid': 'country/KEN', 'name': 'Kenya'},
            {'dcid': 'country/LBR', 'name': 'Liberia'},
            {'dcid': 'country/LBY', 'name': 'Libya'},
            {'dcid': 'country/LSO', 'name': 'Lesotho'},
            {'dcid': 'country/MAR', 'name': 'Morocco'},
            {'dcid': 'country/MDG', 'name': 'Madagascar'},
            {'dcid': 'country/MLI', 'name': 'Mali'},
            {'dcid': 'country/MOZ', 'name': 'Mozambique'},
            {'dcid': 'country/MRT', 'name': 'Mauritania'},
            {'dcid': 'country/MUS', 'name': 'Mauritius'},
            {'dcid': 'country/MWI', 'name': 'Malawi'},
            {'dcid': 'country/MYT', 'name': 'Mayotte'},
            {'dcid': 'country/NAM', 'name': 'Namibia'},
            {'dcid': 'country/NER', 'name': 'Niger'},
            {'dcid': 'country/NGA', 'name': 'Nigeria'},
            {'dcid': 'country/REU', 'name': 'Réunion'},
            {'dcid': 'country/RWA', 'name': 'Rwanda'},
            {'dcid': 'country/SDN', 'name': 'Sudan'},
            {'dcid': 'country/SEN', 'name': 'Senegal'},
            {'dcid': 'country/SHN', 'name': 'Saint Helena'},
            {'dcid': 'country/SLE', 'name': 'Sierra Leone'},
            {'dcid': 'country/SOM', 'name': 'Somalia'},
            {'dcid': 'country/SSD', 'name': 'South Sudan'},
            {'dcid': 'country/STP', 'name': 'São Tomé and Príncipe'},
            {'dcid': 'country/SWZ', 'name': 'Eswatini'},
            {'dcid': 'country/SYC', 'name': 'Seychelles'},
            {'dcid': 'country/TCD', 'name': 'Chad'},
            {'dcid': 'country/TGO', 'name': 'Togo'},
            {'dcid': 'country/TUN', 'name': 'Tunisia'},
            {'dcid': 'country/TZA', 'name': 'Tanzania'},
            {'dcid': 'country/UGA', 'name': 'Uganda'},
            {'dcid': 'country/ZAF', 'name': 'South Africa'},
            {'dcid': 'country/ZMB', 'name': 'Zambia'},
            {'dcid': 'country/ZWE', 'name': 'Zimbabwe'}],
 'asia': [{'dcid': 'country/AFG', 'name': 'Afghanistan'},
          {'dcid': 'country/ARE', 'name': 'United Arab Emirates'},
          {'dcid': 'country/ARM', 'name': 'Armenia'},
          {'dcid': 'country/AZE', 'name': 'Azerbaijan'},
          {'dcid': 'country/BGD', 'name': 'Bangladesh'},
          {'dcid': 'country/BHR', 'name': 'Bahrain'},
          {'dcid': 'country/BRN', 'name': 'Brunei'},
          {'dcid': 'country/BTN', 'name': 'Bhutan'},
          {'dcid': 'country/CCK', 'name': 'Cocos (Keeling) Islands'},
          {'dcid': 'country/CHN', 'name': 'China'},
          {'dcid': 'country/CXR', 'name': 'Christmas Island'},
          {'dcid': 'country/CYP', 'name': 'Cyprus'},
          {'dcid': 'country/EGY', 'name': 'Egypt'},
          {'dcid': 'country/GEO', 'name': 'Georgia'},
          {'dcid': 'country/HKG', 'name': 'Hong Kong'},
          {'dcid': 'country/IDN', 'name': 'Indonesia'},
          {'dcid': 'country/IND', 'name': 'India'},
          {'dcid': 'country/IOT', 'name': 'British Indian Ocean Territory'},
          {'dcid': 'country/IRN', 'name': 'Iran'},
          {'dcid': 'country/IRQ', 'name': 'Iraq'},
          {'dcid': 'country/ISR', 'name': 'Israel'},
          {'dcid': 'country/JOR', 'name': 'Jordan'},
          {'dcid': 'country/JPN', 'name': 'Japan'},
          {'dcid': 'country/KAZ', 'name': 'Kazakhstan'},
          {'dcid': 'country/KGZ', 'name': 'Kyrgyzstan'},
          {'dcid': 'country/KHM', 'name': 'Cambodia'},
          {'dcid': 'country/KOR', 'name': 'South Korea'},
          {'dcid': 'country/KWT', 'name': 'Kuwait'},
          {'dcid': 'country/LAO', 'name': 'Laos'},
          {'dcid': 'country/LBN', 'name': 'Lebanon'},
          {'dcid': 'country/LKA', 'name': 'Sri Lanka'},
          {'dcid': 'country/MAC', 'name': 'Macau'},
          {'dcid': 'country/MDV', 'name': 'Maldives'},
          {'dcid': 'country/MMR', 'name': 'Myanmar [Burma]'},
          {'dcid': 'country/MNG', 'name': 'Mongolia'},
          {'dcid': 'country/MYS', 'name': 'Malaysia'},
          {'dcid': 'country/NPL', 'name': 'Nepal'},
          {'dcid': 'country/OMN', 'name': 'Oman'},
          {'dcid': 'country/PAK', 'name': 'Pakistan'},
          {'dcid': 'country/PHL', 'name': 'Philippines'},
          {'dcid': 'country/PRK', 'name': 'North Korea'},
          {'dcid': 'country/PSE', 'name': 'Palestinian Territories'},
          {'dcid': 'country/QAT', 'name': 'Qatar'},
          {'dcid': 'country/RUS', 'name': 'Russia'},
          {'dcid': 'country/SAU', 'name': 'Saudi Arabia'},
          {'dcid': 'country/SGP', 'name': 'Singapore'},
          {'dcid': 'country/SYR', 'name': 'Syria'},
          {'dcid': 'country/THA', 'name': 'Thailand'},
          {'dcid': 'country/TJK', 'name': 'Tajikistan'},
          {'dcid': 'country/TKM', 'name': 'Turkmenistan'},
          {'dcid': 'country/TLS', 'name': 'East Timor'},
          {'dcid': 'country/TUR', 'name': 'Turkey'},
          {'dcid': 'country/TWN', 'name': 'Taiwan'},
          {'dcid': 'country/UZB', 'name': 'Uzbekistan'},
          {'dcid': 'country/VNM', 'name': 'Vietnam'},
          {'dcid': 'country/YEM', 'name': 'Yemen'}],
 'southamerica': [{'dcid': 'country/ABW', 'name': 'Aruba'},
                  {'dcid': 'country/ARG', 'name': 'Argentina'},
                  {'dcid': 'country/BOL', 'name': 'Bolivia'},
                  {'dcid': 'country/BRA', 'name': 'Brazil'},
                  {'dcid': 'country/CHL', 'name': 'Chile'},
                  {'dcid': 'country/COL', 'name': 'Colombia'},
                  {'dcid': 'country/CUW', 'name': 'Curaçao'},
                  {'dcid': 'country/ECU', 'name': 'Ecuador'},
                  {'dcid': 'country/FLK',
                   'name': 'Falkland Islands [Islas Malvinas]'},
                  {'dcid': 'country/GUF', 'name': 'French Guiana'},
                  {'dcid': 'country/GUY', 'name': 'Guyana'},
                  {'dcid': 'country/PAN', 'name': 'Panama'},
                  {'dcid': 'country/PER', 'name': 'Peru'},
                  {'dcid': 'country/PRY', 'name': 'Paraguay'},
                  {'dcid': 'country/SUR', 'name': 'Suriname'},
                  {'dcid': 'country/TTO', 'name': 'Trinidad and Tobago'},
                  {'dcid': 'country/URY', 'name': 'Uruguay'},
                  {'dcid': 'country/VEN', 'name': 'Venezuela'}]}
```
{: .example-box-content .scroll}

## fetch_place_descendants

Fetches the names, DCIDs, and types of all direct and indirect child places of the selected places.

> Note: Because of the structure of the Data Commons knowledge graph, in which entities lower in a geographical hierarchy may be directly linked to the "top" entity, this method may be effectively the same as the `fetch_place_children` method. 

### Signature

```python
fetch_place_descendants(place_dcids, descendants_type, as_tree, max_concurrent_requests)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| place_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more place entities whose complete child lineage you want to fetch. |
| descendants_type <br/><optional-tag>Optional</optional-tag> | string | The type of the child entities to fetch, for example, `State`, `County`, `City`. If not specified, fetches all descendant types. Note that if you do not specify this parameter, the query will take several minutes to complete. |
| as_tree <br/><optional-tag>Optional</optional-tag> | bool | Whether to return the response as a dictionary mapping each input DCID to a flat list of node objects (when set to `False`) or a nested tree structure showing the relationship between all child objects (when set to `True`). Defaults to `False`. |
| max_concurrent_requests <br/><optional-tag>Optional</optional-tag> | int | The maximum number of concurrent requests to make: the method fetches the graph by parallelizing requests for each input place entity. Defaults to 10. For queries that include multiple input place entities and that take overly long to return results, you may want to bump this up. For a single input entity, it has no effect. Don't set it to more than 100 as it may affect server memory. |
{: .doc-table } 

### Response
Dependent on the setting of the `as_tree` parameter. See above for details.

### Examples

{: .no_toc}
#### Example 1: Fetch all descendants of one type of a single place, as a dict

This example fetches all the descendants of type "City" of the U.S. state of Hawaii, as a flat dictionary.

Request:
{: .example-box-title}

```python
client.node.fetch_place_descendants(place_dcids=["geoId/15"], descendants_type="City")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
(truncated)

```python
{'geoId/15': [{'dcid': 'geoId/15003', 'name': 'Honolulu County'},
              {'dcid': 'geoId/1500400', 'name': 'Ahuimanu'},
              {'dcid': 'geoId/1500550', 'name': 'Aiea'},
              {'dcid': 'geoId/1501085', 'name': 'Ainaloa'},
              {'dcid': 'geoId/1502200', 'name': 'Anahola'},
              {'dcid': 'geoId/1502832', 'name': 'Black Sands'},
              {'dcid': 'geoId/1503850', 'name': 'Captain Cook'},
              {'dcid': 'geoId/1505900', 'name': 'Discovery Harbour'},
              {'dcid': 'geoId/1506290', 'name': 'East Honolulu'},
              {'dcid': 'geoId/1506300', 'name': 'East Kapolei'},
              {'dcid': 'geoId/1506325', 'name': 'Eden Roc'},
              {'dcid': 'geoId/1507000', 'name': 'Eleele'},
              {'dcid': 'geoId/1507450', 'name': 'Ewa Beach'},
              {'dcid': 'geoId/1507470', 'name': 'Ewa Gentry'},
              {'dcid': 'geoId/1507485', 'name': 'Ewa Villages'},
              {'dcid': 'geoId/1507542', 'name': 'Fern Acres'},
              {'dcid': 'geoId/1507675', 'name': 'Fern Forest'},
              {'dcid': 'geoId/1508950', 'name': 'Haena'},
              {'dcid': 'geoId/1509260', 'name': 'Haiku-Pauwela'},
              {'dcid': 'geoId/1509700', 'name': 'Halaula'},
              {'dcid': 'geoId/1510000', 'name': 'Halawa'},
              {'dcid': 'geoId/1510750', 'name': 'Haleiwa'},
              {'dcid': 'geoId/1510900', 'name': 'Haliimaile'},
              {'dcid': 'geoId/1511350', 'name': 'Hana'},
              {'dcid': 'geoId/1511500', 'name': 'Hanalei'},
              {'dcid': 'geoId/1511650', 'name': 'Hanamaulu'},
              {'dcid': 'geoId/1511800', 'name': 'Hanapepe'},
              {'dcid': 'geoId/1512400', 'name': 'Hauula'},
              {'dcid': 'geoId/1512450', 'name': 'Hawaiian Acres'},
              {'dcid': 'geoId/1512500', 'name': 'Hawaiian Beaches'},
              {'dcid': 'geoId/1512530', 'name': 'Hawaiian Ocean View'},
              {'dcid': 'geoId/1512600', 'name': 'Hawaiian Paradise Park'},
              {'dcid': 'geoId/1513600', 'name': 'Hawi'},
              {'dcid': 'geoId/1513900', 'name': 'Heeia'},
              {'dcid': 'geoId/1513970', 'name': 'Helemano'},
              {'dcid': 'geoId/1514200', 'name': 'Hickam Housing'},
              {'dcid': 'geoId/1514650', 'name': 'Hilo'},
              {'dcid': 'geoId/1515700', 'name': 'Holualoa'},
              {'dcid': 'geoId/1516000', 'name': 'Honalo'},
              {'dcid': 'geoId/1516160', 'name': 'Honaunau-Napoopoo'},
              {'dcid': 'geoId/1516450', 'name': 'Honokaa'},
              {'dcid': 'geoId/1517000', 'name': 'Honolulu'},
              {'dcid': 'geoId/1517450', 'name': 'Honomu'},
              {'dcid': 'geoId/1519100', 'name': 'Iroquois Point'},
              {'dcid': 'geoId/1519550', 'name': 'Kaaawa'},
              {'dcid': 'geoId/1520000', 'name': 'Kaanapali'},
              {'dcid': 'geoId/1521200', 'name': 'Kahaluu'},
              {'dcid': 'geoId/1521230', 'name': 'Kahaluu-Keauhou'},
              {'dcid': 'geoId/1522250', 'name': 'Kahuku'},
...
```
{: .example-box-content .scroll}


## fetch_place_parents

Fetches the names, DCIDs, and types of direct parent places of the selected place entities.

### Signature

```python
fetch_place_parents(place_dcids, as_dict)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| place_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more place entities whose direct parents you want to look up. |
| as_dict <br/><optional-tag>Optional</optional-tag> | bool | Whether to return the response as a dictionary mapping each input DCID to a dict of parent entities (when set to `True`), or a dictionary mapping each input DCID to a list of parent `NodeResponse` objects (when set to `False`). Defaults to `True`. |
{: .doc-table }

### Response
Dependent on the setting of the `as_dict` parameter. See above for details.

### Examples

{: .no_toc}
#### Example 1: Fetch the direct parents of several places, as a dict
This example gets the immediate parents of 3 different places: USA, Guatemala and Africa.

Request:
{: .example-box-title}

```python
client.node.fetch_place_parents(place_dcids=["africa", "country/GTM", "country/USA", "wikidataId/Q2608785"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```python
{'africa': [{'dcid': 'Earth',
             'name': 'World',
             'provenanceId': 'dc/base/BaseGeos',
             'types': ['Place']}],
 'country/GTM': [{'dcid': 'CentralAmerica',
                  'name': 'Central America (including Mexico)',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['UNGeoRegion']},
                 {'dcid': 'LatinAmericaAndCaribbean',
                  'name': 'Latin America and the Caribbean',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['UNGeoRegion']},
                 {'dcid': 'northamerica',
                  'name': 'North America',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['Continent']},
                 {'dcid': 'undata-geo/G00134000',
                  'name': 'Americas',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['GeoRegion']}],
 'country/USA': [{'dcid': 'northamerica',
                  'name': 'North America',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['Continent']},
                 {'dcid': 'undata-geo/G00134000',
                  'name': 'Americas',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['GeoRegion']},
                 {'dcid': 'undata-geo/G00136000',
                  'name': 'Northern America',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['GeoRegion']},
                 {'dcid': 'undata-geo/G00406000',
                  'name': 'Organisation for Economic Co-operation and '
                          'Development (OECD)',
                  'provenanceId': 'dc/base/WikidataOtherIdGeos',
                  'types': ['GeoRegion']}],
 'wikidataId/Q2608785': [{'dcid': 'country/GTM',
                          'name': 'Guatemala',
                          'provenanceId': 'dc/base/WikidataGeos',
                          'types': ['Country']}]}
```
{: .example-box-content .scroll}

## fetch_place_ancestors
Fetches the names, DCIDs, and types of all direct and indirect parent places of the selected places.

### Signature

```python
fetch_place_place_ancestors(place_dcids, as_tree, max_concurrent_requests)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| place_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more place entities whose complete parent lineage you want to fetch. |
| as_tree <br/><optional-tag>Optional</optional-tag> | bool | Whether to return the response as a dictionary mapping each input DCID to a flat list of node objects (when set to `False`) or a nested tree structure showing the relationship between all parent objects (when set to `True`). Defaults to `False`. |
| max_concurrent_requests <br/><optional-tag>Optional</optional-tag> | int | See [fetch_place_descendants](#fetch_place_descendants) for description. |
{: .doc-table }

### Response
Dependent on the setting of the `as_tree` parameter. See [fetch_place_descendants](#fetch_place_descendants) for details.

### Examples

{: .no_toc}
#### Example 1: Fetch all ancestors of a single place, as a tree

This example gets all the direct and indirect parents of the country Canada, and returns the response as a nested tree structure.

Request:
{: .example-box-title}

```python
client.node.fetch_place_ancestors(place_dcids=["country/CAN"], as_tree=True)
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```python
{'country/CAN': {'dcid': 'country/CAN',
                 'name': None,
                 'type': None,
                 'parents': [{'dcid': 'northamerica',
                              'name': 'North America',
                              'type': ['Continent'],
                              'parents': [{'dcid': 'Earth',
                                           'name': 'World',
                                           'type': ['Place'],
                                           'parents': []}]},
                             {'dcid': 'undata-geo/G00134000',
                              'name': 'Americas',
                              'type': ['GeoRegion'],
                              'parents': [{'dcid': 'Earth',
                                           'name': 'World',
                                           'type': ['Place'],
                                           'parents': []}]},
                             {'dcid': 'undata-geo/G00136000',
                              'name': 'Northern America',
                              'type': ['GeoRegion'],
                              'parents': [{'dcid': 'Earth',
                                           'name': 'World',
                                           'type': ['Place'],
                                           'parents': []},
                                          {'dcid': 'undata-geo/G00134000',
                                           'name': 'Americas',
                                           'type': ['GeoRegion'],
                                           'parents': [{'dcid': 'Earth',
                                                        'name': 'World',
                                                        'type': ['Place'],
                                                        'parents': []}]}]},
                             {'dcid': 'undata-geo/G00406000',
                              'name': 'Organisation for Economic Co-operation '
                                      'and Development (OECD)',
                              'type': ['GeoRegion'],
                              'parents': [{'dcid': 'Earth',
                                           'name': 'World',
                                           'type': ['Place'],
                                           'parents': []}]}]}}
```
{: .example-box-content .scroll}

## fetch_statvar_constraints

Fetches property-value pairs defined as `constraintProperties` for selected statistical variables. 

### Signature

```python
fetch_statvar_constraints(variable_dcids)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more statistical variable(s) whose constraint properties you want to fetch. |
{: .doc-table }

### Response

A Python `StatVarConstraints` object, which consists of a dictionary mapping each variable DCID to a list of `StatVarConstraint` objects. Each  `StatVarConstraint` object is a dictionary of constraint property-value pairs.

### Examples

{: .no_toc}
#### Example 1: Fetch the constraint properties of a single variable

This example gets the constraint properties defined for the statistical variable `Income Inequality Between Men and Women of Working Age`, namely age and income status.

Request:
{: .example-box-title}

```python
client.node.fetch_statvar_constraints("GenderIncomeInequality_Person_15OrMoreYears_WithIncome")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{'GenderIncomeInequality_Person_15OrMoreYears_WithIncome': [
  {'constraintId': 'age',
   'constraintName': 'age',
   'valueId': 'Years15Onwards',
   'valueName': 'Years 15 Onwards'},
  {'constraintId': 'incomeStatus',
   'constraintName': 'incomeStatus',
   'valueId': 'WithIncome',
   'valueName': 'WithIncome'}
  ]
}
```
{: .example-box-content .scroll}


{: .no_toc}
#### Example 2: Fetch constraint properties of a multiple statistical variables

This example gets the constraint properties defined for two statistical variables, `Income Inequality Between Men and Women of Working Age` and `Population: 15 - 39 Years, Employed, Widowed`.

Request:
{: .example-box-title}

```python
client.node.fetch_statvar_constraints(["GenderIncomeInequality_Person_15OrMoreYears_WithIncome", "Count_Person_15To39Years_Employed_Widowed"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{'GenderIncomeInequality_Person_15OrMoreYears_WithIncome': [
  {'constraintId': 'age',
   'constraintName': 'age',
   'valueId': 'Years15Onwards',
   'valueName': 'Years 15 Onwards'},
  {'constraintId': 'incomeStatus',
   'constraintName': 'incomeStatus',
   'valueId': 'WithIncome',
   'valueName': 'WithIncome'}
  ],
 'Count_Person_15To39Years_Employed_Widowed': [
  {'constraintId': 'age',
   'constraintName': 'age',
   'valueId': 'Years15To39',
   'valueName': 'Years 15 To 39'},
  {'constraintId': 'employmentStatus',
   'constraintName': 'employmentStatus',
   'valueId': 'Employed',
   'valueName': 'Employed'},
  {'constraintId': 'maritalStatus',
   'constraintName': 'maritalStatus',
   'valueId': 'Widowed',
   'valueName': 'Widowed'}
  ]
}
```
{: .example-box-content .scroll}

## Pagination

All endpoint methods return all data in a single response by default. For some `node` requests, that can return huge responses, you can "paginate" the returned payload, that is, split it over multiple requests. To do so, you can set the `all_pages` parameter, accepted by the `node` methods that return `NodeResponse` objects (see [Response](#response) for details), to `False`. In this case, only a subset of the response is returned, along with a long string of characters called a _token_. To get the next set of entries, you repeat the request with `next_token` as a method parameter, with the token previously returned as its value.

For example, this request, which returns all incoming relations for California, returns a very large number of data items and can take several seconds to complete:

```python
response = client.node.fetch(node_dcids="geoId/06", expression="<-*")
```
To paginate the data, send the first request like this: 

```python
response = client.node.fetch(node_dcids="geoId/06", expression="<-*", all_pages=False)
```
The response will have something like the following at the end:

```
'nextToken': 'SoME vERY Long STriNG'
```

You can obtain the value of the response's `nextToken` by calling the `NodeResponse` property `nextToken`.

```python
response.nextToken
```

To get the next set of entries, repeat the request with the `next_token` parameter set to the value of the previous response, until there is no `nextToken` in the response.

```python
while response.nextToken is not None:
   response = client.node.fetch(node_dcids="geoId/06", expression="<-*", all_pages=False, next_token=response.nextToken)
```
<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

