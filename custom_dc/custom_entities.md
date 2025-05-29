---
layout: default
title:  Define custom entities
nav_order: 4
parent: Build your own Data Commons
---

{: .no_toc}
# Define custom (non-place) entities

This page shows you how to define <!--or extend--> custom non-place entities, which may be part of the process to add your data to your local instance. It assumes you are already familiar with the content in [Key concepts](/data_model.html) and [Prepare and load your own data](custom_data.md). It is especially important to understand the relationship between "nodes" and "properties".

Before creating new entities, please see [Determine if you need to create new entities](custom_data.md#entities) to determine if you can reuse existing entities and/or entity types from base Data Commons (datacommons.org). 

> **Note**: It is not necessary to create new entities for your Data Commons instance if your data is aggregated by a place type, or your data includes entities that already exist in the base. 

* TOC
{:toc}

## Overview

Like variables, you can define entities using "implicit" or "explicit" schema:

- With implicit schema, you define _entities_ in CSV files using the schema described below, and define any new _entity types_ (if needed) in the `config.json` file. If you don't need any new entity types, this approach is strongly recommended as it is much simpler to set up.
- With explicit schema, you define entities and entity types in MCF. If you need new entity types, you most likely want to define these in MCF, which gives you the ability to define more fields and to link the type to other existing types. 

In fact, a reasonable approach is to define any entity types (if needed) in MCF, and then the entities (the instances of the types) in CSV. This is the setup that is described in this page.

The [directory structure](custom_data.md#dir) is the same as for variables.

In the following sections, we'll describe setting up the custom entities, as well as how to use them with custom statistical variables.

## Step 1: Define custom entity types (if needed) using explicit schema

Defining a custom entity type in MCF gives you more control of the fields you want to include as properties of the entity type than in `config.json` (which only allows for `name` and `description`). Therefore, we recommend defining new entity types in an MCF file.

You can have a single MCF file or as many as you like. 

For entity types (and entities), an MCF block definition must include the following fields:

- `Node`: This is the DCID of the entity or entity type you are defining.
- `name`: This is the readable name that will be displayed in various parts ot the UI.
- `typeOf`: For an entity type, this must be `Class`.

You can additionally define any number of key:value pairs.

For example, let's say a state government wanted to track the finances of its agencies. There is no "agency" type node in the Data Commons graph, so they could create one like this:

```
Node: dcid:Agency
name: "Government agency"
typeOf: schema:Class
subClassOf: dcs:Government
description: "Agency of a government, such as legal, legislative, insurance, taxes, etc."
```

Note especially the `subClassOf` field, which inserts it into a class hierarchy with the direct parent of `Government`. You could add other properties, such as schema.org meta properties, and so on.

The next step is to define entities of type `Agency` in a CSV file, as described below. 

### Note about enumerations

Data Commons relies fairly heavily on [enumerations](https://datacommons.org/browser/Enumeration){: target="_blank"} to define subclasses (there are hundreds of them in the graph) of other entity types. For example, in the U.S., `Agency` would likely actually be defined as an enum with members `StateAgency`, `FederalAgency`, `MunicipalAgency`, and so on. If you are creating one or more new entity types, you may find it convenient to use enums to break down classes into multiple sub-types.

## Step 2: Define custom entities using implicit schema

In this section, we will walk you through concrete examples of how you can define new entities and variables in CSV files, and set up the `config.json` file.

CSV files can only contain one entity type, so if you are defining entities of more than one type (e.g. schools and hospitals), use separate a separate file for each. If you're adding observations as well, put them in separate files from the entity definitions. 

Each entity CSV file can contain as many columns as you need to define various properties of the entity. The columns can be in any order, with any heading. 

You can choose to specify a column that defines DCIDs for the entities, or you can just have the importer generate them for you. In the following examples, we'll assume that you will define the DCIDs yourself. 

For example, let's say you wanted to track the performance of individual hospitals in your state rather than at the aggregated state level. Base Data Commons already has an entity type [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"}, but you'll notice that there are no actual hospitals in the knowledge graph. The first step would be to add definitions for hospital entities. Here is an example of real-world data from U.S. Department of Health and Human Services for the state of Alaska. The CCN is a certification number that uniquely identifies U.S. hospitals, that we'll use as the DCIDs:

```csv
ccn,name,address,city_name,City,zipCode,hospitalSubtype
22001,St Elias Specialty Hospital,4800 Cordova Street,Anchorage,geoId/02020,99503,Long Term
20001,Providence Alaska Medical Center,3200 Providence Drive,Anchorage,geoId/02020,Short Term
20008,Bartlett Regional Hospital,3260 Hospital Dr,Juneau,geoId/02110,99801,Short Term
21311,Ketchikan Medical Center,3100 Tongass Avenue,Ketchikan,geoId/02150,99901,Critical Access Hospitals
20017,Alaska Regional Hospital,2801 Debarr Road,Anchorage,geoId/02020,99508,Short Term
21301,Providence Valdez Medical Center,Po Box 550,Valdez,geoId/02261,99686,Critical Access Hospitals
21306,Providence KodigeoId/02 Island Medical Ctr,1915 East Rezanof Drive,Kodiak,geoId/02150,99615,Critical Access Hospitals
21304,Petersburg Medical Center,Po Box 589,Petersburg,geoId/02280,99833,Critical Access Hospitals
```

Here are a few things to note:
- The order of columns does not matter. Even the column defining DCIDs does not need to be first; you will specify the column to use for DCIDs in `config.json`.
- If you are also defining a new entity type (say, for `Hospital`), you will define it in `config.json`.
- In this example, there is a `City` column, that uses the existing [`City`](https://datacommons.org/browser/City){: target="_blank"} DCID; in `config.json` we'll declare that column as an existing entity, so that our new hospital entities will be linked to the `City` entity type in the knowledge graph. By contrast, since `zipCode` is not a DCID, it won't be used to link to any existing entities. 

> **Important:** Whenever you want to link properties of entities you are defining to existing entity types, the column headings _must_ use the DCIDs of the entity type(s), and the cells must specify the DCIDs of the relevant entities. If you don't know the DCID, see [Search for an existing entity type](custom_data.md#search). If you don't want a property to be linked to an existing entity type, name the heading something else.

{: #ex12}
### Add statistical variables and observations for new entities

If you are providing observations for custom entities, the observations should be in a separate file. You'll need a different observations CSV file for each entity type for which you are providing observations.

The structure of the CSV file is exactly the same as for place entities, namely:

_ENTITY, OBSERVATION_DATE, STATISTICAL_VARIABLE1, STATISTICAL_VARIABLE2, …_

The only difference from a place-based CSV is that the first column, the entity, _must_ have the heading `dcid`, and must contain the DCIDs of the entities you have defined elsewhere. Here's an example, using our hospital entities:

```csv
dcid,week,total_count_staffed_beds,count_staffed_adult_beds,count_staffed_inpatient_icu_beds,count_staffed_adult_inpatient_icu_beds,count_staffed_inpatient_icu_beds_occupied,count_staffed_adult_icu_beds_occupied
22001,2023-01-27,79,79,12,12,-999999,-999999
20001,2023-01-27,1262,1048,264,146,264,146
20017,2023-01-27,0,0,-999999,-999999,0,0
21301,2023-01-27,836,780,101,62,66,62
21306,2023-01-27,0,0,9,9,8,8
21304,2023-01-27,6,6,0,0,0,0
```
The `dcid` column consists of the CCN numbers we previously used as the DCIDs for each hospital entity.

## Step 3: Write the config.json file

The next step is to create the `config.json` file to configure your new entities. Note that this is the same `config.json` file you use for variables. 

Here's an example of how a `config.json` file could look for our hospital data, where the `Hospital` entity type already exists. In this case, you only provide the entity type name, since other properties of the type are already defined in the base knowledge graph.

```json
{
  "inputFiles": {
    "hospital_entities.csv": {
      "importType": "entities",
      "rowEntityType": "Hospital",
      "idColumn": "ccn",
      "entityColumns": [
        "City"
      ],
      "provenance": "Alaska Weekly Hospital Capacity"
    },
  },
  "entities": {
    "Hospital": {
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
  - `idColumn`: This is optional, and tells the importer to use the values in the specified column as DCIDs. In this case, we specify `ccn`, which indicates that the values in the `ccn` column should be used as the DCIDs for the entities. If you don't specify this field, Data Commons will just create DCIDs automatically. Although it's optional, we strongly recommend that you use this to create your own DCIDs, or it will be difficult to find them later.
  - `entityColumns`: This is also optional: if you want properties of your new entities to be linked to an existing entity type (or types), you can specify the column(s) containing matching existing entities. For example, if you wanted to be able to aggregate your hospital data at the city level, you could specify [`City`](https://datacommons.org/browser/City){: target="_blank"} as an entity column. Note that the heading of the column and its reference here must use the DCID of the entity. If you additionally wanted to aggregate at the zip code level, you would need to specify [`CensusZipCodeTabulationArea`](http://localhost:8080/browser/CensusZipCodeTabulationArea){: target="_blank"}, the existing DCID for "zip code", as the column heading here and in the CSV file.
- `entities`: You use this section to identify an existing entity type(s) or define an entirely new one. To link to an existing entity type, use its DCID as the entry ID. In our example this is `Hospital`. The section is empty because we don't need to add any fields to the existing `Hospital` entity type. If you were adding a new entity type in the JSON file, you would specify it here, along with a `name` and `description` field. If you've added new entity types in MCF, you don't need to specify anything here; the importer will take care of it automatically.
  
The other fields are explained in the [Data config file specification reference](config.md).

{: #ex13}
### Put it all together: statistical variables with new entities

Here's an example of the previous hospital data, covering both the entities and the statistical variables (we've left out the remaining 7 variables for brevity):

```json
{
  "inputFiles": {
    "hospital_entities.csv": {
      "importType": "entities",
      "rowEntityType": "Hospital",
      "idColumn": "ccn",
      "entityColumns": ["City"],
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
    "total_count_staffed_beds": {
      "name": "All beds",
      "description": "Weekly sum of all staffed beds per hospital",
      "searchDescriptions": [
        "Total countber of beds in Alaska hospitals each week",
        "Total countber of staffed beds in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals",
      "properties": {
        "populationType": "Bed"
      }
    },
    "count_staffed_adult_beds": {
      "name": "Beds for adults",
      "description": "Weekly sum of all staffed beds reserved for adults per hospital",
      "searchDescriptions": [
        "countber of beds for adults in Alaska hospitals each week",
        "countber of staffed beds for adults in Alaska hospitals each week"
      ],
      "group": "Alaska Hospitals",
      "properties": {
        "populationType": "Bed"
      }
    },
    ...
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
Note the presence of the `populationType` property: the thing we are actually measuring in these variables is beds. So we use the existing entity type, with the DCID of [`Bed`](https://datacommons.org/browser/Bed){: target="_blank"}. 

<!-- TODO: Consider adding a section for "extending" existing entities or entity types -->

## Load your entities data

To load and serve your data locally, see the procedures in [Load local custom data](custom_data.md#loadlocal).

To load data in Google Cloud, see [Load data in Google Cloud](/custom_dc/deploy_cloud.html).

### Verify your entities data

If the servers have started up without errors, check to ensure that your data is showing up as expected.

Custom entities without observational data are only displayed in the knowledge graph browser. To view your entities in a local server, enter the following in the browser address bar:

<pre>
https://localhost:8080/browser/<var>ENTITY_DCID</var>
</pre>

(If you're using a Cloud Run service, replace `localhost:8080` with the app name.)

The _ENTITY_DCID_ is any DCID you have created previously. Using our previous hospitals example, we could enter `https://localhost:8080/browser/A20017` and would see this:

![](/assets/images/custom_dc/customdc_screenshot12.png){: width="800"}

For an entity type, you will see all the entities you've created as instances of that type listed in the **In Arcs** section, with clickable links. For example:

![](/assets/images/custom_dc/customdc_screenshot13.png){: width="800"}

If you've associated statistical variables with an entity, you will see them at the bottom of the page, with timeline graphs. For example:

![](/assets/images/custom_dc/customdc_screenshot14.png){: width="600"}

See [Verify your data](custom_data.md#verify) for more details on checking variables and observational data.
