---
layout: default
title: Working with Custom Data
nav_order: 3
parent: Overview
---

Custom Data Commons provides a simple mechanism to import your own data, but it requires that the data be provided in a specific format and file structure. 

-  All data must be in CSV format, using the schema described below.
-  You must also provide a JSON configuration file, named `config.json`, to map the CSV contents to the Data Commons schema knowledge graph. The contents of the JSON file are described below.
-  All CSV files and the JSON file must be in the same directory

Examples are provided in [`custom_dc/sample`](https://github.com/datacommonsorg/website/tree/master/custom_dc/sample) and [`custom_dc/examples`](https://github.com/datacommonsorg/website/tree/master/custom_dc/examples) directories.

## Preparing the CSV files

Custom Data Commons provides a simplified data model, which allows your data to be mapped to the Data Commons knowledge graph schema. Data in the CSV files should conform to a   
_variable per column_ scheme. This requires minimal manual configuration; the Data Commons importer importer can create observations and statistical variables if they don't already exist, and it resolves all columns to [DCID](https://docs.datacommons.org/glossary.html#dcid)s. 

With the variable-per-column scheme, data is provided in this format, in this exact sequence:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

There is a single property, the _ENTITY_; all other properties must be expressed as [statistical variables](https://docs.datacommons.org/glossary.html#variable). To illustrate what this means, consider this example: let's say you have a dataset that provides the number of public schools in U.S. cities, broken down by elementary, middle, secondary and postsecondary. Your data might have the following structure, which we identify as _variable per row_ (numbers are not real, but are just made up for the sake of example):

```json  
city, year, typeOfSchool, count  
San Francisco, 2023, elementary, 300  
San Francisco, 2023, middle, 300  
San Francisco, 2023, secondary, 200  
San Francisco, 2023, postsecondary, 50  
San Jose, 2023, elementary, 400  
San Jose, 2023, middle, 400  
San Jose, 2023, secondary, 300  
San Jose, 2023, postsecondary, 50  
```

For custom Data Commons, you need to format it so that every property corresponds to a separate statistical variable, like this:

```json  
city, year, countElementary, countMiddle, countSecondary, countPostSecondary  
San Francisco, 2023, 300, 300, 200, 50  
San Jose, 2023,400, 400, 300, 50  
```

The _ENTITY_ is an existing property in the Data Commons knowledge graph that is used to describe an entity, most commonly a place. The best way to think of the entity type is as a key that could be used to join to other data sets. The column heading can be expressed as any existing place-related property; see [Place types](https://docs.datacommons.org/place_types.html) for a full list. You can also use `dcid` or its prefixes, `geoId`, `latLng`. If you use `dcId`, the value must be a resolved [DCID](https://docs.datacommons.org/glossary.html#dcid). If you're not sure what to use, you can simply use the heading `name` or `place` and the importer will resolve it automatically.

The _DATE_ is the date of the observation and should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_, with the corresponding heading, i.e. `year`, `month` or `date`.

The _VARIABLE _should contain a metric [observation](https://docs.datacommons.org/glossary.html#observation) at a particular time. We recommend that you try to reuse existing statistical variables where feasible; use the main Data Commons [Statistical Variable Explorer](https://datacommons.org/tools/statvar) to find them. If there is no existing statistical variable you can use, name the heading with an illustrative name and the importer will create a new variable for you. 

The variable values must be numeric. Zeros and null values are accepted: zeros will be recorded and null values ignored

All headers must be in camelCase.

The following are some valid examples of headers:  
   
```json  
geoId,observationYear,statVar1,statVar2  
06,2021,555,666  
08,2021,10,10  
```  
```json  
name,observationYear,statVar1,statVar2  
California,2021,555,666  
Colorado,2021,10,10  
```  
```json  
dcId,observationYear,statVar1,statVar2  
geoId/06,2021,555,666  
geoId/08,2021,10,10  
```

## Writing the data config file

The config.json file specifies how the CSV contents should be mapped and resolved to the Data Commons schema. See the example in the [`sample/config.json`](https://github.com/datacommonsorg/website/blob/master/custom_dc/sample/config.json) file provided, which describes the data in the [`sample/average_annual_wage.csv`](https://github.com/datacommonsorg/website/blob/master/custom_dc/sample/average_annual_wage.csv) and [`sample/gender_wage_gap.csv`](https://github.com/datacommonsorg/website/blob/master/custom_dc/sample/gender_wage_gap.csv) files.  

Here is the general spec for the JSON file:  

<pre>
{  
  "inputFiles": {  
    "<var>FILE_NAME1</var>": {  
      "entityType": "<var>ENTITY_PROPERTY</var>",  
      "ignoreColumns": ["<var>COLUMN1</var>", "<var>COLUMN2</var>", ...],  
      "provenance": "<var>NAME</var>"  
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

### `inputFiles`

The top-level `inputFiles` field should encode a map from the input file name to parameters specific to that file. Keys can be individual file names or wildcard patterns if the same config applies to multiple files.  
You can use the `*` wildcard; matches are applied in the order in which they are specified in the config. For example, in the following:  

```json  
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

<dl>
<dt><code>entityType</code></dt>
<dd>Required: All entities in a given file must be of a specific type. This type should be specified as the value of the ``entityType`` field. The importer tries to resolve entities to DCIDs of that type. In most cases, the `entityType` will be a supported place type; see [Place types](https://docs.datacommons.org/place_types.html) for a list.
</dd>

<dt><code>ignoreColumns</code></dt>
<dd>Optional: The list of column names to be ignored by the importer, if any.</dd>

<dt><code>provenance</code></dt>
<dd>Required: The provenance (name) of this input file. Provenances typically map to a dataset from a source. For example, `WorldDevelopmentIndicators` provenance (or dataset) is from the `WorldBank` source.  
You must specify the provenance details under `sources`.`provenances`; this field associates one of the provenances defined there to this file.</dd>
</dl>

### `variables`

This section is optional. You can use it to override names and associate additional properties with the statistical variables in the files, using the parameters described below. All parameters are optional.

#### Variable parameters

<dl>
<dt><code>name</code></dt>
<dd>The display name of the variable, which will show up in the site's exploration tools. If not specified, the column name is used as the display name.  
The name should be concise and precise; that is, the shortest possible name that allow humans to uniquely identify a given variable. The name is used to generate NL embeddings.</dd>

<dt><code>description</code></dt>
<dd>A long-form description of the variable.</dd>

<dt><code>properties</code></dt>
<dd>Additional Data Commons properties associated with this variable. These are Data Commons property entities. See [Representing statistics in Data Commons](https://github.com/datacommonsorg/data/blob/master/docs/representing_statistics.md#statisticalvariable) for more details.  
Each property is specified as a key:value pair. Here are some examples:  

```json 
{
"populationType": "schema:Person",  
"measuredProperty": "age",  
"statType": "medianValue",  
"gender": "Female" 
} 
```
</dd>

<dt><code>group</code></dt>  
<dd>You can arrange variables in groups, so that they appear together in the Statistical Variables Explorer and other exploration tools. The group name is used as the heading of the group. For example, in the sample data, the group name `OECD` is used to group together the two variables from the two CSV files:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot5.png) {}

You can have a multi-level group hierarchy by using `/` as a separator between each group.</dd>

<dt><code>searchDescriptions</code></dt>

<dd>Formerly `nlSentences`. An array of descriptions to be used for creating more NL embeddings for the variable. This is only needed if the variable `name` is not sufficient for generating embeddings.  

Note: `nlSentences` is deprecated and will be removed in the future.</dd>
</dl>

### `sources`

The `sources` section encodes the sources and provenances associated with the input dataset. Each named source is a mapping of provenances to URLs. 

#### Source parameters

<dl>
<dt><code>url</code></dt>
<dd>Required: The URL of the source.</dd>

<dt><code>provenances</code></dt>  
<dd>Required: A set of name:URL pairs. Here are some examples:
TODO: add examples
</dd>
</dl>

## Loading local custom data

To load custom data uploaded to Google Cloud, see instead [Pointing the local Data Commons site to the Cloud data](testing_cloud.md) for procedures.

### Starting the Docker container with local custom data

Once you have your CSV files and config.json set up, use the following command to restart the Docker container, mapping your custom data directory to the Docker userdata directory.

<pre>
docker run -it \  
-p 8080:8080 \  
-e DEBUG=true \  
--env-file $PWD/custom_dc/sqlite_env.list \  
-v $PWD/custom_dc/<var>CUSTOM_DATA_DIRECTORY</var>:/userdata \  
[-v $PWD/custom_dc/<var>CUSTOM_DATA_DIRECTORY</var>/datacommons:/sqlite]  
[gcr.io/datcom-ci/datacommons-website-compose:stable](gcr.io/datcom-ci/datacommons-website-compose:stable)  
</pre>

The optional `-v` flag preserves the SQLite data so it loads automatically when you restart the Docker container.

Every time you make changes to the CSV or JSON files, you should reload the data, as described below.

## Loading custom data in SQLite

As you are iterating on changes to the source CSV and JSON files, you will need to reload the data. Custom Data Commons allows you to reload data on the fly, while the website is running, so even multiple users can reload data with a shared Docker instance.

You can load the new/updated data from using the /admin page on the site, or using curl, from the command line:

1. Optionally, in the `sqlite_env.list` file, set the `ADMIN_SECRET` environment variable to a string that authorizes users to load data.
1. Start the Docker container as usual, being sure to map the path to the directory containing the custom data (see command above). 
1. With the services running, do either of the following:
    -  In the browser, navigate to the `/admin page`. If a secret is required, enter it in the text field, and click **Load**. 
    -  From a terminal window command line, run the following:

>   <pre> 
    curl -X POST localhost|HOST_NAME:8080/admin/load-data \  
  	 -H "Content-Type: application/x-www-form-urlencoded" \  
  	 [-d "secret=<var>ADMIN_SECRET</var>"]  
	</pre>

In both cases, this runs a script inside the Docker container, that converts the CSV data into SQL tables, and generates embeddings in the container as well. The database is created as <code>custom_dc/<var>CUSTOM_DATA_DIRECTORY</var>/datacommons/datacommons.db</code> and embeddings are generated in <code>custom_dc/<var>CUSTOM_DATA_DIRECTORY</var>/datacommons/nl/</code>. 

## Inspecting the SQLite database

If you need to troubleshoot custom data, it is helpful to inspect the contents of the generated SQLite database.

To do so, from a terminal window, open the database:

<pre>  
sqlite3 website/custom_dc/<var>CUSTOM_DATA_DIRECTORY</var>/datacommons/[datacommons.db](datacommons.db)  
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