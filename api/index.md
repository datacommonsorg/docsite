---
layout: default
title: API
nav_order: 20
has_children: true
---
# Overview

The [Data Commons Graph](https://datacommons.org) aggregates data from many
different [data sources](https://datacommons.org/datasets) into a single
database. Data Commons is based on the data model used by
[schema.org](https://schema.org); for more information, see [the guide to the data model](/data_model.html).

The Data Commons APIs allow developers to programmatically access the data in Data Commons.
Data Commons provides several different ways to access its API's resources:

* A [REST API](/api/rest/v2) that can be used on the command line as well as in any language with an HTTP library.
* A lightweight [Python](/api/python) wrapper.
* A heavier [Pandas](/api/pandas) wrapper.
* A convenient [Google Sheets](/api/sheets) add-on.

The endpoints can be roughly grouped into four categories:

-   **Graph exploration**: Given a set of nodes, explore the
    graph around those nodes.

-   **Statistical data**: Given a set of statistical variables, dates and entities, get observations.

-   **Graph query/SPARQL**: Given a subgraph where some of the nodes are
    variables, retrieve possible matches. This corresponds to a subset of the
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/). This is useful for getting very specific observations which would require multiple API calls (e.g. "hate crimes motivated by disability status in Californian cities").

-   **Utilities**: These are Python notebook-specific APIs for helping with
    Pandas DataFrames, etc.

## Find IDs for input parameters {#find-ids}

All Data Commons APIs take parameters that require the [DCID](/glossary.html#dcid) of the entity, place, or variable you wish to query. 

To find the [DCID](/glossary.html#dcid) of an entity or variable:

* Browse all variables with the
   [Statistical Variable Explorer](https://datacommons.org/tools/statvar).

* Search for places and variables with the
   [Search](https://datacommons.org/search) page.

* Click through the [Knowledge Graph](https://datacommons.org/browser) to understand the relationship between entities. For example, the  [country/USA](https://datacommons.org/browser/country/USA)
page shows the [DCID](/glossary.html#dcid)s for all US states and territories:

![U.S. state DCIDs](/assets/images/web_components/graph-explorer.png") {: width="600"}

* Use the [v2/resolve API endpoint](/api/v2/resolve.html) to get DCIDs programmatically.

## Find dates for observations

Many endpoints allow you to filter their results to specific dates. When querying for data at a specific date, the string you pass for the date queried must match the date format (in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601)) used by the target variable. To find out the date format a variable uses, look up your variable of interest in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). 




