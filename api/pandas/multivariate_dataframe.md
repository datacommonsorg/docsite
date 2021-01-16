---
layout: default
title: Multivariate Table as pd.DataFrame
nav_order: 3
parent: Pandas
grand_parent: API
---

# Get Multivariate DataFrame

## `datacommons_pandas.build_multivariate_dataframe(places, stats_vars)`

Returns a `pandas.DataFrame` with [`places`](https://datacommons.org/browser/Place)
as index and [`stat_vars`](https://datacommons.org/browser/StatisticalVariable)
as columns, where each cell is latest observed statistic for
its `Place` and `StatisticalVariable`.

See the [full list of `StatisticalVariable`s](/statistical_variables.html).

**Arguments**

*   `places (Iterable of str)`: A list of dcids of the
    [`Place`](https://datacommons.org/browser/Place)s to query for.

*   `stat_vars (Iterable of str)`: A list of dcids of the
    [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable)s
    to query for.

**Returns**

A `pandas.DataFrame` with [`places`](https://datacommons.org/browser/Place)
(str)
as index and [`stat_vars`](https://datacommons.org/browser/StatisticalVariable)
(str) as columns, where each cell is latest observed statistic (float) for
its `Place` and `StatisticalVariable`.

**Raises**

* `ValueError` - If no statistical values found for the given parameters.

You can find a list of `StatisticalVariable`s with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get a DataFrame of

- [Count_Person](https://datacommons.org/browser/Count_Person)
- [Median_Age_Person](https://datacommons.org/browser/Median_Age_Person)
- [UnemploymentRate_Person](https://datacommons.org/browser/UnemploymentRate_Person)

for
[the United States](https://datacommons.org/browser/country/USA),
[California](https://datacommons.org/browser/geoId/06),and
[Santa Clara County](https://datacommons.org/browser/geoId/06085).

```python
>>> import datacommons_pandas as dcpd
>>> dcpd.build_multivariate_dataframe(["country/USA", "geoId/06", "geoId/06085"],
                  ["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"])
             Count_Person  Median_Age_Person  UnemploymentRate_Person
place                                                                
country/USA     328239523               37.9                      NaN
geoId/06         39512223               36.3                     15.1
geoId/06085       1927852               37.0                     10.7
```

In the next example, there is no data about
`RetailDrugDistribution_DrugDistribution_14Hydroxycodeinone` nor
`RetailDrugDistribution_DrugDistribution_Amphetamine` for non-USA
places, so the API throws ValueError for no data:

```python
>>> import datacommons_pandas as dcpd
>>> dcpd.build_multivariate_dataframe(
      ["country/MEX", "nuts/AT32"],
      ["RetailDrugDistribution_DrugDistribution_14Hydroxycodeinone",
      "RetailDrugDistribution_DrugDistribution_Amphetamine"
      ]
    )
ValueError    Traceback (most recent call last)
...
-->    raise ValueError('No data for any of specified Places and StatisticalVariables.')

ValueError: No data for any of specified places and stat_vars.
```
