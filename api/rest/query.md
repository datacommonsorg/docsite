---
layout: default
title: SPARQL
nav_order: 1
parent: REST
grand_parent: API
---

# Query the Data Commons Knowledge Graph using SPARQL

Returns the results of running a graph query on the Data Commons knowledge graph
using [SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

**URL**: `/query`

**Method**: `POST`

**Auth required**: Optional

**Required Arguments**:

*   `sparql`: A Sparql query string.

This API only supports a subset of SPARQL keywords including:

<!--- TODO: add link to sparql doc --->

-   ORDER BY
-   DISTINCT
-   LIMIT

In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf
City ."`.


## POST Request

**Examples**

```bash
curl -X POST 'https://api.datacommons.org/query' \
-d '{"sparql": "SELECT ?name \
                WHERE { \
                  ?state typeOf State . \
                  ?state dcid geoId/06 . \
                  ?state name ?name \
                }"}'
```

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/0694bhse/10/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## Success Response

### **Code**: `200 OK`

**Response content example**

```json
{
  "header": [
    "?name"
  ],
  "rows": [
    {
      "cells": [
        {
          "value": "California"
        }
      ]
    }
  ]
}
```

The response contains two fields: `header` and `rows`:

-   The value of `header` is an array of strings corresponding to the query
    variable.
-   The value of `rows` is an array of `row` object, with each containing a
    `cells` object of an array of `cell`.
-   The `cell` object has a string field `value` corresponds to the queried
    variable.

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:**

`sparql` parameter not specified:

```bash
curl -X POST 'https://api.datacommons.org/query'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```
