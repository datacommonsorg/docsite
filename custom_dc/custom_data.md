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

- All observations data must be in CSV format, using the schema described later. 
- You must also provide a JSON configuration file, named `config.json`, that specifies how to map and resolve the CSV contents to the Data Commons schema knowledge graph. The contents of the JSON file are described below.
- Depending on how you define your statistical variables (metrics), you may need to provide [MCF (Meta Content Framework)](https://en.wikipedia.org/wiki/Meta_Content_Framework){: target="_blank"} files.
- If you need to define new custom entities, you may want to provide them in MCF; if you need to define new entities types, you _will need_ to provide them in MCF.

### Files and directory structure

You can have as many CSV and MCF files as you like, and they can be in multiple subdirectories. There must only be one JSON config file, in the top-level input directory. For example:

```
my_data/
├── config.json
├── (nodes1.mcf)
├── datafile1.csv
├── datafile2.csv
└── some_more_data/
    ├── (nodes2.mcf)
    ├── datafile3.csv
    └── datafile4.csv
```
The following sections walk you through the process of setting up your data.

{: #entities}
## Step 1: Determine whether you need new entities or entity types

Schema.org and the base Data Commons knowledge graph define entity types for just about everything in the world. An _entity type_ is a high-level concept, and is derived directly from a [`Class`](https://datacommons.org/browser/Class){: target="_blank"} type. The most common entity types in Data Commons are place types, such as `City`, `Country`, `AdministrativeArea1`, etc. Examples of other entity types are `Hospital`, `PublicSchool`, `Company`, `BusStation`, `Campground`, `Library` etc. It is very rare that you would need to create a new entity type, unless you are working in a highly specialized domain, such as biomedical data.

An _entity_ is an instance of an entity type. For example, for public schools, base Data Commons has many U.S. schools in its knowledge graph, such as [`nces/010162001665`](https://datacommons.org/browser/nces/010162001665){: target="_blank"} (Adams Elementary School) or [`nces/010039000201`](https://datacommons.org/browser/nces/010039000201){: target="_blank"} (Wylam Elementary School). Base Data Commons contains thousands of places and other entities, but it's possible that it does not have specific entities that you need. For example, it has about 100 instances of `Company`, but you may want data for other companies besides those. As another example, let's say your organization wants to collect (possibly private) data about different divisions or departments of your org; in this case you would need to define entities for them.

> **Note:** You should always reuse existing entities from base Data Commons rather than re-defining them. This way, you get all the properties already defined for those entities and all their linked nodes, and can more easily join with base data if needed.

Currently it is not possible to search the knowledge graph, so you need to drill down from higher-level nodes to find an entity you are looking for.

To determine if a given entity exists in base Data Commons through the UI:

1. Find a relevant entity type: Go to <https://datacommons.org/browser/Class>{: target="_blank"} and scroll to the **Subject type: Class** section.

  ![Class types](/assets/images/custom_dc/customdc_screenshot11.png)

  If you don't find anything in this list, you'll need to use the API, as described next.

To determine if a given entity exists in base Data Commons through the API:

1. Use the REST Node API through your browser to get a complete list of entity types: See [Get a list of all existing entity types](/api/rest/v2/node.md#list-entity-types) in the REST API V2 reference. Be sure to set the `nextToken` parameter until you find the relevant entity type or no `nextToken` is returned in the response. If you don't find an entity type that matches your needs (very rare), you will need to create one; see xxx for details.
1. If you find a relevant entity type, note the DCID of the entity type of interest. The DCID of entity types is usually a meaningful name, capitalized, such as `Hospital` or `Drug`.
1. Use the Node API through your browser to look up all incoming arcs by the `typeof` property: 

  <pre>
  https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>ENTITY_TYPE</var>&property=<-typeOf
  </pre>
  _ENTITY_TYPE_ is the DCID you've obtained in the previous step. For example:

  ```
  https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=PublicSchool&property=<-typeOf
  ```

1. If your entity is listed, note its DCID. If you are unable to find a relevant entity, you will need to create one. 

## Step 2: Identify your statistical variables

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
- `Count_School_Public_Elementary`
- `Count_School_Public_Middle`
- `Count_School_Public_Secondary`
- `Count_School_Private_Elementary`
- `Count_School_Private_Middle`
- `Count_School_Private_Secondary`

If you wanted totals or subtotals of combinations, you would need to create additional variables for these as well.

{: #schema}
## Step 3: Choose between "implicit" and "explicit" schema definitions

Custom Data Commons supports two ways of importing your data:
- **Implicit** schema definition. This method is simplest, and does not require that you write MCF files, but it is more constraining on the structure of your data. You don't need to provide variables and entities in DCID format (although you may); but you must follow a strict column ordering, and variables must be in _variable-per-column_ format, described below. Naming conventions are loose, and the Data Commons importer will generate DCIDs for your variables and observations based on a predictable column order or for entities based on the column you identify. This method is _simpler and recommended_ for most datasets.
- **Explicit** schema definition. This method is a bit more involved, as you must explicitly define DCIDs for all your variables (and entity types if needed) as nodes in MCF files. All variables in the CSVs must reference DCIDs. Using this method allows you to specify variables in _variable-per-row_ format and to specify additional properties of variables or entities, offering greater flexibility. There are a few cases for which this option might be a better choice:
  - You have hundreds of variables, which may be unmanageable as separate columns or files.
  - You want to be able to specify additional properties, for example, unit of measurement, of the observations at a more granular level than per-file. As an example, let's say you have a variable that measures financial expenses, across multiple countries; you may want to be able to specify the country-specific currency of each observation.
  - In the case that you are missing observations for specific entities (e.g. places) or time periods for specific variables, and you don't want to have lots of null values in columns (sparse tables).
  - You need to create an entity type, and need to define more fields than allowed by the implicit method (name and description).

> Note: You can actually mix and match these two methods for variable versus entity definitions. However, you may find it much simpler to stick to one schema specification scheme.

### Variable schemas

To illustrate the difference between variable-per-column and variable-per-row schemas, let's use the schools example data again. In variable-per-column, you would represent the dataset as follows:

**Variable-per-column schema**

| CITY | YEAR | COUNT_SCHOOL_PUBLIC_ELEMENTARY | COUNT_SCHOOL_PUBLIC_MIDDLE | COUNT_SCHOOL_PUBLIC_SECONDARY | COUNT_SCHOOL_PRIVATE_ELEMENTARY | COUNT_SCHOOL_PRIVATE_MIDDLE | COUNT_SCHOOL_PRIVATE_SECONDARY |
|------|------|-------------------------|---------------------|------------------------|---------------------------|---------------------|-------------------------|
| San Francisco | 2023 | 300 | 300 | 200 | 100 | 100 | 50 |
| San Jose | 2023 | 400 | 400 | 300 | 200 | 200 | 100 |

The names that appear in the columns and rows don't need to be DCIDs or follow any convention, because the columns must always be specified in this exact sequence:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

In variable-per-row, the same dataset would be provided as follows:

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

## Prepare your data using implicit schema 

In this section, we will walk you through concrete examples of how to go about setting up your CSV and JSON files. Also see the example files provided in [https://github.com/datacommonsorg/website/tree/master/custom_dc/sample](https://github.com/datacommonsorg/website/tree/master/custom_dc/sample){: target="_blank"}.

{: #custom-entities}
### Step 0: Define custom entities (if needed) 

Before creating new entities, please see [above](#entities) to determine if you can reuse existing ones from base Data Commons. It is not necessary to create new entities for your Data Commons instance if your data is aggregated by a place type, or an entity that already exists in base. Just skip to the next section on [variables and observations](#csv).

If you do need to define new custom entities, you need to create one or more CSV files to list them. These should be separate from the CSV files used to contain observations.

The columns can be in any order, with any heading, and there can be as many as you need to define various properties of the entity. You can choose to specify a column that defines DCIDs for the entities, or you can just have the importer generate them for you. If there is no existing entity type for your entities you can create those using the JSON config.

{:.no_toc}
#### Example 1: New entities, existing entity type

For example, let's say you wanted to track the performance of individual hospitals in your state rather than at the aggregated state level. Base Data Commons already has an entity type [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"} but you'll notice that there are no actual hospitals in the knowledge graph. The first step would be to add definitions for hospital entities. Here is an example of real-world data from U.S. Department of Health and Human Services for the state of Alaska:

```csv
CCN,name,address,city_name,City,zipCode,hospitalSubtype
A22001,St Elias Specialty Hospital,4800 Cordova Street,Anchorage,geoId/02,99503,Long Term
A20001,Providence Alaska Medical Center,3200 Providence Drive,Anchorage,geoId/02,99508,Short Term
A20008,Bartlett Regional Hospital,3260 Hospital Dr,Juneau,geoId/02,99801,Short Term
A20012,Fairbanks Memorial Hospital,1650 Cowles Street,Fairbanks,geoId/02,99701,Short Term
A21307,Cordova Community Medical Center,Po Box 160 - 602 Chase Avenue,Cordova,geoId/02,99574,Critical Access Hospitals
A21313,South Peninsula Hospital,4300 Bartlett St,Homer,geoId/02,99603,Critical Access Hospitals
A21311,Ketchikan Medical Center,3100 Tongass Avenue,Ketchikan,geoId/02,99901,Critical Access Hospitals
A20017,Alaska Regional Hospital,2801 Debarr Road,Anchorage,geoId/02,99508,Short Term
A20024,Central Peninsula General Hospital,250 Hospital Place,Soldotna,geoId/02,99669,Short Term
A21301,Providence Valdez Medical Center,Po Box 550,Valdez,geoId/02,99686,Critical Access Hospitals
A21306,Providence KodigeoId/02 Island Medical Ctr,1915 East Rezanof Drive,KodigeoId/02,geoId/02,99615,Critical Access Hospitals
A21304,Petersburg Medical Center,Po Box 589,Petersburg,geoId/02,99833,Critical Access Hospitals
A20006,Mat-Su Regional Medical Center,2500 South Woodworth Loop,Palmer,geoId/02,99645,Short Term
A21302,Providence Seward Medical Center,417 First Avenue Po Box 365,Seward,geoId/02,99664,Critical Access Hospitals
```
The CCN is a certification number that uniquely identifies U.S. hospitals. You could use it as the DCID, or you could have Data Commons automatically assign a DCID. In both cases, you would do that in the JSON config.

If you are defining more than one type of entity (for example a `Hospital` and a `School`), use a separate CSV for each.

{:.no_toc}
#### Example 2: New entities, new entity type 

Here is a real-world example from the biomedical domain. In the U.S., pharmaceutical compounds are identified by "stems" (letter sequences) that can be combined together to define new non-proprietary drug names. But the pharmaceutical "stem" is not a concept that exists in schema.org. Therefore, this concept is defined as a new entity type in [`config.json`](#new-entity-json), while the following CSV file identifies some actual stems (entities):

```csv
Stem,Definition,Examples
ac,anti-inflammatory agents,bromfenac
zolac,anti-inflammatory;  pyrazole acetic acid derivatives,rovazolac
actant,pulmonary surfactants,"beractant, lucinactant, calfactant"
adenant,adensosine receptor antagonists,preladenant
adol,analgesics,tazadolene
adox,antibacterials,carbadox
```

### Step 1: Provide variables and observations in CSV {#csv}

As mentioned above, CSV files using implicit schema must contain these columns -- and _only_ these columns, no others -- in the following order:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

The _ENTITY_ is an existing entity, most commonly a place. The best way to think of the entity is as a key that could be used to join to other data sets. The column heading can be expressed as any existing place-related property; see [Place types](/place_types.html) for a full list. It may also be any of the special DCID prefixes listed in [Special place names](#special-names). 

If the entity is not a place, it must be the DCID of the entity of interest. For example, if the entity type for which you are tracking observations is `PublicSchool`, all rows must contain DCIDs of the public schools rather than their names; for example, rather than `Andalusia Elementary School`, you would need to specify `nces/010006001467`.

> **Note:** The type of the entities in a single file should be unique; do not mix multiple entity types in the same CSV file. For example, if you have observations for cities and counties, put all the city data in one CSV file and all the county data in another one. In addition, if you are using custom-defined entities, keep your entity definition files and variable/observation files separate.

The _DATE_ is the date of the observation and should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_. The heading can be anything, although as a best practice, we recommend using a corresponding identifier, such as `year`, `month` or `date`.

The _VARIABLE_ should contain a metric [observation](/glossary.html#observation) at a particular time. It could be an existing variable in the knowledge graph, to which you will add a different provenance, or it can be a new one. The heading can be anything, but you should encode the relevant attributes being measured, so that the importer can correctly create a new variable node for you.

The variable values must be numeric. Zeros and null values are accepted: zeros will be recorded and null values ignored. 

{:.no_toc}
#### Example 1: Observations with (existing) place entity

Here is an example of some real-world data from the WHO on the prevalance of smoking in adult populations, broken down by sex, in the correct CSV format:

```csv
country,year,Adult_curr_cig_smokers,Adult_curr_cig_smokers_female,Adult_curr_cig_smokers_male
Afghanistan,2019,7.5,1.2,13.4
Angola,2016,,1.8,14.3
Albania,2018,,4.5,35.7
United Arab Emirates,2018,6.3,1.6,11.1
```
Note that the data is missing values for the total population percentage for Angola and Albania.

{:.no_toc}
#### Special place names {#special-names}

In addition to the place names listed in [Place types](/place_types.html), you can also use the following special names as headings:

- [`dcid`](/glossary.html#dcid) --- An already resolved DCID. Examples:`country/USA`, `geoId/06`
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

#### Example 2: Observations with new (custom) entities 

If you are providing observations for custom entities, the observations should be in a separate file. Using our original example, here are some metrics and observations for indnividual hospitals. Note that the first column must contain the DCIDs that you have defined. In this particular case, the dataset uses a negative number, rather than a null value, to indicate that the data is not available for that observation

```csv
dcid,week,total_num_staffed_beds,num_staffed_adult_beds,num_staffed_inpatient_icu_beds,num_staffed_adult_inpatient_icu_beds,num_staffed_inpatient_icu_beds_occupied,num_staffed_adult_icu_beds_occupied
22001,2023-01-27,79,79,12,12,-999999,-999999
20001,2023-01-27,1262,1048,264,146,264,146
20012,2023-01-27,0,0,9,9,7,7
21307,2023-01-27,0,0,13,13,4,4
21313,2023-01-27,0,0,0,0,0,0
20017,2023-01-27,0,0,-999999,-999999,0,0
20024,2023-01-27,10,10,-999999,-999999,-999999,-999999
21301,2023-01-27,836,780,101,62,66,62
21306,2023-01-27,0,0,9,9,8,8
21304,2023-01-27,6,6,0,0,0,0
20006,2023-01-27,50,50,0,0,0,0
21302,2023-01-27,0,0,0,0,0,0
```

### Step 2: Write the JSON config file

You must define a `config.json` in the top-level directory where your CSV files are located. With the implicit schema method, you need to provide the following specifications:
- The input files location and entity type
- The sources and provenances of the data
- Optionally, additional properties of the statistical variables you've used in the CSV files
- If needed, some information about custom entities

If you are using custom entities, you include the specifications for them in the same `config.json` file as observations.

{:.no_toc}
#### Example 1: Observations with existing entities

Here is an example of how the config file would look for the WHO CSV file we defined earlier. More details are below.

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
  - `searchDescriptions`: This is a comma-separated list of natural-language text descriptions of the variable; these descriptions will be used to generate embeddings for the NL query interface.
  - `group`: This will display the variables as a group in the Statistical Variable Explorer, using the name you provide as the heading. You can have multiple groups, but you can only assign a variable to one at a time. 
    > Tip: If you would like to assign the same variable to multiple groups, you can do so using MCF. See [Define a statistical variable group node](#statvar-group) for details.

The other fields are explained in the [Data config file specification reference](#json-ref).

{:.no_toc}
#### Example 2: New entities, existing entity type

Here's an example of how a `config.json` file could look for our hospital data:

```json
{
  "inputFiles": {
    "hospital_entities.csv": {
      "importType": "entities",
      "rowEntityType": "Hospital",
      "idColumn": "CCN",
      "entityColumns": [
        "City"
      ],
      "provenance": "Alaska Weekly Hospital Capacity"
    },
  },
  "entities": {
    "Hospital": {
      "name": "Hospital"
    }
  },
  "sources": {
    "HHS Protect Public Data Hub": {
      "url": "https://public-data-hub-dhhs.hub.arcgis.com/",
      "provenances": {
        "Alaska Weekly Hospital Capacity": "https://public-data-hub-dhhs.hub.arcgis.com/datasets/d47bfcaac2544c2eb1fcfb3d36b5ed23_0/explore"
      }
    }
  }
}
```
Note the presence of the `entities` section and these important fields:

- `input_files`:
  - `importType`: By default this is `variables`; to tell the importer that you are adding entities in that CSV file, you must specify `entities`.
  - `rowEntityType`: This specifies the entity type that the entities are derived from. In this case, we specify an existing entity, [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"}. Note that the entity must be identified by its DCID. It must also match the identifier in the `entities` section. 
  - `idColumn`: This is optional, and tells the importer to use the values in the specified column as DCIDs. In this case, we specify `CCN`, which indicates that the values in the `CCN` column should be used as the DCIDs for the entities. If you don't specify this field, Data Commons will just create DCIDs automatically.
  - `entityColumns`: This is also optional: if you want your new entities to be linked to an existing entity type (or types), you can specify the column(s) containing matching existing entities. For example, if you wanted to be able to aggregate your hospital data at the city level, you could specify [`City`](https://datacommons.org/browser/City){: target="_blank"} as an entity column. Note that the heading of the column and its reference here must use the DCID of the entity. So if you additionally wanted to aggregate at the zip code level, you would need to specify [`CensusZipCodeTabulationArea`](http://localhost:8080/browser/CensusZipCodeTabulationArea){: target="_blank"}, the existing DCID for "zip code", as the column heading here and in the CSV file.
- `entities`: You use this section to identify an existing entity type(s) or define an entirely new one. To link to an existing entity type, use its DCID as the entry ID. In our example this is `Hospital`. 
  - `name`: This is optional and only relevant if you are creating a new entity type (see below).
  - `description`: This is optional and only relevant if you are creating a new entity type (see below).
  
The other fields are explained in the [Data config file specification reference](#json-ref).

{:.no_toc}
#### Example 3: New entities, new entity type {#new-entity-json}

Here's an example of defining new entities _and_ a new entity type in the JSON file, building on the earlier "stem" example. In this example, `NameStem` is a new entity type, used for the `rowEntityType`. By identifying the `Stem` column from the CSV, DCIDs will be created for all the entity values in the column.

```json
{
  "inputFiles": {
    "usan.csv": {
      "importType": "entities",
      "rowEntityType": "Stem",
      "idColumn": "Stem",
      "provenance": "United States Adopted Names approved stems"
    }
  },
  "entities": {
    "Stem": {
      "name": "USAN Stem",
      "description": "A common stem for which chemical and/or pharmacologic parameters have been established. This is designated by the United States Adopted Names (USAN) Council."
    }
  },
  "sources": {
    "AMA": {
      "url": "https://www.ama-assn.org/",
      "provenances": {
        "United States Adopted Names approved stems": "https://www.ama-assn.org/about/united-states-adopted-names/united-states-adopted-names-approved-stems"
    }
  }
}
```

{:.no_toc}
#### Example 4: Observations with new entities

Here's an example of the previous hospital data, covering both the entities and the observations:

```json
{
  "inputFiles": {
    "hospital_entities.csv": {
      "importType": "entities",
      "rowEntityType": "Hospital",
      "idColumn": "ccn",
      "entityColumns": [ "City"],
      "provenance": "Alaska Weekly Hospital Capacity"
    },
    "hospital_observations.csv": {
      "importType": "observations",
      "entityType": "Hospital",
      "provenance": "Alaska Weekly Hospital Capacity"
    }
  },
  "entities": {
    "Hospital": {
      "name": "Hospital"
    }
  },
  "variables": {
    "total_num_staffed_beds": {
      "name": "All beds",
      "description": "Weekly sum of all staffed beds per hospital",
      "searchDescriptions": [
        "Total number of beds in Alaska hospitals each week",
        "Total number of staffed beds in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals"
    },
    "num_staffed_adult_beds": {
      "name": "Beds for adults",
      "description": "Weekly sum of all staffed beds reserved for adults per hospital",
      "searchDescriptions": [
        "Number of beds for adults in Alaska hospitals each week",
        "Number of staffed beds for adults in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals"
    },
    "num_staffed_inpatient_icu_beds": {
      "name": "Inpatient ICU beds",
      "description": "Weekly sum of all staffed inpatient beds in the ICU per hospital",
      "searchDescriptions": [
        "Number of beds in inpatient ICUs in Alaska hospitals each week",
        "Number of staffed beds there are in inpatient ICUs in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals"
    },
    "num_staffed_adult_inpatient_icu_beds": {
      "name": "Inpatient ICU beds for adults",
      "description": "Weekly sum of all staffed beds that are reserved for adults in inpatient ICs per hospital",
      "searchDescriptions": [
        "Number of beds for adults in inpatient ICUs in Alaska hospitals each week",
        "Number of staffed beds for adults in ICUs in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals"
    },
    "num_staffed_inpatient_icu_beds_occupied": {
      "name": "Occupied inpatient ICU beds",
      "description": "Weekly sum of all staffed beds that are occupied in the inpatient ICU per hospital",
      "searchDescriptions": [
        "Number of beds that are occupied in inpatient ICUs in Alaska hospitals each week",
        "Number of staffed beds that are occupied in inpatient ICUs in Alaska hospitals"
      ],
      "group": "Alaska Hospitals"
    },
    "num_staffed_adult_icu_beds_occupied": {
      "name": "Occupied ICU beds for adults",
      "description": "Weekly sum of all staffed beds that are occupied by adults in the ICU per hospital",
      "searchDescriptions": [
        "Total number of beds occupied by adults in ICUs in Alaska hospitals each week",
        "Total number of staffed beds that are occupied by adults in ICUs in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals"
    }
  },
  "sources": {
    "HHS Protect Public Data Hub": {
      "url": "https://public-data-hub-dhhs.hub.arcgis.com/",
      "provenances": {
        "Alaska Weekly Hospital Capacity": "https://public-data-hub-dhhs.hub.arcgis.com/datasets/d47bfcaac2544c2eb1fcfb3d36b5ed23_0/explore"
      }
    }
  }
}
```

## Prepare your data using explicit schema

Nodes in the Data Commons knowledge graph are defined in Metadata Content Format (MCF). For custom Data Commons using explicit schema, you must define your statistical variables. You can choose to define custom entities in either CSV files (as described in [Define new entities](#custom-entities) above) or MCF; in this section, we demonstrate how to do so using MCF. When you define any entity type, property, or variable in MCF, you must explicitly assign them DCIDs. 

You can define your statistical variables in a single MCF files, or split them up into as many separate MCF files as you like. MCF files must have .mcf suffix.

In this section, we will walk you through a concrete example of how to go about setting up your MCF, CSV, and JSON files.

{: #custom-entities}
### Step 0: Define custom entities (if needed) in MCF

Defining a custom entity type in MCF gives you more control of the fields you want to include as properties of the entity type than in `config.json` (which only allows for `name` and `description`). Essentially you define new nodes with DCIDs, and you can use any random key-value pair as properties of the node. You can even attach new properties to existing entity types and define enums for entity types.

#### Example 1: New entity type

Here is an example of the aforementioned [`Stem` entity type](). This MCF object serves the same function as the `config.json` `entities` section, but it additionally explicitly specifies a DCID (instead of letting the system create one) and adds a few other properties.

```
Node: dcid:Stem
name: "US Adopted Name Stem"
typeOf: schema:Class
subClassOf: dcs:ChemicalSubstance
shortDisplayName: "USAN Stem"
description: "A common stem for which chemical and/or pharmacologic parameters have been established. This is designated by the United States Adopted Names (USAN) Council."
descriptionUrl: "https://www.ama-assn.org/about/united-states-adopted-names/united-states-adopted-names-approved-stems"
```

Note that a new entity type must be defined as a type of `schema:Class`. 

#### Example 2: New property on existing entity


{:.no_toc}
#### Example 3: New entities, existing entity type

Here is an example of the hospitals entities discussed earlier. These MCF objects serve the same function as the CSV file mentioned above. 
```




### Step 1: Define statistical variables in MCF

Nodes in the Data Commons knowledge graph are defined in Metadata Content Format (MCF). For custom Data Commons using explicit schema, you must define your statistical variables using MCF. The MCF file must have a `.mcf` suffix. The importer will automatically find them when you start the Docker data container.

#### Define statistical variables

Here's an example of defining the same statistical variables in the WHO data in MCF. It defines 3 statistical variable nodes. 

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
The order of nodes and fields within nodes does not matter.

The following fields are always required:
- `Node`: This is the DCID of the entity you are defining. 
- `typeOf`: In the case of statistical variable, this is always `dcid:StatisticalVariable`. For a group of 
- `name`: This is the descriptive name of the variable, that is displayed in the Statistical Variable Explorer and various other places in the UI.
- `populationType`: This is the type of thing being measured, and its value must be an existing `Class` type. It is mainly used to classify variables into categories that appear in the Statistical Variable Explorer. In this example it is `dcid:Person`. For a full list of supported classes, you will have to send an API request, as described in [Get a list of all existing statistical variables](/api/rest/v2/node.html#liststatvars).
- `measuredProperty`: This is a property of the thing being measured. It must be a `domainIncludes` property of the `populationType` you have specified. In this example, it is the `percent` of persons being measured. You can see the set of `domainIncludes` properties for a given `populationType`, using either of the following methods:
  - Go to <code>https://datacommons.org/browser/<var>POPULATION_TYPE</var></code>, e.g. <https://datacommons.org/browser/Person>{: target="_blank"} and scroll to the `domainIncludes` section of the page. For example: 

    ![domain incudes](/assets/images/custom_dc/customdc_screenshot9.png){: width="800"}

  - Use the [Node API](/api/rest/v2/node.html#wildcard), filtering on `domainIncludes` incoming arcs: <code>https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>POPULATION_TYPE</var>&property=%3C-domainIncludes</code>, e.g. <https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Person&property=%3C-domainIncludes>{: target="_blank"}.

Note that all non-quoted field values must be prefixed with `dcid:` or `dcs:`, which are interchangeable. You may wish to add an optional namespace, separated by a slash (/); for example, `who/Adult_curr_cig_smokers`.

The following fields are optional:
- `statType`: By default this is `dcid:measuredValue`, which is simply a raw value of an observation. If your variable is a calculated value, such as an average, a minimum or maximum, you can use `minValue`, `maxValue`, `meanValue`, `medianValue`, `sumvalue`, `varianceValue`, `marginOfError`, `stdErr`. In this case, your data set should only include the observations that correspond to those calculated values. 
- `measurementQualifier`: This is similar to the `observationPeriod` field for CSV observations (see below) but applies to all observations of the variable. It can be any string representing additional properties of the variable, e.g. `Weekly`, `Monthly`, `Annual`. For instance, if the `measuredProperty` is income, you can use `Annual` or `Monthly` to distinguish income over different periods. If the time interval affects the meaning of variable and and values change significantly by the time period, you should use this field keep them separate.
- `measurementDenominator`: For percentages or ratios, this refers to another statistical variable. For example, for per-capita, the measurementDenominator is `Count_Person`.

Additionally, you can specify any number of property-value pairs representing the constraints on the type identified by `populationType`. In our example, there is one constraint property, `gender`, which is a property of `Person`. The constraint property values are typically enumerations; such as `genderType`, which is a `rangeIncludes` property of `gender`. These will become additional sub-categories of the population type and displayed as such in the Statistical Variable Explorer. Using our example:

![Stat Var Explorer](/assets/images/custom_dc/customdc_screenshot10.png){: width="600"}

### Prepare the CSV observation files

CSV files using explicit schema contain the following columns using the following headings:

```csv
entity, variable, date, value [, unit] [, scalingFactor] [, measurementMethod] [, observationPeriod]
```
The columns can be in any order, and you can specify custom names for the headings and use the `columnMappings` field in the JSON file to map them accordingly (see below for details).

These columns are required:
- `entity`: The DCID of an existing or custom entity in the Data Commons knowledge graph, typically a place. 
- `variable`: The DCID of the node you have defined in the MCF. 
- `date`: The date of the observation and should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_. 
- `value`: The value of the observation and must be numeric. The variable values must be numeric. Zeros and null values are accepted: zeros will be recorded and null values ignored. 

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

In this case, the columns need to be mapped to the expected columns listed above; see below for details.

### Write the JSON config file

You must define a `config.json` in the top-level directory where your CSV files are located. With the explicit schema method, you need to provide these specifications:
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

The following fields are specific to the variable-per-row format:
- `input_files`:
  - `format` must be `variablePerRow` (the default is `variablePerColumn` if not specified)
  - `columnMappings` are required if you have used custom column heading names. The format is <var>DEFAULT_NAME</var> : <var>CUSTOM_NAME</var>.
- `groupStatVarsByProperty` is optional, and allows you to group your variables together according to population type. They will be displayed together in the Statistical Variable Explorer.

The other fields are explained in the [Data config file specification reference](#json-ref)

## Data config file specification reference {#json-ref}

Here is the general spec for the `config.json` file:

<pre>
{  
  "inputFiles": {  
    "<var>FILE_NAME1</var>": {  
      "entityType": "<var>ENTITY_TYPE</var>",  
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
    "<var>FILE_NAME2</var>": {
      ...
    },  
   ...  
  "includeInputSubdirs": true | false,

   "entities": {
    "<var>ENTITY_TYPE_DCID</var>: {
      "name": "<var>ENTITY_TYPE_NAME</var>",
      "description: "<var>ENTITY_TYPE_DESCRIPTION</var>"
    }
    ...
  },

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

{:.no_toc}
### Input files

The top-level `inputFiles` field should encode a map from the CSV input file name to parameters specific to that file. Keys can be individual file names or wildcard patterns if the same configuration applies to multiple files.

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

> Note: Although you don't need to specify the names of MCF files in the `inputFiles` block, if you want to store them in subdirectories, you still need to set `"includeInputSubdirs": true` here.

{:.no_toc}
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

: Optional: Additional information about each observation contained in the CSV file. Whatever setting you specify will apply to all observations in the file. (If you need different properties among observations, put them in different CSV files.)

Currently, the following properties are supported:
- [`unit`](/glossary.html#unit): The unit of measurement used in the observations. This is a string representing a currency, area, weight, volume, etc. For example, `SquareFoot`, `USD`, `Barrel`, etc.
- [`measurementPeriod`](/glossary.html#observation-period): The period of time in which the observations were recorded. This must be in ISO duration format, namely `P[0-9][Y|M|D|h|m|s]`. For example, `P1Y` is 1 year, `P3M` is 3 months, `P3h` is 3 hours.
- [`measurementMethod`](/glossary.html#measurement-method): The method used to gather the observations. This can be a random string or an existing DCID of [`MeasurementMethodEnum`](https://datacommons.org/browser/MeasurementMethodEnum){: target="_blank"} type; for example, `EDA_Estimate` or `WorldBankEstimate`.
- [`scalingFactor`](/glossary.html#scaling-factor): An integer representing the denominator used in measurements involving ratios or percentages. For example, for percentages, the denominator would be `100`. 

Note that you cannot mix different property values in a single CSV file. If you have observations using different properties, you must put them in separate CSV files.

format

: Only needed to specify `variablePerRow` for explicit schemas. The assumed default is `variablePerColumn`.

columnMappings (explicit schema only)

: Optional: If headings in the CSV file does not use the default names, the equivalent names for each column.

{:.no_toc}
### Variables (implicit schema only)

The `variables` section is optional. You can use it to override names and associate additional properties with the statistical variables in the files, using the parameters described below. All parameters are optional. If you don't provide this section, the importer will automatically derive the variable names from the CSV file.

{:.no_toc}
#### Variable parameters {#varparams}

name

: The display name of the variable, which will show up throughout the UI. If not specified, the column name is used as the display name.  
The name should be concise and precise; that is, the shortest possible name that allow humans to uniquely identify a given variable. The name is used to generate NL embeddings.

description

: A long-form description of the variable.

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

{:.no_toc}
### groupStatVarsByProperty (explicit schema only)

Optional: Causes the Statistical Variable Explorer to create a top-level category called "Custom Variables", and groups together variables with the same population types and measured properties. For example:

![group_screenshot](/assets/images/custom_dc/customdc_screenshot10.png){: width="400"}

If you would like your custom variables to be displayed together, rather than spread among existing categories, this option is recommended.

{:.no_toc}
### Sources

The `sources` section encodes the sources and provenances associated with the input dataset. Each named source is a mapping of provenances to URLs.

{:.no_toc}
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


{:.no_toc}
#### Step 1: Start the data management container

In one terminal window, from the root directory, run the following command to start the data management container:

<pre>
docker run \
--env-file $PWD/custom_dc/env.list \
-v <var>INPUT_DIRECTORY</var>:<var>INPUT_DIRECTORY</var> \
-v <var>OUTPUT_DIRECTORY</var>:<var>OUTPUT_DIRECTORY</var> \
gcr.io/datcom-ci/datacommons-data:stable


{:.no_toc}
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


{:.no_toc}
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

