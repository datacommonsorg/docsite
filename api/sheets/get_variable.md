---
layout: default
title: Get Variable
nav_order: 6
parent: SHEETS
grand_parent: API
---

# Get the value of a statistical variable at a given place and time.

## =DCGET(dcids, variable, date)

Given a list of [Place](https://browser.datacommons.org/kg?dcid=Place) DCIDs, a [StatisticalVariable](https://browser.datacommons.org/kg?dcid=StatisticalVariable), and a date, get the measurements of that variable at those places on that date.

**Arguments**
*   `dcids` - place DCIDs
*   `variable` - The StatisticalVariable to get
*   `date` - The date to observe, e.g. 2017, "2017", "2017-12"

**Returns**

The value of the variable at those places on that date.

## Examples

To get the total population of Hawaii in 2017:

```
=DCGET("geoId/15", "TotalPopulation", 2017)
```

To get the population of multiple places with a single function call:

### Input

![](/assets/sheets_get_variable_input.png)

### Output

![](/assets/sheets_get_variable_output.png)
