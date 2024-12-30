---
layout: default
title: Advanced setups
nav_order: 9
parent: Build your own Data Commons
---

This page covers hybrid setups that are not recommended for most use cases, but may be helpful for some custom Data Commons instances:
- Running the data management container locally, and the service container in Google Cloud. This might be useful for users with very large data sets, that would like to cut down on output generation times and the cost of storing input data in addition to output data.
- Running the service container locally, and the data management container in Google Cloud. If you have already set up a data processing pipeline to send your input data to Google Cloud, but are still iterating on the website code, this might be a useful option.

* TOC
{:toc}

## Run the data management container locally {#run-local}

This process is similar to running both data management and services containers locally, with a few exceptions:
- Your input directory will be the local file system, while the output directory will be a Google Cloud Storage bucket and folder.
- You must start the job with credentials to be passed to Google Cloud, to access the Cloud SQL instance.

Before you proceed, ensure you have [set up all necessary GCP services](deploy_cloud.md).

### Step 1: Set environment variables

To run a local instance of the data management container, you need to set all of the environment variables in the `custom_dc/env.list` file, including all the GCP ones. 

1. Obtain the values output by Terraform scripts: 
    1. Go to <https://console.cloud.google.com/run>{: target="_blank"}, select the **Services** tab, select your service from the list, and click **Revisions**. 
    1. In the right-hand window, scroll to the **Environment variables** section.
    1. Copy the variable values to your `env.list` file.
1. For the `INPUT_DIR` variable, specify the full local path where your CSV and JSON files are stored, as described in the [Quickstart](/custom_dc/quickstart.html#env-vars). 

### Step 2: Generate credentials for Google Cloud authentication {#gen-creds}

For the services to connect to the Cloud SQL instance, you need to generate credentials that can be used in the local Docker container for authentication. You should refresh the credentials every time you rerun the Docker container.

Open a terminal window and run the following command:

```shell
gcloud auth application-default login
```

This opens a browser window that prompts you to enter credentials, sign in to Google Auth Library and allow Google Auth Library to access your account. Accept the prompts. When it has completed, a credential JSON file is created in  
`$HOME/.config/gcloud/application_default_credentials.json`. Use this in the command below to authenticate from the docker container.

The first time you run it, may be prompted to specify a quota project for billing that will be used in the credentials file. If so, run this command:

<pre>gcloud auth application-default set-quota-project <var>PROJECT_ID</var>  
</pre>

If you are prompted to install the Cloud Resource Manager API, press `y` to accept.

### Step 3: Run the data management Docker container

From your project root directory, run:

<pre>docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
gcr.io/datcom-ci/datacommons-data:<var>VERSION</var>
</pre>

The version is `latest` or `stable`.

To verify that the data is correctly created in your Cloud SQL database, use the procedure in [Inspect the Cloud SQL database](deploy_cloud.md#inspect-sql).

{:.no_toc}
#### (Optional) Run the data management Docker container in schema update mode 

If you have tried to start a container, and have received a `SQL check failed` error, this indicates that a database schema update is needed. You need to restart the data management container, and you can specify an additional, optional, flag, `DATA_RUN_MODE` to miminize the startup time.

To do so, add the following line to the above command:

```
docker run \
...
-e DATA_RUN_MODE=schemaupdate \
...
gcr.io/datcom-ci/datacommons-data:stable
```

## Access Cloud data from a local services container

For testing purposes, if you wish to run the services Docker container locally but access the data in Google Cloud, use the following procedures.

### Step 1: Set environment variables

To run a local instance of the data management container, you need to set all of the environment variables in the `custom_dc/env.list` file, including all the GCP ones. 

Obtain the values output by Terraform scripts: 

1. Go to <https://console.cloud.google.com/run>{: target="_blank"}, select the **Services** tab, select your service from the list, and click **Revisions**. 
1. In the right-hand window, scroll to the **Environment variables** section.
1. Copy the variable values to your `env.list ` file.

### Step 2: Generate credentials for Google Cloud default application

See the section [above](#gen-creds) for procedures.

### Step 3: Run the services Docker container

From the root directory of your repo, run the following command, assuming you are using a locally built image:
<pre>docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
[-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \]
[-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \]
<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var>
</pre>