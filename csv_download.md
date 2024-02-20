---
layout: default
title: CSV Bulk Download
nav_order: 70
has_children: false
---

# CSV Bulk Download

We provide access to some of our data in a relational format in a public Google Cloud Storage bucket, which is available for CSV download. The tables are constructed such that each row represents a [Place](https://datacommons.org/browser/Place) and each column represents a [Statistical Variable](https://datacommons.org/browser/StatisticalVariable).

These relational tables are organized by vertical, each within a different zip folder, which can be downloaded from the links below:
* [Agriculture](https://storage.googleapis.com/relational_tables/agriculture.zip)
* [Climate](https://storage.googleapis.com/relational_tables/climate.zip)
* [Crime](https://storage.googleapis.com/relational_tables/crime.zip)
* [Demographics](https://storage.googleapis.com/relational_tables/demographics.zip)
* [Economics](https://storage.googleapis.com/relational_tables/economics.zip)
* [Education](https://storage.googleapis.com/relational_tables/education.zip)
* [Employment](https://storage.googleapis.com/relational_tables/employment.zip)
* [Energy](https://storage.googleapis.com/relational_tables/energy.zip)
* [Health](https://storage.googleapis.com/relational_tables/health.zip)
* [Household](https://storage.googleapis.com/relational_tables/household.zip)
* [Housing](https://storage.googleapis.com/relational_tables/housing.zip)

Each vertical zip folder contains tables for various Place categories: `all` (all places), `us` (US places), `non_us` (non-US places), `county` (US counties), and `zip` (US zip codes). For each vertical and Place category, there are three types of tables:

* `value`: Each cell contains the value of the latest observation for a given Statistical Variable and Place.
* `date`: Each cell contains the date of the latest observation for a given Statistical Variable and Place.
* `provenance`: Each cell contains the provenance URL of the latest observation for a given Statistical Variable and Place, as well as the [measurement method](https://docs.datacommons.org/glossary.html), if provided. Measurement methods that are prefixed with `dcAggregate/` represent Data Commons aggregated values.

The table names follow the pattern `[vertical]_[place_category]_[type]` and are sharded into multiple CSV files. (For example, the file [`demographics_all_date-00000-of-00456.csv`](https://storage.googleapis.com/relational_tables/demographics/demographics_all_date-00000-of-00456.csv) contains a portion of the observation `dates` for `demographics` Statistical Variables and `all` Places. In this case, the table has been sharded into 456 files.)

The corresponding `value`, `date`, and `provenance` tables can be joined using the first three columns, which contain information about the place:
* `place_name`: The name(s) of the Place.
* `place_dcid`: The [Data Commons ID](https://docs.datacommons.org/glossary.html) for the Place.
* `place_type`: The type(s) of the Place.

## Example Table Structure

Below is a subset of the `housing_county_value` table:

| place_name | place_dcid | place_type | Count_HousingUnit | Count_HousingUnit_NoCashRent | ... |
| :---: | :---: | :---: | :---: | :---: | :---: |
|  Nuckolls County | geoId/31129 | County | 2445 | 74 | ... |
| Wells County | geoId/38103 | County | 2422 | 74 | ... |
| ... | ... | ... | ... | ... | ... |

And the corresponding subset of the `housing_county_date` table:

| place_name | place_dcid | place_type | Count_HousingUnit | Count_HousingUnit_NoCashRent | ... |
| :---: | :---: | :---: | :---: | :---: | :---: |
|  Nuckolls County | geoId/31129 | County | 2019 | 2019 | ... |
| Wells County | geoId/38103 | County | 2019 | 2019 | ... |
| ... | ... | ... | ... | ... | ... |

And for the `housing_county_provenance` table:

| place_name | place_dcid | place_type | Count_HousingUnit | Count_HousingUnit_NoCashRent | ... |
| :---: | :---: | :---: | :---: | :---: | :---: |
|  Nuckolls County | geoId/31129 | County | https://www.census.gov/\|CensusACS5yrSurvey | https://www.census.gov/\|CensusACS5yrSurvey | ... |
| Wells County | geoId/38103 | County | https://www.census.gov/\|CensusACS5yrSurvey | https://www.census.gov/\|CensusACS5yrSurvey | ... |
| ... | ... | ... | ... | ... | ... |

The provenance value `https://www.census.gov/|CensusACS5yrSurvey` indicates that the observation comes from [https://www.census.gov/](https://www.census.gov/) using the [CensusACS5yrSurvey](https://datacommons.org/browser/CensusACS5yrSurvey) measurement method.
