---
layout: default
title: Find available data
nav_order: 2
parent: SDMX 3.0
grand_parent: API - Query data programmatically
published: true
include_scripts:
  - /assets/js/syntax_highlighting.js
  - /assets/js/api-doc-tabs.js
---

{: .no_toc}
# /availability

* TOC
{:toc}

The Availability API allows you to find out what data and metadata is available for selected variables, without getting the observations. You can get a list of provenances and other metadata, if available.

## Request syntax

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/<var>OBSERVATION_FIELD</var>?key=<var>YOUR_API_KEY</var>&c[variableMeasured]=<var>VARIABLE_DCIDS</var>&c[<var>OBSERVATION_FIELD</var>]=<var>ENTITY_DCIDS</var>&...&c[TIME_PERIOD]=<var>DATES</var>
</div>

### Query parameters

| Parameter | Description | Valid values |
| :--------- | :----------- | :------------ |
| key <br /><required-tag>Required</required-tag> | Your API key. See the section on [authentication](index.md#authentication) for details. | n/a |
| <var>OBSERVATION_FIELD</var> <br /><required-tag>Required</required-tag> | The property for which available data should be returned. Supported properties are: <br/>- `observationAbout`: Return all entities/places that have data for the selected variable(s). Use this for single-entity statistical variables. <br/>- Custom `observationProperties` dimension: Return all entities that have data for this custom property. Use this for multi-entity statistical variables.<br/>- `provenance`: Return all provenances associated with observations for the selected variable(s).<br/>- `unit`: Return all units that are specified in observations associated with the selected variable(s).<br/>- `measurementMethod`: Return all measurement methods that are specified in observations associated with the selected variable(s).<br/>- `observationPeriod`: Return all observation periods that are specified in observations associated with the selected variable(s).<br/> | n/a |
| variableMeasured <br /><required-tag>Required</required-tag> | The statistical variable(s) about which you are looking up data availability. | Comma-separated list of statistical variable DCIDs |
| <var>OBSERVATION_FIELD</var> <br/><optional-tag>Optional</optional-tag> | Additional property or properties by which you would like to filter results. The <var>OBSERVATION_FIELD</var> is any of the properties listed above. <br/><br/> For custom observation properties, up to 3 are supported. <br/><br/>In addition, for place-type entities, you can filter by place type and parent, using the qualifiers `containedInPlace+` and `typeOf`. If you use these, you must specify both parameters. See the examples below for the syntax. <br/><br/>Multiple filter properties are ANDed together. | - For `observationAbout`, custom observation properties, and `provenance`: comma-separated list of DCID values for the selected observation property. <br/>- For all others: see their respective entries in the [Glossary](/glossary.html). <br/><br/>Each value applies to all variables specified in the `variableMeasured` parameter. |
| TIME_PERIOD <br/><optional-tag>Optional</optional-tag> | Filter results by a specific time period. If not specified, defaults to all results. | Comma-separated dates, in the format <var>YYYY</var>, <var>YYYY</var>-<var>MM</var>, or <var>YYYY</var>-<var>MM</var>-<var>DD</var>. |

{: .doc-table }

At this time, the following parameters are accepted but redundant:

* `mode`: only the default `exact` is supported
* `references`: only the default `none` is supported
* `format`: only `sdmx-json` is supported

Explicit SDMX operators, including `eq:`, are not currently supported. Unprefixed values use equality semantics.

## Response format

The Availability API returns responses in SDMX-JSON format 2.0.0. It looks like this:

<pre>
{
  "meta": {
    "schema": "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
    "id": "DF_OBS_AVAILABILITY",
    "prepared": "<RFC3339_TIMESTAMP>",
    "sender": {
      "id": "DC"
    }
  },
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
                  {
                    "value": "<var>VALUE1</var>"
                  },
                  {
                    "value": "<var>VALUE2</var>"
                  },
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

The response shows that Canada and Mexico are associated with this variable, but not Singapore or Malaysia.

```json
{
  "meta": {
    "schema": "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
    "id": "DF_OBS_AVAILABILITY",
    "prepared": "2026-08-24T19:06:32Z",
    "sender": {
      "id": "DC"
    }
  },
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
                "id": "observationAbout",
                "include": true,
                "values": [
                  {
                    "value": "country/CAN"
                  },
                  {
                    "value": "country/MEX"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```
{: .example-box-content .scroll}

### Example 2: Look up all the places that have data for a specific variable in a specific year, filtered by type and parent place

This example gets all the countries that have population density data for the year 2020, using the variable `Count_Person_PerArea`. For this query, we use the filter `containedInPlace+` with the value `Earth` and the filter `typeOf` to get only countries and not other place types.

Note that you must URL-encode the `+` character.

Parameters:
{: .example-box-title}
<pre>
<var>OBSERVATION_FIELD</var>: observationAbout
variableMeasured: Count_Person_PerArea
observationAbout.containedInPlace+: Earth
observationAbout.typeOf: Country
TIME_PERIOD: 2020
</pre>

Request
{: .example-box-title}

```bash
curl -g "https://api.datacommons.org/sdmx/v3/availability/dataflow/DC/DF_OBS/1.0.0/*/observationAbout?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&c[variableMeasured]=Count_Person_PerArea&c[observationAbout.containedInPlace%2B]=Earth&c[observationAbout.typeOf]=Country&c[TIME_PERIOD]=2020" 
```
{: .example-box-content .scroll}

Response
{: .example-box-title}

```json
{
  "meta": {
    "schema": "https://json.sdmx.org/2.0.0/sdmx-json-structure-schema.json",
    "id": "DF_OBS_AVAILABILITY",
    "prepared": "2026-08-24T19:08:40Z",
    "sender": {
      "id": "DC"
    }
  },
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
                "id": "observationAbout",
                "include": true,
                "values": [
                  {
                    "value": "country/ALB"
                  },
                  {
                    "value": "country/AUS"
                  },
                  {
                    "value": "country/AUT"
                  },
                  {
                    "value": "country/BEL"
                  },
                  {
                    "value": "country/BGR"
                  },
                  {
                    "value": "country/BRA"
                  },
                  {
                    "value": "country/CAN"
                  },
                  {
                    "value": "country/CHE"
                  },
                  {
                    "value": "country/CHL"
                  },
                  {
                    "value": "country/CHN"
                  },
                  {
                    "value": "country/COL"
                  },
                  {
                    "value": "country/CRI"
                  },
                  {
                    "value": "country/CYP"
                  },
                  {
                    "value": "country/CZE"
                  },
                  {
                    "value": "country/DEU"
                  },
                  {
                    "value": "country/DNK"
                  },
                  {
                    "value": "country/ESP"
                  },
                  {
                    "value": "country/EST"
                  },
                  {
                    "value": "country/FIN"
                  },
                  {
                    "value": "country/FRA"
                  },
                  {
                    "value": "country/GBR"
                  },
                  {
                    "value": "country/GRC"
                  },
                  {
                    "value": "country/HRV"
                  },
                  {
                    "value": "country/HUN"
                  },
                  {
                    "value": "country/IND"
                  },
                  {
                    "value": "country/IRL"
                  },
                  {
                    "value": "country/ISL"
                  },
                  {
                    "value": "country/ISR"
                  },
                  {
                    "value": "country/ITA"
                  },
                  {
                    "value": "country/JPN"
                  },
                  {
                    "value": "country/KOR"
                  },
                  {
                    "value": "country/LIE"
                  },
                  {
                    "value": "country/LTU"
                  },
                  {
                    "value": "country/LUX"
                  },
                  {
                    "value": "country/LVA"
                  },
                  {
                    "value": "country/MEX"
                  },
                  {
                    "value": "country/MKD"
                  },
                  {
                    "value": "country/MLT"
                  },
                  {
                    "value": "country/MNE"
                  },
                  {
                    "value": "country/NLD"
                  },
                  {
                    "value": "country/NOR"
                  },
                  {
                    "value": "country/NZL"
                  },
                  {
                    "value": "country/PER"
                  },
                  {
                    "value": "country/POL"
                  },
                  {
                    "value": "country/PRT"
                  },
                  {
                    "value": "country/ROU"
                  },
                  {
                    "value": "country/RUS"
                  },
                  {
                    "value": "country/SGP"
                  },
                  {
                    "value": "country/SVK"
                  },
                  {
                    "value": "country/SVN"
                  },
                  {
                    "value": "country/SWE"
                  },
                  {
                    "value": "country/TUR"
                  },
                  {
                    "value": "country/USA"
                  },
                  {
                    "value": "nuts/FI2"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
``` 
{: .example-box-content .scroll}