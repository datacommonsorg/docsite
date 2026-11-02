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

If you'd like to copy and paste commands directly from this page to a command line interface, provide the values for the following variables; this will automatically populate all occurrences on this page.

<label for="project">Google Cloud Platform project ID:</label>
<input type="text" id="project" data-bind="project" placeholder="Your GCP project ID" />
<br/>
<label for="instance">Data Commons Platform instance:</label>
<input type="text" id="instance" data-bind="instance" placeholder="Your DCP instance" />
<br/>

## Improve ingestion processing times {#ingestion-scaling}

The time it takes to run the ingestion workflow end to end is directly proportional to the amount of data to be processed. It is also inversely proportional to the resources available to the following ingestion components:

* The Cloud Batch preprocessing job, default name <code><span data-var="instance">Your DCP instance</span></code>-prep-<var>TIMESTAMP</var></code>. This job parses input files and writes out temporary files to GCS. It accounts for a very small proportion of processing time. To view timing information for your job, go to https://console.google.com/batch/jobs for your project, and look at the **Runtime** column for the preprocessing job.
* The Cloud Dataflow job, default name <code><span data-var="instance">Your DCP instance</span>-<var>IMPORT_NAME</var>-<var>TIMESTAMP</var></code>. This job writes nodes, edges, observations and embeddings to Spanner. It takes the bulk of the processing time. To view timing information for your job, go to https://console.google.com/dataflow/jobs for your project, click on your Dataflow job, and in the **Job info** panel, look for **Elapsed time**.
* The Spanner instance, which processes the incoming mutations. Spanner writes are constrained by CPU resources. To view CPU utilization for read-write/commit operations, go to https://pantheon.corp.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/details/system-insights. Look at the **CPU utilization by operation type** and select **beginorcommit** and **executesql_select_readwrite**.

If your workflow takes longer to run than you would like, you can boost the number of resources configured for the above components. For production purposes, we recommend that you configure these resource reservations in any case. Please see the following section for cost considerations. 

| Variable | Default setting | Recommended production setting | Notes |
|----------|-----------------|--------------------------------|-------|
| ingestion_preprocessing_job_cpu  |  "8000" |  "16000" | Values are expressed in milliCPUs. 8 CPUs = 8000; 16 CPUs = 16000 |
| ingestion_preprocessing_job_memory | "32768" | "65536" | Values are expressed in MiB. 32 GiB = 32768 MiB; 64 GiB = 65536 MiB |
| ingestion_dataflow_num_workers  | 4 | 10 | For Dataflow auto-scaling, this is the number of workerw to start with. Upping to 10 enables a fast initial start without a cold delay. |
| ingestion_dataflow_max_workers  |  20 | 50  | This is the maximum number of workers to which Dataflow should autoscale. 50 is recommended for large datasets. |
| ingestion_dataflow_worker_machine_type | "n2-standard-4" | "n2-standard-8" | Dataflow runs on Google Cloud Compute Engine [machines](https://docs.cloud.google.com/compute/docs/general-purpose-machines#n2_machine_types){: target="_blank"}. n2-standard-4 = 4 vCPUs, 16 GB RAM per worker; n2-standard-8 =  8 vCPUs, 32 GB RAM per worker |
| spanner_processing_units | 1000 | 2000 | 2000 PUs = 2 Spanner nodes. You may need to scale even higher for heavy bulk imports.  |

To set these variables, in your Terraform `terraform.tfvars` file, add the following lines:
```
ingestion_preprocessing_job_cpu = "16000"
ingestion_preprocessing_job_memory = "65536"
ingestion_dataflow_num_workers = 10
ingestion_dataflow_max_workers = 50
ingestion_dataflow_worker_machine_type = "n2-standard-8"
spanner_processing_units = 2000
```
### Costs

These components incur charges only while an ingestion workflow is actively running:

* **Cloud Batch preprocessing job**: These resources are billed for Compute Engine VM per-second compute usage, only for the minutes/hours the batch container runs. There are no ongoing idle charges. See [Batch pricing](https://cloud.google.com/batch/pricing){: target="_blank"} for more details.
* **Cloud Dataflow ingestion workers**: These resources are billed for Google Compute Engine VM per-second usage and Dataflow Service Units (DFUs) for the duration of the ingestion pipeline. See [Dataflow compute resources](https://cloud.google.com/dataflow/pricing?hl=en#dataflow-compute-resources){: target="_blank"} for more details.
* **Spanner capacity**, on the other hand, is the highest continuous cost driver. Spanner bills per node-hour; scaling from development (100 PUs/.1 node) to production (2000 PUs/2 nodes) substantially increases fixed Spanner costs. See [Spanner compute capacity](https://cloud.google.com/spanner/pricing#compute-capacity){: target="_blank"} for details on hourly rates by region and edition. Data Commons provisions the Enterprise edition. 


