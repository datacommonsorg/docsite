---
layout: default
title: Adding datasets
nav_order: 2
parent: Contributing to Data Commons
---

# Life of a dataset

This tutorial walks through the process of structuring and inserting data into the Data Commons graph.

## Background

Importing data into Data Commons requires converting source data into a format that the Data Commons graph can consume. This section presents an example that does not require statistical data.

Given tabular data such as the following:

|country_id  |  country_name	         |  continent_id|
|-------|--------|---------|
|USA	     |  United States of America |  northamerica|
|IND	     |  India                    |	        asia|


You can represent this data as a graph via subject-predicate-object "triples" that describe the node and edge relationships.
```
USA -- typeOf ------------> Country
USA -- name --------------> United States of America
USA -- containedInPlace --> northamerica
```

While you can express these triples via standards such as [JSON-LD](https://json-ld.org/) or [RDFa](https://en.wikipedia.org/wiki/RDFa), the Data Commons format of choice is [MCF](https://github.com/datacommonsorg/data/tree/master/docs/mcf_format.md), which is concise and human readable. Here's the translated version of the example tabular data:

```
Node: USA
typeOf: schema:Country
name: "United States of America"
containedInPlace: dcid:northamerica

Node: IND
typeOf: schema:Country
name: "India"
containedInPlace: dcid:asia
```

The `schema:` prefix represents the schema.org namespace, and `dcid:` represents the Data Commons namespace. For more information, see [scoping and namespaces in MCF](https://github.com/datacommonsorg/data/tree/master/docs/mcf_format.md#scoping-and-namespaces).

The following sections explain how to convert [statistical data into graph representations](https://github.com/datacommonsorg/data/tree/master/docs/representing_statistics.md), as well as how to leverage templating to quickly map tabular data into [instance MCF](https://github.com/datacommonsorg/data/tree/master/docs/mcf_format.md#instance-mcf).


## Example: Importing The COVID Tracking Project's historical state data

This particular example imports the COVID Tracking Project's [historical state dataset](https://covidtracking.com/api/).

The dataset contains various statistics about COVID-19 testing results, including numbers of patients hospitalized, patients in the ICU, patients on ventilators, and patient outcomes.

The end goal of this example is to represent each data point as a `StatVarObservation` akin to this:

```
Node: Count_MedicalTest_COVID_19_Pending_geoId/04_2020-03-04
typeOf: dcs:StatVarObservation
variableMeasured: dcs:Count_MedicalTest_COVID_19_Pending
observationAbout: dcid:geoId/04
observationDate: "2020-03-04"
value: 24
```

For more information on the terms [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable) and [`StatVarObservation`](https://datacommons.org/browser/StatVarObservation), see ["Intro to `StatisticalVariable` and `StatVarObservation`"](https://github.com/datacommonsorg/data/tree/master/docs/representing_statistics.md).

### Roadmap

Importing data requires three main steps:

1. Defining new `StatisticalVariable` nodes.
2. Cleaning the CSV files.
3. Defining a mapping from CSV to MCF (aka [Template MCF](https://github.com/datacommonsorg/data/tree/master/docs/mcf_format.md#template-mcf)).

This tutorial explains each step in detail and demonstrates where you can submit artifacts for Data Commons review.

### Step 1: Define new `StatisticalVariable` nodes.

**Note:** If the dataset does not introduce new variables, skip this step and refer to existing `StatisticalVariable` identifiers.

#### Required triples

At a minimum, each `StatisticalVariable` needs a `populationType` and a curated, human readable identifier. Here's an example:

```
Node: dcid:Count_MedicalTest_COVID_19_Pending
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalTest
```

In this example, "`MedicalTest`" is the `populationType` and "`Count_MedicalTest_COVID_19_Pending`" is the curated identifier. Data Commons recommends making these IDs descriptive of the stat. For example, if your data is specifically for median income among females age 12 and over, you could assign "MedianIncome_Person_Female_12YearsAndOlder".

#### Optional triples

The `statType` and `measured_property` fields can be updated later. If they are not provided, Data Commons will assign `measuredValue` as the `statType` and use the `dcid` as a placeholder `measured_property`. Here is an example that includes these optional triples:

```
Node: dcid:Count_MedicalTest_COVID_19_Pending
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalTest
statType: dcs:measuredValue
measuredProperty: dcs:count
```

Other common `statType`s include `medianValue`, `meanValue` and `minValue`. Other common `measuredProperty`s include `count`, `incrementalCount`, and `age`.

#### Remaining triples
Data Commons will take care of filling in the "constraining properties". These properties typically express information that you have already encoded in the `StatisticalVariable`'s `dcid`. In this example, the `dcid` "Count_MedicalTest_COVID_19_Pending" is split into `medicalCondition: dcs:COVID_19` and `testResult: dcs:Pending`. Here is an example final MCF:

```
Node: dcid:Count_MedicalTest_COVID_19_Pending
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalTest
statType: dcs:measuredValue
measuredProperty: dcs:count
medicalCondition: dcs:COVID_19
testResult: dcs:Pending
```

#### COVID Tracking Project `StatisticalVariable`s

Most of the measures listed in this example are new to Data Commons, thus requiring corresponding new `StatisticalVariable`s. Remember that `statType` and `measuredProperty` are optional and should be left blank if the schema is not obvious.

Here are five `StatisticalVariable` definitions:

```
Node: dcid:CumulativeCount_MedicalTest_COVID_19
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalTest
medicalCondition: dcs:COVID_19
statType: dcs:measuredValue
measuredProperty: dcs:cumulativeCount

Node: dcid:CumulativeCount_MedicalTest_COVID_19_Positive
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalTest
medicalCondition: dcs:COVID_19
statType: dcs:measuredValue
measuredProperty: dcs:cumulativeCount
testResult: dcs:Positive

Node: dcid:Count_MedicalTest_COVID_19_Pending
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalTest
medicalCondition: dcs:COVID_19
statType: dcs:measuredValue
measuredProperty: dcs:count
testResult: dcs:Pending

Node: dcid:Count_MedicalConditionIncident_COVID_19_PatientHospitalized
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalConditionIncident
medicalCondition: dcs:COVID_19
statType: dcs:measuredValue
measuredProperty: dcs:count
medicalStatus: dcs:PatientHospitalized

Node: dcid:CumulativeCount_MedicalConditionIncident_COVID_19_PatientDeceased
typeOf: dcs:StatisticalVariable
populationType: dcs:MedicalConditionIncident
medicalCondition: dcs:COVID_19
statType: dcs:measuredValue
measuredProperty: dcs:cumulativeCount
medicalStatus: dcs:PatientDeceased
```

The full set of `StatisticalVariable`s is checked into [https://github.com/datacommonsorg/data](https://github.com/datacommonsorg/data) under the appropriate [`scripts/<provenance>/<dataset>` subdirectory](https://github.com/datacommonsorg/data/tree/master/scripts/covid_tracking_project/historic_state_data).

When going through the import process, see the [GitHub Development Process](https://github.com/datacommonsorg/data#github-development-process) for how to prepare for a pull request. 

### Step 2: Clean the CSV.

There are no restrictions on your approach for this step, only requirements for its result.

1. Each `StatisticalVariable` must have its own column for its observed value.
2. Each property in your schema must have its own column for its value, including the values of `observationAbout` and `observationDate`.
3. Dates must be in ISO 8601 format: "YYYY-MM-DD".
4. References to existing nodes in the graph must be `dcid`s.
5. The cleaning script is reproducible and easy to run. Python or Golang is recommended.

#### Step 2a: Write the Preprocessing Script.

**Note:** Renaming the columns is not necessary. It is a style choice to maintain reference to the `StatisticalVariable` ID at all times.

An example script prepending `dcid:` to the state identifiers, thus allowing later global references to the states, is available at https://github.com/datacommonsorg/data/blob/master/scripts/covid_tracking_project/historic_state_data/preprocess_csv.py.

#### Step 2b: Check In the Preprocessing Script.

Check in the script and the resulting CSV to [https://github.com/datacommonsorg/data](https://github.com/datacommonsorg/data) under the appropriate [`scripts/<provenance>/<dataset>` subdirectory](https://github.com/datacommonsorg/data/tree/master/scripts/covid_tracking_project/historic_state_data).

### Step 3: Specify the Template MCF.

Template MCF is essentially a mapping file that instructs Data Commons on how to convert each row of a CSV into MCF. Each entity and `StatisticalVariable` will have a template. For additional information, read [Template MCF](https://github.com/datacommonsorg/data/blob/master/docs/mcf_format.md#template-mcf).

The following is the mapping for the first two `StatisticalVariable`s.

```
Node: E:COVIDTracking_States->E0
typeOf: dcs:StatVarObservation
variableMeasured: dcs:CumulativeCount_MedicalTest_COVID_19
measurementMethod: dcs:CovidTrackingProject
observationAbout: C:COVIDTracking_States->GeoId
observationDate: C:COVIDTracking_States->Dates
value: C:COVIDTracking_States->CumulativeCount_MedicalTest_COVID_19

Node: E:COVIDTracking_States->E1
typeOf: dcs:StatVarObservation
variableMeasured: dcs:CumulativeCount_MedicalTest_COVID_19_Positive
measurementMethod: dcs:CovidTrackingProject
observationAbout: C:COVIDTracking_States->GeoId
observationDate: C:COVIDTracking_States->Dates
value: C:COVIDTracking_States->CumulativeCount_MedicalTest_COVID_19_Positive

... etc ...
```

The mapping for the remaining variables is essentially identical and can be generated by a script.

**Note:** This example adds the property `measurementMethod: dcs:CovidTrackingProject` to distinguish the same CumulativeCount_MedicalTest_COVID_19 observation for a state and date from multiple sources (such as the New York Times, the COVID Tracking Project, or Harvard).

```
# Automate Template MCF generation since there are many Statistical Variables.
TEMPLATE_MCF_TEMPLATE = """
Node: E:COVIDTracking_States->E{index}
typeOf: dcs:StatVarObservation
variableMeasured: dcs:{stat_var}
measurementMethod: dcs:CovidTrackingProject
observationAbout: C:COVIDTracking_States->GeoId
observationDate: C:COVIDTracking_States->Dates
value: C:COVIDTracking_States->{stat_var}
"""
```

Check in the Template MCF file together with the cleaned CSV and its preprocessing script to [https://github.com/datacommonsorg/data](https://github.com/datacommonsorg/data) under the appropriate [`scripts/<provenance>/<dataset>` subdirectory](https://github.com/datacommonsorg/data/tree/master/scripts/covid_tracking_project/historic_state_data). The Template MCF generation code may also be included (as in this example).

## Conclusion
After producing all three required components (`StatisticalVariable` schema MCF, cleaned CSV, and Template MCF), go ahead and submit a PR to [https://github.com/datacommonsorg/data/pulls](https://github.com/datacommonsorg/data/pulls).