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

### Required arguments

* `dcids`: A single [place](/glossary.html#place) node or range of cells representing place nodes, identified by their [DCIDs](/glossary.html#dcid).
* `place_type`: The type of the contained child place nodes to filter by. For example,`City` and `County`are contained within `State`. For a full list of available types, see the [place types page](/place_types.html).

### Returns

A list of child place DCIDs of the specified place DCIDs, of the specified place type.

## Examples

This section contains examples of using the `=DCPLACESIN` formula to return places contained in another place.

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Example 1: Retrieve a list of counties in Delaware

To retrieve a list of counties in Delaware:
1. Place your cursor in the cell where you want to add the DCID for Delaware; in this case, cell A2.
2. Enter the Delaware DCID of `geoId/10`.
3. (Optional) In cell B2, enter `DCGETNAME(A2)` to retrieve Delaware's name from the DCID in cell A2.
4. In cell C2, enter the formula `=DCPLACESIN(A2, "County")`. The DCIDs for the three Delaware counties populate column C.
5. In cell D2, enter the formula `DCGETNAME(C2:C4)` to retrieve the names of the counties. 

![DCPLACESIN example 1](/assets/images/sheets/sheets_places_in_counties_in_delaware.png)

### Example 2: Retrieve congressional districts in Alaska and Hawaii

To retrieve the congressional districts in Alaska and Hawaii:

1. In cell A2, enter `geoId/02` for the DCID of Alaska and in cell A3, enter `geoId/15` for the DCID of Hawaii.
2. (Optional) In cell B1, enter `=DCGETNAME(A2:A3)` to retrieve the names of Alaska and Hawaii into column B.
3. In cell C2, enter `=DCPLACESIN(A2:A3, "CongressionalDistrict")` to retrieve the DCIDs of the congressional districts.
4. In cell D2, enter `=DCGETNAMES(C2:C4)` to retrieve the names of the congressional districts.

![DCGETPLACESIN example 2](/assets/images/sheets/sheets_places_in_congressional_districts_ak_hi.png)

## Error responses

If a DCID does not exist, the `=DCPLACESIN` formula returns a value of `#REF!`. For example, because the `geoId/123123123` DCID does not exist, an error of `#REF!` is returned to cell B1 in the following sheet:

![DCPLACESIN error example](/assets/images/sheets/sheets_places_in_wrong_dcid.png)

If you provide an empty cell for a DCID, the `=DCPLACESIN` formula returns a value of `#ERROR!`, as shown show in the following image:

![DCPLACESIN error example](/assets/images/sheets/sheets_places_in_no_input.png)

Finally, if you provide an invalid property to the `=DCPLACESIN` formula, an error of `#REF!` is also returned, as follows:

![DCPLACESIN error example](/assets/images/sheets/sheets_places_in_bad_property.png)

