---
layout: default
title: Getting Started Guide
nav_order: 0
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/getting_started
---

# Getting Started Guide

Welcome! Whether you're new to Data Commons or are just looking for a refresher, this guide gives an overview of what you need to know to get started using our REST API.

Use the links below to jump to any section:

* TOC
{:toc}

## What is a REST API?

Our REST API follows the [RESTful architectural style](https://en.wikipedia.org/wiki/Representational_state_transfer) to allow you to query the Data Commons Knowledge Graph via [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). This allows you to explore the local graph and query data from specific variables and entities programatically.

## How to Use the REST API

Our REST API can be used with any tool or language that supports HTTP. You can make queries on the command line (e.g. using [cURL](https://curl.se/)), by scripting HTTP requests in another language like javascript, or even by entering an endpoint into your web browser!

Following HTTP, a REST API call consists of a **request** that you provide, and a **response** from our servers with the data you requested in [JSON](https://json.org) format. The next section details how to assemble a request.

### Assembling a Request

#### Endpoints

Requests are made through [API endpoints](https://en.wikipedia.org/wiki/Web_API#Endpoints). We provide endpoints for many different queries (see the list of available endpoints [here](/api/rest/v1)).

Each endpoint can be acessed using its unique URL, which is a combination of a base URL and the endpoint's [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier).

The base URL for all REST endpoints is:

```bash
https://api.datacommons.org
```

And a URI looks like [ `/v1/observation/point` ](/api/rest/v1/observation/point). To access a particular endpoint, append the URI to the base URL (e.g. `https://api.datacommons.org/v1/observation/point` ).

#### Parameters

Endpoints take a set of **parameters** which allow you to specify which entities, variables, timescales, etc. you are interested in. There are two kinds of parameters: path parameters and query parameters.

##### Path Parameters

Path parameters must be passed in a specific order as part of the URL. For example, `/v1/observations/point` requires the DCIDs of the entity and variable to query, in that order. This would look something like:

```bash
https://api.datacommons.org/v1/observations/point/entity_DCID/variable_DCID
```

##### Query Parameters

Query parameters are chained at the end of a URL behind a `?` symbol. Separate multiple parameter entries with an `&` symbol. For example, this would look like:

```bash
https://api.datacommons.org/v1/observations/point/variable_DCID/entity_DCID?date=YYYY&facet=XXXXXXXXXXX
```

Still confused? Each endpoint's documentation page has examples at the bottom tailored to the endpoint you're trying to use.

#### Finding Available Entities, Variables, and their DCIDs

Most requests require the DCID of the entity or variable you wish to query. Curious what entities and variables are available? Want to find a DCID? Take a look at our explorer tools:

- [Search](https://datacommons.org/search) Search Data Commons
- [Graph Browser](https://datacommons.org/browser/) Click through the knowledge graph
- [Place Browser](https://datacommons.org/place) Summaries of data available for entities that are geographic locations
- [Statistical Variable Explorer](https://datacommons.org/tools/statvar) See metadata for variables

#### Finding Datetimes for Observations

Many endpoints allow the user to filter their results to specific dates. When querying for data at a specific date, the string passed for the date queried must match the date format (in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601)) used by the target variable. An easy way to see what date format a variable uses is to look up your variable of interest in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar).

### Bulk Retrieval

Many of our APIs come in both “simple” and “bulk” versions. The simple versions of endpoints have prefix `/v1/` and are designed for handling single requests with a simplified return structure. The bulk versions of endpoints have prefix `/v1/bulk/` and are meant for querying multiple variables or entities at once, and provide richer details in the response.

#### POST requests

Some bulk endpoints allow for `POST` requests. For `POST` requests, feed all parameters in JSON format. For example, in cURL, this would look like:

```bash
curl -X POST \
--url https://api.datacommons.org/v1/bulk/observations/point \
--data '{
  "entities": [
    "entity_dcid_1",
    "entity_dcid_2",
    ...
  ],
  "variables: [
    "variable_dcid_1",
    "variable_dcid_2",
    ...
  ]
}'
```

<!--

##### Pagination

(Description of how pagination for bulk APIs works will go here.)

### Authentication

(Details about getting and setting API keys will go here.)
-->

## Troubleshooting

### Common Error Responses

#### "Method does not exist"
```json
{
  "code": 5,
  "message": "Method does not exist.",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "service_control"
    }
  ]
}
```
This is most commonly seen when the endpoint is misspelled or otherwise malformed. Check the spelling of your endpoint and that all required path parameters are provided in the right order.

#### "Invalid request URI"
```json
{
  "code": 3,
  "message": "Invalid request URI",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```
This is most commonly seen when your request is missing a required path parameter. Make sure endpoints and parameters are both spelled correctly and provided in the right order.

#### Empty Response


```json
{}
```
Sometimes your query might return an empty result. This is most commonly seen when the value provided for a parameter is misspelled or doesn't exist. Make sure the values you are passing for parameters are spelled correctly.

#### "Could not find field <field> in the type"
```json
{
 "code": 3,
 "message": "Could not find field \"variables\" in the type \"datacommons.v1.BulkVariableInfoRequest\".",
 "details": [
  {
   "@type": "type.googleapis.com/google.rpc.DebugInfo",
   "stackEntries": [],
   "detail": "internal"
  }
 ]
}
```
This is most commonly seen when a query parameter is misspelled or incorrect. Check the spelling of query parameters.

## Key Terms
Throughout the REST API documentation, you'll see the following terminology used:

#### Entity
{: #entity}

An entity represented by a node in the Data Commons knowledge graph. These can represent a wide range of concepts, including [cities](https://datacommons.org/browser/City), [countries](https://datacommons.org/browser/Country), [elections](https://datacommons.org/browser/election/2016_P_US00), [schools](https://datacommons.org/browser/nces/062961004587), [plants](https://datacommons.org/browser/dc/bsmvthtq89217), or even the [Earth](https://datacommons.org/browser/Earth) itself.

#### DCID
{: #dcid}

Short for 'Data Commons Identifier', a DCID is a distinct identifier for a node in the knowledge graph. These can represent variables or entities. For example, Austin, Texas, has a DCID of `geoId/4805000`, while the plant species _Austrobaileya scandens_ has a DCID of `dc/bsmvthtq89217`.

#### Property
{: #property}

Attributes of the entities in the Data Common knowledge graph. Instead of statistical values, properties describe unchanging characteristics of entities, like [scientific name](https://datacommons.org/browser/scientificName).


#### Triple
{: #triple}

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

#### Place
{: #place}

Entities that describe specific geographic locations.

#### Cohort
{: #cohort}

A group of entities sharing some characteristic. Interchangeably referred to in a Data Commons context as `Cohort` and `CohortSet`. Examples include [the CDC's list of the United States' 500 largest cities](https://datacommons.org/browser/CDC500_City).

<div markdown="span" class="alert alert-info" role="alert">
    <span class="material-icons md-16">info </span><b>Note:</b>
    The type [`Cohort`](https://datacommons.org/browser/Cohort) is a legacy type not used by the Sheets method `DCCOHORTMEMBERS()`.
</div>

#### Variable (Statistical Variable)
{: #variable}

Statistics that describe the entities in the Data Common knowledge graph. These are typically quantities and measurements, like [population](https://datacommons.org/tools/statvar#Count_Person) and [air quality index](https://datacommons.org/tools/statvar#AirQualityIndex_AirPollutant)).

#### Observation (Statistical Variable Observation)
{: #observation}

Measurement of a variable, at a specific time for a specific entity.

#### Date 
{: #date}

The date of measurement. Specified in ISO 8601 format. Examples include `2011` (the year 2011), `2019-06` (the month of June in the year 2019), and `2019-06-05T17:21:00-06:00` (5:17PM on June 5, 2019, in CST).

#### Measurement Method 
{: #measurement-method}

The technique used for measuring a statistical variable. Describes how a measurement is made, whether by count or estimate or some other approach. May name the group making the measurement to indicate a certain organizational method of measurement is used. Examples include [the American Community Survey](https://datacommons.org/browser/dc/gg17432) and [`WorldHealthOrganizationEstimates`](https://datacommons.org/browser/WorldHealthOrganizationEstimates). Multiple measurement methods may be specified for any given node.

#### Observation Period 
{: #observation-period}

The time period over which an observation is made. Specified in [ISO 8601 formatting for durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).

#### Scaling Factor 
{: #scaling-factor}

Property of statistical variables that measure proportions, used in conjunction with the measurementDenominator property to indicate the multiplication factor applied to the proportion's denominator (with the measurement value as the final result of the multiplication) when the numerator and denominator are not equal.

As an example, in 1999, [approximately 36% of Canadians were Internet users](https://datacommons.org/browser/dc/o/0d9e3dd3y6yt3). Here the measured value of `Count_Person_IsInternetUser_PerCapita` is 36, and the scaling factor or denominator for this per capita measurement is 100. Without the scaling factor, we would interpret the value to be 36/1, or 3600%.

A complete list of properties can be found in the [graph browser](https://datacommons.org/browser/scalingFactor).

#### Measurement Denominator
{: #measurement-denominator}

The denominator of a fractional measurement.

#### Unit
{: #unit}

The unit of measurement. Examples include [kilowatt hours](https://datacommons.org/browser/KilowattHour), [inches](https://datacommons.org/browser/Inch), and [Indian Rupees](https://datacommons.org/browser/IndianRupee). A complete list of properties can be found in the [graph browser](https://datacommons.org/browser/unit).

#### Facet
{: #facet}

Metadata on properties of the data and its provenance. For example, multiple sources might provide data on the same variable, but use different measurement methods, cover data spanning different time spans, or used different underlying predictive models. Data Commons uses "facet" to refer to a data's source and its associated metadata.


#### Preferred Facet
{: #preferred-facet}

When a variable has values from multiple facets, one facet is designated the preferred facet. The preferred facet is selected by an internal ranking system which prioritizes the completeness and quality of the data. Unless otherwise specified, endpoints will default to returning values from preferred facets.

