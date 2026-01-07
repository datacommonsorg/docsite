---
layout: default
title: Run an MCP server in Google Cloud
nav_order: 9
parent: Build your own Data Commons
---

If you have built a custom agent or Gemini CLI extension which you want to make publicly available, this page describes how to run the [Data Commons MCP server](https://pypi.org/project/datacommons-mcp/) in the cloud, using Google Cloud Run. 

Since setting up an MCP server is a simple, one-time setup, there's no need to use Terraform to manage it. Data Commons provides a prebuilt Docker image in the Artifact Registry, so you only need to set up a new Cloud Run service to point to it. There are several versions of the image available:

- `gcr.io/datcom-ci/datacommons-mcp-server:latest`. This is the latest versions built from head.
- <pre>gcr.io/datcom-ci/datacommons-mcp-server:<var>VERSION</var></pre>: These are specific versions. You will probably want to use one of these versions for production, so that any changes made by Data Commons team don't break your application.

You can see all versions at <https://console.cloud.google.com/artifacts/docker/datcom-ci/us/gcr.io/datacommons-mcp-server>.

## Before you start: Decide on a hosting model

There are several ways you can host the MCP server in Cloud Run, namely:

- As a standalone service. In this case, any client simply connects to it over HTTP, including your own MCP agent running as a separate Cloud Run service or locally. You can choose whether to make the internal Cloud Run app URL publicly available, or whether to put a load balancer in front of the service and map a domain name. 
- As a ["sidecar"](https://docs.cloud.google.com/run/docs/deploying#sidecars) to an MCP client. If you are hosting your own MCP client in Cloud Run as well, this may be a useful option. In this case, the MCP server is not directly addressable. 

In this page, we provide a procedure for running the Data Commons MCP server as a standalone container. If you would go with the sidecar option, please see (Deploying multiple containers to a service (sidecars))[https://docs.cloud.google.com/run/docs/deploying#sidecars]{: target="_blank"} for additional requirements (e.g. health-checks) and steps.

## Prequisites

The following procedures assume that you have set up the following Google Cloud Platform services:
- Service accounts
- A Secret Manager secret for storying your Data Commons API key
- 

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
    <li>In the Artifact Registry panel that appears in the right side of the window, that appears, click <b>Change </b>.
    <li>In the project search bar enter <code>datcom-ci</code> and click on the link that appears.</li>
    <li>Expand <b>gcr.io/datcom-ci<b> and expand <b>datacommons-mcp=server</b>.</li>
    <li>From the list of images, select the one you want.</li>
    <li>Under <b>Configure</b>, select the desired region for the service, e.g. <pre>us-central1</pre>.</li> 
    <li>Under <b>Service scaling</b>, enter <code>10</code> for the maximum number of instances.</li>
    <li>Expand <b>Containers, Networking, Security</b>.</li>
    <li>Under <b>Settings</b>, click <b>Add health check</b>.</li>
    <li>From the <b>Select health check type</b> drop-down, select <b>Startup check</b> and from <b>Select probe type</b> drop-down, select <b>TCP</b>.</li>
    <li>Modify the following parameters:
    <ul><li><b>Period</b>: set to <code>240</code>.</li>
    <li><b>Failure threshold</b>: set to <code>1</code>.</li>
    <li><b>Timeout</b>: set to 240.</li></ul>
    <li>Click <b>Add</b> and then click <b>Done</b>.
    <li>Under <b>Requests</b>, increase the request timeout to <code>600</code>.
    <li>Under <b>Revision scaling</b>, enter <code>10</code> for the maximum number of instances.</li>
    <li>Click the <b>Variables & secrets</b> tab.
    <li>Under <b>Environment variables</b>, click <b>Add variable</b> and set the following variables:
    <ul><li>name: <code>DC_TYPE</code>, value: <code>custom</code></li>
    <li>name: <code>CUSTOM_DC_URL</code>, value: <code><var>YOUR_INSTANCE_URL</var></code></li></ul>
    <li>Under <b>Secrets exposed as environment variables</b>, click <b>Reference a secret</b>, and <code>DC_API_KEY</code> to the Secret Manager [secret previously created by Terraform](deploy_cloud.md#terraform).</li> 
    <li>Click <b>Create</b>. If correctly configured, the service will deploy automatically.</li></ol>
    </div>
    <div><li>If you haven't recently refreshed your Google Cloud credentials, run <pre>gcloud auth application-default login</pre> and authenticate.</li>
    <pre>
      <li>From any local directory, run the following command:
        <pre>gcloud run deploy datacommons-mcp-server --image <var>CONTAINER_IMAGE_URL</var> \
        --region <var>REGION</var>--platform managed --allow-unauthenticated \
        --timeout=10m --set-secrets="DC_API_KEY=<var>SECRET_NAME</var>:latest"
        --set-env-vars="DC_TYPE=custom" --set-env-vars="CUSTOM_DC_URL=<var>INSTANCE_URL</var>" \
        --min-instances=0 
        </li>
                 <ul>
          <li>The container image URL is <pre>gcr.io/datcom-ci/datacommons-mcp-server:<var>TAG</var></pre>. The tag is the tag or version number of the image you want to select from the Artifact Registry.</li>
          <li>The region is the Cloud region where you want to run the service, e.g. <code>us-central1</code>.</li>
          <li>The secret name is the one created when you ran the Terraform script, in the form <var>NAMESPACE</var>-datacommons-dc-api-key-<var>FINGERPRINT</var>. If you're not sure about the name or fingerprint, go to to <https://console.cloud.google.com/security/secret-manager>{: target="_blank"} for your project and look it up.</li>
          </ul>
        <li>To view the startup status, run the following command:
            <pre>gcloud beta run jobs logs tail <var>SERVICE_NAME</var></pre>
          </li>
      </ol>
     </div>
   <div>
  </div>
  </div>
</div>


