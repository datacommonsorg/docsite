---
layout: default
title: Get statistical observations as Pandas DataFrames
nav_order: 3
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Observation Pandas

In addition to the [Observation endpoint](observation.md), the client provides direct access to a special property method, `observation_dataframes` which provides the same functionality, but returns results as [Pandas](https://pandas.pydata.org/docs/index.html){: target="_blank"} [DataFrames](https://pandas.pydata.org/docs/user_guide/dsintro.html#basics-dataframe){: target="_blank"}.

> **Note:** To use this feature, you must have installed the `Pandas` module. See [Install the Python Data Commons V2 API](index.md#install) for details.

* TOC
{:toc}

## observation_pandas

Fetches observations for specified variables, dates, and entities (or all entities in the knowledge graph). 

### Signature

```python
observation_pandas(variable_dcids, date, select, entity_dcids, entity_expression)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/> <required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| date <br/><optional-tag>Optional</optional-tag> | string | The date (and time) for which the observations are being requested. By default this is set to `latest`, which returns the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. Other allowed values are: <br>
* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see [Find the date format for a statistical variable](/api/rest/v2/observation.html#find-date-format).<br>
* "" - Get all observations for the specified variables and entities  |
| select <optional-tag>Optional</optional-tag> | list of strings | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`. The only other valid option is `["entity", "variable"]`, which returns no observations. This may be useful to look up the entities (places) that are associated with the selected variables. |
| entity_dcids | string or list of strings | One ore more [DCIDs](/glossary.html#dcid) of the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| entity.expression  | string | A [relation expression](/api/rest/v2/index.html#relation-expressions) that represents the entities to query. One of `entity_dcids` or `entity_expression` is required. |


entity_dcids: Literal["all"] | list[str] = "all",
      entity_type: Optional[str] = None,
      parent_entity: Optional[str] = None,
      property_filters: Optional[dict[str, str | list[str]]] = None,
{: .doc-table }

### Examples

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


```#

## Example: Compare the historic populations, median ages, and unemployment rates of the US, California, and Santa Clara County.

```python
>>> datacommons_pandas.build_multivariate_dataframe(["country/USA", "geoId/06", "geoId/06085"],["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"])
             Median_Age_Person  Count_Person  UnemploymentRate_Person
place
country/USA               37.9     328239523                      NaN
geoId/06                  36.3      39512223                     11.6
geoId/06085               37.0       1927852                      7.5
```

## Examples

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