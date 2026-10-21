---
layout: default
title: Update your instance
nav_exclude: true
noindex: true
include_scripts: 
  - /assets/js/user-supplied-variables.js
  - /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Update your instance

> **Tip:**: To more easily copy and paste commands from from this page, go to [Auto-populate variables](variables.md) to supply the values you've provided for Terraform. This page will automatically populate all occurrences.

## Update imported data or add new imports

To update data you've already imported:

1. If necessary, make changes to your schema MCF file(s). If you make changes to MCF files contained in an import that are referenced by other imports, see the note below.
2. If necessary, make changes to your [`config.json` file(s)](data_prep.md#config) (e.g. to add new CSV files, new directories, etc.).
3. [Upload the new/updated files to Cloud Storage](data_import.md#upload).
4. [Run the ingestion workflow](data_import.md#workflow) as usual. 

> **Note:** If your import depends on "shared" MCF files in a different import, you do not need to reingest the shared files unless they have changed. Conversely, if you do make changes to the shared files, you will also need to reingest all imports that depend on them. Be sure to run the ingestion command(s) correctly; see [Imports with dependencies](data_import.md#dependencies) for details.

## Delete data

When you remove data from an import, edges, observations and timeseries are removed from Spanner and are no longer available to the web services.

Deleting row-level data is straightforward: you simply remove the necessary rows from the input CSVs and rerun the ingestion workflow. You aren't changing any nodes in the graph, so you don't need to do anything else.

For removing a subset of file data or all data from an import, you also need to remove the relevant nodes and edges from the graph. (You shouldn't keep dangling nodes/edges in the graph.) To do so, follow this general procedure: 

The general procedure for deleting data at the file level is as follows:

1. For the relevant import, delete all nodes (statistical variables, entities, properties, statistical variable groups) from the schema MCF file(s) that pertain to the CSV observation file(s) you want to remove — _except_ the provenance definition. See below for examples.
2. In the `config.json `file, remove the entries for the CSV files to remove. You may need to revise patterns to no longer match those files. See below for examples. 
3. [Upload the new/updated files to Cloud Storage](data_import.md#upload).
4. [Run the ingestion workflow](data_import.md#workflow) as usual.

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

## Update deployment infrastructure

Whenever you need to make changes to your deployment, including pointing to a new data input folder, changing the tag or name of the web service image, changing environment variables on the web service, you should always do so using Terraform. 

We recommend that you do not use Cloud Console or gcloud to edit your configuration. If you try to run Terraform again, it will override any changes you have made outside of Terraform. Make all changes inside Terraform to ensure your deployment state is synchronized at all times.

**Important:** Please be sure to read the section below regarding [special resource creation variables](#handle) before proceeding.

To make deployment changes:

1. Edit or add updated variables in your `terraform.tfvars` file.
2. Regenerate GCP credentials if needed.
3. Run `terraform plan` to validate the changes.
4. Run `terraform apply`.
5. If you have made data changes, rerun the data ingestion workflow, which automatically restarts the web service as well:

  ```shell
  uvx datacommons-cli ingest start
  ```

If you have only made changes affecting the web service (such as updating the image container tag) and want to skip running the full ingestion workflow, simply rerun `terraform apply`.

To deploy several Data Commons Platform instances, in multiple environments (e.g. dev, staging, pre-prod etc.), you should use Terraform Workspaces. See [Manage multiple Terraform deployments](https://docs.datacommons.org/custom_dc/deploy_cloud.html#multiple) for details. (Substitute the Terraform modules directory with your Terraform directory.)

### Handle resource creation variables {#handle}

Terraform maintains state across the lifecycle of a deployment. For stateful and shared resources, you need to take care in making changes, because Terraform's update behavior may be unintuitive. In particular:

* `spanner_create_instance`,` storage_create_artifacts_bucket`, `spanner_create_database`. Once you have set any of these to `true` and created the resource, *do not change* them to `false` in subsequent updates to the same deployment. Terraform does not create additional instances each time you run `terraform apply`; it checks its state, sees that the resource already exists, and does not recreate it. 

    On the other hand, if you set any of these to `false` after creation, Terraform will actually destroy the resources without replacing them!  

    If you want to actually *recreate* any of these resources from scratch, do the following:

    1. Run<code> terraform destroy -target <var>RESOURCE_NAME</var></code>.
    2. Make any other changes to Terraform variables.
    3. Rerun `terraform apply`.

* `spanner_create_bigquery_reservation`. This variable is similar to the above, but has additional complications because there can only be a single capacity reservation shared* across an entire project* in the same region. If you try to create additional reservations in the same project, the ingestion workflows will fail. However, like the variables above, if you set it to `false` on the next update, the resource will be destroyed for all deployments.

    The safest way to ensure that all updates and future deployments do not set the variable incorrectly is to remove the resource from Terraform state tracking after it's created. After the first time you have created the reservation, do the following: 

1. From your Terraform directory, run:
    ```shell
    terraform state rm module.stack.module.spanner[0].google_bigquery_reservation.default[0]
    terraform state rm module.stack.module.spanner[0].google_bigquery_reservation_assignment.project_assignment[0]
    ```
3. Set `spanner_create_bigquery_reservation = false` before running `terraform apply` again.
4. In any new deployments in the same project and region, set the variable to `false` from the very start.

## Upgrade your instance to a new version

Data Commons Platform is under ongoing development, with new versions being released frequently, as well as database schema changes that require migration. All container images and the Dataflow template are versioned with the same numbering system, represented as a tag at the end of the image name; for example, <code><var>IMAGE_NAME</var>:1.1.4</code>.

To migrate your system to the latest version of the platform, follow this procedure:

1. Go to your project's root directory:
   <pre>cd <span class="dyn-var" data-var="instance">Your Data Commons instance name</span>
   </pre>
1. Back up your Terraform variables file:
   ```shell
   cp terraform.tfvars terraform.tfvars.backup
   ```
1. Re-generate the Terraform files for the target version:
    <pre>
    uvx datacommons-cli@<var>VERSION_NUMBER</var> admin init \
    --project-id "<span class="dyn-var" data-var="project_id">Your GCP project ID</span>" \
    --instance-name "<span class="dyn-var" data-var="instance">Your Data Commons instance name</span>" \
    --force </pre>
1. Restore your variables file from backup:
   ```shell
   cp terraform.tfvars.backup terraform.tfvars
   ```
1. Optionally, verify that all version tags are updated to the correct number:
    ```shell
    cat variables.tf
    cat terraform.tfvars 
    ```
1. Migrate the database by running:
   <pre>
   uvx datacommons-cli@<var>VERSION_NUMBER</var> admin migrate-db</pre>
1. Redeploy all infrastructure by running:
   <pre>
   terraform init -upgrade
   terraform apply
   </pre>
