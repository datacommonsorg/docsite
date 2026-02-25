---
layout: default
title: Line chart
nav_order: 4
parent: Embed data and visualizations in your own website
published: true
permalink: /api/web_components/line
---

# Data Commons line chart Web Component

[Data Commons Web Component](/api/web_components/) for visualizing one or more statistical variables about a number of places as a line chart.

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
<datacommons-line
  places="place_dcid_1 place_dcid_2"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title"
></datacommons-line>
```
{: #multi-place .api-tabcontent}

```html
<datacommons-line
  parentPlace="parent_place_dcid"
  childPlaceType="type"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title"
></datacommons-line>
```
{: #contained-in .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name           | Type   | Description                                                                                                                                                                                                          |
| -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| childPlaceType | string | Child place types to plot. Example: `State`. For a list of available place types, see the [place types page](/place_types.html).<br /> <optional-tag>Optional</optional-tag> if `places` is specified.                                                                                                  |
| header         | string | Chart title.                                                                                                                                                                                                         |
| parentPlace    | string | Parent place [DCID](/glossary.html#dcid) to plot. Example: `country/USA`. <br /> <optional-tag>Optional</optional-tag> if `places` is specified.                                                                     |
| places         | list   | Places [DCID](/glossary.html#dcid)s to plot, as a space separated list of strings. Example: `"geoId/12 geoId/13"`. <br /> <optional-tag>Optional</optional-tag> if `childPlaceType` and `parentPlace` are specified. |
| variables      | list   | Variable [DCID](/glossary.html#dcid)(s) to plot, as a space separated list of strings. Example: `"Count_Person Count_Farm"`.                                                                                         |
{: .doc-table }

### Optional

| Name      | Type   | Description                                                                                                                                                                                                                                                                                                                                                             |
| --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors    | list   | Specify custom color for each variable. Pass in colors in the same order as variables.<br /><br />Values should follow CSS specification (keywords, rgb, rgba, hsl, #hex). Separate multiple values with spaces, e.g., `"#ff0000 #00ff00 #0000ff"`. Make sure individual colors have no spaces. For example, use `rgba(255,0,0,0.3)` instead of `rgba(255, 0, 0, 0.3)`. |
| timeScale | string | One of `"year"`, `"month"`, or `"day"`. If provided, the x-axis will draw a tick mark and label at that time scale. |
| startDate | string | The earliest date to show on the chart, in ISO-8601 format. |
| endDate | string | The latest date to show on the chart, in ISO-8601 format. |
{: .doc-table }

### Advanced Configuration

| Name                | Type    | Description                                                                                                                                                                                                                                                                               |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiRoot             | string  | Domain to make data fetch API calls from. Used primarily for fetching data from custom DCs.<br /><br />Default: `https://datacommons.org`.                                                                                                                                                |
| defaultVariableName | string  | To be used with `variableNameRegex`. If specified and no variable name is extracted out with the regex, use this as the variable name. e.g., if the variableNameRegex is "(.*?)(?=:)", and the defaultVariableName is "Total", for a variable named "variable 1", it will become "Total". |
| placeNameProp       | string  | Optionally specify the property to use to get the place names.                                                                                                                                                                                                                            |
| showExploreMore     | boolean | Include to show "Explore more" link in the footer, which takes the user to Datacommons.org's [visualization tools](https://datacommons.org/tools/visualization){: target="_blank"}.                                                                                                                          |
| variableNameRegex   | string  | Optionally specify regex to use to extract out variable name. e.g., if the variableNameRegex is "(.*?)(?=:)", only the part before a ":" will be used for variable names. So "variable 1: test" will become "variable 1".                                                                 |
{: .doc-table }

## Examples

### Example 1: Plot a single variable over time for a single place

Show the number of people under poverty level in the US over time.

Code:
{: .example-box-title}
```html
<datacommons-line
  header="Population Below Poverty Level Status in United States"
  places="country/USA"
  variables="Count_Person_BelowPovertyLevelInThePast12Months"
></datacommons-line>
```
{: .example-box-content}

<datacommons-line
  header="Population Below Poverty Level Status in United States"
  places="country/USA"
  variables="Count_Person_BelowPovertyLevelInThePast12Months"
></datacommons-line>

### Example 2: Plot a single variable over time for multiple places

Code:
{: .example-box-title}
```html
<datacommons-line
  header="Population for USA, India, and China"
  places="country/USA country/IND country/CHN"
  variables="Count_Person"
></datacommons-line>
```
{: .example-box-content}

<datacommons-line
  header="Population for USA, India, and China"
  places="country/USA country/IND country/CHN"
  variables="Count_Person"
></datacommons-line>

### Example 3: Plot a single variable for all child places in a parent place

Show population for all counties in Alaska, USA.

Code:
{: .example-box-title}
```html
<datacommons-line
  header="Population of counties in Alaska"
  parentPlace="geoId/02"
  childPlaceType="County"
  variables="Count_Person"
></datacommons-line>
```
{: .example-box-content}

<datacommons-line
  header="Population of counties in Alaska"
  parentPlace="geoId/02"
  childPlaceType="County"
  variables="Count_Person"
></datacommons-line>

### Example 4: Plot multiple variables for a single place

Show number of households without internet and number of households without health insurance for California, USA.

Code:
{: .example-box-title}
```html
<datacommons-line
  header="Population by gender of California"
  places="geoId/06"
  variables="Count_Household_InternetWithoutSubscription Count_Household_NoHealthInsurance"
></datacommons-line>
```
{: .example-box-content}

<datacommons-line
  header="Population by gender of California"
  places="geoId/06"
  variables="Count_Household_InternetWithoutSubscription Count_Household_NoHealthInsurance"
></datacommons-line>
