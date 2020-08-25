---
layout: default
title: Place Statistics - Time Series
nav_order: 13
parent: Python
grand_parent: API
---

# Get Statistical Time Series for a Place

## `get_stat_series(place, stat_var, measurement_method=None,observation_period=None, unit=None, scaling_factor=None)`

Returns a `dict` mapping date to value for `place` based on the
[`stat_var`](https://datacommons.org/browser/StatisticalVariable), with optional
filter parameters.

**Arguments**

* `place (str)`: The `dcid` of the [`Place`](https://datacommons.org/browser/Place) to query for.

* `stats_var (str)`: The `dcid` of the
  [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

* `measurement_method (str)`: (Optional) The `dcid` of the preferred [`measurementMethod`](https://datacommons.org/browser/measurementMethod for the `stat_var`.

* `observation_period (str)`: (Optional) The preferred [`observationPeriod`](https://datacommons.org/browser/observationPeriod) for the `stat_var`. This is an [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) such as P1M (one month).

* `unit (str)`: (Optional) The `dcid` of the preferred [`unit`](https://datacommons.org/browser/unit) for the `stat_var`.

* `scaling_factor (str)`: (Optional) The preferred [`scalingFactor`](https://datacommons.org/browser/scalingFactor) for the `stat_var`.

**Returns**

 A `dict` mapping `date`(str) to the statistical value (float).

**Raises**

* `ValueError` - If no statistial value found for the place with the given parameters.

Be sure to initialize the library. Check the [Python library setup guide](/api/python/) for more details.

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05)

```python
>>> import datacommons as dc
>>> dc.get_stat_series("geoId/05", "Count_Person_Male")

{"2013":1439862,"2014":1447235,"2015":1451913,"2016":1456694,"2017":1461651,"2018":1468412,"2011":1421287,"2012":1431252}
```

In next example, the parameter "observation=P3Y" overly constrains the request so the API
throws ValueError:

```python
>>> get_stat_series('geoId/06085', 'Count_Person', observation_period='P3Y')
>>> Traceback (most recent call last):
    ...
    raise ValueError('No data in response.')
```
