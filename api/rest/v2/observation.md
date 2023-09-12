---
layout: default
title: Observation
nav_order: 2
parent: REST (v2)
grand_parent: API
published: true
permalink: /api/rest/v2/observation
---

# /v2/node

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
