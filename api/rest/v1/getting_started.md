---
layout: default
title: Getting Started Guide
nav_order: 2
parent: v1 REST
grand_parent: API
published: true
permalink: /api/rest/v1/getting_started
---

# Getting Started Guide

Welcome! Whether you're new to Data Commons or are just looking for a refresher, this guide gives an overview of what you need to know to get started using our REST API.

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    Take a look at the [Intro to Data Commons]({{ site.baseurl}}/api/intro_to_data_commons) page for an overview of the key terms and concepts you should know.
</div>


Use the links below to jump to any section:

* TOC
{:toc}


## What is a REST API?
Our REST API follows the [RESTful architectural style](https://en.wikipedia.org/wiki/Representational_state_transfer) to allow you to query the Data Commons Knowledge Graph via [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). This allows you to explore the local graph and query data from specific variables and entities programatically.

## How to Use the REST API

Our REST API can be used with any tool or language that supports HTTP. You can make queries on the command line (e.g. using [cURL](https://curl.se/)), by scripting HTTP requests in another language like javascript, or even by entering an endpoint into your web browser!

### Endpoints
We provide an [API endpoint](https://en.wikipedia.org/wiki/Web_API#Endpoints) for many different queries (see the list of available endpoints [here]({{ site.baseurl }}/api/rest/v1)). Each endpoint can be accessed using its unique URL.

The base URL for all REST endpoints is:

```bash
https://api.datacommons.org
```

Each endpoint also has a [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier), like [`/v1/observation/point`]({{ site.baseurl}}/api/rest/v1/observation/point). To access a particular endpoint, append the URI to the base URL (e.g. `https://api.datacommons.org/v1/observation/point`).


#### Simple vs. Bulk Endpoints

Many of our APIs come in both “simple” and “bulk” versions. The simple versions of endpoints have prefix `/v1/` and are designed for handling single requests with a simplified return structure. The bulk versions of endpoints have prefix `/v1/bulk/` and are meant for querying multiple variables or entities at once, and provide richer details in the response. 


### Assembling a Request
Following HTTP, a REST API call consists of a **request** and a **response**. Our endpoints support HTTP's `GET` method for requests. Some bulk endpoints also support the `POST` method for requests. Given a properly formatted request, our servers will provide a response with the data you requested in [JSON](https://json.org) format.

#### Parameters

###### Path Parameters
Path parameters must be passed in a specific order as part of the URL. For example, `/v1/observations/point` requires the DCIDs of the variable and entity to query, in that order. This would look something like:
```bash
https://api.datacommons.org/v1/observations/point/variable_DCID/entity_DCID
```

###### Query Parameters
Query parameters are chained at the end of a URL behind a `?` symbol. Separate multiple parameter entries with an `&` symbol. For example, this would look like:
```bash
https://api.datacommons.org/v1/observations/point/variable_DCID/entity_DCID?date=YYYY&facet=XXXXXXXXXXX
```

###### POST requests
For the bulk endpoints that allow for POST requests, feed all parameters in JSON format as a data flag. For example, in cURL, this would look like:

```bash
POST \
--url https://api.datacommons.org/v1/bulk/observations/point \
--header 'content-type: application/json' \
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

Still confused? Each endpoint's documentation page has examples at the bottom tailored to the endpoint you're trying to use!

#### Finding DCIDs
Most endpoints require the DCID of the entity or variable to you wish to query. Curious what entities and variables are available? Want to find a DCID? Take a look at our explorer tools:

* [Graph Browser](https://datacommons.org/browser/) Click through the graph to see what’s available or understand its structure
* [Place Browser](https://datacommons.org/place) Summaries of data available for entities that are geographic locations
* [Statistical Variable Explorer](https://datacommons.org/tools/statvar) See metadata for variables that are statistical in nature

#### Finding Datetimes for Observations

Many endpoints allow the user to filter their results to specific dates. When querying for data at a specific date, the string passed for the date queried must match the date format used by the target variable. An easy way to see what date format a variable uses is to look up your variable of interest in the  [Statistical Variable Explorer](https://datacommons.org/tools/statvar).

<!-- TODO: Fill in Pagination & Authentication sections
### Pagination
(Description of how pagination for bulk APIs works will go here.)

### Authentication

(Details about getting and setting API keys will go here.)
-->


## Troubleshooting

#### Common Error Responses

If your request are missing a required argument, you will receive a 400 status code and an error message like the following:


```json
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


```json
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
