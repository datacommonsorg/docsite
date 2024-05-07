---
layout: default
title: Overview
nav_order: 90
has_children: true
---

Data Commons is an open source platform. Any organization can create a custom Data Commons instance with its own data, customized user interface and visualization tools,

A custom instance natively combines the base Data Commons data (from datacommons.org) and the custom data in a unified fashion. Users can generate visualizations and perform data analyses across base and custom datasets seamlessly. 

A custom Data Commons site is deployed in Google Cloud Platform (GCP). The owner has full control over data, computing resources and access. The site can be accessible by the general public or can be controlled to limited principals. When base data is joined with the custom instance data, it is pulled in from the main Data Commons site; custom data is never pushed to the main site.

## Case studies

### Feeding America Data Commons

[Feeding America Data Commons](https://datacommons.feedingamerica.org/) provides access to data from [Map the Meal Gap](https://map.feedingamerica.org/), overlaid with data from a wide range of additional sources into a single portal under a common scheme. Combining datasets from the CDC and Map the Meal gap, the relationship between heart health and food insecurity can be retrieved with a few clicks.

![fa](/assets/images/custom_dc/home-heart-food.png){: height="450" }

### India Data Commons

[India Data Commons](https://datacommons.iitm.ac.in/) is an effort by Robert Bosch Center for Data Science and Artificial Intelligence, IIT Madras, to highlight India-specific data. India Data Commons features datasets published by Indian Ministries and governmental organizations and provides it through the Data Commons knowledge graph.

![iitm](/assets/images/custom_dc/iitm.png){: height="450" }

## Why use a custom Data Commons instance?

If you have the resources to develop and maintain a custom Data Commons instance, this is a good option for the following use cases:

-  You want to add your own data to Data Commons but want to maintain ownership of the Cloud data.
-  You want to add your own data to Data Commons but want to customize the UI of the site.
-  You want to host your data on your own website, using the Data Commons tools.
-  You want to add your own data to Data Commons, but restrict access to the site.

You may also wish to host all or part of your data on the main public Data Commons website as well. 

For the following use cases, a custom Data Commons instance is not necessary: 

-  You only want to make your own data available to the main public Data Commons site (at [datacommons.org](datacommons.org)). See instead the procedures on contributing your data to Data Commons. 
-  You want to make the base public data or visualizations available in your own site. For this purpose, you can call the Data Commons APIs from your site; see [Data Commons Web Components](https://docs.datacommons.org/api/web_components/) for more details.

## Supported features

A custom Data Commons instance supports the following features:

-  All of the same interactive tools as the main site, including the natural language query interface
-  REST APIs &emdash; with no additional setup
-  Python and Pandas API wrappers, and/or Spreadsheets &emdash; requires additional setup and maintenance. If you would like to support these facilities, please contact us.
-  Access controls to the site, using any supported Google Cloud Run mechanisms, such as Virtual Private Cloud, Cloud IAM, and so on. Please see the GCP [Restricting ingress for Cloud Run](https://cloud.google.com/run/docs/securing/ingress) for more information on these options.

The following are not supported:

-  Fine-grained data access controls; you cannot set access controls on specific data, only the entire custom site.
-  Bigquery APIs

## System overview

Essentially, a custom Data Commons instance is a mirror of the public Data Commons, that runs in a [Docker](http://docker.com) container hosted in the cloud. In the browsing tools, the custom data appears alongside the base data in the list of variables. When a query is sent to the custom website, the Mixer server fetches both the custom and base data to provide multiple visualizations. At a high level, here is a conceptual view of a custom Data Commons instance:

![setup1](/assets/images/custom_dc/customdc_setup1.png){: height="450" }

The custom Data Commons Docker container consists of the following components:

-  A [Nginx reverse proxy server](https://www.nginx.com/resources/glossary/reverse-proxy-server/), which routes incoming requests to the web or API server
-  A Python-Flask web server, which handles interactive requests from users
-  An Python-Flask NL server, for generating embeddings and serving natural language queries
-  A Go Mixer, also known as the API server, which serves programmatic requests using Data Commons APIs. The SQL query engine is built into the Mixer, which sends queries to both the local and remote data stores to find the right data. If the Mixer determines that it cannot fully resolve a user query from the custom data, it will make an REST API call, as an anonymous "user" to the base Data Commons Mixer and data.

In addition to the Docker container, a custom Data Commons instance uses custom data that you provide as raw CSV files. The web server calls an importer script that converts the CSV data into the Data Commons format and stores this in a SQL database. For local development, we provide a lightweight, open-source [SQLite](http://sqlite.org) database; for production, we recommend that you use [Google Cloud SQL](https://cloud.google.com/sql/).

## Requirements and cost

A custom Data Commons site runs in a Docker container on Google Cloud Platform (GCP). You will need the following:

-  A [GCP](http://console.cloud.google.com) billing account and project
-  A [Docker](http://docker.com) account 
-  If you will be customizing the site's UI, familiarity with the Python [Flask](https://flask.palletsprojects.com/en/3.0.x/#) web framework and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/) HTML templating

If you already have an account with another cloud provider, we can provide a connector; please contact us if you are interested in this option.

In terms of development time and effort, to launch a site with custom data in compatible format and no UI customization, you can expect it to take less than three weeks. If you need substantial UI customization it may take up to four months. 

The cost of running a site on Google Cloud Platform depends on the size of your data, the traffic you expect to receive, and the amount of geographical replication you want. For a small dataset, we have found the cost comes out to roughly $100 per year. You can get more precise information and cost estimation tools at [Google Cloud Pricing](https://cloud.google.com/pricing). 

## Recommended workflow

1. Work through the [Getting Started](quickstart.md) page to learn how to run a local Data Commons instance and load some sample custom data. 
1. Prepare your real-world custom data and load it in the local custom instance. Data Commons requires your data to be in a specific format. See [Working with Custom Data](custom_data.md)
1. If you want to customize the look of the feel of your site, see [Customizing the UI](custom_ui.md).
1. Upload your data to Google Cloud Platform and continue to use the local instance to test and validate the site. We recommend using Google Cloud Storage to store your data, and Google Cloud SQL to receive SQL queries from the local servers. See [Testing Data in Google Cloud](data_cloud.md).
1. When you are satisfied that everything is working correctly, and are getting closer to launch, upload your custom site to Google Cloud Run and continue to test in the Cloud. See [Deploying the Custom Instance to Google Cloud](deploy_cloud.md)
1. To launch your site to real traffic, configure your Cloud service to serve external traffic. Consult [Mapping Custom Domains](https://cloud.google.com/run/docs/mapping-custom-domains) and related Google Cloud Run documentation for complete details on configuring domains and traffic.
1. For future updates and launches, continue to make UI and data changes locally and upload the data to Cloud Storage, before deploying the changes to Cloud Run.