---
layout: default
title: Scatter plot
nav_order: 8
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/scatter
---

# Data Commons scatter plot chart Web Component

[Data Commons Web Component](/api/web_components/) for visualizing the relationship
between two variables.

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'contained-in')">
    Places in a Parent Place
  </button>
</div>

```html
<datacommons-TYPE
  parentPlace="parent_place_dcid"
  childPlaceType="type"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title"
></datacommons-TYPE>
```
{: #contained-in .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name           | Type   | Description                                                                                                                                                                                                         |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| childPlaceType | string | Child place types to plot. Example: `State`. For a list of available place types, see the [place types page](/place_types.html).                                                                                                                                                                        |
| header         | string | Chart title.                                                                                                                                                                                                        |
| parentPlace    | string | Parent place [DCID](/glossary.html#dcid) to plot. Example: `country/USA`.                                                                                                                                           |
| variables      | list   | Variable [DCID](/glossary.html#dcid)(s) to plot, as a space separated list of strings. Example: `"Count_Person Count_Farm"`. At least 2 variables must be provided, and only the first 2 variables will be plotted. |
{: .doc-table }

### Optional

| Name                 | Type    | Description                                                                                                              |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| highlightBottomLeft  | boolean | Include to label outliers in the bottom left quadrant. Defaults to `false`.                                              |
| highlightBottomRight | boolean | Include to label outliers in the bottom right quadrant. Defaults to `false`.                                             |
| highlightTopLeft     | boolean | Include to label outliers in the top left quadrant. Defaults to `false`.                                                 |
| highlightTopRight    | boolean | Include to label outliers in the top right quadrant. Defaults to `false`.                                                |
| showPlaceLabels      | boolean | Include to label all points with the place they correspond to.  Defaults to `false`.                                     |
| showQuadrants        | boolean | Include to show grid lines delimiting top right, top left, bottom right, and bottom left quadrants. Defaults to `false`. |
{: .doc-table }

### Advanced Configuration

| Name            | Type    | Description                                                                                                                                                      |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiRoot         | string  | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`.                       |
| placeNameProp   | string  | Optionally specify the property to use to get the place names.                                                                                                   |
| showExploreMore | boolean | Include to show "Explore more" link in the footer, which takes the user to Datacommons.org's [visualization tools](https://datacommons.org/tools/scatter){: target="_blank"}. |
{: .doc-table }

## Examples

### Example 1: Plot population vs median household income for US states

Code:
{: .example-box-title}
```html
<datacommons-scatter
  header="Population vs Median Household Income for US States"
  parentPlace="country/USA"
  childPlaceType="State"
  variables="Count_Person Median_Income_Household"
></datacommons-scatter>
```
{: .example-box-content}

<datacommons-scatter
  header="Population vs Median Household Income for US States"
  parentPlace="country/USA"
  childPlaceType="State"
  variables="Count_Person Median_Income_Household"
></datacommons-scatter>
