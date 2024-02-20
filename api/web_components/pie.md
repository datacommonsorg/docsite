---
layout: default
title: Pie Chart
nav_order: 6
parent: Web Components
grand_parent: API
published: true
permalink: /api/web_components/pie
---

# Data Commons Pie Chart Web Component

[Data Commons Web Component](/api/web_components/) for visualizing multiple statistical variables around a single place on a pie/donut chart.

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'single-place')">
    Specific Place
  </button>
</div>

```html
<datacommons-pie
  header="Chart title"
  place="place_dcid"
  variables="variable_dcid_1 variable_dcid_2 variable_dcid_3"
></datacommons-pie>
```
{: #single-place .api-tabcontent .api-signature}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name      | Type   | Description                                                                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| header    | string | Chart title.                                                                                                                 |
| place     | string | Places [DCID](/glossary.html#dcid) to plot.                                                                                  |
| variables | list   | Variable [DCID](/glossary.html#dcid)(s) to plot, as a space separated list of strings. Example: `"Count_Person Count_Farm"`. |
{: .doc-table }

### Optional

| Name      | Type    | Description                                                                                                                                                                                                                                                                                                                                                             |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors    | list    | Specify custom color for each variable. Pass in colors in the same order as variables.<br /><br />Values should follow CSS specification (keywords, rgb, rgba, hsl, #hex). Separate multiple values with spaces, e.g., `"#ff0000 #00ff00 #0000ff"`. Make sure individual colors have no spaces. For example, use `rgba(255,0,0,0.3)` instead of `rgba(255, 0, 0, 0.3)`. |
| donut     | boolean | Include to draw as a donut chart instead of a pie chart.                                                                                                                                                                                                                                                                                                                |
| subheader | string  | Text to add under the header.                                                                                                                                                                                                                                                                                                                                           |
{: .doc-table }

### Advanced Configuration

| Name    | Type   | Description                                                                                                                                |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| apiRoot | string | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`. |
{: .doc-table }

## Examples

### Example 1: Multiple variables for a single place

Show the split of median income by gender in California as a pie chart.

Code:
{: .example-box-title}
```html
<datacommons-pie
  header="Median Income by gender in California"
  place="geoId/06"
  variables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
></datacommons-pie>
```
{: .example-box-content}

<datacommons-pie
  header="Median Income by gender in California"
  place="geoId/06"
  variables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
></datacommons-pie>

### Example 2: Multiple variables for a single place, as a donut chart

Show the split of median income by gender in California as a donut chart.

Code:
{: .example-box-title}
```html
<datacommons-pie
  header="Median Income by gender in California"
  place="geoId/06"
  variables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
  donut
></datacommons-pie>
```
{: .example-box-content}

<datacommons-pie
  header="Median Income by gender in California"
  place="geoId/06"
  variables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
  donut
></datacommons-pie>
