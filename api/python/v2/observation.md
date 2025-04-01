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
| [fetch_available_statistical_variables](#fetch_available_statistical_variables) | Fetch the statistical variables available for a given entity or entities. |
| [fetch_observations_by_entity](#fetch_observations_by_entity) | Fetch observations for specified variables, dates and entities by DCID. |
| [fetch_observations_by_entity_type](fetch_observations_by_entity_type) | Fetch observations for specified variables and dates, by entity type and parent entity |
| [fetch_latest_observations](#fetch_latest_observations) | Fetch latest observations for specified variables, by entity DCID or [relation expression](/api/rest/v2/index.html#relation-expressions). |
| [fetch_latest_observations_by_entity](#fetch_latest_observations_by_entity) | Fetch latest observations for specified variables, by entity DCID. |

## Response

## Response {#response}

With no `select` parameter specified, the default response looks like this:

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

With `select=["variable", "select=entity"]`, the response looks like the following. Note the empty brackets after the entity DCIDs; this simply means that the facet and observation data have been omitted from the response.

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

With `select=["variable", "entity", "facet"]`, the response looks like:

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

There are additional methods you can call on the response to structure the data differently. See [Response property methods](#response-property-methods) for details.

### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| orderedFacets | list of objects | Metadata about the observations returned, keyed first by variable, and then by entity. These include the date range, the number of observations included in the facet and so on. |
| observations | list of objects | Date and value pairs for the observations made in the time period |
| facets | object | Various properties of reported facets, where available, including the provenance of the data, the import name, date range of observations, etc. |
{: .doc-table}

### Response property methods

| Method | Description | 
|--------|-------------|
| to_json | Return the result as a JSON string. See [Response formatting](index.md#response-formatting) for details. |
| to_dict | Return the result as a dictionary. See [Response formatting](index.md#response-formatting) for details. |
| get_data_by_entity | Key the response data by entity rather than by variable. See xxx for examples. |
| get_observations_as_records | Get the response data as a series of flat records. See xxx for examples. |
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
| variable_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| date <br/><optional-tag>Optional</optional-tag> | string or string literal | The date (and time) for which the observations are being requested. By default this is set to `LATEST`, which returns the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. Other allowed values are: <br>
* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see [Find the date format for a statistical variable](/api/rest/v2/observation.html#find-date-format).<br>
* "all" - Get all observations for the specified variables and entities  |
| select <optional-tag>Optional</optional-tag> | list of string literals | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`, which returns actual observations, with the date and value for each variable and entity queried. One observation is returned for every facet (dataset) in which the variable appears. Other valid options are:<br/>* 
* `["entity", "variable"]`: returns no observations.  You can use this to first check whether a given entity (or entities) has data for a given variable or variables, before fetching the observations.<br/>* `["entity", "variable", "facet"]` : returns no observations but does return all the _facets_ as well, which show the sources of the data.
| entity_dcids | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| entity.expression  | string | A [relation expression](/api/rest/v2/index.html#relation-expressions) that represents the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| filter.facet_domains <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of domain names. You can use this to filter results by provenance. |
| filter.facet_ids <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of existing [facet IDs](#response) that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. |
{: .doc-table }

### Examples

{: .no_toc}
#### Example 1: Look up whether a given entity (place) has data for a given variable

In this example, we check whether we have population data, broken down by male and female, for 4 countries, Mexico, Canada, Malaysia, and Singapore. We check if the entities are associated with two variables, [`Count_Person_Male`](https://datacommons.org/browser/Count_Person_Male){: target="_blank"} and [`Count_Person_Female`](https://datacommons.org/browser/Count_Person_Female){: target="_blank"}, and use the `select` options of only `entity` and `variable` to omit observations.

Request:
{: .example-box-title}

```python
client.observation.fetch(variable_dcids=["Count_Person_Female", "Count_Person_Male"], select=["entity", "variable"], entity_dcids=["country/CAN", "country/MEX", "country/SGP", "country/MYS"])
```
{: .example-box-content .scroll}

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

### Example 2: Look up whether a given entity (place) has data for a given variable and show the sources

This example is the same as above, but we also get the facets, to see the sources of the available data.

Request:
{: .example-box-title}

```python
client.observation.fetch(variable_dcids=["Count_Person_Female", "Count_Person_Male"], select=["entity", "variable", "facet"], entity_dcids=["country/CAN", "country/MEX", "country/SGP", "country/MYS"])
```
{: .example-box-content .scroll}

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

## fetch_available_statistical_variables

Look up the statistical variables available for one or more entities (places).

### Signature

```python
fetch_available_statistical_variables(entity_ids)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| entity_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the entities to query. |

### Examples

#### Example 1: Look up the statistical variables available for a given entity (place)

In this example, we get a list of variables that are available (have observation data) for one country, Togo.

Request:
{: .example-box-title}

```python
client.observation.fetch_available_statistical_variables(entity_dcids=["country/TGO"])
```
{: .example-box-content .scroll}

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
    "AmountOutstanding_Debt_OfficialCreditor_Concessional_PubliclyGuaranteed_Multilateral_LongTermExternalDebt_LenderArabBankforEconomicDevinAfrica": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "Annual_Consumption_Fuel_OtherManufacturingIndustry_Fuelwood": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "Annual_Emissions_GreenhouseGas_FuelCombustionForRoadVehicles": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/account_t_d_8": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "AmountPrincipalRepayment_Debt_OfficialCreditor_PubliclyGuaranteed_LongTermExternalDebt_LenderCountryCAN": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "Amount_Debt_WorldBankMultipleCurrency_LenderWorldBankIDA_AsAFractionOf_Amount_Debt_LenderWorldBankIDA": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/BX_GSR_TOTL_CD": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/SH_STA_AIRP_P5": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "AmountPrincipalRepayment_Debt_PubliclyGuaranteed_LongTermExternalDebt_LenderCountryDNK": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "eia/INTL.12-1-MTOE.A": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "sdg/ER_MTN_DGRDP": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "sdg/SP_ACS_BSRVH2O": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/BAR_NOED_7074_FE_ZS": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/SP_POP_AG05_FE_IN": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/UIS_PTRHC_02_TRAINED": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/UIS_XUNIT_US_3_FSGOV": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "LocalCurrency_ExchangeRate_Currency_FromCurrency_USD_ToCurrencyUSD": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "MaxTemp_Daily_Hist_95PctProb_Greater_Atleast1DayADecade_CMIP6_MPI-ESM1-2-HR_Historical": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "MinTemp_Daily_GaussianMixture_50PctProb_LessThan_Atleast1DayAYear_CMIP6_Ensemble_SSP245": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/fin17b_t_d_2": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "Amount_Debt_FRF_AsAFractionOf_Amount_Debt": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "sdg/SP_GNP_WNOWNS": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
    "worldBank/NY_GDY_TOTL_KN": {
      "byEntity": {
        "country/TGO": {

        }
      }
    },
```
{: .example-box-content .scroll}

## fetch_observations_by_entity

Fetches observations for the specified variables, dates, and entities.

### Signature

```python
fetch_observations_by_entity(date, entity_dcids, variable_dcids, select, filter_facet_domains, filter_facet_ids)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| date <br/><required-tag>Required</required-tag> | string or string literal | The date (and time) for which the observations are being requested. Allowed values are: <br/>* `latest`: return the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. <br/>* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`.<br/>* "all" - Get all observations for the specified variables and entities  |
| entity_dcids <br/><required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the entities to query. |
| variable_dcids <br/><required-tag>Required<required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| select <optional-tag>Optional</optional-tag> | list of string literals | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`, which returns actual observations, with the date and value for each variable and entity queried. One observation is returned for every facet (dataset) in which the variable appears. Other valid options are:<br/>* 
* `["entity", "variable"]`: returns no observations.  You can use this to first check whether a given entity (or entities) has data for a given variable or variables, before fetching the observations.<br/>* `["entity", "variable", "facet"]`: returns no observations but does return all the _facets_ as well, which show the sources of the data.
| filter.facet_domains <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of domain names. You can use this to filter results by provenance. |
| filter.facet_ids <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of existing [facet IDs](#response) that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. |
{: .doc-table }

## fetch_observations_by_entity_type

Fetch observations for multiple entities (places) grouped by parent and type.

### Signature

```python
fetch_observations_by_entity_type(date, entity_dcids, variable_dcids, select, filter_facet_domains, filter_facet_ids)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| date <br/><required-tag>Required</required-tag> | string or string literal | The date (and time) for which the observations are being requested. Allowed values are: <br>* `latest`: return the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. </br>* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see [Find the date format for a statistical variable](/api/rest/v2/observation.html#find-date-format).<br> * "all" - Get all observations for the specified variables and entities  |
| parent_entity <br/><required-tag>Required</required-tag> | string | The DCID of the parent entities to query; for example, `africa` for African countries, or `Earth` for all countries. |
| entity_type <br/><required-tag>Required</required-tag> | string | The DCID of the type of the entities to query; for example, `Country` or `Region`. | 
| variable_dcids <br/><required-tag>Required<required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| select <optional-tag>Optional</optional-tag> | list of string literals | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`, which returns actual observations, with the date and value for each variable and entity queried. One observation is returned for every facet (dataset) in which the variable appears. Other valid options are:<br/>* 
* `["entity", "variable"]`: returns no observations.  You can use this to first check whether a given entity (or entities) has data for a given variable or variables, before fetching the observations.<br/>* `["entity", "variable", "fetch]` : returns no observations but does return all the _facets_ as well, which show the sources of the data. |
| filter.facet_domains <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of domain names. You can use this to filter results by provenance. |
| filter.facet_ids <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of existing [facet IDs](#response) that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. |
{: .doc-table }

### Examples 

#### Example 1: Get all observations for a selected variable for child entities

Ths example gets all observatons for the proportion of population below the international poverty line for all countries in Africa. 

Request:
{: .example-box-title}

```python
client.observation.fetch_observations_by_entity_type(date="all", parent_entity="africa", entity_type="Country", variable_dcids="sdg/SI_POV_DAY1")
```
{: .example-box-content .scroll}

> Tip: This example is equivalent to `client.observation.fetch(variable_dcids="sdg/SI_POV_DAY1", date="all", entity_expression="africa<-containedInPlace+{typeOf:Country}")`

Response:
{: .example-box-title}

json```


```
{: .example-box-content .scroll}

## fetch_latest_observations

Fetch the latest observations for the selected variables and entities, specified by DCID or expression.

### Signature

```python
fetch_latest_observations(variable_dcids, entity_dcids, entity_expression, select, filter_facet_domains, filter_facet_ids)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/><required-tag>Required<required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| entity_dcids | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| entity.expression  | string | A [relation expression](/api/rest/v2/index.html#relation-expressions) that represents the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| select <optional-tag>Optional</optional-tag> | list of string literals | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`, which returns actual observations, with the date and value for each variable and entity queried. One observation is returned for every facet (dataset) in which the variable appears. Other valid options are:<br/>* 
* `["entity", "variable"]`: returns no observations.  You can use this to first check whether a given entity (or entities) has data for a given variable or variables, before fetching the observations.<br/>* `["entity", "variable", "fetch]` : returns no observations but does return all the _facets_ as well, which show the sources of the data.
| filter.facet_domains <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of domain names. You can use this to filter results by provenance. |
| filter.facet_ids <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of existing [facet IDs](#response) that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. |
{: .doc-table }

## fetch_latest_observations_by_entity

Fetch the latest observations for the selected entities and variables.

### Signature

```python
fetch_latest_observationsby_entity(variable_dcids, entity_dcids, select, filter_facet_domains, filter_facet_ids)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/><required-tag>Required<required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| entity_dcids | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| select <optional-tag>Optional</optional-tag> | list of string literals | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`, which returns actual observations, with the date and value for each variable and entity queried. One observation is returned for every facet (dataset) in which the variable appears. Other valid options are:<br/>* 
* `["entity", "variable"]`: returns no observations.  You can use this to first check whether a given entity (or entities) has data for a given variable or variables, before fetching the observations.<br/>* `["entity", "variable", "fetch]` : returns no observations but does return all the _facets_ as well, which show the sources of the data.
| filter.facet_domains <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of domain names. You can use this to filter results by provenance. |
| filter.facet_ids <br /><optional-tag>Optional</optional-tag> | string or list of strings | Comma-separated list of existing [facet IDs](#response) that you have obtained from previous observation API calls. You can use this to filter results by several properties, including dataset name, provenance, measurement method, etc. |
{: .doc-table }


#### Example 4: Get the latest observations for a single entity by DCID

In this example, we get all the latest population observations for one country, Canada. by its DCID using `entity.dcids`. Note that in the response, there are multiple facets returned, because this variable (representing a simple population count) is used in several datasets.

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country%2FCAN&select=entity&select=variable&select=value&select=date'
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



### Example 5: Get the observations at a particular date for given entities by DCID

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
{: .example-box-content .scroll}
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


### Example 6: Get all observations for selected entities by DCID

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
```
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


### Example 1: Retrieve the count of men in the state of California.

```python
>>> datacommons.get_stat_series("geoId/05", "Count_Person_Male")
{'2011': 1421287, '2012': 1431252, '2013': 1439862, '2014': 1447235, '2015': 1451913, '2016': 1456694, '2017': 1461651, '2018': 1468412}
```

### Example 2: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

```python
>>> datacommons.get_stat_series("country/BIH", "Count_Person", measurement_method="BosniaCensus")
{'2013': 3791622}
```

### Example 3: Retrieve the death count in Miami-Dade County over a period of one year.

```python
>>> datacommons.get_stat_series("geoId/12086", "Count_Death", observation_period="P1Y")
{'1999': 19170, '2001': 19049, '2002': 18176, '2009': 17806, '2012': 18621, '2015': 19542, '2005': 18400, '2008': 18012, '2010': 18048, '2017': 20703, '2000': 18540, '2003': 18399, '2006': 18261, '2013': 18473, '2014': 19013, '2004': 18384, '2007': 17982, '2011': 17997, '2016': 20277}
```

### Example 4: Retrieve the distrubtion of naloxone in Miami-Dade County in grams.

```python
>>> datacommons.get_stat_series("geoId/12086", "RetailDrugDistribution_DrugDistribution_Naloxone", unit="Grams")
{'2007-07': 80.34, '2007-10': 118.79, '2006-01': 44.43, '2006-04': 48.28, '2006-07': 54.98, '2006-10': 55.21, '2007-01': 59.63, '2007-04': 65.98}
```

### Example 5: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

```python
>>> datacommons.get_stat_series("country/GMB", "Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal", scaling_factor="100.0000000000")
{'1986': 3.48473, '1996': 2.56628, '2000': 1.46587, '2010': 4.1561, '2014': 2.17849, '2012': 4.10118, '2013': 1.82979, '1999': 1.56513, '1985': 4.29515, '1992': 1.16984, '1995': 2.55356, '2002': 1.44292, '2015': 2.13528, '2005': 1.13919, '2018': 2.43275, '2008': 3.52738, '2016': 2.05946, '1989': 2.97409, '1990': 2.82584, '1991': 3.78061, '2011': 3.92511, '2004': 1.0345, '2007': 1.30849, '2009': 3.07235, '2001': 1.1581, '2003': 1.36338, '2006': 1.20949}
```

