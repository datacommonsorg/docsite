---
layout: default
title: Places within a Place
nav_order: 9
parent: Python
grand_parent: API
---

# Get Places Contained within Another Place

## `datacommons.get_places_in(dcids, place_type)`

Given a list of [`Place`](https://browser.datacommons.org/kg?dcid=Place) DCID's,
(e.g. `County`, `State`, `Country`, etc...), return the DCIDs of places
contained within, of a specified type.


**Arguments**

*   `dcids (Union[list of str, pandas.Series])` - DCIDs of parent places to query for.

*   `place_type (str)` - The type of the contained child `Place`s within the given
    DCIDs to filter by. E.g. `City` and `County` are contained within `State`. For a
    full list of available types, see [`subClassOf Place`](https://browser.datacommons.org/kg?dcid=Place).

**Returns**

When `dcids` is an instance of `list`, the returned `Place`s are formatted as
a `dict` from a given dcid to a list of places identified by dcids of the given
`place_type`.

When `dcids` is an instance of `pandas.Series`, the returned `Place`s are
formatted as a `pandas.Series` where the `i`-th entry corresponds to places
contained in the place identified by the DCID in `i`-th cell if `dcids`. The
cells of the returned series will always contain a `list` of place DCIDs of the
given `place_type`.


**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get all Counties contained in
[California}(https://browser.datacommons.org/kg?dcid=geoId/06). Specifying the
`dcids` as a `list` result in the following:

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dc.get_places_in(["geoId/06"], "County")
{
  'geoId/06': [
    'geoId/06001',
    'geoId/06003',
    'geoId/06005',
    'geoId/06007',
    'geoId/06009',
    ...  # and 53 more
  ]
}
```

We can also specify the `dcids` as a `pandas.Series` like so.

```python
>>> import pandas as pd
>>> dcids = pd.Series(["geoId/06"])
>>> get_places_in(dcids, "County")
0    [geoId/06041, geoId/06089, geoId/06015, geoId/...
dtype: object
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
