---
layout: default
title: Get an observation
nav_exclude: true
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/observations/point
 
---
 
 
 

# /v1/bulk/observations/point

 
Retrieve a specific value from multiple variables for multiple entities.
 
 
<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve the entire series of values, use [/v1/bulk/observations/series](/api/rest/v1/observations/series)<br />
   For single queries with a simpler output, see the [simple version](/api/rest/v1/observations/point) of this endpoint
</div>
 

## Request

 
<div>
{% tabs keyword %}
 
{% tab keyword GET Request %}
GET https://api.datacommons.org/v1/bulk/observations/point?entities=entity_dcid_1&entities=entity_dcid_2&variables=variable_dcid_1&variables=variable_dcid_2
{: #api-signature}
<script src="/assets/js/syntax_highlighting.js"></script>
 
{% endtab %}
 
{% tab keyword POST Request %}

```bash
POST \
--url https://api.datacommons.org/v1/bulk/observations/point \
--header 'content-type: application/json' \
--data '{
   "entities": [
       "entity_dcid_1",
       "entity_dcid_2",
       ...
   ],
   "variables: [
       "variable_dcid_1",
       "variable_dcid_2",
       ...
   ]
}'
```

<script src="/assets/js/syntax_highlighting.js"></script>
{% endtab %}
 
{% endtabs %}
</div>
 

### Parameters

 

#### Path Parameters

 
There are no path parameters for this endpoint.
 

#### Query Parameters

 
| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| entities <br /><required-tag>Required</required-tag> | Repeated string | DCIDs of the entities the variables describe. |
| variables <br /><required-tag>Required</required-tag> | Repeated string | DCIDs of the variables to query observations for.|
| date <br /> <optional-tag>Optional</optional-tag> | string | Datetime of measurement of the value requested in ISO 8601 format. To see the dates available, look up the variable in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). If date is not provided, the latest available datapoint is returned.  |
| all_facets <br /><optional-tag>Optional</optional-tag> | Boolean | Whether to return data from all [facets](/api/rest/v1/) available. If true, data from all facets available will be returned. If false, only data from the preferred facet will be returned. Defaults to false.
{: .doc-table }
 
 

## Response

 
The response looks like:
 

```json
{
 "observationsByVariable": [
   {
     "variable": "variable1_DCID",
     "observationsByEntity": [
       {
         "entity": "entity1_DCID",
         "pointsByFacet": [
           {
             "date": "YYYY",
             "value": 1234,
             "facet": 1234567890
           }, ...
         ]
       },
     ]
   }
 ],
 "facets": {
   "1234567890": {
     "importName": "Import_name_string",
     "provenanceUrl": "https://provenance.url",
     "measurementMethod": "MeasurementMethod"
   } ...     
 }
}
```

 

### Response fields

 
| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observationsByVariable   | list   | List of observations organized by variable. These are further organized by entity, and then by facet.|
| facets    | object   | Metadata on the facet(s) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}
 

## Examples

 

### Example 1: Get values for multiple variables and entities from the preferred facet **at a set date**

 
Get latest count of men (DCID: `Count_Person_Male` ) and count of women (DCID: `Count_Person_Female` ) for both California (DCID: `geoId/06` ) and Texas (DCID: `geoId/48` ) in 2019.
 
<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/observations/point?entities=geoId/06&entities=geoId/48&variables=Count_Person_Male&variables=Count_Person_Female&date=2019'
```

{: .example-box-content}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/observations/point \
--header 'content-type: application/json' \
--data '{"entities":["geoId/06", "geoId/48"], "variables":["Count_Person_Male", "Count_Person_Female"], "date":"2019"}'
```

{: .example-box-content}
 
{% endtab %}
 
{% endtabs %}
</div>
 
Response:
{: .example-box-title}

```json
{
   "observationsByVariable": [
       {
           "variable": "Count_Person_Male",
           "observationsByEntity": [
               {
                   "entity": "geoId/06",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 19526298,
                           "facet": 1145703171
                       }
                   ]
               },
               {
                   "entity": "geoId/48",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 14034009,
                           "facet": 1145703171
                       }
                   ]
               }
           ]
       },
       {
           "variable": "Count_Person_Female",
           "observationsByEntity": [
               {
                   "entity": "geoId/06",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 19757199,
                           "facet": 1145703171
                       }
                   ]
               },
               {
                   "entity": "geoId/48",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 14226847,
                           "facet": 1145703171
                       }
                   ]
               }
           ]
       }
   ],
   "facets": {
       "1145703171": {
           "importName": "CensusACS5YearSurvey",
           "provenanceUrl": "https://www.census.gov/",
           "measurementMethod": "CensusACS5yrSurvey"
       }
   }
}
```
{: .example-box-content}
 

