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
| [fetch_place_parents](#fetch_place_parents) | Look up the names of direct parent place entities (related by the `containedInPlace` property), based on entity DCIDs. |
| [fetch_place_children](#fetch_place_children) | Look up the names of direct child place entities (related by the `containedInPlace` property), based on entity DCIDs. |
| [fetch_place_ancestors](#fetch_place_ancestors) | Fetch the full graph of direct and indirect parents of places (related by the `containedInPlace` property), based on their DCIDs. |
| [fetch_place_descendants](#fetch_place_descendants) | Fetch the full graph of direct and indirect children of places (related by the `containedInPlace` property), based on their DCIDs. |

## Response

The `fetch_entity_names` and `fetch_place_*` methods return a Python dictionary. All other request methods return a `NodeResponse` dataclass object. It looks like this:

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

```
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
            ...
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

```
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
            ....
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
fetch_place_children(place_dcids, as_dict)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| place_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more place entities whose direct parents you want to look up. |
| children_type <br/><optional-tag>Optional</optional-tag> | string | The type of the child entities to fetch, for example, `Country`, `State', `IPCCPlace_50`. If not specified, fetches all child types. |
| as_dict <br/><optional-tag>Optional</optional-tag> | bool | Whether to return the response as a dictionary mapping each input DCID to a dict of child entities (when set to `True`), or a dictionary mapping each input DCID to a list of child `NodeResponse` objects (when set to `False`). Defaults to `True`. |
{: .doc-table }

### Response
Dependent on the setting of the `as_dict` parameter. See above for details.

### Examples

{: .no_toc}
#### Example 1: Fetch the direct children of a single DCID by type, as a dict
This example gets the DCIDs of all the states in the United States, as a dict.

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

#### Example 1: Fetch the direct children of a single DCID by type, as a list of objects
This example gets the DCIDs of all the states in the United States, as a list nof `NodeResponse` objects.

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
#### Example 1: Fetch the direct parents of several place DCIDs, as a dict
This example gets the immediate parents of 3 different DCID entities (places): USA, Guatemala and Africa.

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


## fetch_place_descendants

Fetches the names, DCIDs, and types of all direct and indirect child places of the selected places.

> Note: Because this method uses graph traversal, it may take several minutes to get a response.

### Signature

```python
fetch_place_place_descendants(place_dcids, descendants_type, as_tree, max_concurrent_requests)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| place_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more place entities whose complete child lineage you want to fetch. |
| descendants_type <br/><optional-tag>Optional</optional-tag> | string | The type of the child entities to fetch, for example, `State', `County`, `City`. If not specified, fetches all child types. |
| as_tree <br/><optional-tag>Optional</optional-tag> | bool | Whether to return the response as a dictionary mapping each input DCID to a flat list of node objects (when set to `False`) or a nested tree structure showing the relationship between all child objects (when set to `True`). Defaults to `False`. |
| max_concurrent_requests <br/><optional-tag>Optional</optional-tag> | int | The maximum number of concurrent requests to make: the method fetches the descendants graph by parallelizing requests for each input place entity. Defaults to 10. For queries that include multiple input place entities and that take overly long to return results, you may want to bump this up. For a single input entity, it has no effect. |
{: .doc-table }

### Response
Dependent on the setting of the `as_tree` parameter. See above for details.

### Examples

{: .no_toc}
#### Example 1: Fetch all descendants of a single place, as a tree

This example fetches all the descendants of the U.S. state of Hawaii, as a dict

Request:
{: .example-box-title}

```python
client.node.fetch_place_descendants(place_dcids=["geoId/15"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}
(truncated)

```python

```
{: .example-box-content .scroll}

#### Example 2: Fetch the descendants of a single type of a single place, as a dict

### fetch_place_ancestors
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
| max_concurrent_requests <br/><optional-tag>Optional</optional-tag> | int | The maximum number of concurrent requests to make: the method fetches the ancestry graph by parallelizing requests for each input place entity. Defaults to 10. For queries that include multiple input place entities and that take overly long to return results, you may want to bump this up. For a single input entity, it has no effect. |
{: .doc-table }

### Response
Dependent on the setting of the `as_tree` parameter. See above for details.

### Examples

{: .no_toc}
#### Example 1: Fetch all ancestors of a single place, as a tree


## Pagination

All endpoint methods return all data in a single response by default. For `node` requests, that can return huge responses, you can "paginate" the returned payload, that is, split it over multiple requests. To do so, you can set the `all_pages` parameter, accepted by the `node` methods that return `NodeResponse` objects (see [Response](#response) for details), to `False`. In this case, only a subset of the response is returned, along with a long string of characters called a _token_. To get the next set of entries, you repeat the request with `next_token` as a method parameter, with the token previously returned as its value.

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

