---
layout: default
title: SPARQL
nav_order: 2
parent: Python
grand_parent: API
---

# Query the Data Commons Graph using SPARQL

Returns the results of running a graph query on the Data Commons knowledge graph
using [SPARQL](https://www.w3.org/TR/rdf-sparql-query/). Note that Data Commons is only
able to support a limited subsection of SPARQL functionality at this time: specifically only the keywords `ORDER BY`, `DISTINCT`, and `LIMIT`.

## General information about this endpoint

**Signature**: `datacommons.query(query_string, select=None)`

**Required arguments**:

*   `query_string`: A SPARQL query string.

## How to construct a call to the query method

This method makes it possible to query the Data Commons knowledge graph using SPARQL. SPARQL is a query language developed to retrieve data from websites. It leverages the graph structure innate in the data it queries to return specific information to an end user. For more information on assembling SPARQL queries, check out [the Wikipedia page about SPARQL](https://en.wikipedia.org/wiki/SPARQL) and [the W3C specification information](https://www.w3.org/TR/sparql11-query/).

This method accepts the additional optional argument `select`. This function selects rows to be returned by `query`. Under the hood, the `select` function examines a row in the results of executing `query_string` and returns `True` if and only if the row is to be returned by `query`. The row passed in as an argument is represented as a `dict` that maps a query variable in `query_string` to its value in the given row.

>    **NOTE:**
>    - In the query, each variable should have a `typeOf` condition, e.g. `"?var typeOf City ."`.

## What to expect in the function return

A correct response will always look like this:

```json
[{'<field name>': '<field value>', ...},
 ...]
```

The response contains an array of dictionaries, each corresponding to one node matching the conditions of the query. Each dictionary's keys match the variables in the query SELECT clause, and the values in the dictionaries are those associated to the given node's query-specified properties.

## Examples and error returns

### Examples

#### Example 1. Retrieve the name of the state associated with DCID geoId/06.

```python
>>> geoId06_name_query = 'SELECT ?name ?dcid WHERE { ?a typeOf Place . ?a name ?name . ?a dcid ("geoId/06" "geoId/21" "geoId/24") . ?a dcid ?dcid }'
>>> datacommons.query(geoId06_name_query)
[{'?name': 'Kentucky', '?dcid': 'geoId/21'}, {'?name': 'California', '?dcid': 'geoId/06'}, {'?name': 'Maryland', '?dcid': 'geoId/24'}]
```

#### Example 2. Retrieve a list of ten biological specimens in reverse alphabetical order.

```python
>>> bio_specimens_reverse_alphabetical_order_query = 'SELECT ?name WHERE { ?biologicalSpecimen typeOf BiologicalSpecimen . ?biologicalSpecimen name ?name } ORDER BY DESC(?name) LIMIT 10'
>>> datacommons.query(bio_specimens_reverse_alphabetical_order_query)
[{'?name': 'x Triticosecale'}, {'?name': 'x Silene'}, {'?name': 'x Silene'}, {'?name': 'x Silene'}, {'?name': 'x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey'}, {'?name': 'x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey'}, {'?name': 'x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey'}, {'?name': 'x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey'}, {'?name': 'x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey'}, {'?name': 'x Pseudelymus saxicola (Scribn. & J.G.Sm.) Barkworth & D.R.Dewey'}]
```

#### Example 3. Retrieve a list of GNI observations by country.

```python
>>> gni_by_country_query = 'SELECT ?observation ?place WHERE { ?observation typeOf Observation . ?observation statisticalVariable Amount_EconomicActivity_GrossNationalIncome_PurchasingPowerParity_PerCapita . ?observation observedNodeLocation ?place . ?place typeOf Country . } ORDER BY ASC (?place) LIMIT 10'
>>> datacommons.query(gni_by_country_query)
[{'?observation': 'dc/o/syrpc3m8q34z7', '?place': 'country/ABW'}, {'?observation': 'dc/o/bqtfmc351v0f2', '?place': 'country/ABW'}, {'?observation': 'dc/o/md36fx6ty4d64', '?place': 'country/ABW'}, {'?observation': 'dc/o/bm28zvchsyf4b', '?place': 'country/ABW'}, {'?observation': 'dc/o/3nleez1feevw6', '?place': 'country/ABW'}, {'?observation': 'dc/o/x2yg38d0xecnf', '?place': 'country/ABW'}, {'?observation': 'dc/o/7swdqf6yjdyw8', '?place': 'country/ABW'}, {'?observation': 'dc/o/yqmsmbx1qskfg', '?place': 'country/ABW'}, {'?observation': 'dc/o/6hlhrz3k8p5wf', '?place': 'country/ABW'}, {'?observation': 'dc/o/txfw505ydg629', '?place': 'country/ABW'}]
```

#### Example 4. Retrieve a sample list of observations with the unit InternationalDollar.

```python
>>> internationalDollar_obs_query = 'SELECT ?observation WHERE {   ?observation typeOf Observation .   ?observation unit InternationalDollar  } LIMIT 10'
>>> datacommons.query(internationalDollar_obs_query)
[{'?observation': 'dc/o/s3gzszzvj34f1'}, {'?observation': 'dc/o/gd41m7qym86d4'}, {'?observation': 'dc/o/wq62twxx902p4'}, {'?observation': 'dc/o/d93kzvns8sq4c'}, {'?observation': 'dc/o/6s741lstdqrg4'}, {'?observation': 'dc/o/2kcq1xjkmrzmd'}, {'?observation': 'dc/o/ced6jejwv224f'}, {'?observation': 'dc/o/q31my0dmcryzd'}, {'?observation': 'dc/o/96frt9w0yjwxf'}, {'?observation': 'dc/o/rvjz5xn9mlg73'}]
```

#### Example 5. Retrieve a list of ten distinct yearly estimates of life expectancy for forty-seven-year-old Hungarians.

```python
>>> life_expectancy_query = 'SELECT DISTINCT ?LifeExpectancy WHERE { ?pop typeOf StatisticalPopulation . ?o typeOf Observation . ?pop dcid dc/p/grjmhz7x2kc9f . ?o observedNode ?pop . ?o measuredValue ?LifeExpectancy } ORDER BY ASC(?LifeExpectancy) LIMIT 10'
>>> datacommons.query(life_expectancy_query)
[{'?LifeExpectancy': '26.4'}, {'?LifeExpectancy': '26.5'}, {'?LifeExpectancy': '26.7'}, {'?LifeExpectancy': '26.8'}, {'?LifeExpectancy': '26.9'}, {'?LifeExpectancy': '27.2'}, {'?LifeExpectancy': '27.4'}, {'?LifeExpectancy': '27.5'}, {'?LifeExpectancy': '28.1'}, {'?LifeExpectancy': '28.3'}]
```

#### Example 6: Use the `select` function to filter returns based on name.

```python
>>> names_for_places_query = 'SELECT ?name ?dcid WHERE {  ?a typeOf Place .  ?a name ?name .  ?a dcid ("geoId/06" "geoId/21" "geoId/24") .  ?a dcid ?dcid }'
>>> maryland_selector = lambda row: row['?name'] == 'Maryland'
>>> result = datacommons.query(names_for_places_query, select=maryland_selector)
>>> for r in result:
...     print(r)
... 
{'?name': 'Maryland', '?dcid': 'geoId/24'}
```

### Error returns

#### Error return 1: Malformed SPARQL query.

```python
>>> gni_by_country_query = 'SELECT ?observation WHERE { ?observation typeOf Observation . ?observation statisticalVariable Amount_EconomicActivity_GrossNationalIncome_PurchasingPowerParity_PerCapita . ?observation observedNodeLocation ?place . ?place typeOf Country . } ORDER BY ASC (?place) LIMIT 10'
>>> datacommons.query(gni_by_country_query)
Traceback (most recent call last):
  File "/home/porpentina/miniconda3/lib/python3.7/site-packages/datacommons/query.py", line 102, in query
    res = six.moves.urllib.request.urlopen(req)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 222, in urlopen
    return opener.open(url, data, timeout)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 531, in open
    response = meth(req, response)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 641, in http_response
    'http', request, response, code, msg, hdrs)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 569, in error
    return self._call_chain(*args)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 503, in _call_chain
    result = func(*args)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 649, in http_error_default
    raise HTTPError(req.full_url, code, msg, hdrs, fp)
urllib.error.HTTPError: HTTP Error 500: Internal Server Error

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/porpentina/miniconda3/lib/python3.7/site-packages/datacommons/query.py", line 104, in query
    raise ValueError('Response error {}:\n{}'.format(e.code, e.read()))
ValueError: Response error 500:
b'{\n "code": 2,\n "message": "googleapi: Error 400: Unrecognized name: place; Did you mean name? at [1:802], invalidQuery",\n "details": [\n  {\n   "@type": "type.googleapis.com/google.rpc.DebugInfo",\n   "stackEntries": [],\n   "detail": "internal"\n  }\n ]\n}\n'
```

#### Error return 2: Malformed SPARQL query string.

```python
>>> gni_by_country_query = 'SELECT ?observation WHERE { ?observation typeOf Observation . ?observation statisticalVariable Amount_EconomicActivity_GrossNationalIncome_PurchasingPowerParity_PerCapita . ?observation observedNodeLocation ?place . ?place typeOf Country . } ORDER BY ASC (?place) LIMIT 10'
>>> datacommons.query(gni_by_country_query)
Traceback (most recent call last):
  File "/home/porpentina/miniconda3/lib/python3.7/site-packages/datacommons/query.py", line 102, in query
    res = six.moves.urllib.request.urlopen(req)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 222, in urlopen
    return opener.open(url, data, timeout)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 531, in open
    response = meth(req, response)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 641, in http_response
    'http', request, response, code, msg, hdrs)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 569, in error
    return self._call_chain(*args)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 503, in _call_chain
    result = func(*args)
  File "/home/porpentina/miniconda3/lib/python3.7/urllib/request.py", line 649, in http_error_default
    raise HTTPError(req.full_url, code, msg, hdrs, fp)
urllib.error.HTTPError: HTTP Error 500: Internal Server Error

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/porpentina/miniconda3/lib/python3.7/site-packages/datacommons/query.py", line 104, in query
    raise ValueError('Response error {}:\n{}'.format(e.code, e.read()))
ValueError: Response error 500:
b'{\n "code": 2,\n "message": "googleapi: Error 400: Unrecognized name: place; Did you mean name? at [1:802], invalidQuery",\n "details": [\n  {\n   "@type": "type.googleapis.com/google.rpc.DebugInfo",\n   "stackEntries": [],\n   "detail": "internal"\n  }\n ]\n}\n'
>>> gni_by_country_query = 'SELECT ?observation WHERE { ?observation typeOf Observation . \\\\\ ?observation statisticalVariable Amount_EconomicActivity_GrossNationalIncome_PurchasingPowerParity_PerCapita . ?observation observedNodeLocation ?place . ?place typeOf Country . } ORDER BY ASC (?place) LIMIT 10'
```

#### Error return 3: Bad selector.

```python
>>> names_for_places_query = 'SELECT ?name ?dcid WHERE {  ?a typeOf Place .  ?a name ?name .  ?a dcid ("geoId/06" "geoId/21" "geoId/24") .  ?a dcid ?dcid }'
>>> bad_selector = lambda row: row['?earthquake'] == 'Nonexistent'
>>> result = datacommons.query(names_for_places_query, select=bad_selector)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/porpentina/miniconda3/lib/python3.7/site-packages/datacommons/query.py", line 127, in query
    if select is None or select(row_map):
  File "<stdin>", line 1, in <lambda>
KeyError: '?earthquake'
```

These examples and errors, along with explanations and fixes for the errors, are available in notebook form at <https://colab.research.google.com/drive/1Jd0IDHnMdtxhsmXhL5Ib5tL0zgJud1k5?usp=sharing>.