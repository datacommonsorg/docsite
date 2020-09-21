---
layout: default
title: Adding datasets
nav_order: 2
parent: Contributing to Data Commons
---

# Life of a dataset

This tutorial walks through the process of structuring and inserting data into the Data Commons graph.

# Option 1: constructing and submitting a TMCF/CSV pair

If you are seeking to contribute highly structured and already clean data to the Data Commons knowledge graph, consider contributing a TMCF/CSV file pair. Your CSV will contain the actual data added to the knowledge graph, while the TMCF will provide structured direction on converting the raw data to nodes (?) in the graph.

## Constructing the TMCF

### Naming your new statistical variables

If you are adding new types of data to the knowledge graph, you will likely need to define new [statistical variables](https://datacommons.org/browser/StatisticalVariable) for your entries. These statistical variables' names should tie pretty closely to the exact mathematical definition of the metric observed.

For example, consider a statistical variable intended to measure homeownership rates in a particular geographical area. To avoid confusion about the basic definition of the term _homeownership rate_, start with an equation or other precise formulation from a source of truth (like an academic or government source). For this example, you can use [the US Census Bureau's definition](https://www.census.gov/housing/hvs/definitions.pdf), which provides this formula:

![equation](https://latex.codecogs.com/gif.latex?\textup{homeownership&space;rate&space;(%)}&space;=&space;\frac{\textup{owner&space;occupied&space;housing&space;units}}{\textup{total&space;occupied&space;housing&space;units}}\times&space;100)

Once you've obtained this precise meaning, you can define your statistical variable appropriately. In this example, _Homeownership_Rate_ becomes _Count_HousingUnit_OwnerOccupied_AsFractionOf_Count_HousingUnit_OccupiedHousingUnit_.

###  Adding fields to your statistical variable definitions

Once you've named the variables you'll be adding to the graph, you need to add fields as appropriate. We require (...)

(example)

In addition to these required fields, you'll also want to add other fields further narrowing your statistical variable's definition. Here are some sample types of fields

(...)
(link to full list of fields that can be filled out)

### Building the TMCF

Step 1: Connecting statvarobservations to your stat vars
Step 2: Putting it together with arrows to spreadsheets

## Option 2: bypassing the TMCF and directly constructing the output MCF

(information and examples about biological data)