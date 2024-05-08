---
layout: default
title: Places within a Place
nav_order: 6
parent: Python
grand_parent: API
---

# Retrieve places contained within other places

## General information about this endpoint

**Signature**:

```python
datacommons.get_places_in(dcids, place_type)
```

**Required arguments**:

*   `dcids`: A list of nodes to query, identified by their DCID.
*   `place_type`: The type of the contained child `Places` within the given
    DCIDs to filter by.

## Assembling the information you will need for a call to the get_places_in method

Going into more detail on how to assemble the values for the required arguments:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest. More information about DCIDs is available in [the glossary](/glossary.html).

 - `place_type`: This argument specifies the type of place sought in the response. For example, when examining places contained within American `States`, you would be able to select `City` or `County` (among others). For a full list of available types, see [the place types page](/place_types.html).

## What to expect in the function return

The method's return value will always be a `dict` in the following form:

```python
{
    "<dcid>": ["string", ...]
    ...
}
```

## Example requests and responses

### Example 1: Retrieve a list of all counties in Delaware.

#### Method call

```python
datacommons.get_places_in(["geoId/10"], "County")
```

#### Response

```python
{'geoId/10': ['geoId/10001', 'geoId/10003', 'geoId/10005']}
```

### Example 2: Retrieve a list of congressional districts in Alaska and Hawaii.

```python
datacommons.get_places_in(["geoId/15","geoId/02"], "CongressionalDistrict")
```

#### Response

```python
{'geoId/15': ['geoId/1501', 'geoId/1502'], 'geoId/02': ['geoId/0200']}
```

## Error Returns

If there is no value associated with the requested property, an empty list is returned:

```python
>>> datacommons.get_places_in(["geoId/1021"], "CongressionalDistrict")
{'geoId/1021': []}
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons.get_places_in(["geoId/1021"])
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: get_places_in() missing 1 required positional argument: 'place_type'
```
