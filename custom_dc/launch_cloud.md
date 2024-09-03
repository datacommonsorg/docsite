---
layout: default
title: Launch your Data Commons
nav_order: 8
parent: Build your own Data Commons
---

{:.no_toc}
# Launch your Data Commons

* TOC
{:toc}

## Overview

When you are ready to launch your site to external traffic, there are many tasks you will need to perform, including:

-  Configure your Cloud Service to serve external traffic, over SSL. GCP offers many options for this; see [Mapping a domain using a global external Application Load Balancer](https://cloud.google.com/run/docs/mapping-custom-domains#https-load-balancer){: target="_blank"}.
-  Optionally, restrict access to your service; see [Custom audiences (services)](https://cloud.google.com/run/docs/configuring/custom-audiences){: target="_blank"}.
-  Optionally, add a caching layer to improve performance. We have provided specific procedures to set up a Redis Memorystore in [Improve database performance](#redis).
-  Optionally, add [Google Analytics](https://marketingplatform.google.com/about/analytics/){: target="_blank"} to track your website's usage. Procedures for configuring Google Analytics support are in [Add Google Analytics tracking](#analytics).

## Improve database performance {#redis}

We recommend that you use a caching layer to improve the performance of your database. We recommend [Google Cloud Redis Memorystore](https://cloud.google.com/memorystore){: target="_blank"}, a fully managed solution, which will boost the performance of both natural-language searches and regular database lookups in your site. Redis Memorystore runs as a standalone instance in a Google-managed virtual private cloud (VPC), and connects to your VPC network ("default" or otherwise) via [direct peering](https://cloud.google.com/vpc/docs/vpc-peering){: target="_blank"}. Your Cloud Run service connects to the instance using a [VPC connector](https://cloud.google.com/vpc/docs/serverless-vpc-access){: target="_blank"}.
We recommend that you use a caching layer to improve the performance of your database. We recommend [Google Cloud Redis Memorystore](https://cloud.google.com/memorystore){: target="_blank"}, a fully managed solution, which will boost the performance of both natural-language searches and regular database lookups in your site. Redis Memorystore runs as a standalone instance in a Google-managed virtual private cloud (VPC), and connects to your VPC network ("default" or otherwise) via [direct peering](https://cloud.google.com/vpc/docs/vpc-peering){: target="_blank"}. Your Cloud Run service connects to the instance using a [VPC connector](https://cloud.google.com/vpc/docs/serverless-vpc-access){: target="_blank"}.

In the following procedures, we show you how to create a Redis instance that connects to your project's "default" VPC network.

**Step 1: Create the Redis instance**

The following is a sample configuration that you can tune as needed. For additional information, see [Create and manage Redis instances](https://cloud.google.com/memorystore/docs/redis/create-manage-instances){: target="_blank"}.
The following is a sample configuration that you can tune as needed. For additional information, see [Create and manage Redis instances](https://cloud.google.com/memorystore/docs/redis/create-manage-instances){: target="_blank"}.

1. Go to [https://console.cloud.google.com/memorystore/redis/instances](https://console.cloud.google.com/memorystore/redis/instances){: target="_blank"} for your project.
1. Go to [https://console.cloud.google.com/memorystore/redis/instances](https://console.cloud.google.com/memorystore/redis/instances){: target="_blank"} for your project.
1. Select the **Redis** tab and click **Create Instance**.
1. If prompted to enable the Redis API server, accept.
1. Name your instance.
1. Under **Tier Selection**, select **Basic**.
1. Set the **Capacity** field to **2** GB.
1. Under **Region and zonal availability**, set the region to be the same as your Cloud SQL database.
1. Under **Set up connection > Network**, select **default** as the network. 
1. Click **Create**.

**Step 2: Set the environment variable**

1. When the Redis instance is created above, go to the **Instances > Redis** tab, look up your instance and note the **Primary Endpoint** IP address.
1. In `custom_dc/env.list`, set the value of the `REDIS_HOST` option to the IP address. 

**Step 3: Create the VPC connector**

1. Go to [https://console.cloud.google.com/networking/connectors/list](https://console.cloud.google.com/networking/connectors/list){: target="_blank"} for your instance.
1. Go to [https://console.cloud.google.com/networking/connectors/list](https://console.cloud.google.com/networking/connectors/list){: target="_blank"} for your instance.
1. If you are prompted to enable the VPC Access API, accept.
1. In the **Serverless VPC Access** screen, click **Create Connector**.
1. Name the connector.
1. Under **Region**, select the region you specified for Redis instance in the first step.
1. In the **Network** field, select **default**.
1. Under **Subnet**, select **Custom IP Range**.
1. In the **IP Range** field, enter a valid IP range; for example, `10.9.0.0`.
1. Click **Create**.

For additional information, see [Serverless VPC Access](https://cloud.google.com/vpc/docs/serverless-vpc-access){: target="_blank"}.
For additional information, see [Serverless VPC Access](https://cloud.google.com/vpc/docs/serverless-vpc-access){: target="_blank"}.

**Step 4: Configure your Cloud Run service to connect to the VPC**

1. In the Cloud Console, go to the Cloud Run service from which you are serving your app.
1. Click **Edit & Deploy New Revision**.
1. Click the Networking tab and enable **Connect to a VPC for outbound traffic**.
1. Enable **Use Serverless VPC Access connectors**.
1. From the **Network** field, select the connector you created in step 3.
1. Click **Deploy**.

**Step 5: Verify that everything is working**

To verify that your Cloud Run service is using the connector:

1. Go to the **Service details** page for your service
1. Click the **Networking** tab. Under **VPC**, you should see your connector listed.

To verify that traffic is hitting the cache:

1. Run some queries against your running Cloud Run service. 
1. In the Cloud Console, go to the Memorystore page and select Redis instance.
1. Under **Instance Functions**, click **Monitoring**.
1. Scroll to the **Cache Hit Ratio** graph. You should see a significant percentage of your traffic hitting the cache.

## Add Google Analytics reporting {#analytics}

Google Analytics provides detailed reports on user engagement with your site. In addition, Data Commons provides a number of custom parameters you can use to report on specific attributes of a Data Commons site such as, search queries, specific page views, etc.

### Enable Analytics tracking

1. If you don't already have a Google Analytics account, create one, following the procedures in [Set up Analytics for a website and/or app](https://support.google.com/analytics/answer/9304153){: target="_blank"}. Record the Analytics tag ID assigned to your account.
1. Go to the Cloud Console for your [Cloud Run service](https://console.cloud.google.com/run/), and click **Edit & deploy new revision**.
1. Expand **Variables and secrets* and click **Add new variable**.
1. Add the name `GOOGLE_ANALYTICS_TAG_ID` and in the value field, type in your tag ID.
1. Click **Deploy** to redeploy the service. Data collection will take a day or two to start and begin showing up in your reports.

### Report on custom dimensions

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








