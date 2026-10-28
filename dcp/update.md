---
layout: default
title: Update your instance
nav_exclude: true
noindex: true
include_scripts: 
  - /assets/js/user-supplied-variables.js
  - /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Update your instance

## Update deployment infrastructure

Whenever you need to make changes to your deployment, including pointing to a new data input folder, changing the tag or name of the web service image, changing environment variables on the web service, you should always do so using Terraform. 

We recommend that you do not use Cloud Console or gcloud to edit your configuration. If you try to run Terraform again, it will override any changes you have made outside of Terraform. Make all changes inside Terraform to ensure your deployment state is synchronized at all times.

**Important:** Please be sure to read the section below regarding [special resource creation variables](#handle) before proceeding.

To make deployment changes:

1. Edit or add updated variables in your `terraform.tfvars` file.
2. Regenerate GCP credentials if needed.
3. Run `terraform plan` to validate the changes.
4. Run `terraform apply`.
5. If you have made data changes, rerun the data ingestion workflow, which automatically restarts the web service as well:

  ```shell
  uvx datacommons-cli ingest start
  ```

If you have only made changes affecting the web service (such as updating the image container tag) and want to skip running the full ingestion workflow, simply rerun `terraform apply`.

To deploy several Data Commons Platform instances, in multiple environments (e.g. dev, staging, pre-prod etc.), you should use Terraform Workspaces. See [Manage multiple Terraform deployments](https://docs.datacommons.org/custom_dc/deploy_cloud.html#multiple) for details. (Substitute the Terraform modules directory with your Terraform directory.)

### Handle resource creation variables {#handle}

Terraform maintains state across the lifecycle of a deployment. For stateful and shared resources, you need to take care in making changes, because Terraform's update behavior may be unintuitive. In particular:

* `spanner_create_instance`,` storage_create_artifacts_bucket`, `spanner_create_database`. Once you have set any of these to `true` and created the resource, *do not change* them to `false` in subsequent updates to the same deployment. Terraform does not create additional instances each time you run `terraform apply`; it checks its state, sees that the resource already exists, and does not recreate it. 

    On the other hand, if you set any of these to `false` after creation, Terraform will actually destroy the resources without replacing them!  

    If you want to actually *recreate* any of these resources from scratch, do the following:

    1. Run<code> terraform destroy -target <var>RESOURCE_NAME</var></code>.
    2. Make any other changes to Terraform variables.
    3. Rerun `terraform apply`.

* `spanner_create_bigquery_reservation`. This variable is similar to the above, but has additional complications because there can only be a single capacity reservation shared *across an entire project* in the same region. If you try to create additional reservations in the same project, the ingestion workflows will fail. However, like the variables above, if you set it to `false` on the next update, the resource will be destroyed for all deployments.

    The safest way to ensure that all updates and future deployments do not set the variable incorrectly is to remove the resource from Terraform state tracking after it's created. After the first time you have created the reservation, do the following: 

1. From your Terraform directory, run:
    ```shell
    terraform state rm module.stack.module.spanner[0].google_bigquery_reservation.default[0]
    terraform state rm module.stack.module.spanner[0].google_bigquery_reservation_assignment.project_assignment[0]
    ```
1. Set `spanner_create_bigquery_reservation = false` before running `terraform apply` again.
1. In any new deployments in the same project and region, set the variable to `false` from the very start.

## Upgrade your instance to a new version

Data Commons Platform is under ongoing development, with new versions being released frequently, as well as database schema changes that require migration. All container images and the Dataflow template are versioned with the same numbering system, represented as a tag at the end of the image name; for example, <code><var>IMAGE_NAME</var>:1.1.4</code>.

If you'd like to copy and paste the commands below directly to a command line interface, provide the values for the following variables; this will automatically populate all occurrences.

<label for="project">Google Cloud Platform project ID:</label>
<input type="text" id="project" data-bind="project" placeholder="Your GCP project ID" />
<br/>
<label for="instance">Data Commons Platform instance:</label>
<input type="text" id="instance" data-bind="instance" placeholder="Your DCP instance" />
<br/>

To migrate your system to the latest version of the platform, follow this procedure:

1. Go to your project's root directory:
   <pre>cd <span data-var="instance">Your Data Commons instance name</span>
   </pre>
1. Back up your Terraform variables file:
   ```shell
   cp terraform.tfvars terraform.tfvars.backup
   ```
1. Re-generate the Terraform files for the target version:
    <pre>
    uvx datacommons-cli@<var>VERSION_NUMBER</var> admin init \
    --project-id "<span data-var="project">Your GCP project ID</span>" \
    --instance-name "<span data-var="instance">Your Data Commons instance name</span>" \
    --force </pre>
1. Check if there are any new variables in the `terraform.tfvars.template` file that you want to add to your backup file
1. Merge the contents of the backup file with the new `terraform.tfvars` file.
Optionally, verify that all version tags are updated to the correct number:
    ```shell
    cat variables.tf
    cat terraform.tfvars 
    ```
1. Migrate the database by running:
   <pre>
   uvx datacommons-cli@<var>VERSION_NUMBER</var> admin migrate-db</pre>
1. Redeploy all infrastructure by running:
   <pre>
   terraform init -upgrade
   terraform apply
   </pre>
