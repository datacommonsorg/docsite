---
layout: default
title: Migrate from V1 to V2
nav_order: 7
parent: REST (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Migrate from REST API V1 to V2

The Data Commons [REST API V2](index.md) is significantly different from V1. This document summarizes the important differences that you should be aware of and provides examples of translating queries from V1 to V2.

* TOC
{:toc}

## Summary of changes 

| Feature | V1 | V2 |
|---------|----|----|
| API key | Not required | Required; get from <apikeys.datacommons.com> |
| Custom Data Commons supported | No | Yes |
| Base URL | https://api.datacommons.org/v1/ | https://api.datacommons.org/v2/ |
| Service endpoints | 12 endpoints + 12 bulk versions of each | 4 endpoints |
| Parameters | Path and query parameters used; order of parameters matters for path parameters | Only query parameters used; order of parameters does not matter |
| Simple vs. bulk query | Every endpoint has an equivalent "bulk" version | No separate endpoints for bulk requests |
| APIs for graph exploration | Multiple endpoints: `triples`, `properties`, `property/values`, `property/values/in/linked` and corresponding `bulk` versions | Single endpoint `node` with `property` parameter and [relation expressions](/api/rest/v2/index.md#relation-expressions) |
| APIs for node information |  Multiple endpoints: `find/entities`, `info/place`, `info/variable`, `info/variable-group` and `bulk` versions |  Endpoint `node` with `property` parameter and `resolve` endpoint for place DCIDs |
| APIs for statistical observations | Endpoints `observations/series` and `observations/point` and `bulk` versions | Single endpoint `observation` | 
| APIs for statistical variables | Endpoint `variables` and `bulk` equivalent | Endpoint `node` with `property` parameter and relation expressions |
| SPARQL API | Endpoint `query` | Endpoint `sparql` |
| HTTP requests | POST requests supported for some bulk endpoints | POST requests supported for all endpoints | 

## Examples

The following examples show equivalent API queries and responses using V1 and V2, using GET requests. (POST requests are also supported in V2 for all queries.)

### Example 1: Find the DCID of a place

This queries for the DCID of "Georgia". Here the `find/entities` endpoint is replaced by the `resolve` endpoint. Note the use of the required `->dcid` expression at the end of the `resolve` request. Also note the different structure of the response.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/find/entities?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&description=Georgia'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Georgia&property=%3C-description-%3Edcid'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
  "dcids": [
    "geoId/13",
    "country/GEO",
    "geoId/5027700"
  ]
}
```
{% endtab %}
{% tab response V2 response %}

```json
{
  "entities": [
    {
      "node": "Georgia",
      "resolvedIds": [
        "geoId/13",
        "country/GEO",
        "geoId/5027700"
      ],
      "candidates": [
        {
          "dcid": "geoId/13"
        },
        {
          "dcid": "country/GEO"
        },
        {
          "dcid": "geoId/5027700"
        }
      ]
    }
  ]
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 2: Find the DCID of a place, with a type

This queries for the DCIDs of "Georgia", specifying that we want the country. In V2, we use the `{typeOf:Country}` expression to limit results to a specified type, in this case, `Country`.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/find/entities?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&description=Georgia&type=Country'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/resolve?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Georgia&property=<-description{typeOf:Country}->dcid'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
  "dcids": [
    "country/GEO"
  ]
}
```
{% endtab %}
{% tab response V2 response %}

```json
{
  "entities": [
    {
      "node": "Georgia",
      "resolvedIds": [
        "country/GEO"
      ],
      "candidates": [
        {
          "dcid": "country/GEO"
        }
      ]
    }
  ]
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 3: Get information on a single place

Get basic information about New York City (DCID: `geoId/3651000`). In this example, the `info/place` endpoint is replaced by the `node` endpoint. In V2 all properties are considered "outgoing" nodes of a given node; the direction is indicated by an arrow symbol (`->`). Multiple properties are specified in the `node` endpoint using a bracketed array.

The V2 query does not exactly match the V1 query, and this is reflected in the different response fields.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/info/place/geoId/3651000?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}

{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId/3651000&property=->[dcid,name,property,typeOf,containedInPlace]'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
  "entity": "geoId/3651000",
  "info":
  {
    "self":
    {
      "dcid": "geoId/3651000",
      "name": "New York",
      "type": "City"
    },
    "parents":
    [
      {
        "dcid": "geoId/36085",
        "name": "Richmond County",
        "type": "County"
      },
      {
        "dcid": "geoId/36081",
        "name": "Queens",
        "type": "County"
      },
      {
        "dcid": "geoId/36061",
        "name": "Manhattan",
        "type": "County"
      },
      {
        "dcid": "geoId/36047",
        "name": "Brooklyn",
        "type": "County"
      },
      {
        "dcid": "geoId/36005",
        "name": "Bronx County",
        "type": "County"
      },
      {
        "dcid": "geoId/36",
        "name": "New York",
        "type": "State"
      },
      {
        "dcid": "geoId/3651000",
        "name": "New York",
        "type": "City"
      },
      {
        "dcid": "usc/MiddleAtlanticDivision",
        "name": "Middle Atlantic Division",
        "type": "CensusDivision"
      },
      {
        "dcid": "country/USA",
        "name": "United States",
        "type": "Country"
      },
      {
        "dcid": "usc/NortheastRegion",
        "name": "Northeast Region"
      },
      {
        "dcid": "northamerica",
        "name": "North America",
        "type": "Continent"
      },
      {
        "dcid": "Earth",
        "name": "Earth",
        "type": "Place"
      }
    ]
  }
}
```
{% endtab %}

{% tab response V2 response %}

```json
{
   "data" : {
      "geoId/3651000" : {
         "arcs" : {
            "containedInPlace" : {
               "nodes" : [
                  {
                     "dcid" : "geoId/36",
                     "name" : "New York",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "AdministrativeArea1",
                        "State"
                     ]
                  },
                  {
                     "dcid" : "geoId/36005",
                     "name" : "Bronx County",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "County"
                     ]
                  },
                  {
                     "dcid" : "geoId/36047",
                     "name" : "Brooklyn",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "County"
                     ]
                  },
                  {
                     "dcid" : "geoId/36061",
                     "name" : "Manhattan",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "County"
                     ]
                  },
                  {
                     "dcid" : "geoId/36081",
                     "name" : "Queens",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "County"
                     ]
                  },
                  {
                     "dcid" : "geoId/36085",
                     "name" : "Richmond County",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "County"
                     ]
                  }
               ]
            },
            "name" : {
               "nodes" : [
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "New York City"
                  },
                  {
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "value" : "New York"
                  }
               ]
            },
            "typeOf" : {
               "nodes" : [
                  {
                     "dcid" : "City",
                     "name" : "City",
                     "provenanceId" : "dc/base/WikidataOtherIdGeos",
                     "types" : [
                        "Class",
                        "LocationClassificationEnum"
                     ]
                  }
               ]
            }
         }
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 4: Get variables for an entity

