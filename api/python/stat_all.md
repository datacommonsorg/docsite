---
layout: default
title: Place Statistics - All
nav_order: 9
parent: Python
grand_parent: API
---

# Retrieve a collection of statistical data for multiple places

Returns a nested `dict` of all time series for [`places`](https://datacommons.org/browser/Place) and [`stat_vars`](https://datacommons.org/browser/StatisticalVariable).
Note that in Data Commons, a `StatisticalVariable` is any type of statistical metric that can be measured at a place and
time. See the [full list of StatisticalVariables](/statistical_variables.html).

## General information about this method

**Signature**:

```python
datacommons.get_stat_all(places, stat_vars)
```

**Required arguments**

- `places`: The [`DCID`](/glossary.html) IDs of the [`Place`](https://datacommons.org/browser/Place) objects to query for. (Here DCID stands for Data Commons ID, the unique identifier assigned to all entities in Data Commons.)
- [`stat_vars`](/glossary.html): The `dcids` of the [`StatisticalVariables`](https://datacommons.org/browser/StatisticalVariable).

## Assembling the information you will need for a call to the get_stat_all method

Going into more detail on how to assemble the values for the required arguments:

- `place`: For this parameter, you will need to specify the DCID (the unique ID assigned by Data Commons to each node in the graph) of the place you are interested in.
- [`stat_var`](/glossary.html): The statistical variable whose value you are interested in.

>  **NOTE:**
>  Be sure to initialize the library. Check the [Python library setup guide](/api/python/) for more details.

## What to expect in the function return

The method's return value will always be an object in the following form:

```python
{
    "<dcid>": {
      "stat_var": {
        "sourceSeries": [
          {
            "val": {
              <"time series">
            }
            "measurementMethod": "<String>",
            "observationPeriod": "<String>",
            "importName": "<String>",
            "provenanceDomain": "<String>"
          }
          ...
        ]
      }
      ...
    }
    ...
}
```

For more information on the key terms in this sample response, see [the glossary](/glossary.html).

## Examples

### Example 1: Retrieve the total population as well as the male population of Arkansas.

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

### Example 2: Retrieve the populations of people with doctoral degrees in Minnesota and Wisconsin.

```python
>>> datacommons.get_stat_all(["geoId/27","geoId/55"], ["Count_Person_EducationalAttainmentDoctorateDegree"])
{'geoId/27': {'Count_Person_EducationalAttainmentDoctorateDegree': {'sourceSeries': [{'val': {'2016': 50039, '2017': 52737, '2018': 54303, '2012': 40961, '2013': 42511, '2014': 44713, '2015': 47323}, 'measurementMethod': 'CensusACS5yrSurvey', 'importName': 'CensusACS5YearSurvey', 'provenanceDomain': 'census.gov', 'provenanceUrl': 'https://www.census.gov/'}]}}, 'geoId/55': {'Count_Person_EducationalAttainmentDoctorateDegree': {'sourceSeries': [{'val': {'2017': 43737, '2018': 46071, '2012': 38052, '2013': 38711, '2014': 40133, '2015': 41387, '2016': 42590}, 'measurementMethod': 'CensusACS5yrSurvey', 'importName': 'CensusACS5YearSurvey', 'provenanceDomain': 'census.gov', 'provenanceUrl': 'https://www.census.gov/'}]}}}
```

## Error returns

When no data is found, the API returns a dictionary with no values:

```python
>>> import datacommons as dc
>>> dc.get_stat_all(["bad value"],["another bad value"])
{'bad value': {'another bad value': {}}}
```
