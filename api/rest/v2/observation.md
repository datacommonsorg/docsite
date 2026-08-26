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

The Observation API fetches statistical observations. An observation is associated with an entity and a variable at a particular date: for example, "population of USA in 2020", "GDP of California in 2010", and so on. You can also use this API to just look up the data available for given entities (places) and variables.

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
https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=<var>DATE_EXPRESSION</var>&variable.dcids=<var>DCID_LIST</var>&entity.dcids|expression=<var>DCID_LIST_OR_RELATION_EXPRESSION</var>&filter.facet_ids=<var>FACET_ID_LIST</var>&filter.domains=<var>DOMAIN_NAME_LIST</var>&select=variable&select=entity&select=value&select=date&select=facet
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
  "select": ["date", "entity", "variable", "value", "facet"]
}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

> **Note**: A single entity or variable may be associated with multiple [_facets_](/glossary.html#facet). By default, a query returns all available facets. This means that your results may be a mixed set of observations, potentially combining data from various sources or using different measurement methods. To ensure consistency and restrict your query to a specific facet, you must use a facet filter, as described below.

### Query parameters

| Name                                                  | Type   |  Description                                                    |
|-------------------------------------------------------|--------|-----------------------------------------------------------------|
| key <br /><required-tag>Required</required-tag>      | string | Your API key. See the section on [authentication](/api/rest/v2/index.html#authentication) for details. |
| date <br /><optional-tag>Optional</optional-tag> | string | Required for retrieving observations; unnecessary for retrieving availability of variables or data. See [below](#date-string) for allowable values. |
| variable.dcids <br /><optional-tag>Optional</optional-tag> | list of strings | List of [DCIDs](/glossary.html#dcid) for the statistical variable to be queried. Required for retrieving observations. To just get a list of variables associated with given entities, you can omit it. |
| entity.dcids  | list of strings | Comma-separated list of [DCIDs](/glossary.html#dcid) of entities to query. One of `entity.dcids` or `entity.expression` is required. Multiple `entity.dcids` parameters are allowed. |
| entity.expression | string | [Relation expression](/api/rest/v2/index.html#relation-expressions) that represents the  entities to query.  One of `entity.dcids` or `entity.expression` is required.|
| select <br /><optional-tag>Optional</optional-tag>  | string literal | With no `select` parameters, only checks whether a given entity (or entities) has data for a given variable or variables. With `select=facet`, the available facets are also returned with the response. To get actual observations, both `select=date` and `select=value` are required. `select=entity` and `select=variable` are optional in all requests.<br/><br/><b>Note:</b> For Custom Data Commons instances, `select=date` and `select=value` are required in all requests.  |
| filter.facet_domains <br /><optional-tag>Optional</optional-tag> | list of strings | Comma-separated list of domain names. You can use this to filter results by provenance URL. See [Response](#response) below for more details. |
| filter.facet_ids <br /><optional-tag>Optional</optional-tag> | list of strings | Comma-separated list of existing _facet IDs_ that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. See [Response](#response) below for more details. |
{: .doc-table }

> **Note**: Filters are not currently available for custom variables.

{: #date-string}
### Date-time string formats 

Here are the possible values for specifying dates/times:
- `LATEST`: Fetch the latest observations only. This returns a single observation for each entity (if more than one is queried) and provenance.
- <var>DATE_STRING</var>: Fetch observations matching the specified date(s) and time(s). The value must be in the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see below.
- `""`: Return observations for all dates. 

{: #find-date-format}
#### Find the date format for a statistical variable

Statistical variable dates are defined as yearly, monthly, weekly, or daily. For most variables, you can find out the correct date format by searching for the variable in the
[Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"} and looking for the **Date range**. For example, for the variable [Gini Index of Economic Activity](https://datacommons.org/tools/statvar#sv=GiniIndex_EconomicActivity){: target="_blank"}, the date-time format is yearly, i.e. in YYYY format:

![date time example 1](/assets/images/rest/date_time_example1.png){: width="900"}

## Response {#response}

With `select=date` and `select=value` specified (and no filters), all observations and available facets are returned. The response looks like this:

<pre>
{
  "byVariable": {
    "<var>VARIABLE_DCID_1</var>": {
      "byEntity": {
        "<var>ENTITY_DCID_1</var>": {
          "orderedFacets": [
            {
              "facetId": "<var>FACET_ID_1</var>",
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
            {
              "facetId": "<var>FACET_ID_2</var>",
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
    "<var>FACET_ID_1</var>": {
     "importName": "<var>DATASET_NAME</var>",
      "provenanceUrl": "<var>DATASET_URL</var>",
      ["measurementMethod": "<var>MEASUREMENT_METHOD</var>",]
      ["observationPeriod": "<var>TIME_PERIOD</var>",]
      ["scalingFactor": "<var>NUMBER</var>",]
      ["unit": "<var>UNIT</var>",]
      ["isDcAggregate": "true" | "false"]
    },
    "<var>FACET_ID_2</var>": {
     "importName": "<var>DATASET_NAME</var>",
      "provenanceUrl": "<var>DATASET_URL</var>",
      ["measurementMethod": "<var>MEASUREMENT_METHOD</var>",]
      ["observationPeriod": "<var>TIME_PERIOD</var>",]
      ["scalingFactor": "<var>NUMBER</var>",]
      ["unit": "<var>UNIT</var>",]
      ["isDcAggregate": "true" | "false"]
    },
    ...
  }
</pre>
{: .response-signature .scroll}

With `select=facet`, only the details about the available facets are returned, including the number of observations available for each facet. But no actual observations are returned. The response looks like:

<pre>
{
  "byVariable": {
    "<var>VARIABLE_DCID_1</var>": {
      "byEntity": {
        "<var>ENTITY_DCID_1</var>": {
          "orderedFacets": [
            {
              "facetId": "<var>FACET_ID_1</var>",
              "earliestDate" : "<var>DATE_STRING</var>", 
              "latestDate" : "<var>DATE_STRING</var>", 
              "obsCount" : "<var>NUMBER_OF_OBSERVATIONS</var>"
            },
             {
              "facetId": "<var>FACET_ID_2</var>",
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
    "<var>FACET_ID_1</var>": {
      "importName": "<var>DATASET_NAME</var>",
      "provenanceUrl": "<var>DATASET_URL</var>",
      ["measurementMethod": "<var>MEASUREMENT_METHOD</var>",]
      ["observationPeriod": "<var>TIME_PERIOD</var>",]
      ["scalingFactor": "<var>NUMBER</var>",]
      ["unit": "<var>UNIT</var>",]
      ["isDcAggregate": "true" | "false"]
    },
    "<var>FACET_ID_2</var>": {
      "importName": "<var>DATASET_NAME</var>",
      "provenanceUrl": "<var>DATASET_URL</var>",
      ["measurementMethod": "<var>MEASUREMENT_METHOD</var>",]
      ["observationPeriod": "<var>TIME_PERIOD</var>",]
      ["scalingFactor": "<var>NUMBER</var>",]
      ["unit": "<var>UNIT</var>",]
      ["isDcAggregate": "true" | "false"]
    },
    ...
  }
</pre>
{: .response-signature .scroll}

With no `select` parameters, the response looks like the following. Note the empty brackets after the entity DCIDs; this simply means that the facet and observation data have been omitted from the response.

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


### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| orderedFacets | list of objects | Metadata about the observations returned, keyed first by variable, and then by entity, such as the date range, the number of observations included in the facet etc. |
| orderedFacets.facetId | string | The ID of the specific facet. |
| orderedFacets.earliestDate | string | The earliest date of observations available in this facet. |
| orderedFacets.latestDate | string | The latest date of observations available in this facet. | 
| orderedFacets.obsCount | integer | The total number of observations available in this facet. |
| observations | list of objects | Date and value pairs for the observations made in the time period |
| facets | object | Various properties of reported facets, where available. |
| facets.importName | string | The name of the [provenance](/data_model.html#sources) or [dataset](/data_model.html#sources). |
| facets.provenanceUrl | string | The URL of the provenance or dataset.
| facets.measurementMethod | string | A special measurement method used by the dataset. Not returned if unset. | 
| facets.observationPeriod | string | The time period over which the observations were recorded, in [ISO 8601 duration format](https://docs.digi.com/resources/documentation/digidocs/90001488-13/reference/r_iso_8601_duration_format.htm). Not returned if unset. |
| facets.scaling_factor | integer | The denominator used in variables representing percentages or ratios. Not returned if unset. |
| facets.unit | string | The unit of measurement used. Not returned if unset. |
| facets.is_dc_aggregate | boolean |  Set to true for variables that are auto-generated by Data Commons to aggregate observations by place hierarchies or event observations by time intervals. Not returned if false. |
{: .doc-table}

## Examples without observations

### Example 1: Look up the statistical variables available for a given entity (place)

In this example, we get a list of variables that are available (have observation data) for one country, Togo.

Parameters:
{: .example-box-title}

```
entity.dcids: "country/TGO"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&entity.dcids=country/TGO'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"  \
https://api.datacommons.org/v2/observation  \
-d '{ "entity": { "dcids": ["country/TGO"] } }'
```
Response:
{: .example-box-title}

(truncated)

```json
{
  "byVariable": {
    "AmountOutstanding_Debt_PubliclyGuaranteed_LongTermExternalDebt_LenderCountryCHE": {
      "byEntity": {
        "country/TGO": {
        }
      }
    },
    "worldBank/SP_DYN_CBRT_IN": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "MinTemp_Daily_GaussianMixture_5PctProb_LessThan_Atleast1DayAYear_CMIP6_MPI-ESM1-2-LR_SSP585": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "eia/INTL.2-12-BKWH.A": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "eia/INTL.4002-8-MMTCD.A": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "sdg/SE_AGP_CPRA.URBANISATION--R__EDUCATION_LEV--ISCED11_3__INCOME_WEALTH_QUANTILE--Q5": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/BAR_PRM_ICMP_25UP_FE_ZS": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "Amount_Debt_JPY_LenderWestAfricanDevelopmentBank_AsAFractionOf_Amount_Debt_LenderWestAfricanDevelopmentBank": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "Amount_Debt_SDR_LenderOPECFundforInternationalDev_AsAFractionOf_Amount_Debt_LenderOPECFundforInternationalDev": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "MinTemp_Daily_GaussianMixture_1PctProb_LessThan_Atleast1DayAYear_CMIP6_MPI-ESM1-2-HR_Historical": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/SH_FPL_SATM_ZS": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/SP_POP_3539_MA": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/UIS_REPP_1_G2_F": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "sdg/SG_PLN_RECRICTRY": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
...
```
{: .example-box-content .scroll}


### Example 2: Look up whether a given entity (place) has data for a given variable

In this example, we check whether we have population data, broken down by male and female, for 4 countries, Mexico, Canada, Malaysia, and Singapore. We check if the entities are associated with two variables, [`Count_Person_Male`](https://datacommons.org/browser/Count_Person_Male){: target="_blank"} and [`Count_Person_Female`](https://datacommons.org/browser/Count_Person_Female){: target="_blank"}.

Parameters:
{: .example-box-title}

```
variable.dcids: "Count_Person_Male", "Count_Person_Female"
entity.dcids: "country/MEX", "country/CAN", "country/MYS", "country/SGP"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&variable.dcids=Count_Person_Female&variable.dcids=Count_Person_Male&entity.dcids=country/CAN&entity.dcids=country/MEX&entity.dcids=country/SGP&entity.dcids=country/MYS'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"  \
https://api.datacommons.org/v2/observation  \
-d '{ "variable": { "dcids": ["Count_Person_Male", "Count_Person_Female"] }, "entity": { "dcids": ["country/CAN", "country/MEX", "country/MYS", "country/SGP"] } }'
```

Response:
{: .example-box-title}

The response shows that Canada and Mexico are associated with this variable, but not Singapore or Malaysia. (The empty brackets just mean that the facets and observations have been omitted.)

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

### Example 3: Look up whether a given entity (place) has data for a given variable and show all the available sources

This example is the same as above, but we also get the facets, to see the sources of the available data. This query shows all the facets for the available sources, but it doesn't show any observations.

Parameters:
{: .example-box-title}

```
variable.dcids: "Count_Person_Male", "Count_Person_Female"
entity.dcids: "country/MEX", "country/CAN", "country/MYS", "country/SGP"
select: "facet"
```
GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&variable.dcids=Count_Person_Female&variable.dcids=Count_Person_Male&entity.dcids=country/CAN&entity.dcids=country/MEX&entity.dcids=country/SGP&entity.dcids=country/MYS&select=facet'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"  \
https://api.datacommons.org/v2/observation  \
-d '{ "variable": { "dcids": ["Count_Person_Male", "Count_Person_Female"] }, "entity": { "dcids": ["country/CAN", "country/MEX", "country/MYS", "country/SGP"] }, "select": ["facet"] }'
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

### Example 4: Look up all the entities (places) that have data for a given variable

This example is similar to the above, but uses an entity expression to look up _all_ countries that have data for the variable `Count_Person_Female`. To do this, we use the entity `Earth` and get all countries contained in it.

Parameters:
{: .example-box-title}

```
variable.dcids: "Count_Person_Female"
entity.expression: "Earth<-containedInPlace+{typeOf:Country}"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&variable.dcids=Count_Person_Female&entity.expression=Earth%3C-containedInPlace%2B{typeOf:Country}'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"  \
https://api.datacommons.org/v2/observation  \
-d '{ "variable": { "dcids": ["Count_Person_Female"] }, "entity": { "expression": "Earth<-containedInPlace+{typeOf:Country}"} }'
```

Response:
{: .example-box-title}

```json
{
  "byVariable": {
    "Count_Person_Female": {
      "byEntity": {
        "country/DNK": {

        },
        "country/RUS": {

        },
        "country/CZE": {

        },
        "country/ETH": {

        },
        "country/GRC": {

        },
        "country/LTU": {

        },
        "country/MLT": {

        },
        "country/SWE": {

        },
        "country/FRA": {

        },
        "country/NGA": {

        },
        "country/NZL": {

        },
        "country/AUS": {

        },
        "country/CHE": {

        },
        "country/HUN": {

        },
        "country/IRL": {

        },
        "country/EGY": {

        },
        "country/FXX": {

        },
        "country/LVA": {

        },
        "country/RWA": {

        },
        "country/CRI": {

        },
        "country/PER": {

        },
        "country/BRA": {

        },
        "country/HRV": {

        },
        "country/ROU": {

        },
        "country/USA": {

        },
        "country/CHN": {

        },
        "country/CIV": {

        },
        "country/KEN": {

        },
        "country/KOR": {

        },
        "country/NLD": {

        },
        "country/NOR": {

        },
        "country/BGR": {

        },
        "country/DEU": {

        },
        "country/EST": {

        },
        "country/GBR": {

        },
        "country/ZAF": {

        },
        "country/TUN": {

        },
        "country/TUR": {

        },
        "country/AUT": {

        },
        "country/CHL": {

        },
        "country/FIN": {

        },
        "country/ISR": {

        },
        "country/ITA": {

        },
        "country/POL": {

        },
        "country/COL": {

        },
        "country/ESP": {

        },
        "country/IDN": {

        },
        "country/SVN": {

        },
        "country/MNG": {

        },
        "country/SVK": {

        },
        "country/ARG": {

        },
        "country/BEL": {

        },
        "country/CAN": {

        },
        "country/ISL": {

        },
        "country/LUX": {

        },
        "country/MEX": {

        },
        "country/IND": {

        },
        "country/JPN": {

        },
        "country/LKA": {

        },
        "country/PRT": {

        }
      }
    }
  }
}
```
{: .example-box-content .scroll}

## Examples with observations

### Example 5: Get the latest observations for a single entity by DCID

In this example, we get all the latest population observations for one country, Canada. by its DCID using `entity.dcids`. Note that in the response, there are multiple facets returned, because this variable (representing a simple population count) is used in several datasets.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/CAN"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FCAN&select=value&select=date'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/CAN"] }, "select": ["value", "date"] }'
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

### Example 6: Get the observations at a particular date for given entities by DCID

This gets observations for the median income of households in the U.S.A. and California in 2015. 

Parameters:
{: .example-box-title}

```bash
date: "2015"
variable.dcids: "Median_Income_Household"
entity.dcids: "country/USA"
entity.dcids: "geoId/06"
select: "date"
select: "value"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&variable.dcids=Median_Income_Household&entity.dcids=country%2FUSA&entity.dcids=geoId%2F06&select=date&select=value'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "2015", "variable": { "dcids": ["Median_Income_Household"] }, "entity": { "dcids": ["country/USA", "geoId/06"] }, "select": ["value", "date"] }'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "byVariable": {
    "Median_Income_Household": {
      "byEntity": {
        "country/USA": {
          "orderedFacets": [
            {
              "facetId": "1107922769",
              "observations": [
                {
                  "date": "2015",
                  "value": 53889
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
              "facetId": "1305418269",
              "observations": [
                {
                  "date": "2015",
                  "value": 61818
                }
              ],
              "obsCount": 1,
              "earliestDate": "2015",
              "latestDate": "2015"
            },
            {
              "facetId": "1107922769",
              "observations": [
                {
                  "date": "2015",
                  "value": 61818
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
    "1107922769": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S1901",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S1901&tid=ACSST5Y2023.S1901",
      "measurementMethod": "CensusACS5yrSurveySubjectTable",
      "unit": "InflationAdjustedUSD_CurrentYear"
    },
    "1305418269": {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS5yrSurvey",
      "unit": "USDollar"
    }
  }
}
```
{: .example-box-content .scroll}


### Example 7: Get all observations for selected entities by DCID

This example gets all observations for populations with doctoral degrees in the states of Wisconsin and Minnesota, represented by statistical variable  [`Count_Person_EducationalAttainmentDoctorateDegree`](https://datacommons.org/browser/Count_Person_EducationalAttainmentDoctorateDegree){: target="_blank"}. Note that we use the empty string in the `date` parameter to get all observations for this variable and entities.

Parameters:
{: .example-box-title}

```bash
date: ""
variable.dcids: "Count_Person_EducationalAttainmentDoctorateDegree"
entity.dcids: "geoId/55"
entity.dcids: "geoId/27"
select: "date"
select: "value"
```

GET Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=&variable.dcids=Count_Person_EducationalAttainmentDoctorateDegree&entity.dcids=geoId/27&entity.dcids=geoId/55&date=""&select=date&select=value'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
https://api.datacommons.org/v2/observation  \
-d '{"date": "",  "entity": {"dcids": ["geoId/27","geoId/55"]}, "variable": { "dcids": ["Count_Person_EducationalAttainmentDoctorateDegree"] }, "select": ["value", "date"] }'
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


### Example 8: Get the latest observations for entities specified by expression

In this example, we get the latest population counts for counties in California. We use a [filter expression](/api/rest/v2/#filters) to specify "all contained places in California of type `County`".

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.expression: "geoId/06<-containedInPlace+{typeOf:County}"
select: "date"
select: "value"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&date=LATEST&variable.dcids=Count_Person&entity.expression=geoId%2F06%3C-containedInPlace%2B%7BtypeOf%3ACounty%7D&select=date&select=value'
```
{: .example-box-content .scroll}

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
  https://api.datacommons.org/v2/observation \
  -d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "expression": "geoId/06<-containedInPlace+{typeOf:County}"}, "select": ["value", "date"] }'
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

### Example 9: Get the latest observations for a single entity, filtering by facet provenance (domain)

This example is the same as example #1, except it filters for a single data source, namely the U.S. government census, represented by its domain name, `www2.census.gov`.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/USA"
filter.domains: "www2.census.gov"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FUSA&filter.domains=www2.census.gov&select=value&select=date'
```
POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \  
https://api.datacommons.org/v2/observation  \ 
-d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/USA"] }, "select": ["value", "date"], "filter": {"domains": ["www2.census.gov"]}}'
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

### Example 10: Get the latest observations for a single entity, filtering by facet for a specific dataset

This example gets the latest population count of Brazil. It filters for a single dataset from the World Bank, using the facet ID `3981252704`.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
variable.dcids: "Count_Person"
entity.dcids: "country/BRA"
filter.facet_ids: "3981252704"
select: "value"
select: "date"
```

GET Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FBRA&filter.facet_ids=3981252704&select=value&select=date'
```

POST Request:
{: .example-box-title}

```bash
curl -X POST -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \
https://api.datacommons.org/v2/observation  \ 
-d '{"date": "LATEST", "variable": { "dcids": ["Count_Person"] }, "entity": { "dcids": ["country/BRA"] }, "select": ["value", "date"], "filter": {"facet_ids": ["3981252704"]} }'
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
