---
layout: default
title: Observation
nav_order: 6
parent: R
grand_parent: API
---

# Get Observations for Populations.

## `get_observations(dcids, measured_property, stats_type, observation_date, observation_period=NULL, measurement_method=NULL)`

Given a list of
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)
DCIDs, return the DCID of
[`Observation`](https://browser.datacommons.org/kg?dcid=Observation)s for these
statistical populations, constrained by the given observations' property values.


**Arguments**

*   `dcids` (Union[`vector` of strings, single-column `tibble`/`data.frame` of strings]):
    A list of statistical populations to query, identified by their DCIDs.
    These DCIDs are treated as the property value associated with returned
    `Observation`s by the property
    [`observedNode`](https://browser.datacommons.org/kg?dcid=observedNode).

*   `measured_property` (string): The property value associated with returned
    `Observation`s by the property
    [`measuredProperty`](https://browser.datacommons.org/kg?dcid=measuredProperty).

*   `stats_type` (string): The statistical type of the `Observation`. This is commonly set
    to `measuredValue`.

*   `observation_date` (string): The property value associated with returned
    `Observation`s by the property
    [`observationDate`](https://browser.datacommons.org/kg?dcid=observationDate).
    This is specified in ISO8601 format.

*   `observation_period` (string): The property value associated with returned
    `Observation`s by the property
    [`observationPeriod`](https://browser.datacommons.org/kg?dcid=observationPeriod)
    of the observation. If the `Observation` has this property set, this must
    be specified.

*   `measurement_method` (string): The property value associated with returned
    `Observation`s by the property
    [`measurementMethod`](https://browser.datacommons.org/kg?dcid=measurementMethod)
    of the observation. If the `Observation` has this property set, this must
    be specified.

**Returns**

The returned `Observation`s are formatted as a *named* `vector`.

When the `dcids` input is an instance of `vector`, the names of the returned
`vector` are the given DCIDs, mapping to the unique `Observation` observing
the DCID where the observation is specified by what is given in the other
parameters *if such exists*. A given DCID will *NOT* be a member of the named
`list` if such an observation does not exist.

When `dcids` input is an instance of a column, the names of the returned
`vector` are string representations of the input column's indices, mapping to
the unique observation observing the DCID found at that index of `dcids` as
specified by the other parameters *if such exists*. Otherwise, the cell holds
NaN. Since the names of the returned `vector` are string representations of
the original indices, the returned `vector` preserves order when assigned as a
column to the same `tibble`/`data.frame` as `dcids`.

**Raises**

* `Response error` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

We would like to get the following for December, 2018:
* The [total count of employed persons in California](https://browser.datacommons.org/kg?dcid=dc/o/wetnm9026gf73)
* The [total count of employed persons in Kentucky](https://browser.datacommons.org/kg?dcid=dc/o/4nklvdnkfq835)
* The [total count of employed persons in Maryland](https://browser.datacommons.org/kg?dcid=dc/o/nkntbc4vpshn9>)

The observations we want are observations of the populations representing
employed individuals in each state (to get these, see
[`get_populations`](/api/r/population.html). With a list of these
population DCIDs, we can get the observations like so:

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> dcids <- c(
+   "dc/p/x6t44d8jd95rd",   # Employed individuals in California
+   "dc/p/fs929fynprzs",    # Employed individuals in Kentucky
+   "dc/p/lr52m1yr46r44"    # Employed individuals in Maryland
+ )
> get_observations(dcids, 'count', 'measuredValue', '2018-12',
+   observation_period='P1M',
+   measurement_method='BLSSeasonallyAdjusted'
+ )
$`dc/p/lr52m1yr46r44`
[1] 3075662

$`dc/p/x6t44d8jd95rd`
[1] 18704962

$`dc/p/fs929fynprzs`
[1] 1973955

```

We can also specify the `dcids` as a `tibble`/`data.frame` like so:

```r
> df = tibble(popDcids = c("dc/p/x6t44d8jd95rd", "dc/p/fs929fynprzs", "dc/p/lr52m1yr46r44"))
> get_observations(df, 'count', 'measuredValue', '2018-12',
+   observation_period='P1M', measurement_method='BLSSeasonallyAdjusted'
+ )
       0        1        2
18704962  1973955  3075662
```

Due to natural ordering of the returned `vector` names' string representation of
indices, we can easily assign the result back to a dataframe:

```r
> df = tibble(popDcids = c("dc/p/x6t44d8jd95rd", "dc/p/fs929fynprzs", "dc/p/lr52m1yr46r44"))
> df$obs <- get_observations(df, 'count', 'measuredValue', '2018-12',
+   observation_period='P1M', measurement_method='BLSSeasonallyAdjusted'
+ )
> df
# A tibble: 3 x 2
  popDcids                obs
  <chr>                 <dbl>
1 dc/p/x6t44d8jd95rd 18704962
2 dc/p/fs929fynprzs   1973955
3 dc/p/lr52m1yr46r44  3075662
```

If an observation cannot be found given the constraints for a DCID,
the returned named `vector` will not contain the DCID as a key:

```r
> dcids = c(
+   "dc/p/x6t44d8jd95rd",   # Employed individuals in California
+   "dc/p/fs929fynprzs",    # Employed individuals in Kentucky
+   "foo"                   # Invalid DCID
+ )
> get_observations(dcids, 'count', 'measuredValue', '2018-12',
+   observation_period='P1M', measurement_method='BLSSeasonallyAdjusted'
+ )
$`dc/p/x6t44d8jd95rd`
[1] 18704962

$`dc/p/fs929fynprzs`
[1] 1973955

```

If required properties are not specified, an empty named `list` is returned.
Following on from the example above:

```r
> dcids = c(
+   "dc/p/x6t44d8jd95rd",   # Employed individuals in California
+   "dc/p/fs929fynprzs",    # Employed individuals in Kentucky
+   "dc/p/lr52m1yr46r44"    # Employed individuals in Maryland
+ )
> get_observations(dcids, 'count', 'measuredValue', '2018-12')
named list()
```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> get_observations(c("dc/p/x6t44d8jd95rd", "dc/p/fs929fynprzs", "dc/p/lr52m1yr46r44"),
+  'count', 'measuredValue', '2018-12', observation_period='P1M',
+  measurement_method='BLSSeasonallyAdjusted'
+ )
Error calling Python function:
Error in py_call_impl(callable, dots$args, dots$keywords): 
 Response error: An HTTP 401 code: API key not set.
           See the set_api_key help docs for instructions on obtaining and setting
           an API key, then try again.
```

### `Response error`: API key not valid

```r
> library(datacommons)
> set_api_key('foo')
> get_observations(c("dc/p/x6t44d8jd95rd", "dc/p/fs929fynprzs", "dc/p/lr52m1yr46r44"),
+  'count', 'measuredValue', '2018-12', observation_period='P1M',
+  measurement_method='BLSSeasonallyAdjusted'
+ )
Error calling Python function: get_observations
Error in py_call_impl(callable, dots$args, dots$keywords): 
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
