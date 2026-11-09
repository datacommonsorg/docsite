---
layout: default
title: Troubleshoot problems
nav_exclude: true
noindex: true
---

* TOC
{:toc}

{:.no_toc}
# Troubleshoot problems

In general, to troubleshoot any GCP problems, you should go to the Cloud Console for the component causing issues, and find the **Observability** > **Logs** page to look for service errors.

## Preprocessing job failures

1. Go to the link for the workflow output by the  `datacommons ingest start` command.
2. Under **State**, find the stage that has failed. If it fails on **run_preprocessing**, go to the [Cloud Console Batch ](https://console.cloud.google.com/) page for your project, and under **Job list**, look up the processing job. Each workflow run creates a new job named <var>INSTANCE</var>-prep-<var>TIMESTAMP</var></code>.
3. Select the **Logs** tab and check for any errors. Expand the error entries to get more details. See below for solutions to common Data Commons data job errors.

### 401: Unauthorized

This normally indicates a missing, invalid, or expired API key. To check if the API key you have provided in your `terraform.tfvars` file is valid, do the following:

1. In your browser, try to make any REST API call using the key, for example:

    <pre>
    https://api.datacommons.org/v2/node?key=<var>YOUR_API_KEY</var>&nodes=geoId/06&property=%3C-*
    </pre>

    If you see the following error, then your API key is invalid:

    ```
    {"message": "UNAUTHENTICATED: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API. Visit apikeys.datacommons.org to create or manage API keys.", "code": 401}
    ```
2. To look up your key, go to [apikeys.datacommons.org](http://apikeys.datacommons.org){: target="_blank"}, sign in, select your app, and check the status of the key. If it has expired, refresh it. 
3. Copy the key to the `auth-dc-api-key` variable in your `terraform.tfvars` file and rerun `terraform apply`.
4. Rerun `datacommons ingest start`.


### "Metadata Validation Failed: The following referenced provenances are not defined in your MCF files: Please define them in an MCF file (e.g., Node: dcid:YourProvenance)."

If you have actually defined referenced provenances in MCF files, check for the following:

* If your MCF files are in subdirectories and you have not set `includeInputSubdirs = true` in your `config.json` file, the job does not search for them in subdirectories. Add the option to config.json and rerun `datacommons ingest start`.
* Ensure that the DCIDs for the provenance definitions in MCF match those in the `provenance` section of` config.json`. Check for typos. 


### "ValueError: The following expected columns were not found in the CSV: Please check your 'columnMappings' and the CSV header."

This normally indicates that there is a mismatch between the names of the columns you have defined in the `columnMappings` section of your `config.json` file and the actual CSV heading column names. Check for typos and other name errors in your config file.

## Cloud workflow failures

If your Cloud Workflow fails with the following error:

```
"context": "RuntimeError: \"branch error\"\nin step \"run_postprocessings\", routine \"main\", line: 145",
        "payload": {
          "body": {
            "detail": "Aggregation failed: 400 GET https://bigquery.googleapis.com/bigquery/v2/projects/...: Resource Exporting to Cloud Spanner requires a reservation with ENTERPRISE edition or higher."
```

This likely indicates that the BigQuery reservation for your project was deleted from the Terraform deployment where it was originally set, or was never created, in the location where the ingestion workflow runs. To verify that this is the problem:

1. Go to [https://console.cloud.google.com/bigquery](https://console.cloud.google.com/bigquery/admin/reservations){target="_blank"} for your project.
2. From the left panel, select **Workload management**.
3. From the **Capacity Management** tab, from the **Location** menu, select a location.
4. Under **Slot Reservations**, you should see a default entry. If you don't, check all the other locations. If there is no reservation, you need to create one: In your Terraform configuration, set `spanner_create_bigquery_reservation = true` and rerun `terraform apply`. Also see [Handle resource creation variables](update.md#handle) for further details.