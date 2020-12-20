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

**Signature**: `=DCPROPERTY(dcids, property)`

**Required arguments**:

*   `dcids`: A list of nodes to query, identified by their Data Commons identifiers.
*   `property`: The property to query for.

## Assembling the information you will need for a call to this method

Going into more detail on how to assemble the values for the required arguments:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest. More information about DCIDs is available in [the glossary](/glossary.html).

 - `property`: The property whose value you are interested in, such as "name" for the name of a node, or "typeOf" for the type of a node.

## Example requests and responses

### Example 1: Retrieve the common names of the country of Côte d'Ivoire.

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