---
layout: default
title: Quickstart
nav_order: 2
parent: Custom Data Commons
---

{:.no_toc}
# Quickstart

* TOC
{:toc}

To start developing a custom Data Commons instance, we recommend that you develop your site and host your data locally. This uses a SQLite database to store custom data.

![setup2](/assets/images/custom_dc/customdc_setup2.png)

This page shows you how to run a local custom Data Commons instance inside a Docker container, load sample custom data, and enable natural querying. A custom Data Commons instance uses code from the public open-source repo, available at [https://github.com/datacommonsorg/](https://github.com/datacommonsorg/).

## Prerequisites

- Obtain a [GCP](https://console.cloud.google.com/welcome) billing account and project.
- Install [Docker Engine](https://docs.docker.com/engine/install/).
- Install [Git](https://git-scm.com/).
- Get an API key for Data Commons by submitting the [Data Commons API key request form](https://docs.google.com/forms/d/e/1FAIpQLSePrkVfss9lUIHFClQsVPwPcAVWvX7WaZZyZjJWS99wRQNW4Q/viewform?resourcekey=0-euQU6Kly7YIWVRNS2p4zjw). The key is needed to authorize requests from your custom site to the main Data Commons site. Typical turnaround times are 24-48 hours.
- Optional: Get a [Github](http://github.com) account, if you would like to browse the Data Commons source repos using your browser.

## One-time setup steps

### Enable Google Cloud APIs and get a Maps API key {#maps-key}

1. Go to [https://console.cloud.google.com/apis/dashboard](https://console.cloud.google.com/apis/dashboard) for your project.
1. Click **Enable APIs & Services**.
1. Under **Maps**, enable **Places API** and **Maps Javascript API**.
1. Go to [https://console.cloud.google.com/google/maps-apis/credentials](https://console.cloud.google.com/google/maps-apis/credentials) for your project.
1. Click **Create Credentials** > **API Key**.
1. Record the key and click **Close**.
1. Click on the newly created key to open the **Edit API Key** window.
1. Under API restrictions, select Restrict key.
1. From the drop-down menu, enable Places API and Maps Javascript API. (Optionally enable other APIs for which you want to use this key.)
1. Click **OK** and **Save**.

### Clone the Data Commons repository

1. Open a terminal window, and go to a directory to which you would like to download the Data Commons repository.
1. Clone the website Data Commons repository:

   ```shell
   git clone https://github.com/datacommonsorg/website.git
   ```

   This creates a local `website` subdirectory.

1. When the downloads are complete, navigate to the root directory of the repo, `website`. References to various files and commands in these procedures are relative to this root.

   ```shell
   cd website
   ```

### Set API keys as environment variables

1. Using your favorite editor, open `custom_dc/sqlite_env.list`.
1. Enter the relevant values for `DC_API_KEY` and `MAPS_API_KEY`.
1. Leave `ADMIN_SECRET` blank for now.

Warning: Do not use any quotes (single or double) or spaces when specifying the values.

Note: If you are storing your source code in a public/open-source version control system, we recommend that you do not store the environment variables files containing secrets. Instead, store them locally only.

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
      <td width="300"><a href="https://github.com/datacommonsorg/website/tree/master/custom_dc/sample"><code>custom_dc/sample/</code></a></td>
      <td>Sample supplemental data that is added to the base data on the main Data Commons site. This page shows you how to easily load and view this data. The data is in CSV format and mapped to Data Commons entity definitions using the config.json file. </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/tree/master/custom_dc/examples"><code>custom_dc/examples/</code></a></td>
      <td>More examples of custom data in CSV format and config.json. To configure your own custom data, see <a href="custom_data.html">Work with custom data</a>.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/tree/master/server/templates/custom_dc/custom"><code>server/templates/custom_dc/custom/</code></a></td>
      <td>Contains customizable HTML files. To modify these, see <a href="custom_ui.html#html-templates">Customize HTML templates</a>.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/tree/master/static/custom_dc/custom"><code>static/custom_dc/custom/</code></a></td>
      <td>Contains customizable CSS file and default logo. To modify the styles or replace the logo, see <a href="custom_ui.html#styles">Customize Javascript and styles</a>.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/custom_dc/sqlite_env.list"><code>custom_dc/sqlite_env.list</code></a></td>
      <td>Contains environment variables for a development environment using SQLite as the database. For details of the variables, see the comments in the file.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/custom_dc/cloudsql_env.list"><code>custom_dc/cloudsql_env.list</code></a></td>
      <td>Contains environment variables for a development or production environment using Cloud SQL as the database. For details of the variables, see the comments in the file.</td>
    </tr>
  </tbody>
</table>

## Start the services {#start-services}

From the root directory, `website`, run Docker as follows.

Note: If you are running on Linux, depending on whether you have created a ["sudoless" Docker group](https://docs.docker.com/engine/install/linux-postinstall/), you will need to preface every `docker` invocation with `sudo`.

```shell
docker run -it \
-p 8080:8080 \
-e DEBUG=true \
--env-file $PWD/custom_dc/sqlite_env.list \
-v $PWD/custom_dc/sample:/userdata \
gcr.io/datcom-ci/datacommons-website-compose:stable
```

This command does the following:

- The first time you run it, downloads the latest stable Data Commons image, `gcr.io/datcom-ci/datacommons-website-compose:stable`, from the Google Cloud Artifact Registry, which may take a few minutes. Subsequent runs use the locally stored image.
- Starts a Docker container in interactive mode.
- Starts development/debug versions of the Web Server, NL Server, and Mixer, as well as the Nginx proxy, inside the container
- Maps the sample data to the Docker path `/userdata`, so the servers do not need to be restarted when you load the sample data

### Stop and restart the services

If you need to restart the services for any reason, do the following:

1. In the terminal window where the services are running, press Ctrl-c to kill the Docker container.
1. Rerun the `docker run` command as usual.

Tip: If you close the terminal window in which you started the Docker container, you can kill it as follows:

1. Open another terminal window, and from the `website` directory, get the Docker container ID.

   ```shell
     docker ps
   ```

   The `CONTAINER ID` is the first column in the output.

1. Run:

  <pre>
  docker kill <var>CONTAINER_ID</var>  
	</pre>

## View the local website

Once Docker is up and running, visit your local instance by pointing your browser to [http://localhost:8080](http://localhost:8080). You should see something like this:

![screenshot_homepage](/assets/images/custom_dc/customdc_screenshot1.png){: width="900"}

You can browse the various Data Commons tools (Variables, Map, Timelines, etc.) and work with the entire base dataset.

## Load sample data

In this step, we will add sample data that we have included as part of the download for you to load it into your custom instance. This data is from the Organisation for Economic Co-operation and Development (OECD): "per country data for annual average wages" and "gender wage gaps".

To load and view the sample data:

1. Point your browser to the admin page at [http://localhost:8080/admin](http://localhost:8080/admin).
1. Since you have not yet specified an `ADMIN_SECRET`, leave it blank.
1. Click **Load Data**. It may take a few seconds to load.

This does the following:

- Imports the data from the CSV files, resolves entities, and writes the data to a SQLite database file, `custom_dc/sample/datacommons/datacommons.db`.
- Generates embeddings in the Docker image and loads them.

Tip: When you restart the Docker instance, all data in the SQLite database is lost. If you want to preserve the sample data and have it automatically always load after restarting your Docker instance, without having to run the load data function each time, include this additional flag in your Docker run command:

```shell
-v $PWD/custom_dc/sample/datacommons:/sqlite
```

Now click the **Timeline** link to visit the Timeline explorer. Try entering a country and click **Continue**. Now, in the **Select variables** tools, you'll see the new variables:

![screenshot_timeline](/assets/images/custom_dc/customdc_screenshot2.png){: width="900"}

Select one (or both) and click **Display** to show the timeline graph:

![screenshot_display](/assets/images/custom_dc/customdc_screenshot3.png){: width="900"}

To issue natural language queries, click the **Search** link. Try NL queries against the sample data you just loaded, e.g. "Average annual wages in Canada".

![screenshot_search](/assets/images/custom_dc/customdc_screenshot3a.png){: width="900"}

Note that NL support increases the startup time of your server and consumes more resources. If you don't want NL functionality, you can disable it by updating the `ENABLE_MODEL` flag in `sqlite_env.list` from `true` to `false`.

## Send an API request

A custom instance can accept REST API requests at the endpoint `/core/api/v2/`. To try it out, here's an example request that returns the same data as in the interactive queries above, using the `observation` API. You can enter this query in your browser to get nice output:

```
[http://localhost:8080/core/api/v2/observation?entity.dcids=country%2FCAN&select=entity&select=variable&select=value&select=date&variable.dcids=average_annual_wage](http://localhost:8080/core/api/v2/observation?entity.dcids=country%2FCAN&select=entity&select=variable&select=value&select=date&variable.dcids=average_annual_wage)
```

Note: You do not need to specify an API key as a parameter.

If you select **Prettyprint**, you should see output like this:

![screenshot_api_call](/assets/images/custom_dc/customdc_screenshot4.png){: height="400" }
