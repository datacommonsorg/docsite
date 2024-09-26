---
layout: default
title: Get names associated with DCIDs
nav_order: 3
parent: Google Sheets
grand_parent: API
---

# Return the names associated with DCIDs

The `=DCGETNAME` formula returns the names associated with given [DCIDs](/glossary.html#dcid) to a cell or a column range of cells.

## Formula

```
=DCGETNAME(dcids)
```

### Required arguments

* `dcids` - A node or range of cells representing multiple nodes, identified by their [DCIDs](/glossary.html#dcid).

## Returns

The names associated with given node DCIDs to a cell or a range of cells.

> **Note**: It’s best to minimize the number of function calls to `=DCGETNAME` by using a single call to get the names for a column of nodes. This is because a spreadsheet will make one call to a Google server [per custom function call](https://developers.google.com/apps-script/guides/sheets/functions#optimization){: target="_blank"}. If your sheet contains thousands of separate calls to `=DCGETNAME(dcids)` you can expect it to be slow and return with errors.

## Examples

This section contains examples of returning the names associated with given DCIDs.

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Example 1: Retrieve the name of a place by its DCID

To retrieve the name of a place by its DCID, perform the following steps:

1. Place your cursor in the cell where you want to add a DCID; in this case, cell A1, and enter `geoId/06`.
1. Move to the cell where you want to retrieve the place name.
1. Enter the formula `=DCGETNAME(A1)` to retrieve the name. `California` populates the cell.

![Retrieve the name of a place by its DCID](/assets/images/sheets/sheets_get_name_california.png)

### Example 2: Retrieve the names of a list of power plants

To retrieve the names of a list of power plants, perform the following steps:

1. Enter into column A the DCIDs that are shown in the following image.
1. In cell B2, enter the formula `=DCGETNAME(A2:A4)`. The names of the power plants for each DCID populate column B.

![Retrieving the names of a list of power plants](/assets/images/sheets/sheets_get_name_power_plant.png)

### Example 3: Retrieve the names of a list of statistical variables

Statistical variables are also nodes in the Data Commons Graph with a DCID. To retrieve the names of a list of statistical variables, perform the following steps:

1. Enter into column A the DCIDs that are shown in the following image.
1. In cell B2, enter the formula `=DCGETNAME(A2:A4)`. The names of the variables for each DCID populate column B.

![Retrieving the names of a list of variables](/assets/images/sheets/sheets_get_name_sv.png)

## Error responses

If a DCID does not exist, the `=DCGETNAME` formula does not return a value. For example, because the DCID `geoId/123123123` does not exist, no value is returned to cell B1 in the following sheet:

![No value returned for a DCID that does not exist](/assets/images/sheets/sheets_get_name_wrong_dcid_cropped.png)

If you provide an empty cell for a DCID, the `=DCGETNAME` formula returns a value of `#ERROR!`, as shown show in the following image:

![#ERROR! value returned for an empty cell for a DCID](/assets/images/sheets/sheets_get_name_no_input_cropped.png)

