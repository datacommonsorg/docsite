---
layout: default
title: Build and run a local repo
nav_order: 5
parent: Custom Data Commons
---

## Build and run a local repo

Data Commons provides two prebuilt images in the Google Artifact Registry that you can download to run in a Docker container:

-  `gcr.io/datcom-ci/datacommons-website-compose:stable`. This is a tested, stable version but may be several weeks old.
-  `gcr.io/datcom-ci/datacommons-website-compose:latest`. This is the latest built version that is running in production.

If you want to pick up the latest prebuilt version, run the following command:

```shell  
docker pull gcr.io/gcr.io/datcom-ci/datacommons-website-compose:latest  
```

Then, restart Docker, specifying that repo as the argument to the `docker run` command.

If you have local changes that need to be built, or you are ready to deploy your site to Google Cloud, follow the procedures below.

## Build the local repo

If you need to rebuild the repo locally, you must also update the `mixer` and `import` submodules.

1. From the `website` directory, sync to the latest version of the files in the repo:

    ```shell  
    git submodule foreach git pull origin master  
    git submodule update --init --recursive  
    git pull 
    ```
1. Run the following command to build the repo:

    <pre>
    docker build --tag datacommons-website-compose:<var>DOCKER_TAG</var> \
    -f build/web_compose/Dockerfile \
    -t website-compose .  
    </pre>

    The _DOCKER_TAG_ is a meaningful description of the version you are building.

It will take several minutes to build. 

To run the container with the local SQLite database, start the Docker container as described below. 

<<<<<<< HEAD
To run the container with a remote Cloud SQL database, see [Start the Docker container with Cloud data](/custom_dc/build_repo.html#docker-data) for procedures.

To upload and deploy the container to the Cloud, see [Deploy a custom instance to Google Cloud](/custom_dc/deploy_cloud.html) for procedures.
=======
To run the container with a remote Cloud SQL database, see [Start the Docker container with Cloud data](build_repo.md#docker-data) for procedures.

To upload and deploy the container to the Cloud, see [Deploy a custom instance to Google Cloud](deploy_cloud.md) for procedures.
>>>>>>> c937e3f4e7e1836000636168dbfd0e811d6d6cea

## Run the container with the local SQLite database

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