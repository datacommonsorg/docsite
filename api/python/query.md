---
layout: default
title: SPARQL
nav_order: 2
parent: Python
grand_parent: API
---

# Query the Data Commons Knowledge Graph using SPARQL

## `datacommons.query(query_string, select=None)`

Returns the results of running a graph query on the Data Commons knowledge graph
using [SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

**Arguments**

*   `sparql (str)`: A SPARQL query string.

*   `select` (`func` accepting a row in the query result) - A function that
    selects rows to be returned by `query`. This function accepts a row in the
    results of executing `query_string` and return True if and only if the row
    is to be returned by `query`. The row passed in as an argument is
    represented as a `dict` that maps a query variable in `query_string` to its
    value in the given row.

This API only supports a subset of SPARQL keywords including:

<!--- TODO: add link to sparql doc --->

-   ORDER BY
-   DISTINCT
-   LIMIT

In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf
City ."`.

**Returns**

A table, represented as a `list` of rows, resulting from executing the given
SPARQL query. Each row is a `dict` mapping query variable to its value in the
row. If `select` is not `None`, then a row is included in the returned `list`
if and only if `select` returns `True` for that row.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

**Examples**

We would like to query for the name associated with three states identified by
their DCIDs [California](https://datacommons.org/browser/geoId/06>),
[Kentucky](https://datacommons.org/browser/geoId/21>), and
[Maryland](https://datacommons.org/browser/geoId/24>).

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> query_str = '''
... SELECT ?name ?dcid
... WHERE {
...   ?a typeOf Place .
...   ?a name ?name .
...   ?a dcid ("geoId/06" "geoId/21" "geoId/24") .
...   ?a dcid ?dcid
... }
... '''
>>> result = dc.query(query_str)
>>> for r in result:
...   print(r)
{"?name": "Maryland", "?dcid": "geoId/24"}
{"?name": "Kentucky", "?dcid": "geoId/21"}
{"?name": "California", "?dcid": "geoId/06"}
```

Optionally, we can specify which rows are returned by setting `select`
like so. The following returns all rows where the name is "Maryland":

```python
>>> selector = lambda row: row['?name'] == 'Maryland'
>>> result = dc.query(query_str, select=selector)
>>> for r in result:
...   print(r)
{"?name": "Maryland", "?dcid": "geoId/24"}
```