---
layout: default
title: Get names associated with DCIDs
nav_order: 3
parent: Google Sheets
grand_parent: API
---

# Return the names associated with DCIDs

The `=DCGETNAME` formula returns the names associated with given [DCIDs](/glossary.html#dcid) to a cell or range of cells.

## Formula

```
=DCGETNAME(dcids)
```

### Required arguments

* `dcids` - A node or range of cells representing multiple nodes, identified by their [DCIDs](/glossary.html#dcid).

### Returns

The names associated with given node DCIDs to a cell or a range of cells.

## Examples

This section contains examples of using `DCGETNAME` to return the names associated with given DCIDs.

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Example 1: Retrieve the name of a place by its DCID

To retrieve the name of a place by its DCID:

1. Place your cursor in the cell where you want to add a DCID; in this case, cell A1, and enter `geoId/06`.
1. Move to the cell where you want to retrieve the place name.
1. Enter the formula `=DCGETNAME(A1)` to retrieve the name. `California` populates the cell.

![DCGETNAME example 1](/assets/images/sheets/sheets_get_name_california.png)

### Example 2: Retrieve the names of a list of power plants

To retrieve the names of a list of power plants:

1. Enter into column A the DCIDs that are shown in the following image.
1. In cell B2, enter the formula `=DCGETNAME(A2:A4)`. The names of the power plants for each DCID populate column B.

![DCGETNAME example 2](/assets/images/sheets/sheets_get_name_power_plant.png)

### Example 3: Retrieve the names of a list of statistical variables

Statistical variables are also nodes in the Data Commons knowledge with a DCID. To retrieve the names of a list of statistical variables:

1. Enter into column A the DCIDs that are shown in the following image.
1. In cell B2, enter the formula `=DCGETNAME(A2:A4)`. The names of the variables for each DCID populate column B.

![DCGETNAME example 3](/assets/images/sheets/sheets_get_name_sv.png)

## Error responses

If a DCID does not exist, the `=DCGETNAME` formula does not return a value. For example, because the DCID `geoId/123123123` does not exist, no value is returned to cell B1 in the following sheet:

![No value returned for a DCID that does not exist](/assets/images/sheets/sheets_get_name_wrong_dcid_cropped.png)

If you provide an empty cell for a DCID, the `=DCGETNAME` formula returns a value of `#ERROR!`, as shown show in the following image:

![#ERROR! value returned for an empty cell for a DCID](/assets/images/sheets/sheets_get_name_no_input_cropped.png)

