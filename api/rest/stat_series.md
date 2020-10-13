---
layout: default
title: Place Statistics - Time Series
nav_order: 11
parent: REST
grand_parent: API
---

# Get Statistical Time Series for a Place

Returns a time series of statistical values for a place based on a
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of StatisticalVariables](/statistical_variables.html).

When there are multiple sources for the same statistical variable, a prefered
source with more recent or more authorative data is selected.

**URL**: `/stat/series`

**Method**: `GET`

**Required Arguments**:

- `place`: The `dcid` of the [`Place`](https://datacommons.org/browser/Place) to query for.

- `stat_var`: The `dcid` of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

**Optional Arguments**:

- `measurement_method`: The `dcid` of the preferred `measurementMethod` value.
- `observation_period`: The preferred `observationPeriod` value.
- `unit`: The dcid of the preferred `unit` value.
- `scaling_factor`: The preferred `scalingFactor` value.

## GET Request

**Examples**

```bash
curl 'https://api.datacommons.org/stat/series?place=geoId/06&stat_var=Count_Person_Male'
```

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/w32gmo68/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## Success Response

### **Code**: `200 OK`

**Response content example**

```json
{
  "series": {
    "2013": 18726468,
    "2014": 18911519,
    "2015": 19087135,
    "2016": 19200970,
    "2017": 19366579,
    "2018": 19453769,
    "2011": 18387718,
    "2012": 18561020
  }
}
```

## Error Response

### **Code**: `400 Bad Request`

**Request example:** (place not specified)

```bash
curl 'https://api.datacommons.org/stat/series?stat_var=Count_Person_Male'
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
curl 'https://api.datacommons.org/stat/series?place=badPlaceDcid&stat_var=Count_Person_Male'
```

**Response content example**

```json
{
  "code": 5,
  "message": "No data for badPlaceDcid, Count_Person_Male"
}
```
