---
layout: default
title: Google Sheets
nav_order: 5
parent: API
has_children: true
---

# Data Commons Sheets add-on

The Data Commons Sheets is a Google Sheets add-on that allows you to import data from the Data Commons knowledge graph. The add-on provides an interface for finding a location’s unique Data Commons identifier ([DCID](glossary.html#dcid)), and several custom functions for importing data into a spreadsheet.

Read our [step-by-step guides](tutorials/) for examples on using the add-on for various analysis and visualization use cases.

## Install and enable the Sheets add-on

Install and enable the Sheets add-on from Google Workspace Marketplace, as follows:

1. Go to https://workspace.google.com/marketplace/app/data_commons/454343067575 and click **Install** .
1. Open a Google Sheets spreadsheet and select  **Extensions**  > **Data Commons** > **Fill place dcids**.
   ![Google Sheets menu bar](/assets/images/sheets/sheets_menu_bar.png)
1. In the right-hand sidebar that appears, start typing a place, and from the drop-down menu that appears, select the place.

> **Note:** None of the Data Commons Sheets functions (described below) will work in a given spreadsheet until you have enabled the add-on by opening the **Fill place dcids** sidebar.

## Find a place's DCID {#find-dcid}

Data Commons’ Sheets add-on provides the ability to look up a place’s [DCID](/glossary.html#dcid) by using the **Fill place dcids** feature. To use this feature to find a place’s DCID:

1. Open a new or existing spreadsheet.
1. Select the destination cell where you want to add a place’s DCID.
1. Select  **Extensions**  > **Data Commons** > **Fill place dcids**. 
1. In the **Fill place dcids for selected cells** sidebar that appears, start typing the name of the place you are searching for. 
1, From the drop-down menu, select the place you want, and its DCID appears in the cell that you selected. For example, the following image shows the place names that match “Hawaii”.
   ![Google Sheets search box](/assets/images/sheets/sheets_search_box.png)

## Data Commons Sheets functions

The Data Commons Sheets add-on includes the five formulas listed in the following table. Click the links in the table for detailed information on each formula.

| **Formula**                                                                                  | **Description**                           |
|----------------------------------------------------------------------------------------------|-------------------------------------------|
| [=DCGETNAME(dcids)](/api/sheets/get_name.html)                 | Returns the names associated with a DCID. |
| [=DCPLACESIN(dcids, place_type)](/api/sheets/places_in.html)               |  Returns places contained in other places.                      |
| [=DCGET(dcids, variable_name, [date])](/api/sheets/get_variable.html)                 | Returns statistical observations.            |
| [=DCPROPERTY(dcids, property)](/api/sheets/get_property.html)            | Returns node property values.             |
| [=DCCOHORTMEMBERS(dcids)](/api/sheets/get_cohort_members.html) |  Gets the cohort members of a node.        |

## Get started with Data Commons functions

Here's a quick demo on using several of the Data Commons functions to get data on population data for all counties in the state of California, whose DCID is `geoId/06`:

1. Open a new sheet and create 3 column headings: `DCID`, `County name`, and `Population`.
1. Select cell A2, and in the **fx** field, type the following formula to get a list of the DCIDs of all counties in California: `=DCPLACESIN("geoId/06", "County")`. The column fills with 58 DCIDs.
1. Select cell B2, and in the **fx** field, type the following formula to get the names corresponding to all the DCIDs: `=DCGETNAME(A2:A59)`.
1. Select C3, and in the **fix** field, type the following formula to get the populations of each of the counties: `=DCGET(A2:A59, "Count_Person")`

Your spreadsheet should now look like this:

![Sheets first demo](/assets/images/sheets/home_page_demo.png) {:height="400"}
