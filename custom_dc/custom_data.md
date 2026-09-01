---
layout: default
title: Prepare and load your own data
nav_order: 3
parent: Build your own Data Commons
include_scripts: 
  - /assets/js/customdc-doc-tabs.js
  - /assets/js/syntax_highlighting.js
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

* If you need to define your own statistical variables (metrics), you need to provide [MCF (Meta Content Framework)](https://en.wikipedia.org/wiki/Meta_Content_Framework){: target="_blank"} files.
* All observations data must be in CSV format, using the schema described later.
* You must also provide a JSON configuration file, named `config.json`, that specifies how to map and resolve the CSV contents to the Data Commons schema knowledge graph. The contents of the JSON file are described below.

If you need to define new entities, please see [Define custom entities](custom_entities.md) for details.

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

The top-level directory (e.g. `my_data`) can live anywhere in the file system; you will specify the full path to it when you [configure your input directory](#env). When you set up your files in Google Cloud Storage using the Terraform script, it will automatically create a top-level directory in your bucket called `input`.

The following sections walk you through the process of setting up your data.

## Prerequisite steps

The following sections describe the high-level conceptual work you need to do before starting to write your data and config files.

{: entities}
### Step 0.1: Determine whether you need new entities or entity types

Data Commons is optimized to support aggregations of data at geographical levels, such as city, state, country, and so on. If your data is aggregated by place, these are supported as entities out of the box. If, however, you want to aggregate data for entities that are _not_ places, then you may need to define new entities, and possibly even entity types.

In addition, even if you aggregate by geographical area, you may want to measure things (known as a "population type" in the graph) that are not already in the graph. In that case, you might want to to define a new entity type, so that you can join with other data sets that measure the same thing. For example, let's say you have a metric that counts the number of beds in hospitals. The existence of the `Bed` entity type allows you to join your data with other sources with a similar metric.

#### Entities and entity types

Schema.org and the base Data Commons knowledge graph define entity types for just about everything in the world. An _entity type_ is a high-level concept, and is derived directly from a [`Class`](https://datacommons.org/browser/Class){: target="_blank"} type. Non-place entities are of two types:
* The thing you are measuring, known as the `populationType` in Data Commons. Often this is a `Person`, which is a commonly used population in Data Commons. But it could be something else entirely, such as hospital beds, consumer commodities, Olympic medals, oceans, etc..
* The level at which you want to aggregate the data. Most commonly in Data Commons this is a place type such as `City`, `Country`, `AdministrativeArea1`, etc. Examples of other entity types are `Hospital`, `PublicSchool`, `Company`, `BusStation`, `Campground`, `Library` etc.
It is rare that you would need to create a new entity type, unless you are working in a highly specialized domain.

An _entity_ is an instance of an entity type. For example, for `PublicSchool`, base Data Commons has many U.S. schools in its knowledge graph, such as [`nces/010162001665`](https://datacommons.org/browser/nces/010162001665){: target="_blank"} (Adams Elementary School) or [`nces/010039000201`](https://datacommons.org/browser/nces/010039000201){: target="_blank"} (Wylam Elementary School). Base Data Commons contains thousands of places and other entities, but it's possible that it does not have specific entities that you need. For example, it has about 100 instances of `Company`, but you may want data for other companies besides those. As another example, let's say your organization wants to collect (possibly private) data about different divisions or departments of your org; in this case you would need to define entities for them.

> **Note:** You should always reuse existing entity types and entities from base Data Commons rather than re-defining them. This way, you get all the properties already defined for those entities and all their linked nodes, and can more easily join with base data if needed.

{: #search}
#### Search for an existing entity / entity type

It is currently not possible to get a full list of entity types or entities in the Data Commons UI. To do a complete search for an entity type or entity, you need to use the REST or Python APIs.

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

Data Commons already has thousands of statistical variables in its knowledge graph; you may be able to simply reuse or extend existing ones. Before creating a new variable, take a look at the [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"} to check if you can use an existing variable to represent the data you are importing. This is important if you want to correctly link your data to data in base Data Commons. In addition, if you ever plan to contribute your data to datacommons.org, it's very important to reuse variables as much as possible, to avoid creating unnecessary duplication that can lead to misleading query results.

If you do need to define new variables, they must follow a certain model. The variable consists of a measure (e.g. "median age") on a set of things of a certain type (e.g. "persons") that satisfy some set of constraints (e.g. "gender is female"). To explain what this means, consider the following example. Let's say your dataset contains the number of schools in U.S. cities, broken down by level (elementary, middle, secondary) and type (private, public), reported for each year (numbers are not real, but are just made up for the sake of example):

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
* `Count_School_Public_Elementary`
* `Count_School_Public_Middle`
* `Count_School_Public_Secondary`
* `Count_School_Private_Elementary`
* `Count_School_Private_Middle`
* `Count_School_Private_Secondary`

If you wanted totals or subtotals of combinations, you would need to create additional variables for these as well.

If you plan to contribute your data to base Data Commons, you'll also need to ensure that they conform to [naming conventions](#naming-conventions).

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

In this section, we will walk you through a concrete example of how to go about setting up your MCF, CSV, and JSON files.

{: #mcf}
### Step 1: Define statistical variables in MCF

If you are only reusing existing variables, you can skip this step entirely.

Nodes in the Data Commons knowledge graph are defined in Metadata Content Format (MCF) files. If you need to define new statistical variables, you must define them as new _nodes_ using MCF. When you define any variable in MCF, you explicitly assign it a DCID.

> **Note:** You cannot "override" a variable definition by changing the value of existing fields. If you need to override the values of existing fields, you should create a new variable, with a new DCID.

You can define your statistical variables in a single MCF file, or split them into as many separate MCF files as you like. MCF files must have a `.mcf` suffix. The importer will automatically find them when you start the Docker data container.

Let's look at an example from a WHO dataset that reports the [prevalence of smoking among adolescents](https://platform.who.int/data/maternal-newborn-child-adolescent-ageing/indicator-explorer-new/MCA/prevalence-of-current-cigarette-smoking-among-adolescents){: target="_blank"} (adolescents are age 13 - 17).

| Indicator | Year | Country code | Country | Sex | Value |
|-----------|------|--------------|---------|-----|-------|
| Prevalence of current cigarette smoking among adolescents | 2018 | ARG | Argentina | Male | 15.5 |
| Prevalence of current cigarette smoking among adolescents | 2018 | ARG | Argentina | Female | 20 |
| Prevalence of current cigarette smoking among adolescents | 2018 | ARG | Argentina | Both sexes | 18 |
| Prevalence of current cigarette smoking among adolescents | 2022 | ARM | Armenia | Male | 17 |
| Prevalence of current cigarette smoking among adolescents | 2022 | ARM | Armenia | Female | 0 |
| Prevalence of current cigarette smoking among adolescents | 2024 | AUT | Austria | Male | 17.2 |
| Prevalence of current cigarette smoking among adolescents | 2024 | AUT | Austria | Female | 21.3 |
| Prevalence of current cigarette smoking among adolescents | 2024 | AUT | Austria | Both sexes | 19.5 |

The first thing to notice is that there is a breakdown by sex. Therefore, we'll need 3 different variables to represent that dimension: 1 variable for males, 1 variable for females, and 1 variable for both.

The second thing is figure out if there are existing entities or properties we can use to represent cigarette smoking, adolescents, and sex. It turns out that there are!

* Adolescence is represented by [`Adolescents`](https://datacommons.org/browser/Adolescents){: target="_blank"}, which is a member of the [`AgeGroupClassificationEnum`](https://datacommons.org/browser/AgeGroupClassificationEnum){: target="_blank"}.
* Sex is represented by an existing property, [gender](https://datacommons.org/browser/gender){: target="_blank"}, which is of type [`GenderType`](https://datacommons.org/browser/GenderType){: target="_blank"}, an enumeration. Its members [Female](https://datacommons.org/browser/Female){: target="_blank"} and [Male](https://datacommons.org/browser/Male){: target="_blank"} already exist as well.
* [Smoking](https://datacommons.org/browser/Smoking){: target="_blank"}, which is a member of the enumeration [HealthBehaviorEnum](https://datacommons.org/browser/HealthBehaviorEnum){: target="_blank"}.

The MCF would therefore look like this:

```
Node: dcid:who/Ratio_Smokers_Adolescents
typeOf: schema:StatisticalVariable
name: "Prevalence of current cigarette smoking among adolescents"
description: "Percentage of all adolescents who are current cigarette smokers"
populationType: dcid:Adolescents
measuredProperty: dcid:Smoking
statType: dcid:Ratio
measurementDenominator: dcid:Count_Person_13To17Years

Node: dcid:who/Ratio_Smokers_Adolescents_Female
typeOf: schema:StatisticalVariable
name: "Prevalence of current cigarette smoking among adolescents (female)"
description: "Percentage of adolescents who are current cigarette smokers among all female adolescents"
populationType: schema:Adolescents
measuredProperty: dcid:Smoking
statType: dcs:Ratio
constraintProperties: dcid:gender
gender: dcid:Female
measurementDenominator: dcid:Count_Person_13To17Years_Female

Node: dcid:who/Ratio_Smokers_Adolescents_Male
typeOf: schema:StatisticalVariable
name: "Prevalence of current cigarette smoking among adolescents (male)"
description: "Percentage of adolescents who are current cigarette smokers among all male adolescents"
populationType: schema:Adolescents
measuredProperty: dcid:Smoking
statType: dcs:Ratio
constraintProperties: dcid:gender
gender: dcid:Male
measurementDenominator: dcid:Count_Person_13To17Years_Male
```

The order of nodes and fields within nodes does not matter.

The following fields are always required:

* `Node`: This is the DCID of the entity you are defining. DCIDs can be a maximum of 256 characters long. It must be preceded by the prefix `dcid:`. We recommend that you add an optional prefix, separated by a slash (/), for example, `who/`, to differentiate your custom variables from base DC variables. The prefix acts as a namespace, and should represent your organization, dataset, project, or whatever makes sense for you.  
   > Note: If you plan to contribute your data to base Data Commons, DCIDs should follow the [DCID naming conventions](#naming). Otherwise, you can name them however you want.
* `typeOf`: In the case of statistical variable, this is always `schema:StatisticalVariable`.
* `name`: This is the descriptive name of the variable, that is displayed in the Statistical Variable Explorer and various other places in the UI.
* `populationType`: This is the type of the thing being measured, and its value must be an existing `Class` or `Enumeration` type. In this example it is `schema:Person`. To get a full list of existing entity types, see the section on [searching](#search) above. If the thing you are measuring does not exist in the knowledge graph, you will need to create a new [entity type](custom_entities.md#entity-type) for it.
* `measuredProperty`: This is a property of the thing being measured. It must be defined as a `schema:Property` of the `populationType` you have specified. In this example, it is the prevalence of smoking. The node [`Smoking`](https://datacommons.org/browser/Smoking){: target="_blank"} is a member of the [`HealthBehaviorEnum`](https://datacommons.org/browser/HealthBehaviorEnum){: target="_blank"}, which is a property of `Person`. To view the list of properties for a given `populationType`, use either of the following methods:
  * Go to <code>https://datacommons.org/browser/<var>POPULATION_TYPE</var></code>, e.g. <https://datacommons.org/browser/Person>{: target="_blank"} and scroll to the **domainIncludes** section of the page. For example:

    ![domain incudes](/assets/images/custom_dc/customdc_screenshot9.png){: width="800"}

  * Use the [Node API](/api/rest/v2/node.html#wildcard), filtering on `domainIncludes` incoming arcs: <code>https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>POPULATION_TYPE</var>&property=%3C-domainIncludes</code>, e.g. <https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=Person&property=%3C-domainIncludes>{: target="_blank"}.
  If the `measuredProperty` is essentially the same thing as the `populationType` omit it. For example, `Count_Person` has no property being measured; it is just a count of the population.
* `statType`: This is the measurement represented by this variable. It could be a count, an average, a rate, a ratio, etc. For historical reasons, stat type properties are dispersed around the graph: you can see some at  <https://datacommons.org/browser/StatisticalVariable>{: target="_blank"} and its older, deprecated counterpart <https://datacommons.org/browser/StatisticalPopulation>{: target="_blank"}, under the **domainIncludes** section of the page. Some stat types are part of various enums, such as [`BinaryOperatorEnum`](https://datacommons.org/browser/BinaryOperatorEnum){: target="_blank"}.

Note that all fields that reference another node in the graph must be prefixed by `dcid:` or `dcs:` or `schema:`. Use the following guidelines to determine which to use:

* If the node exists in [schema.org](https://schema.org/docs/schemas.html){: target="_blank"} (you can look them up in the **Term Finder**), use `schema`.
* If the node exists in the core Data Commons schema, [dcschema.mcf](https://github.com/datacommonsorg/schema/blob/main/core/dcschema.mcf){: target="blank"}, use `dcs`.
* Otherwise, use `dcid` for all others.
All fields that do not reference another node must be in quotation marks.

The following fields are optional:

* `description`: A more detailed textual description of the variable. Although this is optional, it is highly recommended, as the description is used to generate embeddings for natural-language search.
* `measurementQualifier`: This is used to qualify the measurement in a more specific way, to express aspects such as temporal adjustments, aggregation periods, financial specifications, and so on. The value should be a member of an enumeration, such as:
  * Members of the [StatAccumulationPeriodEnum](https://datacommons.org/browser/StatAccumulationPeriodEnum){: target="_blank"} type: `dcid:Weekly`, `dcid:Monthly`, and `dcid:Annual`
  * Members of the [CurrencyUnitStandardizationEnum](https://datacommons.org/browser/CurrencyUnitStandardizationEnum){: target="_blank"} type: `dcid:LocalCurrency`, `dcid:StandardizedCurrency`.
  * Members of the [EconomicMetricEnum](https://datacommons.org/browser/EconomicMetricEnum){: target="_blank"} type: `dcid:Nominal`, `dcid:Gross`, `dcid:RealValue`, etc.
  Note: Don't use this field for additional constraints that should be specifed as `constraintProperties`.
* `measurementDenominator`: For ratios or rates, this refers to another statistical variable DCID. For example, for per-capita, the `measurementDenominator` is `Count_Person`.
* `comparisonPeriod`: For a variable measuring a change over time, such as a price or a growth rate, you can use members of the [ComparisonPeriodEnum)](https://datacommons.org/browser/ComparisonPeriodEnum){: target="_blank"} to specify the time period. Supported values are `dcid:MonthOnChange`, `dcid:QuarterOnChange`, and `dcid:YearOnChange`.

#### Constraint properties

Additionally, you can specify any number of property-value pairs representing the constraints (known as `constraintProperties` in the schema) on the type identified by `populationType`. In our examples above, we use the constraint property `gender` which is an indirect property. Constraint property values are typically enumerations: [`GenderType`](https://datacommons.org/browser/GenderType){: target="_blank"} is an enum that serves as the type of `gender`. 

> **Tip:** If you're not sure whether a property should be a `measuredProperty` or a constraint property, use this rule of thumb: `measuredProperty` is the key attribute that's being measured, while constraint properties are ways of slicing the data into segments, but aren't key attributes. For example, if you were measuring the average age of a population, "age" would be a measured property because it is the main metric. But for a metric that counts the number of smokers in a population, it's the smoking behavior that is the key metric; the age is a secondary dimension and is hence a constraint property.

{: #naming}
#### Variable DCID naming conventions

* Variable DCIDs should be in PascalCase with underscores between properties.
* For a basic variable without `measurementQualifier` or `measurementDenominator` properties, it should look like this:

  _`[measurementQualifier]_statType_[measuredProperty]_populationType[_constraintValue1_constraintValue2]`_

  Example: `GrowthRate_Amount_GrossDomesticProduction_`

* For a variable with a `measurementQualifier` property, add the value to the prefix. Examples:
  * `Annual_Average_RetailPrice_Electricity`
  * `Annual_Average_Wage`
* For a variable with a `measurementDenominator` property, add the suffix `AsAFractionOf_`_`measurementDenominator`_. Examples:
  * `Count_Death_Female_AsAFractionOf_Count_Person_Female`
  * `Difference_Between_Median_Male_And_Female_Wages_AsAFractionOf_Median_Male_Wages`
* Multiple constraint values should be ordered according to the alphabetical precedence of the property name. For example, the property `gender` precedes `race` alphabetically, so constraint value `Male` would come before constraint value `AsianAlone`. For example: `Count_Person_Male_AsianAlone`.

### Step 2 (optional): Define a statistical variable group {#statvar-group}

By default, existing variables are shown in the Statistical Variable Explorer in preset categories. If you would like to more easily discover any variables you reuse/extend or new custom variables, you can create a _statistical variable group_ and assign variables to it. You can even define a hierarchical tree of categories this way.

Here is an example that defines a single group node with the heading "WHO" and assigns all 3 statistical variables to the same group.

```
Node: dcid:who/Ratio_Smokers_Adolescents
...
memberOf: dcid:who/g/WHO

Node: dcid:who/Ratio_Smokers_Adolescents_Female
...
memberOf:dcid:who/g/WHO

Node: dcid:who/Ratio_Smokers_Adolescents_Male
...
memberOf: dcid:who/g/WHO

Node: dcid:who/g/WHO
typeOf: dcid:StatVarGroup
name: "WHO"
specializationOf: dcid:dc/g/Root

```

You can define as many statistical variable group nodes as you like. Each must include the following fields:

* `Node`: This is the DCID of the group you are defining. It must be prefixed by `g/` and may include an additional prefix before the `g`.
* `typeOf`: In the case of statistical variable group, this is always `dcid:StatVarGroup`.
* `name`: This is the name of the heading that will appear in the Statistical Variable Explorer.
* `specializationOf`: For a top-level group, this must be `dcid:dc/g/Root`, which is the root group in the statistical variable hierarchy in the Knowledge Graph.To create a sub-group, specify the DCID of another node you have already defined. For example, if you wanted to create a sub-group of `WHO` called `Smoking`, you would create a "Smoking" node with `specializationOf: dcid:who/g/WHO`. Here's an example:

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
Node: dcid:who/Ratio_Smokers_Adolescents
...
memberOf: dcid:who/g/WHO, dcid:who/g/Smoking

Node: dcid:who/Ratio_Smokers_Adolescents_Female
...
memberOf: dcid:who/g/WHO, dcid:who/g/Smoking

Node: dcid:who/Ratio_Smokers_Adolescents_Male
...
memberOf: dcid:who/g/WHO, dcid:who/g/Smoking
```

Similarly, you can assign an existing variable to a new statistical variable group; it will appear in both its original category and in your new group. When you select one in the Statistical Variable Explorer, the other will automatically be selected too. To do this, you must specify the variable's DCID and type. For example, let's say you wanted to add  [`GenderIncomeInequality_Person_15OrMoreYears_WithIncome`](https://datacommons.org/browser/GenderIncomeInequality_Person_15OrMoreYears_WithIncome){: target="_blank"} (by default in the **Demographics** category) to a new top-level group called `My variables`, you would use the following:

```
Node: dcid:MyVariables
typeOf: dcs:StatVarGroup
name: "My variables"
specializationOf: dcid:dc/g/Root

Node: dcid:GenderIncomeInequality_Person_15OrMoreYears_WithIncome
typeOf: schema:StatisticalVariable
memberOf: dcid:MyVariables
```

{: #exp_csv}
### Step 3: Prepare the CSV observation files

CSV files contain the following columns using the following headings:

`entity, variable, date, value` [`, unit`] [`, scalingFactor`] [`, measurementMethod`] [`, observationPeriod`]

The columns can be in any order, and you can specify custom names for the headings and use the `columnMappings` field in the JSON file to map them accordingly (see below for details).

These columns are required:
* `entity`: The DCID of an existing entity in the Data Commons knowledge graph, typically a place.
* `variable`: The DCID of an existing variable or the node you have defined in the MCF
* `date`: The date of the observation. This should be in the format _YYYY_, _YYYY_-_MM_, or _YYYY_-_MM_-_DD_.
* `value`: See [Observation values](#obs) for valid values of this column.

> **Note:** The type of the entities in a single file should be unique; do not mix multiple entity types in the same CSV file. For example, if you have observations for cities and counties, put all the city data in one CSV file and all the county data in another one.

These columns are optional, and allow you to specify additional per-observation properties:

* [`unit`](/glossary.html#unit): The unit of measurement used in the observations. This is a string representing a currency, area, weight, volume, etc. For example, `SquareFoot`, `USD`, `Barrel`, etc.
* [`observationPeriod`](/glossary.html#observation-period): The period of time in which the observations were recorded. This must be in ISO duration format, namely `P[0-9][Y|M|D|h|m|s]`. For example, `P1Y` is 1 year, `P3M` is 3 months, `P3h` is 3 hours.
* [`measurementMethod`](/glossary.html#measurement-method): The method used to gather the observations. This can be a random string or an existing DCID of [`MeasurementMethodEnum`](https://datacommons.org/browser/MeasurementMethodEnum){: target="_blank"} type; for example, `EDA_Estimate` or `WorldBankEstimate`.
* [`scalingFactor`](/glossary.html#scaling-factor): An integer representing the denominator used in measurements involving ratios or percentages. For example, for percentages, the denominator would be `100`.

Here is our above example in the correct CSV format:

```csv
Indicator,Year,Country,Value
Ratio_Smokers_Adolescents_Female,2022,country/ALB,8
Ratio_Smokers_Adolescents_Male,2022,country/ALB,18
Ratio_Smokers_Adolescents,2016,country/ARE,8.1
Ratio_Smokers_Adolescents_Female,2016,country/ARE,5
Ratio_Smokers_Adolescents_Male,2016,country/ARE,11.3
Ratio_Smokers_Adolescents,2018,country/ARG,18
Ratio_Smokers_Adolescents_Female,2018,country/ARG,20
Ratio_Smokers_Adolescents_Male,2018,country/ARG,15.5
Ratio_Smokers_Adolescents_Female,2022,country/ARM,0
Ratio_Smokers_Adolescents_Male,2022,country/ARM,17
Ratio_Smokers_Adolescents,2017,country/ATG,1.4
Ratio_Smokers_Adolescents_Female,2017,country/ATG,1.2
Ratio_Smokers_Adolescents_Male,2017,country/ATG,1.5
Ratio_Smokers_Adolescents,2024,country/AUT,19.5
Ratio_Smokers_Adolescents_Female,2024,country/AUT,21.3
Ratio_Smokers_Adolescents_Male,2024,country/AUT,17.2
...
```

In this case, the columns need to be mapped to the expected columns listed above; see below for details.

{: #obs}
#### Observation values

Here are the rules for observation values:
- Variable values must be numeric. Do not include any special characters such as `*` or `#`.
- Zeros are accepted and recorded.
- For null or not-a-number values, we recommend that you use blanks. (The strings `NaN`, `NA`, and `N/A` are also accepted.) These values will be ignored and not displayed in any charts or tables.
- Do not use negative numbers or inordinately large numbers to represent NaNs or nulls.

{: #json}
### Step 4: Write the JSON config file

You must define a `config.json` in the top-level directory where your CSV files are located. You need to provide these specifications:
- The input files location and entity type
- The sources and provenances of the data
- Column mappings, if you are using custom names for the column headings

Here is an example of how the config file would look for the CSV file we defined above. More details are below.

```json
{
  "inputFiles": {
    "adolescent_smoking.csv": {
      "provenance": "UN_WHO",
      "format": "variablePerRow",
      "columnMappings": {
        "variable": "Indicator",
        "entity": "Country",
        "date": "Year",
        "value": "Value"
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
* `input_files`:
  * `format` must be `variablePerRow`
  * `columnMappings` are required if you have used custom column heading names. The format is <var>DEFAULT_NAME</var> : <var>CUSTOM_NAME</var>.

The following is optional:
* `groupStatVarsByProperty` allows you to group your variables together according to population type. They will be displayed together in the Statistical Variable Explorer.

Note that you don't specify your MCF files as input files; the Data Commons importer will identify them automatically.

The other fields are explained in the [Data config file specification reference](config.md).

{: #loadlocal}
## Load local custom data

The following procedures show you how to load and serve your custom data locally.

To load data in Google Cloud, see instead [Load data in Google Cloud](/custom_dc/deploy_cloud.html) for procedures.

{: #env}
### Configure environment variables

Edit the `env.list` file you created [previously](/custom_dc/quickstart.html#env-vars) as follows:
* Set the `INPUT_DIR` variable to the full path to the directory where your input files are stored.
* Set the `OUTPUT_DIR` variable to the full path to the directory where you would like the output files to be stored. This can be the same or different from the input directory. When you rerun the Docker data management container, it will create a `datacommons` subdirectory under this directory.

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
