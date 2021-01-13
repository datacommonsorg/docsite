---
layout: default
title: Place Statistics - All
nav_order: 13
parent: Python
grand_parent: API
---

# Get a Collection of Statistical Data for Multiple Places

## `datacommons.get_stat_all(places, stat_vars)`

Returns a nested `dict` of all time series for [`places`](https://datacommons.org/browser/Place) and [`stat_vars`](https://datacommons.org/browser/StatisticalVariable).
Note that in Data Commons, a Statistical Variable is any type of statistical metric that can be measured at a place and
time. See the [full list of StatisticalVariables](/statistical_variables.html).

**Arguments**

- `places (Iterable of str)`: The DCIDs of the [`Place`](https://datacommons.org/browser/Place) objects to query for. (Here DCID stands for Data Commons ID, the unique identifier assigned to all entities in Data Commons.)

- `stats_vars (Iterable of str)`: The `dcids` of the
  [`StatisticalVariables`](https://datacommons.org/browser/StatisticalVariable).

**Returns**

A nested `dict` mapping `Places` to `StatisticalVariables` and all available
time series for each `Place` and `StatisticalVariable` pair.

The top level `dict` key is the `Place` DCID and the second level `dict` key is the
`StatisticalVariable` DCID, with the object being an array of time series object
with the following fields:

- `val`: a dict with dates keyed to statistical values.
- `importName`: the dataset source name for the observations.
- `provenanceDomain`: the [Provenance](https://datacommons.org/browser/Provenance) domain URL of the observations.
- [`measurementMethod`](/glossary.html): the [`measurementMethod`](https://datacommons.org/browser/measurementMethod) of the observations, if it exists.
- [`observationPeriod`](/glossary.html): the [`observationPeriod`](https://datacommons.org/browser/observationPeriod) of the observations, if it exists.
- [`unit`](/glossary.html): the [`unit`](https://datacommons.org/browser/unit) of the observations, if it exists.
- [`scalingFactor`](/glossary.html): the [`scalingFactor`](https://datacommons.org/browser/scalingFactor) of the observations, if it exists.

If no statistical value can be found for a `Place` and `StatisticalVariable` combination passed into this method, a dictionary with no values is returned.

Be sure to initialize the library. Check the [Python library setup guide](/api/python/) for more details.

## Examples

This example retrieves the [population](https://datacommons.org/browser/Count_Person) and the [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05) and
[California](https://datacommons.org/browser/geoId/06).

```python
>>> import datacommons as dc
>>> dc.get_stat_all(["geoId/05"], ["Count_Person", "Count_Person_Male"])
{
  'geoId/05': {
    'Count_Person_Female': {
      'sourceSeries': [
        {
          'val': {
            '2001': 1376360
            '2002': 1382090,
            ...
            '2017': 1521170,
            '2018': 1527580,
          },
            'measurementMethod': 'OECDRegionalStatistics',
            'observationPeriod': 'P1Y',
            'importName': 'OECDRegionalDemography',
            'provenanceDomain': 'oecd.org'
        },
        {
          'val': {
            '2011': 1474641,
            '2012': 1485120
            ...
            '2017': 1516293,
            '2018': 1522259,
          },
          'measurementMethod': 'CensusACS5yrSurvey',
          'importName': 'CensusACS5YearSurvey',
          'provenanceDomain': 'census.gov'
        }
      ]
    },
    'Count_Person_Male': {
      'sourceSeries': [
        {
          'val': {
            '2001': 1315210,
            '2002': 1323840,
            ...
            '2017': 1475420,
            '2018': 1480140,
          },
          'measurementMethod': 'OECDRegionalStatistics',
          'observationPeriod': 'P1Y',
          'importName': 'OECDRegionalDemography',
          'provenanceDomain': 'oecd.org'
        },
        {
          'val': {
            '2011': 1421287
            '2012': 1431252,
            ...
            '2017': 1461651,
            '2018': 1468412,
          },
          'measurementMethod': 'CensusACS5yrSurvey',
          'importName': 'CensusACS5YearSurvey',
          'provenanceDomain': 'census.gov'
        }
      ]
    }
  }
}
```

In the next example, compare the populations of people with doctoral degrees in Minnesota and Wisconsin:

```python
>>> datacommons.get_stat_all(["geoId/27","geoId/55"], ["Count_Person_EducationalAttainmentDoctorateDegree"])
{'geoId/27': {'Count_Person_EducationalAttainmentDoctorateDegree': {'sourceSeries': [{'val': {'2016': 50039, '2017': 52737, '2018': 54303, '2012': 40961, '2013': 42511, '2014': 44713, '2015': 47323}, 'measurementMethod': 'CensusACS5yrSurvey', 'importName': 'CensusACS5YearSurvey', 'provenanceDomain': 'census.gov', 'provenanceUrl': 'https://www.census.gov/'}]}}, 'geoId/55': {'Count_Person_EducationalAttainmentDoctorateDegree': {'sourceSeries': [{'val': {'2017': 43737, '2018': 46071, '2012': 38052, '2013': 38711, '2014': 40133, '2015': 41387, '2016': 42590}, 'measurementMethod': 'CensusACS5yrSurvey', 'importName': 'CensusACS5YearSurvey', 'provenanceDomain': 'census.gov', 'provenanceUrl': 'https://www.census.gov/'}]}}}
```

In the last example, there is no data found, so the API returns a dictionary with no values:

```python
>>> dc.get_stat_all(["bad value"],["another bad value"])
{'bad value': {'another bad value': {}}}
```
