---
layout: default
title: Place Statistics
nav_order: 10
parent: REST
grand_parent: API
---

# Get Statistics for Places.

Returns a time series of statistical values for queried places based on the
[`StatisticalVariable`](https://browser.datacommons.org/kg?dcid=StatisticalVariable).

**URL** : `/bulk/stats`

**Method** : `POST`

**Auth required** : YES

To get an API key, check [API Key](/api/setup.html) section.

**Required Arguments**:

*   `key`: Your API key.

*   `place`: A list of dcids of the
    [`Place`](https://browser.datacommons.org/kg?dcid=Place)s to query for.

*   `stats_var`: The dcid of the
    [`StatisticalVariable`](https://browser.datacommons.org/kg?dcid=StatisticalVariable).

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/bulk/stats?key=API_KEY' \
-d '{ "place": ["geoId/05", "geoId/06085"], "stats_var": "Count_Person_Male"}'
```

## Success Response

### **Code** : `200 OK`

**Response content example**

```json
{
    "payload": "<payload string>",
}
```

The "`payload string`" is a JSON string that contains the time series of the
queried places.

```json
{
  "geoId/05": {
    "data": {
      "2011": 1421287,
      "2012": 1431252,
      "2013": 1439862,
      "2014": 1447235,
      "2015": 1451913,
      "2016": 1456694,
      "2017": 1461651,
      "2018": 1468412
    },
    "place_name": "Arkansas"
  },
  "geoId/06085": {
    "data": {
      "2011": 885307,
      "2012": 898013,
      "2013": 910196,
      "2014": 924848,
      "2015": 939004,
      "2016": 949223,
      "2017": 963317,
      "2018": 970469
    },
    "place_name": "Santa Clara County"
  }
}
```

The json contains an object keyed by place DCID. The value contains the place
name and a "data" object keyed by the observation date and value being the actual
statistics.

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the data. For example, in JavaScript: `var data = JSON.parse(response['payload'])`.


## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (statistcal variable not specified)

```bash
curl -X POST 'https://api.datacommons.org/bulk/stats?key=API_KEY' \
-d '{ "place": ["geoId/05", "geoId/06"]}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```