---
layout: default
title: Productionize your instance
nav_exclude: true
noindex: true
include_scripts: 
  - /assets/js/user-supplied-variables.js
  - /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Productionize your instance

Many of the default settings in the Terraform configuration are intended for development environments. Before you launch your application, there are a number of required and optional infrastructure features you will want to set up to ensure the robustness, performance, and security of your application. 

> **Note:** You should set up a dedicated production Terraform configuration separate from development. You can use Terraform Workspaces to easily manage multiple configurations, as described in [Manage multiple deployments](https://docs.datacommons.org/custom_dc/deploy_cloud.html#multiple).

## Improve ingestion processing times

The time it takes to run the ingestion workflow end to end is directly proportional to the amount of data to be processed. It is also inversely proportional to the resources configured for the following components:

* The preprocessing Cloud Batch job
* The Cloud Dataflow job
* Spanner 



If your workflow takes longer to run that you would like, you can boost the number of resources configured for the 

Preprocessing Cloud Batch job: Data preprocessor. Parses CSV and MCF files into JSON-LD chunks. The job validates CSV headers against config.json, outputs partitioned JSON-LD shards

Ingestion helper: executes a read-write transaction on the Spanner IngestionLock table (LockID = 'global_ingestion_lock'). It acquires the lock if unowned or if the existing lock timestamp exceeds the stale timeout threshold (configured via timeout parameter). 
Ingestion Helper Cloud Run Service:  managing database concurrency locks, ingestion status updates, . Provides REST endpoints for Spanner table locks, metadata history,.

Dataflow job: Apache Beam Java Dataflow pipeline that validates graph entities, computes FarmHash facet IDs, and commits mutations to Cloud Spanner.  Ingests graph nodes and observations into Cloud Spanner. Dataflow deletes outdated records for replaced imports, computes 64-bit FarmHash facet identifiers, generates search columns, and streams batched mutations into Spanner tables (Node, Edge, Observation, TimeSeries).

Postprocessing Cloud Run job: executing BigQuery federated SQL queries to aggregate statistical hierarchies and edge relationships.  Uses BigQuery federated queries over Spanner to generate STAT_VAR_GROUPS, LINKED_EDGES, and ProvenanceSummary. executing BigQuery federated queries over Spanner to generate statistical variable hierarchies (STAT_VAR_GROUPS written to Node and Edge), graph relationships (LINKED_EDGES written to Edge), and dataset summaries (ProvenanceSummary written to KeyValueStore). Releases the distributed lock by calling POST /database/lock/release on dc-ingestion-helper.


