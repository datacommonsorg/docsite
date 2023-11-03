---
layout: default
title: Google Sheets
nav_order: 5
parent: API
has_children: true
---

# Data Commons Sheets API

The **Data Commons Sheets API** is a Google Sheets add-on that enables Google Sheets users to import data from the Data Commons knowledge graph. The add-on provides an interface for finding a location’s unique Data Commons identifier ([DCID](glossary.html#dcid)), and some custom functions for importing data into a spreadsheet.

> **Note:**
> For more information on DCIDs, refer to the entry for [DCID in the Glossary](/glossary.html#dcid).

Also read our [step-by-step guides](tutorials/) for more examples.

## Installing and Enabling the Sheets Add-On

Install and enable the Sheets add-on from Google Workspace Marketplace, as follows:

1. Install the Sheets add-on from the **[Google Workspace Marketplace](https://gsuite.google.com/marketplace/app/data_commons/454343067575)** .
2. Enable the Sheets add-on by clicking the Google Sheets **Extensions** menu, pointing to **Data Commons**, and then by clicking **Fill place dcids**.
3. Use the resulting sidebar that appears on the right side of the page to start finding DCIDs in the United States. You can close and reopen the sidebar at any time.

![Google Sheets menu bar](/assets/images/sheets/sheets_menu_bar.png)

> **Note:** None of the custom Data Commons Sheets functions (described below) will work in a given document until you have enabled the add-on by opening the **Fill place dcids** sidebar.

## Finding a Place’s DCID

Data Commons’ Sheets add-on provides the ability to look up a place’s [DCID](/glossary.html#dcid), within the application by using the **Fill place dcids** feature. To use this feature to find a place’s DCID:

1. Select the destination cell where you want to add a place’s DCID.
2. Click in the search box for the **Fill place dcids for selected cells** section on the right side of the page to start finding DCIDs in the United States.
3. Start typing the name of the place you are searching for. From the drop-down menu, select the place you want, and its DCID appears in the cell that you selected. For example, the following image shows the place names that match “Hawaii”.
   ![Google Sheets search box](/assets/images/sheets/sheets_search_box.png)

Note that this feature currently only supports places in the United States.

## Introduction to the Sheets API Custom Functions

The Data Commons Sheets API includes the five formulas listed in the following table. Click the links in the table for detailed information on each formula.

| **Formula**                                                                                  | **Description**                           |
|----------------------------------------------------------------------------------------------|-------------------------------------------|
| [=DCGETNAME(dcids)](/api/sheets/get_name.html)                 | Returns the names associated with a DCID. |
| [=DCPLACESIN(dcids)](/api/sheets/places_in.html)               | Returns child nodes                       |
| [=DCGET(dcids)](/api/sheets/get_variable.html)                 | Returns statistical variables.            |
| [=DCPROPERTY(dcids)](/api/sheets/get_property.html)            | Returns node property values.             |
| [=DCCOHORTMEMBERS(dcids)](/api/sheets/get_cohort_members.html) | Gets the cohort members of a node.        |

See the links in the preceding table to subsequent pages in this section for detailed descriptions of each API.

## Sorting your Results

To sort columns of data from the API, use Google Sheets “filter views” feature, which allows you to alphabetically and numerically sort and filter data

Take a look at the following video for a complete example:

<div>
<video width="960" height="520" controls>
  <source src="/assets/video/sort.webm" type="video/webm">
Your browser does not support the video tag.
</video>
</div>

The preceding video performs the following steps in a blank Sheets document:

1. Returns a list of DCIDs in column A that represent counties in California, using the formula <code><b>={"Place";DCPLACESIN(geoId/06", "County"}</b></code>.
2. Uses the DCIDs in column A to fill in the names of each county in column B using the <code><b>=DCGETNAME(A2)</b></code> formula.
3. Retrieves the population of the county in column C using the DCIDs in column A using the <code><b>=DCGET(A2, "Count_Person")</b></code> formula.
4. Highlights the entire sheet and click <strong>Data</strong> menu, <strong>Filter views</strong>, then <strong>Create new filter</strong>, or click the <strong>Create a filter</strong> icon on the toolbar.
5. Next, the filter is sorted by the <strong>Population</strong> column from <strong>A-Z</strong> and then from <strong>Z-A</strong>. The same sorts are then performed on the <strong>Name</strong> column.

To summarize, the steps for sorting Data Commons results with Google Sheets filter view feature are:

1. Populate the data columns with Data Commons Sheets API formulas.
2. Turn on filter views by clicking the **Data** menu, **Filter views**, then **Create new filter view**, or by clicking the **Create a filter** icon on the toolbar
3. Click the reverse triangle on each column to sort, excluding the header row.

