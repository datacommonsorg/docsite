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
observation_pandas(variable_dcids, date, entity_dcids, entity_type, parent_entity, property_filters)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/> <required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
date <br/><required-tag>Required</required-tag> | string or string literal | The date (and time) for which the observations are being requested. Allowed values are: <br/>* `latest`: return the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. </br>* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`.<br/>* "all" - Get all observations for the specified variables and entities. |
| entity_dcids <br/><optional-tag>Optional</optional-tag> | string or list of strings or string literal | By default this is set to `"all"`, which gets observations for all available entities for the specified variables and dates. To limit to specific entties, set this to one or more [DCIDs](/glossary.html#dcid) of the entities to query. |
| entity_type | string | The DCID of the type of the entities to query; for example, `Country` or `Region`. Required when `entity_dcids` is set to `"all"` (the default); invalid otherwise. | 
| parent_entity <br/><optional-tag>Optional</optional-tag> | string | The DCID of the parent entities to query; for example, `africa` for African countries, or `Earth` for all countries. Optional when `entity_dcids` is set to `"all"` (the default); invalid otherwise.|
| property_filters <br/><optional-tag>Optional</optional-tag> | dict of strings or list of strings | The observation propertes by whch to filter the results, such as `measurementMethod`, `unit`, or `observationPeriod`.
{: .doc-table }

## Examples

### Example 1: Get all observations for a single variable and entity

This example retrieves the count of men in the state of California over all data history.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids="Count_Person_Male", date="all", entity_dcids="geoId/05")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```python
     date    entity           variable      value     facetId            importName   measurementMethod observationPeriod                                      provenanceUrl  unit
0    2011  geoId/05  Count_Person_Male  1421287.0  1145703171  CensusACS5YearSurvey  CensusACS5yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
1    2012  geoId/05  Count_Person_Male  1431252.0  1145703171  CensusACS5YearSurvey  CensusACS5yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
2    2013  geoId/05  Count_Person_Male  1439862.0  1145703171  CensusACS5YearSurvey  CensusACS5yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
3    2014  geoId/05  Count_Person_Male  1447235.0  1145703171  CensusACS5YearSurvey  CensusACS5yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
4    2015  geoId/05  Count_Person_Male  1451913.0  1145703171  CensusACS5YearSurvey  CensusACS5yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
..    ...       ...                ...        ...         ...                   ...                 ...               ...                                                ...   ...
191  2015  geoId/05  Count_Person_Male  1463576.0  1226172227  CensusACS1YearSurvey  CensusACS1yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
192  2016  geoId/05  Count_Person_Male  1468782.0  1226172227  CensusACS1YearSurvey  CensusACS1yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
193  2017  geoId/05  Count_Person_Male  1479682.0  1226172227  CensusACS1YearSurvey  CensusACS1yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
194  2018  geoId/05  Count_Person_Male  1476680.0  1226172227  CensusACS1YearSurvey  CensusACS1yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None
195  2019  geoId/05  Count_Person_Male  1474705.0  1226172227  CensusACS1YearSurvey  CensusACS1yrSurvey              None  https://www.census.gov/programs-surveys/acs/da...  None

[196 rows x 10 columns]
```

### Example 2: Get all observations for a single variable and multiple entities

This example compares the historic populations of Sudan and South Sudan.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids="Count_Person", date="all", entity_dcids=["country/SSD","country/SDN"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```python
     date       entity      variable     value  ...                       measurementMethod observationPeriod                                      provenanceUrl  unit
0    1960  country/SSD  Count_Person   2931559  ...                                    None               P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
1    1961  country/SSD  Count_Person   2976724  ...                                    None               P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
2    1962  country/SSD  Count_Person   3024308  ...                                    None               P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
3    1963  country/SSD  Count_Person   3072669  ...                                    None               P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
4    1964  country/SSD  Count_Person   3129918  ...                                    None               P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
..    ...          ...           ...       ...  ...                                     ...               ...                                                ...   ...
165  2016  country/SDN  Count_Person  39579000  ...  WorldBankSubnationalPopulationEstimate               P1Y  https://databank.worldbank.org/source/subnatio...  None
166  2024  country/SDN  Count_Person  50467278  ...                               Wikipedia              None                          https://www.wikipedia.org  None
167  2008  country/SDN  Count_Person  30894000  ...                      WikidataPopulation              None   https://www.wikidata.org/wiki/Wikidata:Main_Page  None
168  2015  country/SDN  Count_Person  40235000  ...                      WikidataPopulation              None   https://www.wikidata.org/wiki/Wikidata:Main_Page  None
169  2017  country/SDN  Count_Person  40533330  ...                      WikidataPopulation              None   https://www.wikidata.org/wiki/Wikidata:Main_Page  None

[170 rows x 10 columns]
```

### Example 3: Get all observations for multiple variables and multiple entities

This example compares the historic populations, median ages, and unemployment rates of the US, California, and Santa Clara County.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids=["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"], date="all", entity_dcids=["country/USA", "geoId/06", "geoId/06085"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)


### Example 4: Get all observations for a single variable and entity, with a property filter

This example gets all observations of the mortality rate for Miami-Dade County, filtering by observation period of one year.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids="Count_Death", date="all", entity_dcids="geoId/12086", property_filters={ "observationPeriod" : "P1Y"})
```

Response:
{: .example-box-title}

(truncated)

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

### Example 5: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

```python
>>> datacommons_pandas.build_time_series("country/GMB", "Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal", scaling_factor="100.0000000000")
```
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