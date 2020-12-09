---
layout: default
title: Population
nav_order: 5
parent: REST
grand_parent: API
published: false
---

# Get Populations for Place.

Given a list of [`Place`](https://datacommons.org/browser/Place) DCID's,
return the DCID of
[`StatisticalPopulation`](https://datacommons.org/browser/StatisticalPopulation)'s
for these places, constrained by the given property values.

**URL**: `/node/populations`

**Method**: `POST`

**Auth required**: Optional

**Required Arguments**:

*   `dcids`: A list of DCID's identifying `Place`’s of populations to query for.
    These DCID's are treated as the value associated by the property
    [`location`](https://datacommons.org/browser/location) for each
    returned `StatisticalPopulation`.

*   `populationType`: The
    [`populationType`](https://datacommons.org/browser/populationType)
    of each `StatisticalPopulation`, e.g.
    [`Person`](https://datacommons.org/browser/Person) or
    [`Student`](https://datacommons.org/browser/Student).

**Optional Arguments**:

*   `pvs`: A list of objects with constraining `property` and `value` fields
    that the `StatisticalPopulation` should be constrained by.

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/node/populations' \
-d '{ "dcids": ["geoId/05", "geoId/06"], \
      "populationType": "Person", \
      "pvs": [{"property":"gender", "value": "Male"}, \
               {"property":"age", "value": "Years85Onwards"}]}'
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
objects with fields `dcid` for the place and `population` for the corresponding
population DCID.

```json
[
  {
    "dcid": "geoId/05",
    "population": "dc/p/7j2me3p74sht1"
  },
  {
    "dcid": "geoId/06",
    "population": "dc/p/gpvt9t84mq3gg"
  }
]
```

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the data.
For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (populationType not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/populations' \
-d '{"dcids": ["geoId/05"], "pvs": [{"property":"gender","value": "Male"}]}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```
