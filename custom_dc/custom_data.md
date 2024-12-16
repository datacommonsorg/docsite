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

Custom Data Commons requires that you provide your data in a specific schema, format, and file structure. We strongly recommend that, before proceeding, you familiarize yourself with the basics of the Data Commons data model by reading through [Key concepts](/data_model.html), in particular, _entities_, _statistical variables_, and _observations_.

At a high level, you need to provide the following:

- All data must be in CSV format, using the schema described below. 
- You must also provide a JSON configuration file, named `config.json`, that specifies how to map and resolve the CSV contents to the Data Commons schema knowledge graph. The contents of the JSON file are described below.
- Depending on how you define your statistical variables (metrics), you may need to provide [MCF (Meta Content Framework)](https://en.wikipedia.org/wiki/Meta_Content_Framework){: target="_blank"} files.

You can have as many CSV and MCF files as you like, and they can be stored in a single directory together, or in multiple subdirectories. There must only be one JSON config file, in the top-level input directory.

The following sections walk you through the process of setting up your data.

## Step 1: Identify your statistical variables

Your data undoubtedly contains metrics and observed values. In Data Commons, the metrics themselves are known as statistical variables, and the time series data, or values over time, are known as observations. While observations are always numeric, statistical variables must be defined as _nodes_ in the Data Commons knowledge graph.  

Statistical variables must follow a certain model: it includes a measure (e.g. "median age") on a set of things of a certain type (e.g. "persons") that satisfy some set of constraints (e.g. "gender is female"). To explain what this means, consider the following example. Let's say your dataset contains the number of schools in U.S. cities, broken down by level (elementary, middle, secondary) and type (private, public), reported for each year (numbers are not real, but are just made up for the sake of example):

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
- `CountPublicElementary`
- `CountPublicMiddle`
- `CountPublicSecondary`
- `CountPrivateElementary`
- `CountPrivateMiddle`
- `CountPrivateSecondary`

If you wanted totals or subtotals of combinations, you would need to create additional variables for these as well.

## Step 2: Choose between "implicit" and "explicit" schema definition

Custom Data Commons supports two ways of importing your data:
- **"Implicit"** schema definition. This method is simplest, and does not require that you write MCF files, but it is more constraining on the structure of your data. You don't need to provide variables and entities in DCID format, but you must follow a strict column ordering, and variables must be in _variable-per-column_ format, described below. Naming conventions are loose, and the Data Commons importer will generate DCIDs for your variables and observations, based on a predictable column order. This method is _simpler and recommended_ for most datasets.
- **"Explicit"** schema definition. This method is a bit more involved, as you must explicitly define DCIDs for all your variables as nodes in MCF files. All variables and entities in the CSVs must reference DCIDs. Using this method allows you to specify variables in _variable-per-row_ format, which is a bit more flexible. There are a number of cases for which this option might be a better choice:
  - You have hundreds of variables, which may be unmanageable as separate columns or files.
  - You want to be able to specify additional properties, for example, unit of measurement, of the observations at a more granular level than per-file. As an example, let's say you have a variable that measures financial expenses, across multiple countries; you may want to be able to specify the country-specific currency of each observation.
  - In the case that you are missing observations for specific entities (e.g. places) or time periods for specific variables, and you don't want to have lots of null values in columns (sparse tables).

To illustrate the difference between variable-per-column and variable-per-row schemas, let's use the schools example data again. In variable-per-column, you would represent the dataset as follows:

**Variable-per-column schema**

| CITY | YEAR | COUNT_PUBLIC_ELEMENTARY | COUNT_PUBLIC_MIDDLE | COUNT_PUBLIC_SECONDARY | COUNT_PRIVATE_ELEMENTARY | COUNT_PRIVATE_MIDDLE | COUNT_PRIVATE_SECONDARY |
|------|------|-------------------------|---------------------|------------------------|---------------------------|---------------------|-------------------------|
| San Francisco | 2023 | 300 | 300 | 200 | 100 | 100 | 50 |
| San Jose | 2023 | 400 | 400 | 300 | 200 | 200 | 100 |

The names that appear in the columns and rows don't need to be DCIDs or follow any convention, because the columns must always be specified in this exact sequence:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

In variable-per-row, the same dataset would be provided as follows:

**Variable-per-row schema**

| CITY | YEAR |  VARIABLE | OBSERVATION |
|------|------|-----------|-------|
| San Francisco | 2023 | CountPublicElementary | 300 |
| San Francisco | 2023 | CountPublicMiddle | 300 |
| San Francisco | 2023 | CountPublicSecondary | 200 |
| San Francisco | 2023 | CountPrivateElementary | 100 |
| San Francisco | 2023 | CountPrivateMiddle | 100 |
| San Francisco | 2023 | CountPrivateSecondary | 50 |
| San Jose | 2023 | CountPublicElementary | 400 |
| San Jose | 2023 | CountPublicMiddle | 400 |
| San Jose | 2023 | CountPublicSecondary | 300 |
| San Jose | 2023 | CountPrivateElementary | 200 |
| San Jose | 2023 | CountPrivateMiddle | 200 |
| San Jose | 2023 | CountPrivateSecondary | 100 |

The names and order of the columns aren't important, as you can map them to the expected columns in the JSON file. However, the city and variable names must be existing DCIDs. If such DCIDs don't already exist in the base Data Commons, you must provide definitions of them in MCF files.

## Prepare your data using implicit schema

In this section, we will walk you through a concrete example of how to go about setting up your CSV and JSON files. Also see the example files provided in [https://github.com/datacommonsorg/website/tree/master/custom_dc/sample](https://github.com/datacommonsorg/website/tree/master/custom_dc/sample){: target="_blank"}.

### Prepare the CSV data files {#prepare-csv}

As mentioned above, CSV files using implicit schema must contain these columns -- and _only_ these columns, no others -- in the following order:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

The _ENTITY_ is an existing entity, most commonly a place. The best way to think of the entity is as a key that could be used to join to other data sets. The column heading can be expressed as any existing place-related property; see [Place types](/place_types.html) for a full list. It may also be any of the special DCID prefixes listed in [Special place names](#special-names). 

> **Note:** The type of the entities in a single file should be unique; do not mix multiple entity types in the same CSV file. For example, if you have observations for cities and counties, put all the city data in one CSV file and all the county data in another one.

The _DATE_ is the date of the observation and should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_. The heading can be anything, although as a best practice, we recommend using a corresponding identifier, such as `year`, `month` or `date`.

The _VARIABLE_ should contain a metric [observation](/glossary.html#observation) at a particular time. It could be an existing variable in the knowledge graph, to which you will add a different provenance, or it can be a new one. The heading can be anything, but you should encode the relevant attributes being measured, so that the importer can correctly create a new variable for you.

The variable values must be numeric. Zeros and null values are accepted: zeros will be recorded and null values ignored. Here is an example of some real-world data from the WHO on the prevalance of smoking in adult populations, broken down by sex, in the correct CSV format:

```csv
country,year,Adult_curr_cig_smokers,Adult_curr_cig_smokers_female,Adult_curr_cig_smokers_male
Afghanistan,2019,7.5,1.2,13.4
Angola,2016,,1.8,14.3
Albania,2018,,4.5,35.7
United Arab Emirates,2018,6.3,1.6,11.1
```
Note that the data is missing values for the total population percentage for Angola and Albania.

You can have as many CSV files as you like, and they can be stored in a single directory, or one directory and multiple subdirectories.

#### Special place names {#special-names}

In addition to the place names listed in [Place types](/place_types.html), you can also use the following special names as headings:

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

### Write the JSON config file

You must define a `config.json` in the top-level directory where your CSV files are located. With the implicit schema method, you need to provide 3 specifications:
- The input files location and entity type
- The sources and provenances of the data
- Optionally, additional properties of the statistical variables you've used in the CSV files

Here is an example of how the config file would look for WHO CSV file we defined earlier. More details are below.

```json
{
  "inputFiles": {
    "adult_cig_smoking.csv": {
      "entityType": "Country",
      "provenance": "UN_WHO",
      "observationProperties" : {
        "unit": "percentage"
      }
    }
  },
  "variables": {
    "Adult_curr_cig_smokers": {
      "name": "Adult Current Cigarette Smokers",
      "description": "Percentage of smokers in the total adult population",
      "searchDescriptions": [
        "Prevalence of smoking among adults in world countries in the years 2016 - 2019."
      ],
      "group": "WHO"
    },
    "Adult_curr_cig_smokers_female": {
      "name": "Adult Current Cigarette Smokers Female",
      "description": "Percentage of smokers in the female adult population",
      "searchDescriptions": [
        "Prevalence of smoking among adult women in world countries in the years 2016 - 2019."
      ],
      "group": "WHO"
    },
      "Adult_curr_cig_smokers_male": {
      "name": "Adult Current Cigarette Smokers Male",
      "description": "Percentage of smokers in the male adult population",
      "searchDescriptions": [
        "Prevalence of smoking among adult men in world countries in the years 2016 - 2019."
      ],
      "group": "WHO"
    }
  },
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
The following fields are specific to the variable-per-column format:

- `input_files`:
  - `entityType`: This must be an existing entity class in the Data Commons knowledge graph; it's most commonly a [place type](/place_types.html).
  - `variables`: This section is optional but recommended. You can use it to override names and associate additional properties with the statistical variables in the files, using the parameters described below. All parameters are optional.
    - `name`: A human-friendly readable name that will be shown throughout the UI.
    - `description`: A more detailed name that will be shown in the Statistical Variable Explorer.
    - `searchDescriptions`" This is a comma-separated list of natural-language text descriptions of the variable; these descriptions will be used to generate embeddings for the NL query interface.
    - `group`: This will display the variables as a group in the Statistical Variable Explorer, using the name you provide as heading. For example:

       ![group_screenshot](/assets/images/custom_dc/customdc_screenshot9.png){: width="800"}

The other fields are explained in the [Data config file specification reference](#json-ref).

## Prepare your data using explicit schema

In this section, we will walk you through a concrete example of how to go about setting up your CSV, MCF and JSON files.

### Write the MCF file {#mcf}

Nodes in the Data Commons knowledge graph are defined in Metadata Content Format(MCF). For custom Data Commons using explicit schema, you must define your statistical variables using MCF. Here's an example of defining the same statistical variables in the WHO data in MCF:

```
Node: dcid:Adult_curr_cig_smokers
typeOf: dcid:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%)"
populationType: dcid:Person
measuredProperty: dcid:percent

Node: dcid:Adult_curr_cig_smokers_female
typeOf: dcid:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%) [Female]"
populationType: dcid:Person
measuredProperty: dcid:percent
gender: dcid:Female

Node: dcid:Adult_curr_cig_smokers_male
typeOf: dcid:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%) [Male]"
populationType: dcid:Person
measuredProperty: dcid:percent
gender: dcid:Male
```
The following fields are always required:
- `Node`: This is the DCID of the entity you are defining. 
- `typeOf`: In the case of statistical variable, this is always `dcid:StatisticalVariable`.
- `name`: This is the descriptive name of the variable, that is displayed in the Statistical Variable Explorer and various other places in the UI.
- `populationType`: This is the type of thing being measured, and its value must be an existing `Class` type. It is mainly used to classify variables into categories that appear in the Statistical Variable Explorer. In this example it is is `dcid:Person`. For a full list of supported classes, you will have to send an API request, as described in [Get a list of all existing statistical variables](/api/rest/v2/node.html#liststatvars).
- `dcid:measuredProperty`: This is a property of the thing being measured. It must be a `domainIncludes` property of the `populationType` you have specified. In this example, it is the `percent` of persons being measured. You can see the set of `domainIncludes` properties for a given `populationType`, using either of the following methods:
  - Go to <code>https://datacommons.org/browser/<var>POPULATION_TYPE</var></code>, e.g. <https://datacommons.org/browser/Person>{: target="_blank"} and scroll to the `domainIncludes` section of the page. For example: 

    ![domain incudes](/assets/images/custom_dc/customdc_screenshot9.png){: width="800"}

  - Use the [Node API](/api/rest/v2/node.html#wildcard), filtering on `domainIncludes` incoming arcs: <code>https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>POPULATION_TYPE</var>&property=%3C-domainIncludes</code>, e.g. <https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Person&property=%3C-domainIncludes>{: target="_blank"}.

Note that all non-quoted field values must be prefixed with `dcid:` or `dcs:`, which are interchangeable. You may wish to add an optional namespace, separated by a slash (/); for example, `who/Adult_curr_cig_smokers`.

The following fields are optional:
- `statType`: By default this is `dcid:measuredValue`, which is simply a raw value of an observation. If your variable is a calculated value, such as an average, a minimum or maximum, you can use `minValue`, `maxValue`, `meanValue`, `medianValue`, `sumvalue`, `varianceValue`, `marginOfError`, `stdErr`. In this case, your data set should only include the observations that correspond to those calculated values. 
- `measurementQualifier`: This is similar to `observationPeriod` field for CSV observations (see below) but applies to all observations of the variable. It can be any string representing additional properties of the variable, e.g. `Weekly`, `Monthly`, `Annual`. For instance if `measuredProperty` is "income", `Annual` or `Monthly` is used to distinguish income over different periods. If the time interval affects the meaning of variable and and values change significantly by the time period,you can use this field keep them separate.
- `measurementDenominator` : For percentages or ratios, this refers to another statistical variable. For example, for per-capita, the measurementDenominator is `Count_Person`.

Additionally, you can specify any number of property-value pairs representing the constraints on the type identified by `populationType`. In our example, there is one constraint property, `gender`, which is a property of `Person`. The constraint property values are typically enumerations; such as `genderType`, which is a `rangeIncludes` property of `gender`. These will become additional sub-categories of the population type and displayed as such in the Statistical Variable Explorer. Using our example:

![Stat Var Explorer](/assets/images/custom_dc/customdc_screenshot10.png){: width="600"}

### Prepare the CSV data files

CSV files using explicit schema contain the following columns using the following headings:

```csv
entity, variable, date, value [, unit] [, scalingFactor] [, measurementMethod] [, observationPeriod]
```
The columns can be in any order, and you can specify custom names for the headings and use the `columnMappings` field in the JSON file to map them accordingly (see below for details).

These columns are required:
- The `entity` is the DCID of an existing entity in the Data Commons knowledge graph, typically a place. 
- The `variable` is the DCID of the node you have defined in the MCF. The variable values must be numeric. Zeros and null values are accepted: zeros will be recorded and null values ignored. 
- The `date` is the date of the observation and should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_. 
- The `value` is the value of the observation and must be numeric.

> **Note:** The type of the entities in a single file should be unique; do not mix multiple entity types in the same CSV file. For example, if you have observations for cities and counties, put all the city data in one CSV file and all the county data in another one.

The remaining columns are optional, and allow you to specify additional per-observation properties; see the descriptions of these in the [JSON config file reference](#observation-properties).

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

### Write the JSON config file

You must define a `config.json` in the top-level directory where your CSV files are located. With the explicit schema method, you need to provide these specifications:
- The input files location and entity type
- The sources and provenances of the data
- Column mappings, if you are using custom names for the column headings

Here is an example of how the config file would look for WHO CSV file we defined earlier. More details are below.

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

The following fields are specific to the variable-per-row format:
- `input_files`:
  - `format` must be `variablePerRow` (the default is `variablePerColumn` if not specified)
  - `columnMappings` are required if you have used custom column heading names. The format is <var>DEFAULT_NAME</var> : <var>CUSTOM_NAME</var>.
  - `groupStatVarsByProperty` is optional, and allows you to group your variables together according to population type.

The other fields are explained in the [Data config file specification reference](#json-ref)


## Data config file specification reference {#json-ref}

Here is the general spec for the JSON file:

<pre>
{  
  "inputFiles": {  
    "<var>FILE_NAME1</var>": {  
      "entityType": "<var>ENTITY_PROPERTY</var>",  
      "ignoreColumns": ["<var>COLUMN1</var>", "<var>COLUMN2</var>", ...],  
      "provenance": "<var>NAME</var>",
      "format": "variablePerColumn" | "variablePerRow",
      "columnMappings": {
        "variable": "<var>NAME</var>",
        "entity": "<var>NAME</var>",
        "date": "<var>NAME</var>",
        "value": "<var>NAME</var>",
        "unit": "<var>NAME</var>",
        "scalingFactor": "<var>NAME</var>",
        "measurementMethod": "<var>NAME</var>",
        "observationPeriod": "<var>NAME</var>"
      }
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
  "groupStatVarsByProperty": false | true,
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

If you are using subdirectories, specify the file names using paths relative to the top-level directory (which you specify in the `env.list` file as the input directory).

#### Input file parameters

entityType (implicit schema only)

: Required: All entities in a given file must be of a specific type. This type should be specified as the value of the `entityType` field. The importer tries to resolve entities to DCIDs of that type. In most cases, the `entityType` will be a supported place type; see [Place types](../place_types.html) for a list.

ignoreColumns

: Optional: The list of column names to be ignored by the importer, if any.

provenance

: Required: The provenance (name) of this input file. Provenances typically map to a dataset from a source. For example, `WorldDevelopmentIndicators` provenance (or dataset) is from the `WorldBank` source.

You must specify the provenance details under `sources.provenances`; this field associates one of the provenances defined there to this file.

{: #observation-properties} 
observationProperties (implicit schema only)

: Optional: Additional information about each contained in the CSV file. Currently, the following properties are supported:
- [`unit`](/glossary.html#unit): The unit of measurement used in the observations. This is a string representing a currency, area, weight, volume, etc. For example, `SquareFoot`, `USD`, `Barrel`, etc.
- [`measurementPeriod`](/glossary.html#observation-period): The period of time in which the observations were recorded. This must be in ISO duration format, namely `P[0-9][Y|M|D|h|m|s]`. For example, `P1Y` is 1 year, `P3M` is 3 months, `P3h` is 3 hours.
- [`measurementMethod`](/glossary.html#measurement-method): The method used to gather the observations. This can be a random string or an existing DCID of [`MeasurementMethodEnum`](https://datacommons.org/browser/MeasurementMethodEnum){: target="_blank"} type; for example, `EDA_Estimate` or `WorldBankEstimate`.
- [`scalingFactor`](/glossary.html#scaling-factor): An integer representing the denominator used in measurements involving ratios or percentages. For example, for percentages, the denominator would be `100`. 

Note that you cannot mix different property values in a single CSV file. If you have observations using different properties, you must put them in separate CSV files.

format

: Only needed to specify `variablePerRow` for explicit schemas. The assumed default is `variablePerColumn`.

columnMappings (explicit schema only)

: Optional: If headings in the CSV file does not use the default names, the equivalent names for each column.

### Variables (implicit schema only)

The `variables` section is optional. You can use it to override names and associate additional properties with the statistical variables in the files, using the parameters described below. All parameters are optional.

#### Variable parameters {#varparams}

name

: The display name of the variable, which will show up throughout the UI. If not specified, the column name is used as the display name.  
The name should be concise and precise; that is, the shortest possible name that allow humans to uniquely identify a given variable. The name is used to generate NL embeddings.

description

: A long-form description of the variable.

properties

: Additional Data Commons properties associated with this variable. This section is analogous to the fields specified in an [MCF Node definition](#mcf).

Each property is specified as a key:value pair. Here are some examples:

```json
{
  "populationType": "schema:Person",
  "measuredProperty": "age",
  "statType": "medianValue",
  "gender": "Female"
}
```

group

: By default, the Statistical Variables Explorer will display all custom variables as a group called "Custom Variables". You can use this option to create multi-level hierarchies, and assign different variables to groups. The value of the `group` option is used as the heading of the group. For example, in the sample data, the group name `OECD` is used to group together the two variables from the two CSV files:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot5.png){: width="400"}

You can have a multi-level group hierarchy by using `/` as a separator between each group.

searchDescriptions

: An array of descriptions to be used for creating more NL embeddings for the variable. This is only needed if the variable `name` is not sufficient for generating embeddings.

### groupStatVarsByProperty (explicit schema only)

Optional: Causes the Statistical Variable Explorer to create a top-level category called "Custom Variables", and groups together variables with the same population types and measured properties. For example:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot10.png){: width="400"}

If you would like your custom variables to be displayed together, rather than spread among existing categories, this option is recommended.

### Sources

The `sources` section encodes the sources and provenances associated with the input dataset. Each named source is a mapping of provenances to URLs.

#### Source parameters

url
: Required: The URL of the named source. For example, for named source `U.S. Social Security Administration`, it would be `https://www.ssa.gov`.

provenances
: Required: A set of _NAME_:_URL_ pairs. Here are some examples:

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
- Set the `INPUT_DIR` variable to the full path to the directory where your input files are stored. 
- Set the `OUTPUT_DIR` variable to the full path to the directory where you would like the output files to be stored. This can be the same or different from the input directory. When you rerun the Docker data management container, it will create a `datacommons` subdirectory under this directory.

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

