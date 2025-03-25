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

### Example 3: Get the latest observations for a single entity by DCID

In this example, we get all the latest population observations for one country, Canada. by its DCID using `entity.dcids`. Note that in the response, there are multiple facets returned, because this variable (representing a simple population count) is used in several datasets.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/CAN"
select: "entity"
select: "variable"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FCAN&select=entity&select=variable&select=value&select=date'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/CAN"] }, "select": ["entity", "variable", "value", "date"] }'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "byVariable": {
    "Count_Person": {
      "byEntity": {
        "country/CAN": {
          "orderedFacets": [
            {
              "facetId": "3981252704",
              "observations": [
                {
                  "date": "2023",
                  "value": 40097761
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
                  "value": 40097761
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
                  "value": 40097761
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1216205004",
              "observations": [
                {
                  "date": "2021",
                  "value": 36991981
                }
              ],
              "obsCount": 1,
              "earliestDate": "2021",
              "latestDate": "2021"
            }
          ]
        }
      }
    }
  },
  "facets": {
    "3981252704": {
      "importName": "WorldDevelopmentIndicators",
      "provenanceUrl": "https://datacatalog.worldbank.org/dataset/world-development-indicators/",
      "observationPeriod": "P1Y"
    },
    "1151455814": {
      "importName": "OECDRegionalDemography",
      "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "4181918134": {
      "importName": "OECDRegionalDemography_Population",
      "provenanceUrl": "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "1216205004": {
      "importName": "CanadaStatistics",
      "provenanceUrl": "https://www150.statcan.gc.ca/n1/en/type/data?MM=1"
    }
  }
}
```
{: .example-box-content .scroll}


### Example 4: Get the observations at a particular date for given entities by DCID

This gets observations for the populations of the U.S.A. and California in 2015.  It uses the same variable as the previous example, two entities, and a specific date. 

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
```
{: .example-box-content .scroll}

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
                  "date": "2015",
                  "value": 320738994
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "2645850372",
              "observations": [
                {
                  "date": "2015",
                  "value": 320098094
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "3981252704",
              "observations": [
                {
                  "date": "2015",
                  "value": 320738994
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1151455814",
              "observations": [
                {
                  "date": "2015",
                  "value": 320635163
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "4181918134",
              "observations": [
                {
                  "date": "2015",
                  "value": 320635163
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "10983471",
              "observations": [
                {
                  "date": "2015",
                  "value": 316515021
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1964317807",
              "observations": [
                {
                  "date": "2015",
                  "value": 316515021
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "2825511676",
              "observations": [
                {
                  "date": "2015",
                  "value": 321418820
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "2517965213",
              "observations": [
                {
                  "date": "2015",
                  "value": 320742673
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1226172227",
              "observations": [
                {
                  "date": "2015",
                  "value": 321418821
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            }
          ]
        },
        "geoId/06": {
          "orderedFacets": [
            {
              "facetId": "2176550201",
              "observations": [
                {
                  "date": "2015",
                  "value": 38904296
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1145703171",
              "observations": [
                {
                  "date": "2015",
                  "value": 38421464
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1151455814",
              "observations": [
                {
                  "date": "2015",
                  "value": 38918045
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "4181918134",
              "observations": [
                {
                  "date": "2015",
                  "value": 38918045
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "10983471",
              "observations": [
                {
                  "date": "2015",
                  "value": 38421464
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1964317807",
              "observations": [
                {
                  "date": "2015",
                  "value": 38421464
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "2825511676",
              "observations": [
                {
                  "date": "2015",
                  "value": 39144818
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "2517965213",
              "observations": [
                {
                  "date": "2015",
                  "value": 38918045
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1226172227",
              "observations": [
                {
                  "date": "2015",
                  "value": 39144818
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "2458695583",
              "observations": [
                {
                  "date": "2015",
                  "value": 39144818
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            }
          ]
        }
      }
    }
  },
  "facets": {
    "1226172227": {
      "importName": "CensusACS1YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS1yrSurvey"
    },
    "2458695583": {
      "importName": "WikidataPopulation",
      "provenanceUrl": "https://www.wikidata.org/wiki/Wikidata:Main_Page",
      "measurementMethod": "WikidataPopulation"
    },
    "3981252704": {
      "importName": "WorldDevelopmentIndicators",
      "provenanceUrl": "https://datacatalog.worldbank.org/dataset/world-development-indicators/",
      "observationPeriod": "P1Y"
    },
    "4181918134": {
      "importName": "OECDRegionalDemography_Population",
      "provenanceUrl": "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "10983471": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "1964317807": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S0101",
      "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "2517965213": {
      "importName": "CensusPEP",
      "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html",
      "measurementMethod": "CensusPEPSurvey"
    },
    "2825511676": {
      "importName": "CDC_Mortality_UnderlyingCause",
      "provenanceUrl": "https://wonder.cdc.gov/ucd-icd10.html"
    },
    "1151455814": {
      "importName": "OECDRegionalDemography",
      "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "1145703171": {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS5yrSurvey"
    },
    "2645850372": {
      "importName": "CensusACS5YearSurvey_AggCountry",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey",
      "isDcAggregate": true
    },
    "2176550201": {
      "importName": "USCensusPEP_Annual_Population",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    }
  }
}
```
{: .example-box-content .scroll}


### Example 5: Get all observations for selected entities by DCID

This example gets all observations for populations with doctoral degrees in the states of Wisconsin and Minnesota, represented by statistical variable  [`Count_Person_EducationalAttainmentDoctorateDegree`](https://datacommons.org/browser/Count_Person_EducationalAttainmentDoctorateDegree){: target="_blank"}. Note that we use the empty string in the `date` parameter to get all observations for this variable and entities.

Parameters:
{: .example-box-title}

```bash
date: "2015"
variable.dcids: "Count_Person"
entity.dcids: "cCount_Person_EducationalAttainmentDoctorateDegree"
entity.dcids: "geoId/55"
entity.dcids: "geoId/27"
select: "date"
select: "entity"
select: "value"
select: "variable"
```

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


### Example 6: Get the latest observations for entities specified by expression

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
```
{: .example-box-content .scroll}

### Example 7: Get the latest observations for a single entity, filtering by provenance

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

### Example 8: Get the latest observations for a single entity, filtering for specific dataset

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