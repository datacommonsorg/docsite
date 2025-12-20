---
layout: default
title: Key concepts and common tasks
nav_order: 3
parent: How to use Data Commons
redirect_from: 
  - /bigquery/data_in_bq
  - /bigquery/unique_identifiers
---

{: .no_toc}
# Key concepts and common tasks

Whether you're just exploring the data on [datacommons.org](http://datacommons.org), using the programmatic APIs, or contributing data, it's helpful to have a basic understanding of some of the key concepts in Data Commons. Use the following guidance:
- If you are only using Data Commons interactive tools, Google Sheets or CSV download, you should at least be familiar with [entities](#entity) and [statistical variables](#statistical-variable). You may wish to just skip directly to those sections.
- If you plan to use the programmatic APIs, contribute data, or run your own Data Commons, you should read this entire page. 

{:toc}
* TOC

## Schema 

To allow data from hundreds of organizations around the world, in a myriad of models and formats to be interoperable and queryable in a unified way, Data Commons needs to have a common way of understanding and representing this data. To do so, it applies a schema, or vocabulary to all its data, that is largely derived from earlier schemes developed for semantic understanding of web pages – most notably, the data models and schemas of [Schema.org](http://Schema.org) (which were in turn based on earlier schemes such as Microformats and Resource Description Framework (RDF)). 

The Data Commons schema is in fact a superset of [Schema.org schemas](https://schema.org/docs/schemas.html){: target="_blank"}, with a particular emphasis on time series and statistical data. Every data set must have an associated schema, written in [Meta Content Format](https://en.wikipedia.org/wiki/Meta_Content_Framework){: target="_blank"} (MCF) language, that maps the provider's data to existing concepts in the Data Commons.

## Knowledge Graph

Data Commons models the world as a directed labeled graph, consisting of a set of _nodes_ and edges with labels, known as _properties_. This general framework allows Data Commons to represent information about a wide range of domains: from time series about demographics and employment, to hurricanes, to protein structures. 

As a simple example, here are a set of nodes and edges that represent the following statements:

-  California is a state
-  Santa Clara county and Berkeley are contained in the state of California
-  The latitude of Berkeley, CA is 37.8703

![knowledge graph]({{site.url}}/assets/images/dc/concept1.png){: width="600"}

Each node consists of some kind of entity or value, and each edge describes some kind of property. More specifically, each node consists of the following objects:

-  One or more [types](#type): an [entity](#entity), [event](#event), [statistical variable](#statistical-variable), or [statistical observation](#observation)
-  A [unique identifier](#unique-identifier-dcid), known as a DCID
-  Various [properties](#property)
-  A [provenance](#provenance-source-dataset)

As in other knowledge graphs, each pair of connected nodes is a _triple_ consisting of a subject node, predicate (or "edge") and object node. The Data Commons knowledge graph is made up of billions of triples. The triple is not generally exposed in Data Commons as a concept that you need to know (although it can be queried from some APIs).

You can get all the information about a node and its edges by looking at the Knowledge Graph browser. If you know the [DCID](#unique-identifier-dcid) for a node, you can access it directly by typing <code>https://datacommons.org/browser/<var>DCID</var></code>. For example, here is the entry for the `City` node, available at [https://datacommons.org/browser/City](https://datacommons.org/browser/City){: target="_blank"}:

![KG browser]({{site.url}}/assets/images/dc/concept2.png){: width="900"}

Every node entry shows a list of outgoing edges, or _properties,_ and incoming edges. [Properties](#property) are discussed in more detail below.

## Type

Every node has at least one type, where each type may be a sub-class of multiple types. For entities and events, their type is typically another entity. For example, `Berkeley` is a type of `City`. At the root, all types are instances of the Class type. For statistical variables and observations, their type is always `StatisticalVariable` and `StatVarObservation`, respectively.

## Entity

An _entity_ represents a persistent, physical thing in the real world. While Data Commons has information about a wide variety of types of entities (cities, states, countries, schools, companies, facilities, etc.), most of the information today is about _places_. Data Commons contains a catalog of about 2.9 million places. In addition to basic metadata like the location, type and containment information, many places also contain information about their shape, area, etc. For a list of available place types, take a look at the [place types page](/place_types.html).

## Event

An _event_ is what it sounds like: an occurrence at a specific point in time, such as an extreme weather event, a criminal incident, an election, etc. 

## Statistical variable

In Data Commons, even statistical measurements and time series data are modeled as nodes. A _statistical variable_ represents any type of metric, statistic, or measurement that can be taken at a place and time, such as a count, an average, a percentage, etc. A statistical variable for a specific place is a _time series_, consisting of a set of observed values over a time period.

Data Commons comprises hundreds of thousands of statistical variables, which you can view using the [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"}. 

The type of a statistical variable is always the special sub-class [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable){: target="_blank"}. For example, the metric [`Median Age of Female Population`](https://datacommons.org/browser/Median_Age_Person_Female){: target="_blank"} is a node whose type is a statistical variable. 

A statistical variable can be simple, such as [`Total Population`](https://datacommons.org/browser/Count_Person){: target="_blank"}, or more complex, such as [`Hispanic Female Population`](https://datacommons.org/tools/statvar#Count_Household_NoHealthInsurance=&sv=Count_Person_Female_HispanicOrLatino){: target="_blank"}. Complex variables may be broken down into constituent parts, or not.  

### Task: Find places available for a statistical variable {#find-places}

Note that not all statistical variables have observations for all places or other entities. To find out which places have data for a given variable, you can do the following:

1. Open the [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"}, and search for a variable of interest.
1. Optionally, filter by data source and data set.
1. Scroll to the **Places** section.

For example, inspecting [Health > Health Insurance (Household) > No Health Insurance > Households Without Health Insurance](https://datacommons.org/tools/statvar#sv=Count_Household_NoHealthInsurance){: target="_blank"} shows us that the statistical variable `Count_Household_NoHealthInsurance` is available in the United States at state, county, and city levels:

![Stat Var Explorer]({{site.url}}/assets/images/dc/concept4.png){: width="900"}

On the other hand, the [Average Retail Price of Electricity](https://datacommons.org/tools/statvar#Quarterly_Average_RetailPrice_Electricity=&sv=Quarterly_Average_RetailPrice_Electricity){: target="_blank"}, or `Quarterly_Average_RetailPrice_Electricity`, is only available at the state level states in the US but not at the city or county level. 

![Stat Var Explorer]({{site.url}}/assets/images/dc/concept5.png){: width="900"}

## Unique identifier: DCID

Every node has a unique identifier, called a Data Commons ID, or DCID. In the [Knowledge Graph browser](https://datacommons.org/browser/){: target="_blank"}, you can view the DCID for any node or edge. For example, the DCID for the city of Berkeley is `geoid/0606000`:

![KG browser]({{site.url}}/assets/images/dc/concept6.png){: width="600"}

DCIDs are not restricted to entities; statistical variables also have DCIDs. For example, the DCID for the Gini Index of Economic Activity is `GiniIndex_EconomicActivity`:

![Stat Var Explorer]({{site.url}}/assets/images/dc/concept7.png){: width="900"}

### Task: Find a DCID for an entity or variable {#find-dcid}

Many Data Commons tools and APIs require that you provide a DCID as input for a query. There are a few ways to do this.

To find the DCID for a place using the datacommons.org website:

1. Go to [https://docs.datacommons.org/place_types.html](https://docs.datacommons.org/place_types.html){: target="_blank"}. 
1. Click the link on the place type of interest and click its link to open the Knowledge Graph page for the entity; for example, **City**.
1. Scroll to the **In Arcs** section to look up the places of interest. 
1. If necessary, continue to drill down on links until you find the place of interest. 

![KG browser]({{site.url}}/assets/images/dc/concept8.png){: width="900"}

To find the DCID for a place using other methods:

- Use the [Google Sheets add-on](/api/sheets/index.html#find-dcid) **Fill place dcids** feature.
- Use the REST v2 [Resolve API](/api/rest/v2/resolve.html), either interactively (e.g. using curl or the browser address bar) or programmatically.
- Use the Python v2 [`resolve.fetch_dcids_by_name`](/api/python/v2/resolve.html#fetch_dcids_by_name) API method, either interactively or programmatically.

To find the DCID for a statistical variable:

1. Open the Statistical Variable Explorer.
1. Search for the variable of interest, and optionally filter by data source and dataset.
1. Look under the heading for the DCID.

![Stat Var Explorer]({{site.url}}/assets/images/dc/concept9.png){: width="900"}

## Property

Every node also contains properties or characteristics that describe its entity, event, or statistical variable. Each property is actually an edge to another node, with a label. If the object node is a primitive type, such as a string, date, or number, it is a "leaf", or terminal node, which we call an _attribute_. Examples are properties such as `latitude`, `year`, various unique IDs and so on. 

Other properties are links to other entities/events/ etc. In the Knowledge Graph, you can click through links to non-terminal nodes. 

For example, in this node for the city of Addis Ababa, Ethiopia, the `typeOf` and `containedInPlace` edges link to other entities, namely `City` and `Ethiopia`, whereas all the other values are terminal.

![KG browser]({{site.url}}/assets/images/dc/concept10.png){: width="600"}

Note that the DCID for a property is the same as its name.

## Observation

An _observation_ is a single measured value for a statistical variable, at or during a specified period of time, for a specific entity.

For example, the value of the statistical variable [`Median Age of Female Population`](https://datacommons.org/browser/Median_Age_Person_Female){: target="_blank"} for the city of San Antonio, Texas in 2014 could have an observation `Observation_Median_Age_Person_Female_SanAntonio_TX_2014`. The type of an observation is always the special sub-class [`StatVarObservation`](https://datacommons.org/browser/StatVarObservation){: target="_blank"}.

Time series made up of many observations underlie the data available in the [Timeline Explorer](https://datacommons.org/tools/timeline){: target="_blank"} and timeline graphs. For example, here is the [median income in Berkeley, CA over a period of ten years](https://datacommons.org/tools/timeline#place=geoId%2F0606000&statsVar=Median_Income_Person){: target="_blank"}, according to the US Census Bureau:

![Timeline Explorer]({{site.url}}/assets/images/dc/concept11.png){: width="900"}

## Provenance, Source, Dataset

Every node and triple also have some important properties that indicate the origin of the data. 

-  [`Provenance`](https://datacommons.org/browser/Provenance){: target="_blank"}: All triples have a provenance, typically the URL of the data provider's website; for example, [www.abs.gov.au](https://datacommons.org/browser/dc/base/AustraliaStatistics){: target="_blank"}.  In addition, all entity types also have a provenance, defined with a DCID, such as [`AustraliaStatistics`](https://datacommons.org/browser/dc/base/AustraliaStatistics){: target="_blank"}. It also (For many property types, which are defined by the Data Commons schema, their provenance is always [datacommons.org](datacommons.org).)
-  [`Source`](https://datacommons.org/browser/Source){: target="_blank"}: This is a property of a provenance, and a dataset, usually the name of an organization that provides the data or the schema. For example, for provenance [www.abs.gov.au](www.abs.gov.au), the source is the [Australian Bureau of Statistics](https://datacommons.org/browser/dc/s/AustralianBureauOfStatistics){: target="_blank"}.
-  [`Dataset`](https://datacommons.org/browser/Dataset){: target="_blank"}: This is the name of a specific dataset provided by a provider. Many sources provide multiple datasets. For example, the source Australian Bureau of Statistics provides two datasets, [Australia Statistics](https://datacommons.org/browser/dc/d/AustralianBureauOfStatistics_AustraliaStatistics){: target="_blank"} (not to be confused with the provenance above), and [Australia Subnational Administrative Boundaries](https://datacommons.org/browser/dc/d/AustralianBureauOfStatistics_AustraliaSubnationalAdministrativeBoundaries){: target="_blank"}.

![Knowledge graph]({{site.url}}/assets/images/dc/concept12.png){: width="600"}


Note that a given statistical variable may have multiple provenances, since many data sets define the same variables. You can see the list of all the data sources for a given statistical variable in the Statistical Variable Explorer. For example, the explorer shows multiple sources (Censuses from India, Mexico, Vietnam, OECD, World Bank, etc.) for the variable [Life Expectancy](https://datacommons.org/tools/statvar#LifeExpectancy_Person=&sv=LifeExpectancy_Person){: target="_blank"}:

![Stat Var Explorer]({{site.url}}/assets/images/dc/concept13.png){: width="900"}

You can see a list of all sources and data sets in several places:

-  The [Data sources](/datasets/) pages in this site.
-  The **Data source** and **Dataset** drop-down menus in the Statistical Variable Explorer.

![Stat Var Explorer]({{site.url}}/assets/images/dc/concept14.png){: width="600"}