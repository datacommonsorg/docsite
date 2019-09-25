---
layout: default
title: Population and Observation
nav_order: 7
parent: REST
grand_parent: API
---

# Get All Populations and Observations for a Node.

Given the DCID of a node, return all the
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)s
and [`Observation`](https://browser.datacommons.org/kg?dcid=Observation)s for
this node.

**URL** : `/bulk/pop-obs`

**Method** : `GET`

**Auth required** : YES

To get an API key, check [API Key](https://datacommonsorg.github.io/docsite/api/api_key.html) section.

**Required Arguments**:

*   `key`: Your API key.
*   `dcid`: The DCID of the node (mostly with type of a `Place` like `City`,
    `County` or organization like `School`).

## GET Request

**Example**

```bash
curl 'https://api.datacommons.org/bulk/pop-obs?key=API_KEY&dcid=geoId/06'
```

## Success Response

### **Code** : `200 OK`

**Response content example**

```json
{
    "payload": "<payload string>",
}
```

The "`payload string`" is a string of a compressed JSON object that contains all
the `population`s and `observation`s for this node. Below is an example of the
JSON object.

```json
{
  "name": "Santa Clara",
  "populations": {
    "dc/p/zzlmxxtp1el87": {
      "popType": "Household",
      "numConstraints": 3,
      "propertyValues": {
        "householderAge": "Years45To64",
        "householderRace": "USC_AsianAlone",
        "income": "USDollar35000To39999"
      },
      "observations": [
        {
          "marginOfError": 274,
          "measuredProp": "count",
          "measuredValue": 1352,
          "measurementMethod": "CensusACS5yrSurvey",
          "observationDate": "2017"
        },
        {
          "marginOfError": 226,
          "measuredProp": "count",
          "measuredValue": 1388,
          "measurementMethod": "CensusACS5yrSurvey",
          "observationDate": "2013"
        }
      ],
    },
  },
  "observations": [
    {
      "meanValue": 4.1583,
      "measuredProp": "particulateMatter25",
      "measurementMethod": "CDCHealthTracking",
      "observationDate": "2014-04-04",
      "observedNode": "geoId/06085"
    },
    {
      "meanValue": 9.4461,
      "measuredProp": "particulateMatter25",
      "measurementMethod": "CDCHealthTracking",
      "observationDate": "2014-03-20",
      "observedNode": "geoId/06085"
    }
  ]
}
```

The top level of the JSON has the following keys.

-   `name`: the name of the given node.
-   `populations`: an object, keyed by `DCID`, of all `StatisticalPopulation`s
    that have the given node as its `location`.
-   `observations`: an object, keyed by `DCID`, of all `Observation`s that have
    the given node as its `observedNode`.

The `populations` object value contains the following fields that describe the
`StatisticalPopulation`, keyed by the `DCID` of the population.

-   `popType`: the population type .
-   `numConstraints`: the number of constraining properties.
-   `propertyValues`: an object mapping a constraining property to its value.
-   `observations`: an array of all `Observation`s that have the identified
    `StatisticalPopulation` as their `observedNode`.

Each `Observation` object has the following fields:

-   `measuredProp`: The property measured by the `Observation`.
-   `observationDate`: The date when the `Observation` was made.
-   `observationPeriod` (optional): The period over which the `Observation` was
    made.
-   `measurementMethod` (optional): A field providing additional information on
    how the `Observation` was collected.
-   Additional fields that denote values measured by the `Observation`. These
    may include the following: `measuredValue`, `meanValue`, `medianValue`,
    `maxValue`, `minValue`, `sumValue`, `marginOfError`, `stdError`,
    `meanStdError`, and others.

If the given node does not have any `StatisticalPopulation` or `Observation`,
then the JSON object would be empty.

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the
compressed data. For example, in JavaScript: `var data =
JSON.parse(response['payload'])`.

<!--- TODO: provide example to do decompression --->

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (dcid not specified)

```bash
curl 'https://api.datacommons.org/bulk/pop-obs?key=API_KEY'
```

**Response content example**

```json
{
  "code": 2,
  "message": "must provide a DCID"
}
```

### **Code**: `401 Unauthorized`

**Request example:** (API key not specified)

```bash
curl 'https://api.datacommons.org/bulk/pop-obs'
```

**Response content example**

```json
{
  "code": 16,
  "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API."
}
```