---
layout: default
title: How to use Data Commons
nav_order: 1
---

{: .no_toc}
# How to use Data Commons

* TOC
{:toc}

## Learn about the data in Data Commons

To find out what data is available in Data Commons, check out the [Statistical Variable Explorer](https://datacommons.org/tools/statvar) and see the [Data sources](/datasets/index.html) pages.

## Issue interactive data queries

For quick analysis, use the search query bar on the [home page](https://datacommons.org/) or use any of the visualization tools, such as the [Timeline](https://datacommons.org/tools/visualization#visType=timeline), [Scatter](https://datacommons.org/tools/visualization#visType%3Dscatter), and [Map](https://datacommons.org/tools/visualization#visType%3Dmap) explorers.

If you want to issue SQL queries, and you have a Google Cloud Platform account, use BigQuery Studio on Data Commons data in [Analytics Hub](https://cloud.google.com/analytics-hub). See the [Data Commons in BigQuery](/bigquery/index.html) page for more details.

## Issue programmatic data queries

Data Commons publishes REST, Python, Pandas, Google Sheets, and SPARQL [APIs](/api/index.html). The APIs support both low-level exploration of the knowledge graph as well as higher-level statistical analysis of variables.

The Python and pandas APIs provide convenient wrappers for calling the APIs; we have developed a set of [Google Colab tutorials](/tutorials/index.html) to help you get started with analysis. We have also developed a [Data science curriculum](/courseware/intro_data_science.html) featuring our API and data, currently in use at MIT.

## Embed data analyses and visualizations in your site

If you would like to include Data Commons result visualizations in your own website, we provide  a [Web components API](/api/web_components/index.html) that makes it a snap to embed various chart elements, such as scatter plots, maps, pie charts, and many more.

## Download data for offline analysis

Data Commons provides several tools for downloading its data:

-  To preview and download for selected places and statistical variables, use the standalone [Data Download Tool](https://datacommons.org/tools/download) or click the **Download** link in any of the results pages of the visualization tools.	
-  To load data into Google Sheets for analysis and charting, install and run the Data Commons Google [Sheets add-on](/api/sheets/index.html).

## Build machine learning models

Data Commons provides ideal training data for developing machine learning models and other data science applications. The [data science tutorials](/courseware/intro_data_science.html) show you how to use our APIs and data to get started. 

## Contribute data to Data Commons

We are always looking to expand the data available from the base Data Commons site. If you are interested in contributing data, please see the [Data import documentation](/import_dataset/index.html).

## Develop and host your own Data Commons site

If you would like to leverage Data Commons' analytical and visualization tools, and natural-language query interface for your own data and website, we provide a reference website implementation you can customize to meet your needs. See the [Custom Data Commons documentation](/custom_dc/index.html) for details.

## Contribute to the open-source initiative

We also welcome code, documentation, and educational contributions to the Data Commons open-source project. See [Contributing to Data Commons](/contributing/index.html) for the myriad ways you can help improve Data Commons!
