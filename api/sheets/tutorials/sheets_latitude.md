---
layout: default
title: Sheets South American latitudes
parent: Tutorials
parent_url: /api/sheets/tutorials
grand_parent: Google Sheets
grand_parent_url: /api/sheets
show_in_nav: false
---

# Obtain latitude information for country capitals in South America

## Introduction
The Data Commons Sheets add-on allows you to obtain basic information about the entities in the knowledge graph by retrieving their properties. This tutorial walks you through the `DCPROPERTY` function that enables this.

## Step 1: Setup
Pull up Google Sheets and create a new, blank spreadsheet. You can title it `Data Commons South American capitals’ latitude` or any other name of your choosing.

![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_1.png)

To enable the Data Commons API in your spreadsheet, ensure that the Data Commons extension is installed and available under the **Extensions** menu. Hover over the **Data Commons** menu item, then click on the **Fill place DCIDs** option.

 ![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_2.png)

## Step 2: Retrieve place names and DCIDs
Double-click on the A1 cell and enter [`southamerica`](https://datacommons.org/browser/southamerica) (the DCID for the continent of South America).

![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_3.png)

To obtain the DCIDs for all the countries, you can use the add-on function [`DCPLACESIN`](/api/sheets/places_in.html). In cell B1, type `=DCPLACESIN(A1, "Country")`. Sheets provides pointers to help guide your function inputs. Your spreadsheet output should look like this:

![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_4.png)

Next, you’ll want to retrieve the country names and position them conveniently near these DCIDs. You can use the addon-on function [`DCGETNAME`](/api/sheets/get_name.html) to access this information. In cell C1, type `=dcgetname(B1:B)`. Your final output will look like this:

![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_5.png)

## Step 3: Populate the spreadsheet with capital and latitude information
In this step, you will obtain all South American countries’ capitals and latitudes. To do this, you will need to get the value of the property names [`latitude`](https://datacommons.org/browser/latitude) and [`administrativeCapital`](https://datacommons.org/browser/administrativeCapital) for each country on the date specified. (As an aside, if you'd like to see what properties are available for any given entity, Data Commons provides a [Knowledge Graph](https://datacommons.org/browser) tool enabling you to look up any entity in the graph and view its associated properties.) You can use the [`DCPROPERTY`](/api/sheets/get_property.html) method to do this.

In cell D1, `=DCPROPERTY(B1:B, "administrativeCapital")`. Your output should look like this:

![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_6.png)

Now, to get the latitude of each capital, in cell E1, type `=DCPROPERTY(D1:D, "latitude")`.

![](/assets/images/sheets/tutorials/sheets_latitude_tutorial_7.png)

Finally, use the `DCGETNAME` function again, against column D, to get the names of the capitals. Try it yourself!