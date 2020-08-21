---
layout: default
title: Place Statistics - All
nav_order: 13
parent: REST
grand_parent: API
---

# Get a Collection of Statistical Data for Multitple Places

Returns a multiple level object containing all the time series for the given
places and statistical variables.
See the [full list of StatisticalVariables](/statistical_variables.html).

**URL**: `/stat/all`

**Method**: `POST`

**Required Arguments**:

- `places`: A list of [`Place`](https://datacommons.org/browser/Place) dcids to query for.

- `stat_vars`: A list of [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable) dcids.

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/stat/all' \
-d '{ "places": ["geoId/05", "geoId/06085"], "stat_vars": ["Count_Person_Male", "Count_Person_Female"]}'
```

## Success Response

### **Code**: `200 OK`

**Response content example**

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
                "2009": 1422520,
                "2010": 1434720,
                "2014": 1457490,
                "2001": 1315210,
                "2007": 1398340,
                "2011": 1444160,
                "2012": 1450130,
                "2013": 1453470,
                "2015": 1463310,
                "2004": 1346270,
                "2005": 1362880,
                "2006": 1383070,
                "2018": 1480140,
                "2003": 1332910,
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
                "2014": 1447235,
                "2015": 1451913,
                "2016": 1456694,
                "2017": 1461651,
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
                "2005": 1418220,
                "2009": 1474320,
                "2017": 1521170,
                "2018": 1527580,
                "2008": 1464510,
                "2010": 1484330,
                "2014": 1506080,
                "2011": 1487260,
                "2012": 1496250,
                "2016": 1515100,
                "2001": 1376360,
                "2004": 1403410,
                "2006": 1438690,
                "2002": 1382090,
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
                "2012": 1485120,
                "2013": 1493507,
                "2014": 1499801,
                "2015": 1506295,
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
                "2011": 885307,
                "2012": 898013,
                "2013": 910196,
                "2014": 924848,
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
                "2011": 877447,
                "2012": 890380,
                "2013": 902012,
                "2014": 916721,
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

The top level field `placeData` is an object keyed by place dcid, with value
being `statVarData`. The `statVarData` data is an object keyed by statistical
variable dcid, with value having the following fields:

- `placeName`: the name of the place.
- `sourceSeries`: a list of time series data with the following fields
  - `val`: an object from date to statistical value.
  - `importName`: the imoprt name of the observations.
  - `provenanceDomain`: the provenance domain of the observations.
  - `measurementMethod`: the measurement method of the observations, if exist.
  - `observationPeriod`: the observation period of the observations, if exist.
  - `unit`: the unit of the observations, if exist.
  - `scalingFactor`: the scaling factor of the observations, if exist.

## Error Response

### **Code**: `400 Bad Request`

**Request example:** (place not specified)

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
