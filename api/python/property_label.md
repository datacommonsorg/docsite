---
layout: default
title: Get property labels of nodes
nav_order: 36
parent: Python (V1)
grand_parent: API - Query data programmatically
---

# Retrieve property labels of nodes

Returns the labels of properties defined for the given node DCIDs.

## General information about this method

**Signature**: 
```python
datacommons.get_property_labels(dcids, out=True)
```

**Required arguments**:

*   `dcids`: A list of nodes to query, identified by their DCID.

**Optional arguments**:

*   `out`: The label's direction. Defaults to `True` (only returning response nodes directed towards the requested node). If set to `False`, will only return response nodes directed away from the request node.

## Assembling the information you will need for a call to the get_property_values method

Going into more detail on how to assemble the values for the required argument:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest. More information about DCIDs is available in [the glossary](/glossary.html).

In addition to this required property, this endpoint also allows for an additional, optional argument:

  - `out`: This is a boolean value that refers to the orientation, or direction, of the edge. You can specify this argument as `True` to indicate that you desire the response to only include nodes with the value of the property equivalent to one or more of the specified `DCIDs`, or `False` to only return nodes equivalent to one or more of the values of the properties of the specified `DCIDs`. (To visualize this, Figure 1 illustrates the directions for the property `containedInPlace` of the node for Argentina.)

![](/assets/images/rest/property_value_direction_example.png)

*Figure 1. Relationship diagram for the property `containedInPlace` of the country Argentina. Note the directionality of the property `containedInPlace`: the API returns both nodes with direction `in` (Buenos Aires is `containedInPlace` of Argentina) and nodes with direction `out` (Argentina is `containedInPlace` of South America).*

## What to expect in the function return

The method's return value will always be a `dict` in the following form:

```python
{
    "<dcid>": ["string", ...]
    ...
}
```

## Example requests and responses

### Example 1: Retrieve the outwardly directed property labels of Wisconsin's eighth congressional district.

```python
>>> datacommons.get_property_labels(['geoId/5508'])
{'geoId/5508': ['containedInPlace', 'geoId', 'geoJsonCoordinates', 'geoOverlaps', 'kmlCoordinates', 'landArea', 'latitude', 'longitude', 'name', 'provenance', 'typeOf', 'waterArea']}
```

### Example 2: Retrieve the inwardly directed property labels of two different leukocyte cell lines.

```python
>>> datacommons.get_property_labels(['dc/c3j78rpyssdmf','dc/7hfhd2ek8ppd2'],out=False)
{'dc/c3j78rpyssdmf': ['biosampleOntology'], 'dc/7hfhd2ek8ppd2': ['biosampleOntology']}
```

## Error Returns

If there are no properties associated with the node, an empty list is returned:

```python
>>> datacommons.get_property_labels(['geoId/123123123123123'])
{'geoId/123123123123123': []}
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons.get_property_labels()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: get_property_labels() missing 1 required positional argument: 'dcids'
```
