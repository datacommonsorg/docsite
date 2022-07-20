---
layout: default
title: Getting Started Guide
nav_order: 1
parent: v1 REST
grand_parent: API
has_children: true
published: false
---


# Getting Started Guide

* TOC
{:toc}

## Key Concepts


### Common Terms


#### DCID

A distinct identifier for a node in the knowledge graph. These can represent variables or entities. For example, Austin, Texas, has a DCID of `geoId/4805000`, while the plant species _Austrobaileya scandens_ has a DCID of `dc/bsmvthtq89217`.


#### Entity

An entity represented by a node in the Data Commons knowledge graph. These can represent a wide range of concepts, including [cities](https://datacommons.org/browser/City), [countries](https://datacommons.org/browser/Country), [elections](https://datacommons.org/browser/election/2016_P_US00),[ schools](https://datacommons.org/browser/nces/062961004587), [plants](https://datacommons.org/browser/dc/bsmvthtq89217), or even the [Earth](https://datacommons.org/browser/Earth) itself.


#### Places

Entities that describe specific geographic locations.


#### Variable

Statistics that describe the entities in the Data Common knowledge graph. These are typically quantities and measurements, like [population](https://datacommons.org/tools/statvar#Count_Person) and [air quality index](https://datacommons.org/tools/statvar#AirQualityIndex_AirPollutant)).


#### Observation

Measurement of a variable, at a specific time for a specific entity.


#### Facet

[TODO: FILL IN]


#### Preferred Facet

When a variable has values from multiple facets, one facet is designated the preferred facet. The preferred facet is selected by an internal ranking system which prioritizes the completeness and quality of the data. Unless otherwise specified, endpoints will default to returning values from preferred facets.


#### Property

Attributes of the entities in the Data Common knowledge graph. Instead of statistical values, properties describe unchanging characteristics of entities, like [scientific name](https://datacommons.org/browser/scientificName).


### More Information

For a list of other common Data Commons terms used throughout these docs, take a look at [the Glossary](https://docs.datacommons.org/glossary.html).

For an overview of the data model used by the Data Commons graph, see [Data Models](https://docs.datacommons.org/data_model.html).


## Using the REST API


### Endpoints

The base URL for all REST endpoints is:

```bash
https://api.datacommons.org
```

#### Simple vs. Bulk Endpoints

Many of our APIs come in both “simple” and “bulk” versions. The simple versions of endpoints have prefix `v1/` and are designed for handling single requests with a simplified return structure. The bulk versions of endpoints have prefix `v1/bulk/` and are meant for querying multiple variables or entities at once, and provide richer details in the response. 


### Assembling a Request


#### Finding DCIDs

Curious what entities and variables are available? Want to find a DCID? Take a look at our explorer tools:



* [Graph Browser](https://datacommons.org/browser/) Click through the graph to see what’s available or understand its structure
* [Place Browser](https://datacommons.org/place) Summaries of data available for entities that are geographic locations
* [Statistical Variable Explorer](https://datacommons.org/tools/statvar) See metadata for variables that are statistical in nature


#### Finding Datetimes for Obserevations

When querying for 


#### Multiple arguments

[TODO: FILL IN]


### Authentication

[Documentation on public API keys, quotas, etc. would go here.]

[If clients can use their own API keys, instructions for how to set that up would go here.]


## Troubleshooting


### Common Error Responses

If your request are missing a required argument, you will receive a 400 status code and an error message like the following:


```
{
  "code": 3,
  "message": "Missing required argument: stat_var",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```


If your request includes a bad argument, you will receive a 404 status code and an error message like the following:


```
{
  "code": 5,
  "message": "No statistical variable found for CountPerson_Male",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```
