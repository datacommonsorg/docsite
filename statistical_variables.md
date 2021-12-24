---
layout: default
title: Statistical Variables
nav_order: 4
---

# Statistical Variables

<div markdown="span" class="alert alert-success" role="alert">
    <i class="fa fa-info-circle"></i> <b>Note:</b>
    The list of curated statistical variables listed on this page is no longer available.<br>
    Please use the <a href="https://datacommons.org/tools/statvar#">StatVar Explorer tool</a> which always has the most recent list of statistical variables.
</div>

Many of the data commons APIs deal with data commons nodes of the type
[StatisticalVariable](https://datacommons.org/browser/StatisticalVariable). A StatisticalVariable is a node on the data commons knowledge graog that captures any type of metric, statistic or measure that can measured at a place and time. For instance the [number of males in a population](https://datacommons.org/browser/Count_Person_Male).

Using the [StatVar Explorer tool](https://datacommons.org/tools/statvar), it is easy for you to get an overview of the different data sources in which the [number of males in a population](https://datacommons.org/browser/Count_Person_Male) is observed as a data point. The tool also enables you to view the available observations made for the StatisticalVariable at different places with example observation time-series to visualize and counts of the number of places for which the statistics are available.

The StatVar Explorer tool is also helpful to find exisiting StatisticalVariable definitions which you can re-use in your data import. In the context of the [example StatisticalVariable](https://datacommons.org/browser/Count_Person_Male), you search for it using search terms like "Person Male" and the result will have all the StatisticalVariables that are avaialble on the data commons knowledge graph containing the `populationType = Person` and `gender = Male`. The [example StatisticalVariable](https://datacommons.org/browser/Count_Person_Male) can be accessed by the name of the StatisticalVariable, in this case `Male Population` from the hierarchy of StatisticalVariables (on left-pane of the page) occuring for the `Person With Gender = Male` result. 

<div markdown="span" class="alert alert-warning" role="alert">
    <i class="fa fa-lightbulb-o"></i> <b>Tip:</b>
    Using the populationType with values of properties of a StatisticalVariable node will make it easier to find the closest matching StatisticalVariable in the knowledge graph. For example, `Atmosphere air quality index` will show all available StatisticalVariables that are related to air quality.
</div>