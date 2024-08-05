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

- `gcr.io/datcom-ci/datacommons-website-compose:stable`. This is a tested, stable version but may be several weeks old.
- `gcr.io/datcom-ci/datacommons-website-compose:latest`. This is the latest version built from head.

If you want to pick up the latest prebuilt version, do the following:

1. From the root directory (e.g. `website`), run the following command:

   ```shell  
   docker pull gcr.io/datcom-ci/datacommons-website-compose:latest
   ```
1. Rerun the container, specifying that repo as the argument to the `docker run` command:

```shell
docker run -it \
-p 8080:8080 \
-e DEBUG=true \
-env-file $PWD/custom_dc/env.list \
-v $PWD/custom_dc/sample:$PWD/custom_dc/sample \
gcr.io/datcom-ci/datacommons-website-compose:latest
```

## Build a local image {#build-repo}

You will need to build a local image in any of the following cases:
- You are making substantive changes to the website UI
- You are ready to deploy your custom site to GCP

Rather than building from "head", that is, the very latest changes in Github, which may not have been tested, we recommend that you use the tested "release" equivalent of the stable Docker image. This release uses the tag `customdc_stable`, and is available at [https://github.com/datacommonsorg/website/releases/tag/customdc_stable](https://github.com/datacommonsorg/website/releases/tag/customdc_stable).

Note: If you are working on a large-scale customization, we recommend that you use a version control system to manage your code. We provide procedures for Github, and assume the following:
- You have a Github account and project.
- You have created a fork off the base Data Commons `website` repo (https://github.com/datacommonsorg/website) and a remote that points to it, and that you will push to that fork. 


### Sync a local workspace to the stable release

If you are using a version control system other than Github, you can download a ZIP or TAR file from [https://github.com/datacommonsorg/website/releases/tag/customdc_stable](https://github.com/datacommonsorg/website/releases/tag/customdc_stable). 

In Github, use the following procedure.

1. If you want to reuse the root directory you previously created and cloned, skip to step 3. 
If you want to create a new source directory and start from scratch, clone the repo up to the stable release tag:

      <pre>
      git clone https://github.com/datacommonsorg/website --branch customdc_stable --single-branch  [<var>DIRECTORY</var>]
      </pre>
1. Change to the root directory:

   <pre>
   cd website | cd <var>DIRECTORY</var>
   </pre>

1. Create a new branch synced to the stable release:

   <pre>
   git checkout -b <var>BRANCH_NAME</var> customdc_stable
   </pre>

1. To verify that your local repo is at the same version of the code, run the following command:

   ```
   git log --oneline --graph
   ```
   You should see output similar to the following:

   ```
   * 52635c8 (grafted, HEAD -> branch1, tag: customdc_stable) ...
   ...
   ```

   Verify that the last commit in the output matches that listed in [https://github.com/datacommonsorg/website/releases/tag/customdc_stable](https://github.com/datacommonsorg/website/releases/tag/customdc_stable).

1. Press `q` to exit the output log.

1. Create and update the necessary submodules:

   ```
   git submodule foreach git pull origin customdc_stable
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
   You will likely see the following output:

   ```
   From https://github.com/datacommonsorg/website 
   * tag               customdc_stable -> FETCH_HEAD
   Already up to date.
   ```

### Build the repo locally

Run the following command to build the repo:

<pre>
docker build --tag datacommons-website-compose:<var>DOCKER_TAG</var> \
-f build/web_compose/Dockerfile \
-t website-compose .
</pre>

The _DOCKER_TAG_ is a meaningful description of the version you are building.

It will take several minutes to build.

To run the container with the local SQLite database, start the Docker container as described below.

To upload and deploy the container to the Cloud, see [Deploy a custom instance to Google Cloud](/custom_dc/deploy_cloud.html) for procedures.

## Run the custom services container locally

Start the services using the locally built repo. If you have made changes to any of the UI components (or directories), be sure to map the `custom` directories (or alternative directories) to the Docker `workspace` directory.

<pre>  
docker run -it \
--env-file $PWD/custom_dc/env.list \
-p 8080:8080 \
-e DEBUG=true \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
[-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom \]
[-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom \]
datacommons-website-compose:<var>DOCKER_TAG</var>
</pre>
