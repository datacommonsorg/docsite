---
layout: default
title: Property Label
nav_order: 3
parent: R
grand_parent: API
---

# Show Property Labels of Node(s)

## `get_property_labels(dcids, out=True)`

Returns the labels of properties defined for the given node DCIDs

**Arguments**

* `dcids` (`vector` of strings) - DCIDs identifying nodes to query.

* `out` (`logical`, optional) - Whether or not the property points away from the given list of nodes.

**Returns**

A *named* `vector` mapping DCIDs to `vector`s of property labels. If `out` is `TRUE`, then property labels correspond to edges directed away from given nodes. Otherwise, they correspond to edges directed towards the given nodes.

**Raises**

* `Response error` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

**Examples**

To get all outgoing property labels for [California](https://datacommons.org/browser/geoId/06>) and
[Colorado](https://datacommons.org/browser/geoId/08), we can write the following:

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> get_property_labels(c('geoId/06', 'geoId/08'))
$`geoId/06`
[1] "containedInPlace" "geoId"            "kmlCoordinates"  
[4] "name"             "provenance"       "typeOf"          

$`geoId/08`
[1] "containedInPlace" "geoId"            "kmlCoordinates"  
[4] "name"             "provenance"       "typeOf"
```

We can also get incoming property labels by setting `out=FALSE`:

```r
> get_property_labels(c('geoId/06', 'geoId/08'), out=FALSE)
$`geoId/06`
[1] "addressRegion"    "containedInPlace" "location"
[4] "overlapsWith"

$`geoId/08`
[1] "addressRegion"    "containedInPlace" "location"
[4] "overlapsWith"
```

If there is no node associated with the DCID, an empty `list` is returned:

```r
> get_property_labels(c('foo', 'bar'))
$foo
list()

$bar
list()
```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> get_property_labels(c('geoId/06'))
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
> get_property_labels(c('geoId/06'))
Error calling Python function: get_property_labels
Error in py_call_impl(callable, dots$args, dots$keywords): 
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
