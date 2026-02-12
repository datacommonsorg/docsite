---
layout: default
title: Deploy to Google Cloud
nav_order: 9
parent: Build your own Data Commons
---

{: .no_toc}
# Deploy your custom instance to Google Cloud

This page shows you how to create a development environment in Google Cloud Platform, using [Terraform](https://cloud.google.com/docs/terraform){: target="_blank"}. This is step 5 of the [recommended workflow](/custom_dc/index.html#workflow).

> **Note**: It's recommended that you go through the [Quickstart](quickstart.md) to start up a local instance before attempting to set up a Google Cloud instance. This will ensure you have all the necessary prerequisites, and give you a chance to test out your own data to make sure everything is working.

* TOC
{:toc}

## System overview

Here is the Data Commons setup in Google Cloud Platform (GCP):

![GCP setup](/assets/images/custom_dc/customdc_setup3.png)

You upload your data and configuration files to [Google Cloud Storage](https://cloud.google.com/storage){: target="_blank"}, and run the Data Commons data management Docker container as a [Cloud Run](https://cloud.google.com/run/){: target="_blank"} job. The job will transform and store the data in a [Google Cloud SQL](https://cloud.google.com/sql){: target="_blank"} database, and generate NL embeddings stored in Cloud Storage. The services Docker container runs as a Cloud Run service, using the Docker image stored in a [Google Cloud Artifact Registry](https://cloud.google.com/artifact-registry){: target="_blank"} repository.

## Prerequisites

- You must have a [GCP](https://cloud.google.com/docs/get-started){: target="_blank"} billing account and project.
- You must have relevant API keys. If you haven't obtained them yet, see [One-time setup steps](/custom_dc/quickstart.html#setup) in the Quickstart.
- You must have installed git (if you are running in a local environment) and cloned the <https://github.com/datacommonsorg/website>{: target="_blank"} repo. For cloning procedures, see [One-time setup steps](/custom_dc/quickstart.html#clone) in the Quickstart. 

- Install [gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk){: target="_blank"} on your local machine. gcloud is required for authentication and management tasks.
- Install [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform){: target="_blank"} on your local machine. Terraform is used to automate the setup steps of all the components.

> **Tip:** If you use [Google Cloud Shell](https://cloud.google.com/shell/docs){: target="_blank"} as your development environment, gcloud and Terraform come pre-installed.

## Generate credentials for Google Cloud authentication {#gen-creds}

You will need to regenerate credentials on a periodic basis whenever you run gcloud or Terraform scripts. You can also adjust the frequency with which credentials must be refreshed; see <https://support.google.com/a/answer/9368756>{: target="_blank"} for details.

From any directory, run:

```shell
gcloud auth application-default login
```
This opens a browser window that prompts you to enter credentials, sign in to Google Auth Library and allow Google Auth Library to access your account. Accept the prompts. When it has completed, a credential JSON file is created in
`$HOME/.config/gcloud/application_default_credentials.json`. Use this in the command below to authenticate from the docker container.

The first time you run it, may be prompted to specify a quota project for billing that will be used in the credentials file. If so, run this command:

<pre>
gcloud auth application-default set-quota-project <var>PROJECT_ID</var></pre>

## One-time setup: Enable APIs

`website/deploy/terraform-custom-datacommons/setup.sh` is a convenience script to set up all necessary Cloud APIs. To run it:

<pre>
 cd website/deploy/terraform-custom-datacommons
 ./setup.sh <var>PROJECT_ID</var></pre>

## One-time setup: Create a Google Cloud Artifact Registry repository for custom builds

If you are building your own services Docker image, this is necessary. If you are only reusing the image provided by Data Commons with no customizations, you can skip this step.

`website/deploy/terraform-custom-datacommons/create_artifact_repository.sh` is a convenience script to create a repository in the [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/overview){: target="_blank"}. The script creates a repository called <code><var>PROJECT_ID</var>-artifacts</code>, where you store uploaded Docker images you build. You will upload a custom image in the subsequent steps.

To run it:

<pre>cd website/deploy/terraform-custom-datacommons
./create_artifact_repository.sh <var>PROJECT_ID</var></pre>

The project ID may be the same project you are using for all other resources, or it may be a separate one you use for pushing releases.

To verify that the repository is created, go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts){: target="_blank"} for your project. You should see the repository in the list.

## Configure and run a Terraform deployment {#terraform}

We recommend using the Data Commons Terraform scripts to greatly simplify and automate the deployment of all the required GCP services. The scripts are located at [website/deploy/terraform-custom-datacommons](https://github.com/datacommonsorg/website/edit/master/deploy/terraform-custom-datacommons/){: target="_blank"}.

Terraform provisions and runs all the necessary Cloud Platform services:

- Creates a service account for your project and namespace and assigns it various permissions ([IAM roles](https://docs.cloud.google.com/iam/docs/roles-overview){: target="_blank}).
- Creates a Cloud Storage bucket and top-level folder, which will store your data files. You will upload your input data in the subsequent steps.
- Creates a Cloud SQL MySQL instance, with basic resources, a default database user and a random password.
- Creates the Data Commons data management container as a Cloud Run job, with basic resources.
- Creates a single instance of the Data Commons services container as a Cloud Run service, with basic resources. By default this uses the prebuilt image provided by Data Commons team; you will change this to your custom image in subsequent steps.
- Stores all secrets (API keys and database passwords) in the [Cloud Secret Manager](https://cloud.google.com/secret-manager/docs/overview){: target="_blank"}.
- Creates a URL for accessing your service in the browser.

Follow the steps below to create and run a Terraform deployment.

### Configure the Terraform deployment

1. From the root directory of the `website` repo, using your favorite editor, copy `deploy/terraform-custom-datacommons/modules/terraform.tfvars.sample` and save it as a new file `deploy/terraform-custom-datacommons/modules/terraform.tfvars`.
1. Edit the required variables to specify the relevant values. The `namespace` variable allows you uniquely identify the Data Commons deployment, in the case that you decide to set up [multiple instances](#multiple), e.g. development, staging, testing, production, etc. Since this is a development environment, you may want to have a suffix such as `-dev`.

{:.no_toc}
#### Edit optional variables {#optional}

All of the deployment options you can configure are listed in [deploy/terraform-custom-datacommons/modules/variables.tf](https://github.com/datacommonsorg/website/blob/master/deploy/terraform-custom-datacommons/modules/variables.tf){: target="_blank"}. We recommend you keep the default settings for most options at this point. However, you may want to override the following:

| Option | Default | Description |
|--------|---------|-------------|
| `region` | `us-central1`, close to the base Data Commons data | Specifies where your services will be run and data will be served from. If you want to set this to a different value, for a list of supported regions, see Cloud SQL [Manage instance locations](https://cloud.google.com/sql/docs/mysql/locations){: target="_blank"}. |
| `gcs_data_bucket_name` | <code><var>NAMESPACE</var>-datacommons-data-<var>PROJECT_ID</var></code> | Cloud Storage bucket name. You can override the `datacommons-data` portion of the name. |
| `gcs_data_bucket_location` | `US` | Specifies where your uploaded data is stored. |
| `gcs_data_bucket_input_folder` | `input` | The GCS folder to which you will upload your data and config files. If you have subfolders, you create these manually. |
| `gcs_data_bucket_output_folder` | `output` | The GCS folder where NL embeddings will be stored. |
| `mysql_instance_name` | <code><var>NAMESPACE</var>-datacommons-mysql-instance</code> | Cloud SQL instance name. You can override the `datacommons-mysql-instance` portion of the name. |
| `mysql_database_name` | `datacommons` | The MySQL database managed by Cloud SQL. |
| `mysql_user` | `datacommons` | The default user of the MySQL database. |
| `dc_data_job_image` | `gcr.io/datcom-ci/datacommons-data:stable` | Specifies the image for the Docker data management container. You may wish to set it to `gcr.io/datcom-ci/datacommons-data:latest`. |
| `dc_web_service_image` | `gcr.io/datcom-ci/datacommons-services:stable` | Specifies the image for the Docker services container. You will want to change this to a custom image once you have created it in [Upload a custom Docker image](#upload). |
| `make_dc_web_service_public` | `true` | If you intend to restrict access to your instance, set this to `false`. |
| `disable_google_maps` | `false` | If you want to disable showing Google Maps in the website, set this to `true`. |
| `dc_search_scope` | `base_and_custom` | If you want to limit AI agent queries to only searching your custom data, set this to `custom_only`. |

Other recommended settings for a production environment are provided in [Launch your Data Commons](launch_cloud.md#create-env).

To customize any option, _do not edit in place_ in `variables.tf`. Instead, add the variable to the `terraform.tfvars` file and set it to the desired value. For example, if you wanted to set the `region` variable to `us-east1`, specify it as follows:

```
region  = "us-east1"
```

### Run the Terraform deployment {#run-terraform}

1. Open a terminal and navigate to the `website/deploy/terraform-custom-datacommons/modules` directory.
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
1. To view the running application, which initially just serves the default "Custom Data Commons" UI with the base data, open the browser link listed in the `cloud_run_service_url` output, or see [View the running application](#view-app) for more details. To run the application with your own data and/or custom build, continue with the rest of this page.

## Manage your data

### Upload data files to Google Cloud Storage

> **Note**: Before proceeding, make sure your data is in the correct format required by Data Commons, and you've written an accompanying config file. Please see [Prepare and load your own data](custom_data.md) for complete details.

By default, the Terraform scripts create a Cloud Storage bucket called <code><var>NAMESPACE</var>-datacommons-data-<var>PROJECT_ID</var></code>, with a top-level folder `input`. You upload your CSV, JSON, and MCF files to this folder. You can create subfolders of `input`, but remember to set `"includeInputSubdirs": true` in `config.json`.

As you are iterating on changes to the files, you can re-upload them at any time, either overwriting existing files or creating new folders. If you want versioned snapshots, you can create new folders to store them. A simple strategy would be to move the older versions to other folders, and keep the latest versions in `input`, to avoid having to update configuration variables. If you prefer to simply incrementally update, you can simply overwrite files. Creating new versions of files is slower but safer. Overwriting files is faster but riskier.

To upload data files:

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
        <li>Go to <a href="https://console.cloud.google.com/storage/browse" target="_blank">https://console.cloud.google.com/storage/browse</a> for your service and select the Data Commons bucket that was created by the Terraform script.</li>
        <li>Select the <b>input</b> folder.</li>
        <li>Click <b>Upload Files</b>, and select the CSV files, MCF files, and <code>config.json</code> from your local file system.</li>
        </ol>
      </div>
    <div>
    <ol>
         <li>Navigate to your local "input" directory where your source files are located.</li>
         <li>Run the following command:
             <pre>gcloud storage cp config.json [<var>PATH</var>/]*.csv  [<var>PATH</var>/]*.mcf gs://<var>BUCKET_NAME</var>/<var>input</var></pre>
        </li>
      </ol>
   </div>
  </div>
</div>

> **Note:** Do not upload the local `datacommons` subdirectory or its files.

Once you have uploaded the new data, you must [rerun the data management Cloud Run job](#run-job) and [restart the services Cloud Run service](#start-service).

### Run the data management container {#run-job}

By default, the Terraform scripts create and run a Google Run job called <code><var>NAMESPACE</var>-datacommons-data-job</code>. When you run the data management job, it converts CSV (and MCF) data into tables in the Cloud SQL database and generates embeddings in the `output` folder of the Cloud Storage bucket.

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
        <li>From the list of jobs, select the job created by the Terraform script. </li>
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
      </div>
      </div>
</div>

When it completes, to verify that the data has been loaded correctly, see [Inspect the Cloud SQL database](#inspect-sql). Then [restart the services Cloud Run service](#start-service).

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
             <li>From the list of jobs, select the job created by the Terraform script.</li>
            <li>Select <b>Execute</b> &gt; <b>Execute with overrides</b> and click <b>Add variable</b> to set a new variable with name <code>DATA_RUN_MODE</code> and value <code>schemaupdate</code>.</li>
            <li>Click <b>Execute</b>. It will take several minutes for the job to run. You can click the <b>Logs</b> tab to view the progress. </li>
        </ol>
      </div>
    <div>
    <ol>
         <li>From any local directory, run the following command:
            <pre>gcloud run jobs execute <var>JOB_NAME</var> -update-env-vars DATA_RUN_MODE=schemaupdate</pre>
         </li>
         <li>To view the progress of the job, run the following command:
            <pre>gcloud beta run jobs logs tail <var>JOB_NAME</var></pre>
          </li>
      </ol>
   </div>
  </div>
</div>

### Inspect the Cloud SQL database {#inspect-sql}

By default, the Terraform scripts create a Cloud SQL instance called <code><var>PROJECT_ID</var>:us-central1:<var>NAMESPACE</var>-datacommons-mysql-instance</code>, with a database named `datacommons`, and a default user with admin permissions called `datacommons`.

Before you can inspect the database, you need to retrieve the password created by the Terraform scripts:

1. Go to <https://console.cloud.google.com/security/secret-manager>{: target="_blank"} for your project and in the list of secrets, select <code><var>NAMESPACE</var>-datacommons-mysql-password</code>.
1. Click the **Versions** tab, and select **Actions > View secret value**. Record the password.

To view the tables:

1. Go to [https://console.cloud.google.com/sql/instances](https://console.cloud.google.com/sql/instances){: target="_blank"} for your project.
1. Select the instance created by the Terraform script.
1. In the left panel, select **Cloud SQL Studio**.
1. In the **Sign in to SQL Studio** page, from the **Database** field, select the database created by the Terraform script.
1. In the **User** field, select the user created by the Terraform script.
1. In the **Password** field, enter the password you have retrieved from the Cloud Secret Manager.
1. In the left Explorer pane that appears, expand the **Databases** icon, your database name, and **Tables**. The table of interest is **observations**. You can see column names and other metadata.
1. To view the actual data, in the main window, click **New SQL Editor tab**. This opens an environment in which you can enter and run SQL queries.
1. Enter a query and click **Run**. For example, for the sample OECD data, if you do `select * from observations limit 10;`, you should see output like this:

   ![screenshot_sqlite](/assets/images/custom_dc/customdc_screenshot6.png){: height="400"}

If you don't see any data, go to <a href="https://console.cloud.google.com/run/jobs" target="_blank">https://console.cloud.google.com/run/jobs</a> for your project, select
the job you ran in the previous step, and click the **Logs** tab to look for errors.

## Manage your service

### Upload a custom Docker image to the Artifact Registry {#upload}

When you ran the "create artifact registry" script, it created a repository called <code><var>PROJECT_ID</var>-artifacts</code>. If you are using a custom-built Docker service image, which is usually the case, you need to upload it to the Google Cloud Artifact Registry repository, where it will be picked up by the Cloud Run Docker services container.

Any time you make changes to the website and want to deploy your changes to the cloud, you need to rerun this procedure.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
   <div class="active">
   To upload an already built image:
    <pre>./run_cdc_dev_docker.sh --actions upload --image <var>SOURCE_IMAGE_NAME</var>:<var>SOURCE_IMAGE_TAG</var> [--package <var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>]</pre>
   To build a new image and and upload it:
   <pre>./run_cdc_dev_docker.sh --actions build_upload --image <var>IMAGE_NAME</var>:<var>IMAGE_TAG</var> [--package <var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>]</pre>
   If you don't specify the <code>--package</code> option, the package name and tag will be the same as the source image.
   </div>
    <div><ol><li>Build a local version of the Docker image, following the procedure in <a href="/custom_dc/build_image.html#build-repo">Build a local image</a>.</li>
      <li>Generate credentials for the Docker package: 
    <pre>gcloud auth configure-docker <var>REGION</var>-docker.pkg.dev</pre></li>
   <li>Create a package from the source image you created in step 1:
    <pre>docker tag <var>SOURCE_IMAGE_NAME</var>:<var>SOURCE_IMAGE_TAG</var> \
   <var>REGION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var></pre>
   The artifact repo is <code><var>PROJECT_ID</var>-artifacts</code>.</li>
   <li>Push the image to the registry:
   <pre>docker push <var>CONTAINER_IMAGE_URL</var></pre>
    The container image URL is the full name of the package you created in the previous step, including the tag. For example: `us-central1-docker-pkg.dev/myproject/myrepo/datacommons:latest`.</li>
  </ol>
   </div>
  </div>
</div>
- The target image name and tag can be the same as the source or different.
- Docker package names must be in the format <code><var>REGION</var>-docker-pkg.dev</code>. The default region in the Terraform scripts is `us-central1`.

> Tip: We suggest you name and tag your image the same for every release, and let the Artifact Registry manage versioning. This way you won't have to continually update your Terraform configuration to a new name every time you upload a new build.

It will take several minutes to upload. Once you have uploaded a new image, you must [restart the web services Cloud Run service](#start-service) to pick it up, as described below.

{: .no_toc}
#### Verify the upload

When the push completes, verify that the container has been uploaded in the Cloud Console:

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts){: target="_blank"} for your project.
1. In the list of repositories, click on <code><var>PROJECT_ID</var>-artifacts</code>. You should see your image in the list. You can click through to view revisions and tags.

### Start/restart the services container {#start-service}

By default, the Terraform scripts point the service at the prebuilt Data Commons services image, `gcr.io/datcom-ci/datacommons-services:stable`. If you just want to see the running default website in action with your data, run `terraform apply` again.

If you are using a custom image, which is normally the case, you first need to repoint the service to your own image and then restart the service:

1. Open the file `website/deploy/terraform-custom-datacommons/modules/terraform.tfvars` and add the following line:
    <pre>dc_web_service_image = "<var>CONTAINER_IMAGE_URL</var>"</pre>
    The container image URL is the name of the package you created in the previous step.
1. From the `modules` directory, run `terraform apply`.
1. To view the running application with your custom UI and data, open the browser link listed in the `cloud_run_service_url` output, or see [View the running application](#view-app) for more details.

You need to restart the services container every time you make changes to the code and release a new Docker artifact, or rerun the [data management job](#run-job) to process new data. For future pushes and restarts, if you use a different image or tag name, re-edit the `terraform.tfvars` file. If you use the same image name or tag you can simply rerun `terraform apply` every time to restart the services. Alternatively, you can also use either of the following procedures:

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
  <div class="active">
           <ol>
           <li>Go to the <a href="https://console.cloud.google.com/run/services" target="_blank">https://console.cloud.google.com/run/services</a> page for your project.</li>
             <li>From the list of services, click the link of the service created by the Terraform scripts.</li>
             <li>Click <b>Edit & Deploy Revision</b>.</li>
           <li>Under <b>Container image URL</b>, click <b>Select</b>.</li>
           <li>Expand the package name you created in the previous step.</li>
           <li>Expand the image name of the container, and select the tag you created in the previous step.</li>
           <li>Click <b>Deploy</b>. It will take several minutes for the service to start. You can click the <b>Logs</b> tab to view the progress.</li>
        </ol>
      </div>
    <div><p>From any local directory, run the following command:
      <pre>gcloud run deploy <var>SERVICE_NAME</var> --image <var>CONTAINER_IMAGE_URL</var></pre></p>
      <p> To view the startup status, run the following command:
            <pre>gcloud beta run jobs logs tail <var>SERVICE_NAME</var></pre>
    </p>
     </div>
   </div>
  </div>

### View your running application {#view-app}

The URL for your service is in the form <code>https://<var>NAMESPACE</var>-datacommons-web-service-<var>XXXXX</var>.<var>REGION</var>.run.app</code>. To get the exact URL:

1. Go to the <a href="https://console.cloud.google.com/run/services" target="_blank">https://console.cloud.google.com/run/services</a> page for your project.
1. From the list of services, click the link the service created by the Terraform script. The app URL appears at the top of the page. If the service is running, the URL will be a clickable link. When you click on it, it should open in in another browser window or tab.

If the link is not clickable and the service is not running, go back to the Console Cloud Run page, click the  **Logs** tab and look for errors. Also check the output of your `terraform apply` run.

### Connect an AI agent to the MCP server

To connect an AI agent to the cloud service:

1. Obtain the app URL from the previous step.
1. In the configuration for the agent/client, specify the HTTP URL as <code>https://<var>APP_URL</var>/mcp</code>. 
1. Run the agent as usual.

<script src="/assets/js/customdc-doc-tabs.js"></script>

## Update your Terraform deployment {#update-terraform}

If you want to continue to use Terraform to deploy changes to your service, do the following:
1. Add your updated variables in the `terraform.tfvars` file.
1. [Authenticate to GCP](#gen-creds).
1. Run all the Terraform commands as listed in [Run the Terraform deployment](#run-terraform).

> **Note:** Whenever you make future updates to your deployments, we recommend always using Terraform to do so. If you use the Cloud Console or gcloud to make updates and try to run Terraform again, it will override any changes you have made outside of Terraform. For options that are available as variables in the Data Commons `variables.tf`, you must sync your `terraform.tfvars` options to the same values you have set outside Terraform before running Terraform commands again. If you use the Cloud Console or gcloud to configure options that are not available as Data Commons variables, you _must not_ run Terraform again.

If you intend to deploy several Google Cloud instances, see the next section for a recommended way of using Terraform to do this.

## Manage multiple Terraform deployments {#multiple}

If you would like to create multiple Terraform deployments, for example, development, staging, and production, you can easily do so using Terraform Workspaces and multiple `tfvars` configuration files. You can run the deployments in different projects, or run them in the same project using namespaces to keep them separate.

To create additional deployments:

1. In the `website/deploy/terraform-custom-datacommons/modules` directory, make a copy of the `terraform.tfvars` and name it to something different that indicates its purpose, for example:
```
cp terraform.tfvars terraform_prod.tfvars
```
> Tip: You may wish to rename the original `terraform.tfvars` to something more descriptive as well.

1. Do any of the following:
   - If you intend to run the new deployment in a different GCP project, edit the `project_id` variable and specify the project ID.
   - If you intend to run the new deployment in the same GCP project, edit the `namespace` variable to name it according to the environment you are creating, e.g. `-prod`. When you run the deployment, all created services will use the new namespace.
1. Add any relevant variables you want to change to the file, as described in [Edit optional variables](#optional). For example, for a production environment, you may want to increase the number of service replicas, add a caching layer, and so on. (See [Launch on Cloud](launch_cloud.md) for more details.)
1. Add a new workspace for each environment you want:
    <pre>terraform workspace new <var>WORKSPACE_NAME</var></pre>
  This creates an empty workspace with no configuration attached to it.
1. When you are ready to actually run the deployment, switch to the desired workspace, and attach the relevant configuration to it:
   <pre>
   terraform workspace select <var>WORKSPACE_NAME</var>
   terraform plan -var-file=<var>FILE_NAME</var>
   </pre>
1. When you are ready to run the deployment, specify the configuration file again:
    <pre>terraform apply -var-file=<var>FILE_NAME</var></pre>


