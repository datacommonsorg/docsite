---
layout: default
title: Building and Running a Local Repo
nav_order: 5
parent: Overview
---

Data Commons provides two prebuilt images in the Google Artifact Registry that you can download to run in a Docker container:

-  `gcr.io/datcom-ci/datacommons-website-compose:stable`. The version is guaranteed to work correctly but may be several weeks old.
-  `gcr.io/datcom-ci/datacommons-website-compose:latest`. This is the latest built version that is running in production.

If you want to pick up the latest prebuilt version, run the following command:

```shell  
docker pull gcr.io/gcr.io/datcom-ci/datacommons-website-compose:latest  
```

Then, restart Docker, specifying that repo as the argument to the `docker run` command.

If you have local changes that need to be built, or you are ready to deploy your site to Google Cloud, follow the procedures below.

## One-time setup: download build dependencies

If you need to rebuild the repo locally, the `mixer` and `import` repos must be available as dependencies. Run this command one time to set the repos as subdirectories of the website repo:

```shell  
git submodule foreach git pull origin master  
git submodule update --init --recursive  
```

## Building the local repo

From the `website` directory, sync to the latest version of the files in the repo:

```shell  
git pull   
```

Run the following command to build the repo:

<pre>  
docker build --tag datacommons-website-compose:<var>DOCKER_TAG</var> \  
-f build/web_compose/Dockerfile \  
-t website-compose .  
</pre>

The _DOCKER_TAG_ is a meaningful description of the version you are building.

It will take several minutes to build. 

To run the container with the local SQLite database, start the Docker container as described below. 

To run the container with a remote Cloud SQL database, see [Starting the Docker container with Cloud data](?tab=t.0#heading=h.sloi9t843a5k) for procedures.

To upload and deploy the container to the Cloud, see [Deploying a Custom Instance to Google Cloud](?tab=t.0#heading=h.25vir3cca7) for procedures.

## Running the container with the local SQLite database

To start the services using the locally built repo. If you have made changes to any of the UI components, be sure to map the `custom` directories to the Docker `workspace` directory.

<pre>  
docker run -it \  
--env-file $PWD/custom_dc/sqlite_env.list \  
-p 8080:8080 \  
-e DEBUG=true \  
[-v $PWD/custom_dc/<var>CUSTOM_DATA_DIRECTORY</var>:/userdata \]  
[-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \]  
[-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \]

datacommons-website-compose:<var>DOCKER_TAG</var>  
</pre>