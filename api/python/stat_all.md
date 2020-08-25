---
layout: default
title: Place Statistics - All
nav_order: 14
parent: Python
grand_parent: API
---

# Get a Collection of Statistical Data for Multiple Places

## `datacommons.get_stat_all(places, stat_vars)`

Returns a nested `dict` of all time series for [`places`](https://datacommons.org/browser/Place) and [`stat_vars`](https://datacommons.org/browser/StatisticalVariable).

**Arguments**

- `places (Iterable of str)`: The `dcid`s of the [`Place`](https://datacommons.org/browser/Place) to query for.

- `stats_vars (Iterable of str)`: The `dcid`s of the
  [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

**Returns**

A nested `dict` mapping `Place`s to `StatisticalVariable`s and all available
time series for each Place and StatisticalVariable pair.

The top level `dict` key is the `Place` dcid and the second level `dict` key is the
`StatisticalVariable` dcid, with the object being an array of time series object
with the following fields

- `val`: a dict from date to statistical value.
- `importName`: the import name of the observations.
- `provenanceDomain`: the [Provenance](https://datacommons.org/browser/Provenance) domain of the observations.
- `measurementMethod`: the [`measurementMethod`](https://datacommons.org/browser/measurementMethod) of the observations, if it exists.
- `observationPeriod`: the [`observationPeriod`](https://datacommons.org/browser/observationPeriod) of the observations, if it exists.
- `unit`: the [`unit`](https://datacommons.org/browser/unit) of the observations, if it exists.
- `scalingFactor`: the [`scalingFactor`](https://datacommons.org/browser/scalingFactor) of the observations, if it exists.

**Raises**

- `ValueError` - If no statistical value found for any `Place` and `StatisticalVariable` combinations.

Be sure to initialize the library. Check the [Python library setup guide](/api/python/) for more details.

You can find a list of `StatisticalVariable`s with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the [population](https://datacommons.org/browser/Count_Person) and the [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05) and
[California](https://datacommons.org/browser/geoId/06).

```python
>>> import datacommons as dc
>>> dc.get_stat_all(["geoId/05", "geoId/06"], ["Count_Person", "Count_Person_Male"])
{
  "geoId/05": {
    "Count_Person": [
      {
        "val": {
          "2010": 1633,
          "2011": 1509,
          "2012": 1581,
        },
        "observationPeriod": "P1Y",
        "importName": "Wikidata",
        "provenanceDomain": "wikidata.org"
      },
      {
        "val": {
          "2010": 1333,
          "2011": 1309,
          "2012": 131,
        },
        "observationPeriod": "P1Y",
        "importName": "CensusPEPSurvey",
        "provenanceDomain": "census.gov"
      }
    ],
    "Count_Person_Male": [
      {
        "val": {
          "2010": 1633,
          "2011": 1509,
          "2012": 1581,
        },
        "observationPeriod": "P1Y",
        "importName": "CensusPEPSurvey",
        "provenanceDomain": "census.gov"
      }
    ],
  },
  "geoId/02": {
    "Count_Person": [],
    "Count_Person_Male": [
      {
        "val": {
          "2010": 13,
          "2011": 13,
          "2012": 322,
        },
        "observationPeriod": "P1Y",
        "importName": "CensusPEPSurvey",
        "provenanceDomain": "census.gov"
      }
    ],
  }
}
```

In the next example, there is no data found so the API throws ValueError:

```python
>>> dc.get_stat_all(['badGeoId'], ['BadStaVar'])
>>> Traceback (most recent call last):
    ...
    raise ValueError('No data in response.')
```
