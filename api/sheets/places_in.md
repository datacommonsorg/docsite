---
layout: default
title: Places within a Place
nav_order: 5
parent: Google Sheets
grand_parent: API
---

# Retrieve places contained within another place

## `=DCPLACESIN(dcids, placeType)`

Given a list of [`Place`](https://datacommons.org/browser/Place) DCIDs, return the DCIDs of places of a specified type
contained within those places.

## Examples

**Arguments**
*   `dcids` - place DCIDs to get places within
*   `placeType` - The type of the contained `Place`s within the given
    DCIDs to filter by. E.g. `City` and `County` are contained within `State`. For a
    full list of available types, see [`subClassOf Place`](https://datacommons.org/browser/Place).

**Returns**

The dcids of type `placeType` contained within the place.

## Examples

To get all of the counties in the state of Hawaii:

```
=DCPLACESIN("geoId/15", "County")
```

The example below shows how to use the place DCID in an existing cell:

### Input

![](/assets/images/sheets/sheets_places_in_input.png)

### Output

![](/assets/images/sheets/sheets_places_in_output.png)
