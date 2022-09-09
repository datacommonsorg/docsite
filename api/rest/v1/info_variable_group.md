---
layout: default
title: Info of a variable group
nav_order: 20
parent: v1 REST
grand_parent: API
published: false
permalink: /api/rest/v1/info/variable-group
---

## /v1/info/variable-group

Get basic information about a [variable group](/api/rest/v1/getting_started#variable-group).

This API returns basic information of a variable group, given the variable grouop's
[DCID](/api/rest/v1/getting_started#dcid). The information provided includes the
display name, a list of child variables with their information, a list of child variable groups
with their information and the number of descendent variables.

<div markdown="span" class="alert alert-info" role="alert" style="color:black; font-size: 0.8em">
   <span class="material-icons md-16">info </span><b>Tip:</b><br />
   Variable group is used in the statistical variable hierarch UI widget as shown in [Statistical Variable Explorer](https://datacommons.org/tools/statvar).
</div>

## Request

GET Request
{: .api-header}

<div class="api-signature">
https://api.datacommons.org/v1/info/variable-group/{VARIABLE_GROUP_DCID}?key={your_api_key}
</div>

<script src="/assets/js/syntax_highlighting.js"></script>

### Path Parameters

| Name                                                             | Description                                                                               |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| VARIABLE_GROUP_DCID <br /> <required-tag>Required</required-tag> | [DCID](/api/rest/v1/getting_started#dcid) of the variable group to query information for. |

{: .doc-table}

### Query Parameters

| Name                                                              | Type            | Description                                                                                                                                                     |
| ----------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>                  | string          | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| constrained_entities <br /> <optional-tag>Required</optional-tag> | Repeated string | Entities that the queried variable group's descendent variables have data for.                                                                                  |

{: .doc-table }

## Response

The response looks like:

```json
{
  "node": "dcid",
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
}
```

{: .response-signature .scroll}

### Response fields

| Name | Type   | Description                                                                                                                                                               |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node | string | [DCID](/api/rest/v1/getting_started#dcid) of the variable group queried.                                                                                                  |
| info | object | Information about the variable group queried. Includes child variables and variable group information, number of descendent variables and all the parent variable groups. |

{: .doc-table}

## Examples

### Example 1: Get information on a single variable group

Get basic information about the variable group of female population (DCID:
`dc/g/Person_Gender-Female`).

Request:
{: .example-box-title}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/info/variable-group/dc/g/Person_Gender-Female?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```

{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
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
```

{: .example-box-content .scroll}
