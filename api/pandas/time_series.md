---
layout: default
title: Time Series as pd.Series
nav_order: 1
parent: Pandas
grand_parent: API
---

# Get Time Series for a Place

Returns a `pandas.Series` representing a time series for the [`place`](https://datacommons.org/browser/Place) and
[`stat_var`](https://datacommons.org/browser/StatisticalVariable) satisfying any optional parameters.

See the [full list of `StatisticalVariable`s](/statistical_variables.html).

## General information about this method

**Signature**: `datacommons_pandas.build_time_series(place, stat_var, measurement_method=None,observation_period=None, unit=None, scaling_factor=None)`

**Required arguments**:

* `place`: The `dcid` of the [`Place`](https://datacommons.org/browser/Place) to query for.
* `stat_var`: The `dcid` of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

**NOTE:** In Data Commons, `dcid` stands for Data Commons ID and indicates the unique identifier assigned to every node in the knowledge graph.

## Assembling the information you will need for a call to the build_time_series method

Going into more detail on how to assemble the values for the required arguments:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest.

 - `place_type`: This argument specifies the type of place sought in the response. For example, when examining places contained within American `States`, you would be able to select `City` or `County` (among others). For a full list of available types, see [`subClassOf Place`](https://datacommons.org/browser/Place.

In addition to these required properties, this endpoint also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

- `measurement_method`: You can specify this argument as out to indicate that you desire the response to only include nodes which are supercategories of the specified DCIDs, or in to only return nodes that are subcategories of the specified DCIDs. (For example, South America is a supercategory of Argentina, which in turn is a supercategory of Buenos Aires, as illustrated in Figure 1.)

- `observation_period`: (≤ 500) Maximum number of values returned per node.

- `unit`: The unit of measurement.

- `scaling_factor (int)`: (Optional) The preferred [`scalingFactor`](https://datacommons.org/browser/scalingFactor) for the `stat_var`.

Note that specifying arguments that do not exist for the target place and variable will result in an empty response.

## Example requests and responses

### Example 1: Retrieve the count of men in the state of California.

```python
>>> datacommons_pandas.build_time_series("geoId/05", "Count_Person_Male")
2017    1461651
2018    1468412
2011    1421287
2012    1431252
2013    1439862
2014    1447235
2015    1451913
2016    1456694
dtype: int64
```

### Example 2: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

```python
>>> datacommons_pandas.build_time_series("country/BIH", "Count_Person", measurement_method="BosniaCensus")
2013    3791622
dtype: int64
```

### Example 3: Retrieve the death count in Miami-Dade County over a period of one year.

```python
>>> datacommons_pandas.build_time_series("geoId/12086", "Count_Death", observation_period="P1Y")
2001    19049
2004    18384
2008    18012
2011    17997
2000    18540
2003    18399
2006    18261
2013    18473
1999    19170
2002    18176
2009    17806
2014    19013
2015    19542
2016    20277
2005    18400
2007    17982
2010    18048
2012    18621
2017    20703
dtype: int64

```

### Example 4: Retrieve the distrubtion of naloxone in Miami-Dade County in grams.

```python
>>> datacommons_pandas.build_time_series("geoId/12086", "RetailDrugDistribution_DrugDistribution_Naloxone", unit="Grams")
2006-10     55.21
2007-01     59.63
2007-04     65.98
2007-07     80.34
2007-10    118.79
2006-01     44.43
2006-04     48.28
2006-07     54.98
dtype: float64
```

### Example 5: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

```python
>>> datacommons_pandas.build_time_series("country/GMB", "Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal", scaling_factor="100.0000000000")
1986    3.48473
2008    3.52738
2012    4.10118
1991    3.78061
1996    2.56628
1999    1.56513
2002    1.44292
2003    1.36338
2014    2.17849
2006    1.20949
2013    1.82979
1989    2.97409
1990    2.82584
2001    1.15810
2004    1.03450
2007    1.30849
1985    4.29515
1992    1.16984
1995    2.55356
2015    2.13528
2000    1.46587
2005    1.13919
2009    3.07235
2010    4.15610
2011    3.92511
2016    2.05946
2018    2.43275
dtype: float64
```

## Error Returns

If there is no value associated with the requested property, an empty `Series` object is returned:

```python
>>> datacommons_pandas.build_time_series("geoId/000", "Count_Person_Male")
Series([], dtype: float64)
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons_pandas.build_time_series("geoId/000")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: build_time_series() missing 1 required positional argument: 'stat_var'
```