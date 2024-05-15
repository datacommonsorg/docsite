---
layout: default
title: Test data in Google Cloud
nav_order: 6
parent:  Custom Data Commons
---

## Test data in Google Cloud

Once you have tested locally, you need to get your data into Google Cloud so you can test it remotely. You can continue to run the custom Data Commons instance locally, but retrieve data from the Cloud. In this scenario, the system is set up like this:

![setup3](/assets/images/custom_dc/customdc_setup3.png)

You will upload your CSV and JSON files to [Google Cloud Storage](https://cloud.google.com/storage), and the custom Data Commons importer will transform, store, and query the data in a [Google Cloud SQL](https://cloud.google.com/sql) database. 

## Prerequisites

-  A [GCP](https://console.cloud.google.com/welcome) billing account and project.
-  Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk).

## One-time setup steps

### Choose a location

While you are testing, you can start with a single Google Cloud region; to be close to the main Data Commons data, you can use `us-central1`. However, once you launch, you may want to host your data and application closer to where your users will be. In any case, you should use the _same region_ for your Google Cloud SQL instance, the Google Cloud Storage buckets, and the [Google Cloud Run service](deploy_cloud.md) where you will host the site. For a list of supported regions, see Cloud SQL [Manage instance locations](https://cloud.google.com/sql/docs/mysql/locations).

### Create a Google Cloud SQL instance

1. Go to [https://console.cloud.google.com/sql/instances](https://console.cloud.google.com/sql/instances) for your project.
1. Next to **Instances**, click **Create Instance**.
1. Click **Choose MySQL.**
1. If necessary, enable APIs as directed.
1. Set an instance ID. Record the instance connection name in the form of _`INSTANCE_ID`_ for setting environment variables below.
1. Set a root password, and record it for setting environment variables below.
1. For the **Location type**, choose the relevant regional option. 
1. When you have finished setting all the configuration options, click **Create Instance**. It may take several minutes for the instance to be created.
1. When the instance is created and the left navigation bar appears, select **Users**.
1. Add at least one user and password.
1. Select **Databases**.
1.  Click **Create Database**.
1. Choose a name for the database or use the default, `datacommons`. 
1. Click **Create**.

### Create a Google Cloud Storage bucket

1. Go to [https://console.cloud.google.com/storage/browser](https://console.cloud.google.com/storage/browser) for your project. 
1. Next to **Buckets**, click **Create**.
1. Enter a name for this bucket.
1. For the **Location type**, choose the same regional options as for Cloud SQL above.
1. When you have finished setting all the configuration options, click **Create**.
1. In the **Bucket Details** page, click **Create Folder** to create a new folder to hold your data. 
1. Name the folder as desired. Record the folder path as <code>gs://<var>BUCKET_NAME</var>/<var>FOLDER_PATH</var></code> for setting environment variables below. You can start with the sample data provided under `custom_dc/sample` and update to your own data later.

### Set up environment variables

1. Using your favorite editor, open `custom_dc/cloudsql_env.list`.
1. Enter the relevant values for `DC_API_KEY` and `MAPS_API_KEY`. 
1. Set values for all of the following:
    -  `GCS_DATA_PATH`
    -  `CLOUDSQL_INSTANCE`
    -  `GOOGLE_CLOUD_PROJECT`
    -  `DB_NAME`
    -  `DB_USER`
    -  `DB_PASS`

    See comments in the [`cloudsql_env.list`](https://github.com/datacommonsorg/website/blob/master/custom_dc/cloudsql_env.list) file for the correct format for each option.

1. Optionally, set an `ADMIN_SECRET` to use when loading the data through the `/admin` page later.

Warning: Do not use any quotes (single or double) or spaces when specifying the values.

## Upload data files to Google Cloud Storage

1. Go to [https://console.cloud.google.com/storage/browse](https://console.cloud.google.com/storage/browse) and select your custom Data Commons bucket.
1. Navigate to the folder you created in the earlier step.
1. Click **Upload Files**, and select all your CSV files and `config.json`. 

Note: Do not upload the local `datacommons` subdirectory or its files.

As you are iterating on changes to the source CSV and JSON files, you can re-upload them at any time, either overwriting existing files or creating new folders. To load them into Google SQL, follow the procedures below.

## Point the local Data Commons site to the Cloud data

### Generate credentials for Google Cloud default application

Before you can connect to the Cloud SQL instance, you need to generate credentials that can be used in the local Docker container. You should refresh the credentials every time you restart the Docker container.

Open a terminal window and run the following command:

```shell  
gcloud auth application-default login  
```

This opens a browser window that prompts you to enter credentials, sign in to Google Auth Library and allow Google Auth Library to access your account. Accept the prompts. When it has completed, a credential JSON file is created in  
`$HOME/.config/gcloud/application_default_credentials.json`. Use this in the command below to authenticate from the docker container.

If you are prompted to specify a quota project for billing that will be used in the credentials file, run this command:

<pre>  
gcloud auth application-default set-quota-project <var>PROJECT_ID</var>  
</pre>

If you are prompted to install the Cloud Resource Manager API, press `y` to accept.

### Start the Docker container with Cloud data

#### Run with a prebuilt image 

If you have not made changes that require a local build, and just want to run the pre-downloaded image, from `website` root of the repository,  run:

```shell  
docker run -it \  
--env-file $PWD/custom_dc/cloudsql_env.list \  
-p 8080:8080 \  
-e DEBUG=true \  
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \  
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \  
gcr.io/datcom-ci/datacommons-website-compose:stable  
```

#### Run with a locally built repo

If you have made local changes and have a [locally built repo](build_repo.md), from the `website` root of the repository, run the following:

<pre>
docker run -it \  
--env-file $PWD/custom_dc/cloudsql_env.list \  
-p 8080:8080 \  
-e DEBUG=true \  
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \  
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \  
datacommons-website-compose:<var>DOCKER_TAG</var>  
</pre>

_`DOCKER_TAG`_ is the tag you specified when you built the repo.

### Load custom data in Cloud SQL {#load-data-cloudsql}

Each time you upload new versions of the source CSV and JSON files, you need to load the new/updated data into Google Cloud SQL. Custom Data Commons allows you to reload data on the fly, while the website is running, so even multiple users can reload data.

You can load the new/updated data from using the `/admin` page on the site, or using curl, from the command line:

1. Optionally, in the `cloudsql_env.list` file, set the `ADMIN_SECRET` environment variable to a string that authorizes users to load data.
1. Start the Docker container as described above.git
1. With the services running, navigate to the `/admin` page. If a secret is required, enter it in the text field, and click **Load**. 
This runs a script inside the Docker container, that converts the CSV data in Cloud Storage into SQL tables, and stores them in the Cloud SQL database you created earlier. It also generates embeddings in the Google Cloud Storage folder into which you uploaded the CSV/JSON files, in a `datacommons/nl/` subfolder. 

## Inspect the Cloud SQL database

To view information about the created tables:

1. Go to [https://console.cloud.google.com/sql/instances](https://console.cloud.google.com/sql/instances) for your project and select the instance you created earlier.
1. In the left panel, select **Cloud SQL Studio**.
1. In the **Sign in to SQL Studio** page, from the Database field, select the database you created earlier, e.g. `datacommons`.
1. Enter the user name and password and click **Authenticate**.
1. In the left Explorer pane that appears, expand the **Databases** icon, your database name, and **Tables**. The table of interest is `observations`. You can see column names and other metadata.
1. To view the actual data, in the main window, click **New SQL Editor tab**. This opens an environment in which you can enter and run SQL queries. 
1. Enter a query and click **Run**. For example, for the sample OECD data, if you do `select * from observations limit 10;`, you should see output like this:

    ![screenshot_sqlite](/assets/images/custom_dc/customdc_screenshot6.png){: height="400"}