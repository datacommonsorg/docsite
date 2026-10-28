---
layout: default
title: Import your data
nav_exclude: true
noindex: true
include_scripts: 
  - /assets/js/user-supplied-variables.js
  - /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Import your data


## (Optional) Step 0: Set variable values for this page

If you'd like to copy and paste commands directly from this page to a command line interface, provide the value of the following variable; this will automatically populate all occurrences on this page.

<label for="storageBucket">Google Cloud Storage bucket name:</label>
<input type="text" id="storageBucket" data-bind="storage_bucket" placeholder="Your GCS bucket" />

## Step 1: Upload your data files {#upload}

In this step, you upload your CSV, MCF and `config.json` files to a new or existing Google Cloud Storage bucket.

> **Note:** The artifacts bucket inherits bucket access settings defined for the project. To upload data files or inspect artifacts, individual users or operators must be granted either the Storage Object User (`roles/storage.objectUser`) or Storage Object Admin (`roles/storage.objectAdmin`) role directly on the bucket (or project).
> If you need to grant this permission to a user, run the following command:
> <pre>gcloud storage buckets add-iam-policy-binding gs://<span data-var="storage_bucket">Your GCS bucket</span> \
>   --member="user:<var>USER_EMAIL</var>" \
>   --role="roles/storage.objectUser" </pre>

If you created a new bucket:

* The name is set by the Terraform `storage_artifacts_bucket_name` variable. If you didn't set this explicitly, the default is <code><span data-var="instance">Your Data Commons instance name</span>-dc-artifacts-<span data-var="project">Your GCP project ID</span></code>.
* The <code><var>INGESTION_BASE</var></code> is set by the Terraform `ingestion_input_path` variable. If you didn't set this explicitly, the default is `ingestion/input`.

To look up your bucket name and ingestion base folder name, from your Terraform directory, run:

```shell
terraform output storage_artifacts_bucket_name
terraform output ingestion_input_path
```

Here we give gcloud commands for uploading files from a local directory or transferring files from another Cloud Storage bucket and/or directory. To transfer files from other source types, you can use the Cloud Console to do so; go to <code>https://console.cloud.google.com/storage/browser/<span data-var="storage_bucket">Your GCS bucket</span></code>and select **Transfer** > **Transfer in**.

> **Note:** As part of the import process, you must add a subdirectory under the ingestion base path. You can create it in the same command as uploading your files below. Alternatively, you can create it as a first step by running the following command:

  <pre>
  gcloud storage folders create gs://<span data-var="storage_bucket">Your GCS bucket</span>/<var>INGESTION_BASE</var>/<var>IMPORT_FOLDER</var></pre>

To upload files from a local directory:

1. Go to the top-level local directory where your data files are located.
2. Run the following command:

    <pre>
    gcloud storage cp -R * gs://<span data-var="storage_bucket">Your GCS bucket</span>/<var>INGESTION_BASE</var>/<var>IMPORT_FOLDER</var>/</pre>

To copy files from another Cloud Storage bucket and/or folder:

From any directory, run the following command:

<pre>
gcloud storage cp -r gs://<var>SOURCE_GCS_BUCKET</var>/<var>FOLDER</var>/* gs://<span data-var="storage_bucket">Your GCS bucket</span>/<var>INGESTION_BASE</var>/<var>IMPORT_FOLDER</var>/
</pre>

To verify that your files are uploaded correctly, go to <code>https://console.cloud.google.com/storage/browser/<span data-var="storage_bucket">Your GCS bucket</span></code>.

## Step 2: Run the ingestion workflow {#workflow}

This step runs the pipeline to convert your data files into Spanner table data. You run this procedure every time you make updates to your data.

From any directory, run:

