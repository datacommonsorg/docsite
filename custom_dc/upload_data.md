---
layout: default
title: Upload Data
nav_order: 3
parent: Custom Data Commons
published: true
---

## Overview

Schema files (MCF), data files (CSV) and data specification files (TMCF) are
stored in Google Cloud Storage (GCS) of the custom Data Commons GCP project.
These files should be stored based on a desired layout, so data can be processed
and show up correctly. It's worth to understand a few terms to better understand
the data layout.

### Data Source

Data source refers to a data agency such as "Census", "World Bank".

### Dataset

Dataset does not have a standard definition. The granulairty of a
dataset varies depending on the sources. For example, one dataset can contain
public parks information of all the states in USA if they are published
together. Or if each state publishes this information individually, then there
are multiple datasets for this topic.

### Import

Import is the smallest unit of data upload in Data Commons. It usually (but not
necessarily) corresponds to a dataset.

### Import Group

A group of related imports that have similar topics. This is also the unit of
raw data processing.

### Table

Table corresponds to one TMCF file and a set of CSV files that have the same
shape. One import could have one or multiple tables.

## Example Layout

Consider the following two datasets:

1. State level public park general information in 50 csv files (collected by
   each state in different format, with size of 5G).
2. State level public park expenditure with 1 csv file per year (collected by an
   agency, with size of 5M).

They can be arranged in multiple ways.

### Single Import Group

Since these data are all about public parks, they can be put under one import
group, with two imports:

- general info import

  - With one schema file describing public parks properties
  - With 50 tables for each state
    - Each table has one TMCF and one CSV file

- expenditure import
  - With one schema file describing expenditure
  - With one table containing one TMCF and mutliple CSV files.

### Multiple Import Groups

If the two datasets are managed by different departments and are updated at
different frequencies, they can each be an import group. This way, when
expenditure data is updated, only its data is processed and the larger general
information import is untouched.

## Storage Layout

All custom Data Commons data are stored under one GCS folder. Below shows a
typical layout.

Note, create a "root_folder" under the desired GCS bucket, which will be used to
hold all the data.

```txt
<root_folder>
├── import_group1/
│   ├── data/
│   │   ├── import1/
│   │   │   ├── table1/
│   │   │   │   ├── bar.tmcf
│   │   │   │   ├── bar1.csv
│   │   │   │   └── bar2.csv
│   │   │   ├── table2/
│   │   │   │   ├── foo.tmcf
│   │   │   │   └── foo.csv
│   │   │   ├── schema.mcf
│   │   │   └── provenance.json
│   │   └── import2/
│   │       ├── table1/
│   │       │   ├── baz.tmcf
│   │       │   └── baz.csv
│   │       ├── schema.mcf
│   │       └── provenance.json
│   ├── internal/
│   └── provenance.json
└── import_group2/
    ├── data/
    └── internal/
```

Raw data should be uploaded under `/<import_group>/data/<import>/<table>`. Each
`table` folder can only contain one TMCF file while all the CSV files should
have conformating format.

Note `internal/` folder is used to hold computed data and config files and
should not be touched.

The data source and other meta info can be specified in `provenance.json` file
with the following fields

```json
{
  "name": "Name of the source (dataset)",
  "url": "Url of the source (dataset)"
}
```

provenance.json can be at import group level or import level, usually indicating
data source and dataset provenance respectively.

## Add a Custom Variable Hierarchy

When using a custom DC instance with new statistical variables, it can be useful
to define a custom hierarchy for the variables. The hierarchy is used in the
Explorer tools to navigate the variables in a structured manner. For example, a
sample custom hierarchy with two layers of groups and three variables is
provided below.

```txt
.
└── Example Root Node/
    ├── Group 1A/
    │   ├── Variable X
    │   └── Group 2A/
    │       └── Variable Y
    └── Group 1B/
        └── Variable Z
```

To define the hierarchy, each group needs a `StatVarGroup` definition. The
`StatVarGroup` nodes are linked to each other and to a custom root node via
`specializationOf` properties. The example below can be used as a template —
please replace all <span class="param">{}</span> with custom identifiers:

<div class="schema-example">
    Node: dcid:dc/g/Custom_Root
    typeOf: dcs:StatVarGroup
    specializationOf: dcid:dc/g/Root
    name: "<span class="param">{Example Root Node}</span>"

    Node: dcid:dc/g/Custom_<span class="param">{1A}</span>
    typeOf: dcs:StatVarGroup
    name: "<span class="param">{Group 1A}</span>"
    specializationOf: dcid:dc/g/Custom_Root
    displayRank: <span class="param">{1}</span>

    Node: dcid:dc/g/Custom_<span class="param">{1B}</span>
    typeOf: dcs:StatVarGroup
    name: "<span class="param">{Group 1B}</span>"
    specializationOf: dcid:dc/g/Custom_Root
    displayRank: <span class="param">{2}</span>

    Node: dcid:dc/g/Custom_<span class="param">{2A}</span>
    typeOf: dcs:StatVarGroup
    name: "<span class="param">{Group 2A}</span>"
    specializationOf: dcid:dc/g/Custom_<span class="param">{1A}</span>
    displayRank: <span class="param">{1}</span>

</div>

Next, each new variable needs a `StatisticalVariable` node definition, which will specify which group in the hierarchy it belongs to. The example below can be used as a template — please replace all <span class="param">{}</span> with custom identifiers:

<div class="schema-example">
    Node: dcid:<span class="param">{Variable_X}</span>
    name: "<span class="param">{Variable X}</span>"
    typeOf: dcs:StatisticalVariable
    populationType: dcs:Thing
    measuredProperty: dcs:<span class="param">{Variable_X}</span>
    statType: dcs:measuredValue
    memberOf: dcid:dc/g/Custom_<span class="param">{1A}</span>

    Node: dcid:<span class="param">{Variable_Y}</span>
    name: "<span class="param">{Variable Y}</span>"
    typeOf: dcs:StatisticalVariable
    populationType: dcs:Thing
    measuredProperty: dcs:<span class="param">{Variable_Y}</span>
    statType: dcs:measuredValue
    memberOf: dcid:dc/g/Custom_<span class="param">{2A}</span>

    Node: dcid:<span class="param">{Variable_Z}</span>
    name: "<span class="param">{Variable Z}</span>"
    typeOf: dcs:StatisticalVariable
    populationType: dcs:Thing
    measuredProperty: dcs:<span class="param">{Variable_Z}</span>
    statType: dcs:measuredValue
    memberOf: dcid:dc/g/Custom_<span class="param">{1B}</span>

</div>

The `StatVarGroup` and `StatisticalVariable` nodes that make up the hiearchy can
be included in a `.mcf` file and added to the GCS bucket associated with the
custom DC instance.
