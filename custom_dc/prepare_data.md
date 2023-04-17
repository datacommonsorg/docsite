---
layout: default
title: Prepare Data
nav_order: 2
parent: Custom Data Commons
published: true
---

## Overview

Preparing data involves cleaning / formatting the raw data into compatible CSV
files. Each CSV file is expected to have columns corresponding to the Values
(numeric) about a Variable, Place and Date. The format of a CSV file is
specified by a [Template
MCF](https://github.com/datacommonsorg/data/blob/master/docs/mcf_format.md#template-mcf).
The ready to use artifacts contain one TMCF file (.tmcf) and a few compatible
CSV files (.csv).

## File Format

### General Format

In the table shown below, there are separate columns for Variable (Variable),
Place (Country), Date (Year) and Value (Value) and each row of the CSV
corresponds to one observation of the Variable about a Place at the specified
Date.

| Year | Country | Variable        | Value       | Extra Column [Optional] |
| ---- | ------- | --------------- | ----------- | ----------------------- |
| 2017 | UK      | Life_Expectancy | 81.25609756 | 1                       |
| 2017 | UK      | Population      | 65844142    | 2                       |

The TMCF for this CSV looks like:

```txt
Node: E:data->E0
typeOf: dcs:StatVarObservation
observationAbout: C:data->Country
observationDate: C:data->Year
variableMeasured: C:data->Variable
value: C:data->Value
```

Note: If all observations in the CSV are about the same Date, then those do not
need to be specified as columns, but just as constants. This applies to
Variable, Place as well. For the example above, if the CSV has data only for
2017, then the CSV and TMCF looks like:

| Country | Variable        | Value    | Extra Column [Optional] |
| ------- | --------------- | -------- | ----------------------- |
| UK      | Life_Expectancy | 81.2     | 1                       |
| UK      | Population      | 65844142 | 2                       |

```txt
Node: E:data->E0
typeOf: dcs:StatVarObservation
observationAbout: C:data->Country
observationDate: 2017
variableMeasured: C:data->Variable
value: C:data->Value
```

### Date as Column Header

It is possible to specify Date as column headers.

| Country | Variable        | 2017     | 2018     |
| ------- | --------------- | -------- | -------- |
| UK      | Life_Expectancy | 81.2     | 81.3     |
| KR      | Population      | 51361911 | 51606633 |

```txt
Node: E:data->E0
typeOf: dcs:StatVarObservation
observationAbout: C:data->Country
observationDate: 2017
variableMeasured: C:data->Variable
value: C:data->2017

Node: E:data->E1
typeOf: dcs:StatVarObservation
observationAbout: C:data->Country
observationDate: 2018
variableMeasured: C:data->Variable
value: C:data->2018
```

### Variable as Column Header

It is possible to specify Variable as column headers.

| Year | Country | Life_Expectancy | Population |
| ---- | ------- | --------------- | ---------- |
| 2017 | UK      | 81.2            | 65844142   |
| 2018 | KR      | 82              | 51361911   |

```txt
Node: E:data->E0
typeOf: dcs:StatVarObservation
observationAbout: C:data->Country
observationDate: C:data->Year
variableMeasured: Life_Expectancy
value: C:data->Life_Expectancy

Node: E:data->E1
typeOf: dcs:StatVarObservation
observationAbout: C:data->Country
observationDate: C:data->Year
variableMeasured: Population
value: C:data->Population
```

### Date and Place Formats

Please check [Supported Date and Place
Formats](https://datacommons.org/import/#supported-formats)

## Testing Data

Before uploading the data into custom instance, make sure to run [Import
Checker](https://github.com/datacommonsorg/import#using-import-tool) and make
sure there are no formatting or other issues.
