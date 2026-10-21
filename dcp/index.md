---
layout: default
title: Build your own Data Commons
nav_exclude: true
noindex: true
---

* TOC
{:toc}

{:.no_toc}
# About Data Commons Platform

The following diagram shows the architecture of Data Commons Platform.

![DCP architecture](/assets/images/dcp_prod.png)

Data Commons Platform consists of the following Google Cloud Platform services:

* [Cloud Storage](https://cloud.google.com/storage){: target="_blank"} – file storage system for storing your input data
* [Spanner](https://cloud.google.com/spanner){: target="_blank"} – database system for storing output data used for serving
* [Workflows](https://cloud.google.com/workflows){: target="_blank"} – workflow orchestration system that manages the data ingestion process from Cloud Storage and Cloud Spanner end to end
* [Dataflow](https://cloud.google.com/products/dataflow){: target="_blank"} – data processing pipeline that transforms the input data into output data
* [Cloud Run](https://cloud.google.com/run){: target="_blank"} – application hosting for additional Data Commons transformation logic and web serving components
* [Cloud Batch](https://cloud.google.com/batch){: target="_blank"} -- execution of ingestion preprocessing logic 
* (Optional) [Memorystore for Redis](https://docs.cloud.google.com/memorystore/docs/redis){: target="_blank"} – data caching engine to boost query performance

## What's new in Data Commons Platform

The following section describes how the Platform differs from Custom Data Commons.

### Infrastructure

* All data and embeddings are stored in Cloud Spanner. 
* All data is stored in tables, with a graph view for nodes and edges, that is queryable with GQL.
* Data transformation from input files is performed by Cloud Dataflow and several custom components in a Cloud Batch job and Cloud Run Service, all orchestrated by Cloud Workflow. 
* The Mixer now defaults to "stale reads" (the previous version of data) when it first starts up, so there is no downtime during Mixer restarts. 
* Input data files can be configured as separate imports. 
* Data can be rebuilt on a per-import basis, instead of rebuilding all data. 
* There is no NL Server.
* There is no web server or `website` repo.
* MCP functionality has been moved into the Mixer and the MCP server is removed. 

### Workflow

* A new `datacommons` command-line tool provides a single interface for performing various cloud actions.
* New Terraform scripts and modules are in a separate Github repository (datacommons/infra/dcp), with no need to clone the repo.
* You specify the data files you want to import when you run the ingestion workflow.
* Service restarts are automatically triggered when new data is sent (no need to manually restart the services container for data changes).
* Although you can run a local service container and connect to a remote Spanner database, you cannot (currently) run the data ingestion pipeline locally.

### Schema

* Observations can contain up to 3 entities/places. 
* Data sources and provenances are defined in MCF (not `config.json`).
* `config.json` has several new configuration fields.
* CSV column headings must be mapped to DCIDs (no built-in default names).

### APIs

* Basic [SDMX](https://sdmx.org/) read APIs are available: Availability and Data
* REST and Python V2 APIs support filtering and chaining on any property and arc direction, and resolution on any entity type.

### MCP

* New tools for getting metadata, searching child indicators, getting child observations, and getting multi-entity observations

## What's not changing

* CSV and MCF input file formats are still supported.
* Configuration is still provided in the `config.json` file.
