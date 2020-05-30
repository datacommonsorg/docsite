---
layout: default
title: Get Variable
nav_order: 6
parent: Google Sheets
grand_parent: API
---

# Get the value of a statistical variable at a given place and time.

## =DCGET(dcids, variable, date)

Given a list of [Place](https://browser.datacommons.org/kg?dcid=Place) DCIDs, a [StatisticalVariable](https://browser.datacommons.org/kg?dcid=StatisticalVariable), and a date, get the measurements of that variable at those places on that date.

**Arguments**
*   `dcids` - place DCIDs as a single value, a row, or a column
*   `variable` - The StatisticalVariable to get
*   `date` - The dates to observe, e.g. 2017, "2017", "2017-12". This can be a single value, a row, or a column.

`date` is optional. If it's not specified, the function returns the latest observation of the variable.

**Returns**

The value of the variable at those places on that date (or on the latest available date, if no date is specified).

## Examples

### Get the total population of Hawaii in 2017.

```
=DCGET("geoId/15", "TotalPopulation", 2017)
```

### Get the population of multiple places with a single function call.

#### Input

![](/assets/sheets_get_variable_input.png)

#### Output

![](/assets/sheets_get_variable_output.png)

### Get the population of a single place in multiple years.

#### Input

![](/assets/sheets_get_variable_one_place_multiple_years_input.png)

#### Output

![](/assets/sheets_get_variable_one_place_multiple_years_output.png)


### Get the median age of multiple places in multiple years.

With places as a column and dates as a row:

#### Input

![](/assets/sheets_get_variable_places_column_years_row_input.png)

#### Output

![](/assets/sheets_get_variable_places_column_years_row_output.png)

With places as a row and dates as a column:

#### Input

![](/assets/sheets_get_variable_places_row_years_column_input.png)

#### Output

![](/assets/sheets_get_variable_places_row_years_column_output.png)