Get all the statistical variables associated with the city of Hagåtña, the capital of Guam. (DCID: `wikidataId/Q30988`). In this example the `variables` endpoint is replaced by the `observation` endpoint, with a `select=entity` and `select=variable` indicating that no observations need to be returned.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/variables/wikidataId/Q30988'
```
{% endtab %}

{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&entity.dcids=wikidataId/Q30988&select=entity&select=variable'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
  "entity": "wikidataId/Q30988",
  "variables": [
    "Count_Person",
    "Max_Rainfall",
    "Max_Snowfall",
    "Max_Temperature",
    "Mean_BarometricPressure",
    "Mean_Rainfall",
    "Mean_Snowfall",
    "Mean_Temperature",
    "Mean_Visibility",
    "Min_Rainfall",
    "Min_Snowfall",
    "Min_Temperature"
  ]
}
```
{% endtab %}

{% tab response V2 response %}

```json
{
   "byVariable" : {
      "Count_Person" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Count_Person_Female" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Count_Person_Male" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Humidity_RelativeHumidity" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Rainfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Snowfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Temperature" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_BarometricPressure" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Humidity_RelativeHumidity" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Rainfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Snowfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Temperature" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Visibility" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Min_Rainfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Min_Snowfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Min_Temperature" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 5: Get places contained in other places

Get all states in India (DCID: `country/IND`). In this example, the `property/values` endpoint is replaced by the `node` endpoint, and the edge directions `in` and `out` are replaced by the arrow symbols `<-` and `->`.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/property/values/in/linked/country/IND/containedInPlace?value_node_type=State&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=country%2FIND&property=%3C-containedInPlace%2B%7BtypeOf%3AState%7D'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```jsonc
{
   "values" : [
      {
         "dcid" : "wikidataId/Q1061",
         "name" : "Gujarat"
      },
      {
         "dcid" : "wikidataId/Q1159",
         "name" : "Andhra Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1162",
         "name" : "Arunachal Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1164",
         "name" : "Assam"
      },
      {
         "dcid" : "wikidataId/Q1165",
         "name" : "Bihar"
      },
      {
         "dcid" : "wikidataId/Q1168",
         "name" : "Chhattisgarh"
      },
      {
         "dcid" : "wikidataId/Q1171",
         "name" : "Goa"
      },
      {
         "dcid" : "wikidataId/Q1174",
         "name" : "Haryana"
      },
      {
         "dcid" : "wikidataId/Q1177",
         "name" : "Himachal Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1184",
         "name" : "Jharkhand"
      },
      {
         "dcid" : "wikidataId/Q1185",
         "name" : "Karnataka"
      },
      {
         "dcid" : "wikidataId/Q1186",
         "name" : "Kerala"
      },
      {
         "dcid" : "wikidataId/Q1188",
         "name" : "Madhya Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1191",
         "name" : "Maharashtra"
      },
      {
         "dcid" : "wikidataId/Q1193",
         "name" : "Manipur"
      },
      {
         "dcid" : "wikidataId/Q1195",
         "name" : "Meghalaya"
      },
      // -- truncated --
      {
         "dcid" : "wikidataId/Q677037",
         "name" : "Telangana"
      }
   ]
}
```
{% endtab %}
{% tab response V2 response %}

```jsonc
{
   "data" : {
      "country/IND" : {
         "arcs" : {
            "containedInPlace+" : {
               "nodes" : [
                  {
                     "dcid" : "wikidataId/Q1061",
                     "name" : "Gujarat"
                  },
                  {
                     "dcid" : "wikidataId/Q1159",
                     "name" : "Andhra Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1162",
                     "name" : "Arunachal Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1164",
                     "name" : "Assam"
                  },
                  {
                     "dcid" : "wikidataId/Q1165",
                     "name" : "Bihar"
                  },
                  {
                     "dcid" : "wikidataId/Q1168",
                     "name" : "Chhattisgarh"
                  },
                  {
                     "dcid" : "wikidataId/Q1171",
                     "name" : "Goa"
                  },
                  {
                     "dcid" : "wikidataId/Q1174",
                     "name" : "Haryana"
                  },
                  {
                     "dcid" : "wikidataId/Q1177",
                     "name" : "Himachal Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1184",
                     "name" : "Jharkhand"
                  },
                  {
                     "dcid" : "wikidataId/Q1185",
                     "name" : "Karnataka"
                  },
                  {
                     "dcid" : "wikidataId/Q1186",
                     "name" : "Kerala"
                  },
                  {
                     "dcid" : "wikidataId/Q1188",
                     "name" : "Madhya Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1191",
                     "name" : "Maharashtra"
                  },
                  {
                     "dcid" : "wikidataId/Q1193",
                     "name" : "Manipur"
                  },
                  {
                     "dcid" : "wikidataId/Q1195",
                     "name" : "Meghalaya"
                  },
                  //-- truncated --
                  {
                     "dcid" : "wikidataId/Q677037",
                     "name" : "Telangana"
                  }
               ]
            }
         }
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 6: Get nodes of outgoing edges

Get nodes connected to the node representing Carbon Dioxide (DCID: `CarbonDioxide`), where edges point away from the node for Carbon Dioxide (also known as "properties"). Here the `triples` endpoint is replaced by the `node` endpoint, and the `out` direction is replaced by the arrow symbol (`->`).

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/triples/out/CarbonDioxide?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=CarbonDioxide&property=-%3E*'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
   "triples" : {
      "description" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "A colorless gas consisting of a carbon atom covalently double bonded to two oxygen atoms."
            }
         ]
      },
      "descriptionUrl" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "https://en.wikipedia.org/wiki/Carbon_dioxide"
            }
         ]
      },
      "epaPollutantCode" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "CO2"
            }
         ]
      },
      "name" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "Carbon Dioxide (CO2)"
            },
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "Carbon Dioxide"
            },
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "CarbonDioxide"
            }
         ]
      },
      "provenance" : {
         "nodes" : [
            {
               "dcid" : "dc/base/BaseSchema",
               "name" : "BaseSchema",
               "provenanceId" : "dc/base/BaseSchema",
               "types" : [
                  "Provenance"
               ]
            }
         ]
      },
      "typeOf" : {
         "nodes" : [
            {
               "dcid" : "GasType",
               "name" : "GasType",
               "provenanceId" : "dc/base/BaseSchema",
               "types" : [
                  "Class"
               ]
            },
            {
               "dcid" : "GreenhouseGas",
               "name" : "GreenhouseGas",
               "provenanceId" : "dc/base/BaseSchema",
               "types" : [
                  "Class"
               ]
            }
         ]
      }
   }
}
```
{% endtab %}

{% tab response V1 response %}

```json
{
  "data": {
    "CarbonDioxide": {
      "arcs": {
        "description": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "A colorless gas consisting of a carbon atom covalently double bonded to two oxygen atoms."
            }
          ]
        },
        "descriptionUrl": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "https://en.wikipedia.org/wiki/Carbon_dioxide"
            }
          ]
        },
        "epaPollutantCode": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "CO2"
            }
          ]
        },
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "Carbon Dioxide (CO2)"
            },
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "Carbon Dioxide"
            },
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "CarbonDioxide"
            }
          ]
        },
        "provenance": {
          "nodes": [
            {
              "name": "BaseSchema",
              "types": [
                "Provenance"
              ],
              "dcid": "dc/base/BaseSchema",
              "provenanceId": "dc/base/BaseSchema"
            }
          ]
        },
        "typeOf": {
          "nodes": [
            {
              "name": "GasType",
              "types": [
                "Class"
              ],
              "dcid": "GasType",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "GreenhouseGas",
              "types": [
                "Class"
              ],
              "dcid": "GreenhouseGas",
              "provenanceId": "dc/base/BaseSchema"
            }
          ]
        }
      }
    }
  }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 7: Get latest observations for a given variable and entity

