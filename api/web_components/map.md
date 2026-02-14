---
layout: default
title: Map chart
nav_order: 5
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/map
---

# Data Commons map chart Web Component

[Data Commons Web Component](/api/web_components) for visualizing a single statistical variables around one or more places on a map.

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'contained-in')">
    Places in a Parent Place
  </button>
</div>

```html
<datacommons-map
  header="Chart title"
  parentPlace="place_dcid"
  childPlaceType="place_type_dcid"
  variable="variable_dcid"
></datacommons-map>
```
{: #contained-in .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name           | Type   | Description                                                                                                                                      |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| childPlaceType | string | Child place types to plot. Example: `State`. For a list of available place types, see the [place types page](/place_types.html).<br /> <optional-tag>Optional</optional-tag> if `places` is specified.                              |
| header         | string | Chart title.                                                                                                                                     |
| parentPlace    | string | Parent place [DCID](/glossary.html#dcid) to plot. Example: `country/USA`. <br /> <optional-tag>Optional</optional-tag> if `places` is specified. |
| variable       | string | Variable [DCID](/glossary.html#dcid) to plot.                                                                                                    |
{: .doc-table }

### Optional

| Name      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowZoom | boolean | Include to allow zooming and panning using the mouse and show zoom-in and zoom-out buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| colors    | list    | List up to three colors to define a custom color scale.<br /><br />Values should follow CSS specification (keywords, rgb, rgba, hsl, #hex). Separate multiple values with spaces, e.g., `"#ff0000 #00ff00 #0000ff"`. Make sure individual colors have no spaces. For example, use `rgba(255,0,0,0.3)` instead of `rgba(255, 0, 0, 0.3)`.<br /><br /> - If one color is given: a luminance based color scale will be used<br /> - If two colors are given: a divergent color scale will be used, with the first color corresponding to the min value, and the second color corresponding to the max value.<br /> - If three colors are given: a color scale with the first three colors corresponding to [min, mean, max] values will be used. |
| date      | string  | Specific date to show data for. ISO 8601 format (e.g. "YYYY", "YYYY-MM", "YYYY-MM-DD").<br /><br />Note: Ensure your variable has data available at the specified date using the [Stat Var Explorer](https://datacommons.org/tools/statvar){: target="_blank"}<br /><br />Default: Most recent data available.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| subscribe | string  | Listen for data changes on this event channel. Channel name should match the `publish` name on a control component. Example: [datacommons-slider](./slider.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
{: .doc-table }

### Advanced Configuration

| Name            | Type    | Description                                                                                                                                                      |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiRoot         | string  | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`.                       |
| geoJsonProp     | string  | Optionally specify the property to use to get geojsons.                                                                                                          |
| placeNameProp   | string  | Optionally specify the property to use to get the place names.                                                                                                   |
| showExploreMore | boolean | Include to show "Explore more" link in the footer, which takes the user to Datacommons.org's [visualization tools](https://datacommons.org/tools/map){: target="_blank"}. |
{: .doc-table }

## Examples

### Example 1: Show a population map for the year 2020

A map of population below poverty level in US States in the year 2020.

Code:
{: .example-box-title}
```html
<datacommons-map
  header="Population Below Poverty Level Status in Past Year in States of United States (2020)"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person_BelowPovertyLevelInThePast12Months"
  date="2020"
></datacommons-map>
```
{: .example-box-content}

<datacommons-map
  header="Population Below Poverty Level Status in Past Year in States of United States (2020)"
  parentPlace="country/USA"
  childPlaceType="State"
  variable="Count_Person_BelowPovertyLevelInThePast12Months"
  date="2020"
></datacommons-map>
