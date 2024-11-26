---
layout: default
title: Troubleshooting
nav_order: 9
parent: Build your own Data Commons
---

{:.no_toc}
# Troubleshooting

* TOC
{:toc}

## Docker permission errors

### Linux "permission denied"

If you see this error:

```
docker: Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: ...
dial unix /var/run/docker.sock: connect: permission denied.
```

or this:

```
docker: Error response from daemon: pull access denied for datacommons-services, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.
```

1. Use `sudo` with your `docker` invocations or set up a "sudoless" docker group, as described in [Linux post-installation steps for Docker Engine](https://docs.docker.com/engine/install/linux-postinstall/){: target="_blank"}.
1. If you've just installed Docker, try rebooting the machine.

## Startup errors

### "Failed to create metadata: failed to create secret manager client: google: could not find default credentials."

If you try to run the services and fail with this error:

```
Failed to create metadata: failed to create secret manager client: google: could not find default credentials. See https://cloud.google.com/docs/authentication/external/set-up-adc for more information. See https://cloud.google.com/docs/authentication/external/set-up-adc for more information
```

This indicates that you have not specified API keys in the environment file. Follow procedures in [One-time setup steps](/custom_dc/quickstart.html#setup) to obtain and configure API keys.

{: #schema-check-failed}
### "SQL schema check failed"

This error indicates that there has been an update to the database schema, and you need to update your database schema by re-running the data management job as follows:

1. Rerun the data management Docker container, optionally adding the flag `-e DATA_RUN_MODE=schemaupdate` to the `docker run` command. This updates the database schema without re-importing data or re-building natural language embeddings. 
1. Restart the services Docker container.

For full command details, see the following sections:
- For local services, see [Start the data management container in schema update mode](/custom_dc/custom_data.html#schema-update-mode).
- For services running on Google Cloud, see [Run the data management Cloud Run job in schema update mode](/custom_dc/data_cloud#schema-update-mode).

## Local build errors

### "file not found in build context"

If you are building a local instance and get this error:

```
Step 7/62 : COPY mixer/go.mod mixer/go.sum ./
COPY failed: file not found in build context or excluded by .dockerignore: stat mixer/go.mod: file does not exist
```
You need to download/update additional submodules (derived from other repos). See [Build a local image](/custom_dc/build_image.html#build-repo).

## NL queries not returning custom data

If you have previously been able to get custom data in your natural-language query results, but this has suddenly stopped working, this is due to embeddings incompatibility issues between releases. To fix this, do the following:
1. Delete the `datacommons` subdirectory from your output directory, either locally or in your Google Cloud Storage bucket.
1. Rerun the data management container, as described in [Load data in Google Cloud](data_cloud.md), and restart the services container.

## Website display problems

If styles aren't rendering properly because CSS, logo files or JS files are not loading, check your Docker command line for invalid arguments. Often Docker won't give any error messages but failures will show up at runtime.

## Website form input problems

If you try to enter input into any of the explorer tools fields, and you get this:

![screenshot_troubleshoot](/assets/images/custom_dc/customdc_screenshot7.png){: width="800"}

This is because you are missing a valid API key or the necessary APIs are not enabled. Follow procedures in [Enable Google Cloud APIs and get a Maps API key](/custom_dc/quickstart.html#maps-key), and be sure to obtain a permanent Maps/Places API key.

## Cloud Run Service problems

In general, whenever you encounter problems with any Google Cloud Run service, check the **Logs** page for your Cloud Run service, to get detailed output from the services.

### "403 Forbidden: Your client does not have permission to get URL / from this server"

This error indicates that your application requires authenticated requests but you have not provided an authentication token. If your site is intended to be public, first check to see that the Cloud Run service is not set up to require authentication:
1. Go to the [Google Cloud Console Cloud Run](https://console.cloud.google.com?run){: target="_blank"} page for your project.
1. From the list of services, select the relevant service and select the **Security** tab.
1. Ensure that you have enabled **Allow unauthenticated invocations** and restart the Cloud Run service.

If you are unable to select this option, this indicates that there is an IAM permissions setup issue with your project or account. See the [Cloud Run Troubleshooting](https://cloud.google.com/run/docs/troubleshooting#unauthorized-client) for details on how to fix this.

### "502 Bad Gateway"

This is a general indication that the Data Commons servers are not running. Check the **Logs ** page for the Cloud Run service in the Google Cloud Console. Here are common errors:

`403 Forbidden: Not authorized to access resources`

This may be due to multiple reasons. First try the following:
1. In the Cloud Run service page in the Cloud Console, select the **Revisions** tab, and scroll to view the **Environment variables**.
1. Ensure that the `DB_USER` and `DB_PASS` variables are set to the values you set when creating the [SQL database](/custom_dc/data_cloud.html#create-sql).

If you see no errors in the logs, except `connect() failed (111: Connection refused) while connecting to upstream`, try the following:

1. Wait a few minutes and try to access the app again. Sometimes it appears to be deployed, but some of the services haven't yet started up.
1. In the Cloud Run **Service details** page, click the **Revisions** tab. Under the **Containers** tab, under **General**, check that **CPU Allocation** is set to **CPU is always allocated**. If it is not, click **Edit & Deploy New Revision**, and the **Containers** tab. Under **CPU allocation and pricing** enable **CPU is always allocated** and click **Deploy**.
