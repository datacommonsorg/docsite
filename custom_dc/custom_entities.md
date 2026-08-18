---
layout: default
title:  Define custom entities
nav_order: 4
parent: Build your own Data Commons
---

{: .no_toc}
# Define custom (non-place) entities

This page shows you how to define (or extend) custom (non-place) entities, which may be part of the process to add your data to your Custom Data Commons instance. It assumes you are already familiar with the content in [Key concepts](/data_model.html) and [Prepare and load your own data](custom_data.md).

Before creating new entities or entity types, please see [Determine if you need to create new entities](custom_data.md#entities) to determine if you can reuse existing entities and/or entity types from base Data Commons (datacommons.org). 

> **Note**: It is not necessary to create new entities for your Data Commons instance if your data is aggregated by a place type, or your data includes entities that already exist in the base. 

* TOC
{:toc}

## Overview

New _entity types_ are defined in an MCF file. It may be the same file in which you define variables, or it can be a separate one.

New _entities_ (instantiations of a type) can be defined in either MCF or CSV files. If you have thousands of new entities of the same type, you will likely find it much easier to manage their definitions in a CSV file. On this page, we will use CSV for examples, and you can translate them into MCF if you like.

The [directory structure](custom_data.md#dir) is the same as for variables.

In the following sections, we'll describe setting up the non-place entities, as well as how to use them with custom statistical variables. Also see the example files provided in [https://github.com/datacommonsorg/website/tree/master/custom_dc/sample/entities](https://github.com/datacommonsorg/website/tree/master/custom_dc/sample/entities){: target="_blank"}.

## Prepare your data

### Step 1: Define new entity types (if needed)

If you need to define custom [entity types](custom_data.md#entities) in MCF (rare), you define them in MCF. You can have a single MCF file or as many as you like. 

Let's look at a concrete example. We are going to look at yearly [hospital utilization data](https://data.chhs.ca.gov/dataset/hospital-annual-utilization-report){: target="_blank"} provided by the [California Department of Health and Human Services Agency](https://data.chhs.ca.gov/dataset/hospital-annual-utilization-report){: target="_blank"}. The data is aggregated per-hospital, so we'll use the existing [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"} class. The dataset we'll use reports on hospital bed capacity. There is an existing [`Bed`](https://datacommons.org/browser/Bed){: target="_blank"} class in Data Commons and schema.org, but we should define something more specific to represent "hospital bed". We could create a new class like this:

```
Node: dcid:chhs/HospitalBed
typeOf: schema:Class
name: "Hospital bed"
subClassOf: dcid:Bed
```

We also need to define a new class to capture the concept of a "patient stay" (or "visit"), as this is an important measure of hospital utilization:

```
Node: dcid:chhs/HospitalStay
typeOf: schema:Class
name: "Inpatient hospital stay"
subClassOf: dcs:PlaceVisitEvent
```

For entity types, an MCF block definition must include the following fields:

* `Node`: This is the DCID of the entity or entity type you are defining. DCIDs can be a maximum of 256 characters long. It is also recommended that you use a prefix to create a namespace for your own entity types. The prefix must be separated from the main entity type name by a slash (`/`), and should represent your organization, dataset, project, or whatever makes sense for you. For example, if your organization or project name is "foo.com", you could use a namespace `foo/`. This way it is easy to distinguish your custom entity types from entity types in the base DC.
* `name`: This is the readable name that will be displayed in various parts of the UI.
* `typeOf`: For an entity type, this must be `Class`.
* `subClassOf`: To link your new entity type to existing types in the knowledge graph, this can be any existing class that can act as a parent. This inserts the entity type into a class hierarchy. You may also define sub-types of types you define, by using this field to indicate the "parent" class.

### Step 1a: Define properties of the entity type (if needed)

The California Department of Health Care Access and Information (HCAI) defines 4 different license categories for hospitals:
* General Acute Care
* Acute Psychiatric
* Psychiatric Health Facility
* Chemical Dependency Recovery Hospital

The most common way of representing such properties, where potential values are mutually exclusive, is by defining an enumeration, whose members are the allowable values. Here's how we would define the license category enum:

```
Node: dcid:chhs/HospitalCategoryEnum
typeOf: schema:Class
name: "Hospital license category"
subClassOf: schema:Enumeration
description: "The HCAI (Department of Health Care Access and Information) license category designation"

Node: dcid:chhs/GeneralAcuteCare
typeOf: dcid:chhs/HospitalCategoryEnum
name: "General Acute Care"

Node: dcid:chhs/AcutePsychiatric
typeOf: dcid:chhs/HospitalCategoryEnum
name: "Acute psychiatric"

Node: dcid:chhs/PsychiatricHealthFacility
typeOf: dcid:chhs/HospitalCategoryEnum
name: "Psychiatric Health Facility"

Node: dcid:chhs/ChemicalDependencyRecoveryHospital
typeOf: dcid:chhs/HospitalCategoryEnum
name: "Chemical Dependency Recovery Hospital"

Node: dcid:chhs/hospitalCategory
typeOf: schema:Property
name: "License category"
domainIncludes: dcid:Hospital
rangeIncludes: dcid:chhs/HospitalCategoryEnum
```

These are the important fields to note:
* For the node representing the enum itself, it must be of type `Class` and must be a subclass of `Enumeration`.
* For the nodes representing the allowed values of the enum, they must be of the type you have defined as the enum.
* For the property, it must be of type `Property` and must specify:
  * `domainIncludes`, which specify the entity type to which the property can be applied. In this case, it is any entity of `Hospital` type.
  * `rangeIncludes`, which specify the allowable types of the property. In this case, it is the hospital type enum.

In our dataset, patients are also broken down into "inpatient" and "outpatient". It turns out that there is an existing enumeration for patient type: `who/PatientTypeEnum`. So we can derive a property from this that we can use for our data.

```
Node: dcid:chhs/patientType
typeOf: schema:Property
name: "Patient type"
domainIncludes: dcid:Patient, dcid:chhs/HospitalBed, dcid:chhs/HospitalStay
rangeIncludes: dcid:who/PatientTypeEnum
```

{: #step2}
### Step 2: Define new entities

Now let's walk through the process of defining the actual entities you need for your data. You can define entities in both MCF files or CSV files, but we will only provide examples of CSV here. (You can easily convert these to MCF if desired.)

Going back to our example of hospitals in California, although Base Data Commons already has a [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"} class, you'll notice that there are no actual hospitals in the knowledge graph. The first step is to add definitions for hospital entities. In the source data, the entities and observations are provided in the same CSV file. But in Data Commons, we need to separate them. Here's how the CSV file might look. The `hospitalId` is a number that uniquely identifies California hospitals, which will use as the DCIDs. Notice the `hospitalCategory` column for the property we defined in the previous step. For brevity's sake, we'll just include the data for a single California county, San Mateo.

```csv
hospitalId,hospitalName,hospitalAddress,City,zip,County,hospitalCategory
chhs/106410817,AHMC Seton Medical Center,1900 Sullivan Avenue,geoId/0617918,94015,geoId/06081,chhs/GeneralAcuteCare
chhs/106410828,AHMC Seton Medical Center Coastside,600 Marine Boulevard,geoId/0649446,94038,geoId/06081,chhs/GeneralAcuteCare
chhs/106414139,Kaiser Foundation Hospital - Redwood City,1100 Veterans Blvd.,geoId/0660102,94063,geoId/06081,chhs/GeneralAcuteCare
chhs/106410806,Kaiser Foundation Hospital - South San Francisco,1200 El Camino Real,geoId/0673262,94080,geoId/06081,chhs/GeneralAcuteCare
chhs/106410852,Mills-Peninsula Medical Center,1501 Trousdale Drive,geoId/0609066,94010,geoId/06081,chhs/GeneralAcuteCare
chhs/106410782,San Mateo Medical Center,222 West 39Th Avenue,geoId/0668252,94403,geoId/06081,chhs/GeneralAcuteCare
chhs/106410891,Sequoia Hospital,170 Alameda De Las Pulgas,geoId/0660102,94062,geoId/06081,chhs/GeneralAcuteCare
```

A given CSV file can only contain one entity type, so if you are defining entities of more than one type (for example, schools and hospitals), use a separate file for each. 

Here are the important points to note in this example:
* Each entity CSV file can contain as many columns as you need to define various properties of the entity. 
* You must have one column that defines DCIDs for the entities. Here we use the `hospitalId`.
* Columns can be in any order, with any heading. Even the column defining the DCIDs does not need to be first; you will specify the column to use for DCIDs in `config.json`.
* We recommended that you use a prefix to create a namespace for your own entities. It must be separated from the main variable name by a slash (`/`). For example, if your organization or project name is foo.com, you could use a namespace `foo/`. This way it is easy to distinguish your custom entities from entities in the base DC.
* For any cells that reference existing entities, if you want to link your entities to them, you must specify them by DCID. In addition, the column heading must use the existing DCID. In the above example, there is a `City` column, that uses the existing [`City`](https://datacommons.org/browser/City){: target="_blank"} DCIDs; in `config.json` we'll declare that column as an existing entity, so that our new hospital entities will be linked to the `City` entity type in the knowledge graph. We'll do the same for `County` but not zip.

> **Important:** Whenever you want to link properties of entities you are defining to existing entities, the cell values must contain DCIDs of the relevant entities. If you don't know the DCID, see [Search for an existing entity](custom_data.md#search).

### Step 3: Write the config.json file

The next step is to create the `config.json` file to configure your new entities. This is the same `config.json` file you use for observations. 

Here's an example of how the file could look for our hospital data.

```json
{
  "inputFiles": {
    "hospital_entities.csv": {
      "importType": "entities",
      "rowEntityType": "Hospital",
      "idColumn": "hospitalId",
      "entityColumns": [
        "City",
        "County"
      ],
      "provenance": "California Annual Hospital Utilization"
    }
  },
  "sources": {
    "California HHS - HCAI": {
      "url": "https://data.chhs.ca.gov/organization/department-of-health-care-access-and-information",
      "provenances": {
        "California Annual Hospital Utilization": "https://data.chhs.ca.gov/dataset/hospital-annual-utilization-report"
      }
    }
  }
}
```
These are the important fields to note:

* `importType`: By default this is `observations`; to tell the importer that you are adding entities in this CSV file, you must specify `entities`.
* `rowEntityType`: This specifies the entity type that the entities are derived from. In this case, we specify an existing entity type, [`Hospital`](https://datacommons.org/browser/Hospital){: target="_blank"}. Note that the entity type must be identified by its DCID.
* `idColumn`: This indicates to the importer to use the values in the specified column as DCIDs. In this case, we specify `hospitalId`, which indicates that the values in the `hospitalId` column should be used as the DCIDs for the entities.
* `entityColumns`: This is optional: if you want properties of your new entities to be linked to existing entities, you can specify the column(s) containing the matching entities. In this case we list the [`City`](https://datacommons.org/browser/City){: target="_blank"} and [`County`](https://datacommons.org/browser/County){: target="_blank"} columns. Note that the heading of this column must be the DCID of the corresponding entity type, and the values must be the DCIDs of each entity referenced. If you would like the hospitals to be linked by zipcode, you would need to provide the DCID for each zip code.
  
The other fields are explained in the [Data config file specification reference](config.md).

### Step 4: Add statistical variables and observations for new entities

If you are providing observations for the non-place entities, the observations must be in a separate file. You'll need a different CSV file for each entity type for which you are providing observations.

Within our dataset are indicators about inpatient utilization: 

* total_beds
* total_discharges
* total_patient_days
* total_patient_average_length_of_stay

Now we can define the variables:

```
Node: dcid:chhs/Count_HospitalBeds
typeOf: schema:StatisticalVariable
name: "Total number of inpatient beds utilized in the calendar year"
populationType: dcid:chhs/HospitalBed
statType: dcs:count
constraintProperties: dcid:chhs/patientType
patientType: dcid:chhs/Inpatient

Node: dcid:chhs/Count_InpatientDischarges
typeOf: schema:StatisticalVariable
name: "Total number of inpatient discharges"
description: "Total number of inpatient discharges over the entire year"
populationType: dcid:chhs/HospitalStay
statType: dcs:count 
constraintProperties: dcid:chhs/patientType
patientType: dcid:chhs/Inpatient

Node: dcid:chhs/Count_Days_Inpatients
typeOf: schema:StatisticalVariable
name: "Total number of days of all inpatients in hospital"
description: "Total number of days for all inpatient stays over the entire year"
populationType: dcid:chhs/HospitalStay
measuredProperty: dcid:duration
statType: dcs:count
constraintProperties: dcid:chhs/patientType
patientType: dcid:chhs/Inpatient

Node: dcid:chhs/Mean_Duration_HospitalStay_Inpatients
typeOf: schema:StatisticalVariable
name: "Average length of stay of all inpatients in hospital"
description: "Mean length of stay, in days, of all inpatient stays over the entire year. Calculated as the total number of patient days divided by the number of patient discharges."
populationType: dcid:chhs/HospitalStay
measuredProperty: dcid:duration
statType: dcs:meanValue
constraintProperties: dcid:chhs/patientType
patientType: dcid:chhs/Inpatient
```

Just like for place entities, you provide observations for these variables in a CSV file. The CSV observations file uses the same variable-per-row format and [column headings](custom_data.md#exp-csv) as places. The only difference from a place-based CSV is that the entity column contains the DCIDs of the entities you have defined in a separate CSV (or MCF) file, instead of places. In our example, the DCIDs are the facility IDs of the hospitals. We also add a unit (days) where it's relevant and the observation period of one year.

```csv
entity,date,variable,value,unit,observationPeriod
chhs/106410782,2024,chhs/Count_HospitalBeds,448,,P1Y
chhs/106410782,2024,chhs/Count_InpatientDischarges,2746,,P1Y
chhs/106410782,2024,chhs/Count_Days_Inpatients,112527,,P1Y
chhs/106410782,2024,chhs/Mean_Duration_HospitalStay_Inpatients,41,Day,P1Y
chhs/106410806,2024,chhs/Count_HospitalBeds,120,,P1Y
chhs/106410806,2024,chhs/Count_InpatientDischarges,6172,,P1Y
chhs/106410806,2024,chhs/Count_Days_Inpatients,26154,Day,P1Y
chhs/106410806,2024,chhs/Mean_Duration_HospitalStay_Inpatients,4.2,Day,P1Y
...
```

### Step 5: Add the observations CSV to config.json

Now let's update the config file to cover both the entities and the statistical variables. Since there can only be a single `config.json` file, CSV files of observations and entities must be specified in the same config.

```jsonc
{
  "inputFiles": {
    "hospital_entities.csv": {
      "importType": "entities",
      "rowEntityType": "Hospital",
      "idColumn": "hospitalId",
      "entityColumns": ["City", "County"],
      "provenance": "California Annual Hospital Utilization"
    },
    "hospital_observations.csv": {
      "importType": "observations",
      "format": "variablePerRow",
      "entityType": "Hospital",
      "provenance": "California Annual Hospital Utilization"
    }
  },
 "sources": {
    "California HHS - HCAI": {
      "url": "https://data.chhs.ca.gov/organization/department-of-health-care-access-and-information",
      "provenances": {
        "California Annual Hospital Utilization": "https://data.chhs.ca.gov/dataset/hospital-annual-utilization-report"
      }
    }
  }
}
``` 


## Load your entities data

To load and serve your data locally, see the procedures in [Load local custom data](custom_data.md#loadlocal).

To load data in Google Cloud, see [Load data in Google Cloud](/custom_dc/deploy_cloud.html).

### Verify your entities data

If the servers have started up without errors, check to ensure that your data is showing up as expected.

Non-place entities without observational data are only displayed in the knowledge graph browser. To view your entities in a local server, enter the following in the browser address bar:

<pre>
https://localhost:8080/browser/<var>ENTITY_TYPE_DCID</var>
</pre>

You should see a list of all the entities in the **In Arcs typeOf** section. For example, using the Alaska hospitals sample in https://github.com/datacommonsorg/website/tree/master/custom_dc/sample/entities, you could enter `https://localhost:8080/browser/Hospital`, and you would see all the hospitals listed:


![](/assets/images/custom_dc/customdc_screenshot12.png){: width="600"}

If you've associated statistical variables with an entity, you will see them at the bottom of the page, with timeline graphs. For example:

![](/assets/images/custom_dc/customdc_screenshot14.png){: width="800"}

See [Verify your data](custom_data.md#verify) for more details on checking variables and observational data.
