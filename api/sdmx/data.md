---
layout: default
title: Get statistical observations
nav_order: 3
parent: SDMX 3.0
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# /data

* TOC
{:toc}

The Data API returns actual observations for specific variables, filtered by various criteria.

## Request syntax

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=<var>YOUR_API_KEY</var>&c[variableMeasured]=<var>VARIABLE_DCIDS</var>&c[<var>OBSERVATION_FIELD</var>]=<var>ENTITY_DCIDS</var>&...&c[TIME_PERIOD]=<var>DATES</var>|LATEST
</div>

> **Note**: A single entity or variable may be associated with multiple [_facets_](/glossary.html#facet). By default, a query returns all available facets. This means that your results may be a mixed set of observations, potentially combining data from various sources or using different measurement methods. To ensure consistency and restrict your query to a specific facet, you must use observation filters, described below.


### Query parameters

| Parameter | Description | Valid values |
| --------- | ----------- | ------------ |
| variableMeasured <br/><required-tag>Required</required-tag> | The statistical variable(s) for which you are retrieving observations. | Comma-separated list of statistical variable DCIDs. |
| <var>OBSERVATION_FIELD</var><br/><required-tag>Required</required-tag> | One or more properties by which to filter observations for the selected variable(s). If you have specified multiple values for `variableMeasured`, you must specify the same observation property filters for all.<br/><br/>Multiple filter properties are ANDed together.<br/><br/>Supported properties are:<br/>- `observationAbout`: Return observations for the selected entities/places. Use this for single-entity statistical variables. For place entities, you can further refine this with `containedInPlace+` and `typeOf` as filters. See below for examples.<br/>- Custom `observationProperties` dimension: Return observations for the selected custom properties. Use this for multi-entity variables. Up to 3 properties are supported. For custom properties representing place types, you can further refine this with `containedInPlace+` and `typeOf`. See below for examples. | Comma-separated list of DCID values for the selected observation property. |
| <var>OBSERVATION_FIELD</var><br/><optional-tag>Optional</optional-tag> | Any of the observation fields listed above, plus facet fields:<br/>- `provenance`: Return observations for the selected provenance(s) only.<br/>- `unit`: Return observations for the specified unit(s) only.<br/>- `measurementMethod`: Return observations that use the specified measurement(s) only.<br/>- `observationPeriod`: Return observations that use the specified observation period(s) only.<br/>-  | - For `observationAbout`, custom observation properties, and `provenance`: comma-separated list of DCID values for the selected observation property. <br/>- For all others: see the [Glossary](/glossary.html) entries for each property.<br/><br/>Each value applies to all variables specified in the `variableMeasured` parameter.

| TIME_PERIOD <br/><optional-tag>Optional</optional-tag> | Filter observations by a specific time period. If not specified, all observations are returned. | Comma-separated dates, in the format <var>YYYY</var>, <var>YYYY</var>-<var>MM</var>, or <var>YYYY</var>-<var>MM</var>-<var>DD</var>, or the constant `LATEST`. |
{: .doc-table }

At this time, the following parameters are accepted but redundant:

*  `measures`: only the default `all` is supported
*  `dimensions`: only the default `dsd` is supported
*  `format`: only `csv` is supported

Explicit SDMX operators, including `eq:`, are not currently supported. Unprefixed values use equality semantics.

### Response format

The Data API returns responses in SDMX-CSV 2.0.0 format. It looks like this:

{: .response-signature .scroll}
<pre>
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId<br/>
dataflow,DC:DF_OBS(1.0.0),I,<var>VARIABLE_NAME1</var>,<var>ENTITY_NAME1</var>,<var>UNIT</var>,<var>MEASUREMENT_METHOD</var>,<var>OBSERVATION_PERIOD</var>,<var>PROVENANCE</var>,<var>DATE</var>,<var>OBSERVATION_VALUE</var>,<var>SCALING_FACTOR</var>,<var>FACET_ID</var>
...
</pre>

All matching facets are returned. For any of the optional observation properties, if they are empty in the result observations, `NotApplicable` is returned. For `scalingFactor` only, a blank value is left empty.

If you run your query in a browser, the response will automatically be downloaded as a CSV file called `dc_data.csv`.

## Examples

### Example 1: Get the latest observations for a single entity (place) and variable

In this example, we get all the latest population observations for one country, Canada. 

Parameters:
{: .example-box-title}

```
variableMeasured: Count_Person
observationAbout: country/CAN
TIME_PERIOD: LATEST
```

GET Request:
{: .example-box-title}

```bash
curl -g 'https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person&c[observationAbout]=country/CAN&c[TIME_PERIOD]=LATEST'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

Notice that there are 5 results, from 5 different facets/provenances.

```
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/CAN,NotApplicable,NotApplicable,NotApplicable,dc/base/CanadaStatistics,2021,3.6991981E7,,1104649421802747921
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/CAN,NotApplicable,WikidataPopulation,NotApplicable,dc/base/WikidataPopulation,2023-06-16,4.0E7,,12850099660527362240
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/CAN,NotApplicable,OECDRegionalStatistics,P1Y,dc/base/OECDRegionalDemography_Population,2023,4.0083484E7,,17272542113939416525
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/CAN,NotApplicable,NotApplicable,P1Y,dc/base/WorldDevelopmentIndicators,2024,4.1288599E7,,18369491376878146239
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/CAN,NotApplicable,NotApplicable,NotApplicable,dc/base/CanadaStatisticsAgeGender,2025,4.1651653E7,,6982086132363904937
```
{: .example-box-content .scroll}


### Example 2: Get the observations for a single variable for selected entities at a particular date

This example gets observations for the median income of households in the U.S.A. and California in 2015. 

Parameters:
{: .example-box-title}

```
variableMeasured: Median_Income_Household
observationAbout: country/USA,geoId/06
TIME_PERIOD: 2015
```

GET Request:
{: .example-box-title}

```bash
curl -g 'https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Median_Income_Household&c[observationAbout]=country/USA,geoId/06&c[TIME_PERIOD]=2015'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

Notice that the results have `unit` and `measurementMethod` specified.

```
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,Median_Income_Household,country/USA,InflationAdjustedUSD_CurrentYear,CensusACS5yrSurveySubjectTable,NotApplicable,dc/base/CensusACS5YearSurvey_SubjectTables_S1901,2015,53889.0,,15832129482359323476
dataflow,DC:DF_OBS(1.0.0),I,Median_Income_Household,geoId/06,USDollar,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2015,61818.0,,13552995955493664191
dataflow,DC:DF_OBS(1.0.0),I,Median_Income_Household,geoId/06,InflationAdjustedUSD_CurrentYear,CensusACS5yrSurveySubjectTable,NotApplicable,dc/base/CensusACS5YearSurvey_SubjectTables_S1901,2015,61818.0,,15832129482359323476
```
{: .example-box-content .scroll}


### Example 3: Get all observations for a single variable for multiple entities

This example gets all observations for populations with doctoral degrees in the states of Wisconsin and Minnesota, represented by statistical variable  [`Count_Person_EducationalAttainmentDoctorateDegree`](https://datacommons.org/browser/Count_Person_EducationalAttainmentDoctorateDegree){: target="_blank"}. We don't specify any time period so that we get all results.

Parameters:
{: .example-box-title}

```
variableMeasured: Count_Person_EducationalAttainmentDoctorateDegree
observationAbout: geoId/55,geoId/27
```

GET Request:
{: .example-box-title}

```bash
curl -g 'https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person_EducationalAttainmentDoctorateDegree&c[observationAbout]=geoId/55,geoId/27'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,65606.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2023,63794.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2022,60300.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2021,58452.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2020,56170.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2019,55185.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2018,54303.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2017,52737.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2016,50039.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2015,47323.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2014,44713.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2013,42511.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/27,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2012,40961.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,57554.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2023,55286.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2022,53667.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2021,52306.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2020,49385.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2019,47496.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2018,46071.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2017,43737.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2016,42590.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2015,41387.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2014,40133.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2013,38711.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person_EducationalAttainmentDoctorateDegree,geoId/55,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2012,38052.0,,10169881228856630405
```
{: .example-box-content .scroll}


### Example 4: Get the latest observations for all places of a specific type and parent

In this example, we get the latest population counts for all counties in California. We use `containedInPlace+` and `typeOf` filters to specify "all contained places in California of type `County`".

Parameters:
{: .example-box-title}

```
variableMeasured: Count_Person
observationAbout.containedInPlace+: geoId/06
observationAbout.typeOf: County
TIME_PERIOD: LATEST
```

GET Request:
{: .example-box-title}

Note that you must URL-encode the `+` sign for this query to work.

```bash
curl -g 'https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person&c[observationAbout.containedInPlace%2B]=geoId/06&c[observationAbout.typeOf]=County&c[TIME_PERIOD]=LATEST'

```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1649473.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,WikidataPopulation,NotApplicable,dc/base/WikidataPopulation,2020-04-01,1682353.0,,12850099660527362240
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusACS1yrSurvey,NotApplicable,dc/base/CensusACS1YearSurvey,2019,1671329.0,,13416927381164846384
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusPEPSurvey_Race2000Onwards,P1Y,dc/base/USCensusPEP_AgeSexRaceHispanicOrigin,2025,1636630.0,,14093155135365882025
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusPEPSurvey,NotApplicable,dc/base/CensusPEP,2019,1671329.0,,14435771550254800935
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Social_Vulnerability_Index,2022,1663823.0,,15599275028738990790
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusACS5yrSurveySubjectTable,NotApplicable,dc/base/CensusACS5YearSurvey_SubjectTables_S0101,2024,1649473.0,,16559184819460950966
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,USDecennialCensus,NotApplicable,dc/base/USDecennialCensus_RedistrictingRelease,2020,1682353,,17850603903953452338
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Mortality_UnderlyingCause,2020,1662323.0,,2106285324970141774
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusPEPSurvey,P1Y,dc/base/USCensusPEP_Annual_Population,2025,1636630.0,,8912910856362438925
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1616.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,WikidataPopulation,NotApplicable,dc/base/WikidataPopulation,2020-04-01,1204.0,,12850099660527362240
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,CensusPEPSurvey_Race2000Onwards,P1Y,dc/base/USCensusPEP_AgeSexRaceHispanicOrigin,2025,1043.0,,14093155135365882025
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,CensusPEPSurvey,NotApplicable,dc/base/CensusPEP,2018,1101.0,,14435771550254800935
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Social_Vulnerability_Index,2022,1515.0,,15599275028738990790
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,CensusACS5yrSurveySubjectTable,NotApplicable,dc/base/CensusACS5YearSurvey_SubjectTables_S0101,2024,1616.0,,16559184819460950966
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,USDecennialCensus,NotApplicable,dc/base/USDecennialCensus_RedistrictingRelease,2020,1204,,17850603903953452338
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Mortality_UnderlyingCause,2020,1119.0,,2106285324970141774
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,CensusPEPSurvey,P1Y,dc/base/USCensusPEP_Annual_Population,2025,1043.0,,8912910856362438925
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,41428.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,WikidataPopulation,NotApplicable,dc/base/WikidataPopulation,2020-04-01,40474.0,,12850099660527362240
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,CensusPEPSurvey_Race2000Onwards,P1Y,dc/base/USCensusPEP_AgeSexRaceHispanicOrigin,2025,41876.0,,14093155135365882025
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,CensusPEPSurvey,NotApplicable,dc/base/CensusPEP,2018,39383.0,,14435771550254800935
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Social_Vulnerability_Index,2022,40577.0,,15599275028738990790
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,CensusACS5yrSurveySubjectTable,NotApplicable,dc/base/CensusACS5YearSurvey_SubjectTables_S0101,2024,41428.0,,16559184819460950966
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,USDecennialCensus,NotApplicable,dc/base/USDecennialCensus_RedistrictingRelease,2020,40474,,17850603903953452338
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Mortality_UnderlyingCause,2020,40083.0,,2106285324970141774
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,CensusPEPSurvey,P1Y,dc/base/USCensusPEP_Annual_Population,2025,41876.0,,8912910856362438925
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,207929.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,WikidataPopulation,NotApplicable,dc/base/WikidataPopulation,2020-04-01,211632.0,,12850099660527362240
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,CensusACS1yrSurvey,NotApplicable,dc/base/CensusACS1YearSurvey,2019,219186.0,,13416927381164846384
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,CensusPEPSurvey_Race2000Onwards,P1Y,dc/base/USCensusPEP_AgeSexRaceHispanicOrigin,2025,209211.0,,14093155135365882025
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,CensusPEPSurvey,NotApplicable,dc/base/CensusPEP,2019,219186.0,,14435771550254800935
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,NotApplicable,NotApplicable,dc/base/CDC_Social_Vulnerability_Index,2022,213605.0,,15599275028738990790
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,CensusACS5yrSurveySubjectTable,NotApplicable,dc/base/CensusACS5YearSurvey_SubjectTables_S0101,2024,207929.0,,16559184819460950966
...
```
{: .example-box-content .scroll}

### Example 5: Get the latest observations for a single entity, filtering by provenance

This example is the same as the prevous, except it filters for a single data provenance, namely the U.S. government census, represented represented as `dc/base/CensusACS5YearSurvey`.

Parameters:
{: .example-box-title}

```
variableMeasured: Count_Person
observationAbout.containedInPlace+: geoId/06
observationAbout.typeOf: County
provenance: dc/base/CensusACS5YearSurvey
TIME_PERIOD: LATEST
```

GET Request:
{: .example-box-title}

```bash
curl -g 'https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person&c[observationAbout.containedInPlace%2B]=geoId/06&c[observationAbout.typeOf]=County&c[provenance]=dc/base/CensusACS5YearSurvey&c[TIME_PERIOD]=LATEST'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06001,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1649473.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06003,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1616.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06005,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,41428.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06007,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,207929.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06009,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,46248.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06011,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,21984.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06013,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1165012.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06015,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,27107.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06017,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,192662.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06019,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1016725.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06021,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,28494.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06023,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,134541.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06025,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,180202.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06027,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,18739.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06029,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,915075.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06031,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,153298.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06033,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,68152.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06035,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,30356.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06037,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,9808667.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06039,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,160940.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06041,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,257969.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06043,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,17082.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06045,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,90244.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06047,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,290201.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06049,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,8600.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06051,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,13148.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06053,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,437613.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06055,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,134869.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06057,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,102481.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06059,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,3165820.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06061,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,419156.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06063,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,19423.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06065,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,2478600.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06067,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1594006.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06069,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,67290.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06071,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,2197104.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06073,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,3288774.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06075,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,830235.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06077,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,797334.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06079,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,281555.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06081,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,742340.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06083,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,443701.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06085,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,1902047.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06087,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,264926.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06089,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,181436.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06091,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,2746.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06093,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,43466.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06095,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,451918.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06097,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,485040.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06099,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,553990.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06101,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,98857.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06103,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,65167.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06105,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,15860.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06107,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,478693.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06109,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,54498.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06111,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,837469.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06113,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,220564.0,,10169881228856630405
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,geoId/06115,NotApplicable,CensusACS5yrSurvey,NotApplicable,dc/base/CensusACS5YearSurvey,2024,84507.0,,10169881228856630405
```
{: .example-box-content .scroll}

### Example 6: Get the latest observations for a single entity, filtering by an observation period

This example gets the latest population count of Brazil. It filters for for facets in which the observation period is `P1Y` (one year).

Parameters:
{: .example-box-title}

```
variableMeasured: Count_Person
observationAbout: country/BRA
observationPeriod: P1Y
TIME_PERIOD: LATEST
```

GET Request:
{: .example-box-title}

```bash
curl -g 'https://api.datacommons.org/sdmx/v3/data/dataflow/DC/DF_OBS/1.0.0/*?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person&c[observationAbout]=country/BRA&c[observationPeriod]=P1Y&c[TIME_PERIOD]=LATEST'
```

Response:
{: .example-box-title}

```
STRUCTURE,STRUCTURE_ID,ACTION,variableMeasured,observationAbout,unit,measurementMethod,observationPeriod,provenance,TIME_PERIOD,OBS_VALUE,scalingFactor,facetId
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/BRA,NotApplicable,OECDRegionalStatistics,P1Y,dc/base/OECDRegionalDemography_Population,2021,2.13317639E8,,17272542113939416525
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/BRA,NotApplicable,NotApplicable,P1Y,dc/base/WorldDevelopmentIndicators,2024,2.11998573E8,,18369491376878146239
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/BRA,NotApplicable,NotApplicable,P1Y,dc/base/Brazil_Census,2022,207750291,,4388214900074370414
dataflow,DC:DF_OBS(1.0.0),I,Count_Person,country/BRA,NotApplicable,WorldBankSubnationalPopulationEstimate,P1Y,dc/base/Subnational_Demographics_Stats,2016,2.07653E8,,4655208836981694294
```
{: .example-box-content .scroll}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>
