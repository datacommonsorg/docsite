---
layout: default
title: Observation
nav_order: 3
parent: REST (v2)
grand_parent: API
published: true
permalink: /api/rest/v2/observation
---

# /v2/observation

This API fetches statistical observations. An observation is associated with an
entity and variable at a particular date. For example, “population of USA in
2020”, “GDP of California in 2010”, “predicted temperature of New York in 2050”,
and so on.

When querying observations, you need to provide variables, entities, and date.
Variables are specified as a list in the form of

```json
{
  "dcids": ["<variable_dcid_1>", "<variable_dcid_2>"]
}
```

Entities should be specified as an enumerated list or node expression, as
follows:

- Enumerated list:

  ```json
  {
    "dcids": ["<entity_dcid_1>", "<entity_dcid_2"]
  }
  ```

- Node expression:

  ```json
  {
    "expression": "country/USA<-containedInPlace+{typeOf:State}"
  }
  ```

Date is specified in the following values:

- **LATEST**: to fetch the latest observations.
- **{date_string}**: like "2020", "2010-12".
- **""**: date is not specified and observations are returned for all dates.

The response for an observation is a multi-level object generic response that
can handle all the cases mentioned above. The observation request is first
keyed by the variable, then keyed by the entity. Next comes a list of ordered
facets. Each facet is a way to measure the observations. For example,
populations measured by different Census Survey data are treated as different
facets of the population observation. All the different measured observations
are collected and ordered based on preferences.

Keep in mind the following rules when querying observations:

- Each facet contains a list of observations.
- Each observation has a “date” and “value”.
- The response may not have all levels and all fields, depending on the query
  parameters listed in the next bullet.
- There is a request parameter named "select" that is used to indicate the
  values the response should contain. Below are the scenarios:
  - `select = [“variable”, “entity”, “date”, “value”];` the response contains
    actual observation with date and value for each variable and entity.
  - `select = [“variable”, “entity”];` the response does not return an actual
    observation because the date and value are not queried. This can be used to
    check data existence for "variable", "entity" pairs and to fetch all the
    variables that have data for given entities.

See the examples below for use cases that use the preceding rules.

## Examples

### Example 1: Latest observation for given entities

Specify `date=LATEST` in order to get the latest observations and values. In this example, we are selecting the entity by its DCID using `entity.dcids`.

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

### Example 2: Observation at a particular date for given entities

This queries for observations in "2015" of the variable
[Count_Person](https://datacommons.org/tools/statvar#sv=Count_Person)
for two specified entities:
["country/USA"](https://datacommons.org/browser/country/USA) and
["geoId/06"](https://datacommons.org/browser/geoId/06).

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

### Example 3: Latest observation for all California counties

In this example, we use the [chained property
(`+`)](/api/rest/v2/#relation-expressions) to specify "all contained places in
[California](https://datacommons.org/browser/geoId/06) (dcid: `geoId/06`) of
type `County`". Then we specify the select fields to request actual observations
with date and value for each variable
([Count_Person](https://datacommons.org/tools/statvar#sv=Count_Person)) and
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