---
layout: default
title: Get statistical variable values
nav_order: 5
parent: Google Sheets
grand_parent: API
---

# Retrieve the value of a statistical variable at a given place and time

The`=DCGET` formula returns the measurements of a specified [statistical variable](/glossary.html#variable) at a given place and optional time based on a list of parent [place](https://datacommons.org/browser/Place){: target="_blank"} [DCIDs](/glossary.html#dcid). A complete list of variables can be found in the [Statistical Variable Explorer](https://datacommons.org/tools/statvar){: target="_blank"}.

## Formula

```
=DCGET(dcids, variable, [date])
```

### Required arguments

* `dcids`: A single [place](/glossary.html#place) node or range of cells represening place nodes, identified by their [DCIDs](/glossary.html#dcid).
* `variable`: The [statistical variable](/glossary.html#variable) whose measurements you want to query.

### Optional arguments

`date`: The date or dates of interest. If this argument is not specified, the API returns the latest variable observation. You can specify this argument as a single value, row, or column. All dates must be in ISO 8601 format (such as 2017, “2017”, “2017-12”) or as a Google sheets [date value](https://support.google.com/docs/answer/3092969?hl=en){: target="_blank"}.

## Returns

The value of the variable at those places on the specified date or on the latest available date, if no date is specified.

## Examples

This section contains examples of using the `=DCGET` formula to returns the values of [statistical variable](/glossary.html#variable)s such as `Count_Person` and `Median_Income_Person`. 

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Example 1: Get the total population of Hawaii in 2017

To get the total population of Hawaii in 2017:

1. Place your cursor in the desired cell.
1. Enter the formula `=DCGET("geoId/15", "Count_Person", 2017)`. The value `1425763` populates the cell.

### Example 2: Get the population of five Hawaii counties in 2017

To get the population of the five counties in 2017:

1. Place your cursor in the desired cell; in this case A2, and enter the DCID of Hawaii, namely `geoId/15`.
1. In cell B2, enter the formula `=DCPLACESIN(A2, "County")`. The DCIDs of the Hawaii counties populate column B.
1. (Optional) In cell C2, enter `=DCGETNAME(B2:B6)` to retrieve the names of the counties in column C.
1. In cell D2, enter the formula `=DCGET(B2:B6, "Count_Person", 2017)`.

    ![DCGET example](/assets/images/sheets/sheets_get_variable_input.png)

    The values populate column D.

    ![DCGET example](/assets/images/sheets/sheets_get_variable_output.png)

### Example 3: Get the median income of a single place in multiple years

This example shows how to get the median income in Hawaii for the years 2011 - 2013, with dates as columns:

1. In a new sheet, in row 1, create cells with the headings shown in the image below.
1. In cell A2, enter `Hawaii`, and in cell B2, `geoId/15`.
1. Select cells C2 to E2, and enter the formula `=DCGET(B2, "Median_Income_Person", C1:E1)`.

    ![DCGET example](/assets/images/sheets/sheets_get_variable_one_place_multiple_years_input.png)

    The values populate C2, D2 and E2.

    ![DCGET example](/assets/images/sheets/sheets_get_variable_one_place_multiple_years_output.png)

### Example 4: Get the median age of multiple places in multiple years

The following examples demonstrate how to retrieve the median age of five counties in Hawaii for the years 2011 - 2015. 

To get the results with the counties in rows and the dates in columns, do the following:

1. In a new sheet, in row 1, create cells with the headings shown in the image below, with columns for each year 2011 to 2015.
1. In cell A2, enter `Hawaii`, and in cell B2, `geoId/15`.
1. In cell C2, enter the formula `=DCPLACESIN(, "County")`. The county DCIDs populate column C.
1. In cell D2, enter the formula `=DCGETNAME(C2:C6) `. The county names populate column D.
1. Place your cursor in cell E2 and enter the formula `=DCGET(C2:C6, "Median_Age_Person", E1:I1)`. The ages for each county and year appear in columns E to I.  

![DCGET example](/assets/images/sheets/sheets_get_variable_places_column_years_row_output.png)

To get the results with the counties in columns and the dates in rows, do the following:

1. In a new sheet, in column A, create cells with the headings shown in the image below.
1. In cell B1, enter `Hawaii`, and in cell B2, `geoId/15`
1. Manually enter the DCIDs for each county, in cells B3 to F3, as shown in the image below.
1. Place your cursor in cell B4 and enter the formula `=DCGETNAME(B3:F3) `. The county names populate column D.
1. Place your cursor in cell B5 and enter the formula `=DCGET(B3:F3, "Median_Age_Person", A5:A9)`. 

    ![DCGET example)](/assets/images/sheets/sheets_get_variable_places_row_years_column_input.png)

    The ages for each county and year appear in rows 5 to 9.

    ![DCGET example](/assets/images/sheets/sheets_get_variable_places_row_years_column_output.png)

## Error responses

The `=DCGET` formula returns a blank value under the following circumstances:

* A DCID does not exist (e.g. `geoId/123123123`)
* You provide a nonexistent statistical variable (e.g. `Count`)
* You provide an incorrectly formatted date (e.g. `July 12, 2013`)

For example, because the `geoId/123123123` DCID does not exist, no value is returned to cell B1 in the following sheet for the formula `=DCGET(A1, "Count_Person")`:

![No value is returned to cell B1 in the following sheet for the formula `=DCGET(A1, "Count_Person")` because the DCID does not exist](/assets/images/sheets/sheets_get_variable_nonexistent_dcid.png)

If you fail to provide all required arguments, you will receive an error:

![Error returned if you fail to provide all required arguments](/assets/images/sheets/sheets_get_variable_incorrect_args.png)

