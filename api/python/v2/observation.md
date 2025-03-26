---
layout: default
title: Get statistical observations
nav_order: 2
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Observation

The Observation API fetches statistical observations. An observation is associated with an
entity and variable at a particular date: for example, "population of USA in
2020", "GDP of California in 2010", and so on. 

> Note: This endpoint returns standard Python objects, like other endpoints. To get Pandas DataFrames results, see [Observation pandas](observation_pandas.md) which is a direct property method of the `Client` object.

* TOC
{:toc}

## Request methods

The following are the methods available for this endpoint. 

| Method | Description | 
|--------|-------------|
| [fetch](#fetch) | Fetch observations for specified variables, dates, and entities by DCID or [relation expression](/api/rest/v2/index.html#relation-expressions) |
| [fetch_observations_by_entity](#fetch_observations_by_entity) | Fetch observations for specified variables, dates and entities by DCID. |
| [fetch_observations_by_entity_type](fetch_observations_by_entity_type) | Fetch observations for specified variables and dates, by entity type and parent entity |
| [fetch_latest_observations](#fetch_latest_observations) | Fetch latest observations for specified variables, by entity DCID or [relation expression](/api/rest/v2/index.html#relation-expressions). |
| [fetch_latest_observations_by_entity](#fetch_latest_observations_by_entity) | Fetch latest observations for specified variables, by entity DCID. |


## Response

All request methods return a `ObservationResponse` object. By default, the response looks like:

<pre>
{
  "byVariable": {
    "<var>VARIABLE_DCID_1</var>": {
      "byEntity": {
        "<var>ENTITY_DCID_1</var>": {
          "orderedFacets": [
            {
              "facetId": "<var>FACET_ID</var>",
              "earliestDate" : "<var>DATE_STRING</var>", 
              "latestDate" : "<var>DATE_STRING</var>", 
              "obsCount" : "<var>NUMBER_OF_OBSERVATIONS</var>",
              "observations": [
                {
                  "date": "<var>OBSERVATION_DATE</var>",
                  "value": "<var>OBSERVATION_VALUE</var>"
                },
                ...
              ]
            },
            ...
        },
        ...
      },
      ...
    }
  "facets" {
    "<var>FACET_ID</var>": {
      "importName": "...",
      "provenanceUrl": "...",
      "measurementMethod": "...",
      "observationPeriod": "..."
    },
    ...
  }
</pre>
{: .response-signature .scroll}


There are additional methods you can call on the response to structure the data differently. See [Response property methods](#response-property-methods) for details.


### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| orderedFacets | list of objects | Metadata about the observations returned, keyed first by variable, and then by entity, such as the date range, the number of observations included in the facet etc. |
| observations | list of objects | Date and value pairs for the observations made in the time period |
| facets | object | Various properties of reported facets, where available, including the provenance of the data, etc. |
{: .doc-table}

### Response property methods

| Method | Description | 
|--------|-------------|
| to_json | Return the result as a JSON string. See [Response formatting](index.md#response-formatting) for details. |
| to_dict | Return the result as a dictionary. See [Response formatting](index.md#response-formatting) for details. |
| get_data_by_entity | Key the response data by entity rather than by variable. See xxx for examples. |
| get_observations_as_records | Get the response data as a series of flat records. See See xxx for examples. |
{: .doc-table}

## fetch

Fetches observations for the specified variables, dates, and entities. Entities can be specified by DCID or by relation expression. 

### Signature

```python
fetch(variable_dcids, date, select, entity_dcids, entity_expression)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/> <required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| date <br/><optional-tag>Optional</optional-tag> | string | The date (and time) for which the observations are being requested.By default this is set to `LATEST`, which returns the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. Other allowed values are: <br>
* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see [Find the date format for a statistical variable](/api/rest/v2/observation.html#find-date-format).<br>
* `""` - Get all observations for the specified variables and entities  |
| select <optional-tag>Optional</optional-tag> | list of strings | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`. The only other valid option is `["entity", "variable"]`, which returns no observations. This may be useful to look up the entities (places) that are associated with the selected variables. |
| entity_dcids | string or list of strings | One ore more [DCIDs](/glossary.html#dcid) of the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| entity.expression  | string | A [relation expression](/api/rest/v2/index.html#relation-expressions) that represents the entities to query. One of `entity_dcids` or `entity_expression` is required. |

{: .doc-table }

### Examples

{: #fetch_ex1}
### Example 1: Get the latest observations for a single entity

In this example, we get all the latest observations for the variable [`Count_Person`](https://datacommons.org/tools/statvar#sv=Count_Person){: target="_blank"} for the entity, the U.S.A., by its DCID ['country/USA](https://datacommons.org/browser/country/USA){: target="_blank"}. Note that in the response, there are multiple facets returned, because this variable (representing a simple population count) is used in several datasets.

Request:
{: .example-box-title}

```python
client.observation.fetch(variable_dcids="Count_Person", entity_dcids="country/USA")
```

Response:
{: .example-box-title}

```json
{
  "byVariable": {
    "Count_Person": {
      "byEntity": {
        "country/USA": {
          "orderedFacets": [
            {
              "earliestDate": "2024",
              "facetId": "2176550201",
              "latestDate": "2024",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2024",
                  "value": 340110988
                }
              ]
            },
            {
              "earliestDate": "2023",
              "facetId": "2645850372",
              "latestDate": "2023",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2023",
                  "value": 335642425
                }
              ]
            },
            {
              "earliestDate": "2023",
              "facetId": "1145703171",
              "latestDate": "2023",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ]
            },
            {
              "earliestDate": "2020",
              "facetId": "1541763368",
              "latestDate": "2020",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2020",
                  "value": 331449281
                }
              ]
            },
            {
              "earliestDate": "2023",
              "facetId": "3981252704",
              "latestDate": "2023",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ]
            },
            {
              "earliestDate": "2023",
              "facetId": "1151455814",
              "latestDate": "2023",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ]
            },
            {
              "earliestDate": "2023",
              "facetId": "4181918134",
              "latestDate": "2023",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ]
            },
            {
              "earliestDate": "2022",
              "facetId": "10983471",
              "latestDate": "2022",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2022",
                  "value": 331097593
                }
              ]
            },
            {
              "earliestDate": "2021",
              "facetId": "1964317807",
              "latestDate": "2021",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ]
            },
            {
              "earliestDate": "2021",
              "facetId": "196790193",
              "latestDate": "2021",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ]
            },
            {
              "earliestDate": "2021",
              "facetId": "217147238",
              "latestDate": "2021",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ]
            },
            {
              "earliestDate": "2020",
              "facetId": "2825511676",
              "latestDate": "2020",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2020",
                  "value": 329484123
                }
              ]
            },
            {
              "earliestDate": "2019",
              "facetId": "2517965213",
              "latestDate": "2019",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2019",
                  "value": 328239523
                }
              ]
            },
            {
              "earliestDate": "2019",
              "facetId": "1226172227",
              "latestDate": "2019",
              "obsCount": 1,
              "observations": [
                {
                  "date": "2019",
                  "value": 328239523
                }
              ]
            }
          ]
        }
      }
    }
  },
  "facets": {
    "1151455814": {
      "importName": "OECDRegionalDemography",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y",
      "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#"
    },
    "1226172227": {
      "importName": "CensusACS1YearSurvey",
      "measurementMethod": "CensusACS1yrSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"
    },
    "2645850372": {
      "importName": "CensusACS5YearSurvey_AggCountry",
      "measurementMethod": "CensusACS5yrSurvey",
      "provenanceUrl": "https://www.census.gov/"
    },
    "4181918134": {
      "importName": "OECDRegionalDemography_Population",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y",
      "provenanceUrl": "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C"
    },
    "2176550201": {
      "importName": "USCensusPEP_Annual_Population",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables"
    },
    "10983471": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
      "measurementMethod": "CensusACS5yrSurveySubjectTable",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A"
    },
    "2825511676": {
      "importName": "CDC_Mortality_UnderlyingCause",
      "provenanceUrl": "https://wonder.cdc.gov/ucd-icd10.html"
    },
    "2517965213": {
      "importName": "CensusPEP",
      "measurementMethod": "CensusPEPSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html"
    },
    "3981252704": {
      "importName": "WorldDevelopmentIndicators",
      "observationPeriod": "P1Y",
      "provenanceUrl": "https://datacatalog.worldbank.org/dataset/world-development-indicators/"
    },
    "1145703171": {
      "importName": "CensusACS5YearSurvey",
      "measurementMethod": "CensusACS5yrSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"
    },
    "1541763368": {
      "importName": "USDecennialCensus_RedistrictingRelease",
      "measurementMethod": "USDecennialCensus",
      "provenanceUrl": "https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html"
    },
    "1964317807": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S0101",
      "measurementMethod": "CensusACS5yrSurveySubjectTable",
      "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101"
    },
    "217147238": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2603",
      "measurementMethod": "CensusACS5yrSurveySubjectTable",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2603&tid=ACSST5Y2019.S2603"
    },
    "196790193": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2602",
      "measurementMethod": "CensusACS5yrSurveySubjectTable",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602"
    }
  }
}
```
{: .example-box-content .scroll}

### Example 2: Get the observations at a particular date for given entities

This gets observations for the populations of the U.S.A. and California in 2015.  It uses the same parameters as the previous request, with an additional entity, and a specific date. It also gets the results keyed by entity rather than by variable.

Request:
{: .example-box-title}

```python
client.observation.fetch(variable_dcids="Count_Person", date="2015", entity_dcids=["country/USA", "geoId/06"]).get_data_by_entity()
```

Response:
{: .example-box-title}

```json
```
{: .example-box-content .scroll}

### Example 4: Get the latest observations for entities specified by expression

In this example, we get the latest population counts for counties in California. We use a [filter expression](/api/rest/v2/#filters) to specify "all contained places in [California](https://datacommons.org/browser/geoId/06){: target="_blank"} (dcid: `geoId/06`) of
type `County`". Then we specify the `select` fields to fetch the latest observations for the variable
([`Count_Person`](https://datacommons.org/tools/statvar#sv=Count_Person){: target="_blank"}) and
entity (all counties in California).

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&date=LATEST&variable.dcids=Count_Person&entity.expression=geoId%2F06%3C-containedInPlace%2B%7BtypeOf%3ACounty%7D&select=date&select=entity&select=value&select=variable'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "expression": "geoId/06<-containedInPlace+{typeOf:County}"}, "select": ["entity", "variable", "value", "date"] }'
```

{: .example-box-content .scroll}

Response:
{: .example-box-title}

```
{
  "byVariable": {
    "Count_Person": {
      "byEntity": {
        "geoId/06003": {
          "orderedFacets": [
            {
              "facetId": "2176550201",
              "observations": [
                {
                  "date": "2021",
                  "value": 1235
                }
              ]
            },
            ...
          ]
        },
        "geoId/06009": {
          "orderedFacets": [
            {
              "facetId": "2176550201",
              "observations": [
                {
                  "date": "2021",
                  "value": 46221
                }
              ]
            },
            ...
          ]
        },
        ...
      }
    }
  },
  "facets": {
    "2176550201": {
      "importName": "USCensusPEP_Annual_Population",
      "measurementMethod" : "CensusPEPSurvey",
      "observationPeriod" : "P1Y",
      "provenanceUrl" : "https://www2.census.gov/programs-surveys/popest/tables"
    },
    ...
  }
}
```
{: .example-box-content .scroll}
