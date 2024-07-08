---
layout: default
title: API
nav_order: 20
has_children: true
---

# Overview

[Data Commons](https://datacommons.org) aggregates data from many
different [data sources](https://datacommons.org/datasets) into a single
database. Data Commons is based on the data model used by
[schema.org](https://schema.org); for more information, see [the guide to the data model](/data_model.html).

The Data Commons APIs allow developers to programmatically access the data in Data Commons.
Data Commons provides several different ways to access its resources:

* A [REST API](/api/rest/v2) that can be used on the command line as well as in any language with an HTTP library.
* [Python](/api/python) and [Pandas](/api/pandas) wrappers.

The endpoints can be roughly grouped into four categories:

-   **Statistical data**: Given a set of statistical variables, dates and entities, get observations.

-   **Graph exploration**: Given a set of nodes, explore the
    graph around those nodes.

-   **Graph query/SPARQL**: Given a subgraph where some of the nodes are
    variables, retrieve possible matches. This corresponds to a subset of the
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/). This is useful for complex node connections which would require multiple API calls (e.g. "hate crimes motivated by disability status in Californian cities").

-   **Utilities**: These are Python notebook-specific APIs for helping with
    Pandas DataFrames, etc.