---
layout: default
title: Prepare your data
nav_exclude: true
noindex: true
include_scripts: /assets/js/syntax_highlighting.js
---

* TOC
{:toc}

{:.no_toc}
# Prepare your data

The following procedures assume that you are familiar with defining nodes in MCF, structuring CSV file data, and the structure of the `config.json` file. If not, please familiarize yourself with [Prepare your own data](https://docs.datacommons.org/custom_dc/custom_data.html) in the Custom Data Commons documentation before proceeding.

If you'd like to just start with some sample data, you can download the files from [https://github.com/datacommonsorg/datacommons/tree/main/samples/](https://github.com/datacommonsorg/datacommons/tree/main/samples/){: target="_blank"} and skip to [Import your data](data_import.md).

## Step 1: Decide on a file and directory structure for your data

Data Commons Platform requires the following input:

* One or more MCF files that define your custom [provenances, sources](https://docs.datacommons.org/data_model.html#sources), entities, and statistical variables
* One or more CSV files that provide the statistical observations
* One or more config.json file(s) that define "imports"; that is, the subset of data you want to import when you run the ingestion workflow.

Data Commons Platform allows for per-*provenance* file imports. A provenance corresponds to one or more tables, i.e. CSV files. Rather than batch-ingesting *all* your input data files at the same time, you can specify which files are to be imported in a given workflow. When you run the ingestion workflow, you provide the name of a directory containing the data files you want to import. The directory can contain files from one or more provenances. It can also contain nested subdirectories. 

> **Note:** The ingestion workflow operates on a per-import basis. When the workflow runs, it wipes all data associated with the specified import from Spanner. This means that each time you ingest new data for a given import, you must reingest all the data for that import. You cannot do "incremental"-type imports, involving only new rows.

When you organize your files into directories, keep in mind the following:

* A single "import" is identified by a directory and a `config.json` file. Each directory constituting a separate import must have its own `config.json` file. You can, however, ingest multiple imports during a single workflow run.
* Multiple CSV files can belong to the same provenance.
* A `config.json` file (representing one import) can contain multiple provenances; but one provenance must not be present in multiple `config.json` files.
* If you want to version your import configurations, you can place old `config.json` / MCFs / CSVs under the “archives” subdirectory. 
* When you re-ingest an import, all the observations, timeseries and edges in the same provenance are destroyed and recreated. Therefore, once you have ingested an import, be sure to always include all the same files in the import for all future ingestions.

Let's look at a few illustrative examples representing possible import structures and patterns. The methods for configuring these structures are provided in [Step 6: Write your config.json file](#config).

> **Note:** In the following examples, `ingestion_base` is the equivalent of `ingestion/input` or a custom directory you specified in the `ingestion_input_path` Terraform variable. You will store your files in at least one subdirectory of this path.

{:.no_toc}
### Example 1: Single import, single provenance

A single import with a single provenance can have all CSV files in the same directory, or split up into several subdirectories. All files are ingested together as a self-contained import. 

```
ingestion_base /
  |- my_first_import /    
    |– config.json  <--- Single import
    |– schema.mcf
    |- data1.csv
    |– my_data_2/     
      |– data2.csv
    |– my_data_3/
      |– data3.mcf
    |- archives/   <--- completely ignored
      |- 2025/
         |- config.json 
```

{:.no_toc}
### Example 2: Single import, multiple provenances

If you have data files from multiple provenances, it's a good idea to keep them in separate directories. Here's an example of a single import consisting of 2 provenances. In this case, all files are ingested as a single import during a workflow run.

```
ingestion_base/
  |- my_first_import /   
    |– config.json      <--- Single import
    |- shared_schema.mcf  <--- Optional
    |– my_provenance_1/ <--- First provenance
        |– data1.csv
        |- prov1_schema.mcf
    |– my_provenance_2/ <--- Second provenance
        |– data2.csv
        |- prov2_schema.mcf
```

{:.no_toc}
### Example 3: Multiple imports, one provenance per import

In this case, each import corresponds to a single provenance. When you run a workflow, you can select whether to import #1 or #2 or both.

```
ingestion_base /
  |– my_first_import/        
    |– config.json   <--- First import, first provenance
    |– schema1.mcf
    |– data1.csv
  |- my_second_import/        
    |– config.json   <--- Second import, second provenance
    |– schema2.mcf
    |– data2.csv
```

{:.no_toc}
### Example 4: Single schema-only import, multiple data imports {#example4}

In this example, the MCF file is shared across multiple imports.

```
ingestion_base /
  |– schema_import/        
    |– config.json   <--- Schema import, schema provenances
    |– schema.mcf
  |- import_1/        
    |– config.json   <--- First data import, first provenance
    |– data1.csv
  |- import_2/        
    |– config.json   <--- Second data import, second provenance
    |– data2.csv
```

## Step 2: Choose a namespace

All custom nodes that you define in your instance –- statistical variables, entities, etc. –- require a unique namespace. The namespace will be used as a prefix to all custom nodes you declare in MCF, and reference in CSV and configuration files.

To choose a namespace, pick a short, descriptive string that represents your organization. Use lowercase characters and numbers. For example, the United Nations might use a prefix such as  `undata` or `unorg`.

```
undata:My_Variable
```

When you refer to a node that exists in base Data Commons, you use the following prefixes:

* `schema`: for nodes defined in [schema.org](https://schema.org){: target="_blank"}
* `dcs`: for nodes defined in the core Data Commons schema (in [https://github.com/datacommonsorg/schema/blob/main/core/dcschema.mcf](https://github.com/datacommonsorg/schema/blob/main/core/dcschema.mcf){: target="_blank"})
* `dcid`: for all other nodes defined in base Data Commons


## Step 3: Define provenances and sources in MCF

In Data Commons, a *source* is the provider of the data, usually an organization, represented by their web page URL. A *provenance* is the actual origin data, typically a database, a table in a database, or a CSV file. For public data, it is typically provided as a download from a specific web page.

All data files must be assigned to a provenance. Each provenance must reference a source.

Many files may be assigned to the same provenance.

You may have several provenances and sources and you may want to use provenances or sources as an organizing principle for imports.

### Identify or define a source

A provenance must be linked to a specific source. Your source may already exist in base Data Commons, if it is a large international organization (for example, the OECD). To look up existing sources:

1. Go to [https://datacommons.org/browser/Source](https://datacommons.org/browser/Source){: target="_blank"} and scroll to **Subject Type:Source**. If you find the source you need, note its DCID. If you don't find it here, continue to step 2.
2. In your browser bar, enter the following API query:

    <pre>
    https://api.datacommons.org/v2/node?key=<var>YOUR_API_KEY</var>&nodes=Source&property=%3C-typeOf</pre>
    If you don't find your source here, you will need to define one.

You define your source(s) in MCF. For example, let's say you get data from the International Olympic Committee (which is not in base Data Commons). You could define the following source:

```
Node: ioc:IOC
typeOf: dcs:Source
name: "International Olympic Committee"
domain: "olympics.com"
url: "https://olympics.com/ioc"
```

The following fields are required:

* `Node`: The DCID of the source you are defining. The node must have a namespace prefix.
* `typeOf`: This must be `dcs:Source`
* `name`: A human-readable name.
* `source`: The provider of the data, using its DCID. This may be a source that already exists in base Data Commons (as in the OECD example above). If there is no suitable existing source, you need to define one, as described below.
* `url`: This is the URL of a downloadable file, or a web page providing a link to the data. Note that it must include the prefix, i.e. http(s).

You may also include the following optional fields:

* `description`: An extended, more detailed description of the source.
* `domain`: The source's internet domain name.

When you link to this source in a provenance definition, you use its DCID, in this case `ioc:IOC`.

### Define a provenance

You declare provenances for your data files in an MCF file. Here is an example of a provenance declaration for a sample dataset on wage data from the OECD:

```
Node: oecd:OECDWages
typeOf: dcs:Provenance
name: "OECD Average Annual Wages"
source: dcid:dc/s/OrganisationForEconomicCo-operationAndDevelopmentOecd
url: "https://www.oecd.org/en/data/indicators/average-annual-wages.html"
```

The following fields are required:

* Node: The DCID of the provenance you are defining, prefixed by the custom namespace.
* `typeOf`: This must be `dcs:Provenance`.
* `name`: A human-readable name.
* `source`: The provider of the data, using its ID. This may be a source that already exists in base Data Commons, like the OECD in this example. If there is no suitable existing source, you need to define one, as described above and then refer to it, using your custom namespace, here.
* url or `sourceDataUrl`: This is the URL of a downloadable file, or a web page providing a link to the data. Note that it must include the prefix, i.e. http(s).

You can also include the following optional metadata:

* `earliestObservationDate` and/or `latestObservationDate`: This should be in ISO format, i.e. *YYYY*, *YYYY*-*MM*, or *YYYYY*-*MM*-*DD*


## Step 4: Define variables in MCF

Data Commons Platform supports observations and variables with up to 3 entities. These can be place or non-place entities. If you need any new non-place entities, please first see [Define custom (non-place) entities](https://docs.datacommons.org/custom_dc/custom_entities.html) for details.

A variable must refer to one or more entities, defined as `observationProperties`.  You can reuse the built-in `observationAbout` property, reuse other existing properties, or create your own. You will likely want to use more descriptive names.


### Define a single-entity variable

To define variables that only involve a single entity, e.g. one location, see [Define statistical variables in MCF](https://docs.datacommons.org/custom_dc/custom_data.html#mcf) and be sure to add the following:

* A custom namespace prefix
* An additional property: `observationProperties: dcs:observationAbout`. 

The following example defines a variable that provides per-country measurements (assume there is an existing property called `cigaretteSmoking`):

```
Node: who:Ratio_CigaretteSmoking_Adults
typeOf: dcs:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults (%)"
description: "Percentage of adults that currently smoke cigarettes"
populationType: dcid:Adult
measuredProperty: dcid:cigaretteSmoking
observationProperties: dcs:observationAbout
statType: dcid:Ratio
```

### Define a multi-entity variable

With multi-entity variables, you can reuse any existing property in base Data Commons. More likely, you will need to define your own.

#### Step 4a: Identify or define an observation property

There are many common properties already available in base Data Commons. To check if a property you need exists, go to <code>datacommons.org/browser/<var>PROPERTY_NAME.</var></code> Properties are always in lowercase. For example, we're going to make use of the existing `dcid:country` and `dcid:gender` in step 2. 

If there is no existing property you can reuse, you'll need to declare custom observation properties. For example, let's say you are tracking exchanges (of people, funds, etc.) between 2 countries. You could define the source and destination countries as observation properties as follows:


```
Node: mynamespace:sourceCountry
typeOf: schema:Property
name: "Source country"
domainIncludes: dcs:StatisticalVariable
rangeIncludes: schema:Country

Node: mynamespace:destinationCountry
typeOf: schema:Property
name: "Destination country"
domainIncludes: dcs:StatisticalVariable
rangeIncludes: schema:Country
```

In the case of places, you don't need to define the actual places, such as countries, since they all exist in base Data Commons. However, if the property represented something different, for example, an organization, and there are no existing nodes representing the relevant organizations in your data, you'd need to define them as [custom entities](https://docs.datacommons.org/custom_dc/custom_entities.html). 


#### Step 4b: Define the variable

In this example, we're going to revisit the smoking variable. In this case, observations are broken down by country and gender. We can reuse existing properties in Data Commons, namely country and gender as observation properties.

```
Node: who:Ratio_CigaretteSmoking_Adults_ByGender
typeOf: dcs:StatisticalVariable
name: "Prevalence of current cigarette smoking among adults, by gender"
description: "Percentage of smokers in the adult population, broken down into male and female"
populationType: schema:Adult
measuredProperty: dcid:cigaretteSmoking
statType: dcid:Ratio
observationProperties: dcs:country, dcs:gender
```

## Step 5 (optional): Define statistical variable groups

If you would your variables to be grouped together (for, say, UI purposes), you will want to create custom statvar groups. See [Define a statistical variable group](https://docs.datacommons.org/custom_dc/custom_data.html#statvar-group) for details.

## Step 6: Prepare the CSV observation files

### Prepare a single-entity observations file

For single-entity observations, the structure is the same as that defined in [Prepare the CSV observation files](https://docs.datacommons.org/custom_dc/custom_data.html#exp_csv), with the exception that there are no built-in default column names. You must map column names to DCIDs, as described in [Step 6: Write your config.json file](#config). Column names can be anything you want, and columns can be in any order.

Here's an example of a CSV file of observations for the corresponding to the `Ratio_CigaretteSmoking_Adults` variable:

```
variable,country,year,value
who:Ratio_CigaretteSmoking_Adults,dcid:country/AFG,2019,7.5
who:Ratio_CigaretteSmoking_Adults,dcid:country/ARE,2018,6.3
```

### Prepare a multiple-entity observations file

For multiple-entity observations, in addition to the [standard required and optional columns](https://docs.datacommons.org/custom_dc/custom_data.html#exp_csv), you add a column for each observation property you have defined. So, for the example variable above, there is an additional column for the "gender" observation property. The CSV file could look like this:

```
variable,gender,country,year,value
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Female,dcid:country/AFG,2019,1.2
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Male,dcid:country/AFG,2019,13.4
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Female,dcid:country/AGO,2016,1.8
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Male,dcid:country/AGO,2016,14.3
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Female,dcid:country/ALB,2018,4.5
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Male,dcid:country/ALB,2018,35.7
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Male,dcid:country/ARE,2018,11.1
who:Ratio_CigaretteSmoking_Adults_ByGender,dcid:Female,dcid:country/ARE,2018,1.6
```

The heading columns can be whatever you want; the observation properties don't have to match the edges you defined in MCF.

> **Note:** The observation properties are required to be present in all observations using this variable. If there are observations (rows) missing values for any observation property, your data may be corrupted. Do not include observations that don't provide values for all required properties in a given CSV file. Instead, create a separate variable with the columns that are present, and provide the observations in a separate CSV file.


## Step 7: Write your config.json file(s) {#config}

Each `config.json` file (in separate directories) defines a self-contained "import" so that you can control which files to ingest at a given time.

A `config.json` file specifies the following:

* The files to be included in the import.
* The sources and provenances of the data in the CSV files.
* Column mappings between the CSV column headings and DCIDs.

Here is the general structure of the file:

<pre>
{
  "includeInputSubdirs": "true", # optional, if files in subdirectories are to be included in this import
  "inputFiles": [
    {
      "pattern": "<var>FILE_MATCHING_EXPRESSION</var>",
      "provenance": "<var>PROVENANCE_DCID</var>",
      "columnMappings": {
         "dcid:variableMeasured": "<var>COLUMN_HEADING</var>",
         "dcid:observationDate": "<var>COLUMN_HEADING</var>",
         "dcid:value": "<var>COLUMN_HEADING</var>",
         "dcid:<var>ENTITY</var>": "<var>COLUMN_HEADING</var>", 
         ...
      }
    },
    {...},
    {...} 
  ]
}
</pre>

* The `pattern` is a single file name or a wildcard expression that identifies matching files in the current directory and/or subdirectory. Expressions use glob syntax. Here are some examples:
    * `*` or `./*` matches all files in the current directory only
    * `**/*` or `./**/*` matches all files in the current directory and all subdirectories. 
    * `my_sub/*` matches all files in the `my_sub` directory only
    * `{schema.mcf,csv/*}` matches a file named `schema.mcf` and all files under directory `csv`.

    The pattern must match both CSV and MCF files.


    **Note:** If you specify any pattern that refers to subdirectories, be sure to also set `includeInputSubdirs = true`.

* The `provenance` is required for all input files (including MCF files). It applies to all the observations contained in the matched files.
* The `columnMappings` section maps heading columns in the matched CSV files to DCIDs. (It is not needed for MCF files.) The first 3 mappings are always required, regardless of the number of entities. At least one entity mapping must be present. Additional entity mappings are required for each custom observation property present in your CSVs.
* The _ENTITY_ can be `dcid:observationAbout` or any existing property or custom property you have defined in the MCF.

### Examples

In the following examples, all files constitute a single import.

{:.no_toc}
#### Example 1: 1 shared MCF file, mixed-entity CSV files, single provenance {#ex1}

This uses the MCF and CSV examples listed above. There is a single MCF file that defines all nodes (variables, provenances, statvar groups) for all observations. Let's say the the files are organized into the same directory, as follows:


```
ingestion_base /
  |- my_import_directory /    
    |– config.json 
    |– schema.mcf
    |- smokers_single_entity.csv
    |– smokers_multi_entity.csv 
```

The config.json file would be as follows:

```json
{
  "inputFiles": [
    {
      "pattern": "schema.mcf",
      "provenance": "who:UN_WHO"
     },
     {
      "pattern": "smokers_single_entity.csv",
      "provenance": "who:UN_WHO",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:observationAbout": "country",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    },
    {
      "pattern": "smokers_multi_entity.csv",
      "provenance": "who:UN_WHO",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:country": "country",
        "dcid:gender": "gender",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    }
  ]
}
```

{:.no_toc}
#### Example 2: 1 shared MCF file, 2 specific MCF files, mixed-entity CSV files, 1 provenance {#ex2}

In this example, we imagine this scenario, which is a good design pattern:

* A top-level MCF file that defines the shared nodes, namely the provenance and the statvar group
* Directory-specific MCF files that define the variables and property nodes that are used by the CSV files in that directory

```
ingestion_base /
  |- my_import_directory /    
    |– config.json 
    |– shared_schema.mcf
    |- single_entity_files/
      |- single_entity_schema.mcf
      |- smokers_single_entity.csv
    |- multiple_entity_files/
      |- multi_entity_schema.mcf
      |– smokers_multi_entity.csv 
```

The config.json file could be as follows:

```json
{
  "includeInputSubdirs": true,
  "inputFiles": [
    {
      "pattern": "shared.mcf",
      "provenance": "who:UN_WHO"
    },
    {
      "pattern": "single_entity_files/*",
      "provenance": "who:UN_WHO",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:observationAbout": "country",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    },
    {
      "pattern": "multi_entity_files/*",
      "provenance": "who:UN_WHO",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:country": "country",
        "dcid:gender": "gender",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    }
  ]
}
```

{:.no_toc}
#### Example 3: 2 specific MCF files, 2 single-entity CSV files, 2 provenances, 2 subdirectories {#ex3}

This example is similar to the one above, except it uses different provenances instead of different types of variables. We'll imagine that there are no shared nodes, so no shared, top-level MCF file. Instead, there is one MCF file for one provenance and its variables, and a second MCF for a second provenance and its variables. The file structure is like this:

```
my_import_directory /    
|– config.json 
|- provenance1/
   |- schema1.mcf
   |- annual_average_wages.csv
|- provenance2/
   |- schema2.mcf
   |– gender_wage_gap.csv 
```

The `config.json `file would look like this:

```json
{
  "includeInputSubdirs": true,
  "inputFiles": [
    {
      "pattern": "provenance1/*",
      "provenance": "oecd:OECDWages",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:observationAbout": "country",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    },
    {
      "pattern": "provenance2/*",
      "provenance": "oecd:OECDGenderWageGap",
      "columnMappings": {
        "dcid:variableMeasured": "variable",
        "dcid:observationAbout": "country",
        "dcid:observationDate": "year",
        "dcid:value": "value"
      }
    }
  ]
}
```
