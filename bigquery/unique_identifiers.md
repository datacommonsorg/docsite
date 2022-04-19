---
layout: default
title: Unique Identifiers
nav_order: 2
parent: BigQuery
---

# Unique Identifiers (dcid)

Every entity in Data Commons (DC) has a unique identifier, called ‘dcid’. So, for example, the dcid of California is ['geoId/06'](https://datacommons.org/place/geoId/06) and of India is ['country/IND'](https://datacommons.org/place/country/IND). dcids are not restricted to entities; statistical variables also have dcid, for example the dcid for the Gini Index of Economic Activity is ['GiniIndex_EconomicActivity'](https://datacommons.org/tools/statvar#GiniIndex_EconomicActivity).

Answers to questions like ‘what are all the cities in California?’ is a set of dcid for the cities. To facilitate joining DC entities with non-DC data, Data Commons stores the various unique IDs (e.g., FIPS, Wikidata ID, Google Maps place ID, etc) used to reference places in different sources. See the sample queries about [Joining DC with your own data](/bigquery/query_join_your_data.html) for some examples.

You can find the dcid for a place by searching for it in the [Place Explorer tool](https://datacommons.org/place).
