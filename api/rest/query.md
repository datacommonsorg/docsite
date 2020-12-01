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

## General information about this endpoint

**URL**: `/query`

**Method**: `POST`

**Authentication**: Optional

**Required Arguments**:

*   `sparql`: A SPARQL query string.

**Optional Arguments**:

*   `key`: Your API key.

## How to construct a request to the property value endpoint

### Step 1: Assembling the information you will need

This endpoint makes it possible to query the Data Commons knowledge graph using SPARQL. SPARQL is a query language developed to retrieve data from websites whose data is formulated using [RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework). It leverages the graph structure innate in the data it queries to return specific information to an end user.

To use SPARQL to precisely obtain the data you seek, you will need at a minimum 

This API only supports the following subset of SPARQL keywords:

-   ORDER BY
-   DISTINCT
-   LIMIT

In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf City ."`.

This endpoint also allows you 

### Step 2: Creating the request

Since only the POST method is available for this endpoint, you will need to assemble the request in the form of a JSON object.

## What to expect in the response

A correct response will always look like this:

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

The response contains two fields, `header` and `rows`, as well as a `cell` object.

**NOTES:**

-   The value of `header` is an array of strings corresponding to the query
    variable.
-   The value of `rows` is an array of `row` object, with each containing a
    `cells` object of an array of `cell`.
-   The `cell` object has a string field `value` corresponds to the queried
    variable.

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

<!-- todo test and update error response section -->

## Error Responses

If your request does not include a required argument, you will receive a 400 status code and an error message like the following:

```json
{
  "code": 3,
  "message": "Missing required argument: stat_var",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```
If your request includes a bad argument, you will receive a 404 status code and an error message like the following:

```json
{
  "code": 5,
  "message": "No statistical variable found for CountPerson_Male",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}