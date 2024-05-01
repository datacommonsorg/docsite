---
layout: default
title: Places Contained Within Another Place
nav_order: 2
parent: Google Sheets
grand_parent: API
---

# Retrieving Places Contained Within Another Place

The `=DCPLACESIN(dcids, placeType)` formula returns lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](https://docs.datacommons.org/glossary.html#dcid). It only returns children with a place type that matches the `placeType` parameter, such as [State](https://datacommons.org/browser/State), [Country](https://datacommons.org/browser/Country), and so on.

> **Note**: Be sure to follow the instructions for [Installing and Enabling the Sheets Add-On](/api/sheets/) before using this formula.

## Formula

```
=DCPLACESIN(dcids, placeType)
```

## Required Arguments

* `dcids`: A list of parent [Place](/glossary.html#place) nodes, identified by their [DCIDs](/glossary.html#dcid).
* `placeType`: The type of the contained child `Place` nodes to filter by. For example,`City` and `County`are contained within `State`. For a full list of available types, see [the Data Commons Knowledge Graph entry for Place](https://datacommons.org/browser/Place).

## Returns

Lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](https://docs.datacommons.org/glossary.html#dcid). Returns a list of child places of the specified place DCIDs, of the specified place type.

> **Note**:
> It’s best to minimize the number of function calls to `=DCPLACESIN(dcids, placeType)` by using a single call to get the names for a column of nodes. This is because a spreadsheet will make one call to a Google server [*per custom function call*](https://developers.google.com/apps-script/guides/sheets/functions#optimization). If your sheet contains many separate calls to `=DCPLACESIN(dcids, placeType)` you can expect it to be slow and return with errors.

## Examples

This section contains examples of using the `=DCPLACESIN(dcids, placeType)` formula.

### Example 1: Retrieve a List of Counties in Delaware

To retrieve a list of counties in Delaware, perform the following steps:

1. Place your cursor in the cell where you want to add the DCID for Delaware. In this case, cell A2.
2. Enter the Delaware DCID of <code><b>geoId/10</b></code>.
3. (Optional) In cell B2, enter <code><b>DCGETNAME(A2)</b></code> to retrieve Delaware's name from the DCID in cell A2.
4. Move to the cell C3 and enter the formula <code><b>=DCPLACESIN(A2, "County")</b></code> to retrieve the county names. The DCIDs for the three Delaware counties populate column C.
5. Retrieve the Delaware county names by entering the formula <code><b>=DCGETNAME(C2:C4)</b></code> into cell D2.

![Retrieving a List of Counties in Delaware](/assets/images/sheets/sheets_places_in_counties_in_delaware.png)

### Example 2: Retrieve Congressional Districts in Alaska and Hawaii

To retrieve the congressional districts in Alaska and Hawaii, perform the following steps:

1. In cell A2, enter <code><b>geoId/02</b></code> for the DCID of Alaska and in Cell A3, enter <code><b>geoId/15</b></code> for the DCID of Hawaii.
2. (Optional) Enter <code><b>=DCGETNAME(A2:A3)</b></code> in cell B1 to retrieve the names of Alaska and Hawaii into column B.
3. Retrieve the DCIDs for the congressional districts by enter <code><b>=DCPLACESIN(A2:A3, "CongressionalDistrict")</b></code> into cell C2.
4. Finally, retrieve the names of the congressional districts by entering <code><b>=DCGETNAMES(C2:C4)</b></code> into cell D2.

![Retrieving Congressional Districts in Alaska and Hawaii](/assets/images/sheets/sheets_places_in_congressional_districts_ak_hi.png)

## Error Responses

If a DCID does not exist, the `=DCPLACESIN(dcids, placeType)` formula returns a value of #REF!. For example, the `=DCPLACESIN(A1, "CongressionalDistrict")` formula should return the congressional districts for the DCID in cell A1. However, because the “geoId/123123123” DCID does not exist, an error of #REF! is returned to cell B1 in the following sheet:

![alt_text](/assets/images/sheets/sheets_places_in_wrong_dcid.png)

If you provide an empty cell for a DCID, the `=DCPLACESIN(dcids, placeType)` formula returns a value of #ERROR!, as shown show in the following image:

![alt_text](/assets/images/sheets/sheets_places_in_no_input.png)

Finally, if you provide an invalid property to the `=DCPLACESIN(dcids, placeType)` formula, an error of #REF! is also returned, as follows:

![alt_text](/assets/images/sheets/sheets_places_in_bad_property.png)

