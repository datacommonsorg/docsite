---
layout: default
title: Place Statistics
nav_order: 10
parent: REST
grand_parent: API
---

# Get Statistics for Places.

Returns a time series of statistics value for queried places based on the
[`StatisticalVariable`](https://browser.datacommons.org/kg?dcid=StatisticalVariable).

**URL** : `/bulk/stats`

**Method** : `POST`

**Auth required** : YES

To get an API key, check [API Key](/api/setup.html) section.

**Required Arguments**:

*   `key`: Your API key.

*   `place`: A list of dcids of the
    [`Place`](https://browser.datacommons.org/kg?dcid=Place) to query for.

*   `stats_var`: The dcid of the
    [`StatisticalVariable`](https://browser.datacommons.org/kg?dcid=StatisticalVariable).

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/bulk/stats?key=API_KEY' \
-d '{ "place": ["geoId/05", "geoId/06"], "stats_var": "dc/0hyp6tkn18vcb"}'
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
      "2011":18136,
      "2012":17279,
      "2013":17459,
      "2014":16966,
      "2015":17173,
      "2016":17041,
      "2017":17783,
      "2018":18003
    },
    "place_name": "Arkansas"
  },
  "geoId/06": {
    "data": {
      "2011":316667,
      "2012":324116,
      "2013":331853,
      "2014":342818,
      "2015":348979,
      "2016":354806,
      "2017":360645,
      "2018":366331
    },
  "place_name":"California"
}
```

The json contains an object keyed by place DCID. The value contains the place
name and a "data" object keyed by the observation date and value being the actual
statistics.

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the
compressed data. For example, in JavaScript: `var data =
JSON.parse(response['payload'])`.

<!--- TODO: provide example to do decompression --->

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