---
layout: default
title: REST API Page Template
nav_order: 999
parent: REST
grand_parent: API
published: false
---

# /_VERSION_/_ENDPOINT_

One line summary of what it does.

Longer details if necessary can go in a short paragraph here. This is where to document any particular nuances in behavior or to provide special notes for end users. If there’s any special Data Commons terminology to define (e.g. triples), that should be done here as well.

See also:
    To do some other related, but different thing, see [/_VERSION_/_OTHER_END_POINT_](https://docs.datacommons.org/...)


## Request

div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/<var>VERSION</var>/<var>ENDPOINT</var>?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=<var>PARAM1</var>&<var>PRAM2</var>
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/<var>VERSION</var>/<var>ENDPOINT</var>

Header:
X-API-Key: AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI

JSON data:
{
  "<var>q": [
      "<var>NODE_DCID_1</var>",
      "<var>NODE_DCID_2</var>",
      ...
    ],
  "property": "<var>RELATION_EXPRESSION</var>"
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path parameters

| Name                                                | Description                   |
| --------------------------------------------------- | ----------------------------- |
| <var>PARAM1</var> <br /> <required-tag>Required</required-tag> | description of parameter here |
| <var>PARAM2</var> <br /> <required-tag>Required</required-tag> | description of parameter here |
{: .doc-table }

### Query parameters

| Name                                               | Type | Description               |
| -------------------------------------------------- | ---- | ------------------------- |
| key <br /> <required-tag>Required</required-tag>   | string | Your API key. See the [page on authentication](/api/rest/VERSION/index.md#authentication) for a demo key, as well as instructions on how to get your own key. |
| _QUERY_ <br /> <optional-tag>Optional</optional-tag> | type | description of query here |
{: .doc-table }

## Response

The response looks like:

```json
{
  "value": 1234,
  "date": "YYYY-MM-DD",
  "Metadata": {}
}
```
{: .response-signature .scroll}

### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| _FIELD_    | _TYPE_   | description of output here |
{: .doc-table}

## Examples

### Example 1: Description of what we're trying to show

One sentence explanation of details of the example.

Request:
{: .example-box-title}
<pre>
  $ curl --request GET --url \
  'https://api.datacommons.org/<var>VERSION</var>/<var>ENDPOINT</var>/<var>PARAM1</var>/<var>PARAM2</var>?<var>QUERY</var><var>VALUE</var>&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
<pre>
{: .example-box-content .scroll}

Response:
{: .example-box-title}
```json
{
  "date": "2020",
  "value": 331449281,
  "facet": {
    "importName": "USDecennialCensus_RedistrictingRelease",
    "provenanceUrl": "https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html",
    "measurementMethod": "USDecennialCensus"
  }
}
```
{: .example-box-content .scroll}
