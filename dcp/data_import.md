---
layout: default
title: Import your data
nav_exclude: true
noindex: true
---

# Import your data {#import-your-data}

## Step 1: Upload your data files {#upload}

In this step, you upload your CSV, MCF and `config.json` files to a new or existing Google Cloud Storage bucket.

> **Note:** The artifacts bucket enforces public access prevention and uniform bucket-level access. To upload data files or inspect artifacts, individual users or operators must be granted either the Storage Object User (`roles/storage.objectUser`) or Storage Object Admin (`roles/storage.objectAdmin`) role directly on the bucket (or project).
>
> If you need to grant this permission to a user:
> ```bash
> gcloud storage buckets add-iam-policy-binding gs://<var>GCS_BUCKET</var> \
>   --member="user:<var>USER_EMAIL</var>" \
>   --role="roles/storage.objectUser"
> ```

If you created a new bucket:

* The name is set by the Terraform `storage_artifacts_bucket_name` variable. If you didn't set this explicitly, the default is <code><var>INSTANCE_NAME</var>-dc-artifacts-<var>PROJECT_ID. </var></code>
* The <code><var>INGESTION_BASE</var></code> is set by the Terraform `ingestion_input_path` variable. If you didn't set this explicitly, the default is `ingestion/input`.

To look up your bucket name and ingestion base folder name, from your Terraform directory, run:

```
terraform output storage_artifacts_bucket_name
terraform output ingestion_input_path
```

Here we give gcloud commands for uploading files from a local directory or transferring files from another Cloud Storage bucket and/or directory. To transfer files from other source types, you can use the Cloud Console to do so; go to <code>https://console.cloud.google.com/storage/browser/<var>GCS_BUCKET </var></code>and select **Transfer** > **Transfer in**.

> **Note:** As part of the import process, you must add a subdirectory under the ingestion base path. You can create it in the same command as uploading your files below. Alternatively, you can create it as a first step by running the following command:

  <pre>
  gcloud storage folders create gs://<var>GCS_BUCKET</var>/<var>INGESTION_BASE</var>/<var>IMPORT_FOLDER</var></pre>

To upload files from a local directory:

1. Go to the top-level local directory where your data files are located.
2. Run the following command:

    <pre>
    gcloud storage cp -R * gs://<var>GCS_BUCKET</var>/<var>INGESTION_BASE</var>/<var>IMPORT_FOLDER</var>/</pre>

To copy files from another Cloud Storage bucket and/or folder:

From any directory, run the following command:

<pre>
gcloud storage cp -r gs://<var>SOURCE_GCS_BUCKET</var>/<var>FOLDER</var>/* gs://<var>GCS_BUCKET</var>/<var>INGESTION_BASE</var>/<var>IMPORT_FOLDER</var>/
</pre>

To verify that your files are uploaded correctly, go to <code>https://console.cloud.google.com/storage/browser/<var>GCS_BUCKET.</var></code>

## Step 2: Run the ingestion workflow {#workflow}

This step runs the pipeline to convert your data files into Spanner table data. You run this procedure every time you make updates to your data.

From any directory, run:

```
uvx datacommons-cli admin ingest start --imports ALL_IMPORTS 
```
or
<pre>
uvx datacommons-cli admin ingest start --imports <var>IMPORT_PATH1</var>[,<var>IMPORT_PATH2</var>, ...]
</pre>

The *IMPORT_PATH* is the directory containing a `config.json` file, and is relative to the value of the `ingestion_input_path` Terraform variable. So, for example, if you provide a single config.json file in `ingestion/input/myimport`, you would specify `--imports myimport`. 

* To ingest multiple imports, specify comma-separated values for each `config.json` directory you would like to ingest now; for example `–-imports import1,import2.`
* To ingest all data imports, specify `–-imports ALL_IMPORTS`.

> **Note:** If you have imports with dependencies on each other, follow the procedure in [Imports with dependencies](#dependencies) below.

Depending on the amount of data being processed, it can take anywhere from 10 minutes to over an hour to complete. You can verify the processing by clicking on any of the output links to see the workflow's progress at any time.

To verify that the workflow has completed, click the `Workflow Console Link` in the output and look for the **Executions** > **State** heading. When the workflow is complete, it shows **return result** - **succeeded**. 

> **Note:** If you need to restart the workflow for any reason, never try to execute it from the Cloud Console, but be sure to use the `datacommons-cli` command. The CLI passes in parameters that are needed for the workflow, so if you try to run the workflow without the CLI, the workflow will fail.

> **Important!:** Do not manually cancel a workflow anytime after the **run_preprocessing** stage, or your database will be corrupted. If you do need to cancel a workflow at this stage, you won't be able to restart it without clearing the database lock. See [Release database lock from ingestion workflow](#release) for the procedure.

If you encounter workflow failures, see the [Troubleshoot problems](#troubleshoot-problems) section for tips on debugging configuration or data issues.

### Imports with dependencies {#dependencies}

A common pattern (similar to [example 4](data_prep.md#example4)) is to have an import that defines a "shared" schema that is referenced by other imports, like this:

```
ingestion_base /
  |- shared_schema_import/        
    |- config.json   <--- Schema import
    |- shared_schema.mcf
  |- data_import_1/        
    |- config.json   
    |- data1.csv
    |- import_1_schema.mcf <--- References entities in shared_schema.mcf
  |- data_import_2/        
    |- config.json   
    |- data2.csv
    |- import_2_schema.mcf <--- References entities in shared_schema.mcf
```

However, if you try to ingest multiple imports concurrently, there is no guarantee of the order in which they will be processed. This means that nodes in one import that have associated edges in another import may not be created in the correct order, and this can lead to data corruption.

To ensure that the entities in the shared schema are created _before_ dependent imports are processed, use the following procedure.
1. Run `uvx datacommons-cli admin ingest start --imports shared_schema_import`.
1. Wait until the workflow completes successfully: click the `Workflow Console Link` in the output and look for the **Executions** > **State** heading in the Cloud Console. When the workflow is complete, it shows **return result** - **succeeded**. 
1. [Verify](#verify) that all the required nodes from `shared_schema_import` are present in the database.
1. Run the remaining imports: `uvx datacommons-cli admin ingest start --imports data_import_1,data_import_2`

## Step 3: Verify data {#verify}

To verify that the data has been imported correctly:

1. Go to <code>https://console.cloud.google.com/spanner/instances/<var>INSTANCE</var>/databases/<var>DATABASE</var>/details/table</code>.
2. From the list of tables, click the **Timeseries** table link.
3. From the left pane menu, click **Data** to view data.

To issue SQL or GQL queries, go back to the table details page and click **Spanner Studio**. Select a table and click the **+** button in the right-hand pane to enter queries. Use the following tables:

* To verify the creation of new nodes, such as statistical variables, provenances or new classes/entities, use the **Node** table.
* To verify the creation of new properties and view triples, use the **Edge** table.
* To verify observations data, use the **TimeSeries** and **Observation** table. 
