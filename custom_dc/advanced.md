---
layout: default
title: Advanced (hybrid) setups
nav_order: 8
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

### Step 1: Set environment variables

To run a local instance of the data management container, you need to set all of the environment variables in the `custom_dc/env.list` file, including all the GCP ones. 

1. Obtain the values output by Terraform scripts: Go to <https://console.cloud.google.com/run/jobs>{: target="_blank"} for your project, select the relevant job from the list, and click **View and edit job configuration**. 
1. Expand **Edit container**, and select the **Variables and secrets** tab.
1. Copy the values of all the variables, with the exception of `FORCE_RESTART` and `INPUT_DIR` to your `env.list` file.
1. Set the value of `INPUT_DIR` to the full local path where your CSV, JSON, and JSON files are located.

### Step 2: Generate credentials for Google Cloud authentication {#gen-creds}

For the services to connect to the Cloud SQL instance, you need to generate credentials that can be used in the local Docker container for authentication. You should refresh the credentials every time you rerun the Docker container.

Open a terminal window and run the following command:

```shell
gcloud auth application-default login
```

This opens a browser window that prompts you to enter credentials, sign in to Google Auth Library and allow Google Auth Library to access your account. Accept the prompts. When it has completed, a credential JSON file is created in  
`$HOME/.config/gcloud/application_default_credentials.json`. Use this in the Docker commands below to authenticate from the Docker container.

### Step 3: Run the data management Docker container

From your project root directory, run:

<pre>docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
gcr.io/datcom-ci/datacommons-data:<var>VERSION</var>
</pre>

The input directory is the local path. You don't specify the output directory,
as Docker doesn't manage it.
The version is `latest` or `stable`.

To verify that the data is correctly created in your Cloud SQL database, use the procedure in [Inspect the Cloud SQL database](deploy_cloud.md#inspect-sql).

{:.no_toc}
#### (Optional) Run the data management Docker container in schema update mode 

If you have tried to start a container, and have received a `SQL check failed` error, this indicates that a database schema update is needed. You need to restart the data management container, and you can specify an additional, optional, flag, `DATA_RUN_MODE` to miminize the startup time.

To do so, add the following line to the above command:

```
-e DATA_RUN_MODE=schemaupdate \
```

### Step 4: Restart the services container in Google Cloud

Follow any of the procedures provided in [Start/restart the services container](deploy_cloud.md#start-service).

## Access Cloud data from a local services container {#local-services}

For testing purposes, if you wish to run the services Docker container locally but access the data in Google Cloud. This process is similar to running both data management and services containers in the cloud, but with a step to start a local Docker services container.

Before you proceed, ensure you have [set up all necessary GCP services](deploy_cloud.md).

### Step 1: Set environment variables

To run a local instance of the services container, you need to set all of the environment variables in the `custom_dc/env.list` file, including all the GCP ones. 

1. Obtain the values output by Terraform scripts: Go to <https://console.cloud.google.com/run/services>{: target="_blank"} for your project, select the relevant service from the list, and click the **Revisions** tab. 
1. In the right-hand window, scroll to **Environment variables**.
1. Copy the values of all the variables, with the exception of `FORCE_RESTART` to your `env.list` file.

### Step 2: Generate credentials for Google Cloud default application

See the section [above](#gen-creds) for procedures.

### Step 3: Run the services Docker container

From the root directory of your repo, run the following command, assuming you are using a [custom-built local](build_repo.md) image:
<pre>docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \
-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \
<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var>
</pre>
You don't specify any directories here, as Docker does not manage them.
The image name and image tag are the values you set when you [created the package](build_image.md#build-package). 

Once the services are up and running, visit your local instance by pointing your browser to <http://localhost:8080>.

If you encounter any issues, look at the detailed output log on the console, and visit the [Troubleshooting Guide](/custom_dc/troubleshooting.html) for detailed solutions to common problems.