---
layout: default
title: Places within a Place
nav_order: 7
parent: R
grand_parent: API
---

# Get Places Contained within Another Place

## `get_places_in(dcids, place_type)`

Given a list of [`Place`](https://browser.datacommons.org/kg?dcid=Place) DCIDs,
(e.g. `County`, `State`, `Country`, etc...), return the DCIDs of places
contained within, of a specified type.


**Arguments**

* `dcids` (Union[`vector` of strings, single-column `tibble`/`data.frame` of strings]) - DCIDs of parent places to query for.

* `place_type` (string) - The type of the contained child `Place`s within the given
    DCIDs to filter by. E.g. `City` and `County` are contained within `State`. For a
    full list of available types, see [`subClassOf Place`](https://browser.datacommons.org/kg?dcid=Place).

**Returns**

When `dcids` is an instance of `vector`, the returned `Place`s are formatted as
a *named* `vector` mapping from a given DCID to a `vector` of places identified
by DCIDs of the given `place_type`.

When `dcids` is an instance of a column, the returned `Place`s are formatted as
a *named* `vector` where the names of the returned `vector` are string
representations of `dcids`' indices, mapping to the list of places contained in
the place identified by the DCID in `i`-th cell of `dcids`. The entries of the
returned named `vector` will always contain a `vector` of place DCIDs of the
given `place_type`.

**Raises**

* `Response error` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

We would like to get all Counties contained in
[California](https://browser.datacommons.org/kg?dcid=geoId/06). Specifying the
`dcids` as a `list` result in the following:

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> get_places_in(c("geoId/06"), "County")
$`geoId/06`
[1] "geoId/06001" "geoId/06003" "geoId/06005"
[4] "geoId/06007" "geoId/06009" "geoId/06011"
...  and 52 more
```

We can also specify the `dcids` as a single-column `tibble`/`data.frame` like so:

```r
> df <- tibble(stateDcid = c("geoId/06"))
> get_places_in(df, "County")
$`0`
[1] "geoId/06001" "geoId/06003" "geoId/06005"
[2] "geoId/06007" "geoId/06009" "geoId/06011"
... and 52 more
```

Due to natural ordering of the returned `vector` names' string representation of
indices, we can easily assign the result back to a dataframe:

```r
> df <- tibble(countyDcid = c('geoId/06085', 'geoId/24031'), anotherCol = c('random', 'data'))
> df$townDcid <- get_places_in(select(df, countyDcid), 'Town')
> df
# A tibble: 2 x 3
  countyDcid  anotherCol townDcid    
  <chr>       <chr>      <named list>
1 geoId/06085 random     <chr [2]>   
2 geoId/24031 data       <chr [12]>  
> df$townDcid
$`0`
[1] "geoId/0643294" "geoId/0644112"

$`1`
[1] "geoId/2404475" "geoId/2410225" "geoId/2416620" "geoId/2416775"
[5] "geoId/2416787" "geoId/2431525" "geoId/2432900" "geoId/2443500"
[9] "geoId/2446250" "geoId/2462850" "geoId/2473350" "geoId/2481675"
```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> get_places_in(c("geoId/06", "geoId/21", "geoId/24"), "Town")
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
> get_places_in(c("geoId/06", "geoId/21"), "Town")
Error calling Python function: get_places_in
Error in py_call_impl(callable, dots$args, dots$keywords): 
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
