---
layout: default
title: Places within a Place
nav_order: 10
parent: Python
grand_parent: API
---

# Get Places Contained within Another Place

## `datacommons.get_places_in(dcids, place_type)`

Given a list of [`Place`](https://datacommons.org/browser/Place) DCID's,
(e.g. `County`, `State`, `Country`, etc...), return the DCIDs of places
contained within, of a specified type.


**Arguments**

*   `dcids (list of str)` - DCIDs of parent places to query for.

*   `place_type (str)` - The type of the contained child `Place`s within the given
    DCIDs to filter by. E.g. `City` and `County` are contained within `State`. For a
    full list of available types, see [`subClassOf Place`](https://datacommons.org/browser/Place).

**Returns**

A `dict` from a given dcid to a list of places identified by dcids of the given
`place_type`.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get all Counties contained in
[California}(https://datacommons.org/browser/geoId/06). Specifying the
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