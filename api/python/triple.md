---
layout: default
title: Get triples associated with nodes
nav_order: 32
parent: Python
grand_parent: API - Query data programmatically
---

# Retrieve triples associated with nodes

Given a list of nodes, return [triples](https://docs.datacommons.org/glossary.html) which are associated with the specified
node(s).

## General information about this method

**Signature**: 

```python
datacommons.get_triples(dcids, limit=datacommons.utils._MAX_LIMIT)
```

**Required arguments**:

*   `dcids` - A list of nodes to query, identified by their [DCID](https://docs.datacommons.org/glossary.html).

**Optional arguments**:

*   `limit` - The maximum number of triples per combination of
    property and type associated with nodes linked by that property to fetch,
    ≤ 500.

## Assembling the information you will need for a call to the get_triples method

This endpoint requires the argument [`dcids`](https://docs.datacommons.org/glossary.html), which are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the nodes of interest.

In addition to this required property, this endpoint also allows you to specify a limit on how many triples (up to 500) you would like to see in the response.

## What to expect in the function return

The method's return value will always be a `dict` in the following form:

```python
{
    "<dcid>": [<Triple>, ...]
    ...
}
```

While all triples contain subjects, predicates, and objects, those entities may be specified using any of a few possible fields. Here are possible keys that you may find associated to triples in the JSON response:

  -	`SubjectID`
  -	`SubjectName`
  -	`SubjectTypes`
  -	`Predicate`
  -	`ObjectID`
  -	`ObjectName`
  -	`ObjectValue`
  -	`ObjectTypes`
  -	`ProvenanceID`

## Example requests and responses

### Example 1: Retrieve triples associated with zip code 94043.

```python
>>> datacommons.get_triples(['zip/94043'])
{'zip/94043': [('dc/p/zx34sdjfl5v75', 'location', 'zip/94043'), ... ]}
```

### Example 2: Retrieve triples associated with two American biological research labs.

```python
>>> datacommons.get_triples(['dc/c3j78rpyssdmf','dc/7hfhd2ek8ppd2'])
{'dc/c3j78rpyssdmf': [('dc/c3j78rpyssdmf', 'provenance', 'dc/h2lkz1'), ('dc/zn6l0flenf3m6', 'biosampleOntology', 'dc/c3j78rpyssdmf'), ('dc/tkcknpfwxfrhf', 'biosampleOntology', 'dc/c3j78rpyssdmf'), ('dc/jdzbbfhgzghv1', 'biosampleOntology', 'dc/c3j78rpyssdmf'), ('dc/4f9w8lhcwggxc', 'biosampleOntology', 'dc/c3j78rpyssdmf')], 'dc/7hfhd2ek8ppd2': [('dc/4mjs95b1meh1h', 'biosampleOntology', 'dc/7hfhd2ek8ppd2'), ('dc/13xcyzcr819cb', 'biosampleOntology', 'dc/7hfhd2ek8ppd2'), ('dc/7hfhd2ek8ppd2', 'provenance', 'dc/h2lkz1')]}
```

## Error Returns

If a non-existent triple is passed, a KeyError is thrown:

```python
>>> datacommons.get_triples(['geoId/123'])
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/porpentina/miniconda3/lib/python3.7/site-packages/datacommons/core.py", line 251, in get_triples
    for t in payload[dcid]:
KeyError: 'geoId/123'
```

If you do not pass the required positional argument, a TypeError is returned:

```python
>>> datacommons.get_triples()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: get_triples() missing 1 required positional argument: 'dcids'
```
