---
layout: default
title: Get Cohort Members
nav_order: 8
parent: Google Sheets
grand_parent: API
---

# Get the values of a given property for a node.

## =DCCOHORTMEMBERS(dcids)

Given a [cohort](http://browser.datacommons.org/kg?dcid=Cohort) or a row of cohort DCIDs, get the [members](http://browser.datacommons.org/kg?dcid=member) of each cohort.

**Arguments**
*    `cohort` - cohort DCIDs to get the members of

**Returns**

The DCIDs of the cohort members. For a single DCID, the result is a column of members. For a row of DCIDs, the result is a matrix with each column being the members of the DCID at the column's index. For a column of DCIDs, the result is a matrix with each row being the members of the DCID at the row's index.

## Examples

In this example, we find the members of the [CDC500_City](https://browser.datacommons.org/kg?dcid=CDC500_City) cohort.

### Input

![](/assets/sheets_get_cohort_members_input.png)

### Output (truncated)

![](/assets/sheets_get_cohort_members_output.png)