```shell
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

> **Important!:** Do not manually cancel a workflow anytime after the **run_preprocessing** stage, or your database will be corrupted. If you do need to cancel a workflow at this stage, you won't be able to restart it without clearing the database lock. See [Release database lock from ingestion workflow](emergency.md#release) for the procedure.

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

1. Go to <code>https://console.cloud.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/databases/<var>DATABASE</var>/details/table</code>.
2. From the list of tables, click the **Timeseries** table link.
3. From the left pane menu, click **Data** to view data.

To issue SQL or GQL queries, go back to the table details page and click **Spanner Studio**. Select a table and click the **+** button in the right-hand pane to enter queries. Use the following tables:

* To verify the creation of new nodes, such as statistical variables, provenances or new classes/entities, use the **Node** table.
* To verify the creation of new properties and view triples, use the **Edge** table.
* To verify observations data, use the **TimeSeries** and **Observation** table. 

## Update imported data or add new imports

To update data you've already imported:

1. If necessary, make changes to your schema MCF file(s). If you make changes to MCF files contained in an import that are referenced by other imports, see the note below.
2. If necessary, make changes to your [`config.json` file(s)](data_prep.md#config) (e.g. to add new CSV files, new directories, etc.).
3. [Upload the new/updated files to Cloud Storage](data_import.md#upload).
4. [Run the ingestion workflow](#workflow) as usual. 

> **Note:** If your import depends on "shared" MCF files in a different import, you do not need to reingest the shared files unless they have changed. Conversely, if you do make changes to the shared files, you will also need to reingest all imports that depend on them. Be sure to run the ingestion command(s) correctly; see [Imports with dependencies](#dependencies) for details.

## Delete data

When you remove data from an import, edges, observations and timeseries are removed from Spanner and are no longer available to the web services.

Deleting row-level data is straightforward: you simply remove the necessary rows from the input CSVs and rerun the ingestion workflow. You aren't changing any nodes in the graph, so you don't need to do anything else.

For removing a subset of file data or all data from an import, you also need to remove the relevant nodes and edges from the graph. (You shouldn't keep dangling nodes/edges in the graph.) To do so, follow this general procedure: 

The general procedure for deleting data at the file level is as follows:

1. For the relevant import, delete all nodes (statistical variables, entities, properties, statistical variable groups) from the schema MCF file(s) that pertain to the CSV observation file(s) you want to remove — _except_ the provenance definition. See below for examples.
2. In the `config.json `file, remove the entries for the CSV files to remove. You may need to revise patterns to no longer match those files. See below for examples. 
3. [Upload the new/updated files to Cloud Storage](#upload).
4. [Run the ingestion workflow](#workflow) as usual.

### Examples

{:.no_toc}
#### Example 1: Delete all data from an import with a single MCF file

For [example 1](data_prep.md#ex1), you would do the following:

* Delete all definitions from the `schema.mcf` file except the provenance. 
* Remove the CSV input files from the `config.json` file. 

The `config.json` would look like this:

```json
{
  "inputFiles": [
    {
      "pattern": "schema.mcf",
      "provenance": "who:UN_WHO"
    }
  ]
} 
```

{:.no_toc}
#### Example 2: Delete all data from an import with 2 data-specific MCFs

For [example 3](data_prep.md#ex3) above, you would do the following:

* Delete all the definitions from the MCF files in the subdirectories (`provenance1/schema1.mcf` and `provenance2/schema2.mcf`), except the provenances. 
* Revise the input file patterns in `config.json` to only reference the MCF files.

The `config.json` would look like this:

```json
{
  "includeInputSubdirs": true,
  "inputFiles": [
    {
      "pattern": "provenance1/schema1.mcf",
      "provenance": "oecd:OECDWages"
     },
    {
      "pattern": "provenance2/schema2.mcf",
      "provenance": "oecd:OECDGenderWageGap"
    }
  ]
}
```

{:.no_toc}
#### Example 3: Delete one CSV file from an import with 1 shared MCF 

For [example 1](data_prep.md#ex1), let's assume you want to remove `smokers_single_entity.csv`.

You would do the following:

* Delete any nodes (statistical variables, entities, properties, provenances) in `schema.mcf` that are solely associated with `smokers_single_entity.csv`. 
* Remove the `smokers_single_entity.csv` entry from the `config.json` file. 

The `config.json` file would look like this:

```json
{
  "inputFiles": [
    {
      "pattern": "schema.mcf",
      "provenance": "who:UN_WHO"
     },
    {
      "pattern": "smokers_multi_entity.csv",
      "provenance": "who:UN_WHO",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:country": "country",
        "dcid:gender": "gender",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    }
  ]
}
```

{:.no_toc}
#### Example 4: Delete 1 CSV file in an import with 1 shared MCF and 2 data-specific MCFs

For [example 2](data_prep.md#ex2), let's assume you want to remove the file `single_entity_files/smokers_single_entity.csv`. To do so, you would:

* Remove the file `single_entity_files/single_entity_schema.mcf`.
* Remove the entry for `single_entity_files/smokers_single_entity.csv` in the `config.json` file.

The config.json would look like this:

```json
{
  "includeInputSubdirs": true,
  "inputFiles": [
    {
      "pattern": "shared.mcf",
      "provenance": "who:UN_WHO"
    },
    {
      "pattern": "multi_entity_files/*",
      "provenance": "who:UN_WHO",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:country": "country",
        "dcid:gender": "gender",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    }
  ]
}
```
