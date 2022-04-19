---
layout: default
title: BigQuery
nav_order: 4
has_children: true
---

# Data Commons in BigQuery

The entire Data Commons repository is available in the [BigQuery Analytics Hub](https://console.cloud.google.com/bigquery/analytics-hub/exchanges(analyticshub:projects/841968438789/locations/us/dataExchanges/data_commons_17d0b72b0b2/listings/data_commons_1803e67fbc9))
data exchange for linking into your GCP Project. These pages describe how you can work with the Data Commons tables and include sample SQL queries.

## In a Nutshell: What's Different about Data Commons

Data Commons (DC) synthesizes a single graph from a [large number of sources](https://docs.datacommons.org/datasets/) into a single _data source_. It resolves references to the same entities (such as cities, counties, organizations, etc.) across different datasets so that users can access data about a particular entity aggregated from different sources without data cleaning or joining.

Today, DC contains over 3B time series about 90k variables about around 3M entities. This single data source has been pulled together from across many thousands of ‘traditional’ tables. This document briefly goes over how you can determine what data is available, explore it and construct BQ queries to retrieve it.

We first go over some DC basics and then give a sequence of examples of increasing complexity. Every DC [Map visualization](https://datacommons.org/tools/map#%26sv%3DAnnual_Emissions_GreenhouseGas_NonBiogenic%26pc%3D0%26denom%3DCount_Person%26pd%3Dcountry%2FUSA%26ept%3DState%26ppt%3DEpaReportingFacility) and [Time Series](https://datacommons.org/tools/timeline#&place=geoId/0606000,geoId/2511000,geoId/2603000,geoId/1777005,geoId/1225175,geoId/4815976&statsVar=Count_CriminalActivities_ViolentCrime) visualization also links to the corresponding BQ query for obtaining the data used in that visualization

## Details

[What Data is in DC](/bigquery/data_in_bq.html)

[Unique Identifiers](/bigquery/unique_identifiers.html)

[Sample Queries](/bigquery/dc_to_bq_queries.html)
