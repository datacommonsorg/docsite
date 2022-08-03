---
layout: default
title: Get a series of observations
nav_exclude: true
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/observations/series
 
---
 
# /v1/bulk/observations/series

Retrieve a series of observations for multiple variables and entities.
 
 
<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve a single observation within a series, use [/v1/bulk/observations/point](/api/rest/v1/observations/point)<br />.
   For single queries with a simpler output, see the [simple version](/api/rest/v1/observations/series) of this endpoint.
</div>
 
## Request

<div>
{% tabs keyword %}
 
{% tab keyword GET Request %}
GET https://api.datacommons.org/v1/bulk/observations/series?entities=entity_id1&entities=entity_id2&variables=variable_id1&variables=variable_id2
{: #api-signature}
{% endtab %}
 
{% tab keyword POST Request %}

```bash
POST \
--url https://api.datacommons.org/v1/bulk/observations/series \
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
| variables <br /><required-tag>Required</required-tag> | Repeated string | DCIDs of the variables to query observations for.
| all_facets <br /><optional-tag>Optional</optional-tag> | Boolean | Whether to return data from all facets available. If true, data from all facets available will be returned. If false, only data from the preferred facet will be returned. Defaults to false.
{: .doc-table }

## Response

The response looks like:

```json
{
   "observationsByVariable": [
       {
           "variable": "variable1_dcid",
           "observationsByEntity": [
               {
                   "entity": "entity1_dcid",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "YYYY-MM-DD",
                                   "value": 1234
                               }, ...
                           ],
                           "facet": 1234567890
                       }
                   ]
               },
               {
                   "entity": "entity2_dcid",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "YYYY-MM-DD",
                                   "value": 1234
                               }, ...
                           ],
                           "facet": 1234567890
                       }
                   ]
               }
           ]
       }, ...
       {
           "variable": "variable2_dcid",
           "observationsByEntity": [
               {
                   "entity": "entity1_dcid",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "YYYY-MM-DD",
                                   "value": 1234
                               }, ...
                           ],
                           "facet": 1234567890
                       }
                   ]
               },
               {
                   "entity": "entity2_dcid",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "YYYY-MM-DD",
                                   "value": 1234
                               }, ...
                           ],
                           "facet": 1234567890
                       }
                   ]
               }
           ]
       }
   ]
}
```

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observationsByVariable   | list   | List of observations organized by variable. These are further organized by entity, and then by facet.|
| facets    | object   | Metadata on the facet(s) the data came from. Can include things like provenance, measurement method, and units. |
{: .doc-table}

## Examples

### Example 1: Get time series for multiple variables and entities

Get total annual electric power consumption (DCID: `Annual_Consumption_Coal_ElectricPower` ) and water withdrawal rates (DCID: `WithdrawalRate_Water` ) for both Virginia (DCID: `geoId/51` ) and Texas (DCID: `geoId/48` )
 
<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
‘https://api.datacommons.org/v1/bulk/observations/series?entities=geoId/51&entities=geoId/48&variables=Annual_Consumption_Coal_ElectricPower&variables=WithdrawalRate_Water’
```

{: .example-box-content}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/observations/series \
--header 'content-type: application/json' \
--data '{"entities":["geoId/51", "geoId/48"], "variables":["Annual_Consumption_Coal_ElectricPower", "WithdrawalRate_Water"]}'
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
           "variable": "Annual_Consumption_Coal_ElectricPower",
           "observationsByEntity": [
               {
                   "entity": "geoId/48",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "2001",
                                   "value": 92437807
                               },
                               {
                                   "date": "2002",
                                   "value": 95672686
                               },
 
                              
                               <...output truncated for brevity...>
                               
 
                               {
                                   "date": "2019",
                                   "value": 63310631
                               },
                               {
                                   "date": "2020",
                                   "value": 56068974
                               }
                           ],
                           "facet": 3743503335
                       }
                   ]
               },
               {
                   "entity": "geoId/51",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "2001",
                                   "value": 15427618
                               },
                               {
                                   "date": "2002",
                                   "value": 15416555
                               },
                              
                               <...output truncated for brevity...>
                               
                               {
                                   "date": "2019",
                                   "value": 1972956
                               },
                               {
                                   "date": "2020",
                                   "value": 1814436
                               }
                           ],
                           "facet": 3743503335
                       }
                   ]
               }
           ]
       },
       {
           "variable": "WithdrawalRate_Water",
           "observationsByEntity": [
               {
                   "entity": "geoId/48",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "1985",
                                   "value": 25185.230000000014
                               },
                               {
                                   "date": "1990",
                                   "value": 26321.259999999987
                               },
                              
                               <...output truncated for brevity...>
                               
                               {
                                   "date": "2010",
                                   "value": 33382.35999999998
                               },
                               {
                                   "date": "2015",
                                   "value": 30029.560000000005
                               }
                           ],
                           "facet": 2157651424
                       }
                   ]
               },
               {
                   "entity": "geoId/51",
                   "seriesByFacet": [
                       {
                           "series": [
                               {
                                   "date": "1985",
                                   "value": 2158.1
                               },
                               {
                                   "date": "1990",
                                   "value": 2367.2300000000005
                               },
                              
                               <...output truncated for brevity...>
                               
                               {
                                   "date": "2010",
                                   "value": 8800.439999999995
                               },
                               {
                                   "date": "2015",
                                   "value": 7720.680000000003
                               }
                           ],
                           "facet": 2157651424
                       }
                   ]
               }
           ]
       }
   ]
}
```
{: .example-box-content}
 
<script src="/assets/js/tabs.js"></script>
 
