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
      "format": "variablePerRow",
      "provenance": "<var>NAME</var>",
      "importType": "variables" | "entities",

      # For entities only
      "rowEntityType": "<var>ENTITY_TYPE_DCID</var>",

      # For variables only
      "entityType": "<var>ENTITY_TYPE_DCID</var>",
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
      
    "<var>CSV_FILE_EXPRESSION2</var>": {
      ...
    }
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

: Required: Specify `variablePerRow`. The other option, `variablePerColumn`, is now deprecated.

provenance

: Required: The provenance (named source) of this input file. Provenances map from a source to a dataset. The name here must correspond to the name defined as a `provenance` in the `sources` section. For example, `WorldDevelopmentIndicators` provenance (or dataset) is from the `WorldBank` source.

You must specify the provenance details under `sources.provenances`; this field associates one of the provenances defined there to this file.

importType

: Specify `entities` for custom entity imports. Otherwise defaults to `variables`.

entityType (variables only)

: Required for CSV files containing observations: All entities in a given file must be of a specific type. The importer tries to resolve entities to DCIDs of that type. In most cases, the `entityType` will be a supported place type; see [Place types](../place_types.html) for a list. For CSV files containing custom entities, use the `rowEntityType` option instead.

rowEntityType (entities only)

: Required for CSV files containing custom entities: The DCID of the entity type (new or existing) of the custom entities you are importing. For example, if you are importing a set of hospital entities, the entity type could be the existing entity type [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"}.

columnMappings

: Optional: If headings in the observations CSV file do not use the required names for these columns (`variable`, `entity`, etc.), provide the equivalent names for each column. For example, if your headings are `SERIES`, `GEOGRAPHY`, `TIME_PERIOD`, `OBS_VALUE`, you would specify:
```
"variable": "SERIES",
"entity": "GEOGRAPHY",
"date": "TIME_PERIOD",
"value": "OBS_VALUE"
```

## groupStatVarsByProperty

Optional: When set to `true`, causes the Statistical Variable Explorer to display a top-level category called "Custom Variables", and groups together variables with the same population types and measured properties. For example:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot10.png){: width="400"}

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