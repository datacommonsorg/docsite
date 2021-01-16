---
layout: default
title: SPARQL
nav_order: 2
parent: Python
grand_parent: API
---

# Query the Data Commons knowledge graph using SPARQL

Returns the results of running a graph query on the Data Commons knowledge graph
using [SPARQL](https://www.w3.org/TR/rdf-sparql-query/). Note that Data Commons is only
able to support a limited subsection of SPARQL functionality at this time: specifically only the keywords `ORDER BY`, `DISTINCT`, and `LIMIT`.

## General information about this endpoint

**Signature**: `datacommons.query(query_string, select=None)`

**Required Arguments**:

*   `query_string`: A SPARQL query string.

## How to construct a call to the query method

This method makes it possible to query the Data Commons knowledge graph using SPARQL. SPARQL is a query language developed to retrieve data from websites. It leverages the graph structure innate in the data it queries to return specific information to an end user. For more information on assembling SPARQL queries, check out [the Wikipedia page about SPARQL](https://en.wikipedia.org/wiki/SPARQL) and [the W3C specification information](https://www.w3.org/TR/sparql11-query/).

This method accepts the additional optional argument `select`. This function selects rows to be returned by `query`. Under the hood, the `select` function examines a row in the results of executing `query_string` and returns `True` if and only if the row is to be returned by `query`. The row passed in as an argument is represented as a `dict` that maps a query variable in `query_string` to its value in the given row.

>    **NOTE:**
>    - In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf City ."`.

## Examples and error returns

A collection of examples of correctly and poorly formed calls to this method is available at <https://colab.research.google.com/drive/1Jd0IDHnMdtxhsmXhL5Ib5tL0zgJud1k5?usp=sharing>.