---
layout: default
title: v1 REST API 
nav_order: 1
parent: API
has_children: true
published: false
---

# Data Commons REST API

The Data Commons REST API is a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library that enables developers to programmatically access nodes in the Data Commons knowledge graph. This package allows users to explore the structure of the graph, integrate statistics from the graph into data analysis applications and much more. 


## Getting Started

First time using the Data Commons API, or just need a refresher? Take a look at our [Getting Started Guide](getting_started.html).


## Service Endpoints

The base URL for all endpoints below is:


```bash
https://api.datacommons.org/
```



## Methods


### Local Graph Exploration

Methods for exploring the graph around a set of nodes


<table>
  <tr>
   <td><strong>API</strong>
   </td>
   <td><strong>URI</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td>Get a triple
   </td>
   <td>GET v1/triples
   </td>
   <td>Get neighboring nodes and property labels of directed edges of a specific entity
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>GET v1/variables
   </td>
   <td>Get all variables associated with a specific entity
   </td>
  </tr>
</table>



## Querying Values

Methods for retrieving data associated with a set of nodes


<table>
  <tr>
   <td><strong>API</strong>
   </td>
   <td><strong>URI</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td>Get single observation
   </td>
   <td><a href="https://docs.google.com/document/u/0/d/1Fuxdg2YdTHgjWk8QL9vrErU4DqXBpDSxSQ-zctx_hAA/edit?resourcekey=0-h8waRvQMinxiNkzLP7lTgg">GET v1/observations/point</a>
   </td>
   <td>Get a single value from a time-series variable for a specific entity
   </td>
  </tr>
  <tr>
   <td>Get a series of observations
   </td>
   <td><a href="https://docs.google.com/document/u/0/d/1JPztXpu3SDcMzJT3E0BSDXH0yBnMlYOz-yJswa9bTvY/edit">GET v1/observations/series</a>
   </td>
   <td>Get all values from a variable for a specific entity
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
</table>

 

