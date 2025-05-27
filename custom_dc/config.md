---
layout: default
title: Data config file reference
nav_order: 5
parent: Build your own Data Commons
---

{:.no_toc}
# Data configuration file (config.json) reference

Here is the general spec for the `config.json` file.

<pre>
{  
  "includeInputSubdirs": true | false,

  "inputFiles": {  
    "<var>CSV_FILE_EXPRESSION1</var>": {  

      "format": "variablePerColumn" | "variablePerRow",
      "provenance": "<var>NAME</var>",
    
      # For implicit schema only
      "importType": "variables" | "entities",
       ignoreColumns": ["<var>COLUMN_HEADING1</var>", "<var>COLUMN_HEADING2</var>", ...],
      # Variables only
      "entityType": "<var>ENTITY_TYPE_DCID</var>",

      # For implicit schema only, custom entities only
      "rowEntityType": "<var>ENTITY_TYPE_DCID</var>",
      "idColumn": "<var>COLUMN_HEADING</var>",
      "entityColumns": ["<var>COLUMN_HEADING_DCID1</var>", "<var>COLUMN_HEADING_DCID2</var>", ...],

      # For explicit schema only
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

      # For implicit schema only
      "observationProperties" {
        "unit": "<var>MEASUREMENT_UNIT</var>",
        "observationPeriod": "<var>OBSERVATION_PERIOD</var>",
        "scalingFactor": "<var>DENOMINATOR_VALUE</var>",
        "measurementMethod": "<var>METHOD</var>"
      }
    "<var>CSV_FILE_EXPRESSION2</var>": {
      ...
    }
  },
   ...  

   # For implicit schema only, custom entities only
   "entities": {
    "<var>ENTITY_TYPE_DCID</var>: {
      "name": "<var>ENTITY_TYPE_NAME</var>",
      "description: "<var>ENTITY_TYPE_DESCRIPTION</var>"
    }
    ...
  },
   
   # For implicit schena only
   <var>DESCRIPTION</var>",  
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

## Enable subdirectories {#subdirs}

If you are using subdirectories, specify the file names using paths relative to the top-level directory (which you specify in the `env.list` file as the input directory), and be sure to set `"includeInputSubdirs": true` (the default is false if the option is not specified.) For example:

```
{
 "inputFiles": {
    "foo.csv": {...},
    "bar*.csv": {...},
    "*.csv": {...},
    "data/*.csv": {...}
  },
  "includeInputSubdirs": true
```

> Note: Although you don't need to specify the names of MCF files in the `inputFiles` block, if you want to store them in subdirectories, you must still set `"includeInputSubdirs": true` here.

## Input files

The top-level `inputFiles` lists out the CSV input files and options specific to each file. The file expression is the file name (including relative subdirectories, where applicable) or wildcard patterns if the same configuration applies to multiple files.

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

### Input file parameters

format

: Only needed to specify `variablePerRow` for explicit schemas. The assumed default is `variablePerColumn` (implicit schema).

provenance

: Required: The provenance (named source) of this input file. Provenances map from a source to a dataset. The name here must correspond to the name defined as a `provenance` in the `sources` section. For example, `WorldDevelopmentIndicators` provenance (or dataset) is from the `WorldBank` source.

You must specify the provenance details under `sources.provenances`; this field associates one of the provenances defined there to this file.

ignoreColumns (implicit schema only)

: Optional: A list of headings representing columns that should be ignored by the importer, if any.

importType (implicit schema only)

: Only needed to specify `entities` for custom entity imports. The assumed default is `variables`.

entityType (implicit schema only, variables only)

: Required for CSV files containing observations: All entities in a given file must be of a specific type. The importer tries to resolve entities to DCIDs of that type. In most cases, the `entityType` will be a supported place type; see [Place types](../place_types.html) for a list. For CSV files containing custom entities, use the `rowEntityType` option instead.

rowEntityType (implicit schema only, entities only)

: Required for CSV files containing custom entities: The DCID of the entity type (new or existing) of the custom entities you are importing. It must match the DCID specified in the `entities` section(s). For example, if you are importing a set of hospital entities, the entity type could be the existing entity type [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"}.

idColumn (implicit schema only, entities only)

: Optional: The heading of the column representing DCIDs of custom entities that the importer should create. If you don't specify this, the importer will auto-generate DCIDs for each row in the file. It is strongly recommended that you use specify this to define your own DCIDs.

entityColumns (implicit schema only, entities only)

: Optional: A list of headings of columns that represent existing DCIDs in the knowledge graph. The heading must be the DCID of the entity type of the column (e.g. `City`, `Country`) and each row must be the DCID of the entity (e.g. `country/CAN`, `country/PAN`).

columnMappings (explicit schema only)

: Optional: If headings in the observations CSV file do not use the required names for these columns (`variable`, `entity`, etc.), provide the equivalent names for each column. For example, if your headings are `SERIES`, `GEOGRAPHY`, `TIME_PERIOD`, `OBS_VALUE`, you would specify:
```
"variable": "SERIES",
"entity": "GEOGRAPHY",
"date": "TIME_PERIOD",
"value": "OBS_VALUE"
```

{: #observation-properties} 
observationProperties (implicit schema only)

: Optional: Additional information about each observation contained in the CSV file. Whatever setting(s) you specify will apply to all observations in the file. 

Currently, the following properties are supported:
- [`unit`](/glossary.html#unit): The unit of measurement used in the observations. This is a string representing a currency, area, weight, volume, etc. For example, `SquareFoot`, `USD`, `Barrel`, etc.
- [`observationPeriod`](/glossary.html#observation-period): The period of time in which the observations were recorded. This must be in ISO duration format, namely `P[0-9][Y|M|D|h|m|s]`. For example, `P1Y` is 1 year, `P3M` is 3 months, `P3h` is 3 hours.
- [`measurementMethod`](/glossary.html#measurement-method): The method used to gather the observations. This can be a random string or an existing DCID of [`MeasurementMethodEnum`](https://datacommons.org/browser/MeasurementMethodEnum){: target="_blank"} type; for example, `EDA_Estimate` or `WorldBankEstimate`.
- [`scalingFactor`](/glossary.html#scaling-factor): An integer representing the denominator used in measurements involving ratios or percentages. For example, for percentages, the denominator would be `100`. 

Note that you cannot mix different property values in a single CSV file. If you have observations using different properties, you must put them in separate CSV files.

## Entities (implicit schema only)

This is required for custom entity imports. Whether you are referencing an existing entity type or a creating a new entity type, specify its DCID here. Note that it must match the DCID specified in the input files `rowEntityType` field.

### Entity parameters 

name

: If you are creating a new entity type, provide a human-readable name for it. If you are referencing an existing entity type, omit this parameter.

description

: If you are creating a new entity type, provide a longer description for it. If you are referencing an existing entity type, omit this parameter.

## Variables (implicit schema only)

The `variables` section is optional. You can use it to define names and associate additional properties with the statistical variables in the files, using the parameters described below. All parameters are optional. If you don't provide this section, the importer will automatically derive the variable names from the CSV file headings.

### Variable parameters {#varparams}

name

: The display name of the variable, which will show up throughout the UI. If not specified, the column name is used as the display name.  
The name should be concise and precise; that is, the shortest possible name that allow humans to uniquely identify a given variable. The name is used to generate NL embeddings.

description

: A long-form description of the variable.

{: #varprops}
properties

: Additional Data Commons properties associated with this variable. The properties are any property required or optional in the [MCF Node definition](#mcf) of a variable. The value of the property must be a DCID.

Each property is specified as a key:value pair. Here are some examples:

```json
{
  "populationType": "schema:Person",
  "measuredProperty": "age",
  "statType": "medianValue",
  "gender": "Female"
}
```

Note that the `measuredProperty` property has an effect on the display: if it is not set for any variable, the importer assumes that it is different for every defined variable, so that each variable will be shown in a different chart in the UI tools. If you would like multiple variables to show up in the same chart, be sure to set this property on all of the relevant variables, to the same (DCID) value. For example, if you wanted `Adult_curr_cig_smokers_female` and `Adult_curr_cig_smokers_male` to appear on the same Timeline chart, set `measuredProperty` to a common property of the two variables, for example [`percent`](https://datacommons.org/browser/percent){: target="_blank"}. 

```json
"variables": {
    "Adult_curr_cig_smokers": {
      "properties": {
        "measuredProperty": "percent"
      }
    },
    "Adult_curr_cig_smokers_female": {
       "properties": {
         "measuredProperty": "percent"
      }
    }
  }
```

group

: By default, the Statistical Variables Explorer will display all custom variables as a group called "Custom Variables". You can use this option to create one or more custom group names and assign different variables to groups. The value of the `group` option is used as the heading of the group. For example, in the sample data, the group name `OECD` is used to group together the two variables from the two CSV files:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot5.png){: width="400"}

You can have a multi-level group hierarchy by using `/` as a separator between each group.

> Note: You can only assign a variable to one group. If you would like to assign the same variables to multiple groups, you will need to define the groups as nodes in MCF; see [Define a statistical variable group node](#statvar-group) for details.

searchDescriptions

: An array of descriptions to be used for creating more NL embeddings for the variable. This is only needed if the variable `name` is not sufficient for generating embeddings.

## groupStatVarsByProperty

Optional: Causes the Statistical Variable Explorer to create a top-level category called "Custom Variables", and groups together variables with the same population types and measured properties. For example:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot10.png){: width="400"}

For explicit schema (which does not give you a `group` option in the `config.json`), if you would like your custom variables to be displayed together, rather than spread among existing categories, this option is recommended.

## Sources

The `sources` section encodes the sources and provenances associated with the input dataset. Each named source is a mapping of provenances to URLs.

### Source parameters

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
The named provenances should be used to identify the `provenance` field(s) of input files.