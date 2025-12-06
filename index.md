---
layout: default
title: How to use Data Commons
nav_order: 1
has_children: true
redirect_from: /how_to_use
---

# How to use Data Commons

Data Commons offers many different ways to consume its data: 

- [Interact with the website](#interact), datacommons.org
- [Learn about the data sources](#learn)
- [Query the base data directly](#query), interactively and programmatically
- [Embed data visualizations](#embed) in your own site
- [Download data in CSV format](#download), for offline analysis

There are also several options for providing new data to Data Commons:
- [Contribute data to the base Data Commons](#contribute-data)
- [Host your own data site](#custom) using Data Commons' web framework 

## Interact with the datacommons.org website {#interact}

For quick analysis, use the search query bar on the [home page](https://datacommons.org/){: target="_blank"} or use any of the visualization tools, such as the [Timeline](https://datacommons.org/tools/timeline){: target="_blank"}, [Scatter](https://datacommons.org/tools/scatter){: target="_blank"}, and [Map](https://datacommons.org/tools/map){: target="_blank"} explorers.

## Learn about the data in Data Commons {#learn}

To find out what data is available in Data Commons, see the [Data sources](/datasets) pages, and check out the [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"}.

## Query the Data Commons data directly {#query}

There are several options for directly querying the data, without accessing the datacommons.org website, both interactive and programmatic:

- **APIs**: Data Commons publishes REST, Python, Pandas, and SPARQL [APIs](/api/index.html). These APIs support both low-level exploration of the knowledge graph as well as higher-level statistical analysis of data. You can call them from any application that supports REST protocols. 

    The [Python](/api/python/v2) APIs provide convenient wrappers, that you can call programatically or interactively, for example, from a Python virtual environment shell or from [Google Colab](https://colab.sandbox.google.com/){: target="_blank"}. We have developed a set of [Google Colab tutorials](/tutorials/index.html) to help you get started with analysis.  

    Data Commons also provides ideal training data for developing machine learning models and other data science applications. We have developed a [Data science curriculum](/courseware/intro_data_science.html) featuring the Python APIs and data, currently in use at MIT.

- **LLMs**: Data Commons provides a [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) server. This allows you to use any MCP-enabled agent, powered by a Large Language Model (LLM) such as Google Gemini, to [interactively query](/mcp/index.html) Data Commons data.

- **Google Sheets Add-on**: You can load Data Commons data into Google Sheets for analysis and charting, using a familiar spreadsheet interface. Install and run the Data Commons Google [Sheets add-on](/api/sheets/index.html).

## Embed Data Commons visualizations in your website {#embed}

Data Commons provides a [Web components API](/api/web_components/index.html) that makes it a snap to embed various chart elements in your own site, such as scatter plots, maps, pie charts, and many more, using the base Data Commons data.

## Download data for offline analysis {#download}

Data Commons provides tools for downloading its data in CSV format. To preview and download for selected places and statistical variables:

- Use the standalone [Data Download Tool](https://datacommons.org/tools/download){: target="_blank"}
- Click the **Download** link in any of the results pages of the visualization tools.	

## Contribute data to datacommons.org {#contribute-data}

We are always looking to expand the data available from the base Data Commons site, datacommons.org. If you are interested in contributing data, please file a ticket in our [IssueTracker](https://issuetracker.google.com/issues/new?component=1660823&template=2053232&pli=1){: target="_blank"}.

## Develop and host a Data Commons site with your own data {#custom}

If you would like to leverage Data Commons' analytical and visualization tools, and natural-language query interface for your own data and website, we provide a reference website implementation you can customize to meet your needs. See [Build your own Data Commons](/custom_dc/index.html) for details.

## Contribute to the open-source initiative {#contribute-project}

We also welcome code, documentation, and educational contributions to the Data Commons open-source project. See [Contribute to Data Commons](/contributing/index.html) for the myriad ways you can help improve Data Commons!
