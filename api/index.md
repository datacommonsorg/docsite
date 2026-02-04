---
layout: default
title: API - Query data programmatically
nav_order: 10
has_children: true
---


# API overview

[Data Commons](https://datacommons.org){: target="_blank"} aggregates data from many
different [data sources](https://datacommons.org/datasets){: target="_blank"} into a single
database. Data Commons is based on the data model used by
[schema.org](https://schema.org){: target="_blank"}; for more information, see [Key concepts](/data_model.html).

The Data Commons APIs allow developers to programmatically access the data in Data Commons, using the following technologies:

* A [REST API](/api/rest/v2) that can be used on the command line as well as in any language with an HTTP library.
* A [Python](/api/python/v2) client library that wraps the REST APIs and includes support for [Pandas](https://pandas.pydata.org/){: target="_blank}.

The endpoints can be roughly grouped into four categories:

-   **Statistical data**: Given a set of statistical variables, dates and entities, get observations.

-   **Graph exploration**: Given a set of nodes, explore the graph around those nodes.

-   **Resolution to DCIDs**: Given a set of place nodes identified by other means, get their Data Commons IDs.

-   **Graph query/SPARQL**: Given a subgraph where some of the nodes are
    variables, retrieve possible matches. This corresponds to a subset of the
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/){: target="_blank"}. This is useful for complex node connections which would require multiple API calls; for example, "hate crimes motivated by disability status in Californian cities". 

In addition, Data Commons provides additional tools for accessing its data that call the REST APIs under the hood:

- [Google Sheets](sheets/index.md): provides several custom functions that populate spreadsheets with data from the Data Commons knowledge graph
- [Web Components](web_components/index.md): provides JavaScript APIs and HTML templates that allow you to embed Data Commons data and visualizations into web pages

Finally, an R client library is available from a third-party provider, [Tidy Intelligence](https://www.tidy-intelligence.com/). Learn more at https://github.com/tidy-intelligence/r-datacommons/.

{: #get-key}
## API keys

A key is required for APIs to authenticate and authorize requests, as follows:
- All REST [V2](rest/v2/index.md) APIs. These requests are served by endpoints at `api.datacommons.org`.
- [Python and Pandas V2](python/v2/index.md) APIs, also served by `api.datacommons.org`.
- Data Commons MCP server requests. These are served by `api.datacommons.org/mcp`. 
- All requests coming from a custom Data Commons instance. These are also served by `api.datacommons.org`.
- Data Commons MCP server requests. These are served by `api.datacommons.org/mcp`.
- Data Commons NL API requests (used by the [DataGemma](https://ai.google.devgit/gemma/docs/datagemma){: target="_blank"} tool). These are served by endpoints at `nl.datacommons.org`.

A key is currently not required for the following, although this may change in the future:
- Google Sheets
- Web Components

### Obtain an API key

Data Commons API keys are managed by a self-service portal. To obtain an API key, go to [https://apikeys.datacommons.org](https://apikeys.datacommons.org){: target="_blank"}  and request a key for the hostname(s) listed above. Enable each of the APIs you want; you can share a single key for all of them.

To use the key in requests, see the relevant documentation:
- [REST V2 APIs](/api/rest/v2/index.html#authentication).
- [Python/Pandas V2 APIs](api/python/v2/index.html#authentication).
- For NL APIs in DataGemma, see the Colab notebooks in [https://github.com/datacommonsorg/llm-tools/tree/main/notebooks](https://github.com/datacommonsorg/llm-tools/tree/main/notebooks){: target="_blank"}



