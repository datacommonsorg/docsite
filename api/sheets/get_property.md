---
layout: default
title: Get Node Property
nav_order: 7
parent: Google Sheets
grand_parent: API
---

# Retrieve property values for nodes

Given a list of nodes and a property label, returns values associated with the given property for each node.

## General information about this endpoint

**Formula**: `=DCPROPERTY(dcids, property)`

**Required arguments**:

*   `dcids`: A list of nodes to query, identified by their Data Commons identifiers.
*   `property`: The property to query for.

## Assembling the information you will need for a call to this method

Going into more detail on how to assemble the values for the required arguments:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest. More information about DCIDs is available in [the glossary](/glossary.html).

 - `property`: The property whose value you are interested in, such as "name" for the name of a node, or "typeOf" for the type of a node. If you aren't sure what properties are available for a particular DCID, you can use the [Data Commons graph browser](https://datacommons.org/browser/) to look up the DCID of interest and see what properties it is associated with.

 **Returns**

The value of the property label for the specified DCIDs.

>  **NOTE:**
>
>  It's best to minimize the number of function calls to `DCPROPERTY` by using a single call to get a variable for a row/column of places and/or a column/row of times. This is because a spreadsheet will make one call to a Google server [per custom function call](https://developers.google.com/apps-script/guides/sheets/functions#optimization). If your sheet contains thousands of separate calls to `DCPROPERTY`, expect it to be slow.

## Example requests and responses

### Example 1: Retrieve the common names of a country by its `DCID`.

![](/assets/images/sheets/sheets_get_property_ivory_coast.png)

### Example 2: Retrieve the order to which the plant _Austrobaileya scandens_ belongs.

![](/assets/images/sheets/sheets_get_property_austrobaileyales_order.png)

### Example 3: Retrieve the addresses of Stuyvesant High School in New York and Gunn High School in California.

![](/assets/images/sheets/sheets_get_property_school_addresses.png)

## Error Returns

If you pass a nonexistent property, an empty value is returned:

![](/assets/images/sheets/sheets_get_property_bad_property.png)

If you pass a bad DCID, an empty value is returned:

![](/assets/images/sheets/sheets_get_property_bad_dcid.png)

If you pass an empty DCID, an error is returned:

![](/assets/images/sheets/sheets_get_property_empty_dcid.png)

If you do not pass a required positional argument, an error is returned:

![](/assets/images/sheets/sheets_get_property_bad_args.png)
