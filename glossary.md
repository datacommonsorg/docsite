---
layout: default
title: Glossary
nav_order: 7
published: false
---
# Glossary of Common Terms

This page contains a selection of key terms important to understanding the structure of data within Data Commons.

## Term List

- **DCID**

A unique identifier itemizing and classifying an entity in the Data Commons graph. For example, Austin, Texas, has a DCID of 'geoId/4805000', while the plant species _Austrobaileya scandens_ has a DCID of 'dc/bsmvthtq89217'.

- **[Statistical variable](https://datacommons.org/browser/StatisticalVariable)**

Any type of metric, statistic, or measure that can be measured at a place and time. Examples include [median income of persons older than 16](https://datacommons.org/browser/Median_Income_Person_16OrMoreYears), [number of female high school graduates aged 18 to 24](https://datacommons.org/browser/Count_Person_18To24Years_EducationalAttainmentHighSchoolGraduateIncludesEquivalency_Female), [unemployment rate](https://browser.datacommons.org/browser/UnemploymentRate_Person), or [percentage of persons with diabetes](https://browser.datacommons.org/browser/Percent_Person_WithDiabetes). A complete list of statistical variables can be found at <https://datacommons.org/browser/StatisticalVariable>.

- **[Statistical variable observation](https://datacommons.org/browser/StatVarObservation)**

A measurement of a StatisticalVariable for a particular place and time. For example, a StatVarObservation of the StatisticalVariable Median_Income_Person for Brookmont, Maryland, in the year 2018 would be $126,199.

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

- **[Measurement method](https://datacommons.org/browser/measurementMethod)**

The technique used for measuring a statistical variable. Describes how a measurement is made, whether by count or estimate or some other approach, and names the group making the measurement. Examples include `BosniaCensus` and [`WorldHealthOrganizationEstimates`](https://datacommons.org/browser/WorldHealthOrganizationEstimates).

- **[Observation period](https://datacommons.org/browser/observationPeriod)**

The time period over which an observation is made.

- **[Unit](https://datacommons.org/browser/unit)**

The unit of measurement. Examples include Kelvin, Celsius, inches, light years, and slugs.

- **[Scaling factor](https://datacommons.org/browser/scalingFactor)**

Factor by which a measurement is adjusted to fit a certain format. For example, a proportion of 0.05 displayed as 5% has a scaling factor of 100.