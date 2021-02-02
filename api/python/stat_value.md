---
layout: default
title: Place Statistics - Single Value
nav_order: 11
parent: Python
grand_parent: API
---

# Retrieve statistics value for a place

Returns a statistical value for a place based on the
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of `StatisticalVariable` classes](/statistical_variables.html).

When there are multiple sources for the same statistical variable, a preferred
source with more recent data or more authority is selected.

## General information about this endpoint

**Signature**: 

```python
datacommons.get_stat_value(place, stat_var, date=None, measurement_method=None,observation_period=None, unit=None, scaling_factor=None)
```

**Required arguments**:

* `place`: The [DCID](https://docs.datacommons.org/glossary.html) of the [`Place`](https://datacommons.org/browser/Place) to query for.
* `stat_var`: The DCID of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

**Optional arguments**:

* `date`: The preferred date of observation in ISO 8601 format. If not specified, returns the latest observation.
* `measurement_method`: The DCID of the preferred `measurementMethod` value.
* `observation_period`: The preferred `observationPeriod` value.
* `unit`: The DCID of the preferred `unit` value.
* `scaling_factor`: The preferred `scalingFactor` value.

## Assembling the information you will need for a call to the get_stat_value method

Going into more detail on how to assemble the values for the required arguments:

 - [`place`]((/glossary.html)): For this parameter, you will need to specify the DCID (the unique ID assigned by Data Commons to each node in the graph) of the place you are interested in.
 - [`stat_var`](/glossary.html): The statistical variable whose value you are interested in.

In addition to these required properties, this method also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

  - [`date`](https://docs.datacommons.org/glossary.html): Specified in ISO 8601 format. Examples include `2011` (the year 2011), `2019-06` (the month of June in the year 2019), and `2019-06-05T17:21:00-06:00` (5:17PM on June 5, 2019, in CST).

  - [`measurement_method`](https://docs.datacommons.org/glossary.html): The technique used for measuring a statistical variable.
  
  - [`observation_period`](https://docs.datacommons.org/glossary.html): The time period over which an observation is made.

  - [`unit`](https://docs.datacommons.org/glossary.html): The unit of measurement.

  - [`scaling_factor`](https://docs.datacommons.org/glossary.html): Property of statistical variables indicating factor by which a measurement is multiplied to fit a certain format.

## What to expect in the return

The method will return a simple number, like '1.20949' or '1431252'.

## Examples

### Example 1: Retrieve the count of men in the state of California.

```python
>>> datacommons.get_stat_value("geoId/05", "Count_Person_Male")
1474705
```

### Example 2: Retrieve the count of men in the state of California in the year 2012.

```python
>>> datacommons.get_stat_value("geoId/05", "Count_Person_Male", date="2012")
1431252
```

### Example 3: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

```python
>>> datacommons.get_stat_value("country/BIH", "Count_Person", measurement_method="BosniaCensus")
3791622
```

### Example 4: Retrieve the death count in Miami-Dade County over a period of one year.

```python
>>> datacommons.get_stat_value("geoId/12086", "Count_Death", observation_period="P1Y")
20703
```

### Example 5: Retrieve the distrubtion of the drug naloxone in Miami-Dade County in grams.

```python
>>> datacommons.get_stat_value("geoId/12086", "RetailDrugDistribution_DrugDistribution_Naloxone", unit="Grams")
118.79
```

### Example 6: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

```python
>>> datacommons.get_stat_value("country/GMB", "Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal", scaling_factor="100.0000000000")
2.43275
```

## Error Returns

If there is no value associated with the requested property, `nan` is returned:

```python
>>> datacommons.get_stat_value("geoId/1001", "Count_Person_Male")
nan
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons.get_stat_value("geoId/1001")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: get_stat_value() missing 1 required positional argument: 'stat_var'
```