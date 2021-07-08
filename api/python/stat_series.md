---
layout: default
title: Place Statistics - Time Series
nav_order: 12
parent: Python
grand_parent: API
---

# Retrieve statistical time series for a place

Returns a `dict` mapping date to value for a `place` based on the
[`stat_var`](https://datacommons.org/browser/StatisticalVariable), with optional
filter parameters. See the [full list of `StatisticalVariable` classes](/statistical_variables.html).

## General information about this endpoint

**Signature**:

```python
datacommons.get_stat_series(place, stat_var, measurement_method=None,observation_period=None, unit=None, scaling_factor=None)
```

**Required arguments**:

* `place`: The `dcid` of the [`Place`](https://datacommons.org/browser/Place) to query for.
* `stat_var`: The `dcid` of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

>    **NOTE:**
>    - In Data Commons, [`dcid`](/glossary.html) stands for Data Commons ID and indicates the unique identifier assigned to every node in the knowledge graph.

## Assembling the information you will need for a call to the get_stat_series method

Going into more detail on how to assemble the values for the required arguments:

- [`place`](/glossary.html): For this parameter, you will need to specify the DCID (the unique ID assigned by Data Commons to each node in the graph) of the place you are interested in.

- [`stat_var`](/glossary.html): The statistical variable whose value you are interested in.

In addition to these required properties, this endpoint also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

  - [`measurement_method`](https://docs.datacommons.org/glossary.html): The technique used for measuring a statistical variable.

  - [`observation_period`](https://docs.datacommons.org/glossary.html): The time period over which an observation is made.

  - [`unit`](https://docs.datacommons.org/glossary.html): The unit of measurement.

  - [`scaling_factor`](https://docs.datacommons.org/glossary.html): Property of statistical variables indicating factor by which a measurement is multiplied to fit a certain format.

Note that specifying arguments that do not exist for the target place and variable will result in an empty response.

## What to expect in the function return

The method's return value will always be a `dict` in the following form:

```python
{
    "<dcid>": <integer>
    ...
}
```

## Examples

### Example 1: Retrieve the count of men in the state of California.

```python
>>> datacommons.get_stat_series("geoId/05", "Count_Person_Male")
{'2011': 1421287, '2012': 1431252, '2013': 1439862, '2014': 1447235, '2015': 1451913, '2016': 1456694, '2017': 1461651, '2018': 1468412}
```

### Example 2: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

```python
>>> datacommons.get_stat_series("country/BIH", "Count_Person", measurement_method="BosniaCensus")
{'2013': 3791622}
```

### Example 3: Retrieve the death count in Miami-Dade County over a period of one year.

```python
>>> datacommons.get_stat_series("geoId/12086", "Count_Death", observation_period="P1Y")
{'1999': 19170, '2001': 19049, '2002': 18176, '2009': 17806, '2012': 18621, '2015': 19542, '2005': 18400, '2008': 18012, '2010': 18048, '2017': 20703, '2000': 18540, '2003': 18399, '2006': 18261, '2013': 18473, '2014': 19013, '2004': 18384, '2007': 17982, '2011': 17997, '2016': 20277}
```

### Example 4: Retrieve the distrubtion of naloxone in Miami-Dade County in grams.

```python
>>> datacommons.get_stat_series("geoId/12086", "RetailDrugDistribution_DrugDistribution_Naloxone", unit="Grams")
{'2007-07': 80.34, '2007-10': 118.79, '2006-01': 44.43, '2006-04': 48.28, '2006-07': 54.98, '2006-10': 55.21, '2007-01': 59.63, '2007-04': 65.98}
```

### Example 5: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

```python
>>> datacommons.get_stat_series("country/GMB", "Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal", scaling_factor="100.0000000000")
{'1986': 3.48473, '1996': 2.56628, '2000': 1.46587, '2010': 4.1561, '2014': 2.17849, '2012': 4.10118, '2013': 1.82979, '1999': 1.56513, '1985': 4.29515, '1992': 1.16984, '1995': 2.55356, '2002': 1.44292, '2015': 2.13528, '2005': 1.13919, '2018': 2.43275, '2008': 3.52738, '2016': 2.05946, '1989': 2.97409, '1990': 2.82584, '1991': 3.78061, '2011': 3.92511, '2004': 1.0345, '2007': 1.30849, '2009': 3.07235, '2001': 1.1581, '2003': 1.36338, '2006': 1.20949}
```

## Error Returns

If there is no series associated with the requested property, an empty list is returned:

```python
>>> datacommons.get_stat_series("geoId/1001", "Count_Person_Male")
{}
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons.get_stat_series("geoId/1001")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: get_stat_series() missing 1 required positional argument: 'stat_var'
```
