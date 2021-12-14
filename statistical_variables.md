---
layout: default
title: Statistical Variables
nav_order: 4
---

# Statistical Variables

Many of the Data Commons APIs deal with Data Commons nodes of the type
[StatisticalVariable](https://datacommons.org/browser/StatisticalVariable). 

A Statistical Variable, StatVar for short, represents different properties on which
a particular measurement is constrained upon. For instance, if you are looking for
stats about the [*male population*](https://datacommons/org/browser/Count_Person_Male) in a specific geographic level (a geographic level could be a country, state, county, city, school district), then in data commons there is a 
StatisticalVariable node that would be defined like:

```
Node: dcid:Count_Person_Male
typeOf: dcs:StatisticalVariable
statType: dcs:measuredValue
populationType: schema:Person
gender: dcs:Male
measuredProperty: dcs:count
```

To explore the different Statistical Variables in Data Commons, please visit the [StatVar Explorer tool](https://datacommons.org/tools/statvar)
