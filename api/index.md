---
layout: default
title: API
nav_order: 3
has_children: true
---
# Overview

The [Data Commons Graph](https://datacommons.org) aggregates data from many
different [data sources](https://datacommons.org/datasets) into a single
database. Data Commons is based on the data model used by
[schema.org](https://schema.org); for more information, see [our guide to the data model](/data_model.html).

The **Data Commons API** allows developers to
programmatically access the data in Data Commons.
Data Commons provides APIs in each of the different views
(graph, timeline, etc.) for use in different contexts. More specifically, we provide
1. **REST** APIs: can be used in cURL requests or as part of a larger application
1. **Pandas** APIs: heavy APIs for use in Python notebooks
1. **Google Sheets** APIs: for use in Google Sheets
1. **Python** APIs: lighter APIs with fewer options than the Pandas APIs

The APIs can be roughly grouped into the following:

-   **Local Node Exploration**: Given a node (or set of nodes), explore the
    graph around those node(s).

-   **Domain specific APIs**: These are groups of APIs, specific to particular
    domains, E.g., places, statistics.

-   **Graph Query/SPARQL**: Given a subgraph where some of the nodes are
    variables, retrieve possible matches. This corresponds to a subset of the
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/).

-   **Utilities**: These are Python Notebook specific APIs for helping with
    Pandas DataFrames, etc.

For each API, in addition to the arguments and return value for the REST calls,
we also document language specific bindings.

Almost all our APIs take references to nodes and properties as arguments. Every
node (properties are also nodes) has a `Data Commons ID (DCID)`, which is used
to pass nodes as arguments to API calls. The DCID of schema.org terms used in
Data Commons is their schema.org ID.


Using the Data Commons API requires an API Key. Details on obtaining a key,
installing Python libraries, etc. can be found in the
[API setup guide](/api/setup.html).

### Local Node Exploration

-   **get_property_labels**: given a node, return the `DCID`s of the properties
    associated with this node. In graph terminology, return the `DCID`s of the
    arc-labels of the arcs into and out of this node.
    -   Documentation: [REST](/api/rest/property_label.html),
    [Python](/api/python/property_label.html)

-   **get_property_values**: given a node and a property, return the value of
    this property for that node. In graph terminology, return the target/source
    of the arcs into/out of this node with that arc label.
    -   Documentation: [REST](/api/rest/property_value.html),
    [Python](/api/python/property_value.html)

-   **get_triples**: given a node, return all the triples in which this node is
    either the subject/source or object/target.
    -   Documentation: [REST](/api/rest/triple.html),
    [Python](/api/python/triple.html)

### Graph Query/SPARQL

-   **query**: query Data Commons via SPARQL.
    -   Documentation: [REST](/api/rest/query.html),
    [Python](/api/python/query.html)

### Domain Specific APIs

#### Statistics

A substantial amount of the data in Data Commons is statistical in nature. The
representation of this information uses the concept of an
[StatisticalPopulation](https://datacommons.org/browser/StatisticalPopulation)
with [Observation](https://datacommons.org/browser/Observation)s on
these populations.

To simplify accessing these statistics,
[StatisticalVariable](https://datacommons.org/browser/StatisticalVariable)'s
are human readable identifiers that represents a metric for a place and time,
corresponding to a pair of StatisticalPopulation and Observation with some
generalization.

-   **Place Statistics - single value**: given a single `StatisticalVariable` and place DCID, return a single statistical value.
    - Documentation: [REST](/api/rest/stat_value.html), [Python](/api/rest/stat_value.html)
-   **Place Statistics - time series**: given a single `StatisticalVariable` and place DCID, return a time series of statistical values.
    - Documentation: [REST](/api/rest/stat_series.html), [Python](/api/rest/stat_series.html)
-   **Place Statistics - all**: given a list `StatisticalVariable`'s and place DCID's, return all available time series of statistical values.
    - Documentation: [REST](/api/rest/stat_all.html), [Python](/api/rest/stat_all.html)

#### Locations

Many applications need listings of places of a given type, often within
containing areas.

-   **get places within a place**: given a list of `Place` DCIDs (e.g. `County`,
    `State`, `Country`, etc...), return the DCIDs of places contained within, of
    a specified type.
    -   Documentation: [REST](/api/rest/place_in.html),
    [Python](/api/python/place_in.html),
    [Sheets](/api/sheets/places_in.html)

