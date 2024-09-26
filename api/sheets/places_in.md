---
layout: default
title: Get places contained in another place
nav_order: 4
parent: Google Sheets
grand_parent: API
---

# Retrieve places contained within another place

The `=DCPLACESIN` formula returns lists of child places from a list of parent [`Place`](https://datacommons.org/browser/Place){: target="_blank"} [DCIDs](/glossary.html#dcid). It only returns children with a place type that matches the `place_type` parameter, such as [`State`](https://datacommons.org/browser/State){: target="_blank"}, [`Country`](https://datacommons.org/browser/Country){: target="_blank"}, and so on.

## Formula

```
=DCPLACESIN(dcids, place_type)
```

## Required arguments

* `dcids`: A single [place](/glossary.html#place) node or range of cells representing place nodes, identified by their [DCIDs](/glossary.html#dcid).
* `place_type`: The type of the contained child `Place` nodes to filter by. For example,`City` and `County`are contained within `State`. For a full list of available types, see the [place types page](/place_types.html).

## Returns

A list of child place DCIDs of the specified place DCIDs, of the specified place type.

> **Note**:
> It’s best to minimize the number of function calls to `=DCPLACESIN` by using a single call to get the child nodes places. This is because a spreadsheet will make one call to a Google server [per function call](https://developers.google.com/apps-script/guides/sheets/functions#optimization){: target="_blank"}. If your sheet contains many separate calls to `=DCPLACESIN(dcids, place_type)` you can expect it to be slow and return with errors.

## Examples

This section contains examples of using the `=DCPLACESIN` formula.

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Example 1: Retrieve a list of counties in Delaware

To retrieve a list of counties in Delaware, perform the following steps:

1. Place your cursor in the cell where you want to add the DCID for Delaware; in this case, cell A2.
2. Enter the Delaware DCID of `geoId/10`.
3. (Optional) In cell B2, enter `DCGETNAME(A2)` to retrieve Delaware's name from the DCID in cell A2.
4. Move to the cell C3 and enter the formula `=DCPLACESIN(A2, "County")` to retrieve the county names. The DCIDs for the three Delaware counties populate column C.
5. Retrieve the Delaware county names by entering the formula `DCGETNAME(C2:C4)` into cell D2.

![Retrieving a List of Counties in Delaware](/assets/images/sheets/sheets_places_in_counties_in_delaware.png)

### Example 2: Retrieve congressional districts in Alaska and Hawaii

To retrieve the congressional districts in Alaska and Hawaii, perform the following steps:

1. In cell A2, enter `geoId/02` for the DCID of Alaska and in cell A3, enter `geoId/15` for the DCID of Hawaii.
2. (Optional) In cell B1, enter `=DCGETNAME(A2:A3)` to retrieve the names of Alaska and Hawaii into column B.
3. Retrieve the DCIDs for the congressional districts by entering `=DCPLACESIN(A2:A3, "CongressionalDistrict")` into cell C2.
4. Retrieve the names of the congressional districts by entering `=DCGETNAMES(C2:C4)` into cell D2.

![Retrieving Congressional Districts in Alaska and Hawaii](/assets/images/sheets/sheets_places_in_congressional_districts_ak_hi.png)

## Error responses

If a DCID does not exist, the `=DCPLACESIN` formula returns a value of `#REF!`. For example, because the `geoId/123123123` DCID does not exist, an error of `#REF!` is returned to cell B1 in the following sheet:

![Error example](/assets/images/sheets/sheets_places_in_wrong_dcid.png)

If you provide an empty cell for a DCID, the `=DCPLACESIN` formula returns a value of `#ERROR!`, as shown show in the following image:

![Error example](/assets/images/sheets/sheets_places_in_no_input.png)

Finally, if you provide an invalid property to the `=DCPLACESIN` formula, an error of `#REF!` is also returned, as follows:

![Error example](/assets/images/sheets/sheets_places_in_bad_property.png)

