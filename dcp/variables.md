---
layout: default
title: Auto-populate variables in this doc set
nav_exclude: true
noindex: true
include_scripts: /assets/js/user-supplied-variables.js
---

# Auto-populate variables in this doc set

To directly copy and paste commands from these pages to a command line interface, enter values for the following Terraform variables. These variables are reused throughout this doc set, so entering values for them here will automatically populate them on all pages.

<label for="projectId">Google Cloud Platform project ID:</label>
<input type="text" id="projectId" class="dyn-input" data-var="project_id" placeholder="Your GCP project ID" />
<br/>
<label for="user">Google user account:</label>
<input type="text" id="user" class="dyn-input" data-var="user" placeholder="Your Google user account" />
<br/>
<label for="namespace">Data Commons Platform instance:</label>
<input type="text" id="instance" class="dyn-input" data-var="instance" placeholder="Your DCP instance" />
<br/>
<label for="region">Region:</label>
<input type="text" id="region" class="dyn-input" data-var="region" placeholder="Your GCP region" />
<br/>
<label for="storageBucket">Google Cloud Storage bucket name:</label>
<input type="text" id="storageBucket" class="dyn-input" data-var="storage_bucket" placeholder="Your GCS bucket" />
<br/>
