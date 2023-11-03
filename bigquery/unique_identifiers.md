---
layout: default
title: Unique Identifiers
nav_order: 2
parent: BigQuery
---

# Unique Identifiers (DCID)

Every entity in Data Commons (DC) has a unique identifier, called ‘DCID’. So, for example, the DCID of California is ['geoId/06'](https://datacommons.org/place/geoId/06) and of India is ['country/IND'](https://datacommons.org/place/country/IND). DCIDs are not restricted to entities; statistical variables also have DCID, for example the DCID for the Gini Index of Economic Activity is ['GiniIndex_EconomicActivity'](https://datacommons.org/tools/statvar#GiniIndex_EconomicActivity).

Answers to questions like ‘what are all the cities in California?’ is a set of DCIDs for the cities. To facilitate joining DC entities with non-DC data, Data Commons stores the various unique IDs (e.g., FIPS, Wikidata ID, Google Maps place ID, etc) used to reference places in different sources. See the sample queries about [Joining DC with your own data](/bigquery/query_join_your_data.html) for some examples.

You can find the DCID for a place by searching for it in the [Place Explorer tool](https://datacommons.org/place), and the DCID for statistical variables in the [Statistical Variable Explorer tool](https://datacommons.org/tools/statvar).
