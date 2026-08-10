---
layout: default
title: Find available data
nav_order: 2
parent: REST (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# /availability

The Availability API allows you to find out what data and metadata is available for a given variable, without getting the observations. You can get a list of provenances, entities (places), and other metadata, if available. 

## Request syntax

The basic syntax for the Availability API is as follows:

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/<var>OBSERVATION_FIELD</var>?key=<var>YOUR_API_KEY</var>c[variableMeasured]=<var>VARIABLE_DCIDS</var>&c[<var>OBSERVATION_FIELD</var>]=<var>ENTITY_DCIDS</var>&...c[<var>TIME_PERIOD</var>]=<var>DATES</var>
</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Query parameters

| Parameter | Description | Valid values |
| :--- | :--- | :--- |
| key <br /><required-tag>Required</required-tag> | Your API key. See the section on [authentication](index.md#authentication) for details. |
| _OBSERVATION_FIELD_ <br /><required-tag>Required</required-tag> | The property for which available data should be returned. Supported properties are: <br /><ul><li>`observationAbout`: Return all entities/places that have data for this variable. Use this for single-entity statistical variables. </li>
<li>Custom <code>observationProperties</code> dimension: Return all entities that have data for this custom property. Use this for multi-entity statistical variables. </li>
<li><code>provenance</code>: Return all provenances associated with observations for this variable.</li>
<li><code>unit</code>: Return all units that are specified in observations associated with this variable</li>
<li><code>measurementMethod</code>: Return all measurement methods that are specified in observations associated with this variable.</li>
</ul>
<li><code>observationPeriod</code>: Return all observation periods that are specified in observations associated with this variable.</li></ul> | n/a |
| variableMeasured <br /><required-tag>Required</required-tag> | The statistical variable(s) about which you are looking up data availability. | Comma-separated list of statistical variable DCIDs |
| _OBSERVATION_FIELD_ <br/><optional-tag>Optional</optional-tag> | Additional property or properties by which you would like to filter results. The _OBSERVATION_FIELD_ is any of the properties listed above. <br/> For custom observation properties, up to 3 are supported.<br/>
In addition, for place-type entities, you can filter by place type and parent, using the qualifiers <code>containedInPlace+</code> and <code>typeOf</code>. If you use these, you must specify both parameters. See the examples below for the syntax.<br/>
Multiple filter properties are ANDed together. |
| <ul><li>For <code>observationAbout</code>, custom observation properties, and <code>provenance</code>: comma-separated list of DCID values for the selected observation property. </li>
<li>For all others: see their respective entries in the [Glossary](/glossary.html)</li>
</ul><br/>
Each value applies to all variables specified in the <code>variableMeasured</code> parameter.</td> |
| TIME_PERIOD <br/><optional-tag>Optional</optional-tag> | Filter results by a specific time period. If not specified, defaults to all results. | Comma-separated dates, in the format <em>YYYY</em>, <em>YYYY</em>-<em>MM</em>, or <em>YYYY</em>-<em>MM</em>-<em>DD</em>. |
{: .doc-table }

At this time, the following parameters are accepted but redundant:

-  `mode`: only the default `exact` is supported
-  `references`: only the default `none` is supported
-  `format`: only `sdmx-json` is supported

The only supported operator is `eq` (which is the same as `=`).

## Response format

The Availability API returns responses in SDMX-JSON format 2.0.0. It looks like this:

<pre>
{
  "$schema": "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
  "data": {
    "dataConstraints": [
      {
        "id": "DF_OBS_AVAILABILITY",
        "agencyID": "DC",
        "version": "1.0.0",
        "name": "Available DF_OBS data",
        "role": "Actual",
        "cubeRegions": [
          {
            "include": true,
            "keyValues": [
              {
                "id": "<var>OBSERVATION_PROPERTY</var>",
                "include": true,
                "values": [
                  "<var>VALUE1</var>",
                  "<var>VALUE2</var>",
                  ...
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
</pre>
{: .response-signature .scroll}

## Examples

### Example 1: Look up whether a given entity (place) has data for a given variable

In this example, we discover whether the graph contains population data, broken down by male and female, for 4 countries, Mexico, Canada, Malaysia, and Singapore, for any dates. To do so, we check whether the entities are associated with two variables, [`Count_Person_Male`](https://datacommons.org/browser/Count_Person_Male){: target="_blank"} and [`Count_Person_Female`](https://datacommons.org/browser/Count_Person_Female){: target="_blank"}.

Parameters:
{: .example-box-title}

<pre>
<var>OBSERVATION_FIELD</var>: observationAbout
variableMeasured: Count_Person_Male,Count_Person_Female
observationAbout: country/MEX,country/MYS,country/SGP,country/CAN
</pre>

Request
{: .example-box-title}
```bash
curl -g \
'https://api.datacommons.org/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/observationAbout?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person_Female,Count_Person_Male&c[observationAbout]=country/MEX,country/MYS,country/SGP,country/CAN'

```
{: .example-box-content .scroll}

Response
{: .example-box-title}
```json
{
   "$schema" : "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
   "data" : {
      "dataConstraints" : [
         {
            "agencyID" : "DC",
            "cubeRegions" : [
               {
                  "include" : true,
                  "keyValues" : [
                     {
                        "id" : "observationAbout",
                        "include" : true,
                        "values" : [
                           "country/CAN",
                           "country/MEX"
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
   }
}
```
{: .example-box-content .scroll}

### Example 2: Get all the entities (places) that have data for a specific variable, filtered for a specific year

This example gets all the countries that have data for the year 2020 for the variable `Count_Person_Female`. We use the `containedInPlace+` and `typeOf` filters. Note that you must URL-encode the `+` character.

<pre>
<var>OBSERVATION_FIELD</var>: observationAbout
variableMeasured: Count_Person_Female
observationAbout.containedInPlace+: Earth
observationAbout.typeOf: Country
TIME_PERIOD: 2020
</pre>

Request
{: .example-box-title}
```bash
curl -H "X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI" \ 
-g "https://api.datacommons.org/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/observationAbout?c[variableMeasured]=Count_Person_Female&c[observationAbout.containedInPlace%2B]=Earth&c[observationAbout.typeOf]=Country&c[TIME_PERIOD]=2020" 
```
{: .example-box-content .scroll}

Response
{: .example-box-title}
```json
{
   "$schema" : "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
   "data" : {
      "dataConstraints" : [
         {
            "agencyID" : "DC",
            "cubeRegions" : [
               {
                  "include" : true,
                  "keyValues" : [
                     {
                        "id" : "observationAbout",
                        "include" : true,
                        "values" : [
                           "country/AUS",
                           "country/AUT",
                           "country/BEL",
                           "country/BGR",
                           "country/CAN",
                           "country/CHE",
                           "country/CHL",
                           "country/CIV",
                           "country/COL",
                           "country/CRI",
                           "country/CZE",
                           "country/DEU",
                           "country/DNK",
                           "country/ESP",
                           "country/EST",
                           "country/FIN",
                           "country/FRA",
                           "country/FXX",
                           "country/GBR",
                           "country/GRC",
                           "country/HRV",
                           "country/HUN",
                           "country/IDN",
                           "country/IND",
                           "country/IRL",
                           "country/ISL",
                           "country/ISR",
                           "country/ITA",
                           "country/JPN",
                           "country/KOR",
                           "country/LTU",
                           "country/LUX",
                           "country/LVA",
                           "country/MEX",
                           "country/MLT",
                           "country/MNG",
                           "country/NLD",
                           "country/NOR",
                           "country/NZL",
                           "country/PER",
                           "country/POL",
                           "country/PRT",
                           "country/ROU",
                           "country/RUS",
                           "country/SVK",
                           "country/SVN",
                           "country/SWE",
                           "country/TUR",
                           "country/USA"
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
   }
}
```
{: .example-box-content .scroll}


### Example 3: Get all the entities that have data for a specific value of a constraint property

This example gets all the countries that have data about females `.

Request

undefined

Response

undefined

#### Example 4: Get the entities that have data for a specific property of a multi-entity variable, filtered by entity (place) type and parent

This example gets the countries in Europe that have data about females, for a multi-entity variable, `Adult_curr_cig_smokers_by_sex`.

##### Request

undefined

##### Response

undefined 

* TOC
{:toc}



### Example 2: Look up whether a given entity (place) has data for a given variable

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

