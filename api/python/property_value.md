---
layout: default
title: Property Value
nav_order: 4
parent: Python
grand_parent: API
---

# Show Property Values for Node(s)

## `datacommons.get_property_values(dcids, prop, out=True, value_type=None, limit=datacommons.utils._MAX_LIMIT)`

Given a list of nodes and a property label, returns values associated with the
given property for each node.

**Arguments**

*   `dcids (Union[list of str, pandas.Series])` - DCID's to get property values for

*   `prop (str)` - The property to get property values for.

*   `out (bool, optional)` - Whether or not the property points away from the given list of nodes.

*   `value_type (str, optional)` - A type to filter returned property values by, only applicable if
    the value refers to a node.

*   `limit (int, optional)` - The maximum number of property values returned per node, must be ≤ 500.

**Returns**

A `dict` mapping DCID's to lists of property labels. If `out` is `True`, then
property labels correspond to edges directed away from given nodes. Otherwise,
they correspond to edges directed towards the given nodes.

When `dcids` is an instance of `list`, the returned property values are
formatted as a `dict` from a given dcid to a list of its property values.

When `dcids` is an instance of `pandas.Series`, the returned property values
are formatted as a `pandas.Series` where the `i`-th entry corresponds to
property values associated with the `i`-th given dcid.  The cells of the
returned series will always contain a `list` of property values.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

**Examples**

We would like to get the `name` of a list of states specified by their DCID:
[geoId/06](https://browser.datacommons.org/kg?dcid=geoId/06),
[geoId/21](https://browser.datacommons.org/kg?dcid=geoId/21), and
[geoId/24](https://browser.datacommons.org/kg?dcid=geoId/24)

First, let's try specifying the `dcids` as a `list` of `str`:

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

Next, we specify `dcids` as a `pandas.Series`:

```python
>>> import pandas as pd
>>> dcids = pd.Series(["geoId/06", "geoId/21", "geoId/24"])
>>> get_property_values(dcids, "name")
0    [California]
1      [Kentucky]
2      [Maryland]
dtype: object
```

[comment]: <> (Add examples for other arguments (e.g. value_type, limit)

If there is no value associated with the property, an empty list is returned:

```python
>>> dc.get_property_values(["geoId/06", "geoId/21"], "foo")
{'geoId/06': [], 'geoId/21': []}
```

## Errors

### `ValueError`: API key not specified

```python
>>> import datacommons as dc
>>> dc.get_property_values(["geoId/06", "geoId/21", "geoId/24"], "name")
ValueError: Request error: Must set an API key before using the API! You can
call datacommons.set_api_key or assign the key to an environment variable named
DC_API_KEY
```
