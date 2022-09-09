---
layout: default
title: Info of a variable group
nav_exclude: true
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/bulk/info/variable-group
---

# /v1/bulk/info/variable-group

Get basic information about multiple [variable groups](/glossary.html#variable-group).

This API returns basic information on muliple variable groups, given the variable groups'
[DCIDs](/glossary.html#dcid). The information is provided per variable group, and includes the
display name, a list of child variables with their information, a list of child variable groups
with their information and the number of descendent variables. If variable groups DCIDs are not provided, then
all the variable group information will be retrieved.

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>Tip:</b><br />
   Variable group is used in the statistical variable hierarchy UI widget as shown in [Statistical Variable Explorer](https://datacommons.org/tools/statvar).
</div>

<div markdown="span" class="alert alert-warning" role="alert" style="color:black; font-size: 0.8em">
    <span class="material-icons md-16">info </span><b>See Also:</b><br />
    For querying a single variable group and a simpler output, see the [simple version](/api/rest/v1/info/variable-group) of this endpoint.
</div>

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET Request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST Request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature"><div class="scroll">
https://api.datacommons.org/v1/bulk/info/variable-group?nodes={variable_group_dcid_1}&nodes={variable_group_dcid_2}&key={your_api_key}
</div></div>

<div id="POST-request" class="api-tabcontent api-signature"><div class="scroll">
URL:
https://api.datacommons.org/v1/bulk/info/variable-group

Header:
X-API-Key: {your_api_key}

JSON Data:

```json
{
  "nodes":
  [
    "{variable_group_dcid_1}",
    "{variable_group_dcid_2}",
    ...
  ]
}
```

</div></div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Path Parameters

This endpoint has no path parameters.

### Query Parameters

| Name                                                              | Type            | Description                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>                  | string          | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key.                                             |
| nodes <br /> <optional-tag>Optional</optional-tag>                | string          | [DCIDs](/glossary.html#dcid) of the variable groups to query information for.                                                                                                                               |
| constrained_entities <br /> <optional-tag>Optional</optional-tag> | Repeated string | [DCIDs](/glossary.html#dcid) of entities to filter by. If provided, the results will be filtered to only include the queried variable group's descendent variables that have data for the queried entities. |
{: .doc-table }

## Response

The response looks like:

```json
{
  "data":
  [
    {
      "node": "dcid1",
      "info": {
        "absoluteName": "variable group name",
        "childStatVars": [
          {
            "id": "variable_id",
            "displayName": "variable_name",
            "searchNames": [
              "search name"
            ],
            "definition": "variable_definition",
            "hasData": true
          },
          ...
        ],
        "childStatVarGroups": [
          {
            "id": "child_variable_group_id",
            "specializedEntity": "property name",
            "displayName": "variable_name",
            "descendentStatVarCount": 20
          },
          ...
        ],
        "descendentStatVarCount": 100,
        "parentStatVarGroups": [
          "parent_group_id"
        ]
      }
    },
    {
      "node": "dcid2",
      "info": {...}
    },
    ...
  ]

}
```
{: .response-signature .scroll}

### Response fields

| Name | Type   | Description                                                                                                                                                               |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node | string | [DCID](/glossary.html#dcid) of the variable group queried.                                                                                                  |
| info | object | Information about the variable group queried. Includes child variables and variable group information, number of descendent variables and all the parent variable groups. |
{: .doc-table}

## Examples

### Example 1: Get information for all variable groups in Data Commons

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/bulk/info/variable-group?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
{
  "data": [
    {
      "node": "dc/g/Person_Gender-Female",
      "info": {
        "absoluteName": "Person With Gender = Female",
        "childStatVars": [
          {
            "id": "LifeExpectancy_Person_Female",
            "displayName": "Life expectancy at birth, female (years)",
            "searchNames": [
              "Life Expectancy of Person With Gender is Female"
            ],
            "definition": "mp=lifeExpectancy,pt=Person,gender=Female",
            "hasData": true
          },
          ...
        ],
        "childStatVarGroups": [
          {
            "id": "dc/g/Person_ActivityDuration_Gender-Female",
            "specializedEntity": "Activity Duration",
            "displayName": "Person With Activity Duration, Gender = Female",
            "descendentStatVarCount": 101
          },
          ...
        ],
        "descendentStatVarCount": 8949,
        "parentStatVarGroups": [
          "dc/g/Person_Gender"
        ]
      }
    }
    ...
  ]
}
```
{: .example-box-content .scroll}
