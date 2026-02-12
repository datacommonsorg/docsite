---
layout: default
title: Advanced (hybrid) setups
nav_order: 11
parent: Build your own Data Commons
---

{: .no_toc}
# Advanced setups

This page covers hybrid setups that are not recommended for most use cases, but may be helpful for some custom Data Commons instances:
- [Running the data management container locally, and the service container in Google Cloud](#run-local). In this scenario, you store your input data locally, and write the output to Cloud Storage and Cloud SQL. This might be useful for users with very large data sets, that would like to cut down on output generation times and the cost of storing input data in addition to output data.
- [Running the service container locally, and the data management container in Google Cloud](#local-services). If you have already set up a data processing pipeline to send your input data to Google Cloud, but are still iterating on the website code, this might be a useful option.

## Run the data management container locally and the service container in the cloud {#run-local}

This process is similar to running both data management and services containers locally, with a few exceptions:
- Your input directory will be the local file system, while the output directory will be a Google Cloud Storage bucket and folder.
- You must start the job with credentials to be passed to Google Cloud, to access the Cloud SQL instance.

Before you proceed, ensure you have [set up all necessary GCP services](deploy_cloud.md).

### Set environment variables

To run a local instance of the data management container, you need to set all of the environment variables in the `custom_dc/env.list` file, including all the GCP ones. 

1. Obtain the values output by Terraform scripts: Go to <https://console.cloud.google.com/run/jobs>{: target="_blank"} for your project, select the relevant job from the list, and click **View and edit job configuration**. 
1. Expand **Edit container**, and select the **Variables and secrets** tab.
1. Copy the values of all the variables, with the exception of `FORCE_RESTART` and `INPUT_DIR` to your `env.list` file.
1. Set the value of `INPUT_DIR` to the full local path where your CSV, JSON, and JSON files are located.

### Run the data management Docker container

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
    <div class="active">
    <pre>./run_cdc_dev_docker.sh --container data [--release latest]</pre>
    If you don't specify the <code>--release</code> option, it will use the <code>stable</code> version by default.
    </div>
    <div>
    <ol><li>Generate credentials for Cloud application authentication:
    <pre>gcloud auth application-default login</pre></li>
    <li>Run the container:    
    <pre>docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
gcr.io/datcom-ci/datacommons-data:<var>VERSION</var></pre></li></ol>
    <ul><li>The input directory is the local path. You don't specify the output directory, as you aren't mounting a local output volume.</li>
    <li>The version is <code>latest</code> or <code>stable</code>.</li></ul>
   </div>
  </div>
</div>

To verify that the data is correctly created in your Cloud SQL database, use the procedure in [Inspect the Cloud SQL database](deploy_cloud.md#inspect-sql).

{:.no_toc}
#### (Optional) Run the data management Docker container in schema update mode 

If you have tried to start a container, and have received a `SQL check failed` error, this indicates that a database schema update is needed. You need to restart the data management container, and you can specify an additional, optional, flag, `DATA_RUN_MODE` to miminize the startup time.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
    <div class="active">
    <pre>./run_cdc_dev_docker.sh --container data --schema_update [--release latest]</pre>
    </div>
    <div>
    <pre>docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
-e DATA_RUN_MODE=schemaupdate
gcr.io/datcom-ci/datacommons-data:<var>VERSION</var></pre>
    </div>
    </div>
</div>
 
### Restart the services container in Google Cloud

Follow any of the procedures provided in [Start/restart the services container](deploy_cloud.md#start-service).

## Access Cloud data from a local services container {#local-services}

For testing purposes, if you wish to run the services Docker container locally but access the data in Google Cloud. This process is similar to running both data management and services containers in the cloud, but with a step to start a local Docker services container.

Before you proceed, ensure you have [set up all necessary GCP services](deploy_cloud.md).

### Set environment variables

To run a local instance of the services container, you need to set all of the environment variables in the `custom_dc/env.list` file, including all the GCP ones. 

1. Obtain the values output by Terraform scripts: Go to <https://console.cloud.google.com/run/services>{: target="_blank"} for your project, select the relevant service from the list, and click the **Revisions** tab. 
1. In the right-hand window, scroll to **Environment variables**.
1. Copy the values of all the variables, with the exception of `FORCE_RESTART` to your `env.list` file.

### Run the services Docker container

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
   <div class="active">
   To build and run a custom image:
   <pre>./run_cdc_dev_docker.sh --actions build_run --container service --image <var>IMAGE_NAME</var>:<var>IMAGE_TAG</var></pre>
   To run a previously built custom image:
   <pre>./run_cdc_dev_docker.sh --container service --image <var>IMAGE_NAME</var>:<var>IMAGE_TAG</var></pre>
   To run a Data Commons standard release:
   <pre>./run_cdc_dev_docker.sh --container service [--release latest]</pre>
   If you don't specify the <code>--release</code> option, it will use the <code>stable</code> version by default.
   </div>
    <div>
    <ol><li>Generate credentials for Cloud application authentication:
    <pre>gcloud auth application-default login</pre></li>
    <li>Run the container. <br />
    To run a custom image:    
    <pre>docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \
-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \
<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var></pre>
    <ul><li>The image name and image tag are the values you set when you <a href="build_image.md#build-package">created the package</a>.</li>
    <li>You don't specify any directories here, as you aren't mounting any local volumes.</li></ul><br/>
    To run a Data Commons standard release:
   <pre>docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
gcr.io/datcom-ci/datacommons-services:<var>VERSION</var></pre>
    <ul><li>The version is <code>latest</code> or <code>stable</code>.</li>
    <li>You don't specify any directories here, as you aren't mounting any local volumes.</li></ul>
    </li>
    </ol>
   </div>
  </div>
</div>

Once the services are up and running, visit your local instance by pointing your browser to <http://localhost:8080>.

If you encounter any issues, look at the detailed output log on the console, and visit the [Troubleshooting Guide](/custom_dc/troubleshooting.html) for detailed solutions to common problems.

<script src="/assets/js/customdc-doc-tabs.js"></script>