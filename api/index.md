---
layout: default
title: API
nav_order: 0
has_children: true
---


# API overview

[Data Commons](https://datacommons.org){: target="_blank"} aggregates data from many
different [data sources](https://datacommons.org/datasets){: target="_blank"} into a single
database. Data Commons is based on the data model used by
[schema.org](https://schema.org){: target="_blank"}; for more information, see [Key concepts](/data_model.html).

The Data Commons APIs allow developers to programmatically access the data in Data Commons, using the following technologies:

* A [REST API](/api/rest/v2) that can be used on the command line as well as in any language with an HTTP library.
* [Python](/api/python) and [Pandas](/api/pandas) wrappers.

> **Note:** The Python and Pandas APIs wrap the [V1](/api/rest/v1) version of the REST APIs and have not yet been updated to V2.

The endpoints can be roughly grouped into four categories:

-   **Statistical data**: Given a set of statistical variables, dates and entities, get observations.

-   **Graph exploration**: Given a set of nodes, explore the
    graph around those nodes.

-   **Graph query/SPARQL**: Given a subgraph where some of the nodes are
    variables, retrieve possible matches. This corresponds to a subset of the
    graph query language [SPARQL](https://www.w3.org/TR/rdf-sparql-query/){: target="_blank"}. This is useful for complex node connections which would require multiple API calls; for example, "hate crimes motivated by disability status in Californian cities".

-   **Utilities**: These are Python notebook-specific APIs for helping with
    Pandas DataFrames, etc.

In addition, Data Commons provides additional tools for accessing its data that call the REST APIs under the hood:

- [Google Sheets](sheets/index.md): provides several custom functions that populate spreadsheets with data from the Data Commons knowledge graph
- [Web Components](web_components/index.md): provides JavaScript APIs and HTML templates that allow you to embed Data Commons data and visualizations into web pages

{: #get-key}
## API keys

A key is required by some APIs to authenticate and authorize requests.
- All REST [V2](rest/v2/index.md) and [V1](rest/v1/index.md) APIs. These requests are served by endpoints at `api.datacommons.org`.
- All requests coming from a custom Data Commons instance. These are also served by `api.datacommons.org`.
- Data Commons NL API requests (used by the [DataGemma](https://ai.google.devgit/gemma/docs/datagemma){: target="_blank"} tool). These are served by endpoints at `nl.datacommons.org`.

A key is currently not required for the following, although this may change in the future:
- Python and Pandas client libraries other than NL APIs
- V0 REST APIs
- Google Sheets
- Web Components

### Obtain an API key

Data Commons API keys are managed by a self-service portal. To obtain an API key, go to [https://apikeys.datacommons.org](https://apikeys.datacommons.org){: target="_blank"}  and request a key for the hostname(s) listed above. Enable each of the APIs you want; you can share a single key for all of them.

To use the key in requests, see the relevant documentation:
- For REST V2 APIs, see the section on [Authentication](/api/rest/v2/index.html#authentication).
- For REST V1 APIs, see the section on [Authentication](/api/rest/v2/getting_started.html#authentication).
- For NL APIs in DataGemma, see the Colab notebooks in [https://github.com/datacommonsorg/llm-tools/tree/main/notebooks](https://github.com/datacommonsorg/llm-tools/tree/main/notebooks){: target="_blank"}



