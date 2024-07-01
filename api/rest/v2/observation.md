---
layout: default
title: Observation
nav_order: 2
parent: REST (v2)
grand_parent: API
published: true
permalink: /api/rest/v2/observation
---

# /v2/observation

The Observation API fetches statistical observations. An observation is associated with an
entity and variable at a particular date: for example, “population of USA in
2020”, “GDP of California in 2010”, “predicted temperature of New York in 2050”,
and so on.

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
https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=<var>DATE_EXPRESSION</var>&
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/observation

Header:
X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI

JSON data:
{
  
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Query parameters

When querying observations, you need to provide variable, entities, and dates.
Specify variables as a list, in this form:

<pre>
{
  "dcids": ["<var>VARIABLE_DCID1</var>", "<var>VARIABLE_DCID2</var>"]
}
</pre>

Specify entities as an enumerated list or node expression, as follows:

- Enumerated list:

  <pre>
  {
    "dcids": ["<var>ENTITY_DCID1</var>", "<var>ENTITY_DCID2</var>"]
  }
  </pre>

- Node expression:

  ```json
  {
    "expression": "country/USA<-containedInPlace+{typeOf:State}"
  }
  ```

You must specify dates using any of the following values:

- `LATEST`: Fetch the latest observations only.
- <var>DATE_STRING</var>: Fetch observations matching the specified date(s). The date string must be in the format _YYYY_, _YYYY-MM_, or _YYYY-MM-DD_, like `2020`, `2010-12`
- `""`: Return observations for all dates.

Many endpoints allow the user to filter their results to specific dates. When querying for data at a specific date, the string passed for the date queried must match the date format (in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601)) used by the target variable. An easy way to see what date format a variable uses is to look up your variable of interest in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar).

## Response

The response for an observation is a multi-level object generic response that
can handle all the cases mentioned above. The observation request is first
keyed by the variable, then keyed by the entity. Next comes a list of ordered
facets. Each facet is a way to measure the observations. For example,
populations measured by different Census Survey data are treated as different
facets of the population observation. All the different measured observations
are collected and ordered based on preferences.

Keep in mind the following rules when querying observations:

- Each facet contains a list of observations.
- Each observation has a "date" and "value".
- The response may not have all levels and all fields, depending on the query
  parameters listed in the next bullet.
- There is a request parameter named "select" that you can use to indicate the
  values the response should contain. Below are the possible expressions:
  - `select = ["variable", "entity", "date", "value"];` the response contains
    actual observations with the date and value for each variable and entity.
  - `select = ["variable", "entity"];` the response does not return an actual
    observation because the date and value are not queried. You can use this to 
    check the existence of variable-entity pairs in the data and fetch all the
    variables that have data for given entities.

See the examples below for use cases that use the preceding rules.

## Examples

### Example 1: Get the latest observation for given entities

Specify `date=LATEST` in order to get the latest observations and values. In this example, we select the entity by its DCID using `entity.dcids`.

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
entity.dcids: "country/USA"
select: "entity"
select: "variable"
select: "value"
select: "date"
variable.dcids: "Count_Person"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&entity.dcids=country%2FUSA&select=entity&select=variable&select=value&select=date&variable.dcids=Count_Person'
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
                  "date": "2021",
                  "value": 331893745
                }
              ]
            },
            {
              "facetId": "1273233945",
              "observations": [
                {
                  "date": "2021",
                  "value": 333036755
                }
              ]
            },
            ...
          ]
        }
      }
    }
  },
  "facets": {
    "217147238": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2603",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2603&tid=ACSST5Y2019.S2603",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "1273233945": {
      "importName": "CensusACS5YearSurvey_AggCountry",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey"
    },
    ...
  }
}
```
{: .example-box-content .scroll}

### Example 2: Get the observations at a particular date for given entities

This queries for observations in 2015 for the variable
[`Count_Person`](https://datacommons.org/tools/statvar#sv=Count_Person)
for two specified entities:
[`country/USA`](https://datacommons.org/browser/country/USA) and
[`geoId/06`](https://datacommons.org/browser/geoId/06).

Parameters:
{: .example-box-title}

```bash
date: "2015"
entity.dcids: "country/USA"
entity.dcids: "geoId/06"
select: "date"
select: "entity"
select: "value"
select: "variable"
variable.dcids: "Count_Person"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&entity.dcids=country%2FUSA&entity.dcids=geoId%2F06&select=date&select=entity&select=value&select=variable&variable.dcids=Count_Person'
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
              ]
            },
            ...
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
              ]
            },
            ...
          ]
        }
      }
    }
  },
  "facets" {
    "2176550201": {
      "importName": "USCensusPEP_Annual_Population",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    },
    ...
  }
```
{: .example-box-content .scroll}

### Example 3: Get the latest observations for all California counties

In this example, we use the [chained expression
(`+`)](/api/rest/v2/#relation-expressions) to specify "all contained places in
[California](https://datacommons.org/browser/geoId/06) (dcid: `geoId/06`) of
type `County`". Then we specify the select fields to request actual observations
with date and value for each variable
([`Count_Person`](https://datacommons.org/tools/statvar#sv=Count_Person)) and
entity (all counties in California).

Parameters:
{: .example-box-title}

```bash
date: "LATEST"
entity.expression: "geoId/06<-containedInPlace+{typeOf:County}"
select: "date"
select: "entity"
select: "value"
select: "variable"
variable.dcids: "Count_Person"
```

Request:
{: .example-box-title}

```bash
curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2015&date=LATEST&entity.expression=geoId%2F06%3C-containedInPlace%2B%7BtypeOf%3ACounty%7D&select=date&select=entity&select=value&select=variable&variable.dcids=Count_Person'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

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
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    },
    ...
  }
}
```
{: .example-box-content .scroll}