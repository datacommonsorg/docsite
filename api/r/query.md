---
layout: default
title: SPARQL
nav_order: 1
parent: R
grand_parent: API
---

# Query the Data Commons Knowledge Graph using SPARQL

## `query(query_string)`

Returns the results of running a graph query on the Data Commons knowledge graph
using [SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

**Arguments**

* `query_string` (string): A SPARQL query string.

This API only supports a subset of SPARQL keywords including:

<!--- TODO: add link to sparql doc --->

-   ORDER BY
-   DISTINCT
-   LIMIT

In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf
City ."`.

**Returns**

A populated dataframe, represented as a `list` of rows, resulting from executing the given
SPARQL query. Each row is a *named* `list` mapping the query variable to its value in the
row.

**Raises**

* `Response error` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [R library setup guide](/api/r/) for more details.

## Examples

**Examples**

We would like to query for the name associated with three states identified by
their DCIDs [California](https://datacommons.org/browser/geoId/06>),
[Kentucky](https://datacommons.org/browser/geoId/21>), and
[Maryland](https://datacommons.org/browser/geoId/24>):

```r
> library(datacommons)
> set_api_key(YOUR_API_KEY_HERE)
> query_str = "SELECT ?name ?dcid
+   WHERE {
+     ?a typeOf Place .
+     ?a name ?name .
+     ?a dcid ('geoId/06' 'geoId/21' 'geoId/24') .
+     ?a dcid ?dcid
+   }"
> query(query_str)
       ?name    ?dcid
1 California geoId/06
2   Maryland geoId/24
3   Kentucky geoId/21
```

## Errors

### `Response error`: API key not set

```r
> library(datacommons)
> query_str = "SELECT ?name ?dcid
+   WHERE {
+     ?a typeOf Place .
+     ?a name ?name .
+     ?a dcid ('geoId/06' 'geoId/21' 'geoId/24') .
+     ?a dcid ?dcid
+   }"
> query(query_str)
Error: Data Commons API request failed.
Response error: An HTTP 401 code.
API key not set. See the set_api_key help docs for
        instructions on obtaining and setting an API key, then try again.
```

### `Response error`: API key not valid

```r
> library(datacommons)
> set_api_key('foo')
> query_str = "SELECT ?name ?dcid
+   WHERE {
+     ?a typeOf Place .
+     ?a name ?name .
+     ?a dcid ('geoId/06' 'geoId/21' 'geoId/24') .
+     ?a dcid ?dcid
+   }"
> query(query_str)
Error calling Python function: query
Error in py_call_impl(callable, dots$args, dots$keywords): 
  Response error: An HTTP 400 code: API key not valid.
          Please pass a valid API key. See the set_api_key help docs for
          instructions on obtaining and setting an API key, then try again.
```
