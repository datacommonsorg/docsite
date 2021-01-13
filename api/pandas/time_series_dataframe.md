---
layout: default
title: Time Series Table as pd.DataFrame
nav_order: 2
parent: Pandas
grand_parent: API
---

# Get Time Series DataFrame

Returns a `pandas.DataFrame` with [`places`](https://datacommons.org/browser/Place)
as index and dates as columns, where each cell is the observed statistic for
its place and date for the 
[`stat_var`](https://datacommons.org/browser/StatisticalVariable).

See the [full list of `StatisticalVariable`s](/statistical_variables.html).

## General information about this method

**Signature**: `datacommons_pandas.build_time_series_dataframe(places, stat_var)`

**Required arguments**:

* `places`: The `dcid` or `dcid` list of the [`Place`](https://datacommons.org/browser/Place) objects to query for.
* `stat_var`: The `dcid` of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

**NOTE:** In Data Commons, [`dcid`](/glossary.html) stands for Data Commons ID and indicates the unique identifier assigned to every node in the knowledge graph.

## Assembling the information you will need for a call to the build_time_series method

Going into more detail on how to assemble the values for the required arguments:

 - [`places`](/glossary.html): Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the places of interest.

 - [`stat_var`](/glossary.html): This argument specifies the statistical variable whose measurement you seek.

## Examples

### Example 1: Retrieve the count of men in the state of California.

```python
>>> datacommons_pandas.build_time_series_dataframe("geoId/05", "Count_Person_Male")
             2010     2011     2012  ...     2017     2018     2019
place                                ...                           
geoId/05  1430837  1447850  1449265  ...  1479682  1476680  1474705

[1 rows x 10 columns]
```

### Example 2: Compare the historic populations of Sudan and South Sudan.

```python
>>> datacommons_pandas.build_time_series_dataframe(["country/SSD","country/SDN"], "Count_Person")
                   2019     2019-06
place                              
country/SDN         NaN  41592539.0
country/SSD  12778250.0         NaN
```

## Error Returns

If a nonexistent place is passed as an argument, it will not render in the dataframe, as follows:

```python
>>> datacommons_pandas.build_time_series_dataframe(["geoId/123123123123123123","geoId/36"], "Count_Person")
              2001      2002      2003  ...      2017      2018      2019
place                                   ...                              
geoId/36  19082800  19137800  19175900  ...  19589600  19530400  19453600

[1 rows x 19 columns]
```

If you do not pass a required positional argument, a TypeError is returned:

```python
>>> datacommons_pandas.build_time_series_dataframe(["geoId/123123123123123123","geoId/36"])
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: build_time_series_dataframe() missing 1 required positional argument: 'stat_var'
```
