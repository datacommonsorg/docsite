---
layout: default
title: Property Value
nav_order: 4
parent: R
grand_parent: API
---

# Show Property Values for Node(s)

## `get_property_values(dcids, prop, out=TRUE, value_type=NULL, limit=MAX_LIMIT)`

Given a list of nodes and a property label, returns values associated with the
given property for each node.

**Arguments**

* `dcids` (Union[`vector` of strings, single-column `tibble`/`data.frame` of strings]) - DCIDs to get property values for.

* `prop` (string) - The property to get property values for.

* `out` (`logical`, optional) - Whether or not the property points away from the given list of nodes.

* `value_type` (string, optional) - A type to filter returned property values by, only applicable if
    the value refers to a node.

* `limit` (`numeric`, optional) - The maximum number of property values returned per node, must be ≤ 500.

**Returns**

When `dcids` is an instance of `vector`, the returned property values are
formatted as a *named* `vector` from a given dcid to a `vector` of its property
values.

When `dcids` is an instance of a column, the returned property values are
formatted as a *named* `vector` where the names are string representations
of `dcids`' indices, each mapping to a `vector` of property values associated
with the `i`-th given DCID.

**Raises**

* `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

**Examples**

We would like to get the `name` of a list of states specified by their DCID:
[geoId/06](https://datacommons.org/browser/geoId/06),
[geoId/21](https://datacommons.org/browser/geoId/21), and
[geoId/24](https://datacommons.org/browser/geoId/24)

First, let's try specifying the `dcids` as a `vector` of strings:

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> get_property_values(c("geoId/06", "geoId/21", "geoId/24"), "name")
$`geoId/06`
[1] "California"

$`geoId/21`
[1] "Kentucky"

$`geoId/24`
[1] "Maryland"
```

Next, we specify `dcids` as a single-column dataframe:

```r
> df = tibble(states = c("geoId/06", "geoId/21", "geoId/24"))
> get_property_values(select(df, states), "name")
$`0`
[1] "California"

$`1`
[1] "Kentucky"

$`2`
[1] "Maryland"
```

Now, let's get 10 cities contained in each of the states:

```r
> get_property_values(c("geoId/06", "geoId/21", "geoId/24"),
+   'containedInPlace', out = FALSE, value_type = 'City', limit = 10
+ )
$`geoId/06`
 [1] "geoId/0685992" "geoId/0686020" "geoId/0686076" "geoId/0686216"
 [5] "geoId/0686440" "geoId/0686482" "geoId/0686832" "geoId/0686912"
 [9] "geoId/0686930" "geoId/0686944"

$`geoId/21`
 [1] "geoId/2183676" "geoId/2183784" "geoId/2183856" "geoId/2184414"
 [5] "geoId/2184432" "geoId/2184486" "geoId/2184576" "geoId/2184864"
 [9] "geoId/2184900" "geoId/2185008"

$`geoId/24`
 [1] "geoId/2484950" "geoId/2485100" "geoId/2485175" "geoId/2485395"
 [5] "geoId/2486475" "geoId/2486525" "geoId/2486710" "geoId/2486750"
 [9] "geoId/2487000" "geoId/2487150"
```

If there is no value associated with the property, an empty list is returned:

```r
> get_property_values(c("geoId/06", "geoId/21"), "foo")
$`geoId/06`
list()

$`geoId/21`
list()
```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> get_property_values(c("geoId/06", "geoId/21"), "name")
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
> get_property_values(c("geoId/06", "geoId/21"), "name")
Error calling Python function: get_property_values
Error in py_call_impl(callable, dots$args, dots$keywords): 
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
