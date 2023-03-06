---
layout: default
title: Data Commons Schema-less Guide
parent: Data Imports
published: true
---

# Data Commons Schema-less Guide


## About This Guide

This document is a step-by-step educational and instructional guide for anyone to be able to create a [Data Commons](datacommons.org) schema-less import to contribute to the Data Commons Graph.

This guide accompanies the [Data Commons Schema-Less Import Template](https://docs.google.com/document/d/1GC7DTpxXo_3zreDRt7wFuURBfA1T275p-qx1N-VIdGM/). Sections within the template link into this guide. In the template itself, new terminology will be linked out to a glossary of definitions the first time the terminology appears.

This guide may also be used as a stand-alone document for familiarizing oneself with the Data Commons schema-less import process.

[Schemas](https://github.com/datacommonsorg/schema), [data](https://github.com/datacommonsorg/data), and [import tools](https://github.com/datacommonsorg/import) all live on Data Commons [Github](https://github.com/datacommonsorg), with accompanying technical documentation included in each repository under the respective “docs” folders.


## Goal

To allow any third party contributor to be able to create a schema-less import into Data Commons without prior knowledge of the pipeline or terminology.


## Prerequisites


1. A [GitHub](github.com) account
2. A dataset(s) for import
3. Enough working knowledge of python to be able to write simple python scripts for .csv file manipulation
 <br/><br/>

# <a name="dcdataimports"></a>DC Data Imports

Data Commons is a platform that allows users to access and share structured data in a common format. A data import on Data Commons refers to the process of uploading data to the platform and making it available for use by other users. The data can be imported in various formats such as CSV, JSON, and RDF, etc. \
 \
From there, the data can be used to answer queries like how many people live in a city, what is the average income of a certain city, or how many schools are there in a certain area. However, in order for that to be done, the import needs to be accompanied by a schema design, or at the very least statistical variable categories that represent the semantic information represented by the data. \
 \
After the import process, the data will be transformed and standardized to fit the Data Commons schema, which is based on the [schema.org](schema.org) vocabulary, making it easier for other users to query and integrate with other data.


## <a name="importdesign"></a>Import Design: Statistical Variables

In Data Commons, a statistical variable (SV) represents the subject of interest and is associated with factual statistical observations (SVO), which represent specific pieces of data. An SV can be a demographic characteristic, an economic indicator, or any other type of data that can be quantified and measured.

[SVs on Data Commons](https://www.datacommons.org/tools/statvar) are organized and presented in a way that makes them easy to find and understand. They are grouped under different categories such as demographic, economic, and social variables, and are linked to relevant external sources such as the US Census Bureau, Bureau of Labor Statistics, etc.

SVs are comprised of the following elements:



* <a name="stattype"></a>_[statType](https://datacommons.org/browser/statType)_ refers to a small set of Property nodes
    * default is `measuredValue`; others include `meanValue`, `minValue`, etc.
* _[measuredProperty](https://datacommons.org/browser/measuredProperty)_ refers to a Property node
    * The Property node has _[domainIncludes](https://datacommons.org/browser/domainIncludes)_ of the _[Class](https://datacommons.org/browser/Class)_ referred to in populationType
* _[populationType](https://datacommons.org/browser/populationType)_ refers to a Class node
* zero or more constraintProperties with singleton constraint values
    * These Property nodes have _domainIncludes_ of the Class referred to in populationType
    * The constraint values are Enumerations or Quantity nodes
        * Example: `Female`, `[20 Years]`, `AsianAlone`
* <a name="measurementqualifier"></a>[optional] _[measurementQualifier](https://datacommons.org/browser/measurementQualifier)_ refers to Enumeration nodes
    * e.g., `Nominal` / `Real` for GDP
* [optional] _[measurementDenominator](https://datacommons.org/browser/measurementDenominator)_ refers to another StatVar node
    * For per-capita, `measurementDenominator: dcs:Count_Person`

For a more in-depth look into SVs and an introduction into Statistical Variable Observations (SVOs), see [Representing Statistics in Data Commons](https://github.com/datacommonsorg/data/blob/master/docs/representing_statistics.md).


## <a name="schemalesssvs"></a>Schema-less SVs

For datasets with complex schema or ones that we want to import quickly, we can start with a schema-less import, and iteratively add schema. The “schema-less” part of this framework means that the SV is not yet fully defined. This lets us get the dataset into Data Commons without blocking on schema definition.

Schema-less SVs have the following requirements:



1. The measuredProperty value must match the stat-var DCID.
 * This is important, because this is how we identify it is a schema-less SV. As an example:

    ```
    Node: dcid:Count_MedicalConditionIncident_Tuberculosis
    typeOf: dcs:StatisticalVariable
    measuredProperty: dcs:Count_MedicalConditionIncident_Tuberculosis
    statType: dcs:measuredValue
    ```

2. They should have well-formed, stable DCIDs.
 * As we incrementally add schema, we should not change this DCID.
3. They should have a name.
 * We will not auto-generate names, so a user-provided name is essential for display on SV hierarchy, SV explorer, etc.
 * See more on naming in the [DCID Naming Conventions](#dcidnamingconventions) section.
4. They can have additional constraints that refer to existing schema (as long as they satisfy #1).
5. They should ideally be organized in a hierarchy made of SVGroups (especially if you add a pile of schema-less SVs).
 * The SVGroups should not have a “dc/g/” DCID prefix.
 * SVGroups are organized in a `specializationOf` hierarchy
 * The root of your hierarchy should be linked to a vertical SVGroup from [here](https://github.com/datacommonsorg/schema/blob/main/stat_vars/vertical_stat_var_groups.mcf)
 * Schema-less stat-vars should be linked to an SVGroup via `memberOf` property
 * Example: [/dc/g/Person_Gender](https://datacommons.org/browser/dc/g/Person_Gender)


## <a name="datasettypes"></a>Dataset Types

For each new data import, summarize the incoming dataset and identify the types of data contained within it with the following steps:



1. Identify the source of the data: Determine where the data is coming from and what organization or agency is responsible for collecting and maintaining it. This information can be found in the metadata or documentation that accompanies the dataset.
2. Review the dataset's structure: Look at the number of columns and rows, as well as the variable names and data types. This will give you an idea of the overall structure of the data and the types of variables it contains.
3. Check the data quality: Look for missing data, outliers, or other issues that may impact the accuracy or completeness of the data. If possible, remove or correct any problematic data before importing it.
4. Identify the types of data: Look at the variables and their values to determine what types of data the dataset contains. Some examples of data types include demographic information, economic indicators, and geographic data.


## <a name="contributingnewvariables"></a>Contributing New Variables

When importing new data into DC, there may be some existing variables from previous data imports that represent all or part of your new import. It is important to consider whether existing statistical variables can be reused or if new ones need to be created.

Here is a quick 1-2 step guide to help you determine when to reuse existing variables and when to create new ones:



1. **Check existing variables**: Before creating a new variable, take a look at our [Statistical Variable Explorer](https://www.datacommons.org/tools/statvar) to check if an existing variable can be used to represent the data you are importing. This will save time and effort, and it also helps to maintain consistency in the Data Commons graph.
2. **Check the variable's definitions**: It's important to ensure that the variable's definitions match with the variable's intended use; if not, you may need to create a new variable.


If, as in most cases, you’ll need to create new statistical variables, please do so with the following guidance below.


### <a name="dcidnamingconventions"></a>DCID Naming Conventions

Each new variable receives its own unique identifier, or DCID (Data Commons ID).  DCIDs should be clear and written in CamelCase. 

For schema-less SVs, the DCID is not automatically generated, so you’ll need to use the constraint properties above to define the DCID. If your SV does not have an existing populationType to use, please still add a descriptor word or words to the DCID to differentiate your SV, and add in any constraint properties to the DCID as well.

As an FYI, naming conventions generally follow these rules (click [here](#appendix) for notable exceptions):


1. For a basic SV without [measurementQualifier or measurementDenominator](#measurementqualifier):

    ```
    <statType>_<measuredProp>_<populationType>_<constraintVal1>_<constraintVal2>
    ```

    Example: [GrowthRate_Amount_EconomicActivity_GrossDomesticProduction](https://datacommons.org/browser/GrowthRate_Amount_EconomicActivity_GrossDomesticProduction)

2. If statType is [the default measuredValue](https://datacommons.org/browser/measuredValue), skip it.
    Example: [Count_Person_Male_AsianAlone](https://datacommons.org/browser/Count_Person_Male_AsianAlone)
3. Constraint values are ordered based on the alphabetic ordering of the constraint properties.
    Example: in Count_Person_Male_AsianAlone, Male_AsianAlone because `gender` &lt; `race`
4. For a SV with [measurementQualifier,](#measurementqualifier) add the value to the prefix.

    Example: [Annual_Average_RetailPrice_Electricity](https://datacommons.org/browser/Annual_Average_RetailPrice_Electricity)

5.  For a SV with [measurementDenominator](#measurementdenominator), add a suffix of:

    ```
    _AsAFractionOf_<measurementDenominator>
    ```

    Example: [Count_Death_Female_AsAFractionOf_Count_Person_Female](https://datacommons.org/browser/Count_Death_Female_AsAFractionOf_Count_Person_Female)


### <a name="proposingnewvariablesorgroups"></a>Proposing New Variables or Groups

When proposing new variables or groups on the import template, follow these guidelines for each column:

 
**SV name:** The name that describes your SV. Human-readable.

**Proposed DCID:** The proposed DCID following the naming convention above.

**Value for…** 


*  **statType:** See [here](#stattype).

* **measuredProperty:** Matches the proposed DCID name for an SV in schema-less imports.

* **populationType:** Since populationType is required, please include a value type for this property if the value type already exists ([Thing](https://www.datacommons.org/browser/Thing) is a commonly used populationType and a great first class to explore). See [here](#importdesign) for more info.


* **measurementQualifier, measurementDenominator:** These are very helpful to have if the value type already exists in DC. See [here](#measurementqualifier) for more info.

* **SV group:** The [group](https://datacommons.org/browser/StatVarGroup) to which your SV(s) belongs. If the group already exists, then please reuse. Use the aforementioned [Statistical Explorer](https://datacommons.org/tools/statvar) tool to find existing SV groups, similar to how you found existing SVs. Hint: The subtitles on the [navigation bar of the SV explorer](guideimage.png) are akin to SV groups.


* **Group already exists?:** “Y” if you used an existing group; “N” if you needed to create a new group.

* **Parent group:** The vertical group to which your SV group belongs. Try to reuse any of the [existing groups](https://github.com/datacommonsorg/schema/blob/main/stat_vars/vertical_stat_var_groups.mcf) if applicable.


## <a name="dataprocessing"></a>Data Processing

After the schema-less design has been decided upon above, it’s time for the data import to begin! The data processing and cleaning process involves the follow stages:



1. **Data cleaning**: Once the data is collected, it needs to be cleaned and prepared for import. This includes tasks such as removing duplicate data, correcting errors, and standardizing the format of the data. Most of these high level issues should have already been identified and addressed in the Dataset Type section of the template; now, make sure to follow through and actually clean the data accordingly.

2. **Data transformation**: After cleaning, the data is transformed to fit the DataCommons schema, which is based on the schema.org vocabulary. This includes tasks such as mapping the data to the appropriate entities and properties (see Tips for Data Cleaning and Transformation below). Example scripts have been checked into the [data repository](https://github.com/datacommonsorg/data/tree/master/scripts).

3. **Data loading**: After the data is transformed, it is loaded into the Data Commons GitHub, where it is made available for use by other users. If the data source is new (e.g. there are not yet other datasets from this source in the [scripts](https://github.com/datacommonsorg/data/tree/master/scripts) folder), create a new folder with the Source name.

4. **Data validation**: After the data is loaded, the data quality assurance process is done which includes tasks such as checking for errors, inconsistencies, and missing data. Data commons has a “dc-import” tool to help with this validation.

5. **Data review**: After you validate your new dataset structure, submit your PR for review by the DC team for final approval.


Throughout the process, the data import and cleaning may be aided by scripts and tools that are available in the GitHub repository of Data Commons. These scripts are designed to automate many of the tasks involved in the process, making it more efficient and accurate.

A clear overview of the data cleaning and transformation process can be found [here](https://github.com/datacommonsorg/data/blob/master/docs/life_of_a_dataset.md). 


### <a name="tipsfordatacleaningandtransformation"></a>Tips for Data Cleaning and Transformation

Your data may be cleaned and transformed in the following ways; please identify in the import template in which ways your data was transformed:


* Filtering: Invalid data points, outliers, duplicates
* Data transformations such as mapping data attributes to schema, unit conversions, scaling, data types for different fields, such as string vs int vs float
* Computations: Any derived stats such as area of geoJsons, etc
* Place resolution
* Entity resolution
* Libraries/frameworks used: geo, html, etc
* Dependencies: data, scripts, libraries


### <a name="creatingyournewdatastructure"></a>Creating Your New Data Structure

Once you have identified what transformations need to occur, it’s time to figure out how to convert your raw data into your new data structure. The best way to do this is to take a screenshot of your original .csv file with all its columns and value types; create a representation of the new .csv data structure that maps to the DC model, and identify the transformations that need to happen. Then, it’s time to script it.

In order for the data to be transformed into a format that can map onto the DataCommons schema, you’ll most likely need to write a new conversion script. Example scripts have been checked into the [data repository](https://github.com/datacommonsorg/data/tree/master/scripts). While these existing scripts most likely will not work for your data structure exactly, you can still find similar scripts and view their code.

Please use this [example folder](https://github.com/datacommonsorg/data/tree/master/scripts/fao) to name your files, scripts, and folders accordingly, and to structure your README.md file.

Essentially, you’ll need to create a python script that takes in your original .csv file, transforms the data to fit the DC model, and outputs the new .csv file (ideally in a clearly marked [output](https://github.com/datacommonsorg/data/tree/master/scripts/fao/output) folder).


### <a name="definingtemplatemcfnodes"></a>Defining Template MCF nodes

You may have noticed the TMCF files in the example folder. A template MCF node is essentially a template that can be used to create new MCF nodes that represent specific entities or concepts. Refer [here](https://github.com/datacommonsorg/data/blob/master/docs/life_of_a_dataset.md#template-mcf-with-tabular-data-csv) for background and examples on creating Template MCF (TMCF) nodes from corresponding .csv files.

This template will be used to check your new .csv output against for data validation.


### <a name="datavalidation"></a>Data Validation

Now that you have created your new data structure .csv, it’s time to validate the output. Validate the structure of your .csv output, TMCF, and MCF files using the <code>[dc-import](https://github.com/datacommonsorg/import/blob/master/docs/usage.md)</code> tool in lint mode. 

Include the successful output for this validation in a new folder titled [validation](https://github.com/datacommonsorg/data/tree/master/scripts/fao/validation). This should be one .json file and one results.html file.

To validate using the dc-import tool, you’ll need the following artifacts (files) below.


## <a name="preparingartifacts"></a>Preparing artifacts

Once you have successfully created a script to transform your data structure, it’s time to prepare your artifacts (files) for review by the Data Commons github.

[Here](https://github.com/datacommonsorg/data/tree/master/scripts/fao) is an example of the content you’ll need to submit. The following checklist should help you organize your files for submission:



1. <a name="svmcfnodes"></a>StatisticalVariable MCF nodes (if any) to be checked into the [schema repo](https://github.com/datacommonsorg/schema/tree/main/stat_vars). These nodes may be written by hand when there are only a handful in number. Otherwise, these nodes can be generated via scripts. This should look like a new MCF file named with the source and dataset name. Note that for schema-less SVs, the MCF nodes still take the DCID as the measuredProperty value.

2. Template MCF and corresponding cleaned tabular files (typically CSV). Like StatisticalVariable MCF nodes, the Template MCF nodes can also be hand-written or script-generated depending on the number of nodes. See [Defining Template MCF nodes](#definingtemplatemcfnodes) above.

3. Data cleaning code (along with README), original .csv dataset, transformed .csv output, and [validation results](#datavalidation) for the artifacts checked into [data repo](https://github.com/datacommonsorg/data).


Once your files are ready, please do the following for the Github PR approval process:


1. Create a PR with the proposed changes above. It may be easier for you to create 2 PRs, one for the /schema repo for artifact 1)  above, and a subsequent one for the /data repo for artifacts 2) and 3) above.

2. For any MCF additions to the /schema repository, run `dc-import lint` &lt;mcf-files> and attach the output counters to the PR.

3. After approval, ***do not*** merge the PR on github. Instead wait for it to be merged by copybara service. This can take a few days as it goes through google team reviews.

 <br/>

***The Data Commons team is looking forward to reviewing your submission!***

 <br/>

# <a name="appendix"></a>Appendix


## Notable Exceptions for DCID naming

You will generally find a lot of prior StatVars that don’t follow this convention, such as:



1. **When constraintProperty is also in name**: In cases where the constraint value is not very meaningful (e.g., Boolean) or ambiguous, we include the constraintProperty in the name too.


    Examples:

    * [Count_Household_HasComputer_NoInternetAccess](https://datacommons.org/browser/Count_Household_HasComputer_NoInternetAccess)
    * [Count_Household_HouseholderRaceWhiteAlone](https://datacommons.org/browser/Count_Household_HouseholderRaceWhiteAlone)
    * [WagesWeekly_Worker_StateGovernmentOwnedEstablishment_NAICSAgricultureForestryFishingHunting](https://datacommons.org/browser/WagesWeekly_Worker_StateGovernmentOwnedEstablishment_NAICSAgricultureForestryFishingHunting)
 <br/><br/>
2. **Omitted source-specific prefixes**: Consider removing source-specific prefixes in populationType, constraintValues, like USC_, EIA_, BLS, etc.

    Example: [WagesAnnual_Worker_LocalGovernmentOwnedEstablishment_NAICSTotalAllIndustries](https://datacommons.org/browser/WagesAnnual_Worker_LocalGovernmentOwnedEstablishment_NAICSTotalAllIndustries)

3. **Excluding populationType from name when irrelevant**: In cases where the populationType isn’t adding much value (e.g., just the measuredProperty is self-explanatory), we exclude it.

    Example: [Daily_PrecipitationRate_RCP26](https://datacommons.org/browser/Daily_PrecipitationRate_RCP26)
