---
layout: default
title: Launch your Data Commons
nav_order: 7
parent: Build your own Data Commons
---

{:.no_toc}
# Launch your Data Commons

* TOC
{:toc}

## Overview

When you are ready to launch your site to external traffic, there are many tasks you will need to perform, including:

-  Configure your Cloud Service to serve external traffic, over SSL. GCP offers many options for this; see [Mapping a domain using a global external Application Load Balancer](https://cloud.google.com/run/docs/mapping-custom-domains#https-load-balancer){: target="_blank"}.
-  Optionally, restrict access to your service; see [Restrict public access to your service](#access).
-  Optionally, increase the number of Docker service container instances. See [Increase the services container replication](#replication) for procedures.
-  Optionally, add a caching layer to improve performance. We have provided specific procedures to set up a Redis Memorystore in [Improve database performance](#redis).
-  Optionally, add [Google Analytics](https://marketingplatform.google.com/about/analytics/){: target="_blank"} to track your website's usage. Procedures for configuring Google Analytics support are in [Add Google Analytics tracking](#analytics).

## Restrict public access to your service {#access}

By default when you create a new Cloud Run service, it is set up with global public access. If you wish to restrict access to only authenticated and authorized users, you can do so by making the service [private](https://cloud.google.com/run/docs/configuring/custom-audiences){: target="_blank"}) and requring access tokens from your users. To set your instance to private:

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>Terraform CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
        <li>Go to <a href="https://console.cloud.google.com/run/" target="_blank">https://console.cloud.google.com/run/</a> for your project.</li>
        <li>Under the <b>Services</b> tab, select the desired service, and select the <b>Security tab</b>.</li>
        <li>Enable <b>Require authentication</b>.</li>
        <li>Click <b>Deploy</b> to redeploy the service. </li>
        </ol>
      </div>
    <div>
    <ol>
      <li>Create a <a href="deploy_cloud.md#multiple" target="_blank">production Terraform configuration file and Terraform workspace</a>, if you haven't already done so.</li>
      <li>Edit the file to add the following line:
      <pre>make_dc_web_service_public = false</pre></li>
      <li>From the <code>modules</code> directory, switch to the production workspace:
<pre>
terraform workspace select <var>WORKSPACE_NAME</var></pre></li>
<li>Run the deployment:
<pre>
terraform plan -var-file=<var>FILE_NAME</var>
terraform apply -var-file=<var>FILE_NAME</var></pre></li>
      </ol>
   </div>
  </div>
</div>

Follow additional procedures in [Authenticate users](https://cloud.google.com/run/docs/authenticating/end-users){: target="_blank"} to complete your setup.

## Increase replication of the services container {#replication}

Google Cloud Run services use [auto-scaling](https://cloud.google.com/run/docs/about-instance-autoscaling){: target="_blank"}, which means that the number of instances of your services container is increased or decreased according to the traffic the service is receiving. By default, the Terraform scripts set the minimum and maximum number of instances to 1. For production traffic, we suggest increasing the maximum to at least 3. (We recommend keeping the default minimum instances setting of 1, to avoid delays when new revisions are deployed.)

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>Terraform CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
        <li>Go to <a href="https://console.cloud.google.com/run/" target="_blank">https://console.cloud.google.com/run/</a> for your project.</li>
        <li>Under the <b>Services</b> tab, select the desired service, and click <b>Edit & deploy new revision</b>.</li>
        <li>Scroll to <b>Revision scaling</b>.</li>
        <li>Set the <b>Maximum number of service instances</b> to 3.</li>
        <li>Click <b>Deploy</b> to redeploy the service. </li>
        </ol>
      </div>
    <div>
    <ol>
      <li>Create a <a href="deploy_cloud.md#multiple" target="_blank">production Terraform configuration file and Terraform workspace</a>, if you haven't already done so.</li>
      <li>Edit the file to add the following line:
      <pre>dc_web_service_max_instance_count = 3</pre></li>
      <li>From the <code>modules</code> directory, switch to the production workspace:
<pre>
terraform workspace select <var>WORKSPACE_NAME</var></pre></li>
<li>Run the deployment:
<pre>
terraform plan -var-file=<var>FILE_NAME</var>
terraform apply -var-file=<var>FILE_NAME</var></pre></li>
      </ol>
   </div>
  </div>
</div>

## Improve database performance {#redis}

We recommend that you use a caching layer to improve the performance of your database. We recommend [Google Cloud Redis Memorystore](https://cloud.google.com/memorystore){: target="_blank"}, a fully managed solution, which will boost the performance of both natural-language searches and regular database lookups in your site. Redis Memorystore runs as a standalone instance in a Google-managed virtual private cloud (VPC), and connects to your VPC network ("default" or otherwise) via [direct peering](https://cloud.google.com/vpc/docs/vpc-peering){: target="_blank"}. Your Cloud Run service connects to the instance using a [VPC connector](https://cloud.google.com/vpc/docs/serverless-vpc-access){: target="_blank"}.

The Terraform scripts provide default settings for all required services. We strongly recommend using Terraform to set these up, to save a lot of time and effort.

To configure caching using Terraform:

1. Create a [production Terraform configuration file and Terraform workspace](deploy_cloud.md#multiple), if you haven't already done so.
1. Edit the file to add the following:
    ```
    enable_redis = true
    ```
1. Optionally, override any of the default values for the VPC network and Redis instance in `variables.tf` by adding the variables to your file with the desired values.
1. From the `modules` ddirectory, switch to the production workspace:
   <pre>terraform workspace select <var>WORKSPACE_NAME</var></pre>
1. Run the deployment:
   <pre>terraform plan -var-file=<var>FILE_NAME</var>
   terraform apply -var-file=<var>FILE_NAME</var></pre>
  It will take several minutes to create the Redis instance.

### Verify caching

To verify that traffic is hitting the cache:

1. Run some queries against your running Cloud Run service. 
1. Go to <https://console.cloud.google.com/memorystore/redis/instances>{: target="_blank"} for your project.
1. Select the Redis instance that has just been created.
1. Under **Instance Functions**, click **Monitoring**.
1. Scroll to the **Cache Hit Ratio** graph. You should see a significant percentage of your traffic hitting the cache.

## Add Google Analytics reporting {#analytics}

Google Analytics provides detailed reports on user engagement with your site. In addition, Data Commons provides a number of custom parameters you can use to report on specific attributes of a Data Commons site such as, search queries, specific page views, etc.

### One-time setup: Enable Analytics tracking

If you don't already have a Google Analytics account, create one, following the procedures in [Set up Analytics for a website and/or app](https://support.google.com/analytics/answer/9304153){: target="_blank"}. Record the Analytics tag ID assigned to your account.

Enable tracking for your service:

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Cloud Console</li>
    <li>Terraform CLI</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
           <ol>
       <li>Go to <a href="https://console.cloud.google.com/run/" target="_blank">https://console.cloud.google.com/run/</a> for your project.</li>
        <li>Under the <b>Services</b> tab, select the desired service, and click <b>Edit & deploy new revision</b>.</li>
        <li>Expand <b>Variables and secrets</b> and click <b>Add new variable</b>.</li>
        <li>Add the name <code>GOOGLE_ANALYTICS_TAG_ID</code> and in the <b>value</b> field, type in your tag ID.</li>
        <li>Click <b>Deploy</b> to redeploy the service. </li>
        </ol>
      </div>
    <div>
    <ol>
      <li>Create a <a href="deploy_cloud.md#multiple" target="_blank">production Terraform configuration file and Terraform workspace</a>, if you haven't already done so.</li>
      <li>Edit the file to add the following line:
      <pre>google_analytics_tag_id = "<var>ANALYTICS_TAG_ID</var>"</pre></li>
      <li>From the <code>modules</code> directory, switch to the production workspace:
<pre>
terraform workspace select <var>WORKSPACE_NAME</var></pre></li>
<li>Run the deployment:
<pre>
terraform plan -var-file=<var>FILE_NAME</var>
terraform apply -var-file=<var>FILE_NAME</var></pre></li>
      </ol>
   </div>
  </div>
</div>

Data collection will take a day or two to start and begin showing up in your reports.

<script src="/assets/js/customdc-doc-tabs.js"></script>

### Report on custom dimensions {#custom-dimensions}

Data Commons exports many Google Analytics [custom events](https://support.google.com/analytics/answer/12229021){: target="_blank"} and [parameters](https://support.google.com/analytics/answer/13675006){: target="_blank"}, to allow Data Commons-specific features to be logged, such as search queries, specific page views, etc. You can use these to create custom reports and explorations. The full set is defined in [`website/static/js/shared/ga_events.ts`](https://github.com/datacommonsorg/website/blob/7f896a982e8567cd96a0d8b01d1cd5eaaf285974/static/js/shared/ga_events.ts){: target="blank"}. Before you can get reports on them, you need to create [custom dimensions](https://support.google.com/analytics/answer/14240153){: target="blank"} from them.  

To create a custom dimension for a Data Commons custom event:

1. In the [Google Analytics dashboard](https://analytics.google.com/analytics/web/){: target="blank"} for your account, go to the **Admin** page.
1. Select **Data display** > **Custom definitions**.
1. Click **Create custom dimension**. 
1. Keep the **Scope** as **Event** and click the **Event parameter** > **Select event parameter** drop-down to see the list of custom event parameters.

    ![Custom parameters](/assets/images/custom_dc/analytics1.png){: width="400"}

1. Select the parameter you need, for example, **query**.
1. Add a dimension name and description. These can be anything you want but the name should be meaningful as it will show up in reports; for example, `Search query`.
1. When done, click **Save**.
1. Select **Data display** > **Events** and you should see a number of new custom events that have been added to your account.

To create a report based on a custom event:

1. In the [Google Analytics dashboard](https://analytics.google.com/analytics/web/){: target="blank"} for your account, go to the **Explore** page and select **Blank - create a new exploration**.
1. Select **Variables** > **Dimensions** > **+** to open the **Select dimensions** window.
1. Select the **Custom**, select the dimension you want, for example, **Search query**, and click **Import**.

    ![Custom parameters](/assets/images/custom_dc/analytics2.png){: width="400"}

1. Select **Variables** > **Metrics** > **+** to open the **Select metrics** window.
1. Select the relevant metric you want, such as users, sessions, or views, etc. and click **Import**.
1. Select **Settings** > **Rows** > **Drop or select dimension** and from the drop-down menu, select the dimension you want, such as **Search query**.
1. Select **Settings** > **Values** > **Drop or select metric** and from the drop-down menu, select the metric of interest, such as users, sessions, views, etc.
1. Edit any other settings you like and name the report. For the first 48 hours you will see **(not set)** for the first row. Afterwards, rows will be populated with real values.

![Custom exploration](/assets/images/custom_dc/analytics3.png){: width="400"}





