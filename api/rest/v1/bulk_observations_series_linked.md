---
layout: default
title: Series of Observations (linked)
nav_order: 109
parent: REST (v1)
grand_parent: API
published: true
permalink: /api/rest/v1/bulk/observations/series/linked
is_bulk: true
---

# /v1/bulk/observations/series/linked

Returns [observations](/glossary.html#observation) of multiple [variables](/glossary.html#variable) 
for entities linked to an ancestor entity by the same property.

More specifically, in the following diagram:

![Example of a linked property](/assets/images/rest/property_value_direction_example.png){:width=100%}

The property `containedInPlace` is linked. Buenos Aires is contained in
Argentina, which is itself contained in South America -- implying Buenos Aires
is also contained in South America. With this endpoint, you could query for
countries in South America (returning observations for Argentina) or for cities 
in South America (returning observations for Buenos Aires).

This is useful for retrieving observations for all places within an ancestor place.
For example, this could be getting the population of women for all states in the United States.

<div markdown="span" class="alert alert-info" role="alert">
   <span class="material-icons md-16">info </span><b>Note:</b><br />
   Currently, this endpoint only supports the `containedInPlace` property and `Place` entities. Support for other properties and entity types will be added in the future.
</div>

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To get a series of observations for a single place, see [/v1/observations/series](/api/rest/v1/observations/series).<br />
    To get single observations for all places within an ancestor place, see [/v1/bulk/observations/point/linked](/api/rest/v1/observations/point/linked).
</div>

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">GET Request</button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">POST Request</button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v1/bulk/observations/series/linked?linked_property=containedInPlace&linked_entity={ancestor_place_dcid}&entity_type={place_type}&variables={variable_dcid_1}&variables={variable_dcid_2}&key={your_api_key}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v1/bulk/observations/series/linked

Header:
X-API-Key: {your_api_key}

JSON Data:
{
  "linked_property": "containedInPlace",
  "linked_entity": "{ancestor_place_dcid}"
  "entity_type": "{place_type}",
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
| linked_entity <br /> <required-tag>Required</required-tag> | list | [DCID](/glossary.html#dcid) of the ancestor place to query.|
| entity_type <br /> <required-tag>Required</required-tag> | string | Type of place to query for (e.g. city, county, state, etc.). For a list of available values, see the [Graph Browser page on Place](https://datacommons.org/browser/Place). |
| variables <br /> <required-tag>Required</required-tag> | list | [DCIDs](/glossary.html#dcid) of the [variables](/glossary.html#variables) to query. |
| linked_property <br /> <required-tag>Required</required-tag> | string | [DCID](/glossary.html#dcid) of the property to query. Must be `containedInPlace`.|
| all_facets <br /><optional-tag>Optional</optional-tag> | boolean | Whether to return data from all [facets](/glossary.html#facet) available. If true, data from all facets available will be returned. If false, only data from the [preferred facet](/glossary.html#preferred-facet) will be returned. Defaults to false.|
{: .doc-table }

## Response

The response looks like:

```json
{
  "observationsByVariable":
  [
    {
      "variable": "variable_dcid_1",
      "observationsByEntity":
      [
        {
          "entity": "entity_dcid_1",
          "seriesByFacet":
          [
            {
              "series":
              [
                {
                  "date": "YYYY-MM-DD",
                  "value": 1234
                }, ...
              ],
              "facet": 0123456789
            }
          ]
        }, ...
      ]
    }, ...
  ],
  "facets":
  {
    "0123456789":
    {
      "importName": "import_name_here",
      "provenanceUrl": "https://provenance.url/here",
      "measurementMethod": "measurement_method_here",
      "observationPeriod": "P<N>Y"
    }
  }
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

### Example 1: Get observations for all places within an ancestor place.

Get the population (DCID: `Count_Person`) for all counties in the US state of Delaware (DCID: `geoId/10`).

<div>
{% tabs example1 %}

{% tab example1 GET Request %}

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/observations/series/linked?linked_entity=geoId/10&linked_property=containedInPlace&variables=Count_Person&entity_type=County&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

{% endtab %}

{% tab example1 POST Request %}

Request:
{: .example-box-title}

```bash
$ curl --request POST \
--url https://api.datacommons.org/v1/bulk/observations/series/linked \
--header 'X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI' \
--data '{"linked_entity":"geoId/10", "linked_property":"containedInPlace", "entity_type":"County", variables:"Count_Person"}'
```
{: .example-box-content .scroll}

{% endtab %}

{% endtabs %}
</div>

Response:
{: .example-box-title}

```json
{
  "observationsByVariable":
  [
    {
      "variable": "Count_Person",
      "observationsByEntity":
      [
        {
          "entity": "geoId/10001",
          "seriesByFacet":
          [
            {
              "series":
              [
                {
                  "date": "1970",
                  "value": 81892
                },
                < ... output truncated for brevity ... >
                {
                  "date": "2021",
                  "value": 184149
                }
              ],
              "facet": 2176550201
            }
          ]
        },
        {
          "entity": "geoId/10003",
          "seriesByFacet":
          [
            {
              "series":
              [
                {
                  "date": "1970",
                  "value": 385856
                },
                < ... output truncated for brevity ... >
                {
                  "date": "2021",
                  "value": 571708
                }
              ],
              "facet": 2176550201
            }
          ]
        },
        {
          "entity": "geoId/10005",
          "seriesByFacet":
          [
            {
              "series":
              [
                {
                  "date": "1970",
                  "value": 80356
                },
                < ... output truncated for brevity ... >
                {
                  "date": "2021",
                  "value": 247527
                }
              ],
              "facet": 2176550201
            }
          ]
        }
      ]
    }
  ],
  "facets":
  {
    "2176550201":
    {
      "importName": "USCensusPEP_Annual_Population",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    }
  }
}
```
{: .example-box-content .scroll}
