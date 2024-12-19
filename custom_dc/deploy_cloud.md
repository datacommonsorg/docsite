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

## Enable all APIs

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

## Configure Terraform deployment variables

Data Commons Terraform scripts are located at [website/deploy/terraform-custom-datacommons](https://github.com/datacommonsorg/website/edit/master/deploy/terraform-custom-datacommons/){: target="_blank"}.

### Provide required variables

1. From the root directory of the `website` repo, using your favorite editor, copy `deploy/terraform-custom-datacommons/modules/terraform.tfvars.sample` and save it as a new file `deploy/terraform-custom-datacommons/modules/terraform.tfvars`. 
1. Edit the required variables to specify the relevant values. The `namespace` variable allows you uniquely identify the Data Commons deployment, in the case that you decide to set up multiple instances, e.g. development, staging, testing, production, etc. Since this is a development environment, you may want to have a suffix such as `-dev`.

### Edit optional variables

Most of the 

Creates Data Commons services container as a Cloud Run service, in region us-central1
- `region`: The GCP [region](https://cloud.google.com/about/locations) where resources will be deployed. By default this is set to `us-central1`
- **dc_web_service_image**: Docker image to use for the services container. Default: `gcr.io/datcom-ci/datacommons-services:stable`. Set to `gcr.io/datcom-ci/datacommons-services:latest` to use the latest web service image.
- **make_dc_web_service_public**: By default, the Data Commons web service is publicly accessible. Set this to `false` if your GCP account has restrictions on public access. [Reference](https://cloud.google.com/run/docs/authenticating/public).


See `modules/variables.tf` for a complete list of optional variables.

## One-time setup steps {#setup}


Creates Data Commons data management container as a Cloud Run job
Creates Cloud SQL MySQL instance
Creates new service account with minimum required permissions
Automatically provisions required Google Maps API key. Stores key in GCP secrets container.
Generates random MySQL password and stores in GCP secrets container.


cloud_run_service_name = "<namespace>-datacommons-web-service"
cloud_run_service_url = "https://<namespace>-datacommons-web-service-abc123-uc.a.run.app"
dc_gcs_data_bucket_path = "<namespace>-datacommons-data-<project-id>"
mysql_instance_connection_name = "<project-id>:us-central1:<namespace>-datacommons-mysql-instance"
mysql_instance_public_ip = "<mysql_ip>"
mysql_user_password = <sensitive>


## Manage your data

### Upload data files to Google Cloud Storage

As you are iterating on changes to the source CSV and JSON files, you can re-upload them at any time, either overwriting existing files or creating new folders. If you want versioned snapshots, we recommend that you create a new subfolder and store the latest version of the files there. If you prefer to simply incrementally update, you can simply overwrite files in a pre-existing folder. Creating new subfolders is slower but safer. Overwriting files is faster but riskier.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
        <li>Go to <a href="https://console.cloud.google.com/storage/browse" target="_blank">https://console.cloud.google.com/storage/browse</a> and select your custom Data Commons bucket.</li>
        <li>Navigate to the folder you created in the earlier step.</li>
        <li>Click <b>Upload Files</b>, and select all your CSV files and <code>config.json</code>.</li>
        </ol>
      </div>
    <div>
    <ol>
         <li>Navigate to your local "input" directory where your source files are located.</li>
         <li>Run the following command:
             <pre>gcloud storage cp config.json *.csv gs://<var>BUCKET_NAME</var>/<var>FOLDER_PATH</var></pre>
          </li>
      </ol>
   </div>
  </div>
</div>

> **Note:** Do not upload the local `datacommons` subdirectory or its files.

Once you have uploaded the new data, you must rerun the data management Cloud Run job.

### Step 2: Run the data management Cloud Run job {#run-job}

Now that everything is configured, and you have uploaded your data in Google Cloud Storage, you simply have to start the Cloud Run data management job to convert the CSV data into tables in the Cloud SQL database and generate the embeddings (in a `datacommons/nl` subfolder).

Every time you upload new input CSV or JSON files to Google Cloud Storage, you will need to rerun the job.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
           <li>Go to <a href="https://console.cloud.google.com/run/jobs" target="_blank">https://console.cloud.google.com/run/jobs</a> for your project.</li>
        <li>From the list of jobs, click the link of the "datacommons-data" job you created above.</li>
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
            <li>From the list of jobs, click the link of the "datacommons-data" job you created above.</li>
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
   </div>
  </div>
</div>

### Inspect the Cloud SQL database {#inspect-sql}

To view information about the created tables:

1. Go to [https://console.cloud.google.com/sql/instances](https://console.cloud.google.com/sql/instances){: target="_blank"} for your project and select the instance you created earlier.
1. In the left panel, select **Cloud SQL Studio**.
1. In the **Sign in to SQL Studio** page, from the Database field, select the database you created earlier, e.g. `datacommons`.
1. Enter the user name and password and click **Authenticate**.
1. In the left Explorer pane that appears, expand the **Databases** icon, your database name, and **Tables**. The table of interest is `observations`. You can see column names and other metadata.
1. To view the actual data, in the main window, click **New SQL Editor tab**. This opens an environment in which you can enter and run SQL queries.
1. Enter a query and click **Run**. For example, for the sample OECD data, if you do `select * from observations limit 10;`, you should see output like this:

   ![screenshot_sqlite](/assets/images/custom_dc/customdc_screenshot6.png){: height="400"}




{:.no_toc}


## One-time setup: Create a Google Artifact Registry repository

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts){: target="_blank"} for your project.
1. Click **Create Repository**.
1. Specify a name for the repository.
1. In the **Format** option, select **Docker**.
1. In **Location type**, select **Region**, and specify the region you chose for your [Google Cloud SQL instance](/custom_dc/data_cloud.html#location) .
1. Enable or disable **Immutable image tags** according to the workflow you prefer; that is, if you want to be able to reuse the same Docker tag for new images, keep this option disabled.
1. Click **Create**.

## Upload the Docker container to the Artifact Registry

This procedure creates a "dev" Docker package that you upload to the Google Cloud Artifact Registry. Any time you rebuild the image and want to deploy it to the cloud, you need to rerun this procedure.

1. Build a local version of the Docker image, following the procedure in [Build a local image](/custom_dc/build_image.html#build-repo).
1. Authenticate to gcloud:

   ```shell
   gcloud auth login
   ```

   This opens a browser window that prompts you to enter credentials, sign in to Google Cloud SDK and allow Google Cloud SDK to access your account. Accept the prompts.

1. Generate credentials for the Docker package you will build in the next step. Docker package names must be in the format <code><var>LOCATION</var>-docker-pkg.dev</code>, where the _LOCATION_ is the region you have selected in the repository creation step previously; for example, `us-central1`.

    <pre>gcloud auth configure-docker <var>LOCATION</var>-docker.pkg.dev
   </pre>

   When prompted to confirm creating the credentials file, click `Y` to accept.

1. Create a package from the source image created in step 1:

    <pre>docker tag <var>SOURCE_IMAGE_NAME</var>:<var>SOURCE_IMAGE_TAG</var> \  
   <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
   </pre>

   - The artifact repo must be an Artifact Registry repository you have created previously. 
   - The target image name and tag can be the same as the source or different.
  
1. Push the image to the registry:

   <pre>docker push <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
   </pre>

This will take several minutes to upload.

When it completes, verify that the container has been uploaded in the Cloud Console:

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts){: target="_blank"} for your project.
1. In the list of repositories, click on the one you created above. Under **Repository Details**, you should see the Docker image listed.

## One-time setup: Create a Google Run service

This procedure shows you how to create a service and set environment variables using the Cloud Console. 

See also [Deploying to Cloud Run](https://cloud.google.com/run/docs/deploying){: target="_blank"} for more information on all the options you may set on your service.

1. Go to [https://console.cloud.google.com/run/](https://console.cloud.google.com/run/){: target="_blank"} for your project.
1. Click **Create service**.
1. Keep the default **Deploy one revision from an existing container image** enabled.
1. In the **Container image URL** field, click **Select** to open the **Select container image** window.
1. In the list of images that appears, navigate to container image you pushed in the previous step, highlight it and click **Select**.
1. In the **Service name** field, enter a name for your service.
1. In the **Region** field, select your [location](/custom_dc/data_cloud.html#location).
1. Under **Authentication**, select the relevant option depending on whether your site will be public or not. If it is public, enable **Allow unauthenticated invocations**.
1. Set the following options:
   - **CPU allocation and pricing**: **CPU is always allocated**
   - **Service autoscaling** > **Minimum number of instances**: **1**

   ![Cloud Run service](/assets/images/custom_dc/gcp_screenshot5.png){: width="450"}

1. Expand **Container, Volumes, Connections, Security** > **Container** > **Settings**, and set the following options:
  -  **Resources** > **Memory**: **8 GiB**
  -  **Resources** > **CPU**: **2**

   ![Cloud Run service](/assets/images/custom_dc/gcp_screenshot6.png){: width="450"}

1. Expand the **Variables and secrets** tab. 
1. Click the **Variables and Secrets** tab.
1. Click **Add variable**.
1. Add the same environment variables and secrets, with the same names and values as you did when you created the [data management run job](/custom_dc/data_cloud.html#env-vars) You can omit the `INPUT_DIR` variable. Add a variable or reference a secret for `MAPS_API_KEY`.
1. When you are finished, click **Done**.

   ![Cloud Run service](/assets/images/custom_dc/gcp_screenshot7.png){: width="450"}

1. Under **Execution environment** > **Autoscaling**, set the following options:
   - **Minimum number of instances**: **1**
  -  **Maximum number of instances**: **1**
1. Disable **Startup CPU boost**.
1. Under **Cloud SQL connections** click **Add connection** and select your Cloud SQL instance from the menu.

   ![Cloud Run service](/assets/images/custom_dc/gcp_screenshot8.png){: width="450"}

Click **Create** to kick off the deployment.  Click the **Logs** tab to see the status details of the operation. Once it completes, a link to the deployed image URL is listed at the top of the page. Click on the link to see the running instance.

## Manage the service

Every time you make changes to the code and release a new Docker artifact, or rerun the [data management job](/custom_dc/data_cloud.html#run-job), you need to restart the service as well. 

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
           <li>Go to the <a href="https://console.cloud.google.com/run/" target="_blank">https://console.cloud.google.com/run/</a> page, click on the service you created above, and click <b>Edit & Deploy Revision</b></li>. 
           <li>Select a new container image and click <b>Deploy</b>.</li>
        </ol>
      </div>
    <div>
    <ol>
         <li>From any local directory, run the following command:
            <pre>gcloud run deploy <var>SERVICE_NAME</var> --image <var>CONTAINER_IMAGE_URL</var></pre>
         </li>
      </ol>
   </div>
  </div>
</div>


<script src="/assets/js/customdc-doc-tabs.js"></script>