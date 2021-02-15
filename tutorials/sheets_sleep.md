---
layout: default
title: Sheets CDC 500 Sleep Sorting
nav_order: 2
parent: Tutorials
---

# Sorting the CDC 500 cohort on sleep 

## Introduction

The Data Commons API enables easy access to health data for the 500 cities the CDC has prioritized for public health information tracking. This tutorial will walk you through accessing and analyzing that information and scoring each of the cities according to adults residents’ excellence in sleep habits.

## Step 1: Setup
Pull up Google Sheets and create a new, blank spreadsheet. You can title it `Data Commons CDC 500 sleep analysis` or any other name of your choosing.

![](/assets/images/tutorials/sheets_sleep_tutorial_1.png)

To enable the Data Commons API in your spreadsheet, ensure that the Data Commons extension is installed and available under the Extensions tab in the main menu. Hover over the Data Commons menu item, then click on the Fill Place DCIDs option.

![](/assets/images/tutorials/sheets_sleep_tutorial_2.png)

Next, double-click on A1 in the chart and type `CDC500_City`.

![](/assets/images/tutorials/sheets_sleep_tutorial_3.png)

## Step 2: Get the DCIDs and names of cohort members
Data Commons provides the method `DCCOHORTMEMBERS` for obtaining the members of a Data Commons cohort. Here, you’ll use this method to retrieve the cities in the CDC 500 cohort. In cell B1, type `=DCCOHORTMEMBERS(A1)`. The output should look like this:

![](/assets/images/tutorials/sheets_sleep_tutorial_4.png)

To get the names of these cities, type `=DCGETNAME(B1:B500)` into cell C1. The output should look like this:

![](/assets/images/tutorials/sheets_sleep_tutorial_5.png)

## Step 3: Obtain the sleep health level for each city.
We will use the percentage of chronically restless residents in each city to determine using the `DCGET` method with the statistical variable `Percent_Person_SleepLessThan7Hours`. (More information on statistical variables is available in the glossary. Note that this is one of quite a number of statistical variables that can be measured for the CDC 500.) Type `=DCGET(B1:B500, "Percent_Person_SleepLessThan7Hours", "2016")` into cell D1 in your spreadsheet. The output should look like this:

![](/assets/images/tutorials/sheets_sleep_tutorial_6.png)

## Step 4: Sort on sleep score.
Data Commons has made a tutorial on sorting in Sheets available at <https://docs.datacommons.org/api/sheets/sort.html>. Follow the example in the video to sort your spreadsheet on the F column. Your final output should look like this:

![](/assets/images/tutorials/sheets_sleep_tutorial_7.png)

Note the added headers and resized column widths for increased clarity. Also, if you’re experiencing slow sorting in the sheet, consider replacing the method calls in the C and D columns with their values. To do this, copy the columns, then paste by value only into their original locations in the spreadsheet.

To further explore data from this tutorial, check out https://docs.google.com/spreadsheets/d/1aSilceR2fZR-pTfMuilGebg9yDzOiR993bCtAk7GwlI/edit?usp=sharing