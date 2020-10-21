---
layout: default
title: Place Statistics - Single Value
nav_order: 10
parent: REST
grand_parent: API
---

# Get Statistical Value for a Place

Returns a statistical value for a place based on the
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of StatisticalVariables](/statistical_variables.html).

When there are multiple sources for the same statistical variable, a prefered
source with more recent data or more authorative is selected.

**URL**: `/stat/value`

**Method**: `GET`

**Required Arguments**:

* `place`: The dcid of the [`Place`](https://datacommons.org/browser/Place) to query for.

* `stat_var`: The dcid of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

**Optional Arguments**:

* `date`: The preferred date of observation in ISO 8601 format. If not specified, returns the latest observation.
* `measurement_method`: The dcid of the preferred `measurementMethod` value.
* `observation_period`: The preferred `observationPeriod` value.
* `unit`: The dcid of the preferred `unit` value.
* `scaling_factor`: The preferred `scalingFactor` value.

## GET Request

**Examples**

```bash
curl 'https://api.datacommons.org/stat/value?place=geoId/06&stat_var=Count_Person_Male'
```

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## Success Response

### **Code**: `200 OK`

**Response content example**

```json
{
    "value": 200
}
```

## Error Response

### **Code**: `400 Bad Request`

**Request example:** (place not specified)

```bash
curl 'https://api.datacommons.org/stat/value?stat_var=Count_Person_Male'
```

**Response content example**

```json
{
  "code": 3,
  "message": "Missing required argument: place"
}
```

### **Code**: `404 Not Found`

**Request example:** (No data for the query)

```bash
curl 'https://api.datacommons.org/stat/value?place=badPlaceDcid&stat_var=Count_Person_Male'
```

**Response content example**

```json
{
  "code": 5,
  "message": "No data for badPlaceDcid, Count_Person_Male",
}
```
