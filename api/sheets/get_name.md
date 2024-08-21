---
layout: default
title: Names Associated with a DCID
nav_order: 1
parent: Google Sheets
grand_parent: API
---

# Returning the Names Associated with a DCID

The `=DCGETNAME(dcids)` formula returns the names associated with given [DCIDs](/glossary.html#dcid) to a cell or a column range of cells.

> **Note**: Be sure to follow the instructions for [Installing and Enabling the Sheets Add-On](/api/sheets/) before using this formula.

## Formula

```
=DCGETNAME(dcids)
```

### Required Arguments

`dcids` - A list of [node DCID](/glossary.html#dcid)s to query.

## Returns

The names associated with given node DCIDs to a cell or a range of cells.

> **Note**: It’s best to minimize the number of function calls to `=DCGETNAME(dcids)` by using a single call to get the names for a column of nodes. This is because a spreadsheet will make one call to a Google server [*per custom function call*](https://developers.google.com/apps-script/guides/sheets/functions#optimization){: target="_blank"}. If your sheet contains thousands of separate calls to `=DCGETNAME(dcids)` you can expect it to be slow and return with errors.

## Examples

This section contains examples of returning the names associated with given DCIDs.

### Example 1: Retrieve the Name of a Place by its DCID

To retrieve the name of a place by its DCID, perform the following steps:

1. Place your cursor in the cell where you want to add a DCID. In this case, cell A1.
1. Move to the cell where you want to retrieve the place name.
1. Enter the formula <code><b>=DCGETNAME(A1)</b></code> to retrieve the name.  *California* populates the cell.

![Retrieving the name of a country by its DCIC](/assets/images/sheets/sheets_get_name_california.png)

### Example 2: Retrieve the Names of a Collection of Power Plants

To retrieve the names of a collection of power plants, perform the following steps:

1. Enter into column A the DCIDs that are shown in the following image.
1. In cell B2, enter the formula <code><b>=DCGETNAME(A2:A4)</b></code>. The names of the countries for each DCID populates in column B.

![Retrieving the names of a collection of power plants](/assets/images/sheets/sheets_get_name_power_plant.png)

### Example 3: Retrieve the names of a list of statistical variables

Statistical Variables are also nodes in the Data Commons Graph with a DCID. To retrieve the names of a list of statistical variables, perform the following steps:

1. Enter into column A the DCIDs that are shown in the following image.
1. In cell B2, enter the formula <code><b>=DCGETNAME(A2:A4)</b></code>. The names of the countries for each DCID populates in column B.

![Retrieving the names of a collection of power plants](/assets/images/sheets/sheets_get_name_sv.png)

## Error Responses

If a DCID does not exist, the `=DCGETNAME(dcids)` formula does not return a value. For example, because the “geoId/123123123” DCID does not exist, no value is returned to cell B1 in the following sheet:

![No value returned for a DCID that does not exist](/assets/images/sheets/sheets_get_name_wrong_dcid_cropped.png)

If you provide an empty cell for a DCID, the `=DCGETNAME(dcids)` formula returns a value of #ERROR!, as shown show in the following image:

![#ERROR! value returned for an empty cell for a DCID](/assets/images/sheets/sheets_get_name_no_input_cropped.png)

