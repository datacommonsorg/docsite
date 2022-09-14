---
layout: default
title: Place Statistics - All
nav_order: 9
parent: REST (v0)
grand_parent: API
---

# Get a collection of statistical data for one or more places

Returns a multiple level object containing all available time series for the specified
places and statistical variables.
Note that in Data Commons, a Statistical Variable is any type of statistical metric that can be measured at a place and
time. See the [full list of StatisticalVariables](/statistical_variables.html).

## General information about this endpoint

**URL**: `/stat/all`

**Method**: `POST`

**Required arguments**:

- [`places`](/glossary.html): A list of [`Place`](https://datacommons.org/browser/Place) `DCIDs` to query for. (Here DCID stands for Data Commons ID, the unique identifier assigned to all entities in Data Commons.)

- [`stat_vars`](/glossary.html): A list of [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable) `DCIDs`.

## Example

### Request

<div>

{% tabs log %}

{% tab log GET Request %}

This endpoint does not support GET requests.

{% endtab %}

{% tab log POST Request %}

```bash
curl -X POST 'https://api.datacommons.org/stat/all' \
-d '{ "places": ["geoId/05", "geoId/06085"], "stat_vars": ["Count_Person_Male", "Count_Person_Female"]}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/bmfr590L/11/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Response

```json
{
  "placeData": {
    "geoId/05": {
      "statVarData": {
        "Count_Person_Male": {
          "placeName": "Arkansas",
          "sourceSeries": [
            {
              "val": {
                "2002": 1323840,
                "2008": 1410040,
                ...
                "2016": 1469240,
                "2017": 1475420
              },
              "measurementMethod": "OECDRegionalStatistics",
              "observationPeriod": "P1Y",
              "importName": "OECDRegionalDemography",
              "provenanceDomain": "oecd.org"
            },
            {
              "val": {
                "2012": 1431252,
                "2013": 1439862,
                ...
                "2018": 1468412,
                "2011": 1421287
              },
              "measurementMethod": "CensusACS5yrSurvey",
              "importName": "CensusACS5YearSurvey",
              "provenanceDomain": "census.gov"
            }
          ]
        },
        "Count_Person_Female": {
          "placeName": "Arkansas",
          "sourceSeries": [
            {
              "val": {
                "2015": 1510240,
                "2003": 1391910,
                ...
                "2007": 1450310,
                "2013": 1501980
              },
              "measurementMethod": "OECDRegionalStatistics",
              "observationPeriod": "P1Y",
              "importName": "OECDRegionalDemography",
              "provenanceDomain": "oecd.org"
            },
            {
              "val": {
                "2018": 1522259,
                "2011": 1474641,
                ...
                "2016": 1511778,
                "2017": 1516293
              },
              "measurementMethod": "CensusACS5yrSurvey",
              "importName": "CensusACS5YearSurvey",
              "provenanceDomain": "census.gov"
            }
          ]
        }
      }
    },
    "geoId/06085": {
      "statVarData": {
        "Count_Person_Male": {
          "placeName": "Santa Clara County",
          "sourceSeries": [
            {
              "val": {
                "2017": 963317,
                "2018": 970469,
                ...
                "2015": 939004,
                "2016": 949223
              },
              "measurementMethod": "CensusACS5yrSurvey",
              "importName": "CensusACS5YearSurvey",
              "provenanceDomain": "census.gov"
            }
          ]
        },
        "Count_Person_Female": {
          "placeName": "Santa Clara County",
          "sourceSeries": [
            {
              "val": {
                "2017": 947909,
                "2018": 951731,
                ...
                "2015": 929145,
                "2016": 935833
              },
              "measurementMethod": "CensusACS5yrSurvey",
              "importName": "CensusACS5YearSurvey",
              "provenanceDomain": "census.gov"
            }
          ]
        }
      }
    }
  }
}
```

The top level field `placeData` is an object keyed by a Place `dcid`, with the value
being `statVarData`. The `statVarData` data is an object keyed by a Statistical
Variable `dcid`, with the object having the following fields:

- `placeName`: the name of the place.
- `sourceSeries`: a list of time series data objects with the following fields
  - `val`: an object from date to statistical value.
  - `importName`: the import name of the observations.
  - `provenanceDomain`: the provenance domain of the observations.
  - `measurementMethod`: the measurement method of the observations, if it exists.
  - `observationPeriod`: the observation period of the observations, if it exists.
  - `unit`: the unit of the observations, if it exists.
  - `scalingFactor`: the scaling factor of the observations, if it exists.

## Error Response

Failure to specify the place in the request will result in an error response.

**Request example:**

```bash
curl -X POST 'https://api.datacommons.org/stat/all' \
-d '{ "places": [], "stat_vars": ["Count_Person_Male", "Count_Person_Female"]}'
```

**Response content example**

```json
{
  "code": 3,
  "message": "Missing required argument: places"
}
```
