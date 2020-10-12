---
layout: default
title: Glossary
nav_order: 4
parent: Background
grand_parent: Contributing to Data Commons
---
# Glossary of Common Terms

This page contains a selection of key terms important to understanding the structure of data within Data Commons.

## Term List

- **[Statistical variable](https://datacommons.org/browser/StatisticalVariable)**

Any type of metric, statistic, or measure that can be measured at a place and time. Examples include median income, median income of females, number of high school graduates, unemployment rate, or prevalence of diabetes. For more information, see ["Intro to `StatisticalVariable` and `StatVarObservation`"](/contributing/background/representing_statistics.html).

- **[Statistical population](https://datacommons.org/browser/StatisticalPopulation)**

A set of instances of a certain given type that satisfy some set of constraints. Inherited from [schema.org definition](https://schema.org/StatisticalPopulation).

- **[Observation](https://datacommons.org/browser/Observation)**

When instantiated, can be used to specify observations about an entity at a particular time. Inherited from [schema.org definition](https://schema.org/Observation).

- **Triple**

A three-part grouping describing node and edge objects in the Data Commons graph.

Given tabular data such as the following:

|country_id  |  country_name	         |  continent_id|
|-------|--------|---------|
|USA	     |  United States of America |  northamerica|
|IND	     |  India                    |	        asia|

You can represent this data as a graph via subject-predicate-object "triples" that describe the node and edge relationships.
```
USA -- typeOf ------------> Country
USA -- name --------------> United States of America
USA -- containedInPlace --> northamerica
```

- **Meta Content Framework (MCF)**

A simple format used to represent graph data, used extensively in Data Commons due to its simple readability. For more information, see [the Data Commons guide to MCF](/contributing/background/mcf_format.html).
