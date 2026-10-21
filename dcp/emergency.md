---
layout: default
title: Emergency procedures
nav_exclude: true
noindex: true
include_scripts: /assets/js/user-supplied-variables.js
---

[TOC]

{:.no_toc}
# Emergency procedures

> **Tip:**: To more easily copy and paste commands from from this page, go to [Auto-populate variables](variables.md) to supply the values you've provided for Terraform. This page will automatically populate all occurrences.

## Restore database from backup {#restore}

Many conditions can cause your database to get into a corrupted state. These include:

* Malformed input. 
* Partial ingestion workflow completions. Data corruption can occur in these conditions:
    * The Dataflow component of the ingestion workflow has started deletion stages but did not complete write stages. To check for this condition:
        1. Go to [https://console.cloud.google.com/workflows/workflow/](https://console.cloud.google.com/workflows/workflow/){: target="_blank"} for your project and select your workflow from the list. It is named <code><span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-dc-ingestion-workflow</code>. 
        2. If a recent workflow execution is listed as **failed**, click on the link to view details.
        3. In the **Visualization** panel, check the status of the **Run Postprocessing** stage.
    * The Run Postprocessing stage of the workflow did not complete. To check for this condition:
        4. Go to [https://console.cloud.google.com/dataflow/jobs/](https://console.cloud.google.com/dataflow/jobs/){: target="_blank"} for your project and select your job from the list. It is named <code><span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-<var>IMPORT_NAME</var>-<var>NNNNNNNNNN</var></code>. 
        5. Click the **Job Graph** link to view the status of the job stages. Look for the **Delete Edges** and **Delete Observations** stages.
        6. If either started, check the status of the **Write Edges** and `Write Observations` stages.

However, Data Commons will not start serving such corrupted data for the duration of the Spanner retention period since the last import. By default, this is set to 24 hours. (You can adjust it with the Terraform `spanner_version_retention_period variable`.) If you are able to rerun the data ingestion workflow within that period, there will not be any issue: Data Commons will pick up the new data as soon as it's imported.

However, if you are *not* able to successfully reimport data before the retention period expires, you will incur data loss and/or corruption. To mitigate data loss and/or corruption if it has occurred, you can restore from a backup with the last known good data: by default, Spanner does daily full backups. To restore from a backup:

1. Go to <code>https://console.cloud.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/details/backups/list</code> to view saved backups.
2. Follow any of the procedures in [Restore from a backup](https://docs.cloud.google.com/spanner/docs/backup/restore-backups#restore-database-backup){: target="_blank"}.
3. In your Terraform configuration file, update the `spanner-database-id` variable to the new destination database name you have specified, and run `terraform apply`.

If you import data more frequently than once a day, you will need to create manual backups immediately after every successful ingestion. See [Create backups](https://docs.cloud.google.com/spanner/docs/backup/create-backups){: target="_blank"} for details.


## Release database lock from ingestion workflow {#release}

If you cancel the ingestion workflow (accidentally or otherwise) after it has gone into the "acquire lock" or later stage, you won't be able to restart it because the Spanner database is locked. To release the lock, you can use this manual procedure:

1. Go to the Cloud Console Run service page for the ingestion helper service. It is called <code><span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-dc-ingestion-helper</code>.
2. Click on **Observability** > **Logs**.
3. Look for a log entry that looks like the following (you can search for the text "Lock is currently held by" or look for a yellow warning icon):
    ```
    2026-07-23T00:39:09.717946Z INFO:root:Lock is currently held by 7e3f4639-6ad1-434a-9f00-72abbd0f8fd1
    ```
4. Note the ID.
5. From a command line, run the following:

    <pre>
    curl -X POST INGESTION_HELPER_SERVICE_URL/database/lock/release \
    -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
    -H "Content-Type: application/json" \
    -d '{"workflowId": "<var>BLOCKING_ID</var>"}'
    </pre>

You should see a confirmation message. 

Restart the workflow as usual.
