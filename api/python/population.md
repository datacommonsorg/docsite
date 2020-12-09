---
layout: default
title: Place Populations
nav_order: 6
parent: Python
grand_parent: API
published: false
---

# Get Populations for Place(s)

## `datacommons.get_populations(dcids, population_type, constraining_properties={})`

Given a list of [`Place`](https://datacommons.org/browser/Place) DCID's,
return the DCID of
[`StatisticalPopulation`](https://datacommons.org/browser/StatisticalPopulation)'s
for these places, constrained by the given property values.

**Arguments**

*   `dcids (list of str)` - DCIDs identifying `Place`'s of populations to query for.
    These DCID's are treated as the value associated by the property
    [`location`](https://datacommons.org/browser/location) for each
    returned `StatisticalPopulation`.

*   `population_type (str)` - The [`populationType`](https://datacommons.org/browser/populationType)
    of each `StatisticalPopulation`, e.g.
    [`Person`](https://datacommons.org/browser/Person) or
    [`Student`](https://datacommons.org/browser/Student).

*   `constraining_properties (map from str to str, optional)` -
      A map from constraining property to the value that the
      `StatisticalPopulation` should be constrained by.

**Returns**

A `dict` from a given dcid to the unique `StatisticalPopulation`
located at the dcid as specified by the `population_type` and
`constraining_properties` *if such exists*. A given DCID will *NOT* be a member
of the `dict` if such a population does not exist.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed.

## Examples

**Examples**

We would like to get

* The [population of employed persons in California](https://datacommons.org/browser/dc/p/x6t44d8jd95rd)
* The [population of employed persons in Kentucky](https://datacommons.org/browser/dc/p/fs929fynprzs)
* The [population of employed persons in Maryland](https://datacommons.org/browser/dc/p/lr52m1yr46r44)

These populations are specified as having a
`population_type` as `Person` and the `constraining_properties`
as [`employment`](https://datacommons.org/browser/employment) `= BLS_Employed`

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

```python
>>> pvs = {'foo': 'bar'}
>>> dc.get_populations(dcids, 'Person', constraining_properties=pvs)
{}

>>> pvs = {'employment': 'BLS_Employed'}
>>> dc.get_populations(['geoId/06'], 'country/USA', 'Person', constraining_properties=pvs)
{
  'geoId/06': 'dc/p/x6t44d8jd95rd'
}
```