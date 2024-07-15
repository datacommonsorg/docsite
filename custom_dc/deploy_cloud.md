---
layout: default
title: Deploy a custom instance to Google Cloud
nav_order: 7
parent: Build your own Data Commons
---

{:.no_toc}
# Deploy a custom instance to Google Cloud

This page shows you how to create an artifact and run it in Google Cloud Run. This is step 5 of the [recommended workflow](/custom_dc/index.html#workflow).

* TOC
{:toc}

## System overview

When you are ready to launch your custom Data Commons site, we recommend hosting your site in [Google Cloud Run](https://cloud.google.com/run/), which is a serverless solution that is by far the simplest and least expensive option, providing auto-scaling. This is the production setup:

![setup4](/assets/images/custom_dc/customdc_setup4.png)

You push a locally built Docker image to the [Google Cloud Artifact Registry](https://cloud.google.com/artifact-registry), and then deploy the image in Cloud Run.

## One-time setup: Create a Google Artifact Registry repository

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts) for your project.
1. Click **Create Repository**.
1. Specify a name for the repository.
1. In the **Format** option, select **Docker**.
1. In **Location type**, select **Region**, and specify a region.
1. Enable or disable **Immutable image tags** according to the workflow you prefer; that is, if you want to be able to reuse the same Docker tag for new images, keep this option disabled.
1. Click **Create**.

## Upload the Docker container to Google Cloud

This procedure creates a "dev" Docker package that you upload to the Google Cloud Artifact Registry, and then deploy to Google Cloud Run.

1. Build a local version of the Docker image, following the procedure in [Build a local image](/custom_dc/manage_repo.html#build-repo).
1. Authenticate to gcloud:

   ```shell
   gcloud auth login
   ```

   This opens a browser window that prompts you to enter credentials, sign in to Google Cloud SDK and allow Google Cloud SDK to access your account. Accept the prompts.

1. Generate credentials for the Docker package you will build in the next step. Docker package names must be in the format <code><var>LOCATION</var>-docker-pkg.dev</code>, where the _LOCATION_ is the region you have selected in the repository creation step previously; for example, `us-central1`.

    <pre>  
    gcloud auth configure-docker <var>LOCATION</var>-docker.pkg.dev  
   </pre>

   When prompted to confirm creating the credentials file, click `Y` to accept.

1. Build a target package from the source image in the previous step. The `_ARTIFACT_REPO`_ must be an Artifact Registry repository you have created previously. The `_IMAGE_NAME`_ may be the same as the source (`datacommons-website-compose`) or any other string. The _`TARGET_IMAGE_TAG`_ can be the same as the source or any other string.

 <pre> 
docker tag datacommons-website-compose:<var>DOCKER_TAG</var> \  
<var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
</pre>

1. Push the image to the registry:

<pre>
docker push <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
</pre>

This will take several minutes to upload.

When it completes, verify that the container has been uploaded in the Cloud Console:

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts) for your project.
1. In the list of repositories, click on the one you created earlier. Under **Repository Details**, you should see the Docker image listed.

## Deploy the image

To deploy the image in Google Cloud Run, you need to create a Run service. Because we need to set the environment variables for the running image as options in the service, it is actually more convenient to create the service and deploy the image at the same time using `gcloud` rather than the Cloud Console. Once the service is created in this way, you can edit it and redeploy using the Console.

1. Copy the settings from the cloudsql_env.list file to a local environment variable:

   ```shell
   env_vars=$(awk -F '=' 'NF==2 {print $1"="$2}' custom_dc/cloudsql_env.list | tr '\n' ',' | sed 's/,$//')
   ```

1. Create a new Cloud Run service and deploy the image in the Artifact Registry. `

   <pre>
   gcloud run deploy <var>SERVICE_NAME</var> \  
   --allow-unauthenticated \  
   --memory 8Gi \  
   --cpu 2 \  
   --region <var>LOCATION</var> \  
   --image <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  \
   --add-cloudsql-instances=<var>PROJECT_ID</var>:<var>LOCATION</var>:<var>INSTANCE_ID</var> \  
   --set-env-vars="$env_vars" \  
   --port 8080  
   --no-cpu-throttling
   </pre>

   The _SERVICE_NAME_ can be any string of your choice.

1. Follow the screen output to see the status details of the operation. Once it completes, a link to the deployed image is output. Visit the link in your browser to see the running instance.

To inspect the service in the Cloud Console:

1. Go to [https://console.cloud.google.com/run](https://console.cloud.google.com/run) for your project.
1. Select the service you just created to show the **Service Details** page.
1. Select **Revisions**. Scroll down and you can see the environment variables and other settings.

For future deployments, select **Edit & Deploy Revision** from this page to select a new repository\ container and locate the link to the running instance.

See also [Deploying to Cloud Run](https://cloud.google.com/run/docs/deploying) for more information on all the options you may set on your service.

## Load custom data to a deployed instance

Once you have deployed a custom instance to Google Cloud, you can continue to update your custom data in two ways:

- Load the data from a local running instance, as described in [Load custom data in Cloud SQL](/custom_dc/data_cloud.html#load-data-cloudsql)
- Use the `/admin` page from the running Cloud app.
