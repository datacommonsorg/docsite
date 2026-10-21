---
layout: default
title: Query your data with SDMX
nav_exclude: true
noindex: true
include_scripts: /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Query data using SDMX

In addition to the [REST](https://docs.datacommons.org/api/rest/v2/) and [Python](https://docs.datacommons.org/api/python/v2/) APIs, Data Commons Platform supports a limited version of the [SDMX](https://sdmx.org/){: target="_blank"} (Statistical Data and Metadata eXchange) [version 3.0](https://sdmx.org/wp-content/uploads/SDMx_3-0-0_Major_Changes_FINAL-1_0.pdf){: target="_blank"} standard API GET requests. For Milestone 1, the equivalent of the REST Observation API is supported: you can query to discover what data is available for given entities, and to fetch time series data (observations), both single-entity and multi-entity. 

> **Note:** Currently, *only* the SDMX API can be used to query multi-entity observations. You can continue to use REST and Python for single-entity observations.

## Endpoints 

The base URL for SDMX endpoints is:

<pre>
<var>YOUR_APPLICATION_URL</var>/core/api/sdmx/v3/
</pre>

The currently supported endpoints are:

|    **API**         |    **URI path**   |    **Description**     |
|:------------------ |:----------------- |:---------------------- |
|  [Availability](https://github.com/sdmx-twg/sdmx-rest/blob/v2.0.0/doc/availability.md){: target="_blank"}  |  [/availability](#availability)  |  Gets metadata about the data  available for selected entities and variables |
|  [Data](https://github.com/sdmx-twg/sdmx-rest/blob/v2.0.0/doc/data.md){: target="_blank"}  |  [/data](#data) |  Fetches statistical observations for selected entities and variables   |


### Common parameters

All endpoints use the following parameters after the endpoint, that represent the standard SDMX parameters `context`, `agencyID`, `resourceID`, `version` and `key`, respectively:

```
dataflow/DC/DF_OBS/1.0.0/*
```

The key always uses the wildcard `*`.

## Availability

The Availability API allows you to find out what data and metadata is available for a given variable, without getting the observations. You can get a list of provenances, entities (places), and other metadata, if available.

For details on request syntax, query parameters, response format, and single-entity variable query examples, please see <https://docs.datacommons.org/api/sdmx/availability.html>. Multi-entity variable queries are provided below.

### Multi-entity variable examples

{:.no_toc}
#### Example 1: Get all the entities that have data for a specific value of a custom property

This example gets all the countries that have data about females for a multi-entity variable, `who:Ratio_CigaretteSmoking_Adults_ByGender`. This variable is defined with 2 custom properties:` country` and `gender`.

{:.no_toc}
##### Request

<pre>
curl -g "https://<var>APPLICATION_URL</var>/core/api/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/country?c[variableMeasured]=who:Ratio_CigaretteSmoking_Adults_ByGender&c[gender]=Female"
</pre>

{:.no_toc}
##### Response

```json
{
   "data" : {
      "dataConstraints" : [
         {
            "agencyID" : "DC",
            "cubeRegions" : [
               {
                  "include" : true,
                  "keyValues" : [
                     {
                        "id" : "country",
                        "include" : true,
                        "values" : [
                           {
                              "value" : "country/AFG"
                           },
                           {
                              "value" : "country/AGO"
                           },
                           {
                              "value" : "country/ALB"
                           },
                           {
                              "value" : "country/ARE"
                           }
                        ]
                     }
                  ]
               }
            ],
            "id" : "DF_OBS_AVAILABILITY",
            "name" : "Available DF_OBS data",
            "role" : "Actual",
            "version" : "1.0.0"
         }
      ]
   },
   "meta" : {
      "id" : "DF_OBS_AVAILABILITY",
      "prepared" : "2026-08-27T18:53:50Z",
      "schema" : "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
      "sender" : {
         "id" : "DC"
      }
   }
}
```

{:.no_toc}
#### Example 2: Get the entities that have data for a specific property, filtered by entity (place) type and parent

This example gets the countries in Europe that have data about females, for a multi-entity variable, `who:Ratio_CigaretteSmoking_Adults_ByGender`.

{:.no_toc}
##### Request

<pre>
https://<var>APPLICATION_URL</var>/core/api/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/country?c[variableMeasured]=who:Ratio_CigaretteSmoking_Adults_ByGender&c[gender]=Female&c[country.containedInPlace+]=europe&c[country.typeOf]=Country
</pre>

{:.no_toc}
##### Response

```json
{
   "data" : {
      "dataConstraints" : [
         {
            "agencyID" : "DC",
            "cubeRegions" : [
               {
                  "include" : true,
                  "keyValues" : [
                     {
                        "id" : "country",
                        "include" : true,
                        "values" : [
                           {
                              "value" : "country/ALB"
                           }
                        ]
                     }
                  ]
               }
            ],
            "id" : "DF_OBS_AVAILABILITY",
            "name" : "Available DF_OBS data",
            "role" : "Actual",
            "version" : "1.0.0"
         }
      ]
   },
   "meta" : {
      "id" : "DF_OBS_AVAILABILITY",
      "prepared" : "2026-08-27T18:54:47Z",
      "schema" : "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
      "sender" : {
         "id" : "DC"
      }
   }
}
```

## Data

The Data API returns actual observations for specific variables, filtered by various criteria. 

For details on request syntax, query parameters, response format, and single-entity variable query examples, please see <https://docs.datacommons.org/api/sdmx/data.html>. Multi-entity variable queries are provided below.

### Multi-entity variable query examples

{:.no_toc}
#### Example 1: Get all the observations for 1 variable for 1 entity (place) 

This example gets all observations for Albania, for a multi-entity variable `who:Ratio_CigaretteSmoking_Adults_ByGender`.

{:.no_toc}
##### Request

<pre>
curl -g "https://<var>APPLICATION_URL</var>/core/api/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?c[variableMeasured]=who:Ratio_CigaretteSmoking_Adults_ByGender&c[country]=country/ALB"
</pre>

{:.no_toc}
##### Response

```csv
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,country,gender,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,who:Ratio_CigaretteSmoking_Adults_ByGender,country/ALB,Female,NotApplicable,NotApplicable,NotApplicable,UN_WHO,2018,4.5,,13905847005863890490
dataflow,DC:DF_OBS(1.0.0),I,who:Ratio_CigaretteSmoking_Adults_ByGender,country/ALB,Male,NotApplicable,NotApplicable,NotApplicable,UN_WHO,2018,35.7,,13905847005863890490
```

{:.no_toc}
#### Example 2: Get all the observations for a specific property for 2 entities (places)

This example gets all observations about females in Albania, for a multi-entity variable `who:Ratio_CigaretteSmoking_Adults_ByGender`.

{:.no_toc}
##### Request

<pre>
curl -g "https://<var>APPLICATION_URL</var>/core/api/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?c[variableMeasured]=who:Ratio_CigaretteSmoking_Adults_ByGender&c[country]=country/ALB&c[gender]=Female"
</pre>

{:.no_toc}
##### Response

```csv
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,country,gender,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,who:Ratio_CigaretteSmoking_Adults_ByGender,country/ALB,Female,NotApplicable,NotApplicable,NotApplicable,UN_WHO,2018,4.5,,13905847005863890490
```

{:.no_toc}
#### Example 3: Get all the observations for females for places of a specific type and parent

This example gets all observations about women in European countries, for a multi-entity variable `who:Ratio_CigaretteSmoking_Adults_ByGender`.

{:.no_toc}
##### Request

<pre>
curl -g "https://<var>APPLICATION_URL</var>/core/api/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?c[variableMeasured]=who:Ratio_CigaretteSmoking_Adults_ByGender&c[country.containedInPlace+]=europe&c[country.typeOf]=Country&c[gender]=Female"
</pre>

{:.no_toc}
##### Response

```csv
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,country,gender,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,who:Ratio_CigaretteSmoking_Adults_ByGender,country/ALB,Female,NotApplicable,NotApplicable,NotApplicable,UN_WHO,2018,4.5,,13905847005863890490
```