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
| select <br /> <required-tag>Required</required-tag>  | string literal | `select=variable` and `select=entity` are required. If specifed without `select=date` and `select=value`, no observations are returned. You can use this to first check whether a given entity has data for a given variable. |
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

Without `select=date` and `select=value` specified, the response looks like:

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

With `select=date` and `select=value` specified, the response looks like:

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

In this example, we check whether we have population data, broken down by male and female, for 4 countries, Mexico, Canada, Malaysia, and Singapore. We check two variables, [`Count_Person_Male`](https://datacommons.org/browser/Count_Person_Male){: target="_blank"} and [`Count_Person_Female`](https://datacommons.org/browser/Count_Person_Female){: target="_blank"}, and use the `select` options of only `entity` and `variable` to omit observations.

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

```bash
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

### Example 2: Get the latest observations for a single entity

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

### Example 3: Get the observations at a particular date for given entities

This gets observations for the populations of the U.S.A. and California in 2015.  It uses the same parameters as the previous request, with an additional entity, and a specific date. 

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

```
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
            ...
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
          ...
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
    ...
  }
}
```
{: .example-box-content .scroll}


### Example 4: Get all observations for selected entities

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


### Example 5: Get the latest observations for entities specified by expression

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

### Example 6: Get the latest observations for a single entity, filtering by provenance

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

### Example 7: Get the latest observations for a single entity, filtering for specific dataset

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