---
layout: default
title: Place Statistics - Single Value
nav_order: 11
parent: Python
grand_parent: API
---

# Get Statistics Value for a Place.

## `get_stat_value(place, stat_var, date=None, measurement_method=None,observation_period=None, unit=None, scaling_factor=None)`

Returns a value for `place` based on the
[`stat_var`](https://datacommons.org/browser/StatisticalVariable), with optional
filter parameters.

See the [full list of StatisticalVariables](/statistical_variables.html).

**Arguments**

* `place (str)`: The `dcid` of the
  [`Place`](https://datacommons.org/browser/Place) to query for.

* `stats_var (str)`: The `dcid` of the
  [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

* `date (str)`: (Optional) The preferred date of the observation in ISO-8601 format, e.g. "YYYY", "YYYY-MM" or "YYYY-MM-DD". If not specified, returns the latest observation.

* `measurement_method (str)`: (Optional) The `dcid` of the preferred `measurementMethod` for the `stat_var`.

* `observation_period (str)`: (Optional) The preferred `observationPeriod` for the `stat_var`.

* `unit (str)`: (Optional) The `dcid` of the preferred `unit` for the `stat_var`.

* `scaling_factor (str)`: (Optional) The preferred `scalingFactor` for the `stat_var`.

**Returns**

 A `float` value of the `stat_var` for `place`, filtered by the optional parameters. If the optional parameters are specified, but are unavailable for the `stat_var`, then ... is returned.

**Raises**

* `ValueError` - If the payload returned by the Data Commons REST API is
malformed.

Be sure to initialize the library. Check the [Python library setup guide](/api/python/) for more details.

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## Examples

We would like to get the  [male population](https://datacommons.org/browser/Count_Person_Male) in [Arkansas](https://datacommons.org/browser/geoId/05)

```python
>>> import datacommons as dc
>>> dc.get_stat_value("geoId/05", "Count_Person_Male", date="2012")
1431252
```
