---
layout: default
title: Population and Observation
nav_order: 7
parent: Python
grand_parent: API
---

# Get All Populations and Observations for a Node.

## `datacommons.get_pop_obs(dcid)`

Given the DCID of a node, return all the
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)s
and [`Observation`](https://browser.datacommons.org/kg?dcid=Observation)s for
this node.

**Arguments**

*   `dcid`: The DCID of the node (mostly with type of `Place` like `City` or
    `County`, or `Organization` like `School`).

**Returns**

A `dict` of `StatisticalPopulation` and `Observation` that are associated to
the thing identified by the given `dcid`. The given DCID is linked to the
returned `StatisticalPopulation`, which are the `observedNode` of the returned
`Observation`.

See example below for more detail about how the returned `dict` is structured.

**Raises**

*   `ValueError`: If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get all `StatisticalPopulation` and `Observations` of
[Santa Clara](https://browser.datacommons.org/kg?dcid=geoId/06085)

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> dc.get_pop_obs('geoId/06085')
{
  'name': 'Santa Clara',
  'placeType': 'County',
  'populations': {
    'dc/p/zzlmxxtp1el87': {
      'popType': 'Household',
      'numConstraints': 3,
      'propertyValues': {
        'householderAge': 'Years45To64',
        'householderRace': 'USC_AsianAlone',
        'income': 'USDollar35000To39999'
      },
      'observations': [
        {
          'marginOfError': 274,
          'measuredProp': 'count',
          'measuredValue': 1352,
          'measurementMethod': 'CensusACS5yrSurvey',
          'observationDate': '2017'
        },
        {
          'marginOfError': 226,
          'measuredProp': 'count',
          'measuredValue': 1388,
          'measurementMethod': 'CensusACS5yrSurvey',
          'observationDate': '2013'
        }
      ],
    },
  },
  'observations': [
    {
      'meanValue': 4.1583,
      'measuredProp': 'particulateMatter25',
      'measurementMethod': 'CDCHealthTracking',
      'observationDate': '2014-04-04',
      'observedNode': 'geoId/06085'
    },
    {
      'meanValue': 9.4461,
      'measuredProp': 'particulateMatter25',
      'measurementMethod': 'CDCHealthTracking',
      'observationDate': '2014-03-20',
      'observedNode': 'geoId/06085'
    }
  ]
}
```
[comment]: <> (Update the example with more realistic example, ellipsis and all)

Notice that the return value is a multi-level `dict`. The top level
contains the following keys.
* `name` and `placeType` provides the name and type of the `Place` identified
  by the given `dcid`.
* `populations` maps to a `dict` containing all `StatisticalPopulation` that
  have the given `dcid` as its `location`.
* `observations` maps to a `list` containing all `Observation` that have the
  given `dcid` as its `observedNode`.

The `populations` dictionary is keyed by the dcid of each
`StatisticalPopulation`. The mapped dictionary contains the following keys.

* `popType` which gives the population type of the
  `StatisticalPopulation` identified by the key.
* `numConstraints` which gives the number of constraining properties
  defined for the identified `StatisticalPopulation`.
* `propertyValues` which gives a `dict` mapping a constraining
  property to its value for the identified `StatisticalPopulation`.
* `observations` which gives a list of all `Observation`'s that
  have the identified `StatisticalPopulation` as their
  `observedNode`.

Each `Observation` is represented by a `dict` that have the keys:

* `measuredProp`: The property measured by the `Observation`.
* `observationDate`: The date when the `Observation` was made.
* `observationPeriod` (optional): The period over which the
  `Observation` was made.
* `measurementMethod` (optional): A field providing additional
  information on how the `Observation` was collected.
* Additional fields that denote values measured by the `Observation`.
  These may include the following: `measuredValue`, `meanValue`,
  `medianValue`, `maxValue`, `minValue`, `sumValue`,
  `marginOfError`, `stdError`, `meanStdError`, and others.

## Errors

### `ValueError`: API key not specified

```python
>>> import datacommons as dc
>>> dc.get_property_labels(['geoId/06'])
ValueError: Request error: Must set an API key before using the API! You can
call datacommons.set_api_key or assign the key to an environment variable named
DC_API_KEY
```
