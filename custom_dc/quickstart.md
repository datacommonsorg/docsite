---
layout: default
title: Quickstart
nav_order: 2
parent: Build your own Data Commons
---

{:.no_toc}
# Quickstart

This page shows you how to run a local custom Data Commons instance inside Docker containers and load sample custom data from a local SQLite database. A custom Data Commons instance uses code from the public open-source repo, available at [https://github.com/datacommonsorg/](https://github.com/datacommonsorg/){: target="_blank"}.

This is step 1 of the [recommended workflow](/custom_dc/index.html#workflow).

* TOC
{:toc}

{: #overview}
## System overview

The instructions in this page use the following setup:

![local setup](/assets/images/custom_dc/customdc_setup2.png)

The "data management" Docker container consists of scripts that do the following:
- Convert custom CSV file data into SQL tables and store them in a data store -- for now, in a local SQLite database
- Generate NL embeddings for custom data and store them -- for now, in the local file system

The "services" Docker container consists of the following Data Commons components:
- A [Nginx reverse proxy server](https://www.nginx.com/resources/glossary/reverse-proxy-server/){: target="_blank"}, which routes incoming requests to the web or API server
- A Python-Flask web server, which handles interactive requests from users
- An Python-Flask NL server, for serving natural language queries
- An [MCP server](https://modelcontextprotocol.io/){: target="_blank"}, for serving tool responses to an MCP-compliant AI agent (e.g. Google ADK apps, Gemini CLI, Google Antigravity)
- A Go Mixer, also known as the API server, which serves programmatic requests using Data Commons APIs. The SQL query engine is built into the Mixer, which sends queries to both the local and remote data stores to find the right data. If the Mixer determines that it cannot fully resolve a user query from the custom data, it will make a REST API call, as an anonymous "user" to the base Data Commons Mixer and data.

## Prerequisites

- Obtain a [GCP](https://cloud.google.com/docs/get-started){: target="_blank"} account and project. 
- If you are developing on Windows, install [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install){: target="_blank"} (any distribution will do, but we recommend the default, Ubuntu), and enable [WSL 2 integration with Docker](https://docs.docker.com/desktop/wsl/){: target="_blank"}. 
- Install [Docker Desktop/Engine](https://docs.docker.com/engine/install/){: target="_blank"}.
- Install [Git](https://git-scm.com/){: target="_blank"}.

> **Tip:** If you use [Google Cloud Shell](https://cloud.google.com/shell/docs){: target="_blank"} as your development environment, Git and Docker come pre-installed.

- Optional: Get a [Github](http://github.com){: target="_blank"} account, if you would like to browse the Data Commons source repos using your browser.

## One-time setup steps {#setup}

### Get a Data Commons API key

An API key is required to authorize requests from your site to the base Data Commons site. API keys are managed by a self-serve portal. To obtain an API key, go to [https://apikeys.datacommons.org](https://apikeys.datacommons.org){: target="_blank"} and request a key for the `api.datacommons.org` domain. 

### Enable Google Cloud APIs and get a Maps API key {#maps-key}

1. Go to [https://console.cloud.google.com/apis/dashboard](https://console.cloud.google.com/apis/dashboard){: target="_blank"} for your project.
1. Click **Enable APIs & Services**.
1. Under **Maps**, enable **[Places API](https://console.cloud.google.com/apis/library/places-backend.googleapis.com){: target="_blank"}** and **[Maps Javascript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com){: target="_blank"}**.
1. Go to [https://console.cloud.google.com/google/maps-apis/credentials](https://console.cloud.google.com/google/maps-apis/credentials){: target="_blank"} for your project.
1. Click **Create Credentials** > **API Key**.
1. Record the key and click **Close**.
1. From the drop-down menu, enable **Places API** and **Maps Javascript API**. (Optionally enable other APIs for which you want to use this key.)
1. Click **OK** and **Save**.

### Clone the Data Commons repository {#clone}

> **Note:** If you are using WSL on Windows, open the Linux distribution app as your command shell. You must use the Linux-style file structure for Data Commons to work correctly.

1. Open a terminal or Cloud Shell window, and go to a directory to which you would like to download the Data Commons repository.
1. Clone the website Data Commons repository:
    <pre>git clone https://github.com/datacommonsorg/website.git [<var>DIRECTORY</var>]</pre>
    If you don't specify a directory name, this creates a local `website` subdirectory. If you specify a directory name, all files are created under that directory, without a `website` subdirectory.

When the downloads are complete, navigate to the root directory of the repo (e.g. `website`). References to various files and commands in these procedures are relative to this root.

<pre>
cd website
</pre>

### Set environment variables {#env-vars}

1. Using your favorite editor, copy `custom_dc/env.list.sample` and save it as a new file `custom_dc/env.list`. It provides a template for getting started.
1. Enter the relevant values for `DC_API_KEY` and `MAPS_API_KEY`.
1. Set `INPUT_DIR` to the full path to the `website/custom_dc/sample/` directory. For example if you have cloned the repo directly to your home directory, this might be <code>/home/<var>USERNAME</var>/website/custom_dc/sample/</code>. (If you're not sure, type `pwd` to get the working directory.)
1. For `OUTPUT_DIR`, set it to the same path as the `INPUT_DIR`.
1. If you are using Google Cloud Shell as your environment, set `GOOGLE_CLOUD_PROJECT` to your project ID.
1. For now, leave all the other defaults.

**Warning:** Do not use any quotes (single or double) or spaces when specifying the values.

## About the downloaded files

<table>
  <thead>
    <tr>
      <th>Directory/file</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
      <tr>
      <td width="300"><a href="https://github.com/datacommonsorg/website/tree/master/run_cdc_dev_docker.sh" target="_blank"><code>run_cdc_dev_docker.sh</code></a></td>
      <td>A convenience shell script to simplify management of Docker commands. Throughout the pages in this guide, we reference this script as well as giving the underlying commands. Documentation for running the script is available at the top of the file or by running <code>./run_cdc_dev_docker.sh --help</code> from the root website directory.</td>
    </tr>
    <tr>
      <td width="300"><a href="https://github.com/datacommonsorg/website/tree/master/custom_dc/sample" target="_blank"><code>custom_dc/sample/</code></a></td>
      <td>Sample data and config file (`config.json`) that can be added to a Custom Data Commons. This page describes the model and format of this data and how you can load and view it.  </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/tree/master/server/templates/custom_dc/custom" target="_blank"><code>server/templates/custom_dc/custom/</code></a></td>
      <td>Contains customizable HTML files. To modify these, see <a href="custom_ui.html#html-templates">Customize HTML templates</a>.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/tree/master/static/custom_dc/custom" target="_blank"><code>static/custom_dc/custom/</code></a></td>
      <td>Contains customizable CSS file and default logo. To modify the styles or replace the logo, see <a href="custom_ui.html#styles">Customize Javascript and styles</a>.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/tree/master/deploy/terraform-custom-datacommons" target="_blank"><code>deploy/terraform-custom-datacommons</code></a></td>
      <td>Contains <a href="https://developer.hashicorp.com/terraform"  target="_blank">Terraform</a> and convenience shell scripts for setting up your instance on Google Cloud Platform. See <a href="deploy_cloud.md">Deploy your custom instance to Google Cloud</a> for complete details.</td>
    </tr>
  </tbody>
</table>

## Look at the sample data

Before you start up a Data Commons site, it's important to understand the basics of the data model that is expected in a custom Data Commons instance. Let's look at the sample data in the CSV files in the `custom_dc/sample/` folder. This data is from the Organisation for Economic Co-operation and Development (OECD): "per country data for annual average wages" and "gender wage gaps":

entity	| date	| variable | value | unit |
--------|-------|----------|-------|------|
country/BEL	| 2000	| average_annual_wage | 54577.62735 | USD |
country/BEL	| 2001	| average_annual_wage | 54743.96009 | USD |
country/BEL	| 2002	| average_annual_wage | 56157.24355 | USD |
country/BEL	| 2003	| average_annual_wage | 56491.99591 | USD |
... | ...   |     ...     | ... | ... |

entity	| date	| variable | value | unit |
--------|-------|----------|-------|------|
country/DNK	| 2005	| gender_wage_gap | 10.16733044 | percent |
country/DNK	| 2006	| gender_wage_gap | 10.17206126 | percent |
country/DNK	| 2007	| gender_wage_gap | 9.850297951 | percent |
country/DNK	| 2008	| gender_wage_gap | 10.18354903 | percent |
... |  ...  |   ...       | ... | ... |

There are a few important things to note:
- There are only 4 required columns: one representing a place or "entity", identified by a unique Data Commons identifier ("DCID"); one representing a date; one representing a [_statistical variable_](/glossary.html#variable), which is a Data Commons concept for a metric; and one representing the value of the variable. 
- Every row is a separate [_observation_](/glossary.html#observation). An observation is a value of the variable for a given place and time. There could be multiple different variables in a given CSV file (and these two files could actually be combined into one).
- There is an additional, optional column, `unit`, that provides more details about each observation.

This is the format to which your data must conform for correct loading. (This topic is discussed in detail in [Preparing and loading your data](custom_data.md).)

## Load sample data and start the services

To start up Data Commons:

1. If you are running on Windows or Mac, start Docker Desktop and ensure that the Docker Engine is running.

> Note: If you are running on Linux, depending on whether you have created a ["sudoless" Docker group](https://docs.docker.com/engine/install/linux-postinstall/){: target="_blank"}, you may need to preface every script or `docker` invocation with `sudo`.

1. Open a terminal window, and from the website root directory, run the following command to run the Docker containers:

   ```shell
  cd website
  ./run_cdc_dev_docker.sh
   ```
This does the following:

- The first time you run it, downloads the latest stable Data Commons data image, `gcr.io/datcom-ci/datacommons-data:stable`, and services image, `gcr.io/datcom-ci/datacommons-services:stable`, from the Google Cloud Artifact Registry, which may take a few minutes. Subsequent runs use the locally stored images.
- Maps the input sample data to a Docker path.
- Starts the Docker data management container.
- Imports the data from the CSV files, resolves entities, and writes the data to a SQLite database file, `custom_dc/sample/datacommons/datacommons.db`.
- Generates embeddings in `custom_dc/sample/datacommons/nl`. (To learn more about embeddings generation, see the [FAQ](/custom_dc/faq.html#natural-language-processing)).
- Starts the services Docker container.
- Starts development/debug versions of the Web server, MCP server, NL server, and Mixer, as well as the Nginx proxy, inside the container.
- Maps the output sample data to a Docker path.

You can see the actual Docker commands that the script runs at the [end of this page](#docker).

### Stop and restart the services

If you need to restart the services for any reason, do the following:

1. In the terminal window where the container is running, press Ctrl-c to kill the Docker container.
1. Run the script with the option to restart only the services container:

  ```shell
  ./run_cdc_dev_docker.sh -c service
  ```

Tip: If you closed the terminal window in which you started the Docker services container, you can kill it as follows:

1. Open another terminal window, and from the root directory, get the Docker container ID.
  ```shell
  docker ps
  ```
  The `CONTAINER ID` is the first column in the output.
1. Run:
   <pre>docker kill <var>CONTAINER_ID</var></pre>

## View the local website

Once the services are up and running, visit your local instance by pointing your browser to [http://localhost:8080](http://localhost:8080). You should see something like this:

![screenshot_homepage](/assets/images/custom_dc/customdc_screenshot1.png){: width="900"}

Now click the **Timeline** link to visit the Timeline explorer. Click **Start**, enter an OECD country (e.g. Canada) and click **Continue**. Now, in the **Select variables** tools, you'll see the new variables:

![screenshot_timeline](/assets/images/custom_dc/customdc_screenshot2.png){: width="900"}

Select one (or both) and click **Display** to show the timeline graph:

![screenshot_display](/assets/images/custom_dc/customdc_screenshot3.png){: width="900"}

To issue natural language queries, click the **Search** link. Try NL queries against the sample data you just loaded, e.g. "Average annual wages in Canada".

![screenshot_search](/assets/images/custom_dc/customdc_screenshot3a.png){: width="900"}

## Send an API request

A custom instance can accept [REST API](/api/rest/v2/index.html) requests at the endpoint `/core/api/v2/`, which can access both the custom and base data. To try it out, here's an example request you can make to your local instance that returns the same data as the interactive queries above, using the `observation` API. Try entering this query in your browser address bar:

```
http://localhost:8080/core/api/v2/observation?entity.dcids=country%2FCAN&select=entity&select=variable&select=value&select=date&variable.dcids=average_annual_wage
```

> Note: You do not need to specify an API key as a [query parameter](/api/rest/v2/getting_started.html#query-param).

If you select **Prettyprint**, you should see output like this:

![screenshot_api_call](/assets/images/custom_dc/customdc_screenshot4.png){: height="400" }

{: #docker}
## Docker commands

The Bash script used on this page runs the following commands:

```bash
docker run \
  --env-file $PWD/custom_dc/env.list \
  -v $PWD/custom_dc/sample:$PWD/custom_dc/sample \
  -v $PWD/custom_dc/sample:$PWD/custom_dc/sample \
  gcr.io/datcom-ci/datacommons-data:stable

docker run -i \
  -p 8080:8080 \
  -e DEBUG=true \
  --env-file $PWD/custom_dc/env.list \
  -v $PWD/custom_dc/sample:$PWD/custom_dc/sample \
  -v $PWD/custom_dc/sample:$PWD/custom_dc/sample \
  gcr.io/datcom-ci/datacommons-services:stable
```

## Troubleshooting

Having trouble? Visit our [Troubleshooting Guide](/custom_dc/troubleshooting.html) for detailed solutions to common problems.
