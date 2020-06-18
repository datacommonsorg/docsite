---
layout: default
title: Get Node Property
nav_order: 7
parent: Google Sheets
grand_parent: API
---

# Get the values of a given property for a node.

## =DCPROPERTY(dcids, property)

Given a property DCID, together with a string DCID, a row of cells of DCIDs, or a column of cells of DCIDs, get the values of the given property for those DCIDs.

**Arguments**
*    `dcids` - DCIDs to get the properties of
*    `property` - property to get

**Returns**

The properties of the DCIDs. For a single DCID, the result is a column of properties. For a row of DCIDs, the result is a matrix where each column is the members of the DCID at the column's index. For a column of DCIDs, the result is a matrix where each row is the members of the DCID at the row's index.

## Examples

In this example, we find the `containedInPlace` of the Data Commons nodes for [California](https://browser.datacommons.org/kg?dcid=geoId/06) and [Mountain View](https://browser.datacommons.org/kg?dcid=geoId/0649670). The function call in the image uses a single call to get the names of both nodes, but it is equivalent to typing:

```
=TRANSPOSE(DCPROPERTY("geoId/06", "containedInPlace"))
```

and

```
=TRANSPOSE(DCPROPERTY("geoId/0649670", "containedInPlace"))
```

in cells B1 and B2 respectively.

### Input

![](/assets/sheets_get_property_input.png)

### Output

![](/assets/sheets_get_property_output.png)

