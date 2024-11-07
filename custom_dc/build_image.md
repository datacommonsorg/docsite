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

- `gcr.io/datcom-ci/datacommons-services:stable`. This is a tested, stable version but may be several weeks old.
- `gcr.io/datcom-ci/datacommons-services:latest`. This is the latest version built from head.

If you want to pick up the latest prebuilt version, do the following:

1. From the root directory (e.g. `website`), run the following command:

   ```shell  
   docker pull gcr.io/datcom-ci/datacommons-services:latest
   ```
1. Rerun the container, specifying that repo as the argument to the `docker run` command:

   ```shell
   docker run -it \
   -p 8080:8080 \
   -e DEBUG=true \
   --env-file $PWD/custom_dc/env.list \
   -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
   -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
   gcr.io/datcom-ci/datacommons-services:latest
   ```

## Build a local image {#build-repo}
You will need to build a local image in any of the following cases:
- You are making substantive changes to the website UI
- You are ready to deploy your custom site to GCP

Rather than building from the master branch, which includes the very latest changes in Github, that may not have been tested, we recommend that you use the tested "stable" branch equivalent of the stable Docker image. This branch is `customdc_stable`, and is available at [https://github.com/datacommonsorg/website/tree/customdc_stable](https://github.com/datacommonsorg/website/tree/customdc_stable){: target="_blank"}.

> **Note:** If you are working on a large-scale customization, we recommend that you use a version control system to manage your code. We provide procedures for Github.

### Sync a local workspace to the stable release

#### Clone the stable branch only

Use this procedure if you are not using Github, or if you are using Github and want to create a new source directory and start from scratch. If you are using Github and want to use the same directory and files you previously cloned, skip to the next section.

1. Run the following command:
   <pre>
   git clone https://github.com/datacommonsorg/website --b customdc_stable --single-branch  [<var>DIRECTORY</var>]
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
   Rather than developing on this default branch, we recommend that you create another branch, as described in the next step.

#### Create a remote and sync a local branch to the stable branch

This procedure assumes that you are using Github, with the following setup:
- You are using the default `origin` as the remote that points to the `datacommons.org/website` repo.
- You have created a forked repo, and a remote that pushes to it, that you use for development.

1. Create a new branch synced to the stable branch:
   <pre>
   cd website | cd <var>DIRECTORY</var>
   git checkout -b <var>BRANCH_NAME</var> origin/customdc_stable
   </pre>
1. Verify that the branch is set up correctly:
   ```
   git log --oneline
   ```
   You should see output like the following:
   ```
   83732891 (HEAD -> mynewbranch, origin/customdc_stable) 2024-11-06 Custom DC stable release (#4710)
   ```
   Press `q` to quit.

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
1. Update all other files:
   ```
   git pull origin customdc_stable
   ```
   You should see output like the following:
   ```
   From https://github.com/datacommonsorg/website
   * branch              customdc_stable -> FETCH_HEAD
   Already up to date.
   ```
1. To ensure your fork is synced only to the stable branch when you push to it, create a remote as follows:
   <pre>
   git remote add -t customdc_stable <var>REMOTE_NAME</var> <var>FORK_URL</var>
   </pre>

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

<pre>  
docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
[-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \]
[-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \]
<var>IMAGE_NAME</var>:<var>IMAGE_TAG</var>
</pre>
