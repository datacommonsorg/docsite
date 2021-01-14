---
layout: default
title: Google Sheets
nav_order: 6
parent: API
has_children: true
---
# Data Commons Sheets API

The **Data Commons Sheets API** is a Google Sheets add-on that enables Google Sheets
users to import data from the Data Commons knowledge graph. The add-on provides an
interface for finding the dcid of a location, as well as some custom functions for
importing data to a spreadsheet.

## Getting started

Install the add-on from [G Suite Marketplace](https://gsuite.google.com/marketplace/app/data_commons/454343067575). To enable the add-on in a document, click "Add-ons > Data Commons > Fill place dcids". You may use the resulting sidebar to start [finding dcids](/api/sheets/get_dcid.html) in the United States, or close it and reopen it at any time. Note that none of the custom functions will work in a given document until you have enabled the add-on by choosing "Fill place dcids".


![](/assets/images/sheets/sheets_menu_bar.png)

## Finding a place's DCID

Data Commons' Sheets add-on ships with the ability to look up a location's [DCID](/glossary.html), or unique Data Commons identifier, within the application. To use this feature, select the final destination cell of the place [DCID](/glossary.html). Go to the Sheets menu bar, and click:

**"Add-ons > Data Commons > Fill place dcids"**

![](/assets/images/sheets/sheets_menu_bar.png)

A sidebar will appear on the right of the sheet, with a search bar where you can start typing the name of the place you want. From the drop down menu, select the place you want, and its [DCID](/glossary.html) will appear in the cell that you selected.

![](/assets/images/sheets/sheets_search_box.png)

Note that this feature only supports places in the United States.

**Sorting your results**

<p>To sort columns of data from the API, we suggest using the "filter views" Google Sheet feature.

<p>Please check the following video for a complete example:</p>

<video width="960" height="520" controls>
  <source src="/assets/video/sort.webm" type="video/webm">
Your browser does not support the video tag.
</video>

<p>To summarize, the steps are:</p>

<ul>
<li>Populate data columns with DataCommons Sheets API</li>
<li>Turn on filter views (Data > Filter views).</li>
<li>Click the reverse triangle on each column to sort by that column (and exclude header row).</li>
</ul>