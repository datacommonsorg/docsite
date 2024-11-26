---
layout: default
title: Gauge chart
nav_order: 2
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/gauge
---

# Data Commons gauge chart Web Component

[Data Commons Web Component](/api/web_components/) for visualizing a single statistical variable about a single place.

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'single-place')">
    Specific Place
  </button>
</div>

```html
<datacommons-gauge
  header="Title here"
  place="place_dcid"
  variable="variable_dcid"
  min="0"
  max="100"
></datacommons-gauge>
```
{: #single-place .api-tabcontent .api-signature}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name     | Type   | Description                                   |
| -------- | ------ | --------------------------------------------- |
| header   | string | Chart title.                                  |
| max      | number | Gauge maximum value.                          |
| min      | number | Gauge mininmum value.                         |
| place    | string | Place [DCID](/glossary.html#dcid) to plot.    |
| variable | string | Variable [DCID](/glossary.html#dcid) to plot. |
{: .doc-table }

### Optional

| Name   | Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors | list | Optionally specify a custom chart color scheme for the display variable. Will interpolate colors linearly depending on how many are passed in.<br /><br />Values should follow CSS specification (keywords, rgb, rgba, hsl, #hex). Separate multiple values with spaces, e.g., `"#ff0000 #00ff00 #0000ff"`. Make sure individual colors have no spaces. For example, use `rgba(255,0,0,0.3)` instead of `rgba(255, 0, 0, 0.3)`. |
{: .doc-table }

### Advanced Configuration

| Name    | Type   | Description                                                                                                                                |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| apiRoot | string | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`. |
{: .doc-table }

## Examples

### Example 1: Show percentage of US population that are internet users

Code:
{: .example-box-title}
```html
<datacommons-gauge
  header="Percentage of US Population that are Internet Users"
  place="country/USA"
  variable="Count_Person_IsInternetUser_PerCapita"
  min="0"
  max="100"
></datacommons-gauge>
```
{: .example-box-content}

<datacommons-gauge
  header="Percentage of US Population that are Internet Users"
  place="country/USA"
  variable="Count_Person_IsInternetUser_PerCapita"
  min="0"
  max="100"
></datacommons-gauge>
