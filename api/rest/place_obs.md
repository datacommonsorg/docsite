---
layout: default
title: Place Observation
nav_order: 8
parent: REST
grand_parent: API
---

# Get Observations for Places.

Returns all
[`Observation`](https://browser.datacommons.org/kg?dcid=Observation)s for all
[`Place`](https://browser.datacommons.org/kg?dcid=Place)s of a certain type, for
a given
[`observationDate`](https://browser.datacommons.org/kg?dcid=observationDate),
given a set of constraints on the
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)s.

**URL** : `/bulk/place-obs`

**Method** : `POST`

**Auth required** : YES

To get an API key, check [API Key](https://datacommonsorg.github.io/website/api/api_key.html) section.

**Required Arguments**:

*   `key`: Your API key.
*   `placeType`: The type of the
    [`Place`](https://browser.datacommons.org/kg?dcid=Place) to query for.
*   `populationType`: The population type of the
    [`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation).
*   `observationDate`: The observation date in ISO-8601 format.

**Optional Arguments**:

*   `pvs`: A list of objects with constraining `property` and `value` fields
    that the `StatisticalPopulation` should be constrained by.

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/bulk/place-obs?key=API_KEY' \
-d '{ "placeType": "State", \
      "populationType": "Person", \
      "observationDate": "2011", \
      "pvs": [{"property":"gender", "value": "Male"}]}'
```

## Success Response

### **Code** : `200 OK`

**Response content example**

```json
{
    "payload": "<payload string>",
}
```

The "`payload string`" is a string of a compressed JSON object that contains
`observation`s that match the request parameters.

```json
{
  "places": [
    {
      "name": "Pennsylvania",
      "place": "geoId/42",
      "observations": [
        {
          "marginOfError": 933,
          "measuredProp": "count",
          "measuredValue": 6167949,
          "measurementMethod": "CensusACS5yrSurvey"
        },
        {
          "marginOfError": 0.2,
          "measuredProp": "age",
          "measurementMethod": "CensusACS5yrSurvey",
          "medianValue": 38.5,
          "unit": "Year"
        }
      ],
    },
    {
      "name": "Missouri",
      "place": "geoId/29",
      "observations": [
        {
          "marginOfError": 908,
          "measuredProp": "count",
          "measuredValue": 2915275,
          "measurementMethod": "CensusACS5yrSurvey"
        },
        {
          "marginOfError": 0.1,
          "measuredProp": "age",
          "measurementMethod": "CensusACS5yrSurvey",
          "medianValue": 36.4,
          "unit": "Year"
        }
      ],
    }
  ]
}
```

The top level of the JSON contains field `places` which maps to an array of data
for each place identified by the DCID.

Each place data contains the following fields.

-   `name`: the name of the place.
-   `place`: the DCID of the place.
-   `observations`: an array of all `Observation`s.

Each `Observation` object has the following fields:

-   `measuredProp`: The property measured by the `Observation`.
-   `measurementMethod` (optional): A field providing additional information on
    how the `Observation` was collected.
-   Additional fields that denote values measured by the `Observation`. These
    may include the following: `measuredValue`, `meanValue`, `medianValue`,
    `maxValue`, `minValue`, `sumValue`, `marginOfError`, `stdError`,
    `meanStdError`, and others.

If the given node does not have any `Observation`s, then the JSON object would
be empty.

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the
compressed data. For example, in JavaScript: `var data =
JSON.parse(response['payload'])`.

<!--- TODO: provide example to do decompression --->

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (observationDate not specified)

```bash
curl -X POST 'https://api.datacommons.org/bulk/place-obs?key=API_KEY' \
-d '{ "placeType": "State", \
      "populationType": "Person"}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```

### **Code**: `401 Unauthorized`

**Request example:** (API key not specified)

```bash
curl -X POST 'https://api.datacommons.org/bulk/place-obs'
```

**Response content example**

```json
{
  "code": 16,
  "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API."
}
```