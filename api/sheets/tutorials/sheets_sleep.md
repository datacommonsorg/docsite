---
layout: default
title: Sheets CDC 500 cities sleep health
nav_order: 3
parent: Tutorials
parent_url: /api/sheets/tutorials
grand_parent: Google Sheets
grand_parent_url: /api/sheets
---

# Analyze the CDC 500 cities for sleep health

## Introduction

The Data Commons API enables easy access to health data for the 500 cities the U.S. Centers for Disease Control and Prevention (CDC) has prioritized for public health information tracking. This tutorial will walk you through accessing and analyzing that information and scoring each of the cities according to adults residents’ excellence in sleep habits, for the year 2020.

## Step 1: Setup
Pull up Google Sheets and create a new, blank spreadsheet. You can title it `Data Commons CDC 500 sleep analysis` or any other name of your choosing.

![](/assets/images/sheets/tutorials/sheets_sleep_tutorial_1.png)

To enable the Data Commons API in your spreadsheet, ensure that the Data Commons extension is installed and available under the **Extensions** menu. Hover over the **Data Commons** menu item, then click on the **Fill place DCIDs** option.

![](/assets/images/sheets/tutorials/sheets_sleep_tutorial_2.png)

## Step 2: Get the DCIDs and names of cohort members
Data Commons provides the method [`DCCOHORTMEMBERS`](https://docs.datacommons.org/api/sheets/get_cohort_members.html) for obtaining the members of a Data Commons cohort. Here, you’ll use this method to retrieve the cities in the CDC 500 cohort. Start by double-clicking on A1 in the chart and enter `CDC500_City`.

![](/assets/images/sheets/tutorials/sheets_sleep_tutorial_3.png)

In cell B1, enter `=DCCOHORTMEMBERS(A1)`. The output should look like this:

![](/assets/images/sheets/tutorials/sheets_sleep_tutorial_4.png)

To get the names of these cities, enter `=DCGETNAME(B1:B500)` into cell C1. The output should look like this:

![](/assets/images/sheets/tutorials/sheets_sleep_tutorial_5.png)

## Step 3: Obtain the sleep health level for each city
We will use the percentage of chronically restless residents in each city using the `DCGET` method with the statistical variable `Percent_Person_SleepLessThan7Hours`. (More information on statistical variables is available in the [glossary](https://docs.datacommons.org/glossary.html).) Enter `=DCGET(B1:B500, "Percent_Person_SleepLessThan7Hours", "2016")` into cell D1 in your spreadsheet. The output should look like this:

![](/assets/images/sheets/tutorials/sheets_sleep_tutorial_6.png){: width="600"}

## Step 4: Sort on sleep score

1. Select columns B, C, and D, and choose **Edit** > **Copy**.
1. Select **Insert** > **Sheet** to add a new sheet.
1. Select **Edit** > **Paste special** > **Values only**.
1. Select column C, click the down arrow, and select **Sort sheet Z to A**.

Your final output should look like this:

![sorted](/assets/images/sheets/tutorials/sheets_sleep_tutorial_7.png){: width="400"}
