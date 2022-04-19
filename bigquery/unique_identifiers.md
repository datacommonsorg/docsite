---
layout: default
title: Unique Identifiers
nav_order: 2
parent: BigQuery
---

# Unique Identifiers (DCid)

Every entity in DC has a unique identifier, called ‘dcid’. So, for example, the DCid of California is ['geoId/06'](https://datacommons.org/place/geoId/06) and of India is ['country/IND'](https://datacommons.org/place/country/IND). DCids are not restricted to entities; statistical variables also have DCids, for example the DCid for the Gini Index of Economic Activity is ['GiniIndex_EconomicActivity'](https://datacommons.org/tools/statvar#GiniIndex_EconomicActivity).

Answers to questions like ‘what are all the cities in California?’ is a set of DCids for the cities. Given that much of the places data comes from well-known data sources, e.g. WikiData, Data Commons retains references to the unique IDs in those data sources. This helps facilitate joining DC entities with non-DC data. See the sample queries about [Joining DC with your own data](/bigquery/query_join_your_data.html) for some examples.

You can find the DCid for a place by searching for it in the [Place Explorer tool](https://datacommons.org/place).
