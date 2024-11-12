---
layout: default
title: Get property values of nodes
nav_order: 37
parent: Python
grand_parent: API - Query data programmatically
---

# Retrieve property values of nodes

Given a list of nodes and a property label, returns values associated with the
given property for each node.

## General information about this endpoint

**Signature**: 
```python
datacommons.get_property_values(dcids, prop, out=True, value_type=None, limit=datacommons.utils._MAX_LIMIT)
```

**Required arguments**:

*   [`dcids`](/glossary.html): A list of nodes to query, identified by their Data Commons identifiers.
*   `prop`: The property to query for.

**Optional arguments**:

*   `value_type`: The type of the property value to filter by. Defaults to `NONE`. Only applicable if
    the value refers to a node.
*   `out`: The label's direction. Defaults to `True` (only returning response nodes directed towards the requested node). If set to `False`, will only return response nodes directed away from the request node.
*   `limit`: (≤ 500) Maximum number of values returned per node. Defaults to `datacommons.utils._MAX_LIMIT`.

## Assembling the information you will need for a call to the get_property_values method

Going into more detail on how to assemble the values for the required arguments:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest. More information about DCIDs is available in [the glossary](/glossary.html).

 - `prop`: The property whose value you are interested in, such as "name" for the name of a node, or "typeOf" for the type of a node.

In addition to these required properties, this endpoint also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

  - `value_type`: If the property queried only takes on node values, you can use this argument to filter nodes in the response, ensuring the response only contains nodes with the specified type. For example, if you query the property `containedInPlace` on the DCID `geoId/06085`, your response will contain many results that may not be relevant to your question. If you instead specify the `value_type` as `City`, your result list will be shorter, narrower, and easier to parse.

  - `out`: This is a boolean value that refers to the orientation, or direction, of the edge. You can specify this argument as `True` to indicate that you desire the response to only include nodes with the value of the property equivalent to one or more of the specified `DCIDs`, or `False` to only return nodes equivalent to one or more of the values of the properties of the specified `DCIDs`. (To visualize this, Figure 1 illustrates the directions for the property `containedInPlace` of the node for Argentina.)

![](/assets/images/rest/property_value_direction_example.png)

*Figure 1. Relationship diagram for the property `containedInPlace` of the country Argentina. Note the directionality of the property `containedInPlace`: the API returns both nodes with direction `in` (Buenos Aires is `containedInPlace` of Argentina) and nodes with direction `out` (Argentina is `containedInPlace` of South America).*

## What to expect in the function return

The method's return value will always be a `dict` in the following form:

```json
{
    "<dcid>": ["string", ...]
    ...
}
```

## Examples

### Example 1: Retrieve the common names of the country of Côte d'Ivoire.

#### Method call

```python
>>> datacommons.get_property_values(['country/CIV'],'name')
{'country/CIV': ["Côte d'Ivoire", 'Ivory Coast']}
```

### Example 2: Retrieve the order to which the plant _Austrobaileya scandens_ belongs.

```python
>>> datacommons.get_property_values(['dc/bsmvthtq89217'],'order')
{'dc/bsmvthtq89217': ['Austrobaileyales']}
```

### Example 3: Retrieve the addresses of Stuyvesant High School in New York and Gunn High School in California.

```python
>>> datacommons.get_property_values(["nces/360007702877","nces/062961004587"],'address')
{'nces/360007702877': ['345 Chambers St, New York, New York'], 'nces/062961004587': ['780 Arastradero Rd., Palo Alto, California']}
```

### Example 4: Retrieve a list of earthquake events in Madagascar.

>    **NOTE:**
>    Unlike in the REST API, the Python endpoint returns only one direction. Hence, you must specify `out` as False to obtain results _in_ Madagascar.

```python
>>> datacommons.get_property_values(dcids=["country/MDG"],prop='affectedPlace',out=False,value_type='EarthquakeEvent')
{'country/MDG': ['earthquake/us200040me', 'earthquake/us60003r15', 'earthquake/usc000evr6', 'earthquake/usp00005zf', 'earthquake/usp00006yt', 'earthquake/usp0000afz', 'earthquake/usp0001fcd', 'earthquake/usp0001ss5', 'earthquake/usp00020ud', 'earthquake/usp0002kfd', 'earthquake/usp0004qn4', 'earthquake/usp0005gu9', 'earthquake/usp0007k9j', 'earthquake/usp0008vc6', 'earthquake/usp000dckw', 'earthquake/usp000fu24', 'earthquake/usp000gmuf', 'earthquake/usp000h6zw', 'earthquake/usp000jgbb']}
```

### Example 5: Retrieve just one cyclone event in India.

```python
>>> datacommons.get_property_values(dcids=["country/IND"],prop='affectedPlace',out=False,value_type='CycloneEvent',limit=1)
{'country/IND': ['cyclone/ibtracs_2018314N12093']}
```

### Example 6: Retrieve the country in which Buenos Aires is located.

![](/assets/images/rest/property_value_direction_example.png)

*Figure 2. Relationship diagram for the property `containedInPlace` of the country Argentina. Note the directionality of the property `containedInPlace`: the API returns both nodes with direction `in` (Buenos Aires is `containedInPlace` of Argentina) and nodes with direction `out` (Argentina is `containedInPlace` of South America).*

```python
>>> datacommons.get_property_values(dcids=["country/ARG"],prop='containedInPlace')
{'country/ARG': ['southamerica']}
```

>    **NOTE:**
>    If there is no value associated with the property, an empty list is returned:
>    ```python
>    >>> dc.get_property_values(["geoId/06", "geoId/21"], "foo")
>    {'geoId/06': [], 'geoId/21': []}
>    ```

## Error Returns

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> dc.get_property_values('address')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: get_property_values() missing 1 required positional argument: 'prop'
```