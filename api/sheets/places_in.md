---
layout: default
title: Places within a Place
nav_order: 5
parent: Google Sheets
grand_parent: API
---

# Retrieve places contained within another place

Given a list of parent [`Place`](https://datacommons.org/browser/Place) [DCIDs](/glossary.html),
(e.g. any [`State`](https://datacommons.org/browser/State), [`Country`](https://datacommons.org/browser/Country), etc.), return a list of child places
contained within the specified DCIDs. Only returns children whose place type matches
the request's `placeType` parameter.

## General information about this endpoint

**Formula**: `=DCPLACESIN(dcids, placeType)`

**Required Arguments**:

*   `dcids`: A list of (parent) `Place` nodes, identified by their DCIDs.

*   `placeType`: The type of the contained (child) `Place` nodes to filter by. For example, `City` and `County` are contained within `State`. For a
    full list of available types, see [the Data Commons graph browser entry for `Place`](https://datacommons.org/browser/Place).


## Assembling the information you will need a request to the places within a place endpoint

This endpoint requires the argument `dcids`. [DCIDs](/glossary.html) are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the parent places of interest.

This endpoint also requires the argument `placeType`, specifying the type of the child places you desire in the response.

## Examples

### Example 1: Retrieve a list of the counties in Delaware.

![](/assets/images/sheets/sheets_places_in_counties_in_delaware.png)

### Example 2: Retrieve a list of congressional districts in Alaska and Hawaii.

![](/assets/images/sheets/sheets_places_in_congressional_districts_ak_hi.png)

## Error Responses

If you pass a bad DCID value, you will see a reference error appear:

![](/assets/images/sheets/sheets_places_in_bad_dcid.png)

Likewise, if you pass a nonexistent place type, you will also see a reference error appear:

![](/assets/images/sheets/sheets_places_in_bad_place_type.png)

If you pass an empty DCID, an error will appear:

![](/assets/images/sheets/sheets_places_in_empty_cell.png)
