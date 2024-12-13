---
layout: default
title: Build and run a custom image
nav_order: 5
parent: Build your own Data Commons
---

{:.no_toc}
# Build and run a custom image

* TOC
{:toc}


## Use a prebuilt image

While you are just testing out data changes, you don't need to build the website, but can just use a prebuilt Data Commons image.

Data Commons provides two prebuilt images in the Google Artifact Registry that you can download to run in a Docker container:

- `gcr.io/datcom-ci/datacommons-data:stable` and `gcr.io/datcom-ci/datacommons-services:stable`. These are tested, stable versions but may be several weeks old.
- `gcr.io/datcom-ci/datacommons-data:latest` and `gcr.io/datcom-ci/datacommons-services:latest`. These are the latest versions built from head.

If you want to pick up the latest prebuilt version, do the following:

1. From the root directory (e.g. `website`), run the following command:
   ```shell  
   docker pull gcr.io/datcom-ci/datacommons-services:latest
   docker pull gcr.io/datcom-ci/datacommons-data:latest
   ```
   
1. Rerun the data container, specifying that repo specifying that repo as the argument to the `docker run` command:
   <pre>docker run \
   --env-file $PWD/custom_dc/env.list \
   -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
   -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
   gcr.io/datcom-ci/datacommons-data:latest
   </pre>

1. Restart the services container:
   <pre>docker run -it \
   -p 8080:8080 \
   -e DEBUG=true \
   --env-file $PWD/custom_dc/env.list \
   -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
   -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
   gcr.io/datcom-ci/datacommons-services:latest
   </pre>

## Build a local image {#build-repo}
You will need to build a local image in any of the following cases:
- You are making substantive changes to the website UI
- You are ready to deploy your custom site to GCP

Building from the master branch includes the very latest changes in Github, that may not have been tested. Instead, we recommend that you use the tested "stable" branch equivalent of the stable Docker image. This branch is `customdc_stable`, and is available at [https://github.com/datacommonsorg/website/tree/customdc_stable](https://github.com/datacommonsorg/website/tree/customdc_stable){: target="_blank"}.

> **Note:** If you are working on a large-scale customization, we recommend that you use a version control system to manage your code. We provide some procedures for Github.

### Clone the stable branch only

Use this procedure if you are not using Github, or if you are using Github and want to create a new source directory and start from scratch.

1. Run the following command:
   <pre>
   git clone https://github.com/datacommonsorg/website --branch customdc_stable --single-branch  [<var>DIRECTORY</var>]
   </pre>
   This creates a new local branch called `customdc_stable` set to track the Data Commons repo branch. 
1. To verify, run:
   <pre>
   cd website | cd <var>DIRECTORY</var>
   git branch -vv
   </pre>
   You should see output like the following:

   ```
   * customdc_stable 83732891 [origin/customdc_stable] 2024-11-06 Custom DC stable release (#4710)
   ```
   Rather than developing on this default branch, we recommend that you create another branch.

### Sync code to the stable branch

The following procedure uses Github. If you are using another version control system, use the appropriate methods for updating submodules and syncing.

1. Switch to the directory where you have cloned the Data Commons doe:
   <pre>
   cd website | cd <var>DIRECTORY</var>
   </pre>

1. Update files:
   ```
   git pull origin customdc_stable
   ```
   Note that `origin` here refers to the source `datacommonsorg/website` repo. You may be using another remote name to point to that repo.

   You should see output like the following:
   ```
   From https://github.com/datacommonsorg/website
   * branch              customdc_stable -> FETCH_HEAD
   Already up to date.
   ```

1. Create and update the necessary submodules:
   ```
   git submodule update --init --recursive
   ```
   You should see output like the following:
   ```
   Submodule 'import' (https://github.com/datacommonsorg/import.git) registered for path 'import'
   Submodule 'mixer' (https://github.com/datacommonsorg/mixer.git) registered for path 'mixer'
   Submodule path 'import': checked out '7d197583b6ad0dfe0568532f919482527c004a8e'
   Submodule path 'mixer': checked out '478cd499d4841a14efaf96ccf71bd36b74604486'
   ```

### Build the repo locally

Run the following command to build the repo:

<pre>
docker build --tag <var>IMAGE_NAME</var>:<var>IMAGE_TAG</var> \
-f build/cdc_services/Dockerfile .
</pre>

- The image name is a meaningful name, such as `datacommons-services`.
- The image tag is a meaningful description of the version you are building, such as `latest`.

It will take several minutes to build.

To run the container with the local SQLite database, start the Docker container as described below.

To upload and deploy the container to the Cloud, see [Deploy services to Google Cloud](/custom_dc/deploy_cloud.html) for procedures.

## Run the services container locally

Start the services using the locally built repo. If you have made changes to any of the UI components (or directories), be sure to map the `custom` directories (or alternative directories) to the Docker `workspace` directory.

<pre>docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
[-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \]
[-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \]
<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var>
</pre>

## Troubleshooting

Having trouble? Visit our [Troubleshooting Guide](/custom_dc/troubleshooting.html) for detailed solutions to common problems.

