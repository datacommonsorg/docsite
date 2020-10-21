---
layout: default
title: Observations
nav_order: 7
parent: Python
grand_parent: API
published: false
---

# Get Observations for Populations

## `datacommons.get_observations(dcids, measured_property, stats_type, observation_date, observation_period=None, measurement_method=None)`

Given a list of
[`StatisticalPopulation`](https://datacommons.org/browser/StatisticalPopulation)
DCIDs, return the DCID of
[`Observation`](https://datacommons.org/browser/Observation)'s for these
statistical populations, constrained by the given observation's property values.


**Arguments**

*   `dcids (list of str)`: A list of statistical
    populations to query, identified by their DCIDs. These DCIDs are treated as
    the property value associated with returned list of `Observation` by the property
    [`observedNode`](https://datacommons.org/browser/observedNode)

*   `measured_property (str)`: The property value associated with returned list of
    `Observation` by the property
    [`measuredProperty`](https://datacommons.org/browser/measuredProperty)

*   `stats_type (str)`: The statistical type of the `Observation`. This is commonly set
    to `measuredValue`.

*   `observation_date`: The property value associated with returned
    `Observation` by the property
    [`observationDate`](https://datacommons.org/browser/observationDate).
    This is specified in ISO8601 format.

*   `observation_period (str)`: The property value associated with returned
    `Observation` by the property
    [`observationPeriod`](https://datacommons.org/browser/observationPeriod)
    of the observation. If the `Observation` has this property set, this must
    be specified.

*   `measurement_method (str)`: The property value associated with returned
    `Observation` by the property
    [`measurementMethod`](https://datacommons.org/browser/measurementMethod)
    of the observation. If the `Observation` has this property set, this must
    be specified

**Returns**

A `dict` from a given DCID to the unique `Observation` observing
the DCID where the observation is specified by what is given in the other
parameters *if such exists*. A given DCID will *NOT* be a member of the `dict`
if such an observation does not exist.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get the following for December, 2018:
* The [total count of employed persons in California](https://datacommons.org/browser/dc/o/wetnm9026gf73)
* The [total count of employed persons in Kentucky](https://datacommons.org/browser/dc/o/4nklvdnkfq835)
* The [total count of employed persons in Maryland](https://datacommons.org/browser/dc/o/nkntbc4vpshn9>)

The observations we want are observations of the populations representing
employed individuals in each state (to get these, see
[`get_populations`](/api/python/population.html). With a list of these
population DCIDs, we can get the observations like so:

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dcids = [
...   "dc/p/x6t44d8jd95rd",   # Employed individuals in California
...   "dc/p/fs929fynprzs",    # Employed individuals in Kentucky
...   "dc/p/lr52m1yr46r44"    # Employed individuals in Maryland
... ]
>>> dc.get_observations(dcids, 'count', 'measuredValue', '2018-12',
...   observation_period='P1M',
...   measurement_method='BLSSeasonallyAdjusted'
... )
{
  "dc/p/x6t44d8jd95rd": 18704962.0,
  "dc/p/fs929fynprzs": 1973955.0,
  "dc/p/lr52m1yr46r44": 3075662.0
}
```

If an observation cannot be found given the constraints for a DCID, the return `dict` will
not contain the DCID as a key:

```python
>>> dcids = [
...   "dc/p/x6t44d8jd95rd",   # Employed individuals in California
...   "dc/p/fs929fynprzs",    # Employed individuals in Kentucky
...   "foo"                   # Invalid DCID
... ]
>>> dc.get_observations(dcids, 'count', 'measuredValue', '2018-12')
{
  "dc/p/x6t44d8jd95rd": 18704962.0,
  "dc/p/fs929fynprzs": 1973955.0
}
```

If required properties are not specified, an empty dictionary is returned.
Following on from the example above:

```python
>>> dcids = [
...   "dc/p/x6t44d8jd95rd",   # Employed individuals in California
...   "dc/p/fs929fynprzs",    # Employed individuals in Kentucky
...   "dc/p/lr52m1yr46r44"    # Employed individuals in Maryland
... ]
>>> dc.get_observations(dcids, 'count', 'measuredValue', '2018-12')
{}
```