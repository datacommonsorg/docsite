---
layout: default
title: Python API page template
nav_order: 999
parent: Python
grand_parent: API
published: false
---

# _ENDPOINT_

One line summary of what it does.

Longer details if necessary can go in a short paragraph here. This is where to document any particular nuances in behavior or to provide special notes for end users. If there’s any special Data Commons terminology to define (e.g. triples), that should be done here as well.

See also:
    To do some other related, but different thing, see [_OTHER_ENDPOINT_](link)


## Request methods

The following are the methods available for this endpoint.

| Method | Description | 
|--------|-------------|
|


## _METHOD_NAME_

### Signature

```

```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| key <br /> <required-tag>Required</required-tag> | string | Your API key. See the [section on authentication](/api/rest/v2/index.html#authentication) for details. |
| nodes <br /> <required-tag>Required</required-tag>    | list of strings | Comma-separated list of property values of the nodes to query, e.g. the node name or description. This currently only supports place nodes.
| property <br /> <required-tag>Required</required-tag> | string | An expression that represents the label of the property by which you are identifying the node to query. For example, if you are using a node name for the `nodes` parameter, the expression would be `<-name`. The property must be a terminal property, such as `name` or `description`, not a property that links to other nodes. Note that the expression must end with `->dcid` |

{: .doc-table }

### Response 



The response looks like:

```json
{
  "value": 1234,
  "date": "YYYY-MM-DD",
  "metadata": {}
}
```
{: .response-signature .scroll}

#### Response fields

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| _FIELD_    | _TYPE_   | description of output here |
{: .doc-table}



## Examples

This section contains examples of using `DCGETNAME` to return the names associated with given DCIDs.

> **Note**: Be sure to follow the instructions for for [enabling the Sheets add-on](/api/sheets/index.html#install) before trying these examples.

### Examples

#### Example 1: Description of what we're trying to show

One sentence explanation of details of the example. Use GET or POST request as appropriate.

Request:
{: .example-box-title}
<pre>
  $ curl --request GET --url \
  'https://api.datacommons.org/<var>VERSION</var>/<var>ENDPOINT</var>?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&<var>QUERY</var>=<var>VALUE</var>...'
</pre>
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