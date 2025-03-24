---
layout: default
title: Get statistical observations
nav_order: 2
parent: REST (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# /v2/observation

The Observation API fetches statistical observations. An observation is associated with an
entity and variable at a particular date: for example, "population of USA in
2020", "GDP of California in 2010", and so on.

* TOC
{:toc}

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=<var>DATE_EXPRESSION</var>&variable.dcids=<var>DCID_LIST</var>&entity.dcids|expression=<var>DCID_LIST_OR_RELATION_EXPRESSION</var>&filter.facet_ids=<var>FACET_ID_LIST</var>&filter.domains=<var>DOMAIN_NAME_LIST</var>&select=variable&select=entity[&select=value][&select=date]
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/observation

Header:
X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI

JSON data:
{
  "date": "<var>DATE_EXPRESSION</var>",
  "variable": {
    "dcids": [
      "<var>VARIABLE_DCID_1</var>",
      "<var>VARIABLE_DCID_2</var>",
      ...
    ]
  },
  "entity": {
    "dcids":[
      "<var>ENTITY_DCID_1</var>",
      "<var>ENTITY_DCID_2</var>",
      ...
    ]
    "expression": "<var>ENTITY_EXPRESSION</var>"
  },
  "filter": {
    "facet_ids": [
       "<var>FACET_ID_1</var>",
       "<var>FACET_ID_2</var>",
       ...
    ]
    "domains": [
      "<var>DOMAIN_NAME_1</var>",
      "<var>DOMAIN_NAME_2</var>",
      ...
    ]
  },
  "select": ["date", "entity", "variable", "value"]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Query parameters

| Name                                                  | Type   |  Description                                                    |
|-------------------------------------------------------|--------|-----------------------------------------------------------------|
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the section on [authentication](/api/rest/v2/index.html#authentication) for details. |
| date <br /> <required-tag>Required</required-tag>     | string | See [below](#date-string) for allowable values. |
| variable.dcids <br /> <required-tag>Required</required-tag>| list of strings | List of [DCIDs](/glossary.html#dcid) for the statistical variable to be queried. |
| entity.dcids                                          | list of strings | Comma-separated list of [DCIDs](/glossary.html#dcid) of entities to query. One of `entity.dcids` or `entity.expression` is required. Multiple `entity.dcids` parameters are allowed. |
| entity.expression                                     | string | [Relation expression](/api/rest/v2/index.html#relation-expressions) that represents the  entities to query.  One of `entity.dcids` or `entity.expression` is required.|
| select <br /> <required-tag>Required</required-tag>  | string literal | `select=variable` and `select=entity` are required. `select=facet` is optional. If specifed without `select=date` and `select=value`, no observations are returned. You can use this to first check whether a given entity (or entities) has data for a given variable or variables, before fetching the observations. `select=facet` additionally fetches all the _facets_, which show the sources of the data as well. |
| select <br /> <optional-tag>Optional</optional-tag> | string literal | If used, you must specify both `select=date` and `select=value`. Returns actual observations, with the date and value for each variable and entity queried. |
| filter.facet_domains <br /> <optional-tag>Optional</optional-tag> | list of strings | Comma-separated list of domain names. You can use this to filter results by provenance. |
| filter.facet_ids <br /> <optional-tag>Optional</optional-tag> | list of strings | Comma-separated list of existing [facet IDs](#response) that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. |
{: .doc-table }

> **Note**: Filters are not currently available for custom variables.

{: #date-string}
### Date-time string formats 

Here are the possible values for specifying dates/times:
- `LATEST`: Fetch the latest observations only. This returns a single observation for each entity (if more than one is queried) and provenance.
- <var>DATE_STRING</var>: Fetch observations matching the specified date(s) and time(s). The value must be in the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see below.
- `""`: Return observations for all dates. 

{ #find-date-format}
#### Find the date format for a statistical variable

Statistical variable dates are defined as yearly, monthly, weekly, or daily. For most variables, you can find out the correct date format by searching for the variable in the
[Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"} and looking for the **Date range**. For example, for the variable [Gini Index of Economic Activity](https://datacommons.org/tools/statvar#sv=GiniIndex_EconomicActivity){: target="_blank"}, the date-time format is yearly, i.e. in YYYY format:

![date time example 1](/assets/images/rest/date_time_example1.png){: width="900"}

For other cases, you may need to drill down further to a timeline graph to view specific observations. For example, [Mean Wind Direction](https://datacommons.org/tools/statvar#sv=Mean_WindDirection){: target="_blank"}, is measured at the sub-daily level, but the frequency is not clear (hourly or every two hours, etc.)

![date time example 2](/assets/images/rest/date_time_example2.png){: width="900"}

In these cases, do the following:

1. In the Statistical Variable Explorer, click on an example place to link to the variable's page in the Knowledge Graph Browser. 
1. Scroll to the **Observations** section and click **Show Table** to get a list of observations.

For example, in the case of Mean Wind Direction for [Ibrahimpur, India](https://datacommons.org/browser/cpcbAq/636_Ibrahimpur_Vijayapura?statVar=Mean_WindDirection){: target="_blank"}, the observations table shows that the variable is measured every four hours, starting at midnight.

![date time example 3](/assets/images/rest/date_time_example3.png){: width="600"}

## Response {#response}

With`select=variable` and `select=entity` only, the response looks like:

<pre>
{
  "byVariable": {
    "<var>VARIABLE_DCID_1</var>": {
      "byEntity": {
        "<var>ENTITY_DCID_1</var>": {},
        "<var>ENTITY_DCID_2</var>": {},
        ...
      }
    "<var>VARIABLE_DCID_2</var>": {
      ...
  }
}
</pre>
{: .response-signature .scroll}

With`select=variable`, `select=entity` and `select=facet`, the response looks like:

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
              "obsCount" : "<var>NUMBER_OF_OBSERVATIONS</var>"
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

With `select=variable`, `select=entity`, `select=date` and `select=value` specified, the response looks like:

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

### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| orderedFacets | list of objects | Metadata about the observations returned, keyed first by variable, and then by entity, such as the date range, the number of observations included in the facet etc. |
| observations | list of objects | Date and value pairs for the observations made in the time period |
| facets | object | Various properties of reported facets, where available, including the provenance of the data, etc. |
{: .doc-table}

## Examples

### Example 1: Look up whether a given entity (place) has data for a given variable

In this example, we check whether we have population data, broken down by male and female, for 4 countries, Mexico, Canada, Malaysia, and Singapore. We check if the entities are associated with two variables, [`Count_Person_Male`](https://datacommons.org/browser/Count_Person_Male){: target="_blank"} and [`Count_Person_Female`](https://datacommons.org/browser/Count_Person_Female){: target="_blank"}, and use the `select` options of only `entity` and `variable` to omit observations.

Parameters:
{: .example-box-title}

```
date: "LATEST"
variable.dcids: "Count_Person_Male", "Count_Person_Female"
entity.dcids: "country/MEX", "country/CAN", "country/MYS", "country/SGP"
select: "entity"
select: "variable"
```
GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person_Female&variable.dcids=Count_Person_Male&entity.dcids=country/CAN&entity.dcids=country/MEX&entity.dcids=country/SGP&entity.dcids=country/MYS&select=entity&select=variable'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"  \
https://api.datacommons.org/v2/observation  \
-d '{"date": "LATEST", "variable": { "dcids": ["Count_Person_Male", "Count_Person_Female"] }, "entity": { "dcids": ["country/CAN", "country/MEX", "country/MYS", "country/SGP"] }, "select": ["entity", "variable"] }'
```

Response:
{: .example-box-title}

```json
{
   "byVariable" : {
      "Count_Person_Female" : {
         "byEntity" : {
            "country/CAN" : {},
            "country/MEX" : {}
         }
      },
      "Count_Person_Male" : {
         "byEntity" : {
            "country/CAN" : {},
            "country/MEX" : {}
         }
      }
   }
}
```

### Example 2: Look up whether a given entity (place) has data for a given variable and show the sources

This example is the same as above, but we also get the facets, to see the sources of the available data.

Parameters:
{: .example-box-title}

```
date: "LATEST"
variable.dcids: "Count_Person_Male", "Count_Person_Female"
entity.dcids: "country/MEX", "country/CAN", "country/MYS", "country/SGP"
select: "entity"
select: "variable"
select: "facet"
```
GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person_Female&variable.dcids=Count_Person_Male&entity.dcids=country/CAN&entity.dcids=country/MEX&entity.dcids=country/SGP&entity.dcids=country/MYS&select=entity&select=variable&select=facet'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"  \
https://api.datacommons.org/v2/observation  \
-d '{"date": "LATEST", "variable": { "dcids": ["Count_Person_Male", "Count_Person_Female"] }, "entity": { "dcids": ["country/CAN", "country/MEX", "country/MYS", "country/SGP"] }, "select": ["entity", "variable", "facet"] }'
```

Response:
{: .example-box-title}

```json
{
   "byVariable" : {
      "Count_Person_Female" : {
         "byEntity" : {
            "country/CAN" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "1990",
                     "facetId" : "4181918134",
                     "latestDate" : "2023",
                     "obsCount" : 34
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "1151455814",
                     "latestDate" : "2023",
                     "obsCount" : 34
                  },
                  {
                     "earliestDate" : "2021",
                     "facetId" : "1216205004",
                     "latestDate" : "2021",
                     "obsCount" : 1
                  }
               ]
            },
            "country/MEX" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2021",
                     "facetId" : "3251078590",
                     "latestDate" : "2021",
                     "obsCount" : 1
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "4181918134",
                     "latestDate" : "2020",
                     "obsCount" : 31
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "1151455814",
                     "latestDate" : "2020",
                     "obsCount" : 31
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "3614729857",
                     "latestDate" : "2020",
                     "obsCount" : 6
                  }
               ]
            }
         }
      },
      "Count_Person_Male" : {
         "byEntity" : {
            "country/CAN" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "1990",
                     "facetId" : "4181918134",
                     "latestDate" : "2023",
                     "obsCount" : 34
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "1151455814",
                     "latestDate" : "2023",
                     "obsCount" : 34
                  },
                  {
                     "earliestDate" : "2021",
                     "facetId" : "1216205004",
                     "latestDate" : "2021",
                     "obsCount" : 1
                  }
               ]
            },
            "country/MEX" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2021",
                     "facetId" : "3251078590",
                     "latestDate" : "2021",
                     "obsCount" : 1
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "4181918134",
                     "latestDate" : "2020",
                     "obsCount" : 31
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "1151455814",
                     "latestDate" : "2020",
                     "obsCount" : 31
                  },
                  {
                     "earliestDate" : "1990",
                     "facetId" : "3614729857",
                     "latestDate" : "2020",
                     "obsCount" : 6
                  }
               ]
            }
         }
      }
   },
   "facets" : {
      "1151455814" : {
         "importName" : "OECDRegionalDemography",
         "measurementMethod" : "OECDRegionalStatistics",
         "observationPeriod" : "P1Y",
         "provenanceUrl" : "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#"
      },
      "1216205004" : {
         "importName" : "CanadaStatistics",
         "provenanceUrl" : "https://www150.statcan.gc.ca/n1/en/type/data?MM=1"
      },
      "3251078590" : {
         "importName" : "MexicoCensus_AA2",
         "provenanceUrl" : "https://data.humdata.org/dataset/cod-ps-mex"
      },
      "3614729857" : {
         "importName" : "MexicoCensus",
         "provenanceUrl" : "https://www.inegi.org.mx/temas/"
      },
      "4181918134" : {
         "importName" : "OECDRegionalDemography_Population",
         "measurementMethod" : "OECDRegionalStatistics",
         "observationPeriod" : "P1Y",
         "provenanceUrl" : "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C"
      }
   }
}
```
{: .example-box-content .scroll}

### Example 3: Get the latest observations for a single entity

In this example, we get all the latest population observations for U.S.A. by its DCID using `entity.dcids`. Note that in the response, there are multiple facets returned, because this variable (representing a simple population count) is used in several datasets.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/USA"
select: "entity"
select: "variable"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FUSA&select=entity&select=variable&select=value&select=date'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/USA"] }, "select": ["entity", "variable", "value", "date"] }'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
   "byVariable" : {
      "Count_Person" : {
         "byEntity" : {
            "country/USA" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2024",
                     "facetId" : "2176550201",
                     "latestDate" : "2024",
                     "obsCount" : 1,
                     "observations" : [
                        {
                           "date" : "2024",
                           "value" : 340110988
                        }
                     ]
                  },
                  {
                     "earliestDate" : "2023",
                     "facetId" : "2645850372",
                     "latestDate" : "2023",
                     "obsCount" : 1,
                     "observations" : [
                        {
                           "date" : "2023",
                           "value" : 335642425
                        }
                     ]
                  }
               ]
            }
         }
      }
   },
  "facets": {
    ...
    "2176550201" : {
      "importName" : "USCensusPEP_Annual_Population",
      "measurementMethod" : "CensusPEPSurvey",
      "observationPeriod" : "P1Y",
      "provenanceUrl" : "https://www2.census.gov/programs-surveys/popest/tables"
    },
    ...
   "2645850372" : {
         "importName" : "CensusACS5YearSurvey_AggCountry",
         "isDcAggregate" : true,
         "measurementMethod" : "CensusACS5yrSurvey",
         "provenanceUrl" : "https://www.census.gov/"
      },
    ...
  }
}
```
{: .example-box-content .scroll}

### Example 4: Get all observations for a single entity

In this example, we get all population observations for U.S.A. since the earliest date.

Parameters:
{: .example-box-title}

```bash
date: ""
variable.dcids: "Count_Person"
entity.dcids: "country/USA"
select: "entity"
select: "variable"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=&variable.dcids=Count_Person&entity.dcids=country%2FUSA&select=entity&select=variable&select=value&select=date'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/USA"] }, "select": ["entity", "variable", "value", "date"] }'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```json
{
   "byVariable" : {
      "Count_Person" : {
         "byEntity" : {
            "country/USA" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "1900",
                     "facetId" : "2176550201",
                     "latestDate" : "2024",
                     "obsCount" : 125,
                     "observations" : [
                        {
                           "date" : "1900",
                           "value" : 76094000
                        },
                        {
                           "date" : "1901",
                           "value" : 77584000
                        },
                        {
                           "date" : "1902",
                           "value" : 79163000
                        },
                        {
                           "date" : "1903",
                           "value" : 80632000
                        },
                        {
                           "date" : "1904",
                           "value" : 82166000
                        },
                        {
                           "date" : "1905",
                           "value" : 83822000
                        },
                        {
                           "date" : "1906",
                           "value" : 85450000
                        },
                        {
                           "date" : "1907",
                           "value" : 87008000
                        },
                        {
                           "date" : "1908",
                           "value" : 88710000
                        },
                        {
                           "date" : "1909",
                           "value" : 90490000
                        },
                        {
                           "date" : "1910",
                           "value" : 92407000
                        },
                        {
                           "date" : "1911",
                           "value" : 93863000
                        },
                        {
                           "date" : "1912",
                           "value" : 95335000
                        },
                        {
                           "date" : "1913",
                           "value" : 97225000
                        },
                        {
                           "date" : "1914",
                           "value" : 99111000
                        },
                        {
                           "date" : "1915",
                           "value" : 100546000
                        },
                        {
                           "date" : "1916",
                           "value" : 101961000
                        },
                        {
                           "date" : "1917",
                           "value" : 103268000
                        },
                        {
                           "date" : "1918",
                           "value" : 103208000
                        },
                        {
                           "date" : "1919",
                           "value" : 104514000
                        },
                        {
                           "date" : "1920",
                           "value" : 106461000
                        },
                        {
                           "date" : "1921",
                           "value" : 108538000
                        },
                        {
                           "date" : "1922",
                           "value" : 110049000
                        },
                        {
                           "date" : "1923",
                           "value" : 111947000
                        },
                        {
                           "date" : "1924",
                           "value" : 114109000
                        },
                        {
                           "date" : "1925",
                           "value" : 115829000
                        },
                        {
                           "date" : "1926",
                           "value" : 117397000
                        },
                        {
                           "date" : "1927",
                           "value" : 119035000
                        },
                        {
                           "date" : "1928",
                           "value" : 120509000
                        },
                        {
                           "date" : "1929",
                           "value" : 121767000
                        },
                        {
                           "date" : "1930",
                           "value" : 123076741
                        },
                        {
                           "date" : "1931",
                           "value" : 124039648
                        },
                        {
                           "date" : "1932",
                           "value" : 124840471
                        },
                        {
                           "date" : "1933",
                           "value" : 125578763
                        },
                        {
                           "date" : "1934",
                           "value" : 126373773
                        },
                        {
                           "date" : "1935",
                           "value" : 127250232
                        },
                        {
                           "date" : "1936",
                           "value" : 128053180
                        },
                        {
                           "date" : "1937",
                           "value" : 128824829
                        },
                        {
                           "date" : "1938",
                           "value" : 129824939
                        },
                        {
                           "date" : "1939",
                           "value" : 130879718
                        },
                        {
                           "date" : "1940",
                           "value" : 132122446
                        },
                        {
                           "date" : "1941",
                           "value" : 133402471
                        },
                        {
                           "date" : "1942",
                           "value" : 134859553
                        },
                        {
                           "date" : "1943",
                           "value" : 136739353
                        },
                        {
                           "date" : "1944",
                           "value" : 138397345
                        },
                        {
                           "date" : "1945",
                           "value" : 139928165
                        },
                        {
                           "date" : "1946",
                           "value" : 141388566
                        },
                        {
                           "date" : "1947",
                           "value" : 144126071
                        },
                        {
                           "date" : "1948",
                           "value" : 146631302
                        },
                        {
                           "date" : "1949",
                           "value" : 149188130
                        },
                        {
                           "date" : "1950",
                           "value" : 152271417
                        },
                        {
                           "date" : "1951",
                           "value" : 154877889
                        },
                        {
                           "date" : "1952",
                           "value" : 157552740
                        },
                        {
                           "date" : "1953",
                           "value" : 160184192
                        },
                        {
                           "date" : "1954",
                           "value" : 163025854
                        },
                        {
                           "date" : "1955",
                           "value" : 165931202
                        },
                        {
                           "date" : "1956",
                           "value" : 168903031
                        },
                        {
                           "date" : "1957",
                           "value" : 171984130
                        },
                        {
                           "date" : "1958",
                           "value" : 174881904
                        },
                        {
                           "date" : "1959",
                           "value" : 177829628
                        },
                        {
                           "date" : "1960",
                           "value" : 180671158
                        },
                        {
                           "date" : "1961",
                           "value" : 183691481
                        },
                        {
                           "date" : "1962",
                           "value" : 186537737
                        },
                        {
                           "date" : "1963",
                           "value" : 189241798
                        },
                        {
                           "date" : "1964",
                           "value" : 191888791
                        },
                        {
                           "date" : "1965",
                           "value" : 194302963
                        },
                        {
                           "date" : "1966",
                           "value" : 196560338
                        },
                        {
                           "date" : "1967",
                           "value" : 198712056
                        },
                        {
                           "date" : "1968",
                           "value" : 200706052
                        },
                        {
                           "date" : "1969",
                           "value" : 202676946
                        },
                        {
                           "date" : "1970",
                           "value" : 205052174
                        },
                        {
                           "date" : "1971",
                           "value" : 207660677
                        },
                        {
                           "date" : "1972",
                           "value" : 209896021
                        },
                        {
                           "date" : "1973",
                           "value" : 211908788
                        },
                        {
                           "date" : "1974",
                           "value" : 213853928
                        },
                        {
                           "date" : "1975",
                           "value" : 215973199
                        },
                        {
                           "date" : "1976",
                           "value" : 218035164
                        },
                        {
                           "date" : "1977",
                           "value" : 220239425
                        },
                        {
                           "date" : "1978",
                           "value" : 222584545
                        },
                        {
                           "date" : "1979",
                           "value" : 225055487
                        },
                        {
                           "date" : "1980",
                           "value" : 226542250
                        },
                        {
                           "date" : "1981",
                           "value" : 229465744
                        },
                        {
                           "date" : "1982",
                           "value" : 231664432
                        },
                        {
                           "date" : "1983",
                           "value" : 233792014
                        },
                        {
                           "date" : "1984",
                           "value" : 235824908
                        },
                        {
                           "date" : "1985",
                           "value" : 237923734
                        },
                        {
                           "date" : "1986",
                           "value" : 240132831
                        },
                        {
                           "date" : "1987",
                           "value" : 242288936
                        },
                        {
                           "date" : "1988",
                           "value" : 244499004
                        },
                        {
                           "date" : "1989",
                           "value" : 246819222
                        },
                        {
                           "date" : "1990",
                           "value" : 250131894
                        },
                        {
                           "date" : "1991",
                           "value" : 253492503
                        },
                        {
                           "date" : "1992",
                           "value" : 256894189
                        },
                        {
                           "date" : "1993",
                           "value" : 260255352
                        },
                        {
                           "date" : "1994",
                           "value" : 263435673
                        },
                        {
                           "date" : "1995",
                           "value" : 266557091
                        },
                        {
                           "date" : "1996",
                           "value" : 269667391
                        },
                        {
                           "date" : "1997",
                           "value" : 272911760
                        },
                        {
                           "date" : "1998",
                           "value" : 276115288
                        },
                        {
                           "date" : "1999",
                           "value" : 279294713
                        },
                        {
                           "date" : "2000",
                           "value" : 282162411
                        },
                        {
                           "date" : "2001",
                           "value" : 284968955
                        },
                        {
                           "date" : "2002",
                           "value" : 287625193
                        },
                        {
                           "date" : "2003",
                           "value" : 290107933
                        },
                        {
                           "date" : "2004",
                           "value" : 292805298
                        },
                        {
                           "date" : "2005",
                           "value" : 295516599
                        },
                        {
                           "date" : "2006",
                           "value" : 298379912
                        },
                        {
                           "date" : "2007",
                           "value" : 301231207
                        },
                        {
                           "date" : "2008",
                           "value" : 304093966
                        },
                        {
                           "date" : "2009",
                           "value" : 306771529
                        },
                        {
                           "date" : "2010",
                           "value" : 309327143
                        },
                        {
                           "date" : "2011",
                           "value" : 311583481
                        },
                        {
                           "date" : "2012",
                           "value" : 313877662
                        },
                        {
                           "date" : "2013",
                           "value" : 316059947
                        },
                        {
                           "date" : "2014",
                           "value" : 318386329
                        },
                        {
                           "date" : "2015",
                           "value" : 320738994
                        },
                        {
                           "date" : "2016",
                           "value" : 323071755
                        },
                        {
                           "date" : "2017",
                           "value" : 325122128
                        },
                        {
                           "date" : "2018",
                           "value" : 326838199
                        },
                        {
                           "date" : "2019",
                           "value" : 328329953
                        },
                        {
                           "date" : "2020",
                           "value" : 331526933
                        },
                        {
                           "date" : "2021",
                           "value" : 331893745
                        },
                        {
                           "date" : "2022",
                           "value" : 333271411
                        },
                        {
                           "date" : "2023",
                           "value" : 334914895
                        },
                        {
                           "date" : "2024",
                           "value" : 340110988
                        }
                     ]
                  },
                  {
                     "earliestDate" : "2011",
                     "facetId" : "2645850372",
                     "latestDate" : "2023",
                     "obsCount" : 13,
                     "observations" : [
                        {
                           "date" : "2011",
                           "value" : 310346358
                        },
                        {
                           "date" : "2012",
                           "value" : 312855438
                        },
                        {
                           "date" : "2013",
                           "value" : 315219560
                        },
                        {
                           "date" : "2014",
                           "value" : 317746049
                        },
                        {
                           "date" : "2015",
                           "value" : 320098094
                        },
                        {
                           "date" : "2016",
                           "value" : 322087547
                        },
                        {
                           "date" : "2017",
                           "value" : 324473370
                        },
                        {
                           "date" : "2018",
                           "value" : 326289971
                        },
                        {
                           "date" : "2019",
                           "value" : 328016242
                        },
                        {
                           "date" : "2020",
                           "value" : 329824950
                        },
                        {
                           "date" : "2021",
                           "value" : 333036755
                        },
                        {
                           "date" : "2022",
                           "value" : 334369975
                        },
                        {
                           "date" : "2023",
                           "value" : 335642425
                        }
                     ]
                  },
                  {
                     "earliestDate" : "2022",
                     "facetId" : "1145703171",
                     "latestDate" : "2023",
                     "obsCount" : 2,
                     "observations" : [
                        {
                           "date" : "2022",
                           "value" : 331097593
                        },
                        {
                           "date" : "2023",
                           "value" : 332387540
                        }
                     ]
                  },
                  {
                     "earliestDate" : "2000",
                     "facetId" : "1541763368",
                     "latestDate" : "2020",
                     "obsCount" : 3,
                     "observations" : [
                        {
                           "date" : "2000",
                           "value" : 281421906
                        },
                        {
                           "date" : "2010",
                           "value" : 308745538
                        },
                        {
                           "date" : "2020",
                           "value" : 331449281
                        }
                     ]
                  },
                  {
                     "earliestDate" : "1960",
                     "facetId" : "3981252704",
                     "latestDate" : "2023",
                     "obsCount" : 64,
                     "observations" : [
                        {
                           "date" : "1960",
                           "value" : 180671000
                        },
                        {
                           "date" : "1961",
                           "value" : 183691000
                        },
                        {
                           "date" : "1962",
                           "value" : 186538000
                        },
                        {
                           "date" : "1963",
                           "value" : 189242000
                        },
                        {
                           "date" : "1964",
                           "value" : 191889000
                        },
                        {
                           "date" : "1965",
                           "value" : 194303000
                        },
                        {
                           "date" : "1966",
                           "value" : 196560000
                        },
                        {
                           "date" : "1967",
                           "value" : 198712000
                        },
                        {
                           "date" : "1968",
                           "value" : 200706000
                        },
                        {
                           "date" : "1969",
                           "value" : 202677000
                        },
                        {
                           "date" : "1970",
                           "value" : 205052000
                        },
                        {
                           "date" : "1971",
                           "value" : 207661000
                        },
                        {
                           "date" : "1972",
                           "value" : 209896000
                        },
                        {
                           "date" : "1973",
                           "value" : 211909000
                        },
                        {
                           "date" : "1974",
                           "value" : 213854000
                        },
                        {
                           "date" : "1975",
                           "value" : 215973000
                        },
                        {
                           "date" : "1976",
                           "value" : 218035000
                        },
                        {
                           "date" : "1977",
                           "value" : 220239000
                        },
                        {
                           "date" : "1978",
                           "value" : 222585000
                        },
                        {
                           "date" : "1979",
                           "value" : 225055000
                        },
                        {
                           "date" : "1980",
                           "value" : 227225000
                        },
                        {
                           "date" : "1981",
                           "value" : 229466000
                        },
                        {
                           "date" : "1982",
                           "value" : 231664000
                        },
                        {
                           "date" : "1983",
                           "value" : 233792000
                        },
                        {
                           "date" : "1984",
                           "value" : 235825000
                        },
                        {
                           "date" : "1985",
                           "value" : 237924000
                        },
                        {
                           "date" : "1986",
                           "value" : 240133000
                        },
                        {
                           "date" : "1987",
                           "value" : 242289000
                        },
                        {
                           "date" : "1988",
                           "value" : 244499000
                        },
                        {
                           "date" : "1989",
                           "value" : 246819000
                        },
                        {
                           "date" : "1990",
                           "value" : 249623000
                        },
                        {
                           "date" : "1991",
                           "value" : 252981000
                        },
                        {
                           "date" : "1992",
                           "value" : 256514000
                        },
                        {
                           "date" : "1993",
                           "value" : 259919000
                        },
                        {
                           "date" : "1994",
                           "value" : 263126000
                        },
                        {
                           "date" : "1995",
                           "value" : 266278000
                        },
                        {
                           "date" : "1996",
                           "value" : 269394000
                        },
                        {
                           "date" : "1997",
                           "value" : 272657000
                        },
                        {
                           "date" : "1998",
                           "value" : 275854000
                        },
                        {
                           "date" : "1999",
                           "value" : 279040000
                        },
                        {
                           "date" : "2000",
                           "value" : 282162411
                        },
                        {
                           "date" : "2001",
                           "value" : 284968955
                        },
                        {
                           "date" : "2002",
                           "value" : 287625193
                        },
                        {
                           "date" : "2003",
                           "value" : 290107933
                        },
                        {
                           "date" : "2004",
                           "value" : 292805298
                        },
                        {
                           "date" : "2005",
                           "value" : 295516599
                        },
                        {
                           "date" : "2006",
                           "value" : 298379912
                        },
                        {
                           "date" : "2007",
                           "value" : 301231207
                        },
                        {
                           "date" : "2008",
                           "value" : 304093966
                        },
                        {
                           "date" : "2009",
                           "value" : 306771529
                        },
                        {
                           "date" : "2010",
                           "value" : 309327143
                        },
                        {
                           "date" : "2011",
                           "value" : 311583481
                        },
                        {
                           "date" : "2012",
                           "value" : 313877662
                        },
                        {
                           "date" : "2013",
                           "value" : 316059947
                        },
                        {
                           "date" : "2014",
                           "value" : 318386329
                        },
                        {
                           "date" : "2015",
                           "value" : 320738994
                        },
                        {
                           "date" : "2016",
                           "value" : 323071755
                        },
                        {
                           "date" : "2017",
                           "value" : 325122128
                        },
                        {
                           "date" : "2018",
                           "value" : 326838199
                        },
                        {
                           "date" : "2019",
                           "value" : 328329953
                        },
                        {
                           "date" : "2020",
                           "value" : 331526933
                        },
                        {
                           "date" : "2021",
                           "value" : 332048977
                        },
                        {
                           "date" : "2022",
                           "value" : 333271411
                        },
                        {
                           "date" : "2023",
                           "value" : 334914895
                        }
                     ]
                  },
```
{: .example-box-content .scroll}


### Example 5: Get the observations at a particular date for given entities

This gets observations for the populations of the U.S.A. and California in 2015.  It uses the same parameters as the previous example, with an additional entity, and a specific date. 

Parameters:
{: .example-box-title}

```bash
date: "2015"
variable.dcids: "Count_Person"
entity.dcids: "country/USA"
entity.dcids: "geoId/06"
select: "date"
select: "entity"
select: "value"
select: "variable"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&variable.dcids=Count_Person&entity.dcids=country%2FUSA&entity.dcids=geoId%2F06&select=date&select=entity&select=value&select=variable'
{: .example-box-content .scroll}
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "2015", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/USA", "geoId/06"] }, "select": ["entity", "variable", "value", "date"] }'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```json
{
  "byVariable": {
    "Count_Person": {
      "byEntity": {
        "country/USA": {
          "orderedFacets": [
             {
              "earliestDate" : "2015",
              "facetId" : "2176550201",
              "latestDate" : "2015",
              "obsCount" : 1,
              "observations" : [
                {
                  "date" : "2015",
                  "value" : 320738994
                }
              ]
            },
          ]
        },
        "geoId/06": {
          "orderedFacets": [
            "earliestDate" : "2015",
            "facetId" : "2176550201",
            "latestDate" : "2015",
            "obsCount" : 1,
            "observations" : [
              {
                "date" : "2015",
                "value" : 38904296
              }
            ]
          },
          ]
        }
      }
    }
  },
  "facets" {
      "2176550201" : {
         "importName" : "USCensusPEP_Annual_Population",
         "measurementMethod" : "CensusPEPSurvey",
         "observationPeriod" : "P1Y",
         "provenanceUrl" : "https://www2.census.gov/programs-surveys/popest/tables"
      },
  }
}
```
{: .example-box-content .scroll}


### Example 6: Get all observations for selected entities

This example gets all observations for populations with doctoral degrees in the states of Wisconsin and Minnesota, represented by statistical variable  [`Count_Person_EducationalAttainmentDoctorateDegree`](https://datacommons.org/browser/Count_Person_EducationalAttainmentDoctorateDegree){: target="_blank"}. Note that we use the empty string in the `date` parameter to get all observations for this variable and entities.

GET Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=&variable.dcids=Count_Person_EducationalAttainmentDoctorateDegree&entity.dcids=geoId/27&entity.dcids=geoId/55&select=date&select=entity&select=value&select=variable'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
https://api.datacommons.org/v2/observation  \
-d '{"date": "",  "entity": {"dcids": ["geoId/27","geoId/55"]}, "variable": { "dcids": ["Count_Person_EducationalAttainmentDoctorateDegree"] }, "select": ["entity", "variable", "value", "date"] }'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
   "byVariable" : {
      "Count_Person_EducationalAttainmentDoctorateDegree" : {
         "byEntity" : {
            "geoId/27" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2012",
                     "facetId" : "1145703171",
                     "latestDate" : "2023",
                     "obsCount" : 12,
                     "observations" : [
                        {
                           "date" : "2012",
                           "value" : 40961
                        },
                        {
                           "date" : "2013",
                           "value" : 42511
                        },
                        {
                           "date" : "2014",
                           "value" : 44713
                        },
                        {
                           "date" : "2015",
                           "value" : 47323
                        },
                        {
                           "date" : "2016",
                           "value" : 50039
                        },
                        {
                           "date" : "2017",
                           "value" : 52737
                        },
                        {
                           "date" : "2018",
                           "value" : 54303
                        },
                        {
                           "date" : "2019",
                           "value" : 55185
                        },
                        {
                           "date" : "2020",
                           "value" : 56170
                        },
                        {
                           "date" : "2021",
                           "value" : 58452
                        },
                        {
                           "date" : "2022",
                           "value" : 60300
                        },
                        {
                           "date" : "2023",
                           "value" : 63794
                        }
                     ]
                  }
               ]
            },
            "geoId/55" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2012",
                     "facetId" : "1145703171",
                     "latestDate" : "2023",
                     "obsCount" : 12,
                     "observations" : [
                        {
                           "date" : "2012",
                           "value" : 38052
                        },
                        {
                           "date" : "2013",
                           "value" : 38711
                        },
                        {
                           "date" : "2014",
                           "value" : 40133
                        },
                        {
                           "date" : "2015",
                           "value" : 41387
                        },
                        {
                           "date" : "2016",
                           "value" : 42590
                        },
                        {
                           "date" : "2017",
                           "value" : 43737
                        },
                        {
                           "date" : "2018",
                           "value" : 46071
                        },
                        {
                           "date" : "2019",
                           "value" : 47496
                        },
                        {
                           "date" : "2020",
                           "value" : 49385
                        },
                        {
                           "date" : "2021",
                           "value" : 52306
                        },
                        {
                           "date" : "2022",
                           "value" : 53667
                        },
                        {
                           "date" : "2023",
                           "value" : 55286
                        }
                     ]
                  }
               ]
            }
         }
      }
   },
   "facets" : {
      "1145703171" : {
         "importName" : "CensusACS5YearSurvey",
         "measurementMethod" : "CensusACS5yrSurvey",
         "provenanceUrl" : "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"
      }
   }
}
```
{: .example-box-content .scroll}


### Example 7: Get the latest observations for entities specified by expression

In this example, we get the latest population counts for counties in California. We use a [filter expression](/api/rest/v2/#filters) to specify "all contained places in California of
type `County`". Then we specify the `select` fields to fetch the latest observations for the variable
`Count_Person` and entity (all counties in California).

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.expression: "geoId/06<-containedInPlace+{typeOf:County}"
select: "date"
select: "entity"
select: "value"
select: "variable"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&date=LATEST&variable.dcids=Count_Person&entity.expression=geoId%2F06%3C-containedInPlace%2B%7BtypeOf%3ACounty%7D&select=date&select=entity&select=value&select=variable'
```
{: .example-box-content .scroll}

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

(truncated)

```json
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
          ]
        },
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
  }
}
{: .example-box-content .scroll}

### Example 8: Get the latest observations for a single entity, filtering by provenance

This example is the same as example #1, except it filters for a single data source, namely the U.S. government census, represented by its domain name, `www2.census.gov`.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/USA"
filter.domains: "www2.census.gov"
select: "entity"
select: "variable"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FUSA&filter.domains=www2.census.gov&select=entity&select=variable&select=value&select=date
```
POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \  
https://api.datacommons.org/v2/observation  \ 
-d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/USA"] }, "select": ["entity", "variable", "value", "date"], "filter": {"domains": ["www2.census.gov"]}}'
```

{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
   "byVariable" : {
      "Count_Person" : {
         "byEntity" : {
            "country/USA" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2024",
                     "facetId" : "2176550201",
                     "latestDate" : "2024",
                     "obsCount" : 1,
                     "observations" : [
                        {
                           "date" : "2024",
                           "value" : 340110988
                        }
                     ]
                  }
               ]
            }
         }
      }
   },
   "facets" : {
      "2176550201" : {
         "importName" : "USCensusPEP_Annual_Population",
         "measurementMethod" : "CensusPEPSurvey",
         "observationPeriod" : "P1Y",
         "provenanceUrl" : "https://www2.census.gov/programs-surveys/popest/tables"
      }
   }
}

```

### Example 9: Get the latest observations for a single entity, filtering for specific dataset

This example gets the latest population count of Brazil. It filters for a single dataset from the World Bank, using the facet ID `3981252704`.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/BRA"
filter.facet_ids: "3981252704"
select: "entity"
select: "variable"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FBRA&filter.facet_ids=3981252704&select=entity&select=variable&select=value&select=date
```
POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
https://api.datacommons.org/v2/observation  \ 
-d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/BRA"] }, "select": ["entity", "variable", "value", "date"], "filter": {"facet_ids": ["3981252704"]} }'
```

{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
   "byVariable" : {
      "Count_Person" : {
         "byEntity" : {
            "country/BRA" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2023",
                     "facetId" : "3981252704",
                     "latestDate" : "2023",
                     "obsCount" : 1,
                     "observations" : [
                        {
                           "date" : "2023",
                           "value" : 211140729
                        }
                     ]
                  }
               ]
            }
         }
      }
   },
   "facets" : {
      "3981252704" : {
         "importName" : "WorldDevelopmentIndicators",
         "observationPeriod" : "P1Y",
         "provenanceUrl" : "https://datacatalog.worldbank.org/dataset/world-development-indicators/"
      }
   }
}
```