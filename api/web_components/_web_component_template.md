---
layout: default
title: Web Component Page Template
nav_order: 999
parent: Web Components
grand_parent: API
published: false
permalink: /api/web_components/page_template
---

# TYPE Tiles

One line summary of the component.

Longer details if necessary can go in a short paragraph here. This is where to
document any particular nuances in behavior or to provide special notes for end
users. If there’s any special Data Commons terminology to define (e.g. triples),
that should be done here as well.

<div markdown="span" class="alert alert-warning" role="alert">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    To do some other related, but different thing, see
    [/v1/other/end/point](https://docs.datacommons.org)
</div>

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
<datacommons-TYPE
  places="place_dcid_1 place_dcid_2"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title">
</datacommons-TYPE>
```
{: #multi-place .api-tabcontent}

```html
<datacommons-TYPE
  parentPlace="parent_place_dcid"
  childPlaceType="type"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title">
</datacommons-TYPE>
```
{: #contained-in .api-tabcontent}

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

## Attributes

### Required

| Name                                                   | Type | Description      |
| ------------------------------------------------------ | ---- | ---------------- |
| attribute <br /> <required-tag>Required</required-tag> | type | Description here |
| attribute <br /> <required-tag>Required</required-tag> | type | description here |
{: .doc-table }

### Optional

| Name                                                   | Type | Description      |
| ------------------------------------------------------ | ---- | ---------------- |
| attribute <br /> <optional-tag>Optional</optional-tag> | type | Description here |
| attribute <br /> <optional-tag>Optional</optional-tag> | type | description here |
{: .doc-table }

### Advanced Configuration

| Name                                                   | Type | Description      |
| ------------------------------------------------------ | ---- | ---------------- |
| attribute <br /> <optional-tag>Optional</optional-tag> | type | Description here |
| attribute <br /> <optional-tag>Optional</optional-tag> | type | description here |
{: .doc-table }

## Examples

### Example 1: Description of what we're trying to show

One sentence explanation of details of the example.

Code:
{: .example-box-title}
```html
<datacommons-TYPE
  places="place_dcid_1 place_dcid_2"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title">
</datacommons-TYPE>
```
{: .example-box-content}

<datacommons-TYPE
  places="place_dcid_1 place_dcid_2"
  variables="var_dcid_1 var_dcid_2"
  header="Chart title">
</datacommons-TYPE>
