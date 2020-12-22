---
layout: default
title: Get Cohort Members
nav_order: 8
parent: Google Sheets
grand_parent: API
---

# Retrieve the values of a given property for a node

Get the [members](http://browser.datacommons.org/kg?dcid=member) of each [cohort](/glossary.html) provided. Here a cohort is a general term for a group of entities, like [the CDC's list of the United States' 500 largest cities](https://datacommons.org/browser/CDC500_City).

## General information about this method

**Signature:** `=DCCOHORTMEMBERS(dcids)`

**Arguments**
*    `dcids` - cohort DCIDs whose members are sought. Here a DCID refers to the unique ID assigned by Data Commons to every node in the knowledge graph. 

**Returns**

The DCIDs of the cohort members. For a single DCID, the result is a column of members of the cohort represented by that DCID. For a row of DCIDs, the result is a matrix with each column the members of the cohort whose DCID serves as the column's index. For a column of DCIDs, the result is a matrix with each row the members of the cohort whose DCID serves as the row's index.

## Example

This example uses the `DCCOHORTMEMBERS` method to retrieve the members of the [CDC500_City](https://datacommons.org/browser/CDC500_City) cohort.

### Input

![](/assets/images/sheets/sheets_get_cohort_members_input.png)

### Output (truncated)

![](/assets/images/sheets/sheets_get_cohort_members_output.png)
