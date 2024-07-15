---
layout: default
title: Launch a custom site
nav_order: 8
parent: Build your own Data Commons
---

{:.no_toc}
# Launch a custom site

* TOC
{:toc}

## Overview

When you are ready to launch your site to external traffic, there are many tasks you will need to perform, including:

-  Configure your Cloud Service to serve external traffic, over SSL. GCP offers many options for this; see [Mapping custom domains](https://cloud.google.com/run/docs/mapping-custom-domains).
-  Optionally, restrict access to your service; see [Custom audiences (services)](https://cloud.google.com/run/docs/configuring/custom-audiences).
-  Optionally, add a caching layer to improve performance. We have provided specific procedures to set up a Redis Memorystore in [Improve database performance](#redis).
<!---  Optionally, add [Google Analytics](https://marketingplatform.google.com/about/analytics/) to track your website's usage. -->

## Improve database performance {#redis}

We recommend that you use a caching layer to improve the performance of your database. We recommend [Google Cloud Redis Memorystore](https://cloud.google.com/memorystore), a fully managed solution, which will boost the performance of both natural-language searches and regular database lookups in your site. Redis Memorystore runs as a standalone instance in a Google-managed virtual private cloud (VPC), and connects to your VPC network ("default" or otherwise) via [direct peering](https://cloud.google.com/vpc/docs/vpc-peering). Your Cloud Run service connects to the instance using a [VPC connector](https://cloud.google.com/vpc/docs/serverless-vpc-access).

In the following procedures, we show you how to create a Redis instance that connects to your project's "default" VPC network.

**Step 1: Create the Redis instance**

The following is a sample configuration that you can tune as needed. For additional information, see [Create and manage Redis instances](https://cloud.google.com/memorystore/docs/redis/create-manage-instances).

1. Go to https://console.cloud.google.com/memorystore/redis/instances for your project.
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
1. In `custom_dc/cloudsql_env.list`, set the value of the `REDIS_HOST` option to the IP address. 

**Step 3: Create the VPC connector**

1. Go to https://console.cloud.google.com/networking/connectors/list for your instance.
1. If you are prompted to enable the VPC Access API, accept.
1. In the **Serverless VPC Access** screen, click **Create Connector**.
1. Name the connector.
1. Under **Region**, select the region you specified for Redis instance in the first step.
1. In the **Network** field, select **default**.
1. Under **Subnet**, select **Custom IP Range**.
1. In the **IP Range** field, enter a valid IP range; for example, `10.9.0.0`.
1. Click **Create**.

For additional information, see [Serverless VPC Access](https://cloud.google.com/vpc/docs/serverless-vpc-access).

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