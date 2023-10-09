---
layout: default
title: Retrieving Places Contained Within Another Place
nav_order: 2
parent: Google Sheets
grand_parent: API
---

# Retrieving Places Contained Within Another Place

The `=DCPLACESIN(dcids, placeType)` formula returns lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](https://docs.datacommons.org/glossary.html), such as [State](https://datacommons.org/browser/State), [Country](https://datacommons.org/browser/Country), and so on. It only returns children with a place type that matches the <code>placeType</code> parameter.

> **Note**
> 
> Be sure to follow the instructions for [Installing and Enabling the Sheets Add-On](/api/sheets/) before using this formula.

## Formula {#formula}

```
=DCPLACESIN(dcids, placeType)
```

## Required Arguments {#required-arguments}

* `dcids`: A list of (parent) `Place` nodes, identified by their DCIDs.
* `placeType`: The type of the contained (child) `Place` nodes to filter by. For example,`City` and `County`are contained within `State`. For a full list of available types, see [the Data Commons graph browser entry for Place](https://datacommons.org/browser/Place).

## Returns

Lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](https://docs.datacommons.org/glossary.html), such as [State](https://datacommons.org/browser/State), [Country](https://datacommons.org/browser/Country), and so on. It only returns children with a place type that matches the <code>placeType</code> parameter.

> **Note**:
> It’s best to minimize the number of function calls to `=DCPLACESIN(dcids, placeType)` by using a single call to get the names for a column of nodes. This is because a spreadsheet will make one call to a Google server [*per custom function call*](https://developers.google.com/apps-script/guides/sheets/functions#optimization). If your sheet contains many thousands of separate calls to `=DCPLACESIN(dcids, placeType)` you can expect it to be slow and return with errors.

## Examples

This section contains examples of using the `=DCPLACESIN(dcids, placeType)` formula to return lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](/glossary.html), such as [State](https://datacommons.org/browser/State), [Country](https://datacommons.org/browser/Country), and so.

### Example 1: Retrieve a List of Counties in Delaware

To retrieve a list of counties in Delaware, perform the following steps:

1. Place your cursor in the cell where you want to add the DCID for Delaware. In this case, cell A1.
2. Enter the Delaware DCID of “geoId/10”.
3. In cell B1, enter `DCGETNAME(A1)` to retrieve Delaware's name from the DCID in cell A1.
4. Move to the cell C3 and enter the formula `=DCPLACESIN(A1, "County")` to retrieve the county names and press **Enter**. The DCIDs for the three Delaware counties populate column C.
5. Retrieve the Delaware county names by entering the formula `=DCGETNAME(C1:C3)` into cell D1.

![alt_text](/assets/images/sheets/sheets_places_in_counties_in_delaware.png)

### Example 2: Retrieve Congressional Districts in Alaska and Hawaii

To retrieve the congressional districts in Alaska and Hawaii, perform the following steps:

1. In cell A1, enter **geoId/02** for the DCID of Alaska and in Cell A2, enter **geoId/15** for the DCID of Hawaii.
2. Enter `=DCGETNAME(A1:A2)` in cell B1 to retrieve the names of Alaska and Hawaii into column B.
3. Retrieve the DCIDs for the congressional districts by enter `=DCPLACESIN(A1:A2, "CongressionalDistrict")` into cell C1.
4. Finally, retrieve the names of the congressional districts by entering `=DCGETNAMES(C1:C3)` into cell D1.

![alt_text](/assets/images/sheets/sheets_places_in_congressional_districts_ak_hi.png)

## Error Returns

The `=DCPLACESIN(dcids, placeType)` formula returns names associated with given DCIDs to a cell or a column range of cells. See the Examples section above for examples of positive returns. If a DCID does not exist, the `=DCPLACESIN(dcids, placeType)` formula returns a value of #REF!. For example, the `=DCPLACESIN(A1, "CongressionalDistrict")` formula should return the congressional districts for the DCID in cell A1. However, because the “geoId/123123123” DCID does not exist, an error of #REF! is returned to cell B1 in the following sheet:

![alt_text](/assets/images/sheets/sheets_places_in_wrong_dcid.png)

If you provide an empty cell for a DCID, the `=DCPLACESIN(dcids, placeType)` formula returns a value of #ERROR!, as shown show in the following image:

![alt_text](/assets/images/sheets/sheets_places_in_no_input.png)

Finally, if you provide an invalid property to the `=DCPLACESIN(dcids, placeType)` formula, an error of #REF! is also returned, as follows:

![alt_text](/assets/images/sheets/sheets_places_in_bad_property.png)











