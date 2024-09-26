---
layout: default
title: Get members of a cohort
nav_order: 7
parent: Google Sheets
grand_parent: API
---

# Retrieve members of a cohort

The `DCCOHORTMEMBERS` formula returns the [members](http://browser.datacommons.org/kg?dcid=member) of each [cohort](/glossary.html#cohort) provided. Here a cohort is a general term for a group of entities, like [the CDC's list of the United States' 500 largest cities](https://datacommons.org/browser/CDC500_City).

## Formula

```
=DCCOHORTMEMBERS(dcids)
```

### Required arguments
*    `dcids` -  A single node or range of cells representing nodes, identified by their [DCIDs](/glossary.html#dcid), whose members are sought.

### Returns

The DCIDs of the cohort members. For a single DCID, the result is a column of members of the cohort represented by that DCID. For a row of DCIDs, the result is a matrix with each column the members of the cohort whose DCID serves as the column's index. For a column of DCIDs, the result is a matrix with each row the members of the cohort whose DCID serves as the row's index.

## Example: Retrieve the list of cities that are members of the CDC 500 cohort

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying this example.

To retrieve the members of the [CDC 500 cities](https://datacommons.org/browser/CDC500_City) cohort:

1. Place your cursor in any cell, say A1, and enter `CDC500_City`.
1. In cell B1, enter `=DCCOHORTMEMBERS(A1)`. 

    ![DCCOHORTMEMBERS example](/assets/images/sheets/sheets_get_cohort_members_input.png)

    The list of member DCIDs populates column B.

    ![DCCOHORTMEMBERS example](/assets/images/sheets/sheets_get_cohort_members_output.png)
1. (Optional) To get the names of the members, in cell C1, enter `DCGETNAME(B1:B500)`.
