---
layout: default
title: API
nav_order: 20
has_children: true
open: true
---
# Overview

The [Data Commons Graph](https://datacommons.org) aggregates data from many
different [data sources](https://datacommons.org/datasets) into a single
database. Data Commons is based on the data model used by
[schema.org](https://schema.org); for more information, see [the guide to the data model](/data_model.html).

The **Data Commons API** allows developers to programmatically access the data in Data Commons.
Data Commons provides several different ways to access its API's resources:

1. A [REST API](/api/rest) that can be used on the command line as well as in any language with an HTTP library.
1. A lightweight [Python](/api/python) wrapper.
1. A heavier [Pandas](/api/pandas) wrapper.
1. A convenient [Google Sheets](/api/sheets) add-on.

The endpoints can be roughly grouped into four categories.

-   **Local Node Exploration**: Given a set of nodes, explore the
    graph around those nodes.

-   **Domain specific APIs**: These are groups of APIs, specific to particular
    domains.

-   **Graph Query/SPARQL**: Given a subgraph where some of the nodes are
    variables, retrieve possible matches. This corresponds to a subset of the
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

-   **Utilities**: These are Python notebook specific APIs for helping with
    Pandas DataFrames, etc.

Most of the provided endpoints take references to nodes and properties as arguments. Every
node or property has a `Data Commons ID (DCID)`, which is used
to pass nodes as arguments to API calls.

**Note:** The DCID of schema.org terms used in Data Commons is their schema.org ID.

