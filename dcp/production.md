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
<label for="region">GCP region:</label>
<input type="text" id="region" data-bind="region" placeholder="Your GCP region" />
<br/>

## Prevent accidental infrastructure deletion

By default, the Terraform configuration allows you to run `terraform destroy` against stateful or stateless resources, for ease and speed of development. Stateful resources are Cloud Spanner and Cloud Storage; stateless resources are all the rest. 

Once you have finalized your data, to prevent data loss, you should set the relevant variable to disallow an operator to destroy stateful resources. Once you are serving live traffic, to prevent service outages, you should also set the relevant variable accordingly. 

These involve only Terraform configuration, so there is no associated GCP cost to setting these options.

In your `terraform.tfvars` file, set these variables:

```
stateful_deletion_protection = true
stateless_deletion_protection = true
```

## (Optional) Boost ingestion resources {#ingestion-scaling}

If you are ingesting large volumes of data and your workflow takes longer to run than you would like, you may want to boost the resources assigned to several components in the workflow. In particular, the ingestion workflow is constrained by the following components:

* The Cloud Batch preprocessing job. This job parses input files and writes out temporary files to GCS. It accounts for a very small proportion of processing time. 
* The Cloud Dataflow job. This job writes nodes, edges, observations and embeddings to Spanner. It takes the bulk of the processing time.  
* The Spanner instance, which processes the incoming mutations. Spanner writes are constrained by CPU resources. 

### View resource usage data

To diagnose whether adding more resources would improve workflow latency, you can look at the following:

* For the preprocessing job, you can view timing information, to see whether it accounts for an unacceptable amount of latency. Go to <https://console.cloud.google.com/batch/jobs>{: target="_blank"} for your project, and look at the **Runtime** column for the preprocessing job (<code><span data-var="instance"><var>Your DCP instance</var></span>-prep-<var>TIMESTAMP</var></code>). To understand resource usage, see [Monitor and optimize job resources by viewing metrics](https://docs.cloud.google.com/batch/docs/monitor-job-resources-using-metrics){: target="_blank"} for how to set up Ops Agent and/or view dashboards.

* Cloud Dataflow provides detailed resource usage information and even recommendations for optimizing performance, including cost tradeoffs of adding resources. To view timing information for your Dataflow job, go to <https://console.cloud.google.com/dataflow/jobs>{: target="_blank"} for your project, click on your Dataflow job (<code><span data-var="instance"><var>Your DCP instance</var></span>-<var>IMPORT_NAME</var>-<var>TIMESTAMP</var></code>), and in the **Job info** panel, look for **Elapsed time**. To get more detailed information, click the **Job metrics** tab, and look at the graphs for **Autoscaling**, **CPU utilization** and **Memory utilization**. Also click the **Recommendations** tab to view any insights that might be relevant.

* Spanner provides exhaustive system performance graphs. To view CPU utilization for read-write/commit operations, go to <code>https://console.cloud.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/details/system-insights</code>. (The default name of the Spanner instance is <code><span data-var="instance"><var>Your DCP instance</var></span>-dc-instance</code>.) Look at the **CPU utilization by operation type** graph and select **beginorcommit** and **executesql_select_readwrite**.

### Set Terraform variables

If you believe increasing resources on these components will decrease your workflow durations, here are possible options. Please see the following section for cost considerations. 

