---
layout: default
title: Variables
parent: v1 REST
grand_parent: API
nav_exclude: true
published: false
permalink: /api/rest/v1/bulk/variables
---

# /v1/bulk/variables

Get all [variables](/glossary.html#variable) associated with a specific entity, for multiple entities.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For querying a single entity with simpler output, see the [simple version](/api/rest/v1/variables) of this endpoint.
</div>
 

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET Request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST Request
  </button>
</div> 

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/variables?entities={entity_dcid_1}&entities={entity_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/variables

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "entities": [
    "{entity_dcid_1}",
    "{entity_dcid_2}",
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
| variables | list | List of variables associated with the entity queried. |
{: .doc-table }
 
 

## Response

 
The response looks like:
 
```json
{
  "data":
  [
    {
      "entity": "entity_dcid_1",
      "variables":
      [
        "variable_dcid_1",
        "variable_dcid_2",
        ...
      ]
    },
    {
      "entity": "entity_dcid_2",
      "variables":
      [
        "variable_dcid_1",
        "variable_dcid_2",
        ...
      ], ...
    }
  ]
}
```
{: .response-signature .scroll}
 

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| entity   | string   | [DCID](/glossary.html#dcid) of the entity queried. |
| variables | list | List of variables connected to the entity queried. |
{: .doc-table}
 

## Examples

 

### Example 1: Get variables associated with multiple entities.

Get variables for the cities of Tokyo, Japan (DCID: `wikidataId/Q1490`) and Seoul, South Korea (DCID: `wikidataId/Q8684`).

<div>
{% tabs example1 %}
 
{% tab example1 GET Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/variables?entities=wikidataId/Q1490&entities=wikidataId/Q8684&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
 
{% tab example1 POST Request %}
 
Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/variables \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"entities":["wikidataId/Q1490", "wikidataId/Q8684"]}'
```
{: .example-box-content .scroll}
 
{% endtab %}
 
{% endtabs %}
</div>
 
Response:
{: .example-box-title}

```json
{
  "data":
  [
    {
      "entity": "wikidataId/Q1490",
      "variables":
      [
        "Count_CycloneEvent",
        "Count_CycloneEvent_TropicalStorm",
        "Count_Person",
        "Max_Rainfall",
        "Max_Snowfall",
        "Max_Temperature",
        "Mean_BarometricPressure",
        "Mean_Rainfall",
        "Mean_Snowfall",
        "Mean_Temperature",
        "Mean_Visibility",
        "Min_Rainfall",
        "Min_Snowfall",
        "Min_Temperature"
      ]
    },
    {
      "entity": "wikidataId/Q8684",
      "variables":
      [
        "Count_Death",
        "Count_Death_10To14Years_Female",
        "Count_Death_10To14Years_Male",
        "Count_Death_15To19Years",
        "Count_Death_15To19Years_Male",
        "Count_Death_15To64Years",
        "Count_Death_15To64Years_Female",
        "Count_Death_15To64Years_Male",
        "Count_Death_20To24Years",
        "Count_Death_20To24Years_Female",
        "Count_Death_20To24Years_Male",
        "Count_Death_25To29Years_Female",
        "Count_Death_25To29Years_Male",
        "Count_Death_25To34Years",
        "Count_Death_25To34Years_Female",
        "Count_Death_25To34Years_Male",
        "Count_Death_30To34Years",
        "Count_Death_30To34Years_Female",
        "Count_Death_30To34Years_Male",
        "Count_Death_35To39Years_Male",
        "Count_Death_35To44Years_Female",
        "Count_Death_35To44Years_Male",
        "Count_Death_40To44Years_Female",
        "Count_Death_40To44Years_Male",
        "Count_Death_45To49Years_Female",
        "Count_Death_45To54Years_Female",
        "Count_Death_50To54Years_Female",
        "Count_Death_55To59Years_Female",
        "Count_Death_55To59Years_Male",
        "Count_Death_55To64Years",
        "Count_Death_55To64Years_Female",
        "Count_Death_55To64Years_Male",
        "Count_Death_5To9Years_Female",
        "Count_Death_5To9Years_Male",
        "Count_Death_60To64Years",
        "Count_Death_60To64Years_Female",
        "Count_Death_65OrMoreYears",
        "Count_Death_65OrMoreYears_Female",
        "Count_Death_65OrMoreYears_Male",
        "Count_Death_65To74Years_Female",
        "Count_Death_70To74Years_Female",
        "Count_Death_75To79Years",
        "Count_Death_75To79Years_Female",
        "Count_Death_80OrMoreYears",
        "Count_Death_80OrMoreYears_Female",
        "Count_Death_80OrMoreYears_Male",
        "Count_Death_AgeAdjusted_AsAFractionOf_Count_Person",
        "Count_Death_AsAFractionOfCount_Person",
        "Count_Death_Female",
        "Count_Death_Female_AgeAdjusted_AsAFractionOf_Count_Person_Female",
        "Count_Death_Female_AsAFractionOf_Count_Person_Female",
        "Count_Death_LessThan1Year_AsAFractionOf_Count_BirthEvent",
        "Count_Death_LessThan1Year_Female_AsAFractionOf_Count_BirthEvent_Female",
        "Count_Death_LessThan1Year_Male_AsAFractionOf_Count_BirthEvent_Male",
        "Count_Death_Male",
        "Count_Death_Male_AgeAdjusted_AsAFractionOf_Count_Person_Male",
        "Count_Death_Male_AsAFractionOf_Count_Person_Male",
        "Count_Death_Upto14Years",
        "Count_Death_Upto14Years_AsAFractionOf_Count_Person_Upto14Years",
        "Count_Death_Upto14Years_Female",
        "Count_Death_Upto14Years_Female_AsAFractionOf_Count_Person_Upto14Years_Female",
        "Count_Death_Upto14Years_Male",
        "Count_Death_Upto14Years_Male_AsAFractionOf_Count_Person_Upto14Years_Male",
        "Count_Death_Upto4Years_Female",
        "Count_Death_Upto4Years_Male",
        "Count_Person",
        "Count_Person_10To14Years",
        "Count_Person_10To14Years_Female",
        "Count_Person_10To14Years_Male",
        "Count_Person_15To19Years",
        "Count_Person_15To19Years_Female",
        "Count_Person_15To19Years_Male",
        "Count_Person_15To64Years",
        "Count_Person_15To64Years_Female",
        "Count_Person_15To64Years_Male",
        "Count_Person_20To24Years",
        "Count_Person_20To24Years_Female",
        "Count_Person_20To24Years_Male",
        "Count_Person_25To29Years",
        "Count_Person_25To29Years_Female",
        "Count_Person_25To29Years_Male",
        "Count_Person_25To34Years",
        "Count_Person_25To34Years_Female",
        "Count_Person_25To34Years_Male",
        "Count_Person_30To34Years",
        "Count_Person_30To34Years_Female",
        "Count_Person_30To34Years_Male",
        "Count_Person_35To39Years",
        "Count_Person_35To39Years_Female",
        "Count_Person_35To39Years_Male",
        "Count_Person_35To44Years",
        "Count_Person_35To44Years_Female",
        "Count_Person_35To44Years_Male",
        "Count_Person_40To44Years",
        "Count_Person_40To44Years_Female",
        "Count_Person_40To44Years_Male",
        "Count_Person_45To49Years",
        "Count_Person_45To49Years_Female",
        "Count_Person_45To49Years_Male",
        "Count_Person_45To54Years",
        "Count_Person_45To54Years_Female",
        "Count_Person_45To54Years_Male",
        "Count_Person_50To54Years",
        "Count_Person_50To54Years_Female",
        "Count_Person_50To54Years_Male",
        "Count_Person_55To59Years",
        "Count_Person_55To59Years_Female",
        "Count_Person_55To59Years_Male",
        "Count_Person_55To64Years",
        "Count_Person_55To64Years_Female",
        "Count_Person_55To64Years_Male",
        "Count_Person_5To9Years",
        "Count_Person_5To9Years_Female",
        "Count_Person_5To9Years_Male",
        "Count_Person_60To64Years",
        "Count_Person_60To64Years_Female",
        "Count_Person_60To64Years_Male",
        "Count_Person_65OrMoreYears",
        "Count_Person_65OrMoreYears_Female",
        "Count_Person_65OrMoreYears_Male",
        "Count_Person_65To69Years",
        "Count_Person_65To69Years_Female",
        "Count_Person_65To69Years_Male",
        "Count_Person_65To74Years",
        "Count_Person_70To74Years",
        "Count_Person_70To74Years_Female",
        "Count_Person_70To74Years_Male",
        "Count_Person_75OrMoreYears",
        "Count_Person_75OrMoreYears_Female",
        "Count_Person_75OrMoreYears_Male",
        "Count_Person_75To79Years",
        "Count_Person_75To79Years_Female",
        "Count_Person_75To79Years_Male",
        "Count_Person_80OrMoreYears",
        "Count_Person_80OrMoreYears_Female",
        "Count_Person_80OrMoreYears_Male",
        "Count_Person_Female",
        "Count_Person_Male",
        "Count_Person_PerArea",
        "Count_Person_Upto14Years",
        "Count_Person_Upto14Years_Female",
        "Count_Person_Upto14Years_Male",
        "Count_Person_Upto4Years",
        "Count_Person_Upto4Years_Female",
        "Count_Person_Upto4Years_Male",
        "LifeExpectancy_Person",
        "LifeExpectancy_Person_Female",
        "LifeExpectancy_Person_Male",
        "Max_Rainfall",
        "Max_Snowfall",
        "Max_Temperature",
        "Mean_BarometricPressure",
        "Mean_Rainfall",
        "Mean_Snowfall",
        "Mean_Temperature",
        "Mean_Visibility",
        "Min_Rainfall",
        "Min_Snowfall",
        "Min_Temperature",
        "dc/505bwby61yjz3",
        "dc/5by90fh61z2s4",
        "dc/6zsphg3yq6znf",
        "dc/e0j2t6nv29jz5",
        "dc/lttwq8h183gq6",
        "dc/nf9577mjqs69g",
        "dc/qg9n5wq1e7zg3",
        "dc/rxg50w6jfgld4",
        "dc/sw43w4pbtgq4d",
        "dc/x73k9t2mzzcs2",
        "dc/xh9d9e2le1r41"
      ]
    }
  ]
}
```
{: .example-box-content .scroll}
 
 
