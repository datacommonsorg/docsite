---
layout: default
title: What is Data Commons?
nav_order: 2
parent: How to use Data Commons
---

{: .no_toc}
# What is Data Commons?

* TOC
{:toc}

## A single source for publicly available statistical data

In keeping with Google's mission to organize the world's information and make it universally accessible and useful, Data Commons offers a unified view of large-scale, public, statistical data, created by organizations across the world. Data Commons enables researchers, consumers, journalists, students, public policy and other key decision-makers to get high-level analytical answers to data questions, at the click of a button, and in your own words. 

Data Commons is not a repository of public datasets (such as Kaggle or Google Cloud BiqQuery Public Datasets). Instead, it is a single unified data source created by normalizing and aligning schemas and references to the same entities (such as cities, counties, organizations, etc.) across different datasets. Behind the scenes, Data Commons does the tedious work of finding data, understanding the data collection methodologies, cleaning the data, reconciling different formats and schemas, figuring out how to merge data about the same entity from different sources, and so on -- saving organizations months of tedious, costly and error-prone work. 

For example, if you wanted to get [population stats, poverty and unemployment rates of a specific county](https://datacommons.org/place/geoId/06081){: target="_blank"}, you don't need to go to three different datasets; instead, you can get the data from a single data source, using one schema, and one API. Data Commons is also used by Google Search whenever it can provide the most relevant statistical results to a query. For example, the top Google Search result for the query "what is the life expectancy of Vietnam" returns a Data Commons timeline graph and a link to the [Place page](https://datacommons.org/place/country/VNM?utm_medium=explore&mprop=lifeExpectancy&popt=Person&hl=en){: target="_blank"} for Vietnam:

![Google Search query result]({{site.url}}/assets/images/dc/dcoverview1.png){:width="640"}



## A standards-based knowledge graph, schema, and APIs

Data Commons needs to be able to stitch together data from disparate data sets in different formats and encodings, in a wide range of domains, from time series about demographics and employment, to hurricanes, to protein structures. To do so, it models the world as a [knowledge graph](https://blog.google/products/search/introducing-knowledge-graph-things-not/){: target="_blank"} consisting of nodes, or entities, with properties (attributes) and relationships between them forming directed edges between the nodes. The data model is based on the [Schema.org](https://www.schema.org){: target="_blank"} framework, an open framework used by over 40M websites; its schema is an extension of [Schema.org](https://www.schema.org/docs/schemas.html){: target="_blank"} constructs, introducing both general constructs (such as intervals) and values for common properties. 

The Data Commons [Knowledge Graph browser](https://datacommons.org/browser/){: target="_blank"} allows you to peek into the structure of the graph, and the APIs allow you to directly query the parts of the graph (e.g. nodes, triples, etc.).

Importantly, numeric time series data are first-class entities, with "(statistical) variable" being an entity that represents a metric definition, and "observation" being an entity that represents the value of a variable at a specific time. The [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"} allows you to browse existing variables, and the [Visualization tools](https://datacommons.org/tools/map){: target="_blank"} provide aggregated views of this data over time, geography, or 2-dimensional space. The APIs also allow you to directly query observations. 

To learn more about the data model and key concepts, see [Key concepts](data_model.md).

## An open-source project and website platform

Data Commons is a community-based resource, where individuals and organizations can contribute data, code, documentation and educational materials. Source code, schemas, and documentation are publicly available at [https://github.com/datacommonsorg](https://github.com/datacommonsorg){: target="_blank"}. 

Google has partnerships with the [United Nations](https://unstats.un.org/UNSDWebsite/undatacommons/sdgs){: target="_blank"}, the [World Health Organization](https://unstats.un.org/UNSDWebsite/undatacommons/areas/1471028664){: target="_blank"}, [One.org](https://datacommons.one.org/){: target="_blank"}, [TechSoup](https://publicdata.techsoup.org/){: target="_blank"}, and many other non-profit, academic, and governmental organizations across the world. We are always looking to expand data coverage and welcome contributions from data owners around the world.

In addition, Data Commons makes its data and visualizations accessible to any website through [REST](/api/rest/v2/index.html) and [Web components](/api/web_components/index.html) APIs. 

Finally, Data Commons provides an open-source, [customizable implementation](/custom_dc/index.html), for organizations that want to host their own version of a Data Commons website, using their own data and user interfaces. 

## Key features

Here are just some of the unique features of Data Commons:

-  Reliable data from official sources such as governmental agencies and NGOs 
-  Out-of-the-box visualizations, such as timeline charts, scatter plots, and maps.
-  Natural-language query interface offers a Google Search-like experience, allowing users to answer high-level queries with low latency
-  Massive scale, with over 100 datasets and 250 billion data points
-  Support for interactive and programmatic querying, ad hoc and bulk data downloads.
-  Easily customizable website implementation that can be adapted for specific data needs
-  Integration with the Google Search stack 

## Learn more

For more background on why and how Data Commons was built, see the [Data Commons Overview](https://arxiv.org/abs/2309.13054){: target="_blank"} paper.