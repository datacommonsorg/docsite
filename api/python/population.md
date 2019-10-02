---
layout: default
title: Population
nav_order: 5
parent: Python
grand_parent: API
---

# Get Populations for Place.

## `datacommons.get_populations(dcids, population_type, constraining_properties={})`

Given a list of [`Place`](https://browser.datacommons.org/kg?dcid=Place) DCID's,
return the DCID of
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)'s
for these places, constrained by the given property values.

**Arguments**

*   `dcids (Union[list of str, pandas.Series])` - DCIDs
    identifying `Place`'s of populations to query for.
    These DCID's are treated as the value associated by the property
    [`location`](https://browser.datacommons.org/kg?dcid=location) for each
    returned `StatisticalPopulation`.

*   `population_type (str)` - The
    [`populationType`](https://browser.datacommons.org/kg?dcid=populationType)
    of each `StatisticalPopulation`, e.g.
    [`Person`](https://browser.datacommons.org/kg?dcid=Person) or
    [`Student`](https://browser.datacommons.org/kg?dcid=Student).

*   `constraining_properties (map from str to str, optional)` -
      A map from constraining property to the value that the
      `StatisticalPopulation` should be constrained by.

**Returns**

When `dcids` is an instance of `list`, the returned `StatisticalPopulation` are
formatted as a `dict` from a given dcid to the unique `StatisticalPopulation`
located at the dcid as specified by the `population_type` and
`constraining_properties` *if such exists*. A given DCID will *NOT* be a member
of the `dict` if such a population does not exist.

When `dcids` is an instance of `pandas.Series`, the returned
`StatisticalPopulation` are formatted as a `pandas.Series` where the `i`-th
entry corresponds to populations located at the given DCID specified by the
`population_type` and `constraining_properties` *if such exists*. Otherwise,
the cell is empty.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

**Examples**

We would like to get

* The [population of employed persons in California](https://browser.datacommons.org/kg?dcid=dc/p/x6t44d8jd95rd)
* The [population of employed persons in Kentucky](https://browser.datacommons.org/kg?dcid=dc/p/fs929fynprzs)
* The [population of employed persons in Maryland](https://browser.datacommons.org/kg?dcid=dc/p/lr52m1yr46r44>)

These populations are specified as having a
`population_type` as `Person` and the `constraining_properties`
as [`employment`](https://browser.datacommons.org/kg?dcid=employment)
`= BLS_Employed`

With a `list` of dcids for our states, we can get the populations we
want as follows:

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dcids = ['geoId/06', 'geoId/21', 'geoId/24']
>>> pvs = {'employment': 'BLS_Employed'}
>>> dc.get_populations(dcids, 'Person', constraining_properties=pvs)
{
  'geoId/06': 'dc/p/x6t44d8jd95rd',
  'geoId/21': 'dc/p/fs929fynprzs',
  'geoId/24': 'dc/p/lr52m1yr46r44'
}
```

We can also specify the `dcids` as a `pandas.Series` like so:

```python
>>> import pandas as pd
>>> dcids = pd.Series(['geoId/06', 'geoId/21', 'geoId/24'])
>>> pvs = {'employment': 'BLS_Employed'}
>>> dc.get_populations(dcids, 'Person', constraining_properties=pvs)
0    dc/p/x6t44d8jd95rd
1     dc/p/fs929fynprzs
2    dc/p/lr52m1yr46r44
dtype: object
```

If a population cannot be found given the constraints for a DCID, the return `dict` will
not contain the DCID as a key:

```python
>>> pvs = {'foo': 'bar'}
>>> dc.get_populations(dcids, 'Person', constraining_properties=pvs)
{}

>>> pvs = {'employment': 'BLS_Employed'}
>>> dc.get_populations(['geoId/06', 'country/USA', 'Person', constraining_properties=pvs)
{
  'geoId/06': 'dc/p/x6t44d8jd95rd'
}
```

## Errors

### `ValueError`: API key not specified

```python
>>> import datacommons as dc
>>> dc.get_property_labels(['geoId/06'])
ValueError: Request error: Must set an API key before using the API! You can
call datacommons.set_api_key or assign the key to an environment variable named
DC_API_KEY
```
