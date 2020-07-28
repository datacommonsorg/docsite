---
layout: default
title: Triple
nav_order: 2
parent: Python
grand_parent: API
---

# Show Triples Associated with Node(s)

## `datacommons.get_triples(dcids, limit=datacommons.utils._MAX_LIMIT)`

Given a list of nodes, return triples which are associated with the specified
node(s).

A knowledge graph can be described as a collection of *triples* which are
3-tuples that take the form *(s, p, o)*. Here, *s* and *o* are nodes in the
graph called the *subject* and *object* respectively, while *p* is the property
label of a directed edge from *s* to *o* (sometimes also called the *predicate*).

**Arguments**

*   `dcids (list of str)` - DCIDs to get triples for

*   `limit (int, optional)` - The maximum number of triples per combination of
    property and type associated with nodes linked by that property to fetch,
    ≤ 500.

**Returns**

A `dict` mapping DCIDs to a `list` of triples *(s, p, o)* where *s*, *p*, and *o* are
instances of `str` and either the *subject* or *object* is the specified DCID.

Each DCID is mapped to a list of triples, where a triple is an object with the
following fields. Note that not all fields are always included in each triple.

[comment]: <> (TODO: add link to data model and describe the fields in a Triple)

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get one triple per property and type combination associated with
[California](https://datacommons.org/browser/geoId/06):

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> get_triples(['geoId/06'], limit=1)
{
  'geoId/06': [
    ('geoId/0653', 'containedInPlace', 'geoId/06'),
    ('geoId/06', 'provenance', 'dc/sm3m2w3'),
    ('dc/p/zyjy2jq2xme02', 'location', 'geoId/06'),
    ('geoId/06', 'containedInPlace', 'country/USA'),
    ('geoId/0686440', 'containedInPlace', 'geoId/06'),
    ('geoId/sch0699014', 'containedInPlace', 'geoId/06'),
    ('geoId/0686944', 'containedInPlace', 'geoId/06'),
    ('geoId/sch0699997', 'containedInPlace', 'geoId/06'),
    ('election/2024_S_CA00', 'location', 'geoId/06'),
    ('ipedsId/487597', 'location', 'geoId/06'),
    ('geoId/sch0643380', 'containedInPlace', 'geoId/06'),
    ('geoId/06113011002', 'containedInPlace', 'geoId/06'),
    ('geoId/C49700', 'overlapsWith', 'geoId/06'),
    ('geoId/0611593830', 'containedInPlace', 'geoId/06'),
    ('geoId/06U', 'containedInPlace', 'geoId/06'),
    ('geoId/06115', 'containedInPlace', 'geoId/06'),
    ('965EYosemiteAvenueSuite2MantecaCA95336', 'addressRegion', 'geoId/06'),
    ('geoId/06', 'typeOf', 'State')
  ]
}
```

If there is no node associated with the given DCID, an empty list is returned:

```python
>>> dc.get_triples(['foo'])
{'foo': []}
```