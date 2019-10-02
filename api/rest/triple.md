---
layout: default
title: Triple
nav_order: 2
parent: REST
grand_parent: API
---

# Show Triples Associated with Node(s)

Given a list of nodes, return triples which are associated with the specified
node(s).

A knowledge graph can be described as a collection of *triples* which are
3-tuples that take the form *(s, p, o)*. Here, *s* and *o* are nodes in the
graph called the *subject* and *object* respectively, while *p* is the property
label of a directed edge from *s* to *o* (sometimes also called the *predicate*).

**URL** : `/node/triples`

**Method** : `GET`, `POST`

**Auth required** : YES

To get an API key, check [API Key](/api/setup.html) section.

**Required Arguments**:

*   `key`: Your API key.

*   `dcids`: A list of nodes to query, identified by their DCID.

**Optional Arguments**:

*   `limit`: The maximum number of triples per combination of property and type
    associated with nodes linked by that property to fetch, up to *500*.

## GET Request

**Example**

```bash
curl 'https://api.datacommons.org/node/triples?key=API_KEY&dcids=geoId/05&dcids=geoId/06'
```

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/node/triples?key=API_KEY' \
-d '{"dcids": ["geoId/05", "geoId/06"], "limit": 10}'
```

## Success Response

### **Code** : `200 OK`

**Response content example**

```json
{
    "payload": "<payload string>",
}
```

The "`payload string`" is a string encoding of a JSON object keyed by the given
DCID with the value a list of associated triples. The equivalent JSON of the
"`payload string`" is as follows:

```json
{
    "geoId/05": [
        {
            "subjectId": "geoId/05149952600",
            "subjectName": "Census Tract 9526, Yell County, Arkansas",
            "subjectTypes": ["CensusTract"],
            "predicate": "containedInPlace",
            "objectId": "geoId/05",
            "objectName": "Arkansas",
            "objectTypes": ["State"],
            "provenanceId": "dc/sm3m2w3"
        },
        {
            "subjectId": "dc/zxmm47cccwzfg",
            "subjectName": "1022 Scogin Dr, Monticello, Arkansas",
            "subjectTypes": ["PostalAddress"],
            "predicate": "addressRegion",
            "objectId": "geoId/05",
            "objectName": "Arkansas",
            "objectTypes": ["State"],
            "provenanceId": "dc/mzy8we"
        },
        {
            "subjectId": "geoId/05",
            "predicate": "containedInPlace",
            "objectId": "country/USA",
            "objectName": "United States",
            "objectTypes": ["Country"],
            "provenanceId": "dc/sm3m2w3"
        }
    ]
}
```

Each DCID is mapped to a list of triples, where a triple is an object with the
following fields. Note that not all fields are always included in each triple.
<!--- TODO: add link to data model and describe the fields in a Triple --->

*   `subjectId`
*   `subjectName`
*   `subjectTypes`
*   `predicate`
*   `objectId`
*   `objectName`
*   `objectTypes`
*   `provenanceId`

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the data.
For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (DCID not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/triples?key=API_KEY' -d '{"dcids": []}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "must provide DCIDs"
}
```

### **Code**: `401 Unauthorized`

**Request example:** (API key not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/triples'
```

**Response content example**

```json
{
  "code": 16,
  "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API."
}
```
