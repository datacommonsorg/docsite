---
layout: default
title: Place Statistics
nav_order: 10
parent: Python
grand_parent: API
---

# Get Statistics for Places.

## `get_stats(dcids, stats_var, obs_dates='latest')`

Returns a time series of statistical values for queried places based on the
[`StatisticalVariable`](https://browser.datacommons.org/kg?dcid=StatisticalVariable) filtered by the specified dates.

**Arguments**

*   `dcids`: A list of dcids of the
    [`Place`](https://browser.datacommons.org/kg?dcid=Place) to query for.

*   `stats_var`: The dcid of the
    [`StatisticalVariable`](https://browser.datacommons.org/kg?dcid=StatisticalVariable).

*   `obs_dates`: The dates of [`Observation`](https://browser.datacommons.org/kg?dcid=Observation)s to include. Can be 'latest', 'all', or an list of dates in ISO-8601 format, e.g. "YYYY", "YYYY-MM" or "YYYY-MM-DD".

**Returns**

A dictionary mapping each `Place` identified by the given `dcid`
to its name and the time series associated with the
`StatisticalVariable` identified by the given `stats_var`
and filtered by `obs_dates`.
See example below for more detail about how the returned dictionary is
structured.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is
malformed.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the time series of the [male population](https://browser.datacommons.org/kg?dcid=Count_Person_Male)
in [Arkansas](https://browser.datacommons.org/kg?dcid=geoId/05)
and [Santa Clara County](https://browser.datacommons.org/kg?dcid=geoId/06085).

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dc.get_stats(["geoId/05", "geoId/06085"], "Count_Person_Male", obs_dates="all")
{
  'geoId/05': {
    'data': {
      '2011': 1421287,
      '2012': 1431252,
      '2013': 1439862,
      '2014': 1447235,
      '2015': 1451913,
      '2016': 1456694,
      '2017': 1461651,
      '2018': 1468412
    },
    'place_name': 'Arkansas'
  },
  'geoId/06085': {
    'data': {
      '2011': 885307,
      '2012': 898013,
      '2013': 910196,
      '2014': 924848,
      '2015': 939004,
      '2016': 949223,
      '2017': 963317,
      '2018': 970469
    },
    'place_name': 'Santa Clara County'
  }
}
```

## Errors

### `ValueError`: API key not specified

```python
>>> import datacommons as dc
>>> dc.get_stats(["geoId/05", "geoId/06"], "dc/0hyp6tkn18vcb")
ValueError: Request error: Must set an API key before using the API! You can
call datacommons.set_api_key or assign the key to an environment variable named
DC_API_KEY
```