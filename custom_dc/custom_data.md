---
layout: default
title: Prepare and load your own data
nav_order: 3
parent: Build your own Data Commons
---

{:.no_toc}
# Prepare and load your own data

This page shows you how to format and load your own custom data into your local instance. This is step 2 of the [recommended workflow](/custom_dc/index.html#workflow).

Please also see the sample data and files provided in [custom_dc/sample](https://github.com/datacommonsorg/website/tree/master/custom_dc/sample){: target="_blank"}.

* TOC
{:toc}

## Overview

Custom Data Commons requires that you provide your data in a specific schema, format, and file structure. We strongly recommend that, before proceeding, you familiarize yourself with the basics of the Data Commons data model by reading through [Key concepts](/data_model.html), in particular, _entities_, _statistical variables_, and _observations_.

At a high level, you need to provide the following:

- If you need to define your own statistical variables (metrics), you need to provide [MCF (Meta Content Framework)](https://en.wikipedia.org/wiki/Meta_Content_Framework){: target="_blank"} files.
- All observations data must be in CSV format, using the schema described later. 
- You must also provide a JSON configuration file, named `config.json`, that specifies how to map and resolve the CSV contents to the Data Commons schema knowledge graph. The contents of the JSON file are described below.

If you need to define new custom entities, please see [Define custom entities](custom_entities.md) for details.

{: #dir}
### Files and directory structure

You can have as many CSV and MCF files as you like, and they can be in multiple subdirectories (with an additional [configuration option](#subdirs)). There must only be one JSON config file, in the top-level input directory. For example:

```
my_data/
├── config.json
├── nodes1.mcf
├── datafile1.csv
├── datafile2.csv
└── some_more_data/
    ├── nodes2.mcf
    ├── datafile3.csv
    └── datafile4.csv
```
The following sections walk you through the process of setting up your data. 

## Prerequisite steps

The following sections describe the high-level conceptual work you need to do before starting to write your data and config files.

{: entities}
### Step 0.1: Determine whether you need new entities or entity types

Data Commons is optimized to support aggregations of data at geographical levels, such as city, state, country, and so on. If your data is aggregated by place, these are supported as entities out of the box. If, however, you want to aggregate data for entities that are _not_ places, then you may need to define new entities, and possibly even entity types.

In addition, even if you aggregate by geographical area, you may want to measure things (known as a "population type" in the graph) that are not already in the graph. In that case, you might want to to define a new entity type, so that you can join with other data sets that measure the same thing. For example, let's say you have a metric that counts the number of beds in hospitals. The existence of the `Bed` entity type allows you to join your data with other sources with a similar metric. 

#### Entities and entity types

Schema.org and the base Data Commons knowledge graph define entity types for just about everything in the world. An _entity type_ is a high-level concept, and is derived directly from a [`Class`](https://datacommons.org/browser/Class){: target="_blank"} type. The most common entity types in Data Commons are place types, such as `City`, `Country`, `AdministrativeArea1`, etc. Examples of other entity types are `Hospital`, `PublicSchool`, `Company`, `BusStation`, `Campground`, `Library` etc. It is rare that you would need to create a new entity type, unless you are working in a highly specialized domain.

An _entity_ is an instance of an entity type. For example, for `PublicSchool`, base Data Commons has many U.S. schools in its knowledge graph, such as [`nces/010162001665`](https://datacommons.org/browser/nces/010162001665){: target="_blank"} (Adams Elementary School) or [`nces/010039000201`](https://datacommons.org/browser/nces/010039000201){: target="_blank"} (Wylam Elementary School). Base Data Commons contains thousands of places and other entities, but it's possible that it does not have specific entities that you need. For example, it has about 100 instances of `Company`, but you may want data for other companies besides those. As another example, let's say your organization wants to collect (possibly private) data about different divisions or departments of your org; in this case you would need to define entities for them.

> **Note:** You should always reuse existing entity types and entities from base Data Commons rather than re-defining them. This way, you get all the properties already defined for those entities and all their linked nodes, and can more easily join with base data if needed.

{: #search}
#### Search for an existing entity / entity type

Unfortunately, it is currently not possible to get a full list of entity types or entities in the Data Commons UI. To do a complete search for an entity type or entity, you need to use the REST or Python APIs. 

To search using the REST APIs:

1. Use the Node API through your browser to get a complete list of entity types: see [Get a list of all existing entity types](/api/rest/v2/node.html#list-entity-types) in the REST API V2 reference. Be sure to set the `nextToken` parameter until you find the relevant entity type or no `nextToken` is returned in the response. If you don't find an entity type that matches your needs (very rare), you will need to [create one](custom_entities.md). 
1. If you find a relevant entity type, note the DCID of the entity type of interest. The DCID of entity types is usually a meaningful name, capitalized, such as `Hospital` or `PowerPlant` or `PublicSchool`.
1. Use the Node API through your browser to look up all incoming arcs by the `typeof` property: 

    <pre>https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>ENTITY_TYPE</var>&property=<-typeOf</pre>
    _ENTITY_TYPE_ is the DCID you've obtained in the previous step, such as `Hospital` or `PublicSchool`. For example:
    ```
    https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=PublicSchool&property=<-typeOf
    ```
1. If your entity is listed, note its DCID. If you are unable to find a relevant entity, you will need to create one. See [Work with custom entities](custom_entities.md) for complete information.

To search using the Python APIs:

1. Start your Python interactive environment and [create a client for the base Data Commons](/api/python/v2/index.html).
1. Call the `Node` method `fetch_all_classes`: see [Get node properties](https://docs.datacommons.org/api/python/v2/node.html#fetch_all_classes) for details. (Tip: Use the `to_dict()` method on the response to get readable output.) If you don't find an entity type that matches your needs (very rare), you will need to [create one](custom_entities.md). 
1. If you find a relevant entity type, note the DCID of the entity type of interest. The DCID of entity types is usually a meaningful name, capitalized, such as `Hospital` or `PowerPlant` or `PublicSchool`.
1. Use the `fetch_property_values` method to find all the instances of the type:

    <pre>client.node.fetch_property_values(node_dcids="<var>ENTITY_TYPE</var>", properties="typeOf", out=False)</pre>
    _ENTITY_TYPE_ is the DCID you've obtained in the previous step. For example:
    ```
    client.node.fetch_property_values(node_dcids="PublicSchool", properties="typeOf", out=False)
    ```
1. If your entity is listed, note its DCID. If you are unable to find a relevant entity, you will need to create one. See [Work with custom entities](custom_entities.md) for complete information.

### Step 0.2: Identify your statistical variables

Your data undoubtedly contains metrics and observed values. In Data Commons, the metrics themselves are known as statistical variables, and the time series data, or values over time, are known as observations. While observations are always numeric, statistical variables must be defined as _nodes_ in the Data Commons knowledge graph.  

Data Commons already has thousands of statistical variables in its knowledge graph; you may be able to simply reuse existing ones. To browse and search for existing variables, see the [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"}. 

If you do need to define a statistical variable, it must follow a certain model. The variable consists of a measure (e.g. "median age") on a set of things of a certain type (e.g. "persons") that satisfy some set of constraints (e.g. "gender is female"). To explain what this means, consider the following example. Let's say your dataset contains the number of schools in U.S. cities, broken down by level (elementary, middle, secondary) and type (private, public), reported for each year (numbers are not real, but are just made up for the sake of example):

| CITY | YEAR | SCHOOL_TYPE | SCHOOL_LEVEL | COUNT |
|------|------|----------------|-------|
| San Francisco | 2023 | public | elementary | 300 |
| San Francisco | 2023 | public | middle | 300 |
| San Francisco | 2023 | public | secondary | 200 |
| San Francisco | 2023 | private | elementary | 100 |
| San Francisco | 2023 | private | middle | 100 |
| San Francisco | 2023 | private | secondary | 50 |
| San Jose | 2023 | public | elementary | 400 |
| San Jose | 2023 | public | middle | 400 |
| San Jose | 2023 | public | secondary | 300 |
| San Jose | 2023 | private | elementary | 200 |
| San Jose | 2023 | private | middle | 200 |
| San Jose | 2023 | private | secondary | 100 |

The measure here is a simple count; the set of things is "schools"; and the constraints are the type and levels of the schools, namely "public", "private", "elementary", "middle" and "secondary". All of these things must be encoded as separate variables. Therefore, although the _properties_ of school type and school level may already be defined in the Data Commons knowledge graph (or you may need to define them), they _cannot_ be present as columns in the CSV files that you store in Data Commons. Instead, you must create separate "count" variables to represent each case. In our example, you would actually need 6 different variables:
- `Count_School_Public_Elementary`
- `Count_School_Public_Middle`
- `Count_School_Public_Secondary`
- `Count_School_Private_Elementary`
- `Count_School_Private_Middle`
- `Count_School_Private_Secondary`

If you wanted totals or subtotals of combinations, you would need to create additional variables for these as well.

#### Variable schema

Data Commons uses a schema that is called "variable-per-row". This means that every distinct entity-variable pair must appear in a different row. Here's an example:

**Variable-per-row schema**

| CITY | YEAR |  VARIABLE | OBSERVATION |
|------|------|-----------|-------|
| geoId/0667000 | 2023 | Count_School_Public_Elementary | 300 |
| geoId/0667000 | 2023 | Count_School_Public_Middle | 300 |
| geoId/0667000 | 2023 | Count_School_Public_Secondary | 200 |
| geoId/0667000 | 2023 | Count_School_Private_Elementary | 100 |
| geoId/0667000 | 2023 | Count_School_Private_Middle | 100 |
| geoId/0667000 | 2023 | Count_School_Private_Secondary | 50 |
| geoId/06085 | 2023 | Count_School_Public_Elementary | 400 |
| geoId/06085 | 2023 | Count_School_Public_Middle | 400 |
| geoId/06085 | 2023 | Count_School_Public_Secondary | 300 |
| geoId/06085 | 2023 | Count_School_Private_Elementary | 200 |
| geoId/06085 | 2023 | Count_School_Private_Middle | 200 |
| geoId/06085 | 2023 | Count_School_Private_Secondary | 100 |

The names and order of the columns aren't important, as you can map them to the expected columns in the JSON file. However, the city and variable names must be existing DCIDs. If such DCIDs don't already exist in the base Data Commons, you must provide definitions of them in MCF files.

> **Tip:** If your raw data does not conform to this structure (which is typically the case if you have relational data), you can usually easily convert the data by creating a pivot table (and renaming some columns) in a tool like Google Sheets or Microsoft Excel. 

## Prepare your data

Nodes in the Data Commons knowledge graph are defined in Metadata Content Format (MCF). For custom Data Commons, if you need to define new statistical variables, you must define them as new _nodes_ using MCF. When you define any variable in MCF, you explicitly assign it a DCID.

You can define your statistical variables in a single MCF file, or split them into as many separate MCF files as you like. MCF files must have a `.mcf` suffix. 

In this section, we will walk you through a concrete example of how to go about setting up your MCF, CSV, and JSON files.

{: #mcf}
### Step 1: Define statistical variables in MCF (if needed)

Nodes in the Data Commons knowledge graph are defined in Metadata Content Format (MCF) files. MCF files must have a `.mcf` suffix. The importer will automatically find them when you start the Docker data container.

Here's an example of defining some statistical variables representing data in a UN WHO dataset. It defines 3 statistical variable nodes. 

```
Node: dcid:who/Adult_curr_cig_smokers
typeOf: dcid:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%)"
populationType: dcid:Person
measuredProperty: dcid:percent

Node: dcid:who/Adult_curr_cig_smokers_female
typeOf: dcid:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%) [Female]"
populationType: dcid:Person
measuredProperty: dcid:percent
gender: dcid:Female

Node: dcid:who/Adult_curr_cig_smokers_male
typeOf: dcid:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%) [Male]"
populationType: dcid:Person
measuredProperty: dcid:percent
gender: dcid:Male
```
The order of nodes and fields within nodes does not matter.

The following fields are always required:
- `Node`: This is the DCID of the entity you are defining. We recommend that you add an optional prefix, separated by a slash (/), for example, `who/`, to differentiate your custom variables from base DC variables. The prefix acts as a namspace, and should represent your organization, dataset, project, or whatever makes sense for you.  
- `typeOf`: In the case of statistical variable, this is always `dcid:StatisticalVariable`. 
- `name`: This is the descriptive name of the variable, that is displayed in the Statistical Variable Explorer and various other places in the UI. 
- `populationType`: This is the type of thing being measured, and its value must be an existing `Class` type. It is mainly used to classify variables into categories that appear in the Statistical Variable Explorer. In this example it is `dcid:Person`. To get a full list of existing entity types, see the section on [searching](#search) above.
- `measuredProperty`: This is a property of the thing being measured. It must be a `domainIncludes` property of the `populationType` you have specified. In this example, it is the `percent` of persons being measured. 
  You can see the set of `domainIncludes` properties for a given `populationType`, using either of the following methods:
  - Go to <code>https://datacommons.org/browser/<var>POPULATION_TYPE</var></code>, e.g. <https://datacommons.org/browser/Person>{: target="_blank"} and scroll to the `domainIncludes` section of the page. For example: 

    ![domain incudes](/assets/images/custom_dc/customdc_screenshot9.png){: width="800"}

  - Use the [Node API](/api/rest/v2/node.html#wildcard), filtering on `domainIncludes` incoming arcs: <code>https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>POPULATION_TYPE</var>&property=%3C-domainIncludes</code>, e.g. <https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Person&property=%3C-domainIncludes>{: target="_blank"}.

Note that all fields that reference another node in the graph must be prefixed by `dcid:` or `dcs:`, which are interchangeable. All fields that do not reference another node must be in quotation marks.

The following fields are optional:
- `description`: A more detailed textual description of the variable.
- `statType`: By default this is `dcid:measuredValue`, which is simply a raw value of an observation. If your variable is a calculated value, such as an average, a minimum or maximum, you can use `minValue`, `maxValue`, `meanValue`, `medianValue`, `sumvalue`, `varianceValue`, `marginOfError`, `stdErr`. In this case, your data set should only include the observations that correspond to those calculated values. 
- `measurementQualifier`: This is similar to the [`observationPeriod`](#exp_csv) field for CSV files and applies to all observations of the variable. It can be any string representing additional properties of the variable, e.g. `Weekly`, `Monthly`, `Annual`. For instance, if the `measuredProperty` is income, you can use `Annual` or `Monthly` to distinguish income over different periods. If the time interval affects the meaning of variable and and values change significantly by the time period, you should use this field keep them separate.
- `measurementDenominator`: For percentages or ratios, this refers to another statistical variable. For example, for per-capita, the `measurementDenominator` is `Count_Person`.

Additionally, you can specify any number of property-value pairs representing the constraints on the type identified by `populationType`. In our example, there is one constraint property, `gender`, which is a property of `Person`. The constraint property values are typically enumerations; such as `genderType`, which is a `rangeIncludes` property of `gender`. These will become additional sub-categories of the population type and displayed as such in the Statistical Variable Explorer. Using our example:

![Stat Var Explorer](/assets/images/custom_dc/customdc_screenshot10.png){: width="600"}

#### (Optional) Define a statistical variable group {#statvar-group}

If you would like to display variables in specific named groups, you can create a statistical variable group. You can actually define a hierarchical tree of categories this way.

Here is an example that defines a single group node with the heading "WHO" and assigns all 3 statistical variables to the same group.

```
Node: dcid:who/Adult_curr_cig_smokers
...
memberOf: dcid:who/g/WHO

Node: dcid:who/Adult_curr_cig_smokers_female
...
memberOf:dcid:who/g/WHO

Node: dcid:who/Adult_curr_cig_smokers_male
...
memberOf: dcid:who/g/WHO

Node: dcid:who/g/WHO
typeOf: dcid:StatVarGroup
name: "WHO"
specializationOf: dcid:dc/g/Root

```
You can define as many statistical variable group nodes as you like. Each must include the following fields:

- `Node`: This is the DCID of the group you are defining. It must be prefixed by `g/` and may include an additional prefix before the `g`.
- `typeOf`: In the case of statistical variable group, this is always `dcid:StatVarGroup`. 
- `name`: This is the name of the heading that will appear in the Statistical Variable Explorer. 
- `specializationOf`: For a top-level group, this must be `dcid:dc/g/Root`, which is the root group in the statistical variable hierarchy in the Knowledge Graph.To create a sub-group, specify the DCID of another node you have already defined. For example, if you wanted to create a sub-group of `WHO` called `Smoking`, you would create a "Smoking" node with `specializationOf: dcid:who/g/WHO`. Here's an example:

```
Node: dcid:who/g/WHO
typeOf: dcs:StatVarGroup
name: "WHO"
specializationOf: dcid:dc/g/Root

Node: dcid:who/g/Smoking
typeOf: dcs:StatVarGroup
name: "Smoking"
specializationOf: dcid:who/g/WHO
```

You can also assign a variable to as many group nodes as you like: simply specify a comma-separated list of group DCIDs in the `memberOf`. For example, to assign the 3 variables to both groups:

```
Node: dcid:who/Adult_curr_cig_smokers
...
memberOf: dcid:who/g/WHO, dcid:who/g/Smoking

Node: dcid:who/Adult_curr_cig_smokers_female
...
memberOf: dcid:who/g/WHO, dcid:who/g/Smoking

Node: dcid:who/Adult_curr_cig_smokers_male
...
memberOf: dcid:who/g/WHO, dcid:who/g/Smoking
```

{: #exp_csv}
### Step 2: Prepare the CSV observation files

CSV files contain the following columns using the following headings:

`entity, variable, date, value` [`, unit`] [`, scalingFactor`] [`, measurementMethod`] [`, observationPeriod`]

The columns can be in any order, and you can specify custom names for the headings and use the `columnMappings` field in the JSON file to map them accordingly (see below for details).

These columns are required:
- `entity`: The DCID of an existing entity in the Data Commons knowledge graph, typically a place.
- `variable`: The DCID of an existing variable or the node you have defined in the MCF
- `date`: The date of the observation. This should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_. 
- `value`: See [Observation values](#obs) for valid values of this column. 

> **Note:** The type of the entities in a single file should be unique; do not mix multiple entity types in the same CSV file. For example, if you have observations for cities and counties, put all the city data in one CSV file and all the county data in another one.

These columns are optional, and allow you to specify additional per-observation properties:

- [`unit`](/glossary.html#unit): The unit of measurement used in the observations. This is a string representing a currency, area, weight, volume, etc. For example, `SquareFoot`, `USD`, `Barrel`, etc.
- [`observationPeriod`](/glossary.html#observation-period): The period of time in which the observations were recorded. This must be in ISO duration format, namely `P[0-9][Y|M|D|h|m|s]`. For example, `P1Y` is 1 year, `P3M` is 3 months, `P3h` is 3 hours.
- [`measurementMethod`](/glossary.html#measurement-method): The method used to gather the observations. This can be a random string or an existing DCID of [`MeasurementMethodEnum`](https://datacommons.org/browser/MeasurementMethodEnum){: target="_blank"} type; for example, `EDA_Estimate` or `WorldBankEstimate`.
- [`scalingFactor`](/glossary.html#scaling-factor): An integer representing the denominator used in measurements involving ratios or percentages. For example, for percentages, the denominator would be `100`. 

Here is an example of some real-world data from the WHO on the prevalance of smoking in adult populations, broken down by sex, in the correct CSV format:

```csv
SERIES,GEOGRAPHY,TIME_PERIOD,OBS_VALUE
dcs:who/Adult_curr_cig_smokers_female,dcid:country/AFG,2019,1.2
dcs:who/Adult_curr_cig_smokers_male,dcid:country/AFG,2019,13.4
dcs:who/Adult_curr_cig_smokers,dcid:country/AFG,2019,7.5
dcs:who/Adult_curr_cig_smokers_female,dcid:country/AGO,2016,1.8
dcs:who/Adult_curr_cig_smokers_male,dcid:country/AGO,2016,14.3
dcs:who/Adult_curr_cig_smokers_female,dcid:country/ALB,2018,4.5
dcs:who/Adult_curr_cig_smokers_male,dcid:country/ALB,2018,35.7
dcs:who/Adult_curr_cig_smokers_male,dcid:country/ARE,2018,11.1
dcs:who/Adult_curr_cig_smoking_female,dcid:country/ARE,2018,1.6
dcs:who/Adult_curr_cig_smokers,dcid:country/ARE,2018,6.3
```

In this case, the columns need to be mapped to the expected columns listed above; see below for details.

#### Observation values {#obs}

Here are the rules for observation values:
- Variable values must be numeric. Do not include any special characters such as `*` or `#`.
- Zeros are accepted and recorded.
- For null or not-a-number values, we recommend that you use blanks. (The strings `NaN`, `NA`, and `N/A` are also accepted.) These values will be ignored and not displayed in any charts or tables.
- Do not use negative numbers or inordinately large numbers to represent NaNs or nulls.

### Step 3: Write the JSON config file

You must define a `config.json` in the top-level directory where your CSV files are located. You need to provide these specifications:
- The input files location and entity type
- The sources and provenances of the data
- Column mappings, if you are using custom names for the column headings

Here is an example of how the config file would look for the CSV file we defined above. More details are below.

```json
{
  "inputFiles": {
    "adult_cig_smoking.csv": {
      "provenance": "UN_WHO",
      "format": "variablePerRow",
      "columnMappings": {
        "variable": "SERIES",
        "entity": "GEOGRAPHY",
        "date": "TIME_PERIOD",
        "value": "OBS_VALUE"
      }
    }
  },
  "groupStatVarsByProperty": true,
  "sources": {
    "custom.who.int": {
      "url": "https://custom.who.int",
        "provenances": {
          "UN_WHO": "https://custom.who.int/data/gho/indicator-metadata-registry/imr-details/6128"
        }
    }
  }
}
```

The following fields are required:
- `input_files`:
  - `format` must be `variablePerRow`
  - `columnMappings` are required if you have used custom column heading names. The format is <var>DEFAULT_NAME</var> : <var>CUSTOM_NAME</var>.

The following is optional:
- `groupStatVarsByProperty` allows you to group your variables together according to population type. They will be displayed together in the Statistical Variable Explorer.

Note that you don't specify your MCF files as input files; the Data Commons importer will identify them automatically.

The other fields are explained in the [Data config file specification reference](config.md).

{: #loadlocal}
## Load local custom data

The following procedures show you how to load and serve your custom data locally.

To load data in Google Cloud, see instead [Load data in Google Cloud](/custom_dc/deploy_cloud.html) for procedures.

### Configure environment variables

Edit the `env.list` file you created [previously](/custom_dc/quickstart.html#env-vars) as follows:
- Set the `INPUT_DIR` variable to the full path to the directory where your input files are stored. 
- Set the `OUTPUT_DIR` variable to the full path to the directory where you would like the output files to be stored. This can be the same or different from the input directory. When you rerun the Docker data management container, it will create a `datacommons` subdirectory under this directory.

### Start the Docker containers with local custom data {#docker-data}

Once you have configured everything, just run the `run_cdc_dev_docker.sh` script again. For reference, we provide the Docker commands invoked by the script below.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
       <pre>./run_cdc_dev_docker.sh</pre>
      </div>
    <div>
    <pre>
    docker run \
    --env-file $PWD/custom_dc/env.list \
    -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
    -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
    gcr.io/datcom-ci/datacommons-data:stable
    </pre>
    <pre>
    docker run -it \
    -p 8080:8080 \
    -e DEBUG=true \
    --env-file $PWD/custom_dc/env.list \
    -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
    -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
    gcr.io/datcom-ci/datacommons-services:stable
    </pre>   
   </div>
  </div>
</div>

> **Note:** Any time you make changes to the CSV or JSON files and want to reload the data, you need to restart both containers.

{:.no_toc}
#### (Optional) Start the data management container in schema update mode {#schema-update-mode}

If you have tried to start a container, and have received a `SQL check failed` error, this indicates that a database schema update is needed. You need to restart the data management container, and you can specify an additional, optional, flag. This mode updates the database schema without re-importing data or re-building natural language embeddings. This is the quickest way to resolve a SQL check failed error during services container startup.

<div class="gcp-tab-group">
  <ul class="gcp-tab-headers">
    <li class="active">Bash script</li>
    <li>Docker commands</li>
  </ul>
  <div class="gcp-tab-content">
      <div class="active">
       <pre>./run_cdc_dev_docker.sh --schema_update</pre>
      </div>
    <div>
    <pre>
    docker run \
    --env-file $PWD/custom_dc/env.list \
    -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
    -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
    -e DATA_RUN_MODE=schemaupdate
    gcr.io/datcom-ci/datacommons-data:stable
    </pre>
    <pre>
    docker run -it \
    -p 8080:8080 \
    -e DEBUG=true \
    --env-file $PWD/custom_dc/env.list \
    -v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
    -v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
    gcr.io/datcom-ci/datacommons-services:stable
    </pre>   
   </div>
  </div>
</div>

{: #verify}
### Verify your data

If the servers have started up without errors, check to ensure that your data is showing up as expected.

1. Verify statistical variables: go to the [Statistical Variable Explorer](https://localhost:8080/tools/statvar){: target="_blank"} to verify that your statistical variables are showing up correctly. You should see something like this:

  ![](/assets/images/custom_dc/customdc_screenshot11.png){: width="400"}
1. Click on a variable name to get more information on the right panel.
1. Verify that your observations are loaded: Click on an **Example Place** link to open the detailed page for that place. Scroll to the bottom, where you should see a timeline graph of observations for the selected place.
1. Verify natural-language querying: go to the [Search page](https://localhost:8080/tools/explore){: target="_blank"} and enter a query related to your data. You should get relevant graphs using your data.

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

<script src="/assets/js/customdc-doc-tabs.js"></script>