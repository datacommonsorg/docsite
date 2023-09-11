---
layout: default
title: Resolve
nav_order: 2
parent: REST (v2)
grand_parent: API
published: false
permalink: /api/rest/v2/resolve
---

# /v2/resolve

Each entity in Data Commons has an associated `dcid` which is used to refer to it
in other API calls or programs. An important step for a Data Commons user is
identifying the dcids of entities they care about. This API provides a way to
reference and retrieve entities. Users can use common properties or even
descriptive words to find entities.

## Request

<div class="api-tab">
  <button id="get-button" class="api-tablink" onclick="openTab(event, 'GET-request')">
    GET Request
  </button>
  <button id="post-button" class="api-tablink" onclick="openTab(event, 'POST-request')">
    POST Request
  </button>
</div>

<div id="GET-request" class="api-tabcontent api-signature">
https://api.datacommons.org/v2/resolve?key={your_api_key}&nodes={NODE}&property={PROPERTY_EXPRESSION}
</div>

<div id="POST-request" class="api-tabcontent api-signature">
URL:
https://api.datacommons.org/v2/resolve

Header:
X-API-Key: {your_api_key}

JSON Data:
{
"nodes": [
"{NODE_1}",
"{NODE_2}",
...
],
"property": "{PROPERTY_EXPRESSION}"
}

</div>

<script src="/assets/js/syntax_highlighting.js"></script>
<script src="/assets/js/api-doc-tabs.js"></script>

### Query Parameters

| Name                                                  | Type   | Description                                                                                                                                                     |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key <br /> <required-tag>Required</required-tag>      | string | Your API key. See the [page on authentication](/api/rest/v1/getting_started#authentication) for a demo key, as well as instructions on how to get your own key. |
| nodes <br /> <required-tag>Required</required-tag>    | string | The property value of queried entities. This could be the entity name, description or ID.                                                                       |
| property <br /> <required-tag>Required</required-tag> | string | Property expression that represents the relation of the given nodes to the queried entities.                                                                    |

{: .doc-table }
