---
layout: default
title: Retrieve multivariate DataFrame
nav_order: 3
parent: Pandas
grand_parent: API
---

# Retrieve multivariate DataFrame

Returns a `pandas.DataFrame` with [`places`](https://datacommons.org/browser/Place)
as index and [`stat_vars`](https://datacommons.org/browser/StatisticalVariable)
as columns, where each cell is latest observed statistic for
its `Place` and `StatisticalVariable`.

See the [full list of `StatisticalVariable` classes](/statistical_variables.html).

## General information about the method

**Signature**:

```python
datacommons_pandas.build_multivariate_dataframe(places, stat_vars)
```

**Required arguments**:

* [`places`](/glossary.html): The `dcid` or `dcid` list of the [`Place`](https://datacommons.org/browser/Place) objects to query for.
* [`stat_vars`](/glossary.html): The `dcid` or `dcid` list of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable) objects to query for.

**NOTE:** In Data Commons, [`dcid`](/glossary.html) stands for Data Commons ID and indicates the unique identifier assigned to every node in the knowledge graph.

## Assembling the information you will need for a call to the build_multivariate_dataframe method

Going into more detail on how to assemble the values for the required arguments:

 - `places`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest.

 - `stat_vars`: This argument specifies the types of places sought in the response. For example, when examining places contained within American `States`, you would be able to select `City` or `County` (among others). For a full list of available types, see [`subClassOf Place`](https://datacommons.org/browser/Place).

## Example: Compare the historic populations, median ages, and unemployment rates of the US, California, and Santa Clara County.

```python
>>> datacommons_pandas.build_multivariate_dataframe(["country/USA", "geoId/06", "geoId/06085"],["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"])
             Median_Age_Person  Count_Person  UnemploymentRate_Person
place
country/USA               37.9     328239523                      NaN
geoId/06                  36.3      39512223                     11.6
geoId/06085               37.0       1927852                      7.5
```

## Error Returns

If a nonexistent place is passed as an argument, it will not render in the dataframe. In the following example, "geoId/123123123123123123" is one such nonexistent place.

```python
>>> datacommons_pandas.build_multivariate_dataframe(["country/USA", "geoId/06", "geoId/123123123123123123"],["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"])
             Count_Person  Median_Age_Person  UnemploymentRate_Person
place
country/USA     328239523               37.9                      NaN
geoId/06         39512223               36.3                     11.4
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons_pandas.build_multivariate_dataframe(["country/USA", "geoId/06", "geoId/123123123123123123"])
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: build_multivariate_dataframe() missing 1 required positional argument: 'stat_vars'
```
