---
layout: default
title: Bar chart
nav_order: 1
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/bar
---

# Data Commons bar chart Web Component

[Data Commons Web Component](/api/web_components/) for visualizing one or more statistical variables around one or more places on a bar chart.

<!-- TODO: Add header image -->

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'multi-place')">
    Specific Places
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'contained-in')">
    Places in a Parent Place
  </button>
</div>

```html
<datacommons-bar
  header="Populations of USA, India, and China"
  places="country/USA country/IND country/CHN"
  variables="Count_Person"
  maxPlaces="15"
></datacommons-bar>
```
{: #multi-place .api-tabcontent}

```html
<datacommons-bar
  header="Most populous states in the US"
  parentPlace="country/USA"
  childPlaceType="State"
  variables="Count_Person"
  maxPlaces="15"
></datacommons-bar>
```
{: #contained-in .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name           | Type   | Description                                                                                                                                                                                   |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| childPlaceType | string | Child place types to plot. Example: `State`. For a list of available place types, see the [place types page](/place_types.html).<br /><optional-tag>Optional</optional-tag> if `places` is specified.                                                                           |
| header         | string | Chart title.                                                                                                                                                                                  |
| parentPlace    | string | Parent place [DCID](/glossary.html#dcid) to plot. Example: `country/USA`. <br /> <optional-tag>Optional</optional-tag> if `places` is specified.                                                                     |
| places         | list   | Places [DCID](/glossary.html#dcid)s to plot, as a space separated list of strings. Example: `"geoId/12 geoId/13"`. <br /> <optional-tag>Optional</optional-tag> if `childPlaceType` and `parentPlace` are specified. |
| variables      | list   | Variable [DCID](/glossary.html#dcid)(s) to plot, as a space separated list of strings. Example: `"Count_Person Count_Farm"`.                                                                                         |
{: .doc-table }

### Optional

| Name       | Type    | Description                                                                                                                                                                                                                                                                                                                                                             |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| barHeight  | number  | Bar height (in px) for horizontal charts.                                                                                                                                                                                                                                                                                                                               |
| colors     | list    | Specify custom color for each variable. Pass in colors in the same order as variables.<br /><br />Values should follow CSS specification (keywords, rgb, rgba, hsl, #hex). Separate multiple values with spaces, e.g., `"#ff0000 #00ff00 #0000ff"`. Make sure individual colors have no spaces. For example, use `rgba(255,0,0,0.3)` instead of `rgba(255, 0, 0, 0.3)`. |
| disableEntityLink     | boolean    | Include to disable entity (place) links in the x-axis. Default: `false` (links are enabled) |

| horizontal | boolean | Include to draw bars horizontally instead of vertically.                                                                                                                                                                                                                                                                                                                |
| lollipop   | boolean | Include to draw lollipops instead of bars.                                                                                                                                                                                                                                                                                                                              |
| maxPlaces  | number  | Maximum _number_ of child places to plot. Default: `7`.                                                                                                                                                                                                                                                                                                                 |
| maxVariables  | number  | Maximum _number_ of varibales to plot. Default: show all variables.                                                                                                                                                                                                                                                                                                                 |
| sort       | string  | Bar chart sort order. <br/><br/>Options: <br /> - `ascending` (ascending by the variable's value)<br /> - `descending` (descending by variable's value)<br /> - `ascendingPopulation` (ascending by the place's population)<br /> -`descendingPopulation` (descending by the place's population)<br /><br />Default: `descendingPopulation`                   |
| stacked    | boolean | Include to draw as stacked bar chart instead of grouped chart.                                                                                                                                                                                                                                                                                                          |
| subscribe    | string  | Listen for data changes on this event channel. Channel name should match the `publish` name on a control component. Example: [datacommons-slider](./slider.md)                                                                                                                                                                                                          |
{: .doc-table }

### Advanced Configuration

| Name                | Type   | Description                                                                                                                                                                                                                                                                                |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| apiRoot         | string  | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`. |
| defaultVariableName | string | To be used with `variableNameRegex`. If specified and no variable name is extracted out with the regex, use this as the variable name. e.g., if the variableNameRegex is "(.*?)(?=:)", and the defaultVariableName is "Total", for a variable named "variable 1", it will become "Total". |
| placeNameProp   | string  | Optionally specify the property to use to get the place names.                                                                             |
| showExploreMore | boolean | Include to show "Explore more" link in the footer, which takes the user to Datacommons.org's [visualization tools](https://datacommons.org/tools/timeline){: target="_blank"}.                                        |
| variableNameRegex   | string | Optionally specify regex to use to extract out variable name. e.g., if the variableNameRegex is "(.*?)(?=:)", only the part before a ":" will be used for variable names. So "variable 1: test" will become "variable 1".                                                                  |
| yAxisMargin | number | Set size (in px) of y-axis' margin to fit the axis label text. Default: 60px. |
{: .doc-table }

## Examples

### Example 1: A bar chart of population for states in the US

Code:
{: .example-box-title}
```html
<datacommons-bar
  header="Population of US States"
  parentPlace="country/USA"
  childPlaceType="State"
  variables="Count_Person"
></datacommons-bar>
```
{: .example-box-content}

<div>
  <datacommons-bar
    header="Population of US States"
    parentPlace="country/USA"
    childPlaceType="State"
    variables="Count_Person"
  ></datacommons-bar>
</div>
{: .web-component-container}

### Example 2: A bar chart of population for specific US states

Code:
{: .example-box-title}
```html
<datacommons-bar
  header="Population of US States"
  variables="Count_Person"
  places="geoId/01 geoId/02"
></datacommons-bar>
```
{: .example-box-content}

<div>
<datacommons-bar
  header="Population of US States"
  variables="Count_Person"
  places="geoId/01 geoId/02"
></datacommons-bar>
</div>
{: .web-component-container}

### Example 3: A stacked bar chart of population by gender for specific US states

Code:
{: .example-box-title}
```html
<datacommons-bar
  header="Population of US States"
  variables="Count_Person"
  places="geoId/01 geoId/02"
  stacked
></datacommons-bar>
```
{: .example-box-content}

<div>
<datacommons-bar
  header="Population of US States"
  variables="Count_Person_Male Count_Person_Female"
  places="geoId/01 geoId/02"
  stacked
></datacommons-bar>
</div>
{: .web-component-container}

### Example 4: A horizontal, stacked bar chart of median income for specific US states

Code:
{: .example-box-title}
```html
<datacommons-bar
  header="Median income by gender"
  variables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
  places="geoId/01 geoId/02 geoId/04 geoId/20 geoId/21 geoId/22 geoId/23 geoId/24 geoId/25"
  stacked
  horizontal
  sort="descending"
></datacommons-bar>
```
{: .example-box-content}

<div>
<datacommons-bar
  header="Median income by gender"
  variables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
  places="geoId/01 geoId/02 geoId/04 geoId/20 geoId/21 geoId/22 geoId/23 geoId/24 geoId/25"
  stacked
  horizontal
  sort="descending"
></datacommons-bar>
</div>
{: .web-component-container}

### Example 5: A lollipop chart of population for states in the US

Code:
{: .example-box-title}
```html
<datacommons-bar
  header="Population of US States"
  parentPlace="country/USA"
  childPlaceType="State"
  variables="Count_Person"
  lollipop
></datacommons-bar>
```
{: .example-box-content}

<div>
<datacommons-bar
  header="Population of US States"
  parentPlace="country/USA"
  childPlaceType="State"
  variables="Count_Person"
  lollipop
></datacommons-bar>
</div>
{: .web-component-container}
