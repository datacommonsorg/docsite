---
layout: default
title: SPARQL
nav_order: 99
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/query
---

# /v1/query

Query the Data Commons knowledge graph using
[SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

This endpoint makes it possible to query the Data Commons knowledge graph using
SPARQL. SPARQL is a query language developed to retrieve data from RDF graph 
content on the web. It leverages the graph structure innate in the data it 
queries to return specific information to an end user.

## Request

POST Request
{: .api-header}

<div class="api-signature">
URL:
https://api.datacommons.org/v1/query

Header:
X-API-Key: {your_api_key}

JSON Data:
{ "sparql": "your SPARQL query here" }
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

There are no path parameters for this endpoint.

### Query Parameters

| Name                                                | Type   | Description                                                                                                                                                     |
| --------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>    | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| sparql <br /> <required-tag>Required</required-tag> | string | A SPARQL query string.<br/>In the query, each variable should have a `typeOf` condition (e.g. `?var typeOf City`).                                              |
{: .doc-table }

## Response

The response looks like:

```json
{
  "header": [
    <String>
  ],
  "rows": [
    {
      "cells": [
        {
          "value": <String>
        }
      ]
    },
    ...
  ]
}
```
{: .response-signature .scroll}

### Response fields

| Name   | Type   | Description                                                                      |
| ------ | ------ | -------------------------------------------------------------------------------- |
| header | list   | List of strings corresponding to the query variables.                            |
| rows   | list   | List of `row` objects, with each containing a list of cells and its cell values. |
| cells  | object | Contains string field `value` corresponding to the queried variable.             |
{: .doc-table}

## Examples

### Example 1: Query the Data Commons knowledge graph with SPARQL

Retrieve a list of 10 biological specimens (DCID: `BiologicalSpecimen`) in
reverse alphabetical order.

Request:
{: .example-box-title}

```bash
curl --request POST \
  --url https://api.datacommons.org/v1/query \
  --header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
  --data '{
            "sparql": "SELECT ?name \
                WHERE { \
                  ?biologicalSpecimen typeOf BiologicalSpecimen . \
                  ?biologicalSpecimen name ?name
                }
                ORDER BY DESC(?name)
                LIMIT 10"
}'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "header": ["?name"],
  "rows": [
    {
      "cells": [
        {
          "value": "x Triticosecale"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Silene"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Silene"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Silene"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey"
        }
      ]
    }
  ]
}
```
{: .example-box-content .scroll}
