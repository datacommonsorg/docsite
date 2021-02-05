---
layout: default
title: COVID-19 Analysis With Sheets
nav_order: 2
parent: Tutorials
---

# Using Data Commons' Google Sheets API to analyze the COVID-19 pandemic

## Introduction
Throughout the ongoing COVID-19 pandemic, engineers at Google have been working to upload COVID-19 data as it becomes available, helping public and private sector analysts create evidence-based policy to combat the public health crisis. This tutorial presents an example of how to obtain this data from the Data Commons API and use Google Sheets for visualization of it.

## Step 1: Setup
Pull up Google Sheets and create a new, blank spreadsheet. You can title it `Data Commons COVID-19 analysis` or any other name of your choosing.

![](/assets/images/tutorials/sheets_covid_tutorial_1.png)

To enable the Data Commons API in your spreadsheet, ensure that the Data Commons extension is installed and available under the Extensions tab in the main menu. Hover over the Data Commons menu item, then click on the Fill Place DCIDs option.

![](/assets/images/tutorials/sheets_covid_tutorial_2.png)

A menu should pop up on the right side of the Sheets web application. Type the name of any place desired; its DCID should populate into the A1 entry of the chart.

![](/assets/images/tutorials/sheets_covid_tutorial_3.png)

Next, double-click on A1 in the chart and type `country/USA`.

![](/assets/images/tutorials/sheets_covid_tutorial_4.png)

## Step 2: Retrieving place names and DCIDs from Data Commons
To obtain the DCIDs for all the states, you can use the plugin function `DCPLACESIN`. Type `=DCPLACESIN(A1, "State")` into cell B1. Sheets will provide pointers to help guide your function inputs. Your spreadsheet output should look like this:

![](/assets/images/tutorials/sheets_covid_tutorial_5.png)

Finally, you’ll want to retrieve the state names and position them conveniently near these DCIDs. You can use the plugin function `DCGETNAME` to access this information. Type `=DCGETNAME(B1)` in cell C1, then click and drag to repeat this formula throughout the C column. Your final output should look like this:

![](/assets/images/tutorials/sheets_covid_tutorial_6.png)

## Step 3: Populating the spreadsheet with COVID information
In this tutorial, you will be analyzing each state’s cumulative count of deaths due to COVID as of December 15, 2020. To do this, you will need to get the value of the statistical variable `CumulativeCount_MedicalConditionIncident_COVID_19_PatientDeceased` for each state on the date specified. You can use the `DCGET` method to do this.

Type `=DCGET(B1, "CumulativeCount_MedicalConditionIncident_COVID_19_PatientDeceased", "2020-12-15")` into cell D1, then click and drag to repeat this formula throughout the D column. Your final output should look like this:

![](/assets/images/tutorials/sheets_covid_tutorial_7.png)

## Step 4: Visualizing the data
As a final step, you can use Google’s Geo Chart option to map this data! Select cell arrays C1:C52 and D1:D52, then click on the Chart option under Insert in the main menu. Your spreadsheet will look a bit like this:

![](/assets/images/tutorials/sheets_covid_tutorial_8.png)

Feel free to drag the histogram out of the way of the numbers! As a final step, under `Chart type` in the right sidebar, click on the map. Under the chart customization options, you can click on the `Geo` dropdown, then select the United States region to display your results. Your final sheet should look something like this:

![](/assets/images/tutorials/sheets_covid_tutorial_9.png)

If you’d like to experiment more with the data and methods from this tutorial, check out <https://docs.google.com/spreadsheets/d/1yK4YCpwF2AeiaVIfINXVHXw5O3BEjPyWnCSsqonfVBM/edit?usp=sharing>.

