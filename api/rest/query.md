---
layout: default
title: SPARQL
nav_order: 1
parent: REST
grand_parent: API
---

# Query the Data Commons knowledge graph using SPARQL

Returns the results of running a graph query on the Data Commons knowledge graph
using [SPARQL](https://www.w3.org/TR/rdf-sparql-query/). Note that Data Commons is only
able to support a limited subsection of SPARQL functionality at this time: specifically only the keywords `ORDER BY`, `DISTINCT`, and `LIMIT`.

## General information about this endpoint

**URL**: `/query`

**Methods available**: `POST`

**Required arguments**:

*   `sparql`: A SPARQL query string.

## How to construct a request to the SPARQL query endpoint

### Step 1: Assembling the information you will need

This endpoint makes it possible to query the Data Commons knowledge graph using SPARQL. SPARQL is a query language developed to retrieve data from websites. It leverages the graph structure innate in the data it queries to return specific information to an end user.

### Step 2: Creating the request

Since only the POST method is available for this endpoint, you will need to assemble the request in the form of a JSON object adhering to the following form:

```json
{"sparql": "<query>"}
```

Here `<query>` denotes the SPARQL query string. For more information on assembling SPARQL queries, check out [the Wikipedia page about SPARQL](https://en.wikipedia.org/wiki/SPARQL) and [the W3C specification information](https://www.w3.org/TR/sparql11-query/).

> **NOTE:**
> - In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf City ."`.

## What to expect in the response

A correct response will always look like this:

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

The response contains two fields, `header` and `rows`, as well as a `cell` object.

**NOTES:**

-   The value of `header` is an array of strings corresponding to the query
    variables.
-   The value of `rows` is an array of `row` objects, with each containing a
    `cells` object of an array of `cells`.
-   The `cell` object has a string field `value` corresponding to the queried
    variable.

## Example Requests and Responses

### Example 1. Retrieve the name of the state associated with DCID geoId/06.

<div>

{% tabs log %}

{% tab log GET Request %}

This endpoint does not support GET requests.

{% endtab %}

{% tab log POST Request %}

```bash
curl -X POST 'https://api.datacommons.org/query' \
-d '{"sparql": "SELECT ?name \
                WHERE { \
                  ?state typeOf State . \
                  ?state dcid geoId/06 . \
                  ?state name ?name \
                }"}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/0694bhse/10/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

#### Response

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

### Example 2. Retrieve a list of ten biological specimens in reverse alphabetical order.

<div>

{% tabs log %}

{% tab log GET Request %}

This endpoint does not support GET requests.

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/query \
  --header 'content-type: application/json' \
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

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/7o469zpn/6/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>

</div>

#### Response

```json
{
  "header": [
    "?name"
  ],
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

### Example 3. Retrieve a list of GNI observations by country.

<div>

{% tabs log %}

{% tab log GET Request %}

This endpoint does not support GET requests.

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/query \
  --header 'content-type: application/json' \
  --data '{
    "sparql": "SELECT ?observation ?place \
              WHERE { \
                ?observation typeOf StatVarObservation . \
                ?observation variableMeasured Amount_EconomicActivity_GrossNationalIncome_PurchasingPowerParity_PerCapita . \
                ?observation observationAbout ?place . \
                ?place typeOf Country .\
              } \
              ORDER BY ASC (?place) \
              LIMIT 10"
  }'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/8baetyso/2/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

#### Response

```json
{
  "header": [
    "?observation",
    "?place"
  ],
  "rows": [
    {
      "cells": [
        {
          "value": "dc/o/5h86g14fj2fr8"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/kg6pryqvbgd78"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/7gzjqhbwpekd6"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/fw0bk0ekyt94d"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/rksjr0spfsq83"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/7thj4d54jeb6h"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/pgym0z20p7v05"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/h1c0f24b48132"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/q86f2x7n069w7"
        },
        {
          "value": "country/ABW"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/wv0lv3mfgdvh4"
        },
        {
          "value": "country/ABW"
        }
      ]
    }
  ]
}
```

### Example 4. Retrieve a sample list of observations with the unit InternationalDollar.

<div>

{% tabs log %}

{% tab log GET Request %}

This endpoint does not support GET requests.

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/query \
  --header 'content-type: application/json' \
  --data '{
  "sparql": "SELECT ?observation \
             WHERE { \
               ?observation typeOf StatVarObservation . \
               ?observation unit InternationalDollar \
             } \
            LIMIT 10"
  }'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/vkj5qm4f/2/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

#### Response

```json
{
  "header": [
    "?observation"
  ],
  "rows": [
    {
      "cells": [
        {
          "value": "dc/o/fyxy1y8s0g7n"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/xmvxcs7e22ycd"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/f2hrq42xh10sf"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/b8pb4n9qy3x3f"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/2klbr8pjf06m6"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/y1cmgcsdp2ywd"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/1ypyy54edxbv6"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/105gnls2e1ng9"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/y1z2jv1y644q5"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "dc/o/wqdjmf2vhgx75"
        }
      ]
    }
  ]
}
```

### Example 5. Retrieve a list of ten distinct yearly estimates of life expectancy for forty-seven-year-old Hungarians.

<div>

{% tabs log %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/query \
  --header 'content-type: application/json' \
  --data '{
    "sparql": "SELECT DISTINCT ?LifeExpectancy \
              WHERE { \
                ?o typeOf StatVarObservation .\
                ?o variableMeasured LifeExpectancy_Person_47Years .\
                ?o observationAbout country/HUN .\
                ?o value ?LifeExpectancy
              }
              ORDER BY ASC(?LifeExpectancy)
              LIMIT 10"
  }'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/nsfadbrw/2/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

#### Response

```json
{
  "header": [
    "?LifeExpectancy"
  ],
  "rows": [
    {
      "cells": [
        {
          "value": "26.4"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "26.5"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "26.7"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "26.8"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "26.9"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "27.2"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "27.4"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "27.5"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "28.1"
        }
      ]
    },
    {
      "cells": [
        {
          "value": "28.3"
        }
      ]
    }
  ]
}
```

## Error Responses

If there are no values for your query, you won't receive an error code. Instead, the endpoint will return only the headers you sent, with no accompanying value information.

If your JSON body is formatted improperly, you will receive a 400 error and an error message like the following:

```json
{
  "code": 3,
  "message": "Node should be string, got [StatisticalPopulation ?o typeOf StatVarObservation] of type []string",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```

If your SPARQL query is constructed incorrectly, you will receive a 500 error and an error message like the following:

```json
{
  "code": 2,
  "message": "googleapi: Error 400: Unrecognized name: count; Did you mean unit? at [1:389], invalidQuery",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```
