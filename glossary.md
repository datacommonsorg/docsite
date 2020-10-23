---
layout: default
title: Glossary
nav_order: 7
---
# Glossary of Common Terms

This page contains a selection of key terms important to understanding the structure of data within Data Commons.

## Term List

- **[Statistical variable](https://datacommons.org/browser/StatisticalVariable)**

Any type of metric, statistic, or measure that can be measured at a place and time. Examples include median income, median income of females, number of high school graduates, unemployment rate, or prevalence of diabetes.

- **[Statistical variable observation](https://datacommons.org/browser/StatVarObservation)**

A measurement of a StatisticalVariable for a particular place and time.

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

- **DCID**

A unique identifier itemizing and classifying an entity in the Data Commons graph. For example, Austin, Texas, has a DCID of 'geoId/4805000', while the plant species _Austrobaileya scandens_ has a DCID of 'dc/bsmvthtq89217'.