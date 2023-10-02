---
layout: default
title: Retrieving Child Nodes
nav_order: 2
parent: Google Sheets
grand_parent: API
---

# Retrieving Child Nodes

The `=DCPLACESIN(dcids, placeType)` formula returns lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](https://docs.datacommons.org/glossary.html), such as [State](https://datacommons.org/browser/State), [Country](https://datacommons.org/browser/Country), and so on. It only returns children with a place type that matches the <code>placeType</code> parameter.

> **Note**:
> Be sure to follow the instructions for Installing and Enabling the Sheets Add-On before using this formula.

## Formula {#formula}

```
=DCPLACESIN(dcids, placeType)
```

## Required Arguments {#required-arguments}

* `dcids`: A list of (parent) `Place` nodes, identified by their DCIDs.
* `placeType`: The type of the contained (child) `Place` nodes to filter by. For example,`City` and `County`are contained within `State`. For a full list of available types, see [the Data Commons graph browser entry for Place](https://datacommons.org/browser/Place).

## Examples {#examples}

This section contains examples of using the `=DCPLACESIN(dcids, placeType)` formula to return lists of child places from a list of parent [Place](https://datacommons.org/browser/Place) [DCIDs](https://docs.datacommons.org/glossary.html), such as [State](https://datacommons.org/browser/State), [Country](https://datacommons.org/browser/Country), and so.

### Example 1: Retrieve a List of Counties in Delaware

![alt_text](/assets/images/sheets/sheets_counties_delaware.png)

### Example 2: Retrieve Congressional Districts in Alaska and Hawaii

![alt_text](/assets/images/sheets/sheets_districts_alaska_hawaii.png)

