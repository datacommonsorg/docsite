---
layout: default
title: Resolve entities
nav_order: 4
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---
{: .no_toc}
# Resolve

The Resolve API returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph.
Each entity in Data Commons has an associated `DCID` which is used to refer to it
in other API calls or programs. An important step for a Data Commons developer is to
identify the DCIDs of entities they care about. This API searches for an entry in the
Data Commons knowledge graph and returns the DCIDs of matches. You can use
common properties or even descriptive words to find entities.

For example, you could query for "San Francisco, CA" or "San Francisco" to find
that its DCID is `geoId/0667000`. You can also provide the type of entity
(country, city, state, etc.) to disambiguate between candidates (for example, Georgia the country vs. Georgia
the US state).

Note that you can only resolve entities by some terminal properties. You cannot resolve properties that represent linked entities with incoming or outgoing arc relationships. For that, you need to use the [Node](node.md) API. For example, if you wanted to get all the DCIDs of entities that are related to a given entity by the `containedInPlace` property (say, all states in the United States), use the Node API.

> **Note**: Currently, this endpoint only supports [place](/glossary.html#place) entities.

* TOC
{:toc}


## Request methods

The following are the methods available for the `resolve` endpoint.

| Method | Description | 
|--------|-------------|
| [fetch](#fetch) | Resolve entities by using a [relation expression](/api/rest/v2/index.html#relation-expressions) for the property or properties to search on. |
| [fetch_dcids_by_name](#fetch_dcids_by_name) | Look up DCIDs of entities by name. |
| [fetch_dcids_by_wikidata_id(#fetch_dcids_by_wikidata_id)] Look up DCIDs of entities by Wikidata ID. |
| [fetch_dcids_by_coordinates](#fetch_dcids_by_coordinates) | Look up DCIDs of entities by geographical coordinates. |

## Response

All request methods return a `ResolveResponse` object. It looks like this:

The response looks like:

<pre>
{
  "entities": [
    {
      "node": "<var>NODE_1</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_1</var>",
          "dominantType": "<var>TYPE_OF_DCID_1</var>"
        },
      ]
    },
    {
      "node": "<var>NODE_2</var>",
      "candidates": [
        {
          "dcid": "<var>DCID_2</var>",
          "dominantType": "<var>TYPE_OF_DCID_2</var>"
        },
      ]
    },
    ...
  ]
}
</pre>
{: .response-signature .scroll}

### Response fields

| Name        | Type   |   Description                       |
|-------------|--------|-------------------------------------|
| node | string | The property value or description provided. |
| candidates | list | DCIDs matching the description you provided.
| dominantType | string | Optional field which, where present, disambiguates between multiple results. |
{: .doc-table}

### Response property methods

Remove if there aren't any.

| Method | Description | 
|--------|-------------|
| nextToken | Extract the `nextToken` value from the response. See [Pagination](#pagination) below for more details |
{: .doc-table}

## method

brief description. Have one such H2 section for every request method.

### Signature

```python
signature with just the parameter names, not defaults
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| name <br/> Use this for required parameters: <required-tag>Required</required-tag> |  |   |
| name <br/> Use this for optional parameters <optional-tag>Optional</optional-tag> |   |   |
{: .doc-table }

### Examples

{: #fetch_ex1}
#### Example 1: Generic description of functionality

More detailed description of the specific example, including what it's actually achieving, and how it's constructed. 

Request:
{: .example-box-title}

```python
example request
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```json
example response. Use the to_json() method to get nice formatting 
```
{: .example-box-content .scroll}
