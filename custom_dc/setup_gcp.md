---
layout: default
title: System Setup
nav_order: 1
parent: Custom Data Commons
published: true
---

## Overview

Custom Data Commons is deployed in Google Cloud Platform (GCP). This manual
describes how to install a custom Data Commons instance in an existing GCP
project (with id `PROJECT_ID`).

### Steps

1. From [Google Cloud Console](https://console.cloud.google.com/), open Cloud
   Shell by clicking on the icon, like below:

   ![fa](/assets/images/custom_dc/install_step_1.png){: width="600" }

1. Set the environment variables `PROJECT_ID` and `CONTACT_EMAIL` in the
   terminal:

   ```bash
   export PROJECT_ID=<project_id>
   export CONTACT_EMAIL=<email_address>
   ```

   ![fa](/assets/images/custom_dc/install_step_2.png){: width="600" }

   Note: If this step fails, please [contact us at with form](https://docs.google.com/forms/d/e/1FAIpQLSeVCR95YOZ56ABsPwdH1tPAjjIeVDtisLF-8oDYlOxYmNZ7LQ/viewform) with the errors.

1. [Optional] The default domain of the instance is
   `<PROJECT_ID>-datacommons.com`. If you want to use an existing custom domain,
   set the environment variable:

   ```bash
   export CUSTOM_DC_DOMAIN=<existing_domain>
   ```

   Later on, you need to create a new DNS record by linking the domain with the
   IP address (from GCP project) from your domain provider.

1. Please run the following installation command inside the terminal. This may
   take up to 20 minutes to complete.

   ```bash
   curl -fsSL https://raw.githubusercontent.com/datacommonsorg/website/custom-dc-v0.3.2/scripts/install_custom_dc.sh -o install_custom_dc.sh && \
   chmod u+x install_custom_dc.sh && \
   ./install_custom_dc.sh
   ```

1. Please [fill out this form](https://docs.google.com/forms/d/e/1FAIpQLSeVCR95YOZ56ABsPwdH1tPAjjIeVDtisLF-8oDYlOxYmNZ7LQ/viewform) to get an API key
   for data access. Store the API key in [Cloud Secret Manager](https://console.cloud.google.com/security/secret-manager) with name `mixer-api-key`.

1. [Optional] Get a Google Maps API key
   ([instruction](https://developers.google.com/maps/documentation/javascript/get-api-key)).
   Store the API key in [Cloud Secret
   Manager](https://console.cloud.google.com/security/secret-manager) with name
   `maps-api-key`. This is used for place search in visualization tools.

1. You should get an email by Google domains that has the section pictured
   below. Please click on “Verify email now”.

   ![fa](/assets/images/custom_dc/install_step_3.png){: width="400" }

   Note: You may not get the verification email if you have verified Cloud
   Domains or Google Domains in the past. If you do not get the verification
   within 10 minutes, check GCP UI to see if the Cloud Domain is active. If it is
   active, then please skip this step. Below is what active Cloud Domains looks
   like.

   ![fa](/assets/images/custom_dc/install_step_4.png){: width="400" }

1. Deploy a default Data Commons Instance:

   First clone the Github repo

   ```bash
   git clone https://github.com/datacommonsorg/website.git
   ```

   Then update fields `project` in
   [custom_dc_template.yaml](https://github.com/datacommonsorg/website/blob/master/deploy/helm_charts/envs/custom_dc_template.yaml)
   with the actual GCP project ID.

   Deploy to GKE by running:

   ```bash
   ./scripts/deploy_gke_helm.sh -e custom_dc_template -l us-central1-a
   ```

   Go to [GCP console](https://console.cloud.google.com/kubernetes/workload/overview) to make sure pods are running successfully.
