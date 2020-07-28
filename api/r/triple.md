---
layout: default
title: Triple
nav_order: 2
parent: R
grand_parent: API
---

# Show Triples Associated with Node(s)

## `get_triples(dcids, limit=MAX_LIMIT)`

Given a list of nodes, return triples which are associated with the specified
node(s).

A knowledge graph can be described as a collection of *triples* which are
3-tuples that take the form *(s, p, o)*. Here, *s* and *o* are nodes in the
graph called the *subject* and *object* respectively, while *p* is the property
label of a directed edge from *s* to *o* (sometimes also called the *predicate*).

**Arguments**

* `dcids` (`vector` of strings) - DCIDs to get triples for.

* `limit` (`numeric`, optional) - The maximum number of triples per combination of
    property and type associated with nodes linked by that property to fetch,
    ≤ 500.

**Returns**

A *named* `vector` mapping DCIDs to a `vector` of triples *(s, p, o)* where *s*, *p*, and *o* are
strings and either the *subject* or *object* is the specified DCID.

**Raises**

* `Response error` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

We would like to get one triple per property and type combination associated with
[California](https://datacommons.org/browser/geoId/06):

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> triples <- get_triples(c('geoId/06'), limit=1)
> as.tibble(t(matrix(unlist(triples), nrow=3)))
# A tibble: 18 x 3
   subject                                subject          object         
   <chr>                                  <chr>            <chr>      
 1 geoId/sch0699014                       containedInPlace geoId/06   
 2 geoId/C49700                           overlapsWith     geoId/06   
 3 election/2024_S_CA00                   location         geoId/06   
 4 geoId/06115                            containedInPlace geoId/06   
 5 geoId/06                               provenance       dc/sm3m2w3 
 6 geoId/0686440                          containedInPlace geoId/06   
 7 965EYosemiteAvenueSuite2MantecaCA95336 addressRegion    geoId/06   
 8 geoId/06                               containedInPlace country/USA
 9 geoId/0686944                          containedInPlace geoId/06   
10 geoId/0611593830                       containedInPlace geoId/06   
11 geoId/06                               typeOf           State      
12 geoId/sch0699997                       containedInPlace geoId/06   
13 geoId/0653                             containedInPlace geoId/06   
14 geoId/06113011002                      containedInPlace geoId/06   
15 dc/p/zyjy2jq2xme02                     location         geoId/06   
16 geoId/sch0643380                       containedInPlace geoId/06   
17 geoId/06U                              containedInPlace geoId/06   
18 ipedsId/487597                         location         geoId/06  
```

If there is no node associated with the given DCID, an empty list is returned:

```r
> get_triples(c('foo'))
$foo
list()
```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> get_triples(c('geoId/06'), limit=1)
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
> get_triples(c('geoId/06'), limit=1)
Error calling Python function:
Error in py_call_impl(callable, dots$args, dots$keywords): get_triples
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
