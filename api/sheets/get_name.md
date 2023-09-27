---
layout: default
title: Node Name
nav_order: 1
parent: Google Sheets
grand_parent: API
---

# Returning the Names Associated with a Node

The `=DCGETNAME(*dcids*)` formula returns the names associated with given node DCIDs to a cell or a column range of cells.

> **NOTE:**
> 
> Be sure to follow the instructions for [Installing and Enabling the Sheets Add-On](https://docs.datacommons.org/api/sheets/) before using this formula.

## Formula {#formula}

```
=DCGETNAME(*dcids*)
```

## Required Arguments {#required-arguments}

`dcids` - A list of DCID nodes to query

## Returns {#returns}

The formula returns the name associated with a specified DCID. See the [Examples](#examples) section below for examples of positive returns. If a DCID does not exist, the `=DCGETNAME(*dcids*)` formula does not return a value. For example, because the “geoId/123123123” DCID does not exist, no value is returned to cell B1 in the following sheet:

![alt_text](images/sheets_get_return_error_1.png "image_tooltip")

If you provide an empty cell for a DCID, the `=DCGETNAME(*dcids*)` formula returns a value of #ERROR!, as shown show in the following image:

![alt_text](images/sheets_get_return_error_2.png "image_tooltip")

## Examples {#examples}

This section contains examples of returning the names associated with given DCIDs.

### Example 1: Retrieve the Name of a Country by its DCID

To retrieve the name of a country by its DCID, perform the following steps:

1. Place your cursor in the cell where you want to add a DCID. In this case, cell A1.
2. Click in the search box for the **Fill place dcids for selected cells** section. For this example, enter “Ivory Coast”. The cell is populated with a DCID of “country/CIV”.
3. Move to the cell where you want to retrieve the country name.
4. Enter the formula **`=DCGETNAME(A1)`** to retrieve the country name and press **Enter**. The French spelling of Ivory Coast (Côte d'Ivoire) populates the cell.

![alt_text](images/sheets_get_name_example_1.png "image_tooltip")

### Example 2: Retrieve the Names of a Collection of Cells

To retrieve the names of a collection of cells using DCIDs, perform the following steps:

1. Using the following image, enter the DCIDs for four African nations into column A.
2. Place your cursor in cell B1 and type the following formula: **`=DCGETNAME`**.
3. Press **Enter** and the names of the four African nations populates column B.

![alt_text](images/sheets_get_name_example_2.png "image_tooltip")

> **IMPORTANT**
> 
> It’s best to minimize the number of function calls to `=DCGETNAME(*dcids*)` by using a single call to get the names for a column of nodes. This is because a spreadsheet will make one call to a Google server _[per custom function call](https://developers.google.com/apps-script/guides/sheets/functions#optimization)_. If your sheet contains many separate calls to `=DCGETNAME(*dcids*)`, you can expect it to be slow and return errors.

