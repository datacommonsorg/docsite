---
layout: default
title: Glossary
nav_order: 7
published: true
---
# Glossary of Common Terms

This page contains a selection of key terms important to understanding the structure of data within Data Commons.

## Term List

- **[Cohort](http://browser.datacommons.org/kg?dcid=CohortSet)**

A group of entities sharing some characteristic. Interchangeably referred to in a Data Commons context as `Cohort` and `CohortSet`. Examples include [the CDC's list of the United States' 500 largest cities](https://datacommons.org/browser/CDC500_City).

>  **NOTE:**
>
>  The type `Cohort` documented at <https://datacommons.org/browser/Cohort> is a legacy type not used by the Sheets method `DCCOHORTMEMBERS()`.

- **[Date](https://datacommons.org/browser/date)**

The date of measurement. Specified in ISO 8601 format. Examples include `2011` (the year 2011), `2019-06` (the month of June in the year 2019), and `2019-06-05T17:21:00-06:00` (5:17PM on June 5, 2019, in CST).

- **DCID**

A unique identifier itemizing and classifying an entity in the Data Commons graph. For example, Austin, Texas, has a DCID of 'geoId/4805000', while the plant species _Austrobaileya scandens_ has a DCID of 'dc/bsmvthtq89217'.

- **[Measurement denominator](https://datacommons.org/browser/measurementDenominator)**

The denominator of a fractional measurement. A complete list of properties can be found at <https://datacommons.org/browser/measurementDenominator>.

- **[Measurement method](https://datacommons.org/browser/measurementMethod)**

The technique used for measuring a statistical variable. Describes how a measurement is made, whether by count or estimate or some other approach. May name the group making the measurement to indicate a certain organizational method of measurement is used. Examples include [the American Community Survey](https://datacommons.org/browser/dc/gg17432) and [`WorldHealthOrganizationEstimates`](https://datacommons.org/browser/WorldHealthOrganizationEstimates). Multiple measurement methods may be specified for any given node. A complete list of properties can be found at <https://datacommons.org/browser/measurementMethod>.

- **[Observation period](https://datacommons.org/browser/observationPeriod)**

The time period over which an observation is made. A complete list of properties can be found at <https://datacommons.org/browser/observationPeriod>.

- **[Scaling factor](https://datacommons.org/browser/scalingFactor)**

Property of statistical variables that measure proportions, used in conjunction with the measurementDenominator property to indicate the multiplication factor applied to the proportion's denominator (with the measurement value as the final result of the multiplication) when the numerator and denominator are not equal.

As an example, in 1999, [approximately 36% of Canadians were Internet users](https://datacommons.org/browser/dc/o/2mthzyv99kd73). Here the measured value of `Count_Person_IsInternetUser_PerCapita` is 36, and the scaling factor or denominator for this per capita measurement is 100. Without the scaling factor, we would interpret the value to be 36/1, or 3600%.

A complete list of properties can be found at <https://datacommons.org/browser/scalingFactor>.

- **[Statistical variable](https://datacommons.org/browser/StatisticalVariable)**

Any type of metric, statistic, or measure that can be measured at a place and time. Examples include [median income of persons older than 16](https://datacommons.org/browser/Median_Income_Person_16OrMoreYears), [number of female high school graduates aged 18 to 24](https://datacommons.org/browser/Count_Person_18To24Years_EducationalAttainmentHighSchoolGraduateIncludesEquivalency_Female), [unemployment rate](https://browser.datacommons.org/browser/UnemploymentRate_Person), or [percentage of persons with diabetes](https://browser.datacommons.org/browser/Percent_Person_WithDiabetes). A complete list of statistical variables can be found at <https://datacommons.org/browser/StatisticalVariable>.

- **[Statistical variable observation](https://datacommons.org/browser/StatVarObservation)**

A measurement of a `StatisticalVariable` for a particular place and time. For example, a `StatVarObservation` of the `StatisticalVariable` `Median_Income_Person` for Brookmont, Maryland, in the year 2018 would be $126,199. A complete list of properties of statistical variable observations can be found at <https://datacommons.org/browser/StatVarObservation>.

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

- **[Unit](https://datacommons.org/browser/unit)**

The unit of measurement. Examples include [kilowatt hours](https://datacommons.org/browser/KilowattHour), [inches](https://datacommons.org/browser/Inch), and [Indian Rupees](https://datacommons.org/browser/IndianRupee). A complete list of properties can be found at <https://datacommons.org/browser/unit>.