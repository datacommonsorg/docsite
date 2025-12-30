---
layout: default
title: Run an MCP server in Google Cloud
nav_order: 9
parent: Build your own Data Commons
---

If you have built a custom agent or Gemini CLI extension which you want to make publicly available, this page describes how to run the [Data Commons MCP server](https://pypi.org/project/datacommons-mcp/) in the cloud, using Google Cloud Run. 

Since setting up an MCP server is a simple, one-time setup, there's no need to use Terraform to manage it. You configure a Docker container and instruct Google Cloud Built to build and deploy the image.

The following procedure assumes that you have set up all the necessary Google Cloud Platform services:
- An Artifact Registry repository
- A Secret Manager secret for storying your Data Commons API key
- 

## Step 1: Create a Dockerfile

In a local project directory, create a file `Dockerfile`. Add the following configuration:

<pre>
ROM python:3.12-slim

WORKDIR /workspace

RUN python -m venv ./venv
ENV PATH="/workspace/venv/bin:$PATH"
RUN pip3 install --upgrade pip
RUN pip install --no-cache-dir datacommons-mcp@<var>VERSION_NUMBER</var>

ENV PORT=8080

CMD ["datacommons-mcp", "serve", "http", "--host", "0.0.0.0", "--port", "8080"]
</pre>

You should pin the package to a particular version number (which you can find on the [PyPi page](https://pypi.org/project/datacommons-mcp/)), so that any future changes that are released by the Data Commons do not break your application.

## Step 2: Create a container image and upload it to the Artifact Registry

In this step, you build a Docker image from the `datacommons-mcp` package hosted at <https://pypi.org/project/datacommons-mcp/> and upload it to your Artifact Registry repository. You can perform this step in two ways:
- Build a local image using Docker and then upload it to the Artifact Registry. This method is useful if you want to test out that the package runs correctly before deploying it.
- Use Cloud Build to build an image remotely and automatically store it in the Artifact Registry. This method combines the build and upload steps in a single step.

Before starting, be sure to refresh your [GCP credentials](deploy_cloud.md#gen-creds):

```shell
gcloud auth application-default login
```

### Build locally with Docker and upload

1. From the directory where your `Dockerfile` is stored, run the following command:
   <pre>
    docker build --tag <var>LOCATION</var>-docker.pkg.dev/<var>PROJECT_ID</var>/<var>REPO_NAME</var>/<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var>  .
    </pre>
    - The location is the region where you want the package to be stored. Typically this is `us-central1`.
    - The repo must have previously been created in the Artifact Registry
    - The image name is a meaningful name, such as `datacommons-mcp-server`.
    - The image tag is a meaningful description of the version you are using.
1. Push the image to the registry:
   <pre>docker push <var>CONTAINER_IMAGE_URL</var></pre>
    The container image URL is the full name of the package you created in the previous step, including the tag. For example: `us-central1-docker-pkg.dev/myproject/myrepo/datacommons:latest`.</li>

### Build remotely with Cloud Build

gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mcp-prod .

## Step 3: Verify that the image is created in the repository

1. Go to [https://console.cloud.google.com/artifacts](https://console.cloud.google.com/artifacts){: target="_blank"} for your project.
1. In the list of repositories, click on <code><var>PROJECT_ID</var>-artifacts</code>. You should see your image in the list. You can click through to view revisions and tags.

## Step 4: Create a Cloud Run Service

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
  <div class="active">
    <ol>
    <li>Go to the <a href="https://console.cloud.google.com/run/services" target="_blank">https://console.cloud.google.com/run/services</a> page for your project.</li>
    <li>Click <b>Deploy container</b>.</li>
    <li>In the <b>Container image URL</b> field, click <b>Select</b>.</li>
    <li>From the list of Artifact Registry repositories that appears, expand your repo, expand the image you created in step 1, and select the version.</li>
    <li>Under <b>Configure</b>, provide a name for the new service and select the region you used when creating the image, e.g. `us-central1`.</li>
    <li>Under <b>Authentication</b>, select <b>Allow public access</b>.</li>
    <li>Under <b>Service scaling</b>, enter `10` for the maximum number of instances.</li>
    <li>Click <b>Add health check</b>.</li>
    <li>From the <b>Select health check type</b> drop-down, select <b>Startup check</b> and from <b>Select probe type</b> drop-down, select <b>TCP</b>.</li>
    <li>Enter the following parameters:
    <ul><li>
    <li>Click <b>Deploy</b>. It will take several minutes for the service to start. You can click the <b>Logs</b> tab to view the progress.</li>
    </ol>
    </div>
    <div>
      <li>From any local directory, run the following command:
        <pre>gcloud run deploy <var>SERVICE_NAME</var> --image <var>CONTAINER_IMAGE_URL</var></pre></li>
        <li>To view the startup status, run the following command:
            <pre>gcloud beta run jobs logs tail <var>SERVICE_NAME</var></pre>
          </li>
          The service name is <code><var>NAMESPACE</var>-datacommons-web-service</code>.
          The container image URL is the name of the package you created in the previous step.
gcloud run deploy mcp-server-prod \
  --image gcr.io/YOUR_PROJECT_ID/mcp-prod \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --timeout=10m \
  --set-secrets="DC_API_KEY=dc-api-key:latest"

      </ol>
     </div>
   <div>
  </div>
  </div>
</div>
