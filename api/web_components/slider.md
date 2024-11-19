---
layout: default
title: Slider control
nav_order: 9
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/slider
---

# Data Commons slider Web Component

[Data Commons Web Component](/api/web_components/) for controlling the date in [datacommons-map](./map.md) or 
[datacommons-bar](./bar.md).

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'map-tab')">
    Control a map
  </button>
  <button class="api-tablink" onclick="openTab(event, 'bar-tab')">
    Control a bar chart
  </button>
</div>

```html
<!-- Map being controlled -->
<datacommons-map
  [...other map attributes here]
  subscribe="event-name-here"
></datacommons-map>

<!-- Slider  -->
<datacommons-slider
  publish="event-name-here"
  variable="variable_dcid"
  parentPlace="place_dcid"
  childPlaceType="child_place_type_dcid"
></datacommons-slider>
```
{: #map-tab .api-tabcontent}

```html
<!-- Bar chart listening for date change events on the "dc-bar" channel -->
<datacommons-bar
  header="Population below the poverty line in the US, Russia, and Mexico (${date})"
  variables="sdg/SI_POV_DAY1"
  places="country/USA country/RUS country/MEX"
  subscribe="dc-bar"
  date="HIGHEST_COVERAGE"
>
  <!-- Place slider in the component's footer and publish events on the "dc-bar" channel -->
  <datacommons-slider
    variables="sdg/SI_POV_DAY1"
    places="country/USA country/RUS country/MEX"
    publish="dc-bar"
    slot="footer"
    >
  </datacommons-slider>
</datacommons-bar>
```
{: #bar-tab .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name           | Type   | Description                                                                                                                                                           |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| childPlaceType | string | Child place types of date range. Example: `State`. For a list of available place types, see the [place types page](/place_types.html).<br /><br /><optional-tag>optional</optional-tag> if `dates` is specified.                                          |
| dates          | list   | Set date option range. Example: `"2001 2002 2003"`<br /><br /><optional-tag>optional</optional-tag> if `variable`, `parentPlace`, and `childPlaceType` are specified. |
| parentPlace    | string | Parent place [DCID](/glossary.html#dcid) of date range. Example: `country/USA`.<br /><br /><optional-tag>optional</optional-tag> if `dates` is specified.             |
| publish        | string | Event name to publish on slider change.                                                                                                                               |
| variable       | string | Variable [DCID](/glossary.html#dcid) of date range. Example: `Count_Person`.<br /><br /><optional-tag>optional</optional-tag> if `dates` is specified.                |
{: .doc-table }

### Optional

| Name   | Type   | Description                   |
| ------ | ------ | ----------------------------- |
| header | string | Override default header text. |
| value  | number | Initial slider value.         |
{: .doc-table }

### Advanced Configuration

| Name    | Type   | Description                                                                                                                                |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| apiRoot | string | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`. |
{: .doc-table }

## Examples

### Example 1: Use slider to change dates on a `datacommons-map` web component

Code:
{: .example-box-title}
```html
<!-- Listen for date changes on the "dc-map" channel -->
<datacommons-map
  header="Population"
  parentPlace="country/USA"
  childPlaceType="State"
  subscribe="dc-map"
  variable="Count_Person"
></datacommons-map>

<!-- Publish date changes on the "dc-map" channel  -->
<datacommons-slider
  publish="dc-map"
  variable="Count_Person"
  parentPlace="country/USA"
  childPlaceType="State"
></datacommons-slider>
```
{: .example-box-content}

<!-- Listen for date changes on the "dc-map" channel -->
<datacommons-map
  header="Population"
  parentPlace="country/USA"
  childPlaceType="State"
  subscribe="dc-map"
  variable="Count_Person"
></datacommons-map>

<!-- Publish date changes on the "dc-map" channel  -->
<datacommons-slider
  publish="dc-map"
  variable="Count_Person"
  parentPlace="country/USA"
  childPlaceType="State"
></datacommons-slider>

### Example 2: Use slider to change dates on a `datacommons-bar` web component

Code:
{: .example-box-title}
```html
<!-- Bar chart listening for date change events on the "dc-bar" channel -->
<datacommons-bar
  header="Population below the poverty line in the US, Russia, and Mexico (${date})"
  variables="sdg/SI_POV_DAY1"
  places="country/USA country/RUS country/MEX"
  subscribe="dc-bar"
  date="HIGHEST_COVERAGE"
>
  <!-- Place slider in the component's footer and publish events on the "dc-bar" channel -->
  <datacommons-slider
    variables="sdg/SI_POV_DAY1"
    places="country/USA country/RUS country/MEX"
    publish="dc-bar"
    slot="footer"
    >
  </datacommons-slider>
</datacommons-bar>
```
{: .example-box-content}


<!-- Bar chart listening for date change events on the "dc-bar" channel -->
<datacommons-bar
  header="Population below the poverty line in the US, Russia, and Mexico (${date})"
  variables="sdg/SI_POV_DAY1"
  places="country/USA country/RUS country/MEX"
  subscribe="dc-bar"
  date="HIGHEST_COVERAGE"
>
  <!-- Place slider in the component's footer and publish events on the "dc-bar" channel -->
  <datacommons-slider
    variables="sdg/SI_POV_DAY1"
    places="country/USA country/RUS country/MEX"
    publish="dc-bar"
    slot="footer"
    >
  </datacommons-slider>
</datacommons-bar>
