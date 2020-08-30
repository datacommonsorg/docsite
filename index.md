---
layout: default
title: About Data Commons
nav_order: 1
has_children: true
---

# Data Commons:<br>Linking the world's public datasets

Today's web contains billions of files of various formats hosted on computers
scattered all over the world. Finding relevant files would be insanely difficult
without the invention of the World Wide Web, the web browser, and search
engines. The Web allowed pages to link to one another, creating a web of
documents. The web browser gave users the ability to view and intuitively
navigate through the web. Search engines made it easy to find relevant files.
Together, the web, the browser, and the search engine give users a simple and
unified browsing experience for files.

Similarly, today we have many little datasets all over the web. We need the
analogs of a single web and search engine to give the developer the ability to
pretend that all of this data, across billions of files, are all in a single
local database. We call the system that does this "Data Commons".

### What is Data Commons?

Data Commons is an open effort to build a Web of *machine understandable data*,
similar to today's Web of *human understandable documents*, by organizing
structured data into a single graph that seamlessly relates disparate
data sources and reduces the cost of using data.

The Data Commons Graph of structured data:

1.  is a **graph**: though the information may come from different publishers
    and sources, they are all unified under a common organization easily
    represented as a graph.
1.  contains **structured data**: Data Commons enforces a degree of structure
    provided by [standardized schemas](http://Schema.org) in order to make its
    information programmatically accessible.
1.  is **open**: built by extending the [schema.org](http://schema.org) and is
    [open sourced](https://github.com/datacommonsorg)

Towards these three goals, the Data Commons Graph is synthesized from
disparate data sources, linking references to the same entities across these
different datasets to nodes on the graph. By connecting datasets in this way,
Data Commons allows for fast analysis across datasets with unbounded degrees
of separation. As a community effort, Data Commons could significantly reduce
the work required for impactful data analysis, as well as duplicate work
spent on data curation.

### What does this look like in practice?

![Example Data Commons Subgraph](/assets/images/home_graph.svg)

The Data Commons Graph (DCG) stores information on entities (represented as
nodes in the graph above) such as Oakland and Berkeley, Alameda County,
California, and the USA. The information is encoded as statements such as

-   Oakland is containedInPlace Alameda County
-   Berkeley is the location of a population of Households with annual income
    between $30,000 and $34,999
-   California was the location of an US Senate Election for California in 2012

Each statement contains two entities that are related by a property
(represented as edges in the graph above). Indeed, what is meant by **structured
data** is that all information is encoded as statements of this form. This graph
is also unified in the sense that data, regardless of where it is sourced, gets
surfaced as a single representation. The fact that Berkeley and Oakland are
contained in Alameda County which is contained in California which is contained
in the United States is given by Wikidata. Meanwhile, the fact that there were
1331 households making between $30,000 and $34,999 in Berkeley in 2017 is given
by the US Census.

As a final note, the type of entities in the DCG and the properties that relate
these entities together is standardized through the Data Commons
[data model](/data_model.html).

### Why Data Commons?

An increasing number of the pieces required to build an application are now
"horizontal": not specific to the application. Everything from storage and
networking to the client are available as a service. However, data pipelines
are still remarkably vertical. The same data gets collected, normalized,
stored, integrated, etc. over and over again, often poorly. The cost of
getting the data into a form usable for analysis or modeling and keeping it
updated often doesn't justify the (possibly yet unknown) benefits. While
there will always be some data proprietary to some applications, there is an
opportunity to make the commonly used data available as a service.

Large datasets are behind many of today’s machine learning "wins". As public
cloud infrastructure of compute, storage, networking get commoditized, the
platform that wins will be the one that makes it easy to work with large
relevant datasets. Easy access to structured data becomes even more important
as machine learning grows beyond perception to domains involving places,
organizations, products, etc. Using the Data Commons Graph, in conjunction
with their own data, we will enable researchers, data scientists, and
students to analyse data, generate insights and make decisions in a super
simple manner.

### What Can Data Commons Do Today?

The Data Commons team has "jump-started" the DCG with data from publicly
available sources like the US Census, Eurostat, OECD, World Bank, FBI, CDC,
BLS, FEC, and others (see [the complete list
here](https://datacommons.org/datasets)). We welcome all to build interesting
and impactful applications using Data Commons.

If you want to
[find how prevalent obesity is in US Cities or analyze genomic data](/tutorials.html) -
you can do that now with relatively little effort, without cleaning up disparate
datasets with different schema or writing complex joins across tables.

Analysis that used to take weeks of tedious work is now reduced to days.

### Get Involved

[Join the discussion on GitHub](https://github.com/datacommonsorg/docsite/issues).