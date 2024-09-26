---
layout: default
title: Get node property values
nav_order: 6
parent: Google Sheets
grand_parent: API
---

# Retrieve node property values

The `=DCPROPERTY` formula returns values associated with the given property for a single [place](/glossary.html#place) [DCID](/glossary.html#dcid) or list of places.

## Formula

```
=DCPROPERTY(dcids, property)
```

### Required arguments

* `dcids`: A single [place](/glossary.html#place) node or range of cells representing nodes, identified by their [DCIDs](/glossary.html#dcid).
* `property`: The label of the [property](/glossary.html#property) whose value you are interested in,  such as `name` for the name of a node, or `typeOf` for the type of a node. If you aren’t sure what properties are available for a particular DCID, you can use the [Data Commons Knowledge Graph](https://datacommons.org/browser/){: target="_blank"} to look up the DCID of interest and see what properties it is associated with.

## Returns

The values of the property label for the specified DCIDs.

## Examples

This section contains examples of using the `=DCPROPERTY` to return values associated with the given property.

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Example 1: Retrieve the common name of a country by its DCID

To retrieve the name of a country by its DCID:

1. Place your cursor in the cell where you want to add a DCID; in this case, cell A1.
2. Enter `country/CIV` for the country Ivory Coast.
3. Place your cursor in cell B2 and enter `=DCPROPERTY(A1, "name")` to retrieve the Ivory Coast country names in column B; note that the French and English spellings for Ivory Coast appear in column B.

![DCPROPERTY example](/assets/images/sheets/sheets_get_property_ivory_coast.png)

### Example 2: Retrieve the order to which a plant belongs

To retrieve the order to which the plant Austrobaileya Scandens belongs:

1. Place your cursor in the cell where you want to add a DCID; in this case, cell A1.
2. Enter `dc/bsmvthtq89217` for the plant Austrobaileya Scandens.
3. Place your cursor in cell B2 and enter `=DCPROPERTY(A1, "order")`. `Austrobaileyales` appears in cell B2.

![DCPROPERTY example](/assets/images/sheets/sheets_get_property_austrobaileyales_order.png)

### Example 3: Retrieve the addresses of two high schools

To retrieve the addresses of Stuyvesant High School in New York and Gunn High School in California:

1. Place your cursor in cell A1 and enter `nces/360007702877` for Stuyvesant Hight School in New York.
2. Place your cursor in cell A2 and enter `nces/062961004587` for Gunn High School in California.
3. Place your cursor in cell B2, and enter the formula `=DCPROPERTY(A1:A2, "address")`. The addresses of both high schools are populated in column B.

![DCPROPERTY example](/assets/images/sheets/sheets_get_property_school_addresses.png)


## Error responses

If you pass a nonexistent property, an empty value is returned. For example, because the “nonexistent property” does not exist, no value is returned to cell B1 in the following sheet:

![Google Sheets nonexistent property return](/assets/images/sheets/sheets_get_property_bad_property.png)

If you pass a bad DCID, an empty value is returned:

![Google Sheets empty value return](/assets/images/sheets/sheets_get_property_bad_dcid.png)

If you pass an empty DCID, an error is returned:

![Google Sheets empty DCID error return](/assets/images/sheets/sheets_get_property_empty_dcid.png)

If you do not pass a required property argument, an error is returned:

![Google Sheets return for missing required property argument](/assets/images/sheets/sheets_get_property_bad_args.png)

