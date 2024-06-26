---
layout: default
title: SPARQL
nav_order: 5
parent: REST (v2)
grand_parent: API
published: true
---

# /v2/sparql

This endpoint makes it possible to query the Data Commons knowledge graph using
[SPARQL](https://www.w3.org/TR/rdf-sparql-query/). SPARQL is a query language developed to retrieve data from RDF graph 
content on the web. It leverages the graph structure innate in the data it 
queries to return specific information.

**Note:** Data Commons only supports a limited subset of SPARQL functionality at this time: specifically, only the keywords `WHERE`, `ORDER BY`, `DISTINCT`, and `LIMIT` are supported.

## Request

POST Request
{: .api-header}

<div class="api-signature">
URL:
https://api.datacommons.org/v2/sparql

Header:
X-API-Key: <var>API_KEY</var>

JSON Data:
{ "sparql": "<var>SPARQL_QUERY</var>" }
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Query parameters

| Name                                                | Type   | Description                                                                                                                                                     |
| --------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>    | string | Your API key. See the the section on [authentication](getting_started.md#authentication) for instructions on how to get a key. |
| sparql <br /> <required-tag>Required</required-tag> | string | A SPARQL query string.<br/>In the query, each variable should have a `typeOf` condition, for example, <code>?<var>VARIABLE_NAME</var> typeOf City</code>.                                              |
{: .doc-table }

## Response

The response looks like:

<pre>
{
  "header": [
    <var>STRING</var>
  ],
  "rows": [
    {
      "cells": [
        {
          "value": <var>STRING</var>
        }
      ]
    },
    ...
  ]
}
</pre>
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

<pre>
curl --request POST \
  --url https://api.datacommons.org/v2/sparql \
  --header 'X-API-Key: <var>API_KEY</var>' \
  --data '{
            "sparql": "SELECT ?name \
                WHERE { \
                  ?biologicalSpecimen typeOf BiologicalSpecimen . \
                  ?biologicalSpecimen name ?name
                }
                ORDER BY DESC(?name)
                LIMIT 10"
}'
</pre>
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
