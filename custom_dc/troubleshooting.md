---
layout: default
title: Troubleshooting
nav_order: 8
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
docker: Error response from daemon: pull access denied for datacommons-website-compose, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.
```

1. Use `sudo` with your `docker` invocations or set up a "sudoless" docker group, as described in [Linux post-installation steps for Docker Engine](https://docs.docker.com/engine/install/linux-postinstall/).
1. If you've just installed Docker, try rebooting the machine.

## Startup errors

### "Failed to create metadata: failed to create secret manager client: google: could not find default credentials."

If you try to run the services and fail with this error:

```
Failed to create metadata: failed to create secret manager client: google: could not find default credentials. See https://cloud.google.com/docs/authentication/external/set-up-adc for more information. See https://cloud.google.com/docs/authentication/external/set-up-adc for more information
```

This indicates that you have not specified API keys in the environment file. Follow procedures in [One-time setup steps](/custom_dc/quickstart.html#setup) to obtain and configure API keys.

## Local build errors

### "file not found in build context"

If you are building a local instance and get this error:

```
Step 7/62 : COPY mixer/go.mod mixer/go.sum ./
COPY failed: file not found in build context or excluded by .dockerignore: stat mixer/go.mod: file does not exist
```
You need to download/update additional submodules (derived from other repos). See [Build a local image](/custom_dc/build_image.html#build-repo).

## Data loading problems

If you try to load data using the `/admin page`, and see the following errors:

`Error running import` or `invalid input`

There is a problem with how you have set up your CSV files and/or config.json file. Check that your CSV files conform to the structure described in [Prepare the CSV files](/custom_dc/custom_data.html#prepare-csv).

If the load page does not show any errors but data still does not load, try checking the following:

1. In the `env.list` file, check that you are not using single or double quotes around any of the values.
1. Check your Docker command line for invalid arguments. Often Docker won't give any error messages but failures will show up at runtime.

## Website display problems

If styles aren't rendering properly because CSS, logo files or JS files are not loading, check your Docker command line for invalid arguments. Often Docker won't give any error messages but failures will show up at runtime.

## Website form input problems

If you try to enter input into any of the explorer tools fields, and you get this:

![screenshot_troubleshoot](/assets/images/custom_dc/customdc_screenshot7.png){: width="800"}

This is because you are missing a valid API key or the necessary APIs are not enabled. Follow procedures in [Enable Google Cloud APIs and get a Maps API key](/custom_dc/quickstart.html#maps-key), and be sure to obtain a permanent Maps/Places API key.

## Cloud Run Service problems

In general, whenever you encounter problems with any Google Cloud Run service, check the **Logs** page for your Cloud Run service, to get detailed output from the services.

### "502 Bad Gateway"

If you see no errors in the logs, except `connect() failed (111: Connection refused) while connecting to upstream`, try the following:

1. Wait a few minutes and try to access the app again. Sometimes it appears to be deployed, but some of the services haven't yet started up.
1. In the Cloud Run **Service details** page, click the **Revisions** tab. Under the **Containers** tab, under **General**, check that **CPU Allocation** is set to **CPU is always allocated**. If it is not, click **Edit & Deploy New Revision**, and the **Containers** tab. Under **CPU allocation and pricing** enable **CPU is always allocated** and click **Deploy**.
