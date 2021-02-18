---
layout: default
title: Sheets South American Latitudes
nav_order: 2
parent: Tutorials
---

# Obtaining latitude information for country capitals in South America

## Introduction
The Data Commons API enables end users to obtain basic information about the entities in the graph by retrieving their properties. This tutorial walks you through the `DCPROPERTY` method in the Sheets API that enables this. 

## Step 1: Setup
Pull up Google Sheets and create a new, blank spreadsheet. You can title it `Data Commons South American capitals’ latitude` or any other name of your choosing.

![](/assets/images/tutorials/sheets_latitude_tutorial_1.png)

To enable the Data Commons API in your spreadsheet, ensure that the Data Commons extension is installed and available under the Extensions tab in the main menu. Hover over the Data Commons menu item, then click on the Fill Place DCIDs option.

 ![](/assets/images/tutorials/sheets_latitude_tutorial_2.png)

## Step 2: Retrieving place names and DCIDs from Data Commons
Double-click on A1 in the chart and enter [`southamerica`](https://datacommons.org/browser/southamerica) (the DCID for the continent of South America).

![](/assets/images/tutorials/sheets_latitude_tutorial_3.png)

To obtain the DCIDs for all the countries, you can use the plugin function [`DCPLACESIN`](/api/sheets/places_in.html). Type `=DCPLACESIN(A1, "Country")` into cell B1. Sheets will provide pointers to help guide your function inputs. Your spreadsheet output should look like this:

![](/assets/images/tutorials/sheets_latitude_tutorial_4.png)

Next, you’ll want to retrieve the country names and position them conveniently near these DCIDs. You can use the plugin function [`DCGETNAME`](/api/sheets/get_name.html) to access this information. Type `=dcgetname(B1:B)` in cell C1. Your final output will look like this:

![](/assets/images/tutorials/sheets_latitude_tutorial_5.png)

## Step 3: Populating the spreadsheet with capital and latitude information
In this step, you will obtain all South American countries’ capitals and latitudes. To do this, you will need to get the value of the property names `latitude` and [`administrativeCapital`](https://datacommons.org/browser/administrativeCapital) for each country on the date specified. (As an aside, if you'd like to see what properties are available for any given entity, Data Commons provides a [graph browser](https://datacommons.org/browser) tool enabling you to look up any entity in the graph and view its associated properties.) You can use the [`DCPROPERTY`](/api/sheets/get_property.html) method to do this.

Type `=DCPROPERTY(B1:B, "administrativeCapital")` into cell D1. Your output should look like this:

![](/assets/images/tutorials/sheets_latitude_tutorial_6.png)

Now, to get the latitude of each capital, type `=DCPROPERTY(D1:D, "latitude")` into cell E1.

![](/assets/images/tutorials/sheets_latitude_tutorial_7.png)

If you’d like to experiment more with the data and methods from this tutorial, check out <https://docs.google.com/spreadsheets/d/1AYOD9yX59aKNNHoLLsmy00uihU72EKDFDZVo5KdX7H0/edit#gid=0>. You can clone the sheet by clicking on the File dropdown, then choosing the 'Make a copy' option. Note that you will need to enable the Sheets API as in Step 1 to retrieve the data for analysis.
