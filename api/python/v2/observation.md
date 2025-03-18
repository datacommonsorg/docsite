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
| [fetch_observations_by_entity](#fetch_observations_by_entity) | Fetch observations for specified variables, dates and entities by DCID. |
| [fetch_observations_by_entity_type](fetch_observations_by_entity_type) | Fetch observations for specified variables and dates, by entity type and parent entity |
| [fetch_latest_observations](#fetch_latest_observations) | Fetch latest observations for specified variables, by entity DCID or [relation expression](/api/rest/v2/index.html#relation-expressions). |
| [fetch_latest_observations_by_entity](#fetch_latest_observations_by_entity) | Fetch latest observations for specified variables, by entity DCID. |


## Response

All request methods return a `ObservationResponse` object. By default, the response looks like:

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


There are additional methods you can call on the response to structure the data differently. See [Response property methods](#response-property-methods) for details.


### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| orderedFacets | list of objects | Metadata about the observations returned, keyed first by variable, and then by entity, such as the date range, the number of observations included in the facet etc. |
| observations | list of objects | Date and value pairs for the observations made in the time period |
| facets | object | Various properties of reported facets, where available, including the provenance of the data, etc. |
{: .doc-table}

### Response property methods

| Method | Description | 
|--------|-------------|
| to_json | Return the result as a JSON string. See [Response formatting](index.md#response-formatting) for details. |
| to_dict | Return the result as a dictionary. See [Response formatting](index.md#response-formatting) for details. |
| get_data_by_entity | Key the response data by entity rather than by variable. See xxx for examples. |
| get_observations_as_records | Get the response data as a series of flat records. See See xxx for examples. |
{: .doc-table}

>>> pretty = response.get_observations_as_records()
>>> pprint.pprint(pretty)
[{'date': '2020',
  'entity': 'country/AUS',
  'facetId': '1959655984',
  'importName': 'AustraliaStatistics',
  'measurementMethod': None,
  'observationPeriod': None,
  'provenanceUrl': 'https://www.abs.gov.au/statistics',
  'unit': 'AUD',
  'value': 959,
  'variable': 'Weekly_Median_Income_Household'}]


## fetch

Fetches observations for the specified variables, dates, and entities. Entities can be specified by DCID or by relation expression. 

### Signature

```python
fetch(variable_dcids, date, select, entity_dcids, entity_expression)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/> <required-tag>Required</required-tag> | string or list of strings | One or more [DCIDs](/glossary.html#dcid) of the statistical variables to query. |
| date <br/><optional-tag>Optional</optional-tag> | string | The date (and time) for which the observations are being requested.By default this is set to `LATEST`, which returns the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. Other allowed values are: <br>
* A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`. To look up the format of a statistical variable, see [Find the date format for a statistical variable](/api/rest/v2/observation.html#find-date-format).<br>
* `""` - Get all observations for the specified variables and entities  |
| select <optional-tag>Optional</optional-tag> | list of strings | The fields to be returned in the results. By default this is set to `["date", "entity", "variable", and "value" ]`. The only other valid option is `["entity", "variable"]`, which returns no observations. This may be useful to look up the entities (places) that are associated with the selected variables. |
| entity_dcids | string or list of strings | One ore more [DCIDs](/glossary.html#dcid) of the entities to query. One of `entity_dcids` or `entity_expression` is required. |
| entity.expression  | string | A [relation expression](/api/rest/v2/index.html#relation-expressions) that represents the entities to query. One of `entity_dcids` or `entity_expression` is required. |

{: .doc-table }

### Examples

{: #fetch_ex1}
#### Example 1: Generic description of functionality

More detailed description of the specific example, including what it's actually achieving, and how it's constructed. 

Request:
{: .example-box-title}

```python
example request
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
example response. Use the to_json() method to get nice formatting 
```
{: .example-box-content .scroll}
