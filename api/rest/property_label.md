---
layout: default
title: Property Label
nav_order: 3
parent: REST
grand_parent: API
---

# Show Property Labels of Node(s)

Returns the labels of properties defined for the given DCID's

**URL**: `/node/property-labels`

**Method**: `GET`, `POST`

**Auth required**: Optional

**Required Arguments**:

*   `dcids`: A list of nodes to query, identified by their DCID's.

## GET Request

**Example**

```bash
curl 'https://api.datacommons.org/node/property-labels?dcids=geoId/05&dcids=geoId/06'
```

## POST Request

**Examples**

```bash
curl -X POST 'https://api.datacommons.org/node/property-labels' \
-d '{"dcids": ["geoId/05", "geoId/06"]}'
```

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/dfpxsv73/36/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## Success Response

### **Code**: `200 OK`

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
curl -X POST 'https://api.datacommons.org/node/property-labels' \
-d '{"dcids": []}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```
