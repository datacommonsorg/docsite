---
layout: default
title: Property Label
nav_order: 4
parent: Python
grand_parent: API
---

# Show Property Labels of Node(s)

## `datacommons.get_property_labels(dcids, out=True)`

Returns the labels of properties defined for the given node DCID's

**Arguments**

*   `dcids (list of str)` - A list of nodes to query, identified by their DCID's

*   `out (bool, optional)` - Whether or not the property points away from the given list of nodes.

**Returns**

A `dict` mapping DCID's to lists of property labels. If `out` is `True`,
then property labels correspond to edges directed away from given nodes.
Otherwise, they correspond to edges directed towards the given nodes.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed.

## Examples

**Examples**

To get all outgoing property labels for [California](https://datacommons.org/browser/geoId/06>) and
[Colorado](https://datacommons.org/browser/geoId/08), we can write the following:

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dc.get_property_labels(['geoId/06', 'geoId/08'])
    {
      'geoId/06': [
        'containedInPlace',
        'geoId',
        'kmlCoordinates',
        'name',
        'provenance',
        'typeOf'
      ],
      'geoId/08',: [
        'containedInPlace',
        'geoId',
        'kmlCoordinates',
        'name',
        'provenance',
        'typeOf'
      ]
    }
```

We can also get incoming property labels by setting `out=False`:
```python
>>> dc.get_property_labels(['geoId/06', 'geoId/08'], out=False)
{
  'geoId/06': [
    'addressRegion',
    'containedInPlace',
    'location',
    'overlapsWith'
  ],
  'geoId/08',: [
    'addressRegion',
    'containedInPlace',
    'location',
    'overlapsWith'
  ]
}
```

If there is no node associated with the DCID, an empty list is returned:

```python
>>> dc.get_property_labels(['geoId/06', 'geoId/21'])
{'geoId/06': [], 'geoId/21': []}
```