---
layout: default
title: Run an MCP server in Google Cloud
nav_order: 9
parent: Build your own Data Commons
---

{:.no_toc}
# Run an MCP server in Google Cloud

If you have built a custom agent or Gemini CLI extension which you want to make publicly available, this page describes how to run the [Data Commons MCP server](https://pypi.org/project/datacommons-mcp/) in the cloud, using Google Cloud Run. 

Since setting up an MCP server is a simple, one-time setup, there's no need to use Terraform to manage it. Data Commons provides a prebuilt Docker image in the Artifact Registry, so you only need to set up a new Cloud Run service to point to it. 

## Prebuilt images

There are several versions of the image available, viewable at <https://console.cloud.google.com/artifacts/docker/datcom-ci/us/gcr.io/datacommons-mcp-server>. We recommend that you choose a production version with a specific version number, to ensure that changes introduced by the Data Commons team don't break your application.

## Before you start: decide on a hosting model

There are several ways you can host the MCP server in Cloud Run, namely:

- As a standalone service. In this case, any client simply connects to it over HTTP, including your own MCP agent running as a separate Cloud Run service or locally. You can choose whether to make the internal Cloud Run app URL publicly available, or whether to put a load balancer in front of the service and map a domain name. 
- As a ["sidecar"](https://docs.cloud.google.com/run/docs/deploying#sidecars){: target="_blank"} to an MCP client. If you are hosting your own MCP client in Cloud Run as well, this may be a useful option. In this case, the MCP server is not directly addressable; all external connections are managed by the client.

In this page, we provide steps for running the Data Commons MCP server as a standalone container. If you want to go with the sidecar option, please see [Deploying multiple containers to a service (sidecars)](https://docs.cloud.google.com/run/docs/deploying#sidecars){: target="_blank"} for additional requirements and setup procedures.

## Prerequisites

The following procedures assume that you have set up the following Google Cloud Platform services, using the [Terraform scripts](deploy_cloud.md#terraform):
- A service account and roles. 
- A Google Cloud Secret Manager secret for storing your Data Commons API key. 

## Create a Cloud Run Service for the MCP server

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
      <li>In the Artifact Registry panel that appears in the right side of the window, that appears, click <b>Change</b>.</li>
      <li>In the project search bar, enter <code>datcom-ci</code> and click on the link that appears.</li>
      <li>Expand <b>gcr.io/datcom-ci</b> and expand <b>datacommons-mcp-server</b>.</li>
      <li>From the list of images, select a production image, e.g. <code>production-v1.1.4</code>.</li>
      <li>Under <b>Configure</b>, select the desired region for the service, e.g. <code>us-central1</code>.</li> 
      <li>Under <b>Service scaling</b>, enter <code>10</code> for the maximum number of instances.</li>
      <li>Under <b>Requests</b>, increase the request timeout to <code>600</code>.</li>
      <li>Expand <b>Containers, Networking, Security</b>.</li>
      <li>Click the <b>Variables & secrets</b> tab.</li>
      <li>Under <b>Environment variables</b>, click <b>Add variable</b> and set the following variables:
        <ul>
          <li>name: <code>DC_TYPE</code>, value: <code>custom</code></li>
          <li>name: <code>CUSTOM_DC_URL</code>, value: <code><var>YOUR_INSTANCE_URL</var></code></li>
        </ul></li>
      <li>Under <b>Secrets exposed as environment variables</b>, click <b>Reference a secret</b>.</li>
      <li>In the <b>Name</b> field, enter <code>DC_API_KEY</code>, and from the <b>Secret</b> field, select  the secret previously created by the Terraform scripts. It is in the form <code><var>NAMESPACE</var>-datacommons-dc-api-key-<var>FINGERPRINT</var></code>.</li> 
      <li>In the <b>Version</b> field, select the desired version, e.g. <b>latest</b>.</li>
      <li>Click <b>Done</b>.</li>
      <li>Click the <b>Security</b> tab. From the <b>Service account</b> field, select the service account for your namespace and project, previously created by the Terraform scripts. It is in the form</li>
      <li>Click <b>Create</b>. If correctly configured, the service will deploy automatically. It may take several minutes to start up.</li></ol>
    </div>
    <div>
      <ol>
        <li>If you haven't recently refreshed your Google Cloud credentials, run <code>gcloud auth application-default login</code> and authenticate.</li>
        <li>From any local directory, run the following command:
        <pre>gcloud run deploy datacommons-mcp-server --image <var>CONTAINER_IMAGE_URL</var> \
        --service-account <var>SERVICE_ACCOUNT</var> --region <var>REGION</var> \
        --allow-unauthenticated --timeout=10m \
        --set-secrets="DC_API_KEY=<var>SECRET_NAME</var>:latest" \
        --set-env-vars="DC_TYPE=custom" --set-env-vars="CUSTOM_DC_URL=<var>INSTANCE_URL</var>" \
        --min-instances=0</pre></li>
        </ol>
        <ul>
          <li>The container image URL is <code>gcr.io/datcom-ci/datacommons-mcp-server:<var>TAG</var></code>. The tag should be a production image with a version number, e.g. <code>production-v1.1.4</code>.</li>
          <li>The service account was created when you ran Terraform. It is in the form <code><var>NAMESPACE</var>-datacommons-sa@<var>PROJECT_ID</var>.iam.gserviceaccount.com</code>.</li>
          <li>The region is the Cloud region where you want to run the service, e.g. <code>us-central1</code>.</li>
          <li>The secret name is the one created when you ran the Terraform scripts, in the form <code><var>NAMESPACE</var>-datacommons-dc-api-key-<var>FINGERPRINT</var></code>. If you're not sure about the name or fingerprint, go to <a href="https://console.cloud.google.com/security/secret-manager" target="_blank">https://console.cloud.google.com/security/secret-manager</a> for your project and look it up.</li>
        </ul>
    To view the startup status, run the following command:
    <pre>gcloud run services logs tail datacommons-mcp-server --region <var>REGION</var></pre>
    </div>
  </div>
</div>

<script src="/assets/js/customdc-doc-tabs.js"></script>

## Connect to the server from a remote client

For details, see the following pages:
- [Connect to the server from a local Gemini CLI client](/mcp/run_tools.html#gemini-cli-remote)
- [Connect to the server from a local agent](/mcp/run_tools.html#remote)

The HTTP URL parameter is the Cloud Run App URL, if you are exposing the service directly, or a custom domain URL if you are using a load balancer and domain mapping.

## Troubleshoot deployment issues

### Container fails to start

If you see this error message:

```
The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout...
```
This is a generic message that could indicate a number of configuration problems. Check all of these:
- Be sure you have specified the `DC_API_KEY` environment variable.
- Be sure you have specified the correct service account.
- Try increasing the health check timeout.



