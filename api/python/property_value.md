---
layout: default
title: Property Value
nav_order: 5
parent: Python
grand_parent: API
---

# Show Property Values for Node(s)

## `datacommons.get_property_values(dcids, prop, out=True, value_type=None, limit=datacommons.utils._MAX_LIMIT)`

Given a list of nodes and a property label, returns values associated with the
given property for each node.

**Arguments**

*   `dcids (list of str)` - DCID's to get property values for

*   `prop (str)` - The property to get property values for.

*   `out (bool, optional)` - Whether or not the property points away from the given list of nodes.

*   `value_type (str, optional)` - A type to filter returned property values by, only applicable if
    the value refers to a node.

*   `limit (int, optional)` - The maximum number of property values returned per node, must be ≤ 500.

**Returns**

A `dict` mapping DCID's to lists of property values. If `out` is `True`, then
property values correspond to edges directed away from given nodes. Otherwise,
they correspond to edges directed towards the given nodes.

If the payload returned by the Data Commons REST API is malformed or the API key is not set, the endpoint returns `NaN`.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

**Examples**

We would like to get the `name` of a list of states specified by their DCID:
[geoId/06](https://datacommons.org/browser/geoId/06),
[geoId/21](https://datacommons.org/browser/geoId/21), and
[geoId/24](https://datacommons.org/browser/geoId/24).

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dc.get_property_values(["geoId/06", "geoId/21", "geoId/24"], "name")
{
  "geoId/06": ["California"],
  "geoId/21": ["Kentucky"],
  "geoId/24": ["Maryland"],
}
```

[comment]: <> (Add examples for other arguments (e.g. value_type, limit)

If there is no value associated with the property, an empty list is returned:

```python
>>> dc.get_property_values(["geoId/06", "geoId/21"], "foo")
{'geoId/06': [], 'geoId/21': []}
```