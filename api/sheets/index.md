---
layout: default
title: Analyze data with Google Sheets
nav_order: 50
has_children: true
---

# Data Commons Sheets add-on

The Data Commons Google Sheets add-on allows you to import data from the Data Commons knowledge graph. The add-on provides an interface for finding a location’s unique Data Commons identifier ([DCID](glossary.html#dcid)), and several custom functions for importing data into a spreadsheet.

Read our [step-by-step guides](tutorials/) for examples on using the add-on for various analysis and visualization use cases.

## Install and enable the Sheets add-on {#install}

1. Go to the [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/data_commons/454343067575){: target="_blank"} page for Data Commons.
1. Click **Install**.
1. Open a new spreadsheet.
1. Select  **Extensions**  > **Data Commons** > **Fill place dcids**. 

> **Note:** None of the Data Commons Sheets functions will work in a spreadsheet until you have enabled the add-on by opening the **Fill place dcids** sidebar. You need to open the sidebar every time you reopen the Sheets application or create a new sheet.

## Find a place's DCID {#find-dcid}

The Data Commons Sheets add-on provides the ability to look up a place’s [DCID](/glossary.html#dcid) by using the **Fill place dcids** feature. To find a place’s DCID:

1. In Google Sheets, open a new or existing spreadsheet.
1. Select the destination cell where you want to add a place’s DCID.
1. Select  **Extensions**  > **Data Commons** > **Fill place dcids**. 

   ![Sheets menu bar](/assets/images/sheets/sheets_menu_bar.png)

1. In the **Fill place dcids for selected cells** sidebar that appears, start typing the name of the place you are searching for. 
1. From the drop-down menu, select the place you want, and its DCID appears in the cell that you selected. For example, the following image shows the place names that match “Hawaii”.

   ![Google Sheets search box](/assets/images/sheets/sheets_search_box.png)

## Data Commons Sheets functions

The Data Commons Sheets add-on includes the five formulas listed in the following table. Click the links in the table for detailed information on each formula. 

| **Formula**                                                                                  | **Description**                           |
|----------------------------------------------------------------------------------------------|-------------------------------------------|
| [=DCGETNAME(dcids)](/api/sheets/get_name.html)                 | Returns the names associated with a DCID. |
| [=DCPLACESIN(dcids, place_type)](/api/sheets/places_in.html)               |  Returns places contained in other places.                      |
| [=DCGET(dcids, variable_name, [date])](/api/sheets/get_variable.html)                 | Returns statistical observations.            |
| [=DCPROPERTY(dcids, property)](/api/sheets/get_property.html)            | Returns node property values.             |
| [=DCCOHORTMEMBERS(dcids)](/api/sheets/get_cohort_members.html) |  Returns the cohort members of a node.        |

You supply arguments as follows:
- A single value can be a string literal, such as `"geoId/05"` or `"County"` and must be enclosed quotation marks.
- Multiple values must be a range of cells (row or column), such as `A2:A5`, and are not enclosed in quotation marks..
See below for examples.

> **Note**: It’s always best to minimize the number of calls to Data Commons functions by using arguments containing a column or row of values. This is because a spreadsheet will make one call to a Google server [per function call](https://developers.google.com/apps-script/guides/sheets/functions#optimization){: target="_blank"}, so if your sheet contains thousands of separate calls to a function, it will be slow and return with errors.

## Get started with Data Commons functions

Here's a quick demo on using several of the Data Commons functions to get population data for all counties in the state of California.

1. Open a new sheet and create 3 column headings: `DCID`, `County name`, and `Population`.
1. Select cell A2 and enter the following formula to get a list of the DCIDs of all counties in California, whose DCID is `geoId/06`: `=DCPLACESIN("geoId/06", "County")`. The column fills with 58 DCIDs.
1. Select cell B2 and enter the following formula to get the names corresponding to all the DCIDs: `=DCGETNAME(A2:A59)`
1. Select cell C3 and enter the following formula to get the populations of each of the counties, using the statistical variable `Count_Person`: `=DCGET(A2:A59, "Count_Person")`

Your spreadsheet should now look like this:

![Sheets first demo](/assets/images/sheets/home_page_demo.png){: height="400"}

### Sort data

Because the Data Commons add-on does not actually store values, but only formulas, in a sheet, you can't directly sort the data. To sort the data, you need to copy it as values to a new sheet and then sort as usual:

1. Select all the columns in the sheet and select **Edit** > **Copy**.
1. Select **Insert** > **Sheet** to create a new sheet.
1. Select **Edit** > **Paste special** > **Values only**. You can now sort each column as desired.
