---
layout: default
title: Glossary
nav_order: 4
published: true
parent: How to use Data Commons
---

{: .no_toc}
# Glossary of Common Terms

{: .no_toc}
This page contains a selection of key terms important to understanding the structure of data within Data Commons.

## Term List
{: .no_toc}

* TOC
{:toc}

### [Date](https://datacommons.org/browser/date){: target="_blank"}
{: #date}

The date of measurement. Specified in ISO 8601 format. Examples include `2011` (the year 2011), `2019-06` (the month of June in the year 2019), and `2019-06-05T17:21:00-06:00` (5:17PM on June 5, 2019, in CST).

### DCID
{: #dcid}

Every entity in the Data Commons graph has a unique identifier, called "DCID" (short for "Data Commons Identifier"). So, for example, the DCID of California is [`geoId/06`](https://datacommons.org/browser/geoId/06){: target="_blank"} and of India is [`country/IND`](https://datacommons.org/browser/country/IND){: target="_blank"}. DCIDs are not restricted to entities; every node in the graph has a DCID. Statistical variables have DCID, for example the DCID for the Gini Index of Economic Activity is [`GiniIndex_EconomicActivity`](https://datacommons.org/tools/statvar#GiniIndex_EconomicActivity){: target="_blank"}.

To find a DCID for an entity or variable, see the [Key concepts](/data_model.html#find-dcid) page.

### Entity
{: #entity}

An entity represented by a node in the Data Commons knowledge graph. These can represent a wide range of concepts, including [cities](https://datacommons.org/browser/City){: target="_blank"}, [countries](https://datacommons.org/browser/Country){: target="_blank"}, [elections](https://datacommons.org/browser/election/2016_P_US00){: target="_blank"}, [schools](https://datacommons.org/browser/nces/062961004587){: target="_blank"}, [plants](https://datacommons.org/browser/dc/bsmvthtq89217){: target="_blank"}, or even the [Earth](https://datacommons.org/browser/Earth){: target="_blank"} itself.

### Facet
{: #facet}

Metadata on properties of the data and its provenance. For example, multiple sources might provide data on the same variable, but use different measurement methods, cover data spanning different time spans, use different units of measurement. Data Commons uses "facet" to refer to a dataset's source and its associated metadata.

### [Measurement Denominator](https://datacommons.org/browser/measurementDenominator){: target="_blank"}
{: #measurement-denominator}

The denominator of a fractional measurement.

### [Measurement Method](https://datacommons.org/browser/measurementMethod){: target="_blank"}
{: #measurement-method}

The technique used for measuring a [variable](#variable). Describes how a measurement is made, whether by count or estimate or some other approach. May name the group making the measurement to indicate a certain organizational method of measurement is used. Examples include [the American Community Survey](https://datacommons.org/browser/dc/gg17432){: target="_blank"} and [`WorldHealthOrganizationEstimates`](https://datacommons.org/browser/WorldHealthOrganizationEstimates){: target="_blank"}. Multiple measurement methods may be specified for any given node.

### [Observation (Statistical Variable Observation)](https://datacommons.org/browser/StatVarObservation){: target="_blank"}
{: #observation}

A measurement of a [variable](#variable) for a particular place and time. For example, a `StatVarObservation` of the `StatisticalVariable` `Median_Income_Person` for Brookmont, Maryland, in the year 2018 would be $126,199. A complete list of properties of statistical variable observations can be found in the [Knowledge Graph](https://datacommons.org/browser/StatVarObservation){: target="_blank"}.

### [Observation Period](https://datacommons.org/browser/observationPeriod){: target="_blank"}
{: #observation-period}

The time period over which an [observation](#observation) is made. Specified in [ISO 8601 formatting for durations](https://en.wikipedia.org/wiki/ISO_8601#Durations){: target="_blank"}.

### Place
{: #place}

Entities that describe specific geographic locations. Use the search box in [Place Explorer](https://datacommons.org/place){: target="_blank"} to search for places in the graph, or view the [Knowledge Graph entry for Place](https://datacommons.org/browser/Place){: target="_blank"} for a full view of the node. To learn more about place types, take a look at the [place types page](/place_types.html).

### Preferred Facet
{: #preferred-facet}

When a variable has values from multiple [facets](#facet), one facet is designated the preferred facet. The preferred facet is selected by an internal ranking system which prioritizes the completeness and quality of the data. Unless otherwise specified, endpoints will default to returning values from preferred facets.

### Property
{: #property}

Attributes of the entities in the Data Common knowledge graph. Instead of statistical values, properties describe unchanging characteristics of entities, like [scientific name](https://datacommons.org/browser/scientificName){: target="_blank"}.

### [Scaling Factor](https://datacommons.org/browser/scalingFactor){: target="_blank"}
{: #scaling-factor}

Property of [variables](#variable) that measure proportions, used in conjunction with the measurementDenominator property to indicate the multiplication factor applied to the proportion's denominator (with the measurement value as the final result of the multiplication) when the numerator and denominator are not equal.

As an example, in 1999, [approximately 36% of Canadians were Internet users](https://datacommons.org/browser/dc/o/0d9e3dd3y6yt3){: target="_blank"}. Here the measured value of `Count_Person_IsInternetUser_PerCapita` is 36, and the scaling factor or denominator for this per capita measurement is 100. Without the scaling factor, we would interpret the value to be 36/1, or 3600%.

### [Statistical Variable](https://datacommons.org/browser/StatisticalVariable){: target="_blank"}
{: #variable}

Any type of metric, statistic, or measure that can be measured for a specific entity (most typically a place, but could be any other entity in the graph, such as a school or power plant) and time. Examples include [median income of persons older than 16](https://datacommons.org/browser/Median_Income_Person_16OrMoreYears){: target="_blank"}, [number of female high school graduates aged 18 to 24](https://datacommons.org/browser/Count_Person_18To24Years_EducationalAttainmentHighSchoolGraduateIncludesEquivalency_Female){: target="_blank"}, [unemployment rate](https://browser.datacommons.org/browser/UnemploymentRate_Person){: target="_blank"}, or [percentage of persons with diabetes](https://browser.datacommons.org/browser/Percent_Person_WithDiabetes){: target="_blank"}. A complete list of variables can be found in the [Knowledge Graph](https://datacommons.org/browser/StatisticalVariable){: target="_blank"}.

### [Statistical Variable Group](https://datacommons.org/browser/StatVarGroup){: target="_blank"}
{: #variable-group}

Represents a grouping of variables that are conceptually related, used for display purposes in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar). For example, variable group [Person With Gender = Female](https://datacommons.org/browser/dc/g/Person_Gender-Female){: target="_blank"} consists of variables like [Female Median Age](https://datacommons.org/browser/Median_Age_Person_Female){: target="_blank"}, [Female Median Income](https://datacommons.org/browser/Median_Income_Person_15OrMoreYears_Female_WithIncome){: target="_blank"} etc. A variable group could also have child variable groups, which describe a subset of the parent variable group. For example, variable group [Person With Age, Gender = Female](https://datacommons.org/browser/dc/g/Person_Age_Gender-Female){: target="_blank"} is a child of [Person With Gender = Female](https://datacommons.org/browser/dc/g/Person_Gender-Female){: target="_blank"}. It contains variables that have age constraints.

### [Topic](https://datacommons.org/browser/Topic){: target="_blank"}

Represents a curated collection of statistical variables, used for natural-language search and the [MCP server](/mcp/index.html). For example, the topic [Parents Educational Attainment](https://datacommons.org/browser/dc/topic/ParentsEducationalAttainment){: target="_blank"} consists of variables such as [Percent of Parent: 25 Years or More, Public School, Bachelors Degree or Higher](https://datacommons.org/browser/Percent_Parent_25OrMoreYears_ChildEnrolledInPublicSchool_EducationalAttainmentBachelorsDegreeOrHigher){: target="_blank"} and [Percent of Parent: 25 Years or More, Public School, High School Graduate or Higher](https://datacommons.org/browser/Percent_Parent_25OrMoreYears_ChildEnrolledInPublicSchool_EducationalAttainmentHighSchoolGraduateOrHigher){: target="_blank"}.

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

### [Unit](https://datacommons.org/browser/unit){: target="_blank"}
{: #unit}

The unit of measurement. Examples include [kilowatt hours](https://datacommons.org/browser/KilowattHour){: target="_blank"}, [inches](https://datacommons.org/browser/Inch){: target="_blank"}, and [Indian Rupees](https://datacommons.org/browser/IndianRupee){: target="_blank"}. A complete list of properties can be found in the [Knowledge Graph](https://datacommons.org/browser/unit){: target="_blank"}.
