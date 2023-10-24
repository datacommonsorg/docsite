---
layout: default
title: Highlight Tile
nav_order: 3
parent: Web Components
grand_parent: API
published: true
permalink: /api/web_components/highlight
---

# Data Commons Highlight Chart Web Component

[Data Commons Web Component](/api/web_components) for highlighting a specific
variable value from a specific variable about a single place.

## Usage

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'single-place')">
    Specific Place
  </button>
</div>

```html
<datacommons-highlight
  header="Title here"
  place="place_dcid"
  variable="variable_dcid"
></datacommons-highlight>
```
{: #single-place .api-tabcontent .api-signature}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name     | Type   | Description                                          |
| -------- | ------ | ---------------------------------------------------- |
| header   | string | Text to show next to the variable value highlighted. |
| place    | type   | Place [DCID](/glossary.html#dcid) to plot.           |
| variable | type   | Variable [DCID](/glossary.html#dcid) to plot.        |
{: .doc-table }

### Optional

| Name | Type   | Description                                                                                                                                                                                                                                                                                 |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| date | string | Specific date to show data for. ISO 8601 format (e.g. "YYYY", "YYYY-MM", "YYYY-MM-DD").<br /><br />Note: Ensure your variable has data available at the specified date using the [Stat Var Explorer](https://datacommons.org/tools/statvar)<br /><br />Default: Most recent data available. |
| unit | string | Unit the variable is measured in.                                                                                                                                                                                                                                                           |
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
<datacommons-highlight
  header="Percentage of US Population that are Internet Users"
  place="country/USA"
  variable="Count_Person_IsInternetUser_PerCapita"
></datacommons-highlight>
```
{: .example-box-content}

<datacommons-highlight
  header="Percentage of US Population that are Internet Users"
  place="country/USA"
  variable="Count_Person_IsInternetUser_PerCapita"
></datacommons-highlight>
