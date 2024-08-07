---
layout: default
title: Load data in Google Cloud
nav_order: 6
parent: Build your own Data Commons
---

{:.no_toc}
# Load data in Google Cloud

This page shows you how to store your custom data in Google Cloud, and create the data management container as a Google Cloud Run job. This is step 4 of the [recommended workflow](/custom_dc/index.html#workflow).

* TOC
{:toc}

## Overview

Once you have tested locally, the next step is to get your data into the Google Cloud Platform. You upload your CSV and JSON files to [Google Cloud Storage](https://cloud.google.com/storage), and run the Data Commons data Docker container as a Cloud Run job. The job will transform and store the data in a [Google Cloud SQL](https://cloud.google.com/sql) database, and generate NL embeddings stored in Cloud Storage.


## Prerequisites

- A [GCP](https://console.cloud.google.com/welcome) billing account and project.
- Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk).

## One-time setup steps

### Step 1: Choose a location

While you are testing, you can start with a single Google Cloud region; to be close to the base Data Commons data, you can use `us-central1`. However, once you launch, you may want to host your data and application closer to where your users will be. In any case, you should use the _same region_ for your Google Cloud SQL instance, the Google Cloud Storage buckets, and the [Google Cloud Run service](deploy_cloud.md) where you will host the site. For a list of supported regions, see Cloud SQL [Manage instance locations](https://cloud.google.com/sql/docs/mysql/locations).

### Step 2: Create a Google Cloud Storage bucket

This stores the CSV and JSON files that you will upload whenever your data changes. It also stores generated files files in a `datacommons` subdirectory when you run the data management job.

1. Go to [https://console.cloud.google.com/storage/browser](https://console.cloud.google.com/storage/browser) for your project.
1. Next to **Buckets**, click **Create**.
1. Enter a name for this bucket.
1. For the **Location type**, choose the same regional options as for Cloud SQL above.
1. When you have finished setting all the configuration options, click **Create**.
1. In the **Bucket Details** page, click **Create Folder** to create a new folder to hold your input CSV and JSON files and name it as desired.
1. Optionally, create a separate folder to hold the output embeddings files, or just use the same one as for the input.
1. Record the folder path(s) as <code>gs://<var>BUCKET_NAME</var>/<var>FOLDER_PATH</var></code> for setting the `INPUT_DIR` and `OUTPUT_DIR` environment variables below. 

### Step 3: Create a Google Cloud SQL instance

This stores the data that will be served at run time. The Data Commons data management job will create this data when it is started.

1. Go to https://console.cloud.google.com/sql/instances for your project.
1. Next to **Instances**, click **Create Instance**.
1. Click **Choose MySQL.**
1. If necessary, enable APIs as directed.
1. Set an instance ID. Record the instance connection name in the form of _`INSTANCE_ID`_ for setting environment variables below.
1. Set a root password, and record it for setting environment variables below.
1. For the **Location type**, choose the relevant regional option.
1. When you have finished setting all the configuration options, click **Create Instance**. It may take several minutes for the instance to be created.
1. When the instance is created and the left navigation bar appears, select **Users**.
1. Add at least one user and password. Be sure to at least assign a password to the "root" user.
1. Select **Databases**.
1. Click **Create Database**.
1. Choose a name for the database or use the default, `datacommons`.
1. Click **Create**. 
1. In the **Overview** page for the new instance, record the **Connection name** to set in environment variables in the next step.

### Step 4: Create a Google Cloud Run job

Since you won't need to customize the data management container, you can simply run an instance of the released container provided by Data Commons team, at https://console.cloud.google.com.google.com/gcr/images/datcom-ci/global/datacommons-data.

1. Go to https://console.cloud.google.com/run/ for your project.
1. Click **Create job**.
1. In the **Container image URL** field, click **Select** to open the **Select container image** window.
1. Click the **Container Registry** tab.
1. Next to the **Project**, click **Change**, search for **datcom-ci** and select it.
1. In the list of images that appears, navigate to and expand **gcr.io/datcom-ci/datacommons-data**, highlight the image you want, **stable** or **latest**, and click **Select**.
1. Optionally, in the **Job name** field, enter an alternative name as desired.
1. In the **Region** field, select the region you chose as your location.
1. Leave the default **Number of tasks** as 1.
1. Expand **Container, Volumes, Connections, Security** and expand **Settings**, and set the following options:
  -  **Resources** > **Memory**: **8 GiB**
  -  **Resources** > **CPU**: **2**
  -  **Task timeout** > **Number of retries per failed task**: **3**
1. Click **Create** to save the job (but not run it yet).

#### Set environment variables

This procedure shows you how to set the environment variables using the Cloud Console. Alternatively, you could set them in the `custom_dc/env.list` file, pipe the file contents to a system variable, and use the [gcloud CLI](https://cloud.google.com/sdk/gcloud/reference/run/jobs?hl=en) to update the job.

1. Click the **Variables and Secrets** tab.
1. Click **Add variable**.
1. Add names and values for the following environment variables:
- `USE_CLOUDSQL`: set to `true`
- `DC_API_KEY`: set to the API key for your instance
- `INPUT_DIR`: set to the Cloud Storage bucket and input folder that you created in step 2 above.
- `OUTPUT_DIR`: set to the Cloud Storage bucket (and, optionally, output folder) that you created in step 2 above. If you didn't create a separate folder for output, specify the same folder as the `INPUT_DIR`.
- `CLOUDSQL_INSTANCE`: set to the full connection name of the instance you created in step 3 above.
- `DB_USER`: set to a user you configured when you created the instance in step 3, or to `root` if you didn't create a new user.
- `DB_PASS`: set to the user's or root password you configured when you created the instance in step 3.
- `DB_NAME`: if you set it to a name other than `datacommons`
1. Click **Done** and **Update** to save.

## Upload data files to Google Cloud Storage

1. Go to https://console.cloud.google.com/storage/browse and select your custom Data Commons bucket.
1. Navigate to the folder you created in the earlier step.
1. Click **Upload Files**, and select all your CSV files and `config.json`.

Note: Do not upload the local `datacommons` subdirectory or its files.

As you are iterating on changes to the source CSV and JSON files, you can re-upload them at any time, either overwriting existing files or creating new folders. To load them into Google SQL, follow the procedures below.

## Start the data management Cloud Run job

Now that everything is configured, and you have uploaded your data in Google Cloud Storage, you simply have to start the Cloud Run data management job to convert the CSV data into tables in the Cloud SQL database and generate the embeddings (in a `datacommons/nl` subfolder).

Every time you upload new data files or changes to the JSON file to Google Cloud Storage, you will need to rerun the job.

To run the job:

1. Go to https://console.cloud.google.com/run/jobs for your project.
1. From the list of jobs, click the link of the "datacommons-data" job you created above.
1. Click **Execute**. It will take several minutes for the job to run. You can click the **Logs** tab to view the progress. To verify that the data has been loaded correctly, see the next step.

### Inspect the Cloud SQL database

To view information about the created tables:

1. Go to [https://console.cloud.google.com/sql/instances](https://console.cloud.google.com/sql/instances) for your project and select the instance you created earlier.
1. In the left panel, select **Cloud SQL Studio**.
1. In the **Sign in to SQL Studio** page, from the Database field, select the database you created earlier, e.g. `datacommons`.
1. Enter the user name and password and click **Authenticate**.
1. In the left Explorer pane that appears, expand the **Databases** icon, your database name, and **Tables**. The table of interest is `observations`. You can see column names and other metadata.
1. To view the actual data, in the main window, click **New SQL Editor tab**. This opens an environment in which you can enter and run SQL queries.
1. Enter a query and click **Run**. For example, for the sample OECD data, if you do `select * from observations limit 10;`, you should see output like this:

   ![screenshot_sqlite](/assets/images/custom_dc/customdc_screenshot6.png){: height="400"}
