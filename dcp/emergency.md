---
layout: default
title: Emergency procedures
nav_exclude: true
noindex: true
include_scripts: /assets/js/user-supplied-variables.js
---

* TOC
{:toc}

{:.no_toc}
# Emergency procedures

## (Optional) Set variable values for this page

If you'd like to copy and paste commands directly from this page to a command line interface, provide the values of the following variables; this will automatically populate all occurrences on this page.

<label for="instance">Data Commons Platform instance:</label>
<input type="text" id="instance" class="dyn-input" data-var="instance" placeholder="Your DCP instance" />
<br/>
<label for="project">Google Cloud Platform project ID:</label>
<input type="text" id="project" class="dyn-input" data-var="project" placeholder="Your GCP project ID" />
<br/>

## Restore database from backup {#restore}

Many conditions can cause your database to get into a corrupted state. These include:

* Malformed input. 
* Partial ingestion workflow completions. Data corruption can occur in the case that the
    * The Postprocessing component of the ingestion workflow has started deletion stages but did not complete write stages. To check for this condition:
        1. Go to [https://console.cloud.google.com/workflows/workflow/](https://console.cloud.google.com/workflows/workflow/){: target="_blank"} for your project and select your workflow from the list. It is named <code><span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-dc-ingestion-workflow</code>. 
        2. If a recent workflow execution is listed as **failed**, click on the link to view details.
        3. In the **Visualization** panel, check the status of the **Run Postprocessing** stage.
    * The Run Postprocessing stage of the workflow did not complete. To check for this condition:
        4. Go to [https://console.cloud.google.com/dataflow/jobs/](https://console.cloud.google.com/dataflow/jobs/){: target="_blank"} for your project and select your job from the list. It is named <code><span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-<var>IMPORT_NAME</var>-<var>NNNNNNNNNN</var></code>. 
        5. Click the **Job Graph** link to view the status of the job stages. Look for the **Delete Edges** and **Delete Observations** stages.
        6. If either started, check the status of the **Write Edges** and `Write Observations` stages.

However, Data Commons will not start serving such corrupted data for the duration of the Spanner retention period since the last import. By default, this is set to 24 hours. (You can adjust it with the Terraform `spanner_version_retention_period variable`.) If you are able to rerun the data ingestion workflow within that period, there will not be any issue: Data Commons will pick up the new data as soon as it's imported.

However, if you are *not* able to successfully reimport data before the retention period expires, you will incur data loss and/or corruption. To mitigate data loss and/or corruption if it has occurred, you can restore from a backup with the last known good data: by default, Spanner does daily full backups. Note that if when you restore from backup, this will delete the current, corrupted version. If you want to keep it in 

To restore from a backup:

1. Go to <code>https://console.cloud.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/details/backups/list</code> to view saved backups.
2. Follow any of the procedures in [Restore from a backup](https://docs.cloud.google.com/spanner/docs/backup/restore-backups#restore-database-backup){: target="_blank"}. This will delete the corrupted version of the database. 

3. Optionally, if you want to keep the cIf you want to keep it in GCP (but not in Terraform), you can run:


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
5. From a command line, run the following (substitute the Spanner instance and database names if you are not using the defaults):

    <pre>
    gcloud spanner databases execute-sql <span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-dc-db
--instance=<span class="dyn-var" data-var="instance">Your Data Commons instance name</span>-dc-instance --project=<span class="dyn-var" data-var="project">Your GCP project ID</span>
--sql="UPDATE IngestionLock SET LockOwner = NULL, AcquiredTimestamp = NULL WHERE LockID = 'global_ingestion_lock' AND LockOwner = '<var>LOCK_OWNER</var>'"
    </pre>
    The *LOCK_OWNER* is the ID you obtained in step 4.

You should see a confirmation message. 

Restart the workflow as usual.
