---
layout: default
title: Deploy services to Google Cloud
nav_order: 7
parent: Build your own Data Commons
---

{:.no_toc}
# Deploy services to Google Cloud

This page shows you how to build a custom services Docker container as a GCP artifact, upload it to the Artifact Registry, and create a Google Cloud Run service. This is step 5 of the [recommended workflow](/custom_dc/index.html#workflow).

* TOC
{:toc}

## System overview

When you are ready to host your custom Data Commons site in production, you create a [Google Cloud Run](https://cloud.google.com/run/){: target="_blank"} service for the site. This is the production setup:

![services setup](/assets/images/custom_dc/customdc_setup4.png)

You push a locally built Docker image to the [Google Cloud Artifact Registry](https://cloud.google.com/artifact-registry){: target="_blank"}, and then deploy the image as a Cloud Run service.

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

    <pre>  
    gcloud auth configure-docker <var>LOCATION</var>-docker.pkg.dev
   </pre>

   When prompted to confirm creating the credentials file, click `Y` to accept.

1. Create a package from the source image created in step 1:

    <pre> 
   docker tag <var>SOURCE_IMAGE_NAME</var>:<var>SOURCE_IMAGE_TAG</var> \  
   <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
   </pre>

   - The artifact repo must be an Artifact Registry repository you have created previously. 
   - The target image name and tag can be the same as the source or different.
  
1. Push the image to the registry:

   <pre>
   docker push <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>ARTIFACT_REPO</var>/<var>TARGET_IMAGE_NAME</var>:<var>TARGET_IMAGE_TAG</var>  
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