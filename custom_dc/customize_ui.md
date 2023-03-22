---
layout: default
title: Customize UI
nav_order: 4
parent: Custom Data Commons
published: true
---

## Overview

Custom Data Commons allows customization of the web pages on top of
[datacommons.org](https://datacommons.org). The customization includes overall
color scheme, home page content, landing pages of timeline/scatter/map tools
and etc.

## Environment Setup

Fork [datacommonsorg/website](https://github.com/datacommonsorg/website) Github
repo following [these
instructions](https://github.com/datacommonsorg/website#github-workflow) into a
new repo, which will be used as the custom Data Commons codebase. Custom Data
Commons development and deployment will be based on this forked repo.

To test codes in a local environment, follow this
[guide](https://github.com/datacommonsorg/website/blob/master/docs/developer_guide.md#local-development-with-flask).
Note to use `-e custom` flag when starting local Flask server:

```bash
./run_server.sh -e custom
```

## Update UI Code

### Update Header, Footer and Page Content

Page header and footer can be customized in
[base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html)
by updating the html element within `<header></header>` and `<footer></footer>`.
Homepage can be customized in
[homepage.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html).

### Update CSS and Javascript

The custom Data Commons provides an
[overrides.css](https://github.com/datacommonsorg/website/tree/master/static/custom_dc/custom/overrides.css)
to override CSS styles. More style changes can be added to that file.

To add more site customization, can put CSS and Javascript files under folder
[/static/custom_dc/custom](https://github.com/datacommonsorg/website/tree/master/static/custom_dc/custom).
Then include these files in the `<head>` section of the corresponding html files
as

```html
<link href="/custom_dc/custom/<custom_additional>.css" rel="stylesheet" />
```

or

```html
<script src="/custom_dc/custom/<custom_additional>.js"></script>
```

## Deploy to GCP

### One Time Setup

- Install the following tools:

  - [`gcloud`](https://cloud.google.com/sdk/docs/install)
  - [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  - [`kustomize`](https://kustomize.io/)
  - [`yq` 4.x](https://github.com/mikefarah/yq#install)

- Install gke-gcloud-auth-plugin

  - `gcloud components install gke-gcloud-auth-plugin`

### Deploy Local Change

After testing locally, follow the instructions below to deploy to GCP.
`project_id` refers to the GCP project where custom Data Commons is installed.

- Git commit all local changes (no need to push to Github repo). Later steps
  will build docker image based on the hash of this commit.

- Run the following code to build and push docker images to the Container
  Registry.

  ```bash
  ./scripts/push_image.sh <project_id>
  ```

  Follow the link from the log to check the status until the push is complete.

- Deploy the website to GKE:

  ```bash
  ./scripts/deploy_gke.sh -p <project_id>
  ```

  Check the deployment from GKE console. Once it's done, check the UI changes
  from the website.
