---
layout: default
title: Prepare and load your own data
nav_order: 3
parent: Build your own Data Commons
---

{:.no_toc}
# Prepare and load your own data

This page shows you how to format and load your own custom data into your local instance. This is step 2 of the [recommended workflow](/custom_dc/index.html#workflow).


* TOC
{:toc}


## Overview

Custom Data Commons provides a simple mechanism to import your own data, but it requires that the data be provided in a specific format and file structure.

- All data must be in CSV format, using the schema described below.
- You must also provide a JSON configuration file, named `config.json`, to map the CSV contents to the Data Commons schema knowledge graph. The contents of the JSON file are described below.
- All CSV files and the JSON file _must_ be in the same directory

Examples are provided in [`custom_dc/sample`](https://github.com/datacommonsorg/website/tree/master/custom_dc/sample){: target="_blank"} and [`custom_dc/examples`](https://github.com/datacommonsorg/website/tree/master/custom_dc/examples){: target="_blank"} directories.

## Prepare the CSV files {#prepare-csv}

Custom Data Commons provides a simplified data model, which allows your data to be mapped to the Data Commons knowledge graph schema. Data in the CSV files should conform to a _variable per column_ scheme. This requires minimal manual configuration; the Data Commons importer can create observations and statistical variables if they don't already exist, and it resolves all columns to [DCID](/glossary.html#dcid)s.

With the variable-per-column scheme, data is provided in this format, in this exact sequence:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

There are two properties, the _ENTITY_ and the _OBSERVATION_DATE_, that specify the place and time of the observation; all other properties must be expressed as [statistical variables](/glossary.html#variable). To illustrate what this means, consider this example: let's say you have a dataset that provides the number of public schools in U.S. cities, broken down by elementary, middle, secondary and postsecondary. Your data might have the following structure, which we identify as _variable per row_ (numbers are not real, but are just made up for the sake of example):

```csv
city,year,typeOfSchool,count
San Francisco,2023,elementary,300
San Francisco,2023,middle,300
San Francisco,2023,secondary,200
San Francisco,2023,postsecondary,50
San Jose,2023,elementary,400
San Jose,2023,middle,400
San Jose,2023,secondary,300
San Jose,2023,postsecondary,50
```
For custom Data Commons, you need to format it so that every property corresponds to a separate statistical variable, like this:

```csv
city,year,countElementary,countMiddle,countSecondary,countPostSecondary
San Francisco,2023,300,300,200,50
San Jose,2023,400,400,300,0
```

The _ENTITY_ is an existing property in the Data Commons knowledge graph that is used to describe an entity, most commonly a place. The best way to think of the entity type is as a key that could be used to join to other data sets. The column heading can be expressed as any existing place-related property; see [Place types](/place_types.html) for a full list. It may also be any of the special DCID prefixes listed in [Special place names](#special-names). 

> **Note:** The type of the entities in a single file should be unique; do not mix multiple entity types in the same CSV file. For example, if you have observations for cities and counties, put all the city data in one CSV file and all the county data in another one.

The _DATE_ is the date of the observation and should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_. The heading can be anything, although as a best practice, we recommend using a corresponding identifier, such as `year`, `month` or `date`.

The _VARIABLE_ should contain a metric [observation](/glossary.html#observation) at a particular time. We recommend that you try to reuse existing statistical variables where feasible; use the base Data Commons [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"} to find them. If there is no existing statistical variable you can use, name the heading with an illustrative name and the importer will create a new variable for you.

The variable values must be numeric. Zeros and null values are accepted: zeros will be recorded and null values ignored.

All headers must be in camelCase.

### Special place names {#special-names}

In addition to the place names listed in [Place types](/place_types.html), you can also use the following special names:

- [`dcid`](/glossary.html#dcid) --- An already resolved DC ID. Examples:`country/USA`, `geoId/06`
- `country3AlphaCode` --- Three-character country codes. Examples: `USA`, `CHN`
- `geoId` --- Place geo IDs. Examples: `06`, `023`
- `lat#lng` --- Latitude and longitude of the place using the format _lat_#_long_. Example: `38.7#-119.4`
- `wikidataId` --- Wikidata place identifiers. Example: `Q12345`

You can also simply use the heading `name` or `place` and the importer will resolve it automatically.

The following are all valid examples of headers:

```csv
geoId,observationYear,statVar1,statVar2
06,2021,555,666
08,2021,10,10
```

```csv
name,observationYear,statVar1,statVar2
California,2021,555,666
Colorado,2021,10,10
```

```csv
dcId,observationYear,statVar1,statVar2
geoId/06,2021,555,666
geoId/08,2021,10,10
```

## Write the data config file

The config.json file specifies how the CSV contents should be mapped and resolved to the Data Commons schema. See the example in the [`sample/config.json`](https://github.com/datacommonsorg/website/blob/master/custom_dc/sample/config.json){: target="_blank"} file provided, which describes the data in the [`sample/average_annual_wage.csv`](https://github.com/datacommonsorg/website/blob/master/custom_dc/sample/average_annual_wage.csv){: target="_blank"} and [`sample/gender_wage_gap.csv`](https://github.com/datacommonsorg/website/blob/master/custom_dc/sample/gender_wage_gap.csv){: target="_blank"} files.

Here is the general spec for the JSON file:

<pre>
{  
  "inputFiles": {  
    "<var>FILE_NAME1</var>": {  
      "entityType": "<var>ENTITY_PROPERTY</var>",  
      "ignoreColumns": ["<var>COLUMN1</var>", "<var>COLUMN2</var>", ...],  
      "provenance": "<var>NAME</var>",
      "observationProperties" {
        "unit": "<var>MEASUREMENT_UNIT</var>",
        "observationPeriod": "<var>OBSERVATION_PERIOD</var>",
        "scalingFactor": "<var>DENOMINATOR_VALUE</var>",
        "measurementMethod": "<var>METHOD</var>"
      }
    },  
    "<var>FILE_NAME2</var>": {  
     ...  
    },  
 ...  
  "variables": {  
    "<var>VARIABLE1</var>": {"group": "<var>GROUP_NAME1</var>"},  
    "VARIABLE2": {"group": "<var>GROUP_NAME1</var>"},  
    "<var>VARIABLE3</var>": {  
      "name": "<var>DISPLAY_NAME</var>",  
      "description": "<var>DESCRIPTION</var>",  
      "searchDescriptions": ["<var>SENTENCE1</var>", "<var>SENTENCE2</var>", ...],  
      "group": "<var>GROUP_NAME2</var>",  
      "properties": {  
        "<var>PROPERTY_NAME1</var>":"<var>VALUE</var>",  
        "<var>PROPERTY_NAME2</var>":"<var>VALUE</var>",  
         …  
           }  
    },  
  },   
  "sources": {  
    "<var>SOURCE_NAME1</var>": {  
      "url": "<var>URL</var>",  
      "provenances": {  
        "<var>PROVENANCE_NAME1</var>": "<var>URL</var>",  
        "<var>PROVENANCE_NAME2</var>": "<var>URL</var>",  
        ...  
      }  
    }  
  }  
}  
</pre>

Each section contains some required and optional fields, which are described in detail below.

### Input files

The top-level `inputFiles` field should encode a map from the input file name to parameters specific to that file. Keys can be individual file names or wildcard patterns if the same config applies to multiple files.

You can use the `*` wildcard; matches are applied in the order in which they are specified in the config. For example, in the following:

```
{
 "inputFiles": {
    "foo.csv": {...},
    "bar*.csv": {...},
    "*.csv": {...}
  }
}
```

The first set of parameters only applies to `foo.csv`. The second set of parameters applies to `bar.csv`, `bar1.csv`, `bar2.csv`, etc. The third set of parameters applies to all CSVs except the previously specified ones, namely `foo.csv` and `bar*.csv`.

#### Input file parameters

`entityType`

: Required: All entities in a given file must be of a specific type. This type should be specified as the value of the `entityType` field. The importer tries to resolve entities to DCIDs of that type. In most cases, the `entityType` will be a supported place type; see [Place types](../place_types.html) for a list.

`ignoreColumns`

: Optional: The list of column names to be ignored by the importer, if any.

`provenance`

: Required: The provenance (name) of this input file. Provenances typically map to a dataset from a source. For example, `WorldDevelopmentIndicators` provenance (or dataset) is from the `WorldBank` source.

You must specify the provenance details under `sources.provenances`; this field associates one of the provenances defined there to this file.

`observationProperties`

: Optional: Additional information about each contained in the CSV file. Currently, four properties are supported:
- [`unit`](/glossary.html#unit): The unit of measurement used in the observations. This is a string representing a currency, area, weight, volume, etc. For example, `SquareFoot`, `USD`, `Barrel`, etc.
- [`measurementPeriod`](/glossary.html#observation-period): The period of time in which the observations were recorded. This must be in ISO duration format, namely `P[0-9][Y|M|D|h|m|s]`. For example, `P1Y` is 1 year, `P3M` is 3 months, `P3h` is 3 hours.
- [`measurementMethod`](/glossary.html#measurement-method): The method used to gather the observations. This can be a random string or an existing DCID of [`MeasurementMethodEnum`](https://datacommons.org/browser/MeasurementMethodEnum){: target="_blank"} type; for example, `EDA_Estimate` or `WorldBankEstimate`.
- [`scalingFactor`](/glossary.html#scaling-factor): An integer representing the denominator used in measurements involving ratios or percentages. For example, for percentages, the denominator would be `100`. 

Note that you cannot mix different property values in a single CSV file. If you have observations using different properties, you must put them in separate CSV files.

### Variables

The `variables` section is optional. You can use it to override names and associate additional properties with the statistical variables in the files, using the parameters described below. All parameters are optional.

#### Variable parameters {#varparams}

`name`

: The display name of the variable, which will show up in the site's exploration tools. If not specified, the column name is used as the display name.  
The name should be concise and precise; that is, the shortest possible name that allow humans to uniquely identify a given variable. The name is used to generate NL embeddings.

`description`

: A long-form description of the variable.

`properties`

: Additional Data Commons properties associated with this variable. These are Data Commons property entities. See [Representing statistics in Data Commons](https://github.com/datacommonsorg/data/blob/master/docs/representing_statistics.md){: target="_blank"} for more details.

Each property is specified as a key:value pair. Here are some examples:

```json
{
  "populationType": "schema:Person",
  "measuredProperty": "age",
  "statType": "medianValue",
  "gender": "Female"
}
```

`group`

: You can arrange variables in groups, so that they appear together in the Statistical Variables Explorer and other exploration tools. The group name is used as the heading of the group. For example, in the sample data, the group name `OECD` is used to group together the two variables from the two CSV files:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot5.png){: width="250"}

You can have a multi-level group hierarchy by using `/` as a separator between each group.

`searchDescriptions` 

: An array of descriptions to be used for creating more NL embeddings for the variable. This is only needed if the variable `name` is not sufficient for generating embeddings.

### Sources

The `sources` section is optional. It encodes the sources and provenances associated with the input dataset. Each named source is a mapping of provenances to URLs.

#### Source parameters

`url`
: Required: The URL of the named source. For example, for named source `U.S. Social Security Administration`, it would be `https://www.ssa.gov`.

`provenances`
: Required: A set of name:URL pairs. Here are some examples:

```json
{
  "USA Top Baby Names 2022": "https://www.ssa.gov/oact/babynames/",
  "USA Top Baby Names 1923-2022": "https://www.ssa.gov/oact/babynames/decades/century.html"
}
```

## Load local custom data

The following procedures show you how to load and serve your custom data locally.

To load data in Google Cloud, see instead [Load data in Google Cloud](/custom_dc/deploy_cloud.html) for procedures.

### Configure environment variables

Edit the `env.list` file you created [previously](/custom_dc/quickstart.html#env-vars) as follows:
- Set the `INPUT_DIR` variable to the directory where your input files are stored. 
- Set the `OUTPUT_DIR` variable to the directory where you would like the output files to be stored. This can be the same or different from the input directory. When you rerun the Docker data management container, it will create a `datacommons` subdirectory under this directory.

### Start the Docker containers with local custom data {#docker-data}

Once you have configured everything, use the following commands to run the data management container and restart the services container, mapping your input and output directories to the same paths in Docker.

#### Step 1: Start the data management container

In one terminal window, from the root directory, run the following command to start the data management container:

<pre>
docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
gcr.io/datcom-ci/datacommons-data:stable
</pre>

##### (Optional) Start the data management container in schema update mode {#schema-update-mode}

If you have tried to start a container, and have received a `SQL check failed` error, this indicates that a database schema update is needed. You need to restart the data management container, and you can specify an additional, optional, flag, `DATA_RUN_MODE=schemaupdate`. This mode updates the database schema without re-importing data or re-building natural language embeddings. This is the quickest way to resolve a SQL check failed error during services container startup.

To do so, add the following line to the above command:

```
docker run \
...
-e DATA_RUN_MODE=schemaupdate \
...
gcr.io/datcom-ci/datacommons-data:stable
```

Once the job has run, go to step 2 below.

#### Step 2: Start the services container

In another terminal window, from the root directory, run the following command to start the services container:

<pre>
docker run -it \
-p 8080:8080 \
-e DEBUG=true \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
gcr.io/datcom-ci/datacommons-services:stable
</pre>

Any time you make changes to the CSV or JSON files and want to reload the data, you will need to rerun the data management container, and then restart the services container.

### Inspect the SQLite database

If you need to troubleshoot custom data, it is helpful to inspect the contents of the generated SQLite database.

To do so, from a terminal window, open the database:

<pre>sqlite3 <var>OUTPUT_DIRECTORY</var>/datacommons/datacommons.db
</pre>

This starts the interactive SQLite shell. To view a list of tables, at the prompt type `.tables`. The relevant table is `observations`.

At the prompt, enter SQL queries. For example, for the sample OECD data, this query:

```shell
sqlite> select * from observations limit 10;
```
returns output like this:

```shell
country/BEL|average_annual_wage|2000|54577.62735|c/p/1
country/BEL|average_annual_wage|2001|54743.96009|c/p/1
country/BEL|average_annual_wage|2002|56157.24355|c/p/1
country/BEL|average_annual_wage|2003|56491.99591|c/p/1
country/BEL|average_annual_wage|2004|56195.68432|c/p/1
country/BEL|average_annual_wage|2005|55662.21541|c/p/1
...
```

To exit the sqlite shell, press `Ctrl-D`.

