---
layout: default
title: Population
nav_order: 5
parent: REST
grand_parent: API
---

# Get Populations for Place.

Given a list of [`Place`](https://browser.datacommons.org/kg?dcid=Place) DCID's,
return the DCID of
[`StatisticalPopulation`](https://browser.datacommons.org/kg?dcid=StatisticalPopulation)'s
for these places, constrained by the given property values.

**URL** : `/node/populations`

**Method** : `POST`

**Auth required** : YES

To get an API key, check [API Key](https://datacommonsorg.github.io/docsite/api/api_key.html) section.

**Required Arguments**:

*   `key`: Your API key.
*   `dcids`: A list of DCID's identifying `Place`’s of populations to query for.
    These DCID's are treated as the value associated by the property
    [`location`](https://browser.datacommons.org/kg?dcid=location) for each
    returned `StatisticalPopulation`.
*   `populationType`: The
    [`populationType`](https://browser.datacommons.org/kg?dcid=populationType)
    of each `StatisticalPopulation`, e.g.
    [`Person`](https://browser.datacommons.org/kg?dcid=Person) or
    [`Student`](https://browser.datacommons.org/kg?dcid=Student).

**Optional Arguments**:

*   `pvs`: A list of objects with constraining `property` and `value` fields
    that the `StatisticalPopulation` should be constrained by.

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/node/populations?key=API_KEY' \
-d '{ "dcids": ["geoId/05", "geoId/06"], \
      "populationType": "Person", \
      "pvs": [{"property":"gender", "value": "Male"}, \
               {"property":"age", "value": "Years85Onwards"}]}'
```

## Success Response

### **Code** : `200 OK`

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
curl -X POST 'https://api.datacommons.org/node/populations?key=API_KEY' \
-d '{"dcids": ["geoId/05"], "pvs": [{"property":"gender","value": "Male"}]}'
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
curl -X POST 'https://api.datacommons.org/node/populations'
```

**Response content example**

```json
{
  "code": 16,
  "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API."
}
```