This example gets the population count (DCID: `Count_Person` ) for the United States of America (DCID: `country/USA` ), with only the latest observation returned for each dataset in which the variable is present

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/point/country/USA/Count_Person?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country/USA&select=entity&select=variable&select=value&select=date'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V2 response %}

```json
{
  "date": "2024",
  "value": 340110988,
  "metadata": {
    "importName": "USCensusPEP_Annual_Population",
    "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
    "measurementMethod": "CensusPEPSurvey",
    "observationPeriod": "P1Y"
  }
}
```
{% endtab %}
{% tab response V2 response %}

```json
{
  "byVariable": {
    "Count_Person": {
      "byEntity": {
        "country/USA": {
          "orderedFacets": [
            {
              "facetId": "2176550201",
              "observations": [
                {
                  "date": "2024",
                  "value": 340110988
                }
              ],
              "obsCount": 1,
              "earliestDate": "2024",
              "latestDate": "2024"
            },
            {
              "facetId": "2645850372",
              "observations": [
                {
                  "date": "2023",
                  "value": 335642425
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1145703171",
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1541763368",
              "observations": [
                {
                  "date": "2020",
                  "value": 331449281
                }
              ],
              "obsCount": 1,
              "earliestDate": "2020",
              "latestDate": "2020"
            },
            {
              "facetId": "3981252704",
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1151455814",
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "4181918134",
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "10983471",
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "196790193",
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1964317807",
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ],
              "obsCount": 1,
              "earliestDate": "2021",
              "latestDate": "2021"
            },
            {
              "facetId": "217147238",
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ],
              "obsCount": 1,
              "earliestDate": "2021",
              "latestDate": "2021"
            },
            {
              "facetId": "2825511676",
              "observations": [
                {
                  "date": "2020",
                  "value": 329484123
                }
              ],
              "obsCount": 1,
              "earliestDate": "2020",
              "latestDate": "2020"
            },
            {
              "facetId": "2517965213",
              "observations": [
                {
                  "date": "2019",
                  "value": 328239523
                }
              ],
              "obsCount": 1,
              "earliestDate": "2019",
              "latestDate": "2019"
            },
            {
              "facetId": "1226172227",
              "observations": [
                {
                  "date": "2019",
                  "value": 328239523
                }
              ],
              "obsCount": 1,
              "earliestDate": "2019",
              "latestDate": "2019"
            }
          ]
        }
      }
    }
  },
  "facets": {
    "1145703171": {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS5yrSurvey"
    },
    "1226172227": {
      "importName": "CensusACS1YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS1yrSurvey"
    },
    "1964317807": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S0101",
      "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "3981252704": {
      "importName": "WorldDevelopmentIndicators",
      "provenanceUrl": "https://datacatalog.worldbank.org/dataset/world-development-indicators/",
      "observationPeriod": "P1Y"
    },
    "2517965213": {
      "importName": "CensusPEP",
      "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html",
      "measurementMethod": "CensusPEPSurvey"
    },
    "2645850372": {
      "importName": "CensusACS5YearSurvey_AggCountry",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey",
      "isDcAggregate": true
    },
    "2825511676": {
      "importName": "CDC_Mortality_UnderlyingCause",
      "provenanceUrl": "https://wonder.cdc.gov/ucd-icd10.html"
    },
    "10983471": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "2176550201": {
      "importName": "USCensusPEP_Annual_Population",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    },
    "1151455814": {
      "importName": "OECDRegionalDemography",
      "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "1541763368": {
      "importName": "USDecennialCensus_RedistrictingRelease",
      "provenanceUrl": "https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html",
      "measurementMethod": "USDecennialCensus"
    },
    "196790193": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2602",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "217147238": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2603",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2603&tid=ACSST5Y2019.S2603",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "4181918134": {
      "importName": "OECDRegionalDemography_Population",
      "provenanceUrl": "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    }
  }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 8: Get a single observation at a specific date, for a given variable and entity

Get the annual electricity generation (DCID: `Annual_Generation_Electricity` ) of California (DCID: `geoId/06` ) in 2018.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/point/geoId/06/Annual_Generation_Electricity?date=2018&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2018&variable.dcids=Annual_Generation_Electricity&entity.dcids=geoId/06&select=entity&select=variable&select=value&select=date'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
 {
   "date": "2018",
   "value": 195465638180,
   "facet": {
     "importName": "EIA_Electricity",
     "provenanceUrl": "https://www.eia.gov/opendata/qb.php?category=0",
     "unit": "KilowattHour"
   }
 }
}
```
{% endtab %}

{% tab response V2 response %}

```json
{
   "byVariable" : {
      "Annual_Generation_Electricity" : {
         "byEntity" : {
            "geoId/06" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2018",
                     "facetId" : "2392525955",
                     "latestDate" : "2018",
                     "obsCount" : 1,
                     "observations" : [
                        {
                           "date" : "2018",
                           "value" : 195465638180
                        }
                     ]
                  }
               ]
            }
         }
      }
   },
   "facets" : {
      "2392525955" : {
         "importName" : "EIA_Electricity",
         "provenanceUrl" : "https://www.eia.gov/opendata/qb.php?category=0",
         "unit" : "KilowattHour"
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>