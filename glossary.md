---
layout: default
title: Glossary
nav_order: 130
published: true
---

# Glossary of Common Terms

{: .no_toc}
This page contains a selection of key terms important to understanding the structure of data within Data Commons.

## Term List
{: .no_toc}

* TOC
{:toc}

### [Cohort](https://datacommons.org/browser/CohortSet)
{: #cohort}

A group of entities sharing some characteristic. Interchangeably referred to in a Data Commons context as `Cohort` and `CohortSet`. Examples include [the CDC's list of the United States' 500 largest cities](https://datacommons.org/browser/CDC500_City).

<div markdown="span" class="alert alert-info" role="alert">
    <span class="material-icons md-16">info </span><b>Note:</b>
    The type [`Cohort`](https://datacommons.org/browser/Cohort) is a legacy type not used by the Sheets method `DCCOHORTMEMBERS()`.
</div>

### [Date](https://datacommons.org/browser/date)
{: #date}

The date of measurement. Specified in ISO 8601 format. Examples include `2011` (the year 2011), `2019-06` (the month of June in the year 2019), and `2019-06-05T17:21:00-06:00` (5:17PM on June 5, 2019, in CST).

### DCID
{: #dcid}

Every entity in the Data Commons graph has a unique identifier, called ‘DCID’ (short for Data Commons Identifier). So, for example, the DCID of California is [`geoId/06`](https://datacommons.org/browser/geoId/06) and of India is [`country/IND`](https://datacommons.org/browser/country/IND). DCIDs are not restricted to entities; every node in the graph has a DCID. Statistical variables have DCID, for example the DCID for the Gini Index of Economic Activity is [`GiniIndex_EconomicActivity`](https://datacommons.org/tools/statvar#GiniIndex_EconomicActivity).

You can find the DCID for a place by searching for it in the [Place Explorer tool](https://datacommons.org/place), and the DCID for statistical variables in the [Statistical Variable Explorer tool](https://datacommons.org/tools/statvar). All nodes have an entry in the [Graph Browser](https://datacommons.org/browser/).

### Entity
{: #entity}

An entity represented by a node in the Data Commons knowledge graph. These can represent a wide range of concepts, including [cities](https://datacommons.org/browser/City), [countries](https://datacommons.org/browser/Country), [elections](https://datacommons.org/browser/election/2016_P_US00), [schools](https://datacommons.org/browser/nces/062961004587), [plants](https://datacommons.org/browser/dc/bsmvthtq89217), or even the [Earth](https://datacommons.org/browser/Earth) itself.

### Facet
{: #facet}

Metadata on properties of the data and its provenance. For example, multiple sources might provide data on the same variable, but use different measurement methods, cover data spanning different time spans, or use different underlying predictive models. Data Commons uses "facet" to refer to a data's source and its associated metadata.

### [Measurement Denominator](https://datacommons.org/browser/measurementDenominator)
{: #measurement-denominator}

The denominator of a fractional measurement.

### [Measurement Method](https://datacommons.org/browser/measurementMethod)
{: #measurement-method}

The technique used for measuring a [variable](#variable). Describes how a measurement is made, whether by count or estimate or some other approach. May name the group making the measurement to indicate a certain organizational method of measurement is used. Examples include [the American Community Survey](https://datacommons.org/browser/dc/gg17432) and [`WorldHealthOrganizationEstimates`](https://datacommons.org/browser/WorldHealthOrganizationEstimates). Multiple measurement methods may be specified for any given node.

### [Observation (Statistical Variable Observation)](https://datacommons.org/browser/StatVarObservation)
{: #observation}

A measurement of a [variable](#variable) for a particular place and time. For example, a `StatVarObservation` of the `StatisticalVariable` `Median_Income_Person` for Brookmont, Maryland, in the year 2018 would be $126,199. A complete list of properties of statistical variable observations can be found in the [graph browser](https://datacommons.org/browser/StatVarObservation).

### [Observation Period](https://datacommons.org/browser/observationPeriod)
{: #observation-period}

The time period over which an [observation](#observation) is made. Specified in [ISO 8601 formatting for durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).

### Place
{: #place}

Entities that describe specific geographic locations. Use the search box in [Place Explorer](https://datacommons.org/place) to search for places in the graph, or view the [Graph Browser entry for Place](https://datacommons.org/browser/Place) for a full view of the node.

### Preferred Facet
{: #preferred-facet}

When a variable has values from multiple [facets](#facet), one facet is designated the preferred facet. The preferred facet is selected by an internal ranking system which prioritizes the completeness and quality of the data. Unless otherwise specified, endpoints will default to returning values from preferred facets.

### Property
{: #property}

Attributes of the entities in the Data Common knowledge graph. Instead of statistical values, properties describe unchanging characteristics of entities, like [scientific name](https://datacommons.org/browser/scientificName).

### [Scaling Factor](https://datacommons.org/browser/scalingFactor)
{: #scaling-factor}

Property of [variables](#variable) that measure proportions, used in conjunction with the measurementDenominator property to indicate the multiplication factor applied to the proportion's denominator (with the measurement value as the final result of the multiplication) when the numerator and denominator are not equal.

As an example, in 1999, [approximately 36% of Canadians were Internet users](https://datacommons.org/browser/dc/o/0d9e3dd3y6yt3). Here the measured value of `Count_Person_IsInternetUser_PerCapita` is 36, and the scaling factor or denominator for this per capita measurement is 100. Without the scaling factor, we would interpret the value to be 36/1, or 3600%.

A complete list of properties can be found in the [graph browser](https://datacommons.org/browser/scalingFactor).

### Triple
{: #triple}

A three-part grouping describing node and edge objects in the Data Commons graph.

Given tabular data such as the following:

| country_id | country_name             | continent_id |
| ---------- | ------------------------ | ------------ |
| USA        | United States of America | northamerica |
| IND        | India                    | asia         |

You can represent this data as a graph via subject-predicate-object "triples" that describe the node and edge relationships.

```
USA -- typeOf ------------> Country
USA -- name --------------> United States of America
USA -- containedInPlace --> northamerica
```

### [Unit](https://datacommons.org/browser/unit)
{: #unit}

The unit of measurement. Examples include [kilowatt hours](https://datacommons.org/browser/KilowattHour), [inches](https://datacommons.org/browser/Inch), and [Indian Rupees](https://datacommons.org/browser/IndianRupee). A complete list of properties can be found in the [graph browser](https://datacommons.org/browser/unit).

### [Statistical Variable](https://datacommons.org/browser/StatisticalVariable)
{: #variable}

Any type of metric, statistic, or measure that can be measured at a place and time. Examples include [median income of persons older than 16](https://datacommons.org/browser/Median_Income_Person_16OrMoreYears), [number of female high school graduates aged 18 to 24](https://datacommons.org/browser/Count_Person_18To24Years_EducationalAttainmentHighSchoolGraduateIncludesEquivalency_Female), [unemployment rate](https://browser.datacommons.org/browser/UnemploymentRate_Person), or [percentage of persons with diabetes](https://browser.datacommons.org/browser/Percent_Person_WithDiabetes). A complete list of variables can be found in the [graph browser](https://datacommons.org/browser/StatisticalVariable).

### [Statistical Variable Group](https://datacommons.org/browser/StatVarGroup)
{: #variable-group}

Represents a grouping of variables that are conceptually related. For example, variable group [Person With Gender = Female](https://datacommons.org/browser/dc/g/Person_Gender-Female) consists of variables like [Female Median Age](https://datacommons.org/browser/Median_Age_Person_Female), [Female Median Income](https://datacommons.org/browser/Median_Income_Person_15OrMoreYears_Female_WithIncome) and etc. A variable group could also have child variable groups, which describe a subset of the parent variable group. For example, variable group [Person With Age, Gender = Female](https://datacommons.org/browser/dc/g/Person_Age_Gender-Female) is a child of [Person With Gender = Female](https://datacommons.org/browser/dc/g/Person_Gender-Female). It contains variables that have age constraints.
