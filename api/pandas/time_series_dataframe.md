---
layout: default
title: Time Series Table as pd.DataFrame
nav_order: 2
parent: Pandas
grand_parent: API
---

# Get Time Series DataFrame

## `datacommons_pandas.build_time_series_dataframe(places, stat_var)`

Returns a `pandas.DataFrame` with [`places`](https://datacommons.org/browser/Place)
as index and dates as columns, where each cell is the observed statistic for
its place and date for the 
[`stat_var`](https://datacommons.org/browser/StatisticalVariable).

See the [full list of `StatisticalVariable`s](/statistical_variables.html).

**Arguments**

* `places (Iterable of str)`: A list of `dcid`s of the
  [`Place`](https://datacommons.org/browser/Place)s to query for.

* `stat_var (str)`: The `dcid` of the
  [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

**Returns**

A `pandas.DataFrame` with [`places`](https://datacommons.org/browser/Place)
(str) as index and dates (str) as columns, where each cell is the observed
statistic (float) for that place on that date for the 
[`stat_var`](https://datacommons.org/browser/StatisticalVariable).

**Raises**

* `ValueError` - If no statistical values found for the given parameters.

Be sure to initialize the library. See the
[datacommons_pandas library setup guide](/api/pandas/) for more details.

You can find a list of `StatisticalVariable`s with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the  [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05)

```python
>>> import datacommons_pandas as dcpd
>>> dcpd.build_time_series_dataframe("geoId/05", "Count_Person_Male")
             2001     2002     2003  ...     2016     2017     2018
place                                ...                           
geoId/05  1315210  1323840  1332910  ...  1469240  1475420  1480140
```

In the next example, there is no data about
`RetailDrugDistribution_DrugDistribution_Amphetamine` for non-USA
places, so the API throws ValueError for no data:

```python
>>> import datacommons_pandas as dcpd
>>> dcpd.build_time_series_dataframe(
      ["country/MEX", "nuts/AT32"],
      "RetailDrugDistribution_DrugDistribution_Amphetamine"
    )
ValueError    Traceback (most recent call last)
...
-->    raise ValueError('No data for any of specified Places and StatisticalVariables.')

ValueError: No data for any of specified places and stat_vars.
```
