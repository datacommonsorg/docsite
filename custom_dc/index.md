---
layout: default
title: Build your own Data Commons
nav_order: 90
has_children: true
---

{:.no_toc}
# Build your own Data Commons

* TOC
{:toc}

## Overview

A custom instance natively joins your data and the base Data Commons data (from datacommons.org) in a unified fashion. Your users can visualize and analyze the data seamlessly without the need for further data preparation.

You have full control over your own data and computing resources, with the ability to limit access to specific individuals or open it to the general public.

Note that each new Data Commons is deployed using the Google Cloud Platform (GCP). 

## Why use a custom Data Commons instance?

If you have the resources to develop and maintain a custom Data Commons instance, this is a good option for the following use cases:

- You want to host your data on your own website, and take advantage of Data Commons natural-language query interface, and exploration and visualization tools.
- You want to add your own data to Data Commons but want to maintain ownership of the Cloud data.
- You want to add your own data to Data Commons but want to customize the UI of the site.
- You want to add your own private data to Data Commons, and restrict access to it.

Also, if you want to add all of your data to the base Data Commons and test how it will work with the exploration tools and natural language queries, you will need to at least host a local development site for testing purposes.

For the following use cases, a custom Data Commons instance is not necessary:

- You only want to make your own data available to the base public Data Commons site and don't need to test it. In this case, see the procedures in [Data imports](/import_dataset/index.html).
- You want to make the base public data or visualizations available in your own site. For this purpose, you can call the Data Commons APIs from your site; see [Data Commons web components](/api/web_components/index.html) for more details.

## Comparison between base and custom Data Commons

| Feature                                                      |  Base Data Commons | Custom Data Commons |
|--------------------------------------------------------------|--------------------|---------------------|
| Interactive tools (Exploration tools, Statistical Variable Explorer, etc.) |  yes  |    yes    |
| Natural language query interface                            |  yes, using open-source models only<sup>1</sup> |  yes, using Google AI technologies and models  |
| REST APIs                                                   |  yes | yes, no additional setup needed |
| Python and Pandas API wappers                               |  yes  | yes, but requires additional setup<sup>2</sup> |
| Bigquery interface  | yes | no
| Google Spreadsheets                                         |  yes |  yes, but requires additional setup<sup>2</sup> |
| Site access controls | yes, using any supported Cloud Run mechanisms<sup>3</sup> | n/a |
| Fine-grained data access controls<sup>4</sup> |  no | n/a |

1. Open-source Python ML library, Sentence Transformers model, from [https://huggingface.co/sentence-transformers](https://huggingface.co/sentence-transformers).
1. If you would like to support these facilities, please contact us.
1. For example, Virtual Private Cloud, Cloud IAM, and so on. Please see the GCP [Restricting ingress for Cloud Run](https://cloud.google.com/run/docs/securing/ingress) for more information on these options. 
1. You cannot set access controls on specific data, only the entire custom site.

## System overview

Essentially, a custom Data Commons instance is a mirror of the public Data Commons, that runs in [Docker](http://docker.com) containers hosted in the cloud. In the browsing tools, the custom data appears alongside the base data in the list of variables. When a query is sent to the custom website, a Data Commons server fetches both the custom and base data to provide multiple visualizations. At a high level, here is a conceptual view of a custom Data Commons instance:

![setup1](/assets/images/custom_dc/customdc_setup1.png){: height="450" }

A custom Data Commons instance uses custom data that you provide as raw CSV files. An importer script converts the CSV data into the Data Commons format and stores this in a SQL database. For local development, we provide a lightweight, open-source [SQLite](http://sqlite.org) database; for production, we recommend that you use [Google Cloud SQL](https://cloud.google.com/sql/).

In addition to the data, a custom Data Commons instance consists of two Docker containers: one with the core services that serve the data and website; and one with utilities for managing and loading custom data and embeddings used for natural-language processing. 

Details about the components that make up the containers are provided in the [Getting started](quickstart.md) guide.

## Requirements and cost

A custom Data Commons site runs in a Docker container on Google Cloud Platform (GCP), using Google Cloud Run, a serverless solution that provides auto-scaling and other benefits. You will need the following:

- A [GCP](http://console.cloud.google.com) billing account and project
- A [Docker](http://docker.com) account
- If you will be customizing the site's UI, familiarity with the Python [Flask](https://flask.palletsprojects.com/en/3.0.x/#) web framework and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/) HTML templating

    **Note:** Data Commons does not support local Windows development natively. If you wish to develop Data Commons on Windows, you will need to use the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/about).

If you already have an account with another cloud provider, we can provide a connector; please contact us if you are interested in this option.

In terms of development time and effort, to launch a site with custom data in compatible format and no UI customization, you can expect it to take less than three weeks. If you need substantial UI customization it may take up to four months.

The cost of running a site on Google Cloud Platform depends on the size of your data, the traffic you expect to receive, and the amount of geographical replication you want. For a small dataset, we have found the cost comes out to roughly $100 per year. You can get more precise information and cost estimation tools at [Google Cloud pricing](https://cloud.google.com/pricing).

{: #workflow}
## Recommended workflow

1. Work through the [Getting started](/custom_dc/quickstart.html) page to learn how to run a local Data Commons instance and load some sample custom data.
1. Prepare your real-world custom data and load it in the local custom instance. Data Commons requires your data to be in a specific format. See [Work with custom data](/custom_dc/custom_data.html).
1. If you want to customize the look of the feel of the site, see [Customize the site](/custom_dc/custom_ui.html).
1. When you have finished testing locally, host your data and code in Google Cloud Platform: first, upload your data to Google Cloud Storage and create a Cloud Run job to load the data into Google Cloud SQL. See [Load data in Google Cloud](/custom_dc/data_cloud.html).
1. Build a custom image, upload it to the Google Cloud Artifact Registry and create a Cloud Run service to run the site. See [Deploy services to Google Cloud](deploy_cloud.md)
1. Launch and productionize your site for external traffic. See [Launch your Data Commons](/custom_dc/launch_cloud.html).
1. For future updates and launches, continue to make UI and data changes locally, before deploying the changes to GCP.
