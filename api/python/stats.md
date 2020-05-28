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

## Examples

We would like to get the time series of the [number of males
at least 25 years old that attended 12th grade but did not receive
a high school diploma (`dc/0hyp6tkn18vcb`)](https://browser.datacommons.org/kg?dcid=dc/0hyp6tkn18vcb)
in [Arkansas](https://browser.datacommons.org/kg?dcid=geoId/05)
and [California](https://browser.datacommons.org/kg?dcid=geoId/06).

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dc.get_stats(["geoId/05", "geoId/06"], "dc/0hyp6tkn18vcb", obs_dates="all")
{
  'geoId/05': {
    'place_name': 'Arkansas'
    'data': {
      '2011':18136,
      '2012':17279,
      '2013':17459,
      '2014':16966,
      '2015':17173,
      '2016':17041,
      '2017':17783,
      '2018':18003
    },
  },
  'geoId/05': {
    'place_name': 'California'
    'data': { 
      '2011':316667,
      '2012':324116,
      '2013':331853,
      '2014':342818,
      '2015':348979,
      '2016':354806,
      '2017':360645,
      '2018':366331
    },
  },
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
