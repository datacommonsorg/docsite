---
layout: default
title: Node Property
nav_order: 7
parent: Google Sheets
grand_parent: API
---

# Get the values of a given property for a node.

## `=DCPROPERTY(dcids, property)`

Given a property, together with a single DCID, a row of DCIDs, or a column of DCIDs, get the values of the given property for those DCIDs.

**Arguments**
*    `dcids` - DCIDs to get the property for
*    `property` - property to get

**Returns**

The properties of the DCIDs. For a single DCID, the result is a column of the given property's values for that DCID. For a row of DCIDs, the result is a matrix where each column contains the values of the given property for the DCID at the column's index. For a column of DCIDs, the result is a matrix where each row contains the values of the given property for the DCID at the row's index.

## Examples

In this example, we find the `containedInPlace` of the Data Commons nodes for [California](https://datacommons.org/browser/geoId/06) and [Mountain View](https://datacommons.org/browser/geoId/0649670). The function call in the image uses a single call to get the names of both nodes, but it is equivalent to typing:

```
=TRANSPOSE(DCPROPERTY("geoId/06", "containedInPlace"))
```

and

```
=TRANSPOSE(DCPROPERTY("geoId/0649670", "containedInPlace"))
```

in cells B1 and B2 respectively.

### Input

![](/assets/images/sheets/sheets_get_property_input.png)

### Output

![](/assets/images/sheets/sheets_get_property_output.png)

