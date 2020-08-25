---
layout: default
title: Time Series as pd.Series
nav_order: 1
parent: Pandas
grand_parent: API
---

# Get Time Series as pandas Series

## `datacommons_pandas.build_time_series(place, stat_var)`

Returns a `pandas.Series` mapping date to value for a `place` based on the
[`stat_var`](https://datacommons.org/browser/StatisticalVariable), with optional
filter parameters.

See the [full list of StatisticalVariables](/statistical_variables.html).

**Arguments**

* `place (str)`: The `dcid` of the [`Place`](https://datacommons.org/browser/Place) to query for.

* `stat_var (str)`: The `dcid` of the
  [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

* `measurement_method (str)`: (Optional) The `dcid` of the preferred [`measurementMethod`](https://datacommons.org/browser/measurementMethod for the `stat_var`.

* `observation_period (str)`: (Optional) The preferred [`observationPeriod`](https://datacommons.org/browser/observationPeriod) for the `stat_var`. This is an [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) such as "P1M" (one month).

* `unit (str)`: (Optional) The `dcid` of the preferred [`unit`](https://datacommons.org/browser/unit) for the `stat_var`.

* `scaling_factor (int)`: (Optional) The preferred [`scalingFactor`](https://datacommons.org/browser/scalingFactor) for the `stat_var`.

**Returns**

 A `pandas.Series` with dates (str) as index for observed values (float) for the `stat_var` and `place`.

**Raises**

* `ValueError` - If no statistical value found for the place with the given parameters.

Be sure to initialize the library. Check the [datacommons_pandas library setup guide](/api/pandas/) for more details.

You can find a list of `StatisticalVariables` with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05)

```python
>>> import datacommons_pandas as dcpd
>>> dcpd.build_time_series("geoId/05", "Count_Person_Male")
2015    1451913
2016    1456694
2017    1461651
2018    1468412
2011    1421287
2012    1431252
2013    1439862
2014    1447235
dtype: int64
```

In the next example, the parameter `observation_period='P3Y'` overly constrains the request so the API
throws ValueError:

```python
>>> dcpd.build_time_series('geoId/06085', 'Count_Person', observation_period='P3Y')
ValueError    Traceback (most recent call last)
...
-->          raise ValueError('No data in response.')

ValueError: No data in response.
```
