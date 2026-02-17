---
layout: default
title: Launch your Data Commons
nav_order: 10
parent: Build your own Data Commons
---

{: .no_toc}

# Launch your Data Commons

- TOC
  {: toc}

## Overview

When you are ready to launch your site to external traffic, there are many tasks you will need to perform, including:

- Configure your Cloud Run Service to serve external traffic, over SSL. Follow the procedures in [Serve traffic from your service](#serve).
- Optionally, configure [Google Cloud Armor](https://cloud.google.com/security/products/armor){: track="\_blank"} to detect and block unwanted traffic. This is recommended for large services. Follow the procedures in [Detect and prevent bot traffic](#bot).
- Optionally, restrict access to your service; see [Restrict public access to your service](#access).
- Optionally, increase the number of Docker service container instances. See [Increase the services container replication](#replication) for procedures.
- Optionally, add a caching layer to improve performance. This is recommended for all production Data Commons instances. We have provided specific procedures to set up a Redis Memorystore in [Improve database performance](#redis).
- Optionally, boost Cloud SQL instance resources if needed. See [Boost SQL resources](#boost-sql)
- Optionally, add [Google Analytics](https://marketingplatform.google.com/about/analytics/){: target="\_blank"} to track your website's usage. Procedures for configuring Google Analytics support are in [Add Google Analytics tracking](#analytics).

Throughout these procedures, we recommend using Terraform to create a production deployment.

> **Note:** If you make future updates to this deployment, we recommend always using Terraform to do so. If you use the Cloud Console or gcloud to make updates and try to run Terraform again, it will override any changes you have made outside of Terraform. For options that are available as variables in the Data Commons `variables.tf`, you must sync your production `terraform.tfvars` options to the same values you have set outside Terraform before running Terraform commands again. If you use the Cloud Console or gcloud to configure options that are not available as Data Commons variables, you _must not_ run Terraform again.

{: #serve}

## Serve traffic from your service

For Cloud Run services, you use a global external load balancer, even if you're only running in a single region. Follow the procedures in [Set up a global external Application Load Balancer](https://docs.cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless){: target="\_blank"} as follows:

1. [Reserve an external IP address](https://docs.cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless#ip-address).
1. [Create SSL certificates](https://docs.cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless#ssl_certificate_resource).
1. [Add the load balancer](https://docs.cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless#creating_the_load_balancer).
1. [Add or modify DNS records](https://docs.cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless#update_dns) to map your domain name to the new IP address.

{: #bot}

## Detect and prevent bot traffic with Google Cloud Armor

Once your website reaches wide adoption, it will likely be hit by unwanted bot traffic. This can cause major spikes in your resource usage. If your project is sensitive to sudden increases in resource charges, you should set up Google Cloud Armor, with Adaptive Protection, before such attacks happen.

> **Tip:** If you are unsure about whether you will need Cloud Armor, you can use [Google Analytics](#analytics) to easily monitor and notify you of traffic anomalies. (This is a free service.) To configure these notifications, you create "custom insights". There are several predefined, "recommended" insights related to traffic spikes, which you only need to enable. See the [Analytics Insights page](https://support.google.com/analytics/answer/9443595){: target="\_blank"} for procedures.

With Cloud Armor, you can choose from two tiers:

- Enterprise: This is a paid subscription (see [Cloud Armor Pricing](https://cloud.google.com/armor/pricing){: target="\_blank"} for details) that includes all charges for resource usage. We highly recommend the "Paygo" option, as the Adaptive Protection feature provides out-of-the-box, automatic anomaly detection and prevention with minimal setup.
- Standard: This service has no subscription fee, but does charge for resource usage. However, the Adaptive Protection service will only detect and alert you about anomalies without further action or information. You are responsible for defining and applying policy rules to block undesired traffic.

Both options allow you to block by IP address range or other "advanced" attributes, and provide a set of actions you can choose for dealing with unwanted traffic: deny, rate-limit, redirect and display a captcha, etc.

For more details comparing the two options, see the [Cloud Armor Enterprise Overview](https://docs.cloud.google.com/armor/docs/armor-enterprise-overview){: target="\_blank"}. If you decide to subscribe to Enterprise, see [Use Cloud Armor Enterprise](https://docs.cloud.google.com/armor/docs/armor-enterprise-using){: target="\_blank"} for instructions on enrolling.

**Recommended workflows**

If you subscribe to the Enterprise tier, use the following workflow:

1. Create a [security policy and enable Adaptive Protection](#create).
1. Allow several hours for Adaptive Protection to get trained to recognize anomalies according to your traffic patterns. If an attack is detected, a detailed alert will appear on the **Adaptive Protection** dashboard, including the source of the traffic, and suggested rules for handling.
1. Update your policy to [enable Auto Deploy](#autodeploy) and create a rule that defines the action to be taken automatically when an attack is detected.
1. Optionally, [create additional manual IP-based rules](#block).

If you only use the Standard tier, use the following workflow:

1. Create a [security policy and enable Adaptive Protection](#create).
1. Allow several hours for Adaptive Protection to get trained to recognize anomalies according to your traffic patterns. If an attack is detected, a basic alert will appear on the **Adaptive Protection** dashboard.
1. Use Google Analytics Insights to get some high-level information on the origin of the spiky traffic, such as country, surface, etc. Then use the Cloud Run [Logs Analytics](https://docs.cloud.google.com/logging/docs/analyze/query-and-view){: target="\_blank"} facility to analyze the logs for the time in which the attack occurred. Continue to analyze the logs until you identify the IP addresses from which the unwanted traffic originated.
1. [Create manual IP-based rules](#block).

{: #create}
### Create a Cloud Armor security policy

Regardless of which Cloud Armor tier you choose, you must set up a Cloud Armor security policy. To start, you set up a basic policy that simply allows all traffic.

> Tip: There is an unofficial wizard tool that guides you through the process of configuring a security policy: <https://cabuilder.cloudnetdemo.com/>{: target="\_blank"}. It also generates Terraform output that you can add to your Terraform scripts. However, it may not be completely up to date with features available in the Cloud Console or gcloud CLI, and cannot be used to update an existing policy. So use with caution.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
    <div class="active">
      <ol>
        <li>Go to the <a href="https://console.cloud.google.com/net-security/securitypolicies/list" target="_blank">https://console.cloud.google.com/net-security/securitypolicies/list</a> page for your project.</li>
        <li>Click <b>Create policy</b>.</li>
        <li>Under <b>Configure policy</b>, add a name for the policy and optionally a description.</li>
        <li>Change the <b>Default rule action</b> to <b>Allow</b>.</li>
        <li>Keep all the other default settings.</li>
        <li>Click <b>Apply to targets</b>.</li>
        <li>From the <b>Backend service</b> drop-down, select the backend service you created when you created the <a href="#serve">load balancer</a>.</li>
        <li>Under <b>Advanced configurations</b>, select <b>Enable Adaptive Protection</b>.</li>
        <li>Click <b>Done</b>.</li>
        <li>Click <b>Create policy</b>. It may take a few minutes to complete. When it is created, your new policy will be listed in the <b>Cloud Armor policies</b> page.</li>
      </ol>
    </div>
  <div>
      <ol>
        <li>Create the policy and enable Adaptive Protection:
        <pre>gcloud compute security-policies create <var>POLICY_NAME</var> \
        --type CLOUD_ARMOR --description "<var>DESCRIPTION</var>" \
        --enable-layer7-ddos-defense</pre></li>
        <li>Apply the policy to the backend you created when you created the <a href="#serve">load balancer</a>:
        <pre>gcloud compute backend-services update <var>BACKEND_NAME</var> \
        --security-policy <var>POLICY_NAME</var></pre></li>
         <li>Set the default rule to allow all traffic:
         <pre>gcloud compute security-policies rules create 2,147,483,647 \ 
         --security-policy <var>POLICY_NAME</var> --description "Default rule" \
         --expression "*" --action allow</pre>
          </li>
        </ol>
   </div>
  </div>
</div>

### Add blocking rules to your policy

If you are subscribed to the Enterprise tier, you can simply add a default action for how you want "attacks" detected by Adaptive Protection to be handled. You don't need to define any conditions that trigger the handling; you can simply [enable the Auto Deploy feature](#autodeploy), and Cloud Armor will take care of the rest. You can also create additional rules as needed.

If you are not subscribed to Enterprise, you will need to use your Cloud Run's Service [Logs Analytics](https://docs.cloud.google.com/logging/docs/analyze/query-and-view){: target="\_blank"} to find the source of the unwanted traffic, and then configure a rule in your Cloud Armor security policy. We recommend that you use the simplest approach, which is to determine the IP addresses or ranges that are sending the traffic and define a rule to [block traffic from these addresses](#block).

For handling bot traffic, we recommend that you use a "rate-based ban" as the action to be taken when a rule is triggered. There are two important rule-triggering criteria, which can be somewhat confusing, so we explain them here:

- The _threshold_ setting: This defines a threshold beyond which requests from a given client that exceed the threshold are blocked. For example, let's say you define the threshold to be 1000 requests over a 1-minute period. If a client sends 2500 requests, that client will be limited to 1000 for the configured ban duration. You can use this setting to maintain your traffic at a predefined level.
- The _ban threshold_ setting: This defines a threshold beyond which _all_ requests from a given client are blocked. For example, let's say you define the threshold to be 2500 requests over a 2-minute period. If a client sends 3000 requests during that period, all requests from that client will be blocked for the configured ban duration. You can use this setting to minimize your resource usage.

You can use either or both settings. The values you set should be based on your expected traffic levels and resource capacity. See [Banning clients based on request rates](https://docs.cloud.google.com/armor/docs/rate-limiting-overview#ban-clients){: target="\_blank"} for more information.

{: #autodeploy}

#### Enable Auto-Deploy for Adaptive Protection (Enterprise only)

The following defines a rule for handling traffic when Adaptive Protection detects an attack, and configures the rule to be applied automatically to mitigate the attack.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
    <div class="active">
    First, enable Auto-Deploy and add a default threshold configuration:
      <ol>
        <li>Go to the <a href="https://console.cloud.google.com/net-security/securitypolicies/list" target="_blank">https://console.cloud.google.com/net-security/securitypolicies/list</a> page for your project.</li>
        <li>In the <b>Policy details</b> page, click <b>Edit</b>.</li>
        <li>Expand the <b>Adaptive Protection configuration</b> section.</li>
        <li>Click <b>Add a threshold configuration</b>.</li>
        <li>For now, keep all the default settings and give the configuration a name.</li>
        <li>Click <b>Update</b>. It will take a few minutes to update.</li>
      </ol>
    Now, add a rule for the action Adaptive Protection should take when it determines that an "attack" has occurred:
      <ol>
        <li>In the <b>Policy details</b> page, click <b>Add rule</b>.</li>
        <li>Add a description of the rule.</li>
        <li>Enable <b>Advanced mode</b>.</li>
        <li>In the <b>Match</b> field, enter <code>evaluateAdaptiveProtectionAutoDeploy()</code>. This means that Adaptive Protection will define the sources to be blocked, based on IP addresses, HTTP headers, or other attributes of the traffic.</li>
        <li>From the <b>Action</b> drop-down, select <b>Rate based ban</b>.</li>
        <li>In the <b>Threshold setting</b> section, specify the request rate and time interval at which the rule is triggered. Any client that sends more requests in the time period will be limited to the threshold you set for the duration of the ban interval.</li>
        <li>Set <b>Enforce on key configuration</b> to <b>IP</b>.</li>
        <li>Keep the default action of <b>Deny (429)</b>.</li>
        <li>Optionally, under <b>Exceed configuration</b>, specify the request rate and time interval at which offending IP addresses should be blocked. Any client that sends more requests in the time period will be prevented from sending any requests for the duration of the ban interval.</li>
        <li>In the <b>Priority</b> field, enter a value lower than 2,147,483,647.</li>
        <li>Click <b>Create policy</b>. It may take a few minutes to complete. When it is created, your new policy will be listed in the <b>Cloud Armor policies</b> page.</li>
      </ol>
    </div>
    <div>
      <ol>
        <li>Enable Auto-Deploy and add a default threshold configuation:
        <pre>gcloud compute security-policies add-layer7-ddos-defense-threshold-config <var>POLICY_NAME</var> \ 
        --threshold-config-name=<var>CONFIGURATION_NAME</var>
        </pre>
        </li>
        <li>Add a rule for the action Adaptive Protection should take when it determines that an "attack" has occurred:
        <pre>gcloud compute security-policies rules create <var>PRIORITY</var> \
        --security-policy <var>POLICY_NAME</var> \
        --expression "evaluateAdaptiveProtectionAutoDeploy()" \
        --action rate-based-ban \
        --rate-limit-threshold-count=<var>RATE_LIMIT_THRESHOLD_COUNT</var> \
        --rate-limit-threshold-interval-sec=<var>RATE_LIMIT_THRESHOLD_INTERVAL_SEC</var> \
        --ban-duration-sec=<var>BAN_DURATION_SEC</var> \
        --ban-threshold-count=<var>BAN_THRESHOLD_COUNT</var> \
        --ban-threshold-interval-sec=<var>BAN_THRESHOLD_INTERVAL_SEC</var> \
        --exceed-action deny-429 \
        --enforce-on-key ip
        </pre>
        </li>
      <ul>
        <li>Set the priority to a value lower than 2,147,483,647.</li>
        <li>Set the rate limit threshold count and interval to define the condition which triggers the rule. Any client that sends more requests in the time period will be limited to the threshold you set for the ban duration.</li>
        <li>Set the ban threshold count and interval to define the condition that bans traffic from offending clients. Any client that sends more requests in the time period will be prevented from sending any requests for the ban duration.</li>
        <li>Set the ban duration to the desired length of the ban.</li>
      </ul>
      </ol>
   </div>
  </div>
</div>

{: #block}

#### Create a simple IP address-based rate-limiting rule

Before creating a rate-limiting rule, you will need to do some monitoring to determine the clients that are sending unwanted traffic. When you receive an alert, note the date and time at which the attack was detected, or check the [Adaptive Protection dashboard](https://docs.cloud.google.com/armor/docs/adaptive-protection-overview){: target="\_blank"}. Then, use Cloud [Log Analytics](https://docs.cloud.google.com/logging/docs/log-analytics){: target="\_blank"} to help diagnose the source of the traffic. We recommend that you try to find the IP addresses that are sending the traffic, and block by IP. Once you have determined a set or range of IP addresses, set up a rule as follows.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
  <li class="active">Cloud Console</li>
  <li>gcloud CLI</li>
  </ul>
  <div class="gcp-tab-content">
  <div class="active">
   <ol>
      <li>Go to the <a href="https://console.cloud.google.com/net-security/securitypolicies/list" target="_blank">https://console.cloud.google.com/net-security/securitypolicies/list</a> page for your project.</li>
      <li>Click the link for the policy you created above.</li>
      <li>In the <b>Policy details</b> page, click <b>Add rule</b>.</li>
      <li>Add a description of the rule.</li>
      <li>In the <b>Match</b> field, enter the range or list of IP addresses.</li>
      <li>From the <b>Action</b> drop-down, select <b>Rate based ban</b>.</li>
      <li>In the <b>Threshold setting</b> section, specify the request rate and time interval at which the rule is triggered. Any client that sends more requests in the time period will be limited to the threshold you set for the duration of the ban interval.</li>
      <li>Set <b>Enforce on key configuration</b> to <b>IP</b>.</li>
      <li>Keep the default action of <b>Deny (429)</b>.</li>
      <li>Optionally, under <b>Exceed configuration</b>, specify the request rate and time interval at which offending IP addresses should be blocked. Any client that sends more requests in the time period will be prevented from sending any requests for the duration of the ban interval.</li>
      <li>In the <b>Priority</b> field, enter a value lower than 2,147,483,647.</li>
      <li>Click <b>Create policy</b>. It may take a few minutes to complete. When it is created, your new policy will be listed in the <b>Cloud Armor policies</b> page.</li>
    </ol>
    </div>
    <div>
      <pre>gcloud compute security-policies rules create <var>PRIORITY</var> \
      --security-policy <var>POLICY_NAME</var> \
      --action rate-based-ban \
      --rate-limit-threshold-count=<var>RATE_LIMIT_THRESHOLD_COUNT</var> \
      --rate-limit-threshold-interval-sec=<var>RATE_LIMIT_THRESHOLD_INTERVAL_SEC</var> \
      --ban-duration-sec=<var>BAN_DURATION_SEC</var> \
      --ban-threshold-count=<var>BAN_THRESHOLD_COUNT</var> \
      --ban-threshold-interval-sec=<var>BAN_THRESHOLD_INTERVAL_SEC</var> \
      --exceed-action deny-429 \
      --enforce-on-key ip
      </pre>
    <ul>
      <li>Set the priority to a value lower than 2,147,483,647.</li>
      <li>Set the rate limit threshold count and interval to define the condition which triggers the rule. Any client that sends more requests in the time period will be limited to the threshold you set for the ban duration.</li>
      <li>Set the ban threshold count and interval to define the condition that bans traffic from offending clients. Any client that sends more requests in the time period will be prevented from sending any requests for the ban duration.</li>
      <li>Set the ban duration to the desired length of the ban.</li>
    </ul>
   </div>
  </div>
</div>

## Restrict public access to your service {#access}

By default when you create a new Cloud Run service, it is set up with global public access. If you wish to restrict access to only authenticated and authorized users, you can do so by making the service [private](https://cloud.google.com/run/docs/configuring/custom-audiences){: target="\_blank"} and requring access tokens from your users. To set your instance to private:

1. Create a [production Terraform configuration file and Terraform workspace](deploy_cloud.md#multiple), if you haven't already done so.
1. Edit the file to add the following line:
   ```
   make_dc_web_service_public = false
   ```
1. Switch to the production workspace and [run the Terraform deployment](deploy_cloud.md#multiple) as usual.

Follow additional procedures in [Authenticate users](https://cloud.google.com/run/docs/authenticating/end-users){: target="\_blank"} to complete your setup.

## Increase replication of the services container {#replication}

Google Cloud Run services use [auto-scaling](https://cloud.google.com/run/docs/about-instance-autoscaling){: target="\_blank"}, which means that the number of instances of your services container is increased or decreased according to the traffic the service is receiving. By default, the Terraform scripts set the minimum and maximum number of instances to 1. For production traffic, we suggest increasing the maximum to at least 3. (We recommend keeping the default minimum instances setting of 1, to avoid delays when new revisions are deployed.)

1. Create a [production Terraform configuration file and Terraform workspace](deploy_cloud.md#multiple), if you haven't already done so.
1. Edit the file to add the following line:
   ```
   dc_web_service_max_instance_count = 3
   ```
1. Switch to the production workspace and [run the Terraform deployment](deploy_cloud.md#multiple) as usual.

## Improve database performance {#redis}

### Use a caching layer

We recommend that you use a caching layer to improve the performance of your database. We recommend [Google Cloud Redis Memorystore](https://cloud.google.com/memorystore){: target="\_blank"}, a fully managed solution, which will boost the performance of both natural-language searches and regular database lookups in your site. Redis Memorystore runs as a standalone instance in a Google-managed virtual private cloud (VPC), and connects to your VPC network ("default" or otherwise) via [direct peering](https://cloud.google.com/vpc/docs/vpc-peering){: target="\_blank"}. Your Cloud Run service and job connect to the instance using a [Direct VPC egress](https://cloud.google.com/run/docs/configuring/vpc-direct-vpc){: target="\_blank"}.

The Terraform scripts set up a single Redis instance called <code><var>NAMESPACE</var>-datacommons-redis-instance</code>.

To configure caching using Terraform:

1. Create a [production Terraform configuration file and Terraform workspace](deploy_cloud.md#multiple), if you haven't already done so.
1. Edit the file to add the following:
   ```
   enable_redis = true
   ```
1. Switch to the production workspace and [run the Terraform deployment](deploy_cloud.md#multiple) as usual.

It will take several minutes to create the Redis instance. To verify that queries are hitting the cache, see below.

{: .no_toc}

#### Verify caching

To verify that traffic is hitting the cache:

1. Run some queries against your running Cloud Run service.
1. Go to <https://console.cloud.google.com/memorystore/redis/instances>{: target="\_blank"} for your project.
1. Select the Redis instance that has just been created.
1. Under **Instance Functions**, click **Monitoring**.
1. Scroll to the **Cache Hit Ratio** graph. You should see a significant percentage of your traffic hitting the cache.

{: .no_toc}

#### Clearing the cache after data load

When the `REDIS_HOST` (and optionally `REDIS_PORT`) variables are configured for the data management job, the Redis instance is flushed any time data is reloaded. The Terraform scripts configure this for you, so there is no need to manually clear the cache after reloading data.

{: .no_toc}

#### Boost Redis resources

By default, the Terraform scripts configure the Redis instance with the following characteristics:

- 2 GiB memory reservation
- "Standard high-availability" tier, without read replicas

If you encounter performance problems after launch, there are a few Redis parameters you can adjust. In particular, if needed, we suggest increasing the memory allocation.

1. Go to <https://console.cloud.google.com/memorystore/redis/instances>{: target="\_blank"} for your project and select your Redis instance.
1. Go to **Overview** > **Monitoring** and from the **Chart** menu, select **Memory usage/Max memory graph**.
1. If you notice that memory usage is approaching the max memory, add the following variable in your production `.tfvars` file, with this recommended value:

```
redis_memory_size_gb = 4
```

1. [Run the Terraform deployment](deploy_cloud.md#multiple) as usual.

You may also want to enable read-only replication; you can set `redis_replica_count = 3` if needed.

### Boost SQL resources {#boost-sql}

By default, the Terraform scripts configure the MySQL instance with the following characteristics:

- 2 CPUs
- 20 GB SSD storage
- 7680 MB memory

If you are still noticing slow performance after adding a caching layer, you may need to increase resource reservations. In particular, if your storage is filling up, you will need to add more storage quota.

1. Go to <https://console.cloud.google.com/sql/instances>{: target="\_blank"} for your project and select your MySQL instance.
1. Go to **Overview** > **Monitoring** and from the **Chart** menu, and select **Storage Usage**.
1. If you notice that storage using is approaching quota, set the following variable in your production `.tfvars` file:

```
mysql_storage_size_gb
```

1. Set a value that fits your database size.
1. [Run the Terraform deployment](deploy_cloud.md#multiple) as usual.

You may also use the following variables to increase memory and CPU reservations if needed. You must set them together to align with the Cloud SQL Enterprise edition machine type constraints; for details, see the section **Machine types for Cloud SQL Enterprise edition instances** in <https://cloud.google.com/sql/docs/mysql/instance-settings>{: target="\_blank"}.

```
mysql_memory_size_mb
mysql_cpu_count
```

For example, this is legal because it aligns with the "db-n1-standard-4" machine type:

```
mysql_cpu_count = 4
mysql_memory_size_mb = 15360
```

But this is not legal because it does not align with any machine type:

```
mysql_cpu_count = 2
mysql_memory_size_mb = 15360
```

## Add Google Analytics reporting {#analytics}

Google Analytics provides detailed reports on user engagement with your site. In addition, Data Commons provides a number of custom parameters you can use to report on specific attributes of a Data Commons site such as, search queries, specific page views, etc.

### Enable Analytics tracking

If you don't already have a Google Analytics account, create one, following the procedures in [Set up Analytics for a website and/or app](https://support.google.com/analytics/answer/9304153){: target="\_blank"}. Record the Analytics tag ID assigned to your account.

Enable tracking:

1. Create a [production Terraform configuration file and Terraform workspace](deploy_cloud.md#multiple), if you haven't already done so.
1. Edit the file to add the following line:
   <pre>google_analytics_tag_id = "<var>ANALYTICS_TAG_ID</var>"</pre>
1. Switch to the production workspace and [run the Terraform deployment](deploy_cloud.md#multiple) as usual.

Data collection will take a day or two to start and begin showing up in your reports.

<script src="/assets/js/customdc-doc-tabs.js"></script>

### Report on custom dimensions {#custom-dimensions}

Data Commons exports many Google Analytics [custom events](https://support.google.com/analytics/answer/12229021){: target="\_blank"} and [parameters](https://support.google.com/analytics/answer/13675006){: target="\_blank"}, to allow Data Commons-specific features to be logged, such as search queries, specific page views, etc. You can use these to create custom reports and explorations. The full set is defined in [`website/static/js/shared/ga_events.ts`](https://github.com/datacommonsorg/website/blob/7f896a982e8567cd96a0d8b01d1cd5eaaf285974/static/js/shared/ga_events.ts){: target="blank"}. Before you can get reports on them, you need to create [custom dimensions](https://support.google.com/analytics/answer/14240153){: target="blank"} from them.

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
