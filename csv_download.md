---
layout: default
title: CSV Download
nav_order: 6
has_children: false
---

# CSV Download

We provide access to some of our data in a relational format, which is available for CSV download in a [public Google Cloud Storage bucket](https://console.cloud.google.com/storage/browser/relational_tables). The tables are constructed such that each row represents a [Place](https://datacommons.org/browser/Place) and each column represents a [Statistical Variable](https://datacommons.org/browser/StatisticalVariable).

The public bucket is organized by vertical, each in a different folder:
* [Demogaphics](https://console.cloud.google.com/storage/browser/relational_tables/demographics)
* [Education](https://console.cloud.google.com/storage/browser/relational_tables/education)
* [Employment](https://console.cloud.google.com/storage/browser/relational_tables/employment)
* [Health](https://console.cloud.google.com/storage/browser/relational_tables/health)
* [Housing](https://console.cloud.google.com/storage/browser/relational_tables/housing)

Each vertical folder contains tables for various Place categories: `all` (all places), `us` (US places), `non_us` (non-US places), `county` (US counties), and `zip` (US zip codes). For each vertical and Place category, there are three types of tables:
* `value`: Each cell contains the value of the latest observation for a given Statistical Variable and Place.
* `date`: Each cell contains the date of the latest observation for a given Statistical Variable and Place.
* `provenance`: Each cell contains the provenance of the latest observation for a given Statistical Variable and Place, as well as the [measurement method](https://datacommons.org/browser/measurementMethod), if provided. Measurement methods that are prefixed with `dcAggregate/` represent Data Commons aggregated values.

The corresponding `value`, `date`, and `provenance` tables can be joined using the first three columns, which contain information about the place:
* `place_name`: The name(s) of the Place.
* `place_dcid`: The [Data Commons ID](https://docs.datacommons.org/glossary.html) for the Place.
* `place_type`: The type(s) of the Place.
