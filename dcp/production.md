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

## (Optional) Boost ingestion resources {#ingestion-scaling}

If you are ingesting large volumes of data and your workflow takes longer to run than you would like, you may want to boost the resources assigned to several components in the workflow. In particular, the ingestion workflow is constrained by the following components:

* The Cloud Batch preprocessing job. This job parses input files and writes out temporary files to GCS. It accounts for a very small proportion of processing time. 
* The Cloud Dataflow job. This job writes nodes, edges, observations and embeddings to Spanner. It takes the bulk of the processing time.  
* The Spanner instance, which processes the incoming mutations. Spanner writes are constrained by CPU resources. 

### View resource usage data

To diagnose whether adding more resources would improve workflow latency, you can look at the following:

* For the preprocessing job, you can view timing information, to see whether it accounts for an unacceptable amount of latency. Go to <https://console.cloud.google.com/batch/jobs>{: target="_blank"} for your project, and look at the **Runtime** column for the preprocessing job. (Its default name <code><span data-var="instance"><var>Your DCP instance</var></span>-prep-<var>TIMESTAMP</var></code>.) To understand resource usage, see [Monitor and optimize job resources by viewing metrics](https://docs.cloud.google.com/batch/docs/monitor-job-resources-using-metrics){: target="_blank"} for how to set up Ops Agent and/or view dashboards.

* Cloud Dataflow provides detailed resource usage information and even recommendations for optimizing performance, including cost tradeoffs of adding resources. To view timing information for your Dataflow job, go to <https://console.cloud.google.com/dataflow/jobs>{: target="_blank"} for your project, click on your Dataflow job (its default name is <code><span data-var="instance"><var>Your DCP instance</var></span>-<var>IMPORT_NAME</var>-<var>TIMESTAMP</var></code>), and in the **Job info** panel, look for **Elapsed time**. To get more detailed information, click the **Job metrics** tab, and look at the graphs for **Autoscaling**, **CPU utilization** and **Memory utilization**. Also click the **Recommendations** tab to view any insights that might be relevant.

* Spanner provides exhaustive system performance graphs. To view CPU utilization for read-write/commit operations, go to <code>https://console.cloud.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/details/system-insights</code>. (The default name of the Spanner instance is <code><span data-var="instance"><var>Your DCP instance</var></span>-dc-instance</code>.) Look at the **CPU utilization by operation type** graph and select **beginorcommit** and **executesql_select_readwrite**.

### Set Terraform variables

If you believe increasing resources on these components, here are possible options. Please see the following section for cost considerations. 

| Variable | Default setting | Possible production setting | Notes |
|----------|-----------------|--------------------------------|-------|
| ingestion_preprocessing_job_cpu  |  "8000" |  "16000" | Values are expressed in milliCPUs. 8 CPUs = 8000; 16 CPUs = 16000 |
| ingestion_preprocessing_job_memory | "32768" | "65536" | Values are expressed in MiB. 32 GiB = 32768 MiB; 64 GiB = 65536 MiB |
| ingestion_dataflow_num_workers  | 4 | 10 | For Dataflow auto-scaling, this is the number of workers to start with. Upping to 10 enables a fast initial start without a cold delay. |
| ingestion_dataflow_max_workers  |  20 | 50  | This is the maximum number of workers to which Dataflow should autoscale. 50 is recommended for large datasets. |
| ingestion_dataflow_worker_machine_type | "n2-standard-4" | "n2-standard-8" | Dataflow runs on Google Cloud Compute Engine [machines](https://docs.cloud.google.com/compute/docs/general-purpose-machines#n2_machine_types){: target="_blank"}. n2-standard-4 = 4 vCPUs, 16 GB RAM per worker; n2-standard-8 =  8 vCPUs, 32 GB RAM per worker |
| spanner_processing_units | 1000 | 2000 | 2000 PUs = 2 Spanner nodes. You may need to scale even higher for heavy bulk imports.  |

### Costs

These components incur charges only while an ingestion workflow is actively running:

* Cloud Batch preprocessing job: These resources are billed for Compute Engine VM per-second compute usage, only for the minutes/hours the batch container runs. There are no ongoing idle charges. See [Batch pricing](https://cloud.google.com/batch/pricing){: target="_blank"} for more details.

* Cloud Dataflow ingestion workers: These resources are billed for Google Compute Engine VM per-second usage and Dataflow Service Units (DFUs) for the duration of the ingestion pipeline. See [Dataflow compute resources](https://cloud.google.com/dataflow/pricing?hl=en#dataflow-compute-resources){: target="_blank"} for more details.

* Spanner capacity, on the other hand, is the highest continuous cost driver. Spanner bills per node-hour; scaling from development (100 PUs/.1 node) to production (2000 PUs/2 nodes) substantially increases fixed Spanner costs. See [Spanner compute capacity](https://cloud.google.com/spanner/pricing#compute-capacity){: target="_blank"} for details on hourly rates by region and edition. Data Commons provisions the Enterprise edition. 