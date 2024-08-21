---
layout: default
title: Node Property Values
nav_order: 4
parent: Google Sheets
grand_parent: API
---

# Retrieving Node Property Values

The `=DCPROPERTY(dcids, property)` formula returns values associated with the given property [Place](/glossary.html#place) [DCIDs](/glossary.html#dcid).

> **Note**:
> Be sure to follow the instructions for [Installing and Enabling the Sheets Add-On](/api/sheets/) before using this formula.

## Formula

```
=DCPROPERTY(dcids, property)
```

### Required Arguments

* `dcids`: A list of [Place](/glossary.html#place) nodes, identified by their [DCIDs](/glossary.html#dcid).
* `property`: The property whose value you are interested in,  such as “name” for the name of a node, or “typeOf” for the type of a node. If you aren’t sure what properties are available for a particular DCID, you can use the [Data Commons Knowledge Graph](https://datacommons.org/browser/){: target="_blank"}.
  to look up the DCID of interest and see what properties it is associated with.

## Returns

The values of the property label for the specified DCIDs.

> **Note**:
> It’s best to minimize the number of function calls to `=DCPROPERTY(dcids, property)` by using a single call to get the names for a column of nodes. This is because a spreadsheet will make one call to a Google server [*per custom function call*](https://developers.google.com/apps-script/guides/sheets/functions#optimization){: target="_blank"}. If your sheet contains thousands of separate calls to `=DCPROPERTY(dcids, property)` you can expect it to be slow and return with errors.

## Examples

This section contains examples of using the `=DCPROPERTY(dcids, property)` to return values associated with the given property Place DCIDs.

### Example 1: Retrieve the Common Name of a Country by its DCID

To retrieve the name of a country by its DCID, perform the following steps:

1. Place your cursor in the cell where you want to add a DCID. In this case, cell A1.
2. Enter <code><b>country/CIV</b></code> for the country Ivory Coast.
3. Next, place your cursor in cell B2 and enter <code><b>=DCPROPERTY(A1, "name")</b></code> to retrieve the Ivory Coast country names in column B.
4. Note that the French and English spellings for Ivory Coast appear in column B.

![Retrieve the Common Name of a Country by its DCID](/assets/images/sheets/sheets_get_property_ivory_coast.png)

### Example 2: Retrieve the Order to which the Plant Austrobaileya Scandens Belongs

To retrieve the order to which the plant *Austrobaileya Scandens* belongs, perform the following steps:

1. Place your cursor in the cell where you want to add a DCID. In this case, cell A1.
2. Enter <code><b>dc/bsmvthtq89217</b></code> for the plant *Austrobaileya Scandens*.
3. Place your cursor in cell B2 and enter <code><b>=DCPROPERTY(A1, "order")</b></code>.
4. Note that the order *Austrobaileyales* appears in cell B2.

![Retrieve the Order to which the Plant Austrobaileya Scandens Belongs](/assets/images/sheets/sheets_get_property_austrobaileyales_order.png)

### Example 3: Retrieve the Addresses of Stuyvesant High School in New York and Gunn High School in California

To retrieve the addresses of Stuyvesant High School in New York and Gunn High School in California, perform the following steps:

1. Place your cursor in cell A1 and enter <code><b>nces/360007702877</b></code> for *Stuyvesant Hight School in New York*.
2. Place your cursor in cell A2 and enter <code><b>nces/062961004587</b></code> for *Gunn High School in California*.
3. Enter the formula <code><b>=DCPROPERTY(A1:A2, "address")</b></code> into cell B2 and the addresses of both high schools are populated in column B.

![Retrieve the Addresses of Stuyvesant High School in New York and Gunn High School in California](/assets/images/sheets/sheets_get_property_school_addresses.png)


## Error Responses

The `=DCPROPERTY(dcids, property)` returns the value of the property label for the specified DCIDs. See the Examples section above for examples of positive responses.

If you pass a nonexistent property, an empty value is returned. For example, because the “nonexistent property” does not exist, no value is returned to cell B1 in the following sheet:

![Google Sheets nonexistent property return](/assets/images/sheets/sheets_get_property_bad_property.png)

If you pass a bad DCID, an empty value is returned:

![Google Sheets empty value return](/assets/images/sheets/sheets_get_property_bad_dcid.png)

If you pass an empty DCID, an error is returned:

![Google Sheets empty DCID error return](/assets/images/sheets/sheets_get_property_empty_dcid.png)

If you do not pass a required property argument, an error is returned:

![Google Sheets return for missing required property argument](/assets/images/sheets/sheets_get_property_bad_args.png)

