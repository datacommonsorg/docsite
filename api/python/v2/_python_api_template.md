---
layout: default
title: Python API page template
nav_order: 999
parent: Python
grand_parent: API
published: false
---

{: .no_toc}
# _ENDPOINT_

One line summary of what it does. Can mostly copy from the REST V2 API docs.

Longer details if necessary can go in a short paragraph here. This is where to document any particular nuances in behavior or to provide special notes for end users. If there’s any special Data Commons terminology, link to the data_model and/or glossary docs rather than repeating the info here. 

* TOC
{:toc}

## Request methods

The following are the methods available for this endpoint. 

| Method | Description | 
|--------|-------------|
| [method](link to section describing it) | Description |

## Response

All request methods return a `FooResponse` object. It looks like this:

<pre>
use to_json to get a nicely formatted response example
</pre>
{: .response-signature .scroll}

### Response fields

| Name      | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
|       |  |  |

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
signature with just the parameter names, not defaults. Put the defaults in the description.
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
