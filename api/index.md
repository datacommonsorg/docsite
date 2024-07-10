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
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/). This is useful for complex node connections which would require multiple API calls; for example, "hate crimes motivated by disability status in Californian cities").

-   **Utilities**: These are Python notebook-specific APIs for helping with
    Pandas DataFrames, etc.

    {: #get-key}
## Get API keys 

All programmatic access to Data Commons using the REST and Python APIs must be authenticated and authorized with an API key.

We provide a trial API key for general public use. This key will let you try the API and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

_The trial key is capped with a limited quota for requests._ If you are planning on using our APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request one by
[filling out this form](https://docs.google.com/forms/d/e/1FAIpQLSeVCR95YOZ56ABsPwdH1tPAjjIeVDtisLF-8oDYlOxYmNZ7LQ/viewform) and selecting "API access" to request an official key without any quota limits. 

To use the key in requests, see the following documentation:
- []