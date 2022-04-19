---
layout: default
title: What Data is in DC
nav_order: 1
parent: BigQuery
---

# What Data is in Data Commons

## Places

While Data Commons (DC) has information about a wide variety of types of entities (cities, states, countries, schools, companies, facilities, etc.), most of the information today is about places. DC contains a catalog of about 2.9 million places. In addition to basic metadata like the location, type and containment information, many places also contain information about their shape, area, etc.

The most common type of information about places is in the form of a time series. Each time series is a set of observations, across a set of time periods, about a combination of a place and a variable (also called statistical variable) from a particular source. As an example, [here is the median income in Berkeley, CA over a period of ten years](https://datacommons.org/tools/timeline#place=geoId%2F0606000&statsVar=Median_Income_Person), according to the US Census Bureau.

See the sample queries about [Places](/bigquery/query_places.html) and [Properties of Places](/bigquery/query_property_places.html) to explore further.


## Statistical Variables

DC contains over 90,000 distinct variables, a.k.a. 'statistical variables', all of whom can be explored in the [statistical variable explorer tool](https://autopush.datacommons.org/tools/statvar). Not all places have observations corresponding to every one of these variables. For example the [Average Retail Price of Electricity](https://datacommons.org/tools/statvar#Quarterly_Average_RetailPrice_Electricity) is available for all States in the US but this information is not available at the City or County level like it is for the [Count of Households with no Health Insurance](https://datacommons.org/tools/statvar#Count_Household_NoHealthInsurance) . The Map and timeline tools can not only be for visualizations, but also for determining what variables are available for a given geography. To do so, visit the [Map Explorer](https://datacommons.org/tools/map), type the name of a geographic region like "United States" or "India" and select an administrative entity level (place type) from the dropdown on the right. You will notice the Statistical Variables on the left pane filtered to the relevant set only.

See the [sample queries section](/bigquery/dc_to_bq_queries.html) to experiment with variables.

## Data Sources

Often different sources provide data for the same variable. As an example, sources for a given series can be seen for Life Expectancy in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar#LifeExpectancy_Person). Life Expectancy data in DC is sourced from the World Development Indicators and from EuroStat, and the same place can have data from both sources. You can select the data source in the Map View or Timeline visualization by clicking on the **Select Source** button below the chart. For example, in the [Map View for Life Expectancy in all countries of the world](https://datacommons.org/tools/map#%26sv%3DLifeExpectancy_Person%26pc%3D0%26denom%3DCount_Person%26src%3D3563600999%26pd%3DEarth%26ept%3DCountry).

See the sample queries about [Properties of Places](/bigquery/query_property_places.html) to see how to filter by source. Sources are named and as shown in the [sample queries](/bigquery/dc_to_bq_queries.html), we can specify a source, if needed.
