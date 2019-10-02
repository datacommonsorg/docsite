---
layout: default
title: Observation
nav_order: 6
parent: Python
grand_parent: API
---

# Get Observations for Populations.

## `get_observations(dcids, measured_property, stats_type, observation_date, observation_period=None, measurement_method=None)`

Given a list of
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)
DCIDs, return the DCID of
[`Observation`](https://browser.datacommons.org/kg?dcid=Observation)'s for these
statistical populations, constrained by the given observation's property values.


**Arguments**

*   `dcids (Union[`list` of `str`, `pandas.Series`])`: A list of statistical
    populations to query, identified by their DCIDs. These DCIDs are treated as
    the property value associated with returned `Observation`'s by the property
    [`observedNode`](https://browser.datacommons.org/kg?dcid=observedNode)

*   `measured_property (str)`: The property value associated with returned
    `Observation`'s by the property
    [`measuredProperty`](https://browser.datacommons.org/kg?dcid=measuredProperty)

*   `stats_type (str)`: The statistical type of the `Observation`. This is commonly set
    to `measuredValue`.

*   `observation_date`: The property value associated with returned
    `Observation`'s by the property
    [`observationDate`](https://browser.datacommons.org/kg?dcid=observationDate).
    This is specified in ISO8601 format.

*   `observation_period (str)`: The property value associated with returned
    `Observation`'s by the property
    [`observationPeriod`](https://browser.datacommons.org/kg?dcid=observationPeriod)
    of the observation. If the `Observation` has this property set, this must
    be specified.

*   `measurement_method (str)`: The property value associated with returned
    `Observation`'s by the property
    [`measurementMethod`](https://browser.datacommons.org/kg?dcid=measurementMethod)
    of the observation. If the `Observation` has this property set, this must
    be specified

**Returns**

When `dcids` is an instance of `list`, the returned `Observation`'s are
formatted as a `dict` from a given DCID to the unique `Observation` observing
the DCID where the observation is specified by what is given in the other
parameters *if such exists*. A given DCID will *NOT* be a member of the `dict`
if such an observation does not exist.

When `dcids` is an instance of `pandas.Series`, the returned `Observation`'s
are formatted as a `pandas.Series` where the `i`-th entry corresponds to
observation observing the given DCID as specified by the other parameters *if
such exists*. Otherwise, the cell holds NaN.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get the following for December, 2018:
* The [total count of employed persons in California](https://browser.datacommons.org/kg?dcid=dc/o/wetnm9026gf73)
* The [total count of employed persons in Kentucky](https://browser.datacommons.org/kg?dcid=dc/o/4nklvdnkfq835)
* The [total count of employed persons in Maryland](https://browser.datacommons.org/kg?dcid=dc/o/nkntbc4vpshn9>)

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

We can also specify the `dcids` as a `pandas.Series` like so:

```python
>>> import pandas as pd
>>> dcids = pd.Series(["dc/p/x6t44d8jd95rd", "dc/p/fs929fynprzs", "dc/p/lr52m1yr46r44"])
>>> get_observations(dcids, 'count', 'measuredValue', '2018-12',
    ...   observation_period='P1M',
    ...   measurement_method='BLSSeasonallyAdjusted'
    ... )
0    18704962.0
1     1973955.0
2     3075662.0
dtype: float64
```

If an observation cannot be found given the constraints for a DCID, the return `dict` will
not contain the DCID as a key.:

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

## Errors

### `ValueError`: API key not specified

```python
>>> import datacommons as dc
>>> dc.get_property_labels(['geoId/06'])
ValueError: Request error: Must set an API key before using the API! You can
call datacommons.set_api_key or assign the key to an environment variable named
DC_API_KEY
```
