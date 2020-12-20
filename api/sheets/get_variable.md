---
layout: default
title: Get Variable
nav_order: 6
parent: Google Sheets
grand_parent: API
---

# Get the value of a statistical variable at a given place and time.

Given a list of [Place](https://datacommons.org/browser/Place) [DCIDs](/glossary.html), a [StatisticalVariable](https://datacommons.org/browser/StatisticalVariable), and optionally a date, get the measurements of the specified variable in the specified places with a date (if specified).

## General information about this endpoint

**Signature**: `=DCGET(dcids, variable, date)`

**Required Arguments**:

*   `dcids`: A list of (parent) `Place` nodes, identified by their DCIDs.

*   `variable` - The StatisticalVariable whose measurement is sought.

**Optional arguments**:

*   `date` - The date or dates of interest.

## Assembling the information you will need a request to the places within a place endpoint

This endpoint requires the arguments `dcids` and `variable`. [DCIDs](/glossary.html) are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the parent places of interest. You are also required to specify the [statistical variable](/glossary.html) whose measurement you seek. Statistical variables are the metrics tracked by Data Commons.

You may choose to specify the `date` argument. You may specify this argument as a single value, a row, or a column. All dates must be in ISO 8601 format (e.g. 2017, "2017", "2017-12") or as a Google sheets [date value](https://support.google.com/docs/answer/3092969?hl=en). If this argument is not specified, the API will return the latest observation of the variable.

**Returns**

The value of the variable at those places on the specified date (or on the latest available date, if no date is specified).

>  **NOTE:**
>
>  It's best to minimize the number of function calls to `DCGET` by using a single call to get a variable for a row/column of places and/or a column/row of times. This is because a spreadsheet will make one call to a Google server [per custom function call](https://developers.google.com/apps-script/guides/sheets/functions#optimization). If your sheet contains thousands of separate calls to `DCGET`, expect it to be slow.

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

## Examples

### Get the total population of Hawaii in 2017.

```
=DCGET("geoId/15", "Count_Person", 2017)
```

### Get the population of multiple places with a single function call.

#### Input

![](/assets/images/sheets/sheets_get_variable_input.png)

#### Output

![](/assets/images/sheets/sheets_get_variable_output.png)

### Get the population of a single place in multiple years.

#### Input

![](/assets/images/sheets/sheets_get_variable_one_place_multiple_years_input.png)

#### Output

![](/assets/images/sheets/sheets_get_variable_one_place_multiple_years_output.png)

### Get the median age of multiple places in multiple years.

With places as a column and dates as a row:

#### Input

![](/assets/images/sheets/sheets_get_variable_places_column_years_row_input.png)

#### Output

![](/assets/images/sheets/sheets_get_variable_places_column_years_row_output.png)

With places as a row and dates as a column:

#### Input

![](/assets/images/sheets/sheets_get_variable_places_row_years_column_input.png)

#### Output

![](/assets/images/sheets/sheets_get_variable_places_row_years_column_output.png)

## Error outputs

If you provide an invalid DCID, the API returns an error:

![](/assets/images/sheets/sheets_get_variable_nonexistent_dcid.png)

If you provide a nonexistent statistical variable, the API returns a blank value:

![](/assets/images/sheets/sheets_get_variable_nonexistent_statvar.png)

If you provide an invalidly formatted date, the API returns a blank value:

![](/assets/images/sheets/sheets_get_variable_incorrect_date.png)

If you fail to provide all required arguments, you will receive an error:

![](/assets/images/sheets/sheets_get_variable_incorrect_args.png)