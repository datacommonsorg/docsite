---
layout: default
title: flatten_frame
nav_order: 11
parent: Python
grand_parent: API
---

# Sets the API key

## `datacommons.flatten_frame(pd_frame, cols=[])`

Expands each cell in a Pandas DataFrame containing a list of values.

**Arguments**

*   `api_key (str)` - The API key.
*   `pd_frame (pandas.DataFrame)` - The Pandas DataFrame.
*   `cols` (`list` of `str`, optional) - A list of columns to flatten. If none
      are provided, then all columns are flattened.

**Returns**

A `pandas.DataFrame` with all columns containing lists flattened.

**Raises**

*   `ValueError` - If a given coluumn is not in the data frame.

## Examples

We can flatten a data frame with a column of lists like so:

```python
>>> frame = pd.DataFrame({"state": ["geoId/06"]})
>>> frame['county'] = dc.get_places_in(dcids, "County")
>>> frame
      state                                             county
0  geoId/06  [geoId/06041, geoId/06089, geoId/06015, geoId/...
>>> dc.flatten_frame(frame)
       state       county
0   geoId/06  geoId/06041
1   geoId/06  geoId/06089
2   geoId/06  geoId/06015
..       ...          ...
55  geoId/06  geoId/06019
56  geoId/06  geoId/06031
57  geoId/06  geoId/06099
```
