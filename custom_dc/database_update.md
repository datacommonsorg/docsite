---
layout: default
title: Update your database schema
nav_order: 9
parent: Build your own Data Commons
---

{:.no_toc}
# Update your database schema

While starting Data Commons services, you may see an error that starts with `SQL schema check failed`. This means your database schema must be updated for compatibility with the latest Data Commons services.

You can update your database by running a data management job with the environment variable `SCHEMA_UPDATE_ONLY` set to `true`. This will alter your database without modifying already-imported data.

Running a data management job in the default mode will also update the database schema, but may take longer since it fully re-imports your custom data.

Once your database is updated, starting Data Commons services should succeed.

This page contains detailed instructions for passing `SCHEMA_UPDATE_ONLY` to the data management container using various workflows.

* TOC
{:toc}

## Local data management job with local SQLite database

Add `-e SCHEMA_UPDATE_ONLY=true` to the Docker run command for the data management container (the first command in [this doc section](/custom_dc/custom_data.html#docker-data){: target="_blank"}):

<pre>
docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
<b>-e SCHEMA_UPDATE_ONLY=true</b> \
gcr.io/datcom-ci/datacommons-data:stable
</pre>

## Cloud Run data management job

Run your existing Cloud Run job with an environment variable override.

1. Go to [https://console.cloud.google.com/run/jobs](https://console.cloud.google.com/run/jobs){: target="_blank"} for your project.
1. From the list of jobs, click the link of the "datacommons-data" job. This should be a job that uses the `stable` or `latest` version of the image hosted at gcr.io/datcom-ci/datacommons-data:stable.
1. Next to Execute, use the dropdown to find the option to **Execute with overrides**.
1. Use the **Add variable** button to set a variable with name `SCHEMA_UPDATE_ONLY` and value `true`.
1. Click **Execute**.
1. It should only take a few minutes for the job to run. You can click the **Logs** tab to view the progress.


## (Advanced) Local data management job with Cloud SQL

If you followed [these instructions](/custom_dc/data_cloud.html#run-local){: target="_blank"} to load data from your local machine into a Cloud SQL database, add `-e SCHEMA_UPDATE_ONLY=true` to the Docker run command from the final step:

<pre>
docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-e GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
<b>-e SCHEMA_UPDATE_ONLY=true</b> \
-v $HOME/.config/gcloud/application_default_credentials.json:/gcp/creds.json:ro \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
[-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \]
[-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \]
<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var>
</pre>

Substitute the `IMAGE_TAG` that matches the services container image which threw the schema check error.
