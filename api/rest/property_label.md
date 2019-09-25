---
layout: default
title: Property Label
nav_order: 3
parent: REST
grand_parent: API
---

# Show Node Property Labels

Returns the labels of properties defined for the given DCID's

**URL** : `/node/property-labels`

**Method** : `GET`, `POST`

**Auth required** : YES

To get an API key, check [API Key](https://datacommonsorg.github.io/docsite/api/api_key.html) section.

**Required Arguments**:

*   `key`: Your API key.
*   `dcids`: A list of nodes to query, identified by their DCID's.

## GET Request

**Example**

```bash
curl 'https://api.datacommons.org/node/property-labels?key=API_KEY&dcids=geoId/05&dcids=geoId/06'
```

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/node/property-labels?key=API_KEY' \
-d '{"dcids": ["geoId/05", "geoId/06"]}'
```

## Success Response

### **Code** : `200 OK`

**Response content example**

```json
{
    "payload": "payload_string",
}
```

The equivalent JSON of "payload_string" is as follows:

```json
{
    "geoId/06": {
        "inLabels": [
            "addressLocality"
        ],
        "outLabels": [
            "containedInPlace",
            "geoId",
            "kmlCoordinates"
        ]
    },
    "geoId/08": {
        "inLabels": [
            "addressLocality"
        ],
        "outLabels": [
            "kmlCoordinates"
        ]
    },
}
```

For each node, `inLabels` contains labels directed towards the node while
`outLabels` contains labels directed away from the node.

<!--- TODO: add link to the data model --->

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the data.
For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (DCID not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/property-labels?key=API_KEY' \
-d '{"dcids": []}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```

### **Code**: `401 Unauthorized`

**Request example:** (API key not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/property-labels'
```

**Response content example**

```json
{
  "code": 16,
  "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API."
}
```