| Variable | Default setting | Possible production setting | Notes |
|----------|-----------------|--------------------------------|-------|
| ingestion_preprocessing_job_cpu  |  "8000" |  "16000" | Values are expressed in milliCPUs. 8 CPUs = 8000; 16 CPUs = 16000 |
| ingestion_preprocessing_job_memory | "32768" | "65536" | Values are expressed in MiB. 32 GiB = 32768 MiB; 64 GiB = 65536 MiB |
| ingestion_dataflow_num_workers  | 4 | 10 | For Dataflow auto-scaling, this is the number of workers to start with. Upping to 10 enables a fast initial start without a cold delay. |
| ingestion_dataflow_max_workers  |  20 | 50  | This is the maximum number of workers to which Dataflow should autoscale. 50 is recommended for large datasets. |
| ingestion_dataflow_worker_machine_type | "n2-standard-4" | "n2-standard-8" | Dataflow runs on Google Cloud Compute Engine [machines](https://docs.cloud.google.com/compute/docs/general-purpose-machines#n2_machine_types){: target="_blank"}. n2-standard-4 = 4 vCPUs, 16 GB RAM per worker; n2-standard-8 =  8 vCPUs, 32 GB RAM per worker |
| spanner_processing_units | 1000 | 2000 | 2000 PUs = 2 Spanner nodes. You may need to scale even higher for heavy bulk imports. |

### Costs

The following components incur charges only while an ingestion workflow is actively running:
* Cloud Batch preprocessing job: These resources are billed for Compute Engine VM per-second compute usage, only for the minutes/hours the batch container runs. There are no ongoing idle charges. See [Batch pricing](https://cloud.google.com/batch/pricing){: target="_blank"} for more details.
* Cloud Dataflow ingestion workers: These resources are billed for Google Compute Engine VM per-second usage and Dataflow Service Units (DFUs) for the duration of the ingestion pipeline. See [Dataflow compute resources](https://cloud.google.com/dataflow/pricing?hl=en#dataflow-compute-resources){: target="_blank"} for more details.

Spanner capacity, on the other hand, is the highest continuous cost driver. Spanner bills per node-hour; scaling from development (100 PUs/.1 node) to production (2000 PUs/2 nodes) substantially increases fixed Spanner costs. See [Spanner compute capacity](https://cloud.google.com/spanner/pricing#compute-capacity){: target="_blank"} for details on hourly rates by region and edition. Data Commons provisions the Enterprise edition. 

## Manage Spanner data retention {#retention}

Cloud Spanner keeps all mutations (versioned by timestamp) for a configurable retention period. This allows for [point-in-time recovery](https://docs.cloud.google.com/spanner/docs/pitr){: target="_blank"} (PITR) and "stale" reads. PITR provides the ability to automatically roll back data to a previously known good timestamp, in the case of data corruption. Stale reads enable data to be queried even during ingestion of large imports, without the risk of serving from inconsistent or corrupted data while it is being modified. In case of failures mid-ingestion, Data Commons will automatically perform point-in-time recovery, reverting to the last known good timestamp within the retention period for all rows. Once the retention period expires, Spanner wipes previous versions of the data from the database, and the point-in-time recovery facility is lost.

### (Optional) Adjust the data retention period

By default Data Commons sets the retention period to 24 hours. (This is in addition to the default full database backups that are performed daily.) This means that any time you run a workflow, if any type of corruption occurs, Data Commons will automatically restore all data according to the last-known good timestamp -- provided that not more than 24 hours have passed since the last workflow run. 

You can set the retention period to any value between 1 hour and 7 days. If you want to maximize the PITR safety window, set it to 7 days. In your `terraform.tfvars` file, add the following line:
```
spanner_version_retention_period = "7d"
```
However, this does involve additional cost: Spanner storage charges increase proportionally with mutation volume -- see [Performance considerations](https://docs.cloud.google.com/spanner/docs/pitr#performance){: target="_blank"} for more details on the effects of the retention period on resource usage. If you are running very frequent ingestions, say, every hour, and the time a workflow takes to succesfully complete is less than an hour, you probably don't need more than 24 hours worth of data. 

If you are sensitive to cost and more tolerant of risk you you could set the time period to a value greater than the slowest observed workflow execution. 

You can also set up alerts to warn you of imminent retention expiries, so you can take action before the expiry, as described below.

### (Optional) Enable monitoring alerts on ingestion lock holds

Data Commons guarantees data consistency by enforcing strict serialization of writes to Spanner: only a single workflow may write to Spanner at any time. To implement this enforcement, Data Commons uses a global shared lock mechanism. (This is orthogonal to Spanner's own transaction locking mechanism.) 

Only one workflow can hold the lock at a time, or to act as the _owner_ of the lock; a workflow must _release_ the lock before another workflow can obtain it. (Note that the lock acquisition actually happens after preprocessing is complete, not at the very beginning of the workflow. Preprocessing can be run by more than one workflow concurrently.)

If a snapshot expires before or during an ingestion run, and that run crashes, stalls, or hangs while holding the lock, your database will be in an inconsistent state. This can happen in both of the following cases:
* A workflow holds the lock for longer than the retention period because it is taking too long to complete (possibly due to insufficient resources).
* The lock is "abandoned" but not released because a workflow experienced a system failure such as a network outage/timeout or crash of the ingestion components that handle Spanner writes.

Once the snapshot passes the retention window, point-in-time recovery (PITR) is no longer possible, and Data Commons cannot automatically roll back the database to its pre-ingestion state. In addition, after the retention window expires, user queries will be answered with data with the latest timestamp; if this happens when a database is actively being modified, bad data could be returned.

To allow you to take action before your instance starts serving bad data, Data Commons defines [Google Cloud Monitoring](https://cloud.google.com/monitoring){: target="_blank"} [alert policies](https://docs.cloud.google.com/monitoring/alerts?hl=en){: target="_blank"} to send notifications when a data retention period is close to expiring but the lock is still being held. When you enable the alerts Terraform module, the following functionality is activated:
* The Ingestion Helper Cloud Run Service (called <code><span data-var="instance"><var>Your DCP instance</var></span>-dc-ingestion-helper</code>) regularly evaluates the active lock duration and the percentage of elapsed time against the Spanner retention window. It emits structured Cloud Monitoring audit logs and triggers alerts (described below) according to policies set by Terraform variables (described below).
* To check for abandoned locks even when no ingestion workflows are active, Data Commons provisions a Cloud Scheduler job (<code><span data-var="instance"><var>Your DCP instance</var></span>-dc-lock-status-probe</code>) that periodically calls the Ingestion Helper to check the lock status and write the logs. By default, this is every 10 minutes, but you can configure a different ping schedule.

#### Costs 

The cost of enabling alerting is negligible. Cloud Monitoring log-based alert policies are included in standard GCP logging quotas. Cloud Scheduler running every 10 minutes generates approximately 4,320 calls per month, which is well within Google Cloud Scheduler's free tier of 3 free jobs per account.

#### Alerting thresholds

Alerting policies are represented by Terraform variables that set predefined thresholds of elapsed time. When an alert fires, a notification is sent to all notification channels that you configure, until you close it or it is auto-closed by the system. All of the policies are set to true by default, but you can disable one or two to false if you want to receive fewer notifications.

Here is a detailed description of the policies:

| Variable | Severity | Description        | Notification frequency | Automatic closure |
|----------|----------|--------------------|------------------------|-------------------|
| ingestion_enable_lock_retention_alert_50pct | Warning | Triggers when the lock hold duration exceeds 50% of the Spanner retention window; for example, 12 hours into a 24-hour window. This is intended to provide an early warning that a long-running import is consuming half of the rollback window. | Every 60 minutes | The number of minutes/hours/days set for your retention period. For example, if your retention period is 24 hours, notifications are sent until 24 hours after the first one. | 
| ingestion_enable_lock_retention_alert_90pct  | Warning | Triggers when the lock hold duration exceeds 90% of the Spanner retention window; for example, 21.6 hours into a 24-hour window. This is an escalation warning that only 10% of the rollback window remains. | Every 30 minutes | Same as above |
| ingestion_enable_lock_retention_alert_50pct | Critical | Triggers when the lock hold duration reaches or exceeds 100% of the Spanner retention window; for example, 24 hours into a 24-hour window. This informs you that point-in-time recovery is lost. | Every 15 minutes | 2 times the number of minutes/hours/days set for your retention period. For example, if your retention period is 24 hours, notifications are sent until 48 hours after the first one. |

Whether you need all such policies depends on your Spanner retention configuration and the typical reaction time of oncall engineers. For example, if you set the retention period to 1 hour, you will for sure want to set the 50% policy, since that gives you only 30 minutes to handle a potential data loss or corruption event. Conversely, if you set the retention period to 7 days, you may not need 3.5 days of advance warning.

#### Set Terraform variables

> **Prerequisite**: To enable lock retention alerting, you must already have configured one or more Google Cloud Monitoring notification channels for your project, such as email, pager, chat, etc. If you don't yet have any channels, see [Create and manage notification channels](https://docs.cloud.google.com/monitoring/support/notification-options){: target="_blank"} to set one up.

Once you've set up at one or more notification channels, do the following:
1. Obtain the full resource name(s) of one or more notification channels by running:
   <pre>
   gcloud monitoring channels list --project=<span data-var="project"><var>Project ID</var></span></pre>
2. From the `name` field(s) in the response, note the value(s). The name is in the form <code>projects/<span data-var="project"><var>Project ID</var></span>/notificationChannels/XXXXXXXX</code>.
3. Add the following lines to your `terraform.tfvars` file:
   <pre>
   ingestion_enable_lock_retention_alerts = true
   ingestion_lock_alert_notification_channels = [ "<var>NOTIFICATION_CHANNEL_NAMES</var>" ]</pre>
4. Optionally disable any of the above-listed alert policies by setting them to `false`. For example, to disable alerting at 50% of the retention window, add this line:
  ```
  ingestion_enable_lock_retention_alert_50pct = false
  ```
5. Optionally, to adjust the prober ping frequency, set    `ingestion_lock_status_ping_schedule` to the desired schedule, in crontab format. For example, to reduce the ping frequency to once per hour, add this line:
   ```
   ingestion_lock_status_ping_schedule = "*/60 * * * *"
   ```

#### Take remedial action

If you receive an alert, you will need to take some remedial action. The first thing to check is the stage at which a failed workflow got stuck:
1. Go to the Cloud Console page for your workflow: if you're using the default workflow name, this is <code>https://pantheon.corp.google.com/workflows/workflow/<span data-var="region"><var>GCP region</var></span>/<span data-var="instance"><var>Your DCP instance</var></span>-dc-ingestion-workflow/executions?project=<span data-var="project"><var>Project ID</var></span></code>.
2. Click on the latest stalled or failed execution.
3. Click the **Steps** tab. If the **launch_and_poll_dataflow** and **run_postprocessing_job** steps succeeded, the database should be in an OK state: [Release the lock](/dcp/emergency.html#release) and use the `datacommons` CLI to run the workflow again. 

   If the **launch_and_poll_dataflow** or **run_postprocessing_job** step failed, PITR was not possible, and the database is likely in an inconsistent state. You need to perform an emergency procedure to recover:
      1. If the workflow is stuck but has not exited, manually cancel it from the console.
      1. [Release the ingestion lock](/dcp/emergency.html#release).
      1. Perform a full [restore from backup](/dcp/emergency.html#restore).
