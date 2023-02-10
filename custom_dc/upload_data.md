---
layout: default
title: Upload Data
nav_order: 3
parent: Custom Data Commons
published: true
---

## Overview

Raw data (TMCF, CSV) and some other configuration files are uploaded to Google
Cloud Storage (GCS).

## Storage Layout

All custoom Data Commons data are stored under one GCS folder. Below shows a
typical layout.

```txt
.
└── gcs_folder/
    ├── data/
    │   ├── source1/
    │   │   ├── file_group1/
    │   │   │   ├── bar.tmcf
    │   │   │   ├── bar1.csv
    │   │   │   └── bar2.csv
    │   │   ├── file_group2/
    │   │   │   ├── foo.tmcf
    │   │   │   └── foo.csv
    │   │   ├── schema.mcf
    │   │   └── provenance.json
    │   └── source2/
    │       ├── file_group1/
    │       │   ├── baz.tmcf
    │       │   └── baz.csv
    │       ├── schema.mcf
    │       └── provenance.json
    ├── internal/
    └── provenance.json
```

Raw data should be uploaded under `/<gcs_folder>/data/<source>/<file_group>`. Each
`file_group` folder can only contains one TMCF file and all the CSV files should
have same format. One `source` folder can hold multiple file groups,
representing a cohort of data from one data source.

Note `internal/` folder is used to hold computed data and config files and
should not be touched.

The data source and other meta info can be specified in `provenance.json` file.

## Add a Custom Variable Hierarchy

When using a custom DC instance with new statistical variables, it can be useful to define a custom hierarchy for the variables. The hierarchy is used in the Explorer tools to navigate the variables in a structured manner. For example, a sample custom hierarchy with two layers of groups and three variables is provided below. 

```
.
└── Example Root Node/
    ├── Group 1A/
    │   ├── Variable X
    │   └── Group 2A/
    │       └── Variable Y
    └── Group 1B/
        └── Variable Z
```

To define the hierarchy, each group needs a `StatVarGroup` definition. The `StatVarGroup` nodes are linked to each other and to a custom root node via `specializationOf` properties. The example below can be used as a template — please replace all <span class="param">{}</span> with custom identifiers:

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
