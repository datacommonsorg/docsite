---
layout: default
title: Place Statistics
nav_order: 11
parent: REST
grand_parent: API
---

# Get Statistical Value for a Place

Returns a statistical value for a place based on the
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of StatisticalVariables](/statistical_variables.html).

**URL**: `/stat/value`

**Method**: `GET`

**Required Arguments**:

* `place`: The dcid of the [`Place`](https://datacommons.org/browser/Place) to query for.

* `stats_var`: The dcid of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## GET Request

**Example**

```bash
curl 'https://api.datacommons.org/stat/value?place=geoId/06&stat_var=Count_Person_Male'
```

## Success Response

### **Code**: `200 OK`

**Response content example**

```json
{
    "value": 200,
}
```

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (place not specified)

```bash
curl 'https://api.datacommons.org/stat/value?stat_var=Count_Person_Male'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```

**Request example:** (No data for the query)

```bash
curl 'https://api.datacommons.org/stat/value?place=geoId&stat_var=Count_Person_Male'
```

**Response content example**

```json
{
  "code": 2,
  "message": "No data for geoId, Count_Person_Male",
}
```
