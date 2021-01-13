---
layout: default
title: Observation
nav_order: 6
parent: REST
grand_parent: API
published: false
---

# Get Observations for Populations.

Given a list of
[`StatisticalPopulation`](https://datacommons.org/browser/StatisticalPopulation)
DCIDs, return the DCID of
[`Observation`](https://datacommons.org/browser/Observation)'s for these
statistical populations, constrained by the given observation's property values.

**URL**: `/node/observations`

**Method**: `POST`

**Auth required**: Optional

**Required Arguments**:

*   `dcids`: A list of statistical populations to query, identified by their
    DCIDs. These DCIDs are treated as the property value associated with
    returned `Observation`'s by the property
    [`observedNode`](https://datacommons.org/browser/observedNode)

*   `statsType`: The statistical type of the `Observation`. This is commonly set
    to `measuredValue`.

*   `measurementMethod`: The property value associated with returned
    `Observation`'s by the property
    [`measurementMethod`](https://datacommons.org/browser/measurementMethod)
    of the observation. If the `Observation` does not have this property
    specified, set this to an empty string.

*   `measuredProperty`: The property value associated with returned
    `Observation`'s by the property
    [`measuredProperty`](https://datacommons.org/browser/measuredProperty)

*   `observationDate`: The property value associated with returned
    `Observation`'s by the property
    [`observationDate`](https://datacommons.org/browser/observationDate).
    This is specified in ISO8601 format.

*   `observationPeriod`: The property value associated with returned
    `Observation`'s by the property
    [`observationPeriod`](https://datacommons.org/browser/observationPeriod)
    of the observation. If the `Observation` does not have this property
    specified, set this to an empty string.


## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/node/observations' \
-d '{"dcids": ["dc/p/x6t44d8jd95rd", "dc/p/lr52m1yr46r44"], \
     "measuredProperty": "count", \
     "statsType": "measuredValue", \
     "observationDate": "2018-12", \
     "observationPeriod": "P1M", \
     "measurementMethod": "BLSSeasonallyAdjusted"}'
```

## Success Response

### **Code**: `200 OK`

**Response content example**

```json
{
    "payload": "<payload string>",
}
```

The "`payload string`" is a string encoding of JSON object that is a list of
objects with fields `dcid` for the statistical population and `observation` for
the corresponding observation DCID.

```json
[
  {
    "dcid": "dc/p/lr52m1yr46r44",
    "observation": "3075662.000000"
  },
  {
    "dcid": "dc/p/x6t44d8jd95rd",
    "observation": "18704962.000000"
  }
]
```

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the data.
For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (observationDate not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/observations' \
-d '{"dcids": ["dc/p/x6t44d8jd95rd", "dc/p/lr52m1yr46r44"], \
     "measuredProperty": "count", \
     "statsType": "measuredValue"}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```
