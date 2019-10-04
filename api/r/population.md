---
layout: default
title: Population
nav_order: 5
parent: R
grand_parent: API
---

# Get Populations for Place.

## `get_populations(dcids, population_type, constraining_properties=NULL)`

Given a list of [`Place`](https://browser.datacommons.org/kg?dcid=Place) DCIDs,
return the DCID of
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)s
for these places, constrained by the given property values.

**Arguments**

*   `dcids` (Union[`vector` of strings, single-column `tibble`/`data.frame` of strings]) - DCIDs
    identifying `Place`s of populations to query for.
    These DCID's are treated as the value associated by the property
    [`location`](https://browser.datacommons.org/kg?dcid=location) for each
    returned `StatisticalPopulation`.

*   `population_type` (string) - The
    [`populationType`](https://browser.datacommons.org/kg?dcid=populationType)
    of each `StatisticalPopulation`, e.g.
    [`Person`](https://browser.datacommons.org/kg?dcid=Person) or
    [`Student`](https://browser.datacommons.org/kg?dcid=Student).

*   `constraining_properties` (named `vector` of strings, optional) -
      A map from constraining property to the value that the
      `StatisticalPopulation` should be constrained by.

**Returns**

When `dcids` is an instance of `vector`, the returned `StatisticalPopulation` are
formatted as a *named* `vector` from a given DCID to the unique `StatisticalPopulation`
located at that DCID and as specified by the `population_type` and
`constraining_properties` *if such exists*. A given DCID will *NOT* be a member
of the `vector` if such a population does not exist.

When `dcids` is an instance of a column, the returned `StatisticalPopulation`s
are formatted as a *named* `vector` where the names of the returned `vector`
are string representations of `dcid`'s indices, mapping to the population
located in the place identified by the DCID in `i`-th cell of `dcids`
and satisfying the `population_type` and `constraining_properties`
*if such exists*. Otherwise, the cell is empty.

**Raises**

*   `Response error` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

**Examples**

We would like to get

* The [population of employed persons in California](https://browser.datacommons.org/kg?dcid=dc/p/x6t44d8jd95rd)
* The [population of employed persons in Kentucky](https://browser.datacommons.org/kg?dcid=dc/p/fs929fynprzs)
* The [population of employed persons in Maryland](https://browser.datacommons.org/kg?dcid=dc/p/lr52m1yr46r44>)

These populations are specified as having a
`population_type` as `Person` and the `constraining_properties`
as [`employment`](https://browser.datacommons.org/kg?dcid=employment)
`= BLS_Employed`

With a `vector` of dcids for our states, we can get the populations we
want as follows:

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> dcids = c('geoId/06', 'geoId/21', 'geoId/24')
> pvs = list('employment' = 'BLS_Employed')
> get_populations(dcids, 'Person', constraining_properties=pvs)
$`geoId/06`
[1] "dc/p/x6t44d8jd95rd"

$`geoId/21`
[1] "dc/p/fs929fynprzs"

$`geoId/24`
[1] "dc/p/lr52m1yr46r44"

```

We can also specify the `dcids` as a single-column dataframe like so:

```r
> df <- tibble(states = c('geoId/06', 'geoId/21', 'geoId/24'))
> pvs = list('employment' = 'BLS_Employed')
> get_populations(df, 'Person', constraining_properties=pvs)
                   0                    1                    2
"dc/p/x6t44d8jd95rd"  "dc/p/fs929fynprzs" "dc/p/lr52m1yr46r44"
```

Due to natural ordering of the returned `vector` names' string representation of
indices, we can easily assign the result back to a dataframe.

```r
> df <- tibble(states = dcids, random = c(21, 12, 3))
> pvs = list('employment' = 'BLS_Employed')
> df$pops <- get_populations(select(df, states), 'Person', constraining_properties=pvs)
> df
# A tibble: 3 x 3
  states   random pops              
  <chr>     <dbl> <chr>             
1 geoId/06      21 dc/p/x6t44d8jd95rd
2 geoId/21      12 dc/p/fs929fynprzs 
3 geoId/24      3 dc/p/lr52m1yr46r44
```

If a population cannot be found given the constraints for a DCID, the return `dict` will
not contain the DCID as a key:

```r
> pvs = list('foo' = 'bar')
> get_populations(dcids, 'Person', constraining_properties=pvs)
named list()

> pvs = list('employment' = 'BLS_Employed')
> get_populations(c('geoId/06', 'country/USA'), 'Person', constraining_properties=pvs)
$`geoId/06`
[1] "dc/p/x6t44d8jd95rd"

```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> get_populations(c('geoId/06', 'country/USA'), 'Person')
Error calling Python function:
Error in py_call_impl(callable, dots$args, dots$keywords) : 
	Response error: An HTTP 401 code: API key not set.
	          See the set_api_key help docs for instructions on obtaining and setting
	          an API key, then try again.
```

### `Response error`: API key not valid

```r
> library(datacommons)
> set_api_key('foo')
> get_populations(c('geoId/06', 'country/USA'), 'Person')
Error calling Python function: get_populations
Error in py_call_impl(callable, dots$args, dots$keywords): 
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
