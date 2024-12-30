---
layout: default
title: Deploy to Google Cloud
nav_order: 7
parent: Build your own Data Commons
---

# Deploy your custom instance to Google Cloud

This page shows you how to create a development environment in Google Cloud Platform, using [Terraform](). This is step 4 of the [recommended workflow](/custom_dc/index.html#workflow).

* TOC
{:toc}

## System overview

Here is the Data Commons setup in Google Cloud Platform (GCP):

![GCP setup](/assets/images/custom_dc/customdc_setup3.png)

You upload your data and configuration files to [Google Cloud Storage](https://cloud.google.com/storage){: target="_blank"}, and run the Data Commons data management Docker container as a [Cloud Run](https://cloud.google.com/run/){: target="_blank"} job. The job will transform and store the data in a [Google Cloud SQL](https://cloud.google.com/sql){: target="_blank"} database, and generate NL embeddings stored in Cloud Storage. The services Docker container runs as a Cloud Run service, using the Docker image stored in a [Google Cloud Artifact Registry](https://cloud.google.com/artifact-registry){: target="_blank"} repository.

* TOC
{:toc}


## Prerequisites

- You must have a [GCP](https://cloud.google.com/docs/get-started){: target="_blank"} billing account and project.
- You must have relevant API keys. If you haven't obtained them yet, see [One-time setup steps](/custom_dc/quickstart.html#setup) in the Quickstart.
- Install [gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk){: target="_blank"} on your local machine. gcloud is required for authentication and management tasks.
- Install [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform){: target="_blank"} on your local machine. Terraform is used to automate the setup steps of all the components.

## One-time step: Create service accounts and enable all APIs

`website/deploy/terraform-custom-datacommons/setup.sh` is a convenience script to set up service account roles and all necessary Cloud APIs. To run it:

<pre>
 cd website | cd <var>DIRECTORY</var>
 cd deploy/terraform-custom-datacommons
 ./setup.sh <var>PROJECT_ID</var>
 </pre>

## Generate credentials for Google Cloud authentication {#gen-creds}

From any directory, run:

```shell
gcloud auth application-default login
```
This opens a browser window that prompts you to enter credentials, sign in to Google Auth Library and allow Google Auth Library to access your account. Accept the prompts. When it has completed, a credential JSON file is created in
`$HOME/.config/gcloud/application_default_credentials.json`. Use this in the command below to authenticate from the docker container.

The first time you run it, may be prompted to specify a quota project for billing that will be used in the credentials file. If so, run this command:

<pre>
gcloud auth application-default set-quota-project <var>PROJECT_ID</var>
</pre>

## Configure and run a Terraform deployment

We recommend using the Data Commons Terraform scripts to greatly simplify and automate the deployment of all the required GCP services. The scripts are located at [website/deploy/terraform-custom-datacommons](https://github.com/datacommonsorg/website/edit/master/deploy/terraform-custom-datacommons/){: target="_blank"}. 

Terraform provisions and runs all the necessary Cloud Platform services:

- Creates a Cloud Storage bucket, which will store your data files. You will upload your input data in the subsequent steps. The default bucket name is <code><var>NAMESPACE</var>-datacommons-data-<var>PROJECT_ID</var><code>, but you can override this.
- Creates a Cloud SQL MySQL instance, with basic resources, called <code><var>NAMESPACE</var>-datacommons-mysql-instance</var> with database `datacommons`, a database user, `datacommons` and random password. You can override the instance, database and user names.
- Creates a [Cloud Artifact Registry](https://cloud.google.com/artifact-registry/docs/overview){: target="_blank"} repository, where you store uploaded Docker images you build. You will upload a custom image in the subsequent steps.
- Creates the Data Commons data management container as a Cloud Run job called <code><var>NAMESPACE</var>-datacommons-data-job</var></code>, with basic resources. 
- Creates the Data Commons services container as a Cloud Run service called <code><var>NAMESPACE</var>-datacommons-web-service</code>, with basic resources. By default this uses the prebuilt image provided by Data Commons team; you will change this to your custom image in subsequent steps.
- Stores all secrets (API keys and database passwords) in the [Cloud Secret Manager](https://cloud.google.com/secret-manager/docs/overview){: target="_blank"}.
- Creates a URL for accessing your service in the browser, in the form <code>https://<var>NAMESPACE</var>-datacommons-web-service-<var>XXXXX</var>.<var>REGION</var>run.app</var></code>.

Follow the steps below to create and run a Terraform deployment.

### Configure the deployment

1. From the root directory of the `website` repo, using your favorite editor, copy `deploy/terraform-custom-datacommons/modules/terraform.tfvars.sample` and save it as a new file `deploy/terraform-custom-datacommons/modules/terraform.tfvars`. 
1. Edit the required variables to specify the relevant values. The `namespace` variable allows you uniquely identify the Data Commons deployment, in the case that you decide to set up [multiple instances](#multiple), e.g. development, staging, testing, production, etc. Since this is a development environment, you may want to have a suffix such as `-dev`.

#### Edit optional variables {#optional}

All of the deployment options you can configure are listed in [deploy/terraform-custom-datacommons/modules/variables.tf](https://github.com/datacommonsorg/website/blob/master/deploy/terraform-custom-datacommons/modules/variables.tf){: target="_blank"}. We recommend you keep the default settings for most options at this point. However, you may want to override the following:

- `region`: This specifies where all the GCP services, and your data will be located. By default, this is set to `us-central1`, close to the base Data Commons data. If you want to set this to a different value, for a list of supported regions, see Cloud SQL [Manage instance locations](https://cloud.google.com/sql/docs/mysql/locations){: target="_blank"}. 
- `dc_data_job_image`: By default this is set to `gcr.io/datcom-ci/datacommons-data:stable`. You may wish to set it to `cr.io/datcom-ci/datacommons-data:latest`
- `make_dc_web_service_public`: By default this is set to `true`. If you intend to restrict access to your instance, set this to `false`.

Other recommended settings for a production environment are provided in [Launch your Data Commons](launch_cloud.md#create-env).

To customize any option, do not edit in place in `variables.tf`. Instead, add the variable to the `terraform.tfvars` file and set it to the desired value. For example, if you wanted to set the  `region` variable to `us-east1`, specify it as follows:

```
region  = "us-east1"
```

### Run the Terraform deployment

1. Open a terminal and navigate to the `website/deploy/deploy/terraform-custom-datacommons/modules` directory.
1. Initialize Terraform and validate the configuration:

   ```shell
   terraform init
   terraform plan 
   ```
1. Review the plan for any possible configuration errors and fix them if needed.
1. Deploy the instance:

   ```
   terraform apply
   ```
1. At the prompt asking you to confirm the actions before creating resources, type `yes` to proceed. It will take about 15 minutes to complete. You will see extensive output showing the progress of the deployment. You may want to take note of the names of the various services created.
1. To view the running application (which initially just serves the sample data and default UI), open the browser link listed in the `cloud_run_service_url` output.

### Update your Terraform deployment

If you want to continue to use Terraform to deploy changes to your service, do the following:
1. Add your updated variables in the `terraform.tfvars` file.
1. [Authenticate to GCP](#gen-creds).  
1. Run all the Terraform commands as listed in the above procedure.

If you intend to deploy several cloud instances, see xxx for a recommended way of using Terraform to do this.

## Manage your data

### Upload data files to Google Cloud Storage

As you are iterating on changes to the source CSV, JSON, or MCF files, you can re-upload them at any time, either overwriting existing files or creating new folders. If you want versioned snapshots, we recommend that you create a new subfolder and store the latest version of the files there. If you prefer to simply incrementally update, you can simply overwrite files in a pre-existing folder. Creating new subfolders is slower but safer. Overwriting files is faster but riskier.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
        <li>Go to <a href="https://console.cloud.google.com/storage/browse" target="_blank">https://console.cloud.google.com/storage/browse</a> and select the custom Data Commons bucket that was created by the Terraform script.</li>
        <li>Click **Create folder** to create a subfolder to store your input files.
        <li>Click <b>Upload Files</b>, and select all your CSV files, MCF files, and <code>config.json</code>.</li>
        </ol>
      </div>
    <div>
    <ol>
         <li>Navigate to your local "input" directory where your source files are located.</li>
         <li>Run the following command:
             <pre>gcloud storage cp config.json [<var>PATH/<var>]*.csv  [<var>PATH/<var>]*.mcf gs://<var>BUCKET_NAME</var>/<var>SUBFOLDER</var></pre>
             The default bucket name is <code><var>NAMESPACE</var>-datacommons-data-<var>PROJECT_ID</var></code>. Specify a subfolder for the bucket.
          </li>
      </ol>
   </div>
  </div>
</div>

> **Note:** Do not upload the local `datacommons` subdirectory or its files.

Once you have uploaded the new data, you must [rerun the data management Cloud Run job](#run-job). 

### Run the data management container {#run-job}

When you rerun the data management job, it will convert CSV data into tables in the Cloud SQL database and generate the embeddings (in a `datacommons/nl` subfolder).

Every time you upload new input files to Google Cloud Storage, you will need to rerun the job. You can simply run `terraform apply` again, or use any of the other methods described below.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
           <li>Go to <a href="https://console.cloud.google.com/run/jobs" target="_blank">https://console.cloud.google.com/run/jobs</a> for your project.</li>
        <li>From the list of jobs, click the link of <code><var>NAMESPACE</var>-datacommons-data-job</code>.</li>
         <li>Optionally, if you have received a <code>SQL check failed</code> error when previously trying to start the container, and would like to minimize startup time, click <b>Execute with overrides</b> and click <b>Add variable</b> to set a new variable with name <code>DATA_RUN_MODE</code> and value <code>schemaupdate</code>.</li>
      <li>Click <b>Execute</b>. It will take several minutes for the job to run. You can click the <b>Logs</b> tab to view the progress.</li>
        </ol>
      </div>
    <div>
    <ol>
         <li>From any local directory, run the following command:
           <pre>gcloud run jobs execute <var>JOB_NAME</var></pre>
         </li>
         <li>To view the progress of the job, run the following command:
              <pre>gcloud beta run jobs logs tail <var>JOB_NAME</var></pre>
          </li>
      </ol>
      The job name is <code><var>NAMESPACE</var>-datacommons-data-job</code>.
      </div>
      </div>
</div>

When it completes, to verify that the data has been loaded correctly, see [Inspect the Cloud SQL database](#inspect-sql).

{:.no_toc}
#### (Optional) Run the data management Cloud Run job in schema update mode {#schema-update-mode}

If you have tried to start a container, and have received a `SQL check failed` error, this indicates that a database schema update is needed. You need to restart the data management container, and you can specify an additional, optional, flag, `DATA_RUN_MODE=schemaupdate`. This mode updates the database schema without re-importing data or re-building natural language embeddings. This is the quickest way to resolve a SQL check failed error during services container startup.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
           <li> Go to <a href="https://console.cloud.google.com/run/jobs" target="_blank">https://console.cloud.google.com/run/jobs</a> for your project.</li>
             <li>From the list of jobs, click the link of <code><var>NAMESPACE</var>-datacommons-data-job</code>.</li>
            <li>Optionally, select <b>Execute</b> &gt; <b>Execute with overrides</b> and click <b>Add variable</b> to set a new variable with name <code>DATA_RUN_MODE</code> and value <code>schemaupdate</code>.</li>
            <li>Click <b>Execute</b>. It will take several minutes for the job to run. You can click the <b>Logs</b> tab to view the progress. </li>
        </ol>
      </div>
    <div>
    <ol>
         <li>From any local directory, run the following command:
            <pre>gcloud run jobs execute <var>JOB_NAME</var> --update-env-vars DATA_RUN_MODE=schemaupdate</pre>
         </li>
         <li>To view the progress of the job, run the following command:
            <pre>gcloud beta run jobs logs tail <var>JOB_NAME</var></pre>
          </li>
      </ol>
      The job name is <var>JOB_NAME</var> is <code><var>NAMESPACE</var>-datacommons-data-job</code>.
   </div>
  </div>
</div>

### Inspect the Cloud SQL database {#inspect-sql}

To view information about the created tables:

1. Go to [https://console.cloud.google.com/sql/instances](https://console.cloud.google.com/sql/instances){: target="_blank"} for your project.
1. Sselect the instance created by the Terraform script. By default, this is <code><var>PROJECT_ID</var>:us-central1:<var>NAMESPACE</var>-datacommons-mysql-instance</code>.
1. In the left panel, select **Cloud SQL Studio**.
1. In the **Sign in to SQL Studio** page, from the Database field, select the database you created earlier, e.g. `datacommons`.
1. Enter the user name and password and click **Authenticate**.
1. In the left Explorer pane that appears, expand the **Databases** icon, your database name, and **Tables**. The table of interest is `observations`. You can see column names and other metadata.
1. To view the actual data, in the main window, click **New SQL Editor tab**. This opens an environment in which you can enter and run SQL queries.
1. Enter a query and click **Run**. For example, for the sample OECD data, if you do `select * from observations limit 10;`, you should see output like this:

   ![screenshot_sqlite](/assets/images/custom_dc/customdc_screenshot6.png){: height="400"}

## Manage your service

## Upload a custom Docker container to the Artifact Registry

This procedure creates a "dev" Docker package that you upload to the Google Cloud Artifact Registry repository that was created by the Terraform script. Any time you rebuild the image and want to deploy it to the cloud, you need to rerun this procedure.

1. Build a local version of the Docker image, following the procedure in [Build a local image](/custom_dc/build_image.html#build-repo).
1. Authenticate to gcloud as described in 

   ```shell
   gcloud auth login
   ```

   This opens a browser window that prompts you to enter credentials, sign in to Google Cloud SDK and allow Google Cloud SDK to access your account. Accept the prompts.

1. Generate credentials for the Docker package you will build in the next step. Docker package names must be in the format <code><var>REGION</var>-docker-pkg.dev</code>.  _REGION_ is the region you have specified in the Terraform script; by default this is `us-central1`.

    <pre>gcloud auth configure-docker <var>REGION</var>-docker.pkg.dev
   </pre>

   When prompted to confirm creating the credentials file, click `Y` to accept.

1. Create a package from the source image you created in step 1:

    <pre>docker tag <var>SOURCE_IMAGE_NAME</var>:<var>SOURCE_IMAGE_TAG</var> \  
   <var>REGION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
   </pre>

   - The artifact repo is ...
   - The target image name and tag can be the same as the source or different.
  
1. Push the image to the registry:

   <pre>docker push <var>CONTAINER_IMAGE_URL</var></pre>

   - The container image URL is the full name of the package you created in step 2, including the tag.

This will take several minutes to upload.

When it completes, verify that the container has been uploaded in the Cloud Console:

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts){: target="_blank"} for your project.
1. In the list of repositories, select ...
You should see the new Docker image listed.

Once you have uploaded a new image, you must [restart the web services Cloud Run service](#start-service).  

### Start/restart the services container {#start-service}

Every time you make changes to the code and release a new Docker artifact, or rerun the [data management job](/custom_dc/data_cloud.html#run-job), you need point the service at the container image URL and restart the service. You can use any of the methods described below.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
    <li>Terraform</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
           <li>Go to the <a href="https://console.cloud.google.com/run/" target="_blank">https://console.cloud.google.com/run/</a> page for your project.</li>
             <li>From the list of jobs, click the link of <code><var>NAMESPACE</var>-datacommons-web-service</code>.</li>
             <li>click <b>Edit & Deploy Revision</b></li>. 
           <li>Select a new container image and click <b>Deploy</b>.</li>
        </ol>
      </div>
    <div>
    <ol>
         <li>From any local directory, run the following command:
            <pre>gcloud run deploy <var>SERVICE_NAME</var> --image <var>CONTAINER_IMAGE_URL</var></pre>
            The service name is <code><var>NAMESPACE</var>-datacommons-web-service</code>. The container image URL is the name of the package you created in the previous step.</li>
         </li>
      </ol>
   </div>
   <div>
   <ol>
      <li>Open the file <code>website/deploy/terraform-custom-datacommons/modules/terraform.tfvars</code> and add the following line:
      <pre>dc_web_service_image = "<code><var>CONTAINER_IMAGE_URL</var></code>"</pre>
      The container image URL is the name of the package you created in the previous step.</li>
      <li>From the <code>modules</code> directory, run <code>terraform apply</code>.
  </div>
  </div>
</div>

<script src="/assets/js/customdc-doc-tabs.js"></script>

## Manage multiple Terraform deployments {#multiple}

If you would like to create multiple Terraform deployments, for example, development, staging, and production, you can easily do so using Terraform Workspaces and multiple `tfvars` configuration files. You can run the deployments in different projects, or run them in the same project using namespaces to keep them separate.  

To create additional deployments:

1. In the `website/deploy/terraform-custom-datacommons/modules` directory, make a copy of the `terraform.tfvars` and name it to something different that indicates its purpose, for example:
```
cp terraform.tfvars terraform_prod.tfvars
```
You may wish to rename the original `terraform.tfvars` to something more descriptive as well.
1. Do any of the following:
   - If you intend to run the new deployment in a different GCP project, edit the `project_id` variable and specify the project ID.
   - If you intend to run the new deployment in the same GCP project, edit the `namespace` variable to name it according to the environment you are creating, e.g. `-prod`. When you run the deployment, all created services will use the new namespace.
   You can also edit both variables if you like.
1. Add any relevant variables you want to change to the file, as described in [Edit optional variables](#optional).  For example, for a production environment, you will likely want to increase the number of resources, add a caching layer, and so on. (See [Launch on Cloud](launch_cloud.md) for more details.)
1. Add a new workspace for each environment you want:
  <pre>
  terraform workspace new <var>WORKSPACE_NAME</var>
  </pre>
  This creates an empty workspace with no configuration attached to it.
1. When you are ready to actually run the deployment, switch to the desired workspace, and attach the relevant configuration to it:
   <pre>
   terraform workspace select <var>WORKSPACE_NAME</var>
   terraform plan -var-file=<var>FILE_NAME</var>
   </pre>
1. When you are ready to run the deployment, specify the configuration file again:
  <pre>
  terraform apply -var-file=<var>FILE_NAME</var>
  </pre>


   