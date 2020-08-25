---
layout: default
title: Place Statistics - Single Value
nav_order: 12
parent: Python
grand_parent: API
---

# Get Statistics Value for a Place.

## `datacommons.get_stat_value(place, stat_var, date=None, measurement_method=None,observation_period=None, unit=None, scaling_factor=None)`

Returns a value for `place` based on the
[`stat_var`](https://datacommons.org/browser/StatisticalVariable), with optional
filter parameters.

See the [full list of StatisticalVariables](/statistical_variables.html).

**Arguments**

* `place (str)`: The `dcid` of the
  [`Place`](https://datacommons.org/browser/Place) to query for.

* `stats_var (str)`: The `dcid` of the
  [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

* `date (str)`: (Optional) The preferred [`observationDate`](https://datacommons.org/browser/observationDate). This is an [ISO-8601 date](https://en.wikipedia.org/wiki/ISO_8601#Dates), e.g. "YYYY", "YYYY-MM" or "YYYY-MM-DD". If not specified, returns the latest observation.

* `measurement_method (str)`: (Optional) The `dcid` of the preferred [`measurementMethod`](https://datacommons.org/browser/measurementMethod for the `stat_var`.

* `observation_period (str)`: (Optional) The preferred [`observationPeriod`](https://datacommons.org/browser/observationPeriod) for the `stat_var`. This is an [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) such as P1M (one month).

* `unit (str)`: (Optional) The `dcid` of the preferred [`unit`](https://datacommons.org/browser/unit) for the `stat_var`.

* `scaling_factor (str)`: (Optional) The preferred [`scalingFactor`](https://datacommons.org/browser/scalingFactor) for the `stat_var`.

**Returns**

 A `float` value of the `stat_var` for `place`, filtered by the optional parameters.

**Raises**

* `ValueError` - If no statistial value found for the place with the given parameters.

Be sure to initialize the library. Check the [Python library setup guide](/api/python/) for more details.

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the  [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05)

```python
>>> import datacommons as dc
>>> dc.get_stat_value("geoId/05", "Count_Person_Male", date="2012")
1431252
```

In next example, the parameter "observation=P3Y" overly constrains the request so the API
throws ValueError:

```python
>>> dc.get_stat_value('geoId/06085', 'Count_Person', observation_period='P3Y')
>>> Traceback (most recent call last):
    ...
    raise ValueError('No data in response.')
```
