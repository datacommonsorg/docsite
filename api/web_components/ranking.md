---
layout: default
title: Ranking chart
nav_order: 7
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/ranking
---

# Data Commons ranking chart Web Component

[Data Commons Web Component](/api/web_components/) for listing statistical variables around a single place in descending or ascending order.

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'contained-in')">
    Places in a Parent Place
  </button>
</div>

```html
<datacommons-ranking
  header="US States with the Highest Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
></datacommons-ranking>
```
{: #contained-in .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name           | Type   | Description                                                                                                                                                                                                       |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| childPlaceType | string | Child place types to plot. Example: `State`. For a list of available place types, see the [place types page](/place_types.html).                                                                                                                                                                      |
| header         | string | Chart title.                                                                                                                                                                                                      |
| parentPlace    | string | Parent place [DCID](/glossary.html#dcid) to plot. Example: `country/USA`.                                                                                                                                         |
| variable       | string | Variable [DCID](/glossary.html#dcid) to plot.                                                                                                                                                                     |
| variables      | list   | A list of variable [DCID](/glossary.html#dcid)s to plot. Entries in the list should be separated by spaces. Example: `"dcid1 dcid2"`.<br /><br /><optional-tag>optional</optional-tag> if `variable` is provided. |
{: .doc-table }

### Optional

| Name              | Type    | Description                                                                                                                                                                                                                                                              |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| highestTitle      | string  | Chart title to show if `header` is not provided. Will only show if a highest-to-lowest ranking is shown.                                                                                                                                                                 |
| lowestTitle       | string  | Chart title to show if `header` is not provided. Will only show if a lowest-to-highest ranking is shown.                                                                                                                                                                 |
| perCapita         | list    | A list of variable [DCID](/glossary.html#dcid)s to rank by per capita value. Entries in the list should be separated by spaces. Example: `"dcid1 dcid2"`.                                                                                                                |
| rankingCount      | integer | How many places to show, e.g. the "N" in "Top-N".<br /><br />Default: `5`.                                                                                                                                                                                               |
| showHighestLowest | boolean | Include to show both the top and bottom places, ordered highest-to-lowest, in one chart.<br /><br />Default: `false`.                                                                                                                                                    |
| showLowest        | boolean | Include to sort values in ascending order. Ignored if `showHighestLowest` is true.                                                                                                                                                                                       |
| showMultiColumn   | boolean | Include to show variables across multiple columns in one table, with a header for each variable. The last variable provided is used for ranking.<br /><br />Default: false. If multiple variables are provided, a separate ranking table is generated for each variable. |
{: .doc-table }

### Advanced Configuration

| Name            | Type    | Description                                                                                                                                                      |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiRoot         | string  | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`.                       |
| hideFooter      | boolean | Include to hide footer with download link.<br /><br />Default: `false`.                                                                                          |
| showExploreMore | boolean | Include to show "Explore more" link in the footer, which takes the user to Datacommons.org's [visualization tools](https://datacommons.org/tools/map){: target="_blank"}. |
{: .doc-table }

## Examples

### Example 1: Show a ranking of US states by population, highest to lowest

Code:
{: .example-box-title}
```html
<datacommons-ranking
  header="US States with the Highest Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
></datacommons-ranking>
```
{: .example-box-content}

<datacommons-ranking
  header="US States with the Highest Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
></datacommons-ranking>


### Example 2: Show a ranking of US states by population, lowest to highest

Code:
{: .example-box-title}
```html
<datacommons-ranking
  header="US States with the Lowest Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
  showLowest
></datacommons-ranking>
```
{: .example-box-content}

<datacommons-ranking
  header="US States with the Lowest Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
  showLowest
></datacommons-ranking>

### Example 3: Show both highest and lowest US states by population

Code:
{: .example-box-title}
```html
<datacommons-ranking
  header="US States Ranking by Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
  showHighestLowest
></datacommons-ranking>
```
{: .example-box-content}

<datacommons-ranking
  header="US States Ranking by Population"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person"
  showHighestLowest
></datacommons-ranking>
