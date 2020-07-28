---
layout: default
title: Get Node Name
nav_order: 4
parent: Google Sheets
grand_parent: API
---

# Get the name of a node.

## `=DCGETNAME(dcids)`

Given a cell or a column range of cells with DCIDs, return the names of those dcids.

**Arguments**
*    `dcids` - DCIDs to get the names of

**Returns**

The names of the DCIDs

## Examples

In this example, we find the names of the Data Commons nodes for [California](https://datacommons.org/browser/geoId/06) and [Alameda County](https://datacommons.org/browser/geoId/06001). The function call in the image uses a single call to get the names of "geoId/06" and "geoId/06001", but it is equivalent to typing:

```
=DCGETNAME("geoId/06")
```

and

```
=DCGETNAME("geoId/06001")
```

in cells B2 and B3 respectively.

### Input

![](/assets/images/sheets/sheets_get_name_input.png)

### Output

![](/assets/images/sheets/sheets_get_name_output.png)