### Example 2: Get values for multiple variables and entities **from all facets**

 
Get latest count of men (DCID: `Count_Person_Male` ) and count of women (DCID: `Count_Person_Female` ) for both California (DCID: `geoId/06` ) and Texas (DCID: `geoId/48` ) for all facets.
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/observations/point?entities=geoId/06&entities=geoId/48&variables=Count_Person_Male&variables=Count_Person_Female&all_facets=true'
```
{: .example-box-content}
 
Response:
{: .example-box-title}

```json
{
   "observationsByVariable": [
       {
           "variable": "Count_Person_Male",
           "observationsByEntity": [
               {
                   "entity": "geoId/06",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 19526298,
                           "facet": 1145703171
                       },
                       {
                           "date": "2019",
                           "value": 19640794,
                           "facet": 1226172227
                       },
                       {
                           "date": "2019",
                           "value": 19523898.009,
                           "facet": 10983471
                       },
                       {
                           "date": "2019",
                           "value": 19523898.009,
                           "facet": 196790193
                       },
                       {
                           "date": "2018",
                           "value": 19663600,
                           "facet": 1151455814
                       }
                   ]
               },
               {
                   "entity": "geoId/48",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 14034009,
                           "facet": 1145703171
                       },
                       {
                           "date": "2019",
                           "value": 14385762,
                           "facet": 1226172227
                       },
                       {
                           "date": "2019",
                           "value": 14045645.432,
                           "facet": 10983471
                       },
                       {
                           "date": "2019",
                           "value": 14045645.432,
                           "facet": 196790193
                       },
                       {
                           "date": "2018",
                           "value": 14260100,
                           "facet": 1151455814
                       }
                   ]
               }
           ]
       },
       {
           "variable": "Count_Person_Female",
           "observationsByEntity": [
               {
                   "entity": "geoId/06",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 19757199,
                           "facet": 1145703171
                       },
                       {
                           "date": "2019",
                           "value": 19871429,
                           "facet": 1226172227
                       },
                       {
                           "date": "2019",
                           "value": 19759598.991,
                           "facet": 10983471
                       },
                       {
                           "date": "2019",
                           "value": 19759598.991,
                           "facet": 196790193
                       },
                       {
                           "date": "2018",
                           "value": 19817700,
                           "facet": 1151455814
                       }
                   ]
               },
               {
                   "entity": "geoId/48",
                   "pointsByFacet": [
                       {
                           "date": "2019",
                           "value": 14226847,
                           "facet": 1145703171
                       },
                       {
                           "date": "2019",
                           "value": 14610119,
                           "facet": 1226172227
                       },
                       {
                           "date": "2019",
                           "value": 14215210.568,
                           "facet": 10983471
                       },
                       {
                           "date": "2019",
                           "value": 14215210.568,
                           "facet": 196790193
                       },
                       {
                           "date": "2018",
                           "value": 14250900,
                           "facet": 1151455814
                       }
                   ]
               }
           ]
       }
   ],
   "facets": {
       "10983471": {
           "importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
           "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A",
           "measurementMethod": "CensusACS5yrSurveySubjectTable"
       },
       "196790193": {
           "importName": "CensusACS5YearSurvey_SubjectTables_S2602",
           "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602",
           "measurementMethod": "CensusACS5yrSurveySubjectTable"
       },
       "1145703171": {
           "importName": "CensusACS5YearSurvey",
           "provenanceUrl": "https://www.census.gov/",
           "measurementMethod": "CensusACS5yrSurvey"
       },
       "1151455814": {
           "importName": "OECDRegionalDemography",
           "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#",
           "measurementMethod": "OECDRegionalStatistics",
           "observationPeriod": "P1Y"
       },
       "1226172227": {
           "importName": "CensusACS1YearSurvey",
           "provenanceUrl": "https://www.census.gov/",
           "measurementMethod": "CensusACS1yrSurvey"
       }
   }
}
```
{: .example-box-content}
 
<script src="/assets/js/tabs.js"></script>
 
