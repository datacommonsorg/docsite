---
layout: default
title: Install Data Commons Platform
nav_exclude: true
noindex: true
include_scripts: 
  - /assets/js/user-supplied-variables.js
  - /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Install Data Commons Platform

Installing Data Commons Platform creates a completely new deployment in Google Cloud Platform. It has no effect on existing Custom Data Commons deployments.

Terraform manages the deployment of all GCP service accounts, resources, and secrets. 

## Prerequisites

* You must have a [GCP](https://cloud.google.com/docs/get-started){: target="_blank"} billing account and project, with the [Service Usage API enabled](https://docs.cloud.google.com/service-usage/docs/set-up-development-environment){: target="_blank"}.
* You must have a Data Commons API key. If you haven't obtained one yet, go to [https://apikeys.datacommons.org](https://apikeys.datacommons.org/){: target="_blank"} and request a key for the `api.datacommons.org` domain.
* Install [gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk){: target="_blank"} on your local machine. 
* Install [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform){: target="_blank"} on your local machine. Terraform is used to automate the setup steps of all the components.
* Install [uv](https://docs.astral.sh/uv/getting-started/installation/){: target="_blank"} on your local machine. uv is used to manage Python packages and is recommended for running the Data Commons CLI.  

### Permission roles

To install Data Commons, you must have the IAM Admin or (legacy) Owner role on your GCP project, or all of the following:

* [Service Usage Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/serviceusage){: target="_blank"}  – to enable Cloud APIs
* [Service Account Admin](https://docs.cloud.google.com/iam/docs/service-accounts-create){: target="_blank"} – to create service accounts
* [Project IAM Admin](https://docs.cloud.google.com/resource-manager/docs/access-control-proj){: target="_blank"} – to create bindings between service accounts and resources
* [API Keys Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/serviceusage#serviceusage.apiKeysAdmin){: target="_blank"} - to create and manage the Maps API key
* [Storage Admin](https://docs.cloud.google.com/storage/docs/access-control/iam-roles){: target="_blank"} – to create Cloud Storage buckets and folders
* [Spanner Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/spanner){: target="_blank"}  – to create Cloud Spanner instances and databases
* [BigQuery Connection Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/bigquery){: target="_blank"} – to create a BigQuery connection to Spanner, for federated queries
* [Workflow Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/workflows){: target="_blank"} – to create Cloud Workflows
* [Run Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/run) – to create[ Cloud Run services and jobs](https://docs.cloud.google.com/iam/docs/roles-permissions/secretmanager){: target="_blank"}
* [Secret Manager Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/secretmanager){: target="_blank"} – to create and manage secrets
* (Optional) [Memory Redis Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/redis){: target="_blank"} – to create a Memorystore for Redis instance + [Serverless VPC Access Admin](https://docs.cloud.google.com/iam/docs/roles-permissions/vpcaccess) – to create a [virtual private connection](https://docs.cloud.google.com/vpc/docs/serverless-vpc-access){: target="_blank"} to send traffic between Cloud Run services and Memorystore

## Step 1: Authenticate to Google Cloud Platform {#step1}

1. Authenticate yourself to GCP: From any directory, run `gcloud auth login` and follow the prompts to continue.
1. Authenticate Terraform and the Data Commons CLI to GCP: From any directory run `gcloud auth application-default login` and follow the prompts to continue.

## Step 2: Create your Terraform environment

You use the `datacommons` CLI to download Terraform scripts and provide required settings. 

This step does the following:

* Creates a subdirectory to store Terraform modules and scripts
* Creates a basic `terraform.tfvars` configuration file in the subdirectory
* By default, stores Terraform state files remotely, in a Google Cloud Storage bucket. You can provide an existing bucket in the same project that you are using for Terraform state files, or create a new one.  You can disable remote state management, in which case state files are saved locally. However, to ensure that state is maintained correctly across multiple administrators, we _strongly_ recommend that you keep the default option.

1. From any project directory where you will store and run Terraform script, run the following command:

    <pre>
    uvx datacommons-cli admin init \ 
    --project-id "<var>YOUR_GOOGLE_CLOUD_PROJECT_ID</var>" \
    --instance-name "<var>INSTANCE_NAME</var>" \
    --dc-api-key "<var>YOUR_DATA_COMMONS_API_KEY</var>" \
    [--no-tf-remote-state] | [--tf-state-bucket "<var>BUCKET_NAME</var>"] \
    [--tf-state-bucket-location "<var>REGION</var>" ]
    </pre>

    * _`INSTANCE_NAME`_ should be a meaningful name that will be used as a prefix for various resource names. If you intend to set up multiple deployments (e.g. "staging", "production", etc.), it's a good idea to include the environment in the name.

        > **WARNING:** You _must_ provide a name that is different from any Terraform namespaces you have used previously, to avoid destroying or corrupting existing components.

    * To reuse an existing bucket, or to create a new bucket with a specified name, provide a bucket name with `–-tf-state-bucket`. If you omit this flag, the tool creates a new bucket using the format <code><var>INSTANCE_NAME</var>-datacommons-data-<var>PROJECT_ID</var></code>.

    * If you are creating a new bucket, by default it is created in the `US` location, which is a [multi-region zone](https://docs.cloud.google.com/storage/docs/locations#location-dr){: target="_blank"}. To specify an alternate location, use `--tf-state-bucket-location`. (See [Bucket locations -- Cloud Storage](https://docs.cloud.google.com/storage/docs/locations){: target="_blank"} for supported locations.)

    A new subdirectory is created named according to your instance name, and a basic `terraform.tfvars` file is created with required variables set. 

2. Check the defaults set in the following files:

    <pre>
    cd <var>INSTANCE_NAME</var>
    cat terraform.tfvars
    cat variables.tf</pre>

If you're happy with the settings as they are, you can skip ahead to step 4. More likely, you will want to change some of the default settings in step 3 before proceeding.


## Step 3: Set/edit optional Terraform variables

The `terraform.tfvars` file you generated in the previous step provides optional but frequently configured variables, with overrides of default values set in `variables.tf`. Commented-out variables are the same as the defaults; to change them, uncomment the line you want and set the variable accordingly.

In addition, all of the deployment options you can configure are listed in `variables.tf`. To customize any of these options, _do not_ edit in place in `variables.tf`. Instead, add the variable(s) you want to override to the `terraform.tfvars` file and set it to the desired value. For example, to enable Redis, you would add this to the file:

```
enable_redis = true
```

Here are some variables you may wish to modify:

| **Option** | **Default** | **Description** |
| :----------|:------------|:----------------|
| `region` | `us-central1`, close to the base Data Commons deployment | The data center locations where your Data Commons resources are provisioned. If you want to set this to a different value, for a list of supported regions, see [Geography and regions](https://docs.cloud.google.com/docs/geography-and-region){: target="_blank"}. |
| `storage_create_artifacts_bucket` | `true` | Create a new Cloud Storage bucket to store your CSV, MCF and `config.json` files.<br/>If you already have a bucket in the same project that you want to reuse, set this to `false` and provide the name of your bucket using `storage_artifacts_bucket_name`.<br/>**Note:** We do not recommend reusing a bucket in which you have previously stored Data Commons data.This risks unintended data corruption or deletion. | 
| `ingestion_input_path` | `ingestion/input` | The Cloud Storage folder where you will store your input files (MCF, CSV, `config.json`). |
| `spanner_create_instance` | `true` | Creates a new Cloud Spanner instance. If you want to reduce costs, and already have a Spanner instance that you want to reuse, set this to `false` and provide the name of the instance using `spanner_instance_id`.<br/>**Note:** If you are creating multiple deployments, e.g. dev and prod, we recommend that you reuse a single instance (but not a database): set this to `false` for all other deployments. |
| `spanner_create_bigquery_reservation` | `true` | Data Commons uses [BigQuery federated queries](https://docs.cloud.google.com/bigquery/docs/federated-queries-intro){: target="_blank"} internally to write data to Spanner. The first time you create a deployment in a given region, set this to `true` to create a BigQuery capacity reservation.<br/>**Important!** The reservation must only be created *once*, for the first deployment instance.There can only be one reservation per project per region. If another is created in the same deployment or other deployments in the same project/region, the ingestion pipeline will fail. On the other hand, if you set the variable to `false` after creation, Terraform will destroy it and break other deployments. The solution is to remove the resource from Terraform tracking in the first deployment; please see [Handle resource creation special variables](#handle) for procedures. |
| `enable_redis` | `false` | Google Cloud [Memorystore for Redis](https://docs.cloud.google.com/memorystore/docs/redis/memorystore-for-redis-overview){: target="_blank"} is a caching service that speeds up website and API performance. We recommend keeping it disabled during development. When you launch to production, depending on your traffic load, you may wish to enable it. | 
| `stateful_deletion_protection`  | `false` | Determines whether you will be allowed to destroy your "stateful" resources which are Spanner, and the artifacts GCS bucket. We recommend setting this to `true` for production. | 
| `stateless_deletion_protection` |  `false` | Determines whether you will be allowed to `destroy` your "stateless" resources which are the resources that can be re-spun up with no data loss (Cloud Run Services and Jobs, Redis, Workflows). We recommend setting this to true for production. | 
| `spanner_version_retention_period` | `24h` | The Spanner database is configured to retain data for this period. Within this time frame, all mutations are kept and there is the ability to do point-in-time-restore.<br/>It also provides the ability to query Spanner at any timestamp within the time frame.This means that data can be queried even during ingestion of large imports, without the risk of serving from a corrupted database while data is being modified.<br/>In case of failures mid-ingestion, you have the time of this retention period to resolve it before your requests start to serve data on  a potentially corrupted database. (See [Restore database from backup](emergency.md#restore) for details.)<br/>You can increase the value up to 7 days, but it does incur additional cost. To learn more, see [Point-in-time recovery (PITR) overview](https://docs.cloud.google.com/spanner/docs/pitr){: target="_blank"}. |

## (Optional) Step 3a: Set variable values for this page

If you'd like to copy and paste commands directly from this page to a command line interface, provide the values for the following variables; this will automatically populate all occurrences on this page.

<label for="project">Google Cloud Platform project ID:</label>
<input type="text" id="project" data-bind="project" placeholder="Your GCP project ID" />
<br/>
<label for="user">Google user account:</label>
<input type="text" id="user" data-bind="user" placeholder="Your Google user account" />
<br/>
<label for="instance">Data Commons Platform instance:</label>
<input type="text" id="instance" data-bind="instance" placeholder="Your DCP instance" />
<br/>

## Step 4: Run the Terraform deployment

This step does the following:

* Creates various [service accounts](https://docs.cloud.google.com/iam/docs/service-account-overview){: target="_blank"} for your project and instance name and assigns them various permissions ([IAM roles](https://docs.cloud.google.com/iam/docs/roles-overview){: target="_blank"}).
* Enables all necessary APIs. (For the full list of APIs enabled, see the `main.tf` file in your Terraform directory.)
* Provisions and deploys all the infrastructure components listed in the [architecture section](index.md#architecture).
* Stores all secrets (API keys and database passwords) in the [Cloud Secret Manager](https://cloud.google.com/secret-manager/docs/overview){: target="_blank"}.
* Creates a URL for accessing your service in the browser.

1. From the directory where your Terraform configuration is stored, run the following command one time:
    ```shell
    terraform init
    ```
1. Run the following command to validate your configuration:
    ```shell
    terraform plan
    ```
1. Review the plan and make any changes if needed.
1. When you are ready to deploy, run the following:
    ```shell
    terraform apply
    ```
1. At the prompt asking you to confirm the actions before creating resources, type `yes` to proceed. The first time, it will take about 15 minutes to complete. 
1. Take note of the names of the various accounts and services created. 

> **Tip:** To retrieve the values of the most commonly used variables (the ones provided in `outputs.tf`), or a specific variable, you can run:
<pre>
terraform output [<var>VARIABLE_NAME</var>]
</pre>
For example, to get the live value of the variable `datacommons_services_name`, you can run:

```shell
terraform output datacommons_service_name
```

To retrieve the full state of all resources and output variables, use the following command:

```shell
terraform show
```

## Step 5: Grant IAM permissions to run database setup and workflows

To initialize Spanner tables, execute schema migrations, and run data ingestion workflows, your user account and project service accounts require appropriate IAM roles.

### 1. Permissions for database initialization and schema migrations

The `init-db` and `migrate-db` CLI commands connect directly to Cloud Spanner from your workstation (using your end user credentials generated by `gcloud auth application-default login`).

To run these commands, your user account must have the following Spanner IAM roles on the project (or directly on the Spanner instance/database):
* [roles/spanner.databaseAdmin](https://docs.cloud.google.com/iam/docs/roles-permissions/spanner#spanner.databaseAdmin){: target="_blank"}: Required to execute DDL statements (creating and altering tables, indexes, and embedding models).
* [roles/spanner.databaseUser](https://docs.cloud.google.com/iam/docs/roles-permissions/spanner#spanner.databaseUser){: target="_blank"}: Required to read and write database rows.

You can grant these roles as follows:

From any directory, run the following commands:

<pre>
gcloud projects add-iam-policy-binding "<span data-var="project">Your GCP project ID</span>" \
--member="user:<span data-var="user">Your user account</span>" \
--role="roles/spanner.databaseAdmin"

gcloud projects add-iam-policy-binding "<span data-var="project">Your GCP project ID</span>" \
--member="user:<span data-var="user">Your user account</span>" \
--role="roles/spanner.databaseUser"
</pre>

### 2. Permissions for workflow execution

Terraform creates a project-wide [service account](https://docs.cloud.google.com/iam/docs/service-account-overview){: target="_blank"} to run the data ingestion workflow:
<code><span data-var="instance">Your Data Commons instance name</span>-dc-ing-wf-sa@<span data-var="project">Your GCP project ID</span>.iam.gserviceaccount.com</code>.

To run the `datacommons admin ingest start` command, you need to impersonate this service account using your own credentials. To do so, create an IAM binding giving your account the Token Creator role:

1. Optionally, from your Terraform directory, run the following to get the name of the service account:
   ```shell
   terraform output ingestion_workflow_service_account_email
   ```
1. Run the following command:
   <pre>
   gcloud iam service-accounts add-iam-policy-binding "<var>SERVICE_ACCOUNT</var>" \
    --member="user:<span data-var="user">Your user account</span>" \
    --role="roles/iam.serviceAccountTokenCreator" \
    --project="<span data-var="project">Your GCP project ID</span>"</pre>

To verify that your account has been added as a principal to the service account, you can look up the details as follows:

1. Go to <code>https://console.cloud.google.com/iam-admin/serviceaccounts?project=<span data-var="project">Your GCP project ID</span></code>.
1. From the list of service accounts, click on the <code><span data-var="instance">Your Data Commons instance name</span>-dc-ing-wf</code> account and select **Principals with access**. You should see your user account in the list.

## Step 6: Create the Spanner schema and tables

From the directory where your Terraform configuration is stored, run the following command:

```shell
uvx datacommons-cli admin init-db
```

This command connects directly to Cloud Spanner using your authenticated credentials to execute the bundled DDL schema and apply pending migrations.

When it completes, verify that the tables are created correctly:

Go to <code>https://console.cloud.google.com/spanner/instances/<var>SPANNER_INSTANCE</var>/databases/<var>DATABASE</var>/details/tables?project=<span data-var="project">Your GCP project ID</span></code>

* Your <code><var>SPANNER_INSTANCE</var></code> is set by the Terraform `spanner_instance_id` variable. If you didn't set this explicitly, the default is <code><span data-var="instance">Your Data Commons instance name</span>-dc-instance</code>. To look it up, from your Terraform directory, you can run:

  ```shell
    terraform output spanner_instance_id
  ```
* The _`DATABASE`_ is set by the Terraform `spanner_database_id` variable. If you didn't set this explicitly, the default is <code><span data-var="instance">Your Data Commons instance name</span>-dc-db.</code> To look it up, from your Terraform directory, you can run:

  ```shell
    terraform output spanner_database_id
  ```
  You should see a list of tables at the bottom of the page.
