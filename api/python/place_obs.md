---
layout: default
title: Place Observation
nav_order: 8
parent: Python
grand_parent: API
---

# Get Observations for Places.

## `datacommons.get_place_obs(place_type, observation_date, population_type, constraining_properties={})`

Returns all
[`Observation`](https://browser.datacommons.org/kg?dcid=Observation)s for all
[`Place`](https://browser.datacommons.org/kg?dcid=Place)s of a certain type, for
a given
[`observationDate`](https://browser.datacommons.org/kg?dcid=observationDate),
given a set of constraints on the
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)s.

**Arguments**

*   `placeType (str)`: The type of the
    [`Place`](https://browser.datacommons.org/kg?dcid=Place) to query for.

*   `observation_date (str)`: The observation date in ISO-8601 format.

*   `population_type (str)`: The population type of the
    [`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation).

*   `constraining_properties (map from str to str)`: An object of `property` and `value` fields
    that the `StatisticalPopulation` should be constrained by. Must be specified if defined on the population.

**Returns**

A list of dictionaries, with each dictionary containng *all* `Observation`'s of
a place that conform to the `StatisticalPopulation` constraints. See examples
for more details on how the format of the return value is structured.

**Raises**

*   `ValueError` - If the payload returned by the Data Commons REST API is malformed or the API key is not set.

Be sure to initialize the library, and specify the API key. Check the [Python library setup guide](/api/python/) for more details.

## Examples

We would like to get all `StatisticalPopulation` and `Observations` for all
places of type `City` in year 2017 where the populations have a population type
of `Person` is specified by the following constraining properties.

* Persons should have [`age`](https://browser.datacommons.org/kg?dcid=age)
  with value [`Years5To17`](https://browser.datacommons.org/kg?dcid=Years5To17)
* Persons should have [`placeOfBirth`](https://browser.datacommons.org/kg?dcid=placeOfBirth)
  with value `BornInOtherStateInTheUnitedStates`.

```python
>>> import datacommons as dc
>>> dc.set_api_key(YOUR_API_KEY_HERE)
>>> props = {
...   'age': 'Years5To17',
...   'placeOfBirth': 'BornInOtherStateInTheUnitedStates'
... }
>>> get_place_obs('City', '2017', 'Person', constraining_properties=props)
[
  {
    'name': 'Palm Springs',
    'place': 'geoId/0655254',
    'observations': [
      {
        'marginOfError': 220,
        'measuredProp': 'count',
        'measuredValue': 674,
        'measurementMethod': 'CensusACS5yrSurvey'
      },
      # More observations...
    ],
  },
  # Entries for more cities...
]
```

The value returned by `get_place_obs` is a `list` of `dict`'s. Each dictionary
corresponds to a `StatisticalPopulation` matching the given `population_type`
and `constraining_properties` for a single place of the given `place_type`. The
dictionary contains the following keys:

* `name`: The name of the place being described.
* `place`: The DCID associated with the place being described.
* `observations`: A `list` of `Observation`s for each place matching the given constraints.

Each `Observation` is represented by a `dict` with the following keys:

* `measuredProp`: The property measured by the `Observation`.
* `measurementMethod` (optional): A field identifying how the `Observation` was
  made
* Additional fields that denote values measured by the `Observation`.  These
  may include the following: `measuredValue`, `meanValue`, `medianValue`,
  `maxValue`, `minValue`, `sumValue`, `marginOfError`, `stdError`,
  `meanStdError`, and others.

## Errors

### `ValueError`: API key not specified

```python
>>> import datacommons as dc
>>> dc.get_property_labels(['geoId/06'])
ValueError: Request error: Must set an API key before using the API! You can
call datacommons.set_api_key or assign the key to an environment variable named
DC_API_KEY
```
