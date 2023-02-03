---
layout: default
title: Series of Observations
nav_order: 108
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/bulk/observations/series
is_bulk: true 
---
 
# /v1/bulk/observations/series

Retrieve a series of observations for multiple variables and entities.
 
 
<div markdown="span" class="alert alert-warning" role="alert">
   <span class="material-icons md-16">info </span><b>See Also:</b><br />
   To retrieve a single observation within a series, use [/v1/bulk/observations/point](/api/rest/v1/observations/point).<br />
   For single queries with a simpler output, see the [simple version](/api/rest/v1/observations/series) of this endpoint.
</div>
 
## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div>


<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/observations/series?entities={entity_dcid_1}&entities={entity_dcid_2}&variables={variable_dcid_1}&variables={variable_dcid_2}&key={your_api_key}
</div>


<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/observations/series

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities": [
    "{entity_dcid_1}",
    "{entity_dcid_2}",
    ...
  ],
  "variables": [
    "{variable_dcid_1}",
    "{variable_dcid_2}",
    ...
  ]
}
</div>


<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>
 


### Path Parameters

There are no path parameters for this endpoint.

### Query Parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| entities <br /><required-tag>Required</required-tag> | Repeated string | [DCIDs](/glossary.html#dcid) of the entities the variables describe. |
| variables <br /><required-tag>Required</required-tag> | Repeated string | [DCIDs](/glossary.html#dcid) of the variables to query observations for.
| all_facets <br /><optional-tag>Optional</optional-tag> | Boolean | Whether to return data from all [facets](/glossary.html#facet) available. If true, data from all facets available will be returned. If false, only data from the [preferred facet](/glossary.html#preferred-facet) will be returned. Defaults to false.
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
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| observationsByVariable   | list   | List of observations organized by variable. These are further organized by entity, and then by [facet](/glossary.html#facet). Observations are returned in chronological order. |
| facets    | object   | Metadata on the [facet(s)](/glossary.html#facet) the data came from. Can include things like provenance, measurement method, and units. |
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
'https://api.datacommons.org/v1/bulk/observations/series?entities=geoId/51&entities=geoId/48&variables=Annual_Consumption_Coal_ElectricPower&variables=WithdrawalRate_Water&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/observations/series \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":["geoId/51", "geoId/48"], "variables":["Annual_Consumption_Coal_ElectricPower", "WithdrawalRate_Water"]}'
```
{: .example-box-content .scroll}
 
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
{: .example-box-content .scroll}
 
<script src="/assets/js/tabs.js"></script>